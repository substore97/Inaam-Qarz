package com.inaam.phonemonitor

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.net.Uri
import android.os.Handler
import android.os.Looper
import android.provider.Settings
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import android.widget.Toast

/**
 * Presses "Force stop" or "Storage → Clear cache" on the system App info screen for a queue
 * of packages. Only does anything while a job started from inside the app is running.
 */
class CleanerService : AccessibilityService() {
    companion object {
        var instance: CleanerService? = null
            private set

        fun start(pkgs: List<String>, forceStop: Boolean): Boolean {
            val s = instance ?: return false
            s.begin(pkgs, forceStop)
            return true
        }

        private val FORCE = listOf("Force stop", "زبردستی روکیں", "فورس اسٹاپ")
        private val OK = listOf("OK", "ٹھیک ہے")
        private val CANCEL = listOf("Cancel", "منسوخ کریں", "منسوخ")
        private val STORAGE = listOf("Storage", "اسٹوریج", "سٹوریج")
        private val CLEAR = listOf("Clear cache", "کیش صاف کریں")
        private const val DONE = 9
    }

    private val h = Handler(Looper.getMainLooper())
    private val queue = ArrayDeque<String>()
    private var running = false
    private var forceStop = false
    private var step = 0
    private var scrolls = 0
    private var done = 0
    private val tick = Runnable { work() }
    private val advance = Runnable { next() }

    override fun onServiceConnected() { instance = this }

    override fun onUnbind(intent: Intent?): Boolean {
        instance = null
        running = false
        h.removeCallbacksAndMessages(null)
        return super.onUnbind(intent)
    }

    override fun onInterrupt() {}

    override fun onAccessibilityEvent(e: AccessibilityEvent?) {
        if (!running) return
        h.removeCallbacks(tick)
        h.postDelayed(tick, 300)
    }

    private fun begin(pkgs: List<String>, force: Boolean) {
        queue.clear(); queue.addAll(pkgs)
        forceStop = force; done = 0; running = true
        next()
    }

    private fun next() {
        h.removeCallbacks(advance); h.removeCallbacks(tick)
        val pkg = queue.removeFirstOrNull()
        if (pkg == null) { finish(); return }
        step = 0; scrolls = 0
        try {
            startActivity(Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:$pkg"))
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK or Intent.FLAG_ACTIVITY_NO_ANIMATION))
        } catch (e: Exception) {
            h.post(advance); return
        }
        h.postDelayed(tick, 900)
        h.postDelayed(advance, 6000) // give up on this app if the buttons never show
    }

    private fun moveOn(delay: Long) {
        step = DONE
        h.removeCallbacks(advance)
        h.postDelayed(advance, delay)
    }

    private fun work() {
        if (!running || step == DONE) return
        val root = rootInActiveWindow ?: return
        if (root.packageName == packageName) return
        if (forceStop) when (step) {
            0 -> {
                val n = find(root, FORCE, false) ?: return
                if (!usable(n)) moveOn(200) else if (click(n)) step = 1
            }
            1 -> {
                val n = find(root, OK, false) ?: (if (find(root, CANCEL, false) != null) find(root, FORCE, false) else null) ?: return
                if (click(n)) { done++; moveOn(700) }
            }
        } else when (step) {
            0 -> {
                val n = find(root, STORAGE, true)
                if (n != null) { if (click(n)) step = 1 }
                else if (scrolls < 3) { scrolls++; scrollable(root)?.performAction(AccessibilityNodeInfo.ACTION_SCROLL_FORWARD) }
            }
            1 -> {
                val n = find(root, CLEAR, false) ?: return
                if (usable(n) && click(n)) done++
                moveOn(600)
            }
        }
    }

    private fun finish() {
        running = false
        try {
            startActivity(Intent(this, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP))
        } catch (e: Exception) {
        }
        Toast.makeText(this, tr("Done: $done apps", "مکمل: $done ایپس"), Toast.LENGTH_LONG).show()
    }

    private fun find(root: AccessibilityNodeInfo, labels: List<String>, prefix: Boolean): AccessibilityNodeInfo? {
        for (l in labels) for (n in root.findAccessibilityNodeInfosByText(l)) {
            val t = (n.text ?: n.contentDescription)?.toString()?.trim() ?: continue
            if (if (prefix) t.startsWith(l, true) else t.equals(l, true)) return n
        }
        return null
    }

    private fun clickable(n: AccessibilityNodeInfo): AccessibilityNodeInfo? {
        var c: AccessibilityNodeInfo? = n
        var depth = 0
        while (c != null && !c.isClickable && depth++ < 6) c = c.parent
        return c?.takeIf { it.isClickable }
    }

    private fun usable(n: AccessibilityNodeInfo) = n.isEnabled && clickable(n)?.isEnabled == true

    private fun click(n: AccessibilityNodeInfo) = clickable(n)?.performAction(AccessibilityNodeInfo.ACTION_CLICK) == true

    private fun scrollable(n: AccessibilityNodeInfo, depth: Int = 0): AccessibilityNodeInfo? {
        if (n.isScrollable) return n
        if (depth > 12) return null
        for (i in 0 until n.childCount) {
            val r = n.getChild(i)?.let { scrollable(it, depth + 1) }
            if (r != null) return r
        }
        return null
    }
}
