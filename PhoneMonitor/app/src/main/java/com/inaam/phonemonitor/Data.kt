package com.inaam.phonemonitor

import android.accessibilityservice.AccessibilityServiceInfo
import android.app.ActivityManager
import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.pm.PackageInfo
import android.provider.Settings
import android.view.accessibility.AccessibilityManager
import com.google.android.gms.safetynet.SafetyNet
import com.google.android.gms.tasks.Tasks
import java.util.concurrent.TimeUnit
import android.app.AppOpsManager
import android.app.usage.NetworkStats
import android.app.usage.NetworkStatsManager
import android.app.usage.StorageStatsManager
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.os.BatteryManager
import android.os.Build
import android.os.Environment
import android.os.PowerManager
import android.os.Process
import android.os.StatFs
import android.os.storage.StorageManager
import java.io.File
import java.util.Calendar

/** Everything we know about one installed app. */
class AppRow(
    val pkg: String,
    val label: String,
    val uid: Int,
    val system: Boolean,
    /** System app with no launcher icon (hidden unless "show system apps" is on). */
    val hiddenSystem: Boolean,
    /** Force-stopped / never launched: cannot run until the user opens it. */
    val stopped: Boolean,
    /** Asks to be started automatically when the phone boots. */
    val autoStart: Boolean,
) {
    var fgTime = 0L          // on-screen time, last 24h
    var bgTime = 0L          // foreground-service (background work) time, last 24h
    var lastUsed = 0L
    var runningNow = false   // has an active background service right now
    var sleeping = false     // put in standby by Android
    var unrestricted = false // exempt from battery optimisation
    var appBytes = 0L
    var dataBytes = 0L
    var cacheBytes = 0L

    // --- security check ---
    var version = ""
    var targetSdk = 0
    var fromStore = false          // installed by Play Store / Galaxy Store etc.
    var installer: String? = null
    var hiddenIcon = false         // user-installed app with no launcher icon
    var granted: Set<String> = emptySet() // sensitive things the app is allowed to do
    var accessibility = false      // has an Accessibility service switched on
    var deviceAdmin = false
    var notifListener = false
    var harmful = false            // flagged by Google Play Protect
        set(v) { field = v; cache = null }
    private var cache: List<Finding>? = null

    val totalBytes get() = appBytes + dataBytes

    /** Reasons this app deserves a look, strongest first. */
    val findings: List<Finding> get() = cache ?: build().also { cache = it }

    private fun build(): List<Finding> {
        val f = ArrayList<Finding>()
        if (harmful) f.add(Finding(100, "Google Play Protect marks this app as harmful", "گوگل پلے پروٹیکٹ اس ایپ کو نقصان دہ قرار دیتا ہے"))
        if (!system) {
            if (accessibility) f.add(Finding(40, "Accessibility is ON: it can read your screen and tap for you", "Accessibility آن ہے: یہ آپ کی اسکرین پڑھ سکتی اور خود بٹن دبا سکتی ہے"))
            if (deviceAdmin) f.add(Finding(30, "Device admin: can lock the phone and resist uninstalling", "ڈیوائس ایڈمن: فون لاک کر سکتی ہے اور ان انسٹال ہونے سے بچ سکتی ہے"))
            if (hiddenIcon) f.add(Finding(25, "Hidden app: no icon on the home screen", "چھپی ہوئی ایپ: ہوم اسکرین پر آئیکن نہیں"))
            if (!fromStore) f.add(Finding(20, "Not installed from an app store", "ایپ اسٹور سے انسٹال نہیں ہوئی"))
            if (notifListener) f.add(Finding(20, "Reads all notifications (including OTP codes)", "تمام نوٹیفکیشن پڑھتی ہے (OTP کوڈ سمیت)"))
            if (targetSdk in 1..22) f.add(Finding(20, "Made for very old Android (skips permission prompts)", "بہت پرانے اینڈرائیڈ کے لیے بنی ہے (اجازت پوچھے بغیر چلتی ہے)"))
            if ("sms" in granted) f.add(Finding(15, "Can read and send SMS", "ایس ایم ایس پڑھ اور بھیج سکتی ہے"))
            if ("overlay" in granted) f.add(Finding(10, "Can draw over other apps", "دوسری ایپس کے اوپر اسکرین دکھا سکتی ہے"))
            if ("install" in granted) f.add(Finding(10, "Can install other apps", "دوسری ایپس انسٹال کر سکتی ہے"))
            if ("bgloc" in granted) f.add(Finding(10, "Sees your location even when closed", "بند ہونے پر بھی آپ کی لوکیشن دیکھتی ہے"))
            if ("calls" in granted) f.add(Finding(5, "Call history", "کال ہسٹری"))
            if ("contacts" in granted) f.add(Finding(5, "Contacts", "رابطے"))
            if ("location" in granted) f.add(Finding(5, "Location", "لوکیشن"))
            if ("camera" in granted) f.add(Finding(5, "Camera", "کیمرہ"))
            if ("mic" in granted) f.add(Finding(5, "Microphone", "مائیکروفون"))
            if ("allfiles" in granted) f.add(Finding(5, "All files on the phone", "فون کی تمام فائلیں"))
        }
        return f
    }

    /** 0..100. Store apps cannot reach "suspicious" on permissions alone; only Google's verdict does that. */
    val risk: Int get() {
        val sum = findings.sumOf { it.points }.coerceAtMost(100)
        return if (fromStore && !harmful) sum.coerceAtMost(59) else sum
    }

    /** 2 = suspicious, 1 = powerful access, 0 = fine */
    val riskLevel get() = if (risk >= 60) 2 else if (risk >= 30) 1 else 0

    /** 0 = running now, 1 = can run in background, 2 = sleeping, 3 = stopped */
    val state get() = when {
        stopped -> 3
        runningNow -> 0
        sleeping -> 2
        else -> 1
    }
}

