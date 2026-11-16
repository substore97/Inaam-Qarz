package com.inaam.phonemonitor

import android.app.Activity
import android.app.ActivityManager
import android.app.AlertDialog
import android.content.Context
import android.content.Intent
import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.Typeface
import android.graphics.drawable.Drawable
import android.graphics.drawable.GradientDrawable
import android.net.Uri
import android.os.BatteryManager
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.provider.Settings
import android.text.format.Formatter
import android.util.LruCache
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.FrameLayout
import android.widget.HorizontalScrollView
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.ListView
import android.widget.ScrollView
import android.widget.TextView
import android.widget.Toast
import java.util.concurrent.Executors

private const val BG = 0xFF0E1320.toInt()
private const val CARD = 0xFF18203A.toInt()
private const val TEXT = 0xFFF1F4FB.toInt()
private const val DIM = 0xFF9AA6C4.toInt()
private const val BLUE = 0xFF4F8CFF.toInt()
private const val GREEN = 0xFF34D399.toInt()
private const val ORANGE = 0xFFFBBF24.toInt()
private const val RED = 0xFFF87171.toInt()
private const val PURPLE = 0xFFA78BFA.toInt()
private const val GREY = 0xFF64708F.toInt()

class Row(
    val pkg: String?, val title: String, val sub: String, val value: String,
    val frac: Float, val color: Int, val app: AppRow?,
)

class BarView(c: Context) : View(c) {
    var frac = 0f
    var color = BLUE
    private val p = Paint(Paint.ANTI_ALIAS_FLAG)
    override fun onDraw(cv: Canvas) {
        val h = height.toFloat(); val w = width.toFloat(); val r = h / 2
        p.color = 0x22FFFFFF
        cv.drawRoundRect(0f, 0f, w, h, r, r, p)
        val f = w * frac.coerceIn(0f, 1f)
        if (f <= 0f) return
        p.color = color
        val fw = maxOf(f, h)
        if (layoutDirection == LAYOUT_DIRECTION_RTL) cv.drawRoundRect(w - fw, 0f, w, h, r, r, p)
        else cv.drawRoundRect(0f, 0f, fw, h, r, r, p)
    }
}

class MainActivity : Activity() {
    private val io = Executors.newSingleThreadExecutor()
    private val iconIo = Executors.newFixedThreadPool(2)
    private val ui = Handler(Looper.getMainLooper())
    private val icons = LruCache<String, Drawable>(300)
    private lateinit var data: Collector

    private var tab = 0
    private var showSystem = false
    private var period = 0
    private var loading = false
    private var hasAccess = false
    private var apps: List<AppRow> = emptyList()
    private var net: List<NetRow> = emptyList()
    private var loadId = 0

    private lateinit var content: FrameLayout
    private var overviewBox: LinearLayout? = null
    private val ticker = object : Runnable {
        override fun run() {
            if (tab == 0) fillOverview()
            ui.postDelayed(this, 3000)
        }
    }

    override fun onCreate(b: Bundle?) {
        super.onCreate(b)
        data = Collector(applicationContext)
        val prefs = getPreferences(MODE_PRIVATE)
        urdu = prefs.getBoolean("urdu", false)
        showSystem = prefs.getBoolean("sys", false)
        tab = b?.getInt("tab") ?: 0
        buildShell()
    }

    override fun onSaveInstanceState(out: Bundle) {
        super.onSaveInstanceState(out)
        out.putInt("tab", tab)
    }

    override fun onResume() {
        super.onResume()
        reload()
        ui.removeCallbacks(ticker)
        ui.postDelayed(ticker, 3000)
    }

    override fun onPause() {
        super.onPause()
        ui.removeCallbacks(ticker)
    }

    // ---------------------------------------------------------------- loading

    private fun reload() {
        val id = ++loadId
        loading = true
        val p = period
        io.execute {
            val access = data.hasUsageAccess()
            val list = data.loadApps()
            post(id) { hasAccess = access; apps = list; render() }
            if (access) {
                try { data.loadUsage(list) } catch (e: Exception) { }
                post(id) { render() }
                val n = try { data.loadNet(list, p) } catch (e: Exception) { emptyList() }
                post(id) { net = n; render() }
                try { data.loadStorage(list) } catch (e: Exception) { }
            }
            post(id) { loading = false; render() }
        }
    }

    private fun reloadNet() {
        val id = loadId
        val p = period
        val list = apps
        io.execute {
            val n = try { data.loadNet(list, p) } catch (e: Exception) { emptyList() }
            post(id) { net = n; render() }
        }
    }

    private fun post(id: Int, f: () -> Unit) = ui.post { if (id == loadId && !isDestroyed) f() }

    // ---------------------------------------------------------------- shell

