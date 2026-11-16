package com.inaam.phonemonitor

import android.app.ActivityManager
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

    val totalBytes get() = appBytes + dataBytes

    /** 0 = running now, 1 = can run in background, 2 = sleeping, 3 = stopped */
    val state get() = when {
        stopped -> 3
        runningNow -> 0
        sleeping -> 2
        else -> 1
    }
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
            out.add(row)
        }
        return out
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

var urdu = false
fun tr(en: String, ur: String) = if (urdu) ur else en