class Finding(val points: Int, val en: String, val ur: String) {
    val text get() = tr(en, ur)
}

/** What Google Play Protect (the phone's built-in malware scanner) reports. */
class Protect {
    var available = false
    var enabled = false
    var lastScan = 0L
    var harmful: Set<String> = emptySet()
}

class NetRow(val label: String, val pkg: String?, val app: AppRow?) {
    var wifi = 0L
    var mobile = 0L
    var background = 0L
    val total get() = wifi + mobile
}

class RamInfo(val total: Long, val avail: Long, val low: Boolean, val cached: Long, val swapTotal: Long, val swapFree: Long) {
    val used get() = total - avail
}

class BatteryInfo(
    val level: Int, val charging: Boolean, val plug: Int, val tempC: Float,
    val volt: Float, val health: Int, val currentMa: Int, val tech: String,
)

class Collector(private val c: Context) {
    private val pm = c.packageManager
    private val labels = HashMap<String, String>()

    fun hasUsageAccess(): Boolean {
        val ops = c.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        @Suppress("DEPRECATION")
        val mode = if (Build.VERSION.SDK_INT >= 29)
            ops.unsafeCheckOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, Process.myUid(), c.packageName)
        else ops.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, Process.myUid(), c.packageName)
        return mode == AppOpsManager.MODE_ALLOWED
    }

    /** Installed apps with their static flags. Fast: no special access needed. */
    fun loadApps(): List<AppRow> {
        val launchable = HashSet<String>()
        val main = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER)
        for (r in pm.queryIntentActivities(main, 0)) launchable.add(r.activityInfo.packageName)

        val power = c.getSystemService(Context.POWER_SERVICE) as PowerManager

        // Apps holding the three most abused kinds of special access.
        val a11y = HashSet<String>()
        val admins = HashSet<String>()
        val listeners = HashSet<String>()
        try {
            val am = c.getSystemService(Context.ACCESSIBILITY_SERVICE) as AccessibilityManager
            for (s in am.getEnabledAccessibilityServiceList(AccessibilityServiceInfo.FEEDBACK_ALL_MASK)) {
                s.resolveInfo?.serviceInfo?.packageName?.let { a11y.add(it) }
            }
        } catch (e: Exception) {
        }
        try {
            val dpm = c.getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
            dpm.activeAdmins?.forEach { admins.add(it.packageName) }
        } catch (e: Exception) {
        }
        try {
            Settings.Secure.getString(c.contentResolver, "enabled_notification_listeners")?.split(':')?.forEach { s ->
                ComponentName.unflattenFromString(s)?.let { listeners.add(it.packageName) }
            }
        } catch (e: Exception) {
        }
        val out = ArrayList<AppRow>()
        for (pi in pm.getInstalledPackages(PackageManager.GET_PERMISSIONS)) {
            val ai = pi.applicationInfo ?: continue
            if (pi.packageName == c.packageName) continue
            val label = labels.getOrPut(pi.packageName) { ai.loadLabel(pm).toString() }
            val sys = ai.flags and ApplicationInfo.FLAG_SYSTEM != 0
            val row = AppRow(
                pi.packageName, label, ai.uid, sys,
                hiddenSystem = sys && pi.packageName !in launchable,
                stopped = ai.flags and ApplicationInfo.FLAG_STOPPED != 0,
                autoStart = pi.requestedPermissions?.contains("android.permission.RECEIVE_BOOT_COMPLETED") == true,
            )
            row.unrestricted = try { power.isIgnoringBatteryOptimizations(pi.packageName) } catch (e: Exception) { false }
            row.version = pi.versionName ?: ""
            row.targetSdk = ai.targetSdkVersion
            row.hiddenIcon = !sys && pi.packageName !in launchable
            row.accessibility = pi.packageName in a11y
            row.deviceAdmin = pi.packageName in admins
            row.notifListener = pi.packageName in listeners
            row.installer = try {
                @Suppress("DEPRECATION")
                if (Build.VERSION.SDK_INT >= 30) pm.getInstallSourceInfo(pi.packageName).installingPackageName
                else pm.getInstallerPackageName(pi.packageName)
            } catch (e: Exception) { null }
            row.fromStore = row.installer in STORES
            val g = HashSet<String>()
            val perms = pi.requestedPermissions
            val flags = pi.requestedPermissionsFlags
            if (perms != null) for (i in perms.indices) {
                val name = perms[i].removePrefix("android.permission.")
                // these two are switched on in Settings, so "requested" is the best signal we can read
                if (name == "SYSTEM_ALERT_WINDOW") g.add("overlay")
                if (name == "REQUEST_INSTALL_PACKAGES") g.add("install")
                if (name == "MANAGE_EXTERNAL_STORAGE") g.add("allfiles")
                if (flags == null || i >= flags.size || flags[i] and PackageInfo.REQUESTED_PERMISSION_GRANTED == 0) continue
                when (name) {
                    "READ_SMS", "RECEIVE_SMS", "SEND_SMS" -> g.add("sms")
                    "READ_CALL_LOG", "WRITE_CALL_LOG", "PROCESS_OUTGOING_CALLS" -> g.add("calls")
                    "READ_CONTACTS" -> g.add("contacts")
                    "ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION" -> g.add("location")
                    "ACCESS_BACKGROUND_LOCATION" -> g.add("bgloc")
                    "CAMERA" -> g.add("camera")
                    "RECORD_AUDIO" -> g.add("mic")
                }
            }
            row.granted = g
            out.add(row)
        }
        return out
    }

    /**
     * Ask Google Play Protect which installed apps it considers harmful. Blocking; call off the
     * main thread. If Google Play services are missing or refuse, [Protect.available] stays false.
     */
    fun loadProtect(): Protect {
        val p = Protect()
        try {
            val client = SafetyNet.getClient(c)
            p.enabled = Tasks.await(client.isVerifyAppsEnabled, 8, TimeUnit.SECONDS).isVerifyAppsEnabled
            p.available = true
            if (p.enabled) {
                val r = Tasks.await(client.listHarmfulApps(), 15, TimeUnit.SECONDS)
                p.lastScan = r.lastScanTimeMs
                p.harmful = r.harmfulAppsList.map { it.apkPackageName }.toSet()
            }
        } catch (e: Throwable) {
        }
        return p
    }

    /** Screen time, background-service time, what is running right now. Needs usage access. */
    fun loadUsage(apps: List<AppRow>) {
        val usm = c.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val now = System.currentTimeMillis()
        val day = 24L * 3600 * 1000
        val stats = usm.queryAndAggregateUsageStats(now - day, now)

        // Replay recent events to find services that started and have not stopped yet.
        val services = HashMap<String, HashSet<String>>()
        try {
            val ev = usm.queryEvents(now - 2 * day, now)
            val e = UsageEvents.Event()
            while (ev.hasNextEvent()) {
                ev.getNextEvent(e)
                when (e.eventType) {
                    19 /* FOREGROUND_SERVICE_START */ ->
                        services.getOrPut(e.packageName) { HashSet() }.add(e.className ?: "")
                    20 /* FOREGROUND_SERVICE_STOP */ ->
                        services[e.packageName]?.remove(e.className ?: "")
                    26, 27 /* DEVICE_SHUTDOWN, DEVICE_STARTUP */ -> services.clear()
                }
            }
        } catch (e: Exception) {
        }

        for (a in apps) {
            val s = stats[a.pkg]
            if (s != null) {
                a.fgTime = s.totalTimeInForeground
                a.lastUsed = s.lastTimeUsed
                if (Build.VERSION.SDK_INT >= 29) {
                    a.bgTime = s.totalTimeForegroundServiceUsed
                    a.lastUsed = maxOf(a.lastUsed, s.lastTimeForegroundServiceUsed)
                }
            }
            a.runningNow = !a.stopped && services[a.pkg]?.isNotEmpty() == true
            a.sleeping = try { usm.isAppInactive(a.pkg) } catch (e: Exception) { false }
        }
    }

    /** App size, user data and cache per app. Needs usage access. */
    fun loadStorage(apps: List<AppRow>) {
        val ssm = c.getSystemService(Context.STORAGE_STATS_SERVICE) as StorageStatsManager
        val user = Process.myUserHandle()
        for (a in apps) {
            try {
                val st = ssm.queryStatsForPackage(StorageManager.UUID_DEFAULT, a.pkg, user)
                a.appBytes = st.appBytes
                a.dataBytes = st.dataBytes
                a.cacheBytes = st.cacheBytes
            } catch (e: Exception) {
            }
        }
    }

    /** Wi-Fi / mobile data per app. period: 0 = today, 1 = 7 days, 2 = 30 days. Needs usage access. */
    fun loadNet(apps: List<AppRow>, period: Int): List<NetRow> {
        val nsm = c.getSystemService(Context.NETWORK_STATS_SERVICE) as NetworkStatsManager
        val end = System.currentTimeMillis()
        val start = when (period) {
            0 -> Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, 0); set(Calendar.MINUTE, 0); set(Calendar.SECOND, 0); set(Calendar.MILLISECOND, 0)
            }.timeInMillis
            1 -> end - 7L * 24 * 3600 * 1000
            else -> end - 30L * 24 * 3600 * 1000
        }
        val perUid = HashMap<Int, LongArray>() // wifi, mobile, background
        for (type in intArrayOf(1 /* TYPE_WIFI */, 0 /* TYPE_MOBILE */)) {
            try {
                val ns = nsm.querySummary(type, null, start, end) ?: continue
                val b = NetworkStats.Bucket()
                while (ns.hasNextBucket()) {
                    ns.getNextBucket(b)
                    val n = b.rxBytes + b.txBytes
                    val a = perUid.getOrPut(b.uid) { LongArray(3) }
                    a[if (type == 1) 0 else 1] += n
                    if (b.state != NetworkStats.Bucket.STATE_FOREGROUND) a[2] += n
                }
                ns.close()
            } catch (e: Exception) {
            }
        }
        val byUid = HashMap<Int, ArrayList<AppRow>>()
        for (a in apps) byUid.getOrPut(a.uid) { ArrayList() }.add(a)
        val out = ArrayList<NetRow>()
        for ((uid, v) in perUid) {
            if (v[0] + v[1] <= 0) continue
            val owners = byUid[uid]
            val first = owners?.minByOrNull { if (it.hiddenSystem) 1 else 0 }
            val label = when {
                uid == 1000 -> tr("Android System", "اینڈرائیڈ سسٹم")
                uid == -4 -> tr("Removed apps", "حذف شدہ ایپس")
                uid == -5 -> tr("Hotspot / Tethering", "ہاٹ اسپاٹ / ٹیدرنگ")
                first != null -> if (owners.size > 1) "${first.label} +${owners.size - 1}" else first.label
                uid == 0 -> tr("Android OS", "اینڈرائیڈ او ایس")
                else -> "UID $uid"
            }
            out.add(NetRow(label, first?.pkg, if (uid == 1000) null else first).apply {
                wifi = v[0]; mobile = v[1]; background = v[2]
            })
        }
        out.sortByDescending { it.total }
        return out
    }

    fun ram(): RamInfo {
        val am = c.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        val mi = ActivityManager.MemoryInfo()
        am.getMemoryInfo(mi)
        var cached = 0L; var swapT = 0L; var swapF = 0L
        try {
            File("/proc/meminfo").forEachLine { line ->
                val kb = line.substringAfter(':').trim().substringBefore(' ').toLongOrNull() ?: 0L
                when {
                    line.startsWith("Cached:") -> cached = kb * 1024
                    line.startsWith("SwapTotal:") -> swapT = kb * 1024
                    line.startsWith("SwapFree:") -> swapF = kb * 1024
                }
            }
        } catch (e: Exception) {
        }
        return RamInfo(mi.totalMem, mi.availMem, mi.lowMemory, cached, swapT, swapF)
    }

    /** total, free bytes of internal storage */
    fun storage(): LongArray {
        val s = StatFs(Environment.getDataDirectory().path)
        return longArrayOf(s.totalBytes, s.availableBytes)
    }

    fun battery(): BatteryInfo {
        val i = c.registerReceiver(null, IntentFilter(Intent.ACTION_BATTERY_CHANGED))
        val bm = c.getSystemService(Context.BATTERY_SERVICE) as BatteryManager
        val level = i?.let {
            val l = it.getIntExtra(BatteryManager.EXTRA_LEVEL, -1)
            val s = it.getIntExtra(BatteryManager.EXTRA_SCALE, 100)
            if (l >= 0 && s > 0) l * 100 / s else -1
        } ?: -1
        val status = i?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1
        var cur = try { bm.getIntProperty(BatteryManager.BATTERY_PROPERTY_CURRENT_NOW) } catch (e: Exception) { 0 }
        if (cur == Int.MIN_VALUE) cur = 0
        if (kotlin.math.abs(cur) > 20000) cur /= 1000 // most phones report µA, some mA
        return BatteryInfo(
            level,
            status == BatteryManager.BATTERY_STATUS_CHARGING || status == BatteryManager.BATTERY_STATUS_FULL,
            i?.getIntExtra(BatteryManager.EXTRA_PLUGGED, 0) ?: 0,
            (i?.getIntExtra(BatteryManager.EXTRA_TEMPERATURE, 0) ?: 0) / 10f,
            (i?.getIntExtra(BatteryManager.EXTRA_VOLTAGE, 0) ?: 0) / 1000f,
            i?.getIntExtra(BatteryManager.EXTRA_HEALTH, 0) ?: 0,
            kotlin.math.abs(cur),
            i?.getStringExtra(BatteryManager.EXTRA_TECHNOLOGY) ?: "",
        )
    }
}

private val STORES = setOf(
    "com.android.vending", "com.sec.android.app.samsungapps", "com.huawei.appmarket", "com.xiaomi.mipicks",
    "com.xiaomi.market", "com.amazon.venezia", "com.oppo.market", "com.heytap.market", "com.vivo.appstore",
    "com.bbk.appstore", "com.transsion.phoenix", "com.hihonor.appmarket",
)

var urdu = false
fun tr(en: String, ur: String) = if (urdu) ur else en