    private fun dp(v: Int) = (v * resources.displayMetrics.density + 0.5f).toInt()

    private fun text(s: String, size: Float, color: Int = TEXT, bold: Boolean = false) = TextView(this).apply {
        text = s; textSize = size; setTextColor(color)
        if (bold) typeface = Typeface.DEFAULT_BOLD
        textAlignment = View.TEXT_ALIGNMENT_VIEW_START
    }

    private fun round(color: Int, radius: Int) = GradientDrawable().apply { setColor(color); cornerRadius = dp(radius).toFloat() }

    private fun chip(s: String, selected: Boolean, accent: Int = BLUE, onClick: () -> Unit) = text(s, 14f, if (selected) BG else TEXT, selected).apply {
        background = round(if (selected) accent else CARD, 20)
        setPadding(dp(14), dp(8), dp(14), dp(8))
        setOnClickListener { onClick() }
        layoutParams = LinearLayout.LayoutParams(-2, -2).apply { marginEnd = dp(8) }
    }

    private fun button(s: String, color: Int, onClick: () -> Unit) = text(s, 14f, BG, true).apply {
        background = round(color, 12)
        gravity = Gravity.CENTER
        setPadding(dp(14), dp(10), dp(14), dp(10))
        setOnClickListener { onClick() }
        layoutParams = LinearLayout.LayoutParams(-1, -2).apply { topMargin = dp(10) }
    }

    private fun buildShell() {
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(BG)
            layoutDirection = if (urdu) View.LAYOUT_DIRECTION_RTL else View.LAYOUT_DIRECTION_LTR
            fitsSystemWindows = true
        }
        val bar = LinearLayout(this).apply {
            gravity = Gravity.CENTER_VERTICAL
            setPadding(dp(16), dp(14), dp(16), dp(8))
        }
        bar.addView(text(tr("Phone Monitor", "فون مانیٹر"), 22f, TEXT, true), LinearLayout.LayoutParams(0, -2, 1f))
        bar.addView(chip(if (urdu) "English" else "اردو", false) {
            urdu = !urdu
            getPreferences(MODE_PRIVATE).edit().putBoolean("urdu", urdu).apply()
            buildShell()
            reloadNet() // special row names are translated
        })
        bar.addView(chip("⟳", false) { reload(); render() }.apply { (layoutParams as LinearLayout.LayoutParams).marginEnd = 0 })
        root.addView(bar)

        val names = arrayOf(
            tr("Overview", "خلاصہ"), tr("Background", "بیک گراؤنڈ"), tr("Storage", "میموری"),
            tr("Battery", "بیٹری"), tr("Data", "ڈیٹا"), tr("Cache", "کیش"),
        )
        val tabs = LinearLayout(this).apply { setPadding(dp(16), dp(4), dp(8), dp(10)) }
        names.forEachIndexed { i, n -> tabs.addView(chip(n, i == tab) { tab = i; buildShell() }) }
        root.addView(HorizontalScrollView(this).apply {
            isHorizontalScrollBarEnabled = false
            addView(tabs)
            post { tabs.getChildAt(tab)?.let { c -> scrollTo(if (urdu) c.right - width + dp(16) else c.left - dp(16), 0) } }
        })

        content = FrameLayout(this)
        root.addView(content, LinearLayout.LayoutParams(-1, 0, 1f))
        setContentView(root)
        render()
    }

    private fun render() {
        overviewBox = null
        content.removeAllViews()
        if (tab == 0) {
            val box = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL; setPadding(dp(16), 0, dp(16), dp(24)) }
            overviewBox = box
            content.addView(ScrollView(this).apply { addView(box) })
            fillOverview()
        } else renderList()
    }

    // ---------------------------------------------------------------- formatting

    private fun size(b: Long) = Formatter.formatShortFileSize(this, b)

    private fun dur(ms: Long): String {
        val m = ms / 60000; val h = m / 60
        return when {
            ms <= 0 -> tr("0 min", "0 منٹ")
            h > 0 -> tr("${h}h ${m % 60}m", "$h گھنٹے ${m % 60} منٹ")
            m > 0 -> tr("$m min", "$m منٹ")
            else -> tr("<1 min", "1 منٹ سے کم")
        }
    }

    private fun ago(t: Long): String {
        if (t <= 0) return tr("not used recently", "حال میں استعمال نہیں ہوئی")
        val d = System.currentTimeMillis() - t
        return if (d < 60000) tr("just now", "ابھی ابھی") else tr("${dur(d)} ago", "${dur(d)} پہلے")
    }

    private fun stateName(s: Int) = when (s) {
        0 -> tr("Running now", "ابھی چل رہی ہے")
        1 -> tr("Can run in background", "بیک گراؤنڈ میں چل سکتی ہے")
        2 -> tr("Sleeping", "سو رہی ہے")
        else -> tr("Stopped", "بند ہے")
    }

    private fun stateColor(s: Int) = when (s) { 0 -> RED; 1 -> ORANGE; 2 -> BLUE; else -> GREY }

    private fun visible() = if (showSystem) apps else apps.filter { !it.hiddenSystem }

    // ---------------------------------------------------------------- overview

    private fun card(parent: LinearLayout, title: String, accent: Int): LinearLayout {
        val c = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            background = round(CARD, 16)
            setPadding(dp(16), dp(14), dp(16), dp(14))
        }
        c.addView(text(title, 13f, accent, true))
        parent.addView(c, LinearLayout.LayoutParams(-1, -2).apply { bottomMargin = dp(12) })
        return c
    }

    private fun big(parent: LinearLayout, s: String) = parent.addView(text(s, 24f, TEXT, true).apply { setPadding(0, dp(4), 0, dp(6)) })

    private fun bar(parent: LinearLayout, frac: Float, color: Int) = parent.addView(
        BarView(this).apply { this.frac = frac; this.color = color },
        LinearLayout.LayoutParams(-1, dp(8)).apply { bottomMargin = dp(8) },
    )

    private fun kv(parent: LinearLayout, k: String, v: String) {
        val l = LinearLayout(this).apply { setPadding(0, dp(3), 0, dp(3)) }
        l.addView(text(k, 14f, DIM), LinearLayout.LayoutParams(0, -2, 1f))
        l.addView(text(v, 14f, TEXT).apply { textAlignment = View.TEXT_ALIGNMENT_VIEW_END; setPadding(dp(12), 0, 0, 0) })
        parent.addView(l)
    }

    private fun accessCard(parent: LinearLayout) {
        val c = card(parent, tr("Permission needed", "اجازت درکار ہے"), ORANGE)
        c.addView(text(tr(
            "To show which apps use background time, storage, cache and data, Android requires \"Usage access\". Tap the button, find Phone Monitor in the list and turn it on. Nothing leaves your phone.",
            "یہ دکھانے کے لیے کہ کون سی ایپ بیک گراؤنڈ، میموری، کیش اور ڈیٹا استعمال کر رہی ہے، اینڈرائیڈ کو \"Usage access\" کی اجازت چاہیے۔ بٹن دبائیں، فہرست میں Phone Monitor تلاش کریں اور اسے آن کر دیں۔ آپ کا کوئی ڈیٹا فون سے باہر نہیں جاتا۔",
        ), 14f, TEXT).apply { setPadding(0, dp(6), 0, 0) })
        c.addView(button(tr("Grant access", "اجازت دیں"), ORANGE) {
            open(Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS, Uri.parse("package:$packageName")), Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS))
        })
        c.addView(text(tr(
            "If the phone says \"App was denied access\" or the switch is grey: tap the button below, then tap ⋮ (three dots, top right) → \"Allow restricted settings\" and confirm with your PIN/fingerprint. Then press \"Grant access\" again.",
            "اگر فون \"App was denied access\" کہے یا سوئچ دھندلا ہو: نیچے والا بٹن دبائیں، پھر اوپر دائیں کونے میں ⋮ (تین نقطے) ← \"Allow restricted settings\" دبائیں اور پن/فنگر پرنٹ سے تصدیق کریں۔ اس کے بعد دوبارہ \"اجازت دیں\" دبائیں۔",
        ), 12f, DIM).apply { setPadding(0, dp(12), 0, 0) })
        c.addView(button(tr("Access denied? Open App info", "اجازت نہیں مل رہی؟ ایپ انفو کھولیں"), BLUE) { appSettings(packageName) })
    }

    private fun fillOverview() {
        val box = overviewBox ?: return
        box.removeAllViews()
        if (loading) box.addView(text(tr("Scanning apps…", "ایپس اسکین ہو رہی ہیں…"), 13f, DIM).apply { setPadding(dp(4), 0, 0, dp(8)) })
        if (!hasAccess && !loading) accessCard(box)

        val r = data.ram()
        val ramFrac = r.used.toFloat() / r.total
        card(box, tr("RAM", "ریم"), BLUE).let { c ->
            big(c, "${size(r.used)} / ${size(r.total)}")
            bar(c, ramFrac, if (r.low || ramFrac > 0.85f) RED else BLUE)
            kv(c, tr("In use", "استعمال میں"), "${(ramFrac * 100).toInt()}%")
            kv(c, tr("Available", "دستیاب"), size(r.avail))
            kv(c, tr("Cached by system", "سسٹم کیش"), size(r.cached))
            if (r.swapTotal > 0) kv(c, tr("Swap / ZRAM used", "سویپ / زیڈ ریم استعمال"), "${size(r.swapTotal - r.swapFree)} / ${size(r.swapTotal)}")
            kv(c, tr("Memory pressure", "ریم پر دباؤ"), if (r.low) tr("LOW — phone may lag", "کم — فون سست ہو سکتا ہے") else tr("Normal", "نارمل"))
            c.addView(text(tr(
                "Android does not let apps read other apps' exact RAM. The button opens the system screen that lists RAM per app (Developer options must be on).",
                "اینڈرائیڈ کسی ایپ کو دوسری ایپس کی درست ریم پڑھنے نہیں دیتا۔ یہ بٹن سسٹم کی وہ اسکرین کھولتا ہے جہاں ہر ایپ کی ریم نظر آتی ہے (ڈیولپر آپشنز آن ہونا ضروری ہے)۔",
            ), 12f, DIM).apply { setPadding(0, dp(6), 0, 0) })
            c.addView(button(tr("Per-app RAM (system screen)", "ہر ایپ کی ریم (سسٹم اسکرین)"), BLUE) { openRunningServices() })
        }

        val b = data.battery()
        card(box, tr("Battery", "بیٹری"), GREEN).let { c -> batteryCard(c, b) }

        val st = data.storage()
        val v = visible()
        card(box, tr("Internal storage", "اندرونی میموری"), PURPLE).let { c ->
            val used = st[0] - st[1]
            big(c, "${size(used)} / ${size(st[0])}")
            bar(c, used.toFloat() / st[0], PURPLE)
            kv(c, tr("Free", "خالی"), size(st[1]))
            if (hasAccess) {
                kv(c, tr("Total cache (all apps)", "کل کیش (تمام ایپس)"), size(apps.sumOf { it.cacheBytes }))
                v.maxByOrNull { it.totalBytes }?.takeIf { it.totalBytes > 0 }?.let { kv(c, tr("Biggest app", "سب سے بڑی ایپ"), "${it.label} • ${size(it.totalBytes)}") }
                v.maxByOrNull { it.cacheBytes }?.takeIf { it.cacheBytes > 0 }?.let { kv(c, tr("Most cache", "سب سے زیادہ کیش"), "${it.label} • ${size(it.cacheBytes)}") }
            }
        }

        card(box, tr("Background activity", "بیک گراؤنڈ سرگرمی"), RED).let { c ->
            val running = v.count { it.state == 0 }
            if (hasAccess) {
                big(c, tr("$running running now", "$running ابھی چل رہی ہیں"))
                kv(c, tr("Can run in background", "بیک گراؤنڈ میں چل سکتی ہیں"), v.count { it.state == 1 }.toString())
                kv(c, tr("Sleeping", "سو رہی ہیں"), v.count { it.state == 2 }.toString())
            }
            kv(c, tr("Stopped", "بند"), v.count { it.state == 3 }.toString())
            kv(c, tr("Auto-start at boot", "فون آن ہوتے ہی خود چلنے والی"), v.count { it.autoStart && !it.stopped }.toString())
            kv(c, tr("No battery restriction", "بیٹری کی پابندی سے آزاد"), v.count { it.unrestricted }.toString())
            if (hasAccess) v.maxByOrNull { it.bgTime }?.takeIf { it.bgTime > 0 }?.let {
                kv(c, tr("Most background (24h)", "سب سے زیادہ بیک گراؤنڈ (24 گھنٹے)"), "${it.label} • ${dur(it.bgTime)}")
            }
        }

        if (hasAccess) card(box, periodName() + " — " + tr("Data usage", "ڈیٹا کا استعمال"), ORANGE).let { c ->
            big(c, size(net.sumOf { it.total }))
            kv(c, tr("Wi-Fi", "وائی فائی"), size(net.sumOf { it.wifi }))
            kv(c, tr("Mobile data", "موبائل ڈیٹا"), size(net.sumOf { it.mobile }))
            kv(c, tr("Used in background", "بیک گراؤنڈ میں استعمال"), size(net.sumOf { it.background }))
            net.firstOrNull()?.let { kv(c, tr("Top app", "سب سے زیادہ ڈیٹا"), "${it.label} • ${size(it.total)}") }
        }
    }

    private fun periodName() = when (period) {
        0 -> tr("Today", "آج"); 1 -> tr("7 days", "7 دن"); else -> tr("30 days", "30 دن")
    }

    private fun batteryCard(c: LinearLayout, b: BatteryInfo) {
        big(c, "${b.level}%")
        bar(c, b.level / 100f, if (b.level <= 20) RED else GREEN)
        kv(c, tr("Status", "حالت"), if (b.charging) tr("Charging", "چارج ہو رہی ہے") + when (b.plug) {
            BatteryManager.BATTERY_PLUGGED_AC -> " (AC)"; BatteryManager.BATTERY_PLUGGED_USB -> " (USB)"
            BatteryManager.BATTERY_PLUGGED_WIRELESS -> tr(" (Wireless)", " (وائرلیس)"); else -> ""
        } else tr("On battery", "بیٹری پر"))
        if (b.currentMa > 0) kv(c, if (b.charging) tr("Charging current", "چارجنگ کرنٹ") else tr("Power draw right now", "اس وقت بجلی کا خرچ"), "${b.currentMa} mA")
        kv(c, tr("Temperature", "درجہ حرارت"), "${b.tempC} °C" + if (b.tempC >= 42f) tr(" — HOT", " — گرم") else "")
        kv(c, tr("Voltage", "وولٹیج"), "${b.volt} V")
        kv(c, tr("Health", "صحت"), when (b.health) {
            BatteryManager.BATTERY_HEALTH_GOOD -> tr("Good", "اچھی")
            BatteryManager.BATTERY_HEALTH_OVERHEAT -> tr("Overheating", "زیادہ گرم")
            BatteryManager.BATTERY_HEALTH_DEAD -> tr("Dead", "خراب")
            BatteryManager.BATTERY_HEALTH_OVER_VOLTAGE -> tr("Over voltage", "زیادہ وولٹیج")
            BatteryManager.BATTERY_HEALTH_COLD -> tr("Cold", "ٹھنڈی")
            else -> tr("Unknown", "نامعلوم")
        })
        if (b.tech.isNotEmpty()) kv(c, tr("Type", "قسم"), b.tech)
    }

    // ---------------------------------------------------------------- list tabs

    private fun renderList() {
        val head = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL; setPadding(dp(16), 0, dp(16), dp(4)) }
        if (!hasAccess && !loading) accessCard(head)
        val v = visible()
        val rows = ArrayList<Row>()
        var note = ""
        var summary = ""

        when (tab) {
            1 -> {
                summary = if (hasAccess) tr(
                    "${v.count { it.state == 0 }} running now • ${v.count { it.state == 1 }} can run • ${v.count { it.state == 2 }} sleeping • ${v.count { it.state == 3 }} stopped",
                    "${v.count { it.state == 0 }} ابھی چل رہی ہیں • ${v.count { it.state == 1 }} چل سکتی ہیں • ${v.count { it.state == 2 }} سو رہی ہیں • ${v.count { it.state == 3 }} بند",
                ) else tr("${v.count { !it.stopped }} apps can run in background", "${v.count { !it.stopped }} ایپس بیک گراؤنڈ میں چل سکتی ہیں")
                note = tr(
                    "\"Running now\" = the app has an active background service. Time shown is background work in the last 24 hours. Tap an app to stop it.",
                    "\"ابھی چل رہی ہے\" کا مطلب ہے ایپ کی بیک گراؤنڈ سروس اس وقت فعال ہے۔ دکھایا گیا وقت پچھلے 24 گھنٹوں کا بیک گراؤنڈ کام ہے۔ روکنے کے لیے ایپ پر ٹیپ کریں۔",
                )
                head.addView(button(tr("Free RAM now (quick stop all)", "ابھی ریم خالی کریں (سب کو فوری روکیں)"), BLUE) { quickStopAll() }
                    .apply { (layoutParams as LinearLayout.LayoutParams).apply { topMargin = 0; bottomMargin = dp(12) } })
                val max = (v.maxOfOrNull { it.bgTime } ?: 0L).coerceAtLeast(1)
                for (a in v.sortedWith(compareBy<AppRow> { it.state }.thenByDescending { it.bgTime }.thenByDescending { it.lastUsed })) {
                    val flags = ArrayList<String>()
                    flags.add(stateName(a.state))
                    if (a.autoStart && !a.stopped) flags.add(tr("auto-start", "خود چلتی ہے"))
                    if (a.unrestricted) flags.add(tr("no battery limit", "بیٹری پابندی نہیں"))
                    rows.add(Row(a.pkg, a.label, flags.joinToString(" • "), if (a.bgTime > 0) dur(a.bgTime) else "", a.bgTime.toFloat() / max, stateColor(a.state), a))
                }
            }
            2 -> {
                summary = tr("Apps use ${size(v.sumOf { it.totalBytes })}", "ایپس ${size(v.sumOf { it.totalBytes })} استعمال کر رہی ہیں")
                val max = (v.maxOfOrNull { it.totalBytes } ?: 0L).coerceAtLeast(1)
                for (a in v.sortedByDescending { it.totalBytes }) rows.add(Row(
                    a.pkg, a.label,
                    tr("App ${size(a.appBytes)} • Data ${size(a.dataBytes - a.cacheBytes)} • Cache ${size(a.cacheBytes)}",
                        "ایپ ${size(a.appBytes)} • ڈیٹا ${size(a.dataBytes - a.cacheBytes)} • کیش ${size(a.cacheBytes)}"),
                    size(a.totalBytes), a.totalBytes.toFloat() / max, PURPLE, a,
                ))
            }
            3 -> {
                val c = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL; background = round(CARD, 16); setPadding(dp(16), dp(14), dp(16), dp(14)) }
                batteryCard(c, data.battery())
                c.addView(button(tr("Exact battery % per app (system screen)", "ہر ایپ کا درست بیٹری % (سسٹم اسکرین)"), GREEN) {
                    open(Intent(Intent.ACTION_POWER_USAGE_SUMMARY), Intent(Settings.ACTION_BATTERY_SAVER_SETTINGS))
                })
                head.addView(c, LinearLayout.LayoutParams(-1, -2).apply { bottomMargin = dp(12) })
                summary = tr("Most active apps — last 24 hours", "سب سے زیادہ فعال ایپس — پچھلے 24 گھنٹے")
                note = tr(
                    "Android hides exact per-app battery % from other apps, so this ranking is an estimate from how long each app was on screen and working in the background.",
                    "اینڈرائیڈ ہر ایپ کا درست بیٹری % دوسری ایپس سے چھپاتا ہے، اس لیے یہ درجہ بندی ایک اندازہ ہے جو ہر ایپ کے اسکرین پر اور بیک گراؤنڈ میں چلنے کے وقت سے بنایا گیا ہے۔",
                )
                val act = v.filter { it.fgTime + it.bgTime > 0 }.sortedByDescending { it.fgTime + it.bgTime }
                val max = (act.firstOrNull()?.let { it.fgTime + it.bgTime } ?: 0L).coerceAtLeast(1)
                for (a in act) rows.add(Row(
                    a.pkg, a.label,
                    tr("Screen ${dur(a.fgTime)} • Background ${dur(a.bgTime)}", "اسکرین ${dur(a.fgTime)} • بیک گراؤنڈ ${dur(a.bgTime)}"),
                    dur(a.fgTime + a.bgTime), (a.fgTime + a.bgTime).toFloat() / max, if (a.bgTime > a.fgTime) RED else GREEN, a,
                ))
            }
            4 -> {
                val chips = LinearLayout(this).apply { setPadding(0, 0, 0, dp(10)) }
                for (i in 0..2) {
                    val name = when (i) { 0 -> tr("Today", "آج"); 1 -> tr("7 days", "7 دن"); else -> tr("30 days", "30 دن") }
                    chips.addView(chip(name, i == period, ORANGE) { period = i; render(); reloadNet() })
                }
                head.addView(chips)
                summary = tr(
                    "Total ${size(net.sumOf { it.total })} • Wi-Fi ${size(net.sumOf { it.wifi })} • Mobile ${size(net.sumOf { it.mobile })}",
                    "کل ${size(net.sumOf { it.total })} • وائی فائی ${size(net.sumOf { it.wifi })} • موبائل ${size(net.sumOf { it.mobile })}",
                )
                val max = (net.firstOrNull()?.total ?: 0L).coerceAtLeast(1)
                for (n in net) rows.add(Row(
                    n.pkg, n.label,
                    tr("Wi-Fi ${size(n.wifi)} • Mobile ${size(n.mobile)} • Background ${size(n.background)}",
                        "وائی فائی ${size(n.wifi)} • موبائل ${size(n.mobile)} • بیک گراؤنڈ ${size(n.background)}"),
                    size(n.total), n.total.toFloat() / max, ORANGE, n.app,
                ))
            }
            5 -> {
                val withCache = v.filter { it.cacheBytes > 0 }.sortedByDescending { it.cacheBytes }
                summary = tr("Total cache: ${size(withCache.sumOf { it.cacheBytes })}", "کل کیش: ${size(withCache.sumOf { it.cacheBytes })}")
                note = tr(
                    "Tap an app → its page opens → Storage → \"Clear cache\". Only press \"Clear cache\", never \"Clear data\". Biggest cache is at the top.",
                    "ایپ پر ٹیپ کریں ← اس کا صفحہ کھلے گا ← Storage ← \"Clear cache\" دبائیں۔ صرف \"Clear cache\" دبائیں، \"Clear data\" کبھی نہیں۔ سب سے زیادہ کیش والی ایپ سب سے اوپر ہے۔",
                )
                head.addView(button(tr("Open phone storage cleaner", "فون کا اسٹوریج کلینر کھولیں"), GREEN) {
                    open(Intent("android.os.storage.action.MANAGE_STORAGE"), Intent(Settings.ACTION_INTERNAL_STORAGE_SETTINGS))
                }.apply { (layoutParams as LinearLayout.LayoutParams).apply { topMargin = 0; bottomMargin = dp(12) } })
                val max = (withCache.firstOrNull()?.cacheBytes ?: 0L).coerceAtLeast(1)
                for (a in withCache) rows.add(Row(
                    a.pkg, a.label, tr("Tap to clear", "صاف کرنے کے لیے ٹیپ کریں"),
                    size(a.cacheBytes), a.cacheBytes.toFloat() / max, GREEN, a,
                ))
            }
        }

        head.addView(text(summary, 16f, TEXT, true))
        if (note.isNotEmpty()) head.addView(text(note, 12f, DIM).apply { setPadding(0, dp(4), 0, 0) })
        if (tab != 4) head.addView(chip((if (showSystem) "✓ " else "") + tr("Show system apps", "سسٹم ایپس دکھائیں"), showSystem) {
            showSystem = !showSystem
            getPreferences(MODE_PRIVATE).edit().putBoolean("sys", showSystem).apply()
            render()
        }.apply { layoutParams = LinearLayout.LayoutParams(-2, -2).apply { topMargin = dp(10); bottomMargin = dp(4) } })
        if (rows.isEmpty()) head.addView(text(
            if (loading) tr("Loading…", "لوڈ ہو رہا ہے…") else tr("Nothing to show yet.", "ابھی دکھانے کو کچھ نہیں۔"), 14f, DIM,
        ).apply { setPadding(0, dp(16), 0, 0) })

        val list = ListView(this).apply {
            divider = null
            setSelector(android.R.color.transparent)
            addHeaderView(head, null, false)
            adapter = RowAdapter(rows)
            clipToPadding = false
            setPadding(0, 0, 0, dp(16))
            setOnItemClickListener { p, _, pos, _ ->
                val r = p.getItemAtPosition(pos) as? Row ?: return@setOnItemClickListener
                val a = r.app ?: return@setOnItemClickListener
                if (tab == 5) {
                    appSettings(a.pkg)
                    Toast.makeText(this@MainActivity, tr("Storage → Clear cache", "Storage ← Clear cache دبائیں"), Toast.LENGTH_LONG).show()
                } else details(a)
            }
        }
        content.addView(list)
    }

    private inner class RowAdapter(val rows: List<Row>) : BaseAdapter() {
        override fun getCount() = rows.size
        override fun getItem(p: Int) = rows[p]
        override fun getItemId(p: Int) = p.toLong()

        override fun getView(p: Int, cv: View?, parent: ViewGroup): View {
            val h: Holder
            val v: View
            if (cv == null) {
                h = Holder()
                val row = LinearLayout(this@MainActivity).apply { gravity = Gravity.CENTER_VERTICAL; setPadding(dp(16), dp(10), dp(16), dp(10)) }
                h.icon = ImageView(this@MainActivity)
                row.addView(h.icon, LinearLayout.LayoutParams(dp(40), dp(40)).apply { marginEnd = dp(12) })
                val mid = LinearLayout(this@MainActivity).apply { orientation = LinearLayout.VERTICAL }
                val top = LinearLayout(this@MainActivity)
                h.title = text("", 15f, TEXT, true).apply { maxLines = 1; ellipsize = android.text.TextUtils.TruncateAt.END }
                h.value = text("", 14f, TEXT, true).apply { setPadding(dp(8), 0, 0, 0) }
                top.addView(h.title, LinearLayout.LayoutParams(0, -2, 1f))
                top.addView(h.value)
                mid.addView(top)
                h.sub = text("", 12f, DIM).apply { setPadding(0, dp(2), 0, dp(6)) }
                mid.addView(h.sub)
                h.bar = BarView(this@MainActivity)
                mid.addView(h.bar, LinearLayout.LayoutParams(-1, dp(5)))
                row.addView(mid, LinearLayout.LayoutParams(0, -2, 1f))
                row.tag = h
                v = row
            } else { v = cv; h = cv.tag as Holder }

            val r = rows[p]
            h.title.text = r.title
            h.sub.text = r.sub
            h.value.text = r.value
            h.bar.frac = r.frac; h.bar.color = r.color; h.bar.invalidate()
            loadIcon(h.icon, r.pkg)
            return v
        }
    }

    private class Holder {
        lateinit var icon: ImageView
        lateinit var title: TextView
        lateinit var sub: TextView
        lateinit var value: TextView
        lateinit var bar: BarView
    }

    private fun loadIcon(iv: ImageView, pkg: String?) {
        iv.tag = pkg
        if (pkg == null) { iv.setImageResource(android.R.drawable.sym_def_app_icon); return }
        icons.get(pkg)?.let { iv.setImageDrawable(it); return }
        iv.setImageDrawable(null)
        iconIo.execute {
            val d = try { packageManager.getApplicationIcon(pkg) } catch (e: Exception) { return@execute }
            icons.put(pkg, d)
            ui.post { if (iv.tag == pkg) iv.setImageDrawable(d) }
        }
    }

    // ---------------------------------------------------------------- actions

    private fun details(a: AppRow) {
        val n = net.firstOrNull { it.app === a }
        val sb = StringBuilder()
        fun line(k: String, v: String) { sb.append(k).append(": ").append(v).append('\n') }
        line(tr("Status", "حالت"), stateName(a.state))
        line(tr("Auto-start at boot", "فون آن ہوتے ہی خود چلتی ہے"), yes(a.autoStart))
        line(tr("Exempt from battery limits", "بیٹری پابندی سے آزاد"), yes(a.unrestricted))
        if (hasAccess) {
            line(tr("Last active", "آخری بار فعال"), ago(a.lastUsed))
            line(tr("On screen (24h)", "اسکرین پر (24 گھنٹے)"), dur(a.fgTime))
            line(tr("Background work (24h)", "بیک گراؤنڈ کام (24 گھنٹے)"), dur(a.bgTime))
            line(tr("App size", "ایپ کا سائز"), size(a.appBytes))
            line(tr("User data", "یوزر ڈیٹا"), size(a.dataBytes - a.cacheBytes))
            line(tr("Cache", "کیش"), size(a.cacheBytes))
            line(tr("Data", "ڈیٹا") + " (${periodName()})", if (n == null) size(0) else tr(
                "${size(n.total)} (Wi-Fi ${size(n.wifi)}, mobile ${size(n.mobile)}, background ${size(n.background)})",
                "${size(n.total)} (وائی فائی ${size(n.wifi)}، موبائل ${size(n.mobile)}، بیک گراؤنڈ ${size(n.background)})",
            ))
        }
        sb.append(a.pkg)
        AlertDialog.Builder(this, android.R.style.Theme_DeviceDefault_Dialog_Alert)
            .setTitle(a.label)
            .setMessage(sb)
            .setPositiveButton(tr("App settings", "ایپ سیٹنگز")) { _, _ -> appSettings(a.pkg) }
            .setNeutralButton(tr("Stop background", "بیک گراؤنڈ روکیں")) { _, _ ->
                (getSystemService(ACTIVITY_SERVICE) as ActivityManager).killBackgroundProcesses(a.pkg)
                Toast.makeText(this, tr(
                    "Background processes stopped. If it restarts, use App settings → Force stop.",
                    "بیک گراؤنڈ پروسیس روک دیے گئے۔ اگر دوبارہ چل پڑے تو ایپ سیٹنگز ← Force stop استعمال کریں۔",
                ), Toast.LENGTH_LONG).show()
            }
            .setNegativeButton(tr("Close", "بند کریں"), null)
            .show()
    }

    /** Kill background processes of every app. Works instantly, needs no special permission. */
    private fun quickStopAll() {
        val am = getSystemService(ACTIVITY_SERVICE) as ActivityManager
        val before = data.ram().avail
        val list = apps.filter { !it.stopped }
        io.execute {
            for (a in list) try { am.killBackgroundProcesses(a.pkg) } catch (e: Exception) { }
            ui.postDelayed({
                val freed = (data.ram().avail - before).coerceAtLeast(0)
                Toast.makeText(this, tr("Stopped ${list.size} apps • freed ${size(freed)} RAM", "${list.size} ایپس روک دیں • ${size(freed)} ریم خالی ہوئی"), Toast.LENGTH_LONG).show()
                if (!isDestroyed) render()
            }, 1000)
        }
    }

    private fun yes(b: Boolean) = if (b) tr("Yes", "ہاں") else tr("No", "نہیں")

    private fun appSettings(pkg: String) = open(Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:$pkg")))

    private fun openRunningServices() = open(
        Intent().setClassName("com.android.settings", "com.android.settings.Settings\$DevRunningServicesActivity"),
        Intent(Settings.ACTION_APPLICATION_DEVELOPMENT_SETTINGS),
        Intent(Settings.ACTION_DEVICE_INFO_SETTINGS),
    )

    /** Start the first intent that the phone can handle. */
    private fun open(vararg intents: Intent) {
        for (i in intents) {
            try { startActivity(i); return } catch (e: Exception) { }
        }
        Toast.makeText(this, tr("This screen is not available on your phone.", "یہ اسکرین آپ کے فون پر دستیاب نہیں۔"), Toast.LENGTH_SHORT).show()
    }
}
