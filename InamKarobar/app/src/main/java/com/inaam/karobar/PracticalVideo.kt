package com.inaam.karobar

import android.speech.tts.TextToSpeech
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.*
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.graphics.TransformOrigin
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.lerp
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalInspectionMode
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import java.util.Locale
import kotlin.math.max

// ======================= مناظر (سینز) =======================

private sealed class Scene(val narration: String) {
    class Intro(val idea: Idea) : Scene(
        "آج کا آئیڈیا: ${idea.title}۔ ${idea.description}",
    )
    class Money(val amount: String, val items: List<String>) : Scene(
        "اس کاروبار کے لیے سرمایہ: $amount۔ " + items.joinToString("، "),
    )
    class Step(val index: Int, val total: Int, val text: String, val emoji: String) : Scene(
        "قدم نمبر ${index + 1}۔ $text",
    )
    class Tips(val tips: List<String>) : Scene("اہم مشورے۔ " + tips.joinToString("۔ "))
    class Profit(val profit: String, val level: String) : Scene(
        "متوقع آمدنی: $profit۔ مشکل کا درجہ: $level۔",
    )
    class Outro(val title: String) : Scene(
        "اللہ کا نام لے کر آج ہی پہلا قدم اٹھائیں۔ انعام کاروبار۔",
    )
}

private fun buildScenes(idea: Idea): List<Scene> {
    val amount = idea.investment.substringBefore("(").trim()
    val items = idea.investment.substringAfter("(", "").substringBeforeLast(")")
        .split("،", ",").map { it.trim() }.filter { it.isNotEmpty() }.take(6)
    return buildList {
        add(Scene.Intro(idea))
        add(Scene.Money(amount, items))
        idea.steps.forEachIndexed { i, s -> add(Scene.Step(i, idea.steps.size, s, emojiFor(s, idea))) }
        add(Scene.Tips(idea.tips))
        add(Scene.Profit(idea.profit, idea.level))
        add(Scene.Outro(idea.title))
    }
}

/** قدم کے الفاظ کے حساب سے مناسب تصویر */
private fun emojiFor(step: String, idea: Idea, domainFirst: Boolean = false): String {
    val map = listOf(
        listOf("کورس", "سیکھ", "تربیت", "ٹریننگ", "مشق") to "🎓",
        listOf("واٹس ایپ", "فیس بک", "انسٹاگرام", "سوشل", "اشتہار", "تشہیر", "پیج") to "📱",
        listOf("ویب سائٹ", "آن لائن", "ایپ", "لیپ ٹاپ", "کمپیوٹر") to "💻",
        listOf("ڈیلیوری", "پہنچا", "ترسیل", "رائیڈر") to "🛵",
        listOf("گاڑی", "رکشہ", "وین", "ٹرک") to "🚚",
        listOf("مشین", "اوزار", "آلات", "فرائر", "اوون") to "⚙️",
        listOf("لائسنس", "رجسٹر", "کاغذات", "اجازت", "معاہدہ") to "📄",
        listOf("حساب", "ریکارڈ", "رسید", "بل") to "🧾",
        listOf("قیمت", "رقم", "منافع", "پیکج", "ریٹ") to "💰",
        listOf("پیکنگ", "لیبل", "ڈبے", "بوتل", "جار") to "📦",
        listOf("جگہ", "دکان", "کاؤنٹر", "کرائے", "شوروم") to "🏪",
        listOf("خرید", "مال", "اسٹاک", "تھوک", "منڈی", "سپلائر") to "🛒",
        listOf("گاہک", "رابطہ", "ملاقات", "آرڈر") to "🤝",
        listOf("ویکسین", "ڈاکٹر", "دوا", "معائنہ") to "💉",
        listOf("مرغی", "چوزے", "انڈے") to "🐔",
        listOf("بکری", "بکرے") to "🐐",
        listOf("بھینس", "گائے", "مویشی", "بچھڑے", "دودھ") to "🐄",
        listOf("مچھلی", "تالاب") to "🐟",
        listOf("بیج", "کاشت", "پودے", "کھاد", "فصل", "باغ") to "🌱",
        listOf("کیک", "بیکری", "بسکٹ", "مٹھائی") to "🎂",
        listOf("چائے", "قہوہ", "کافی") to "☕",
        listOf("جوس", "شیک", "لسی", "شربت") to "🥤",
        listOf("برگر", "پیزا", "شوارما", "فرائز", "بروسٹ") to "🍔",
        listOf("کھانا", "مینو", "ذائقہ", "پکا", "ترکیب", "ٹفن", "کچن", "ریسٹورنٹ", "ہوٹل") to "🍲",
        listOf("کپڑ", "سلائی", "ڈیزائن") to "🧵",
        listOf("تصاویر", "ویڈیو", "کیمرہ") to "📸",
        listOf("ملازم", "کاریگر", "لڑکے", "عملہ", "رکھیں") to "👷",
    )
    val domain = setOf("🎂", "☕", "🥤", "🍔", "🍲", "🐔", "🐐", "🐄", "🐟", "🌱", "🧵", "📸", "💻", "🚚")
    val ordered = if (domainFirst) map.sortedBy { if (it.second in domain) 0 else 1 } else map
    for ((keys, e) in ordered) if (keys.any { step.contains(it) }) return e
    return listOf("🔧", "📋", "🚀", "⭐")[idea.id % 4]
}

/** ٹیسٹ اسکرین شاٹ میں ہر منظر مکمل حالت میں دکھانے کے لیے */
private val LocalStill = staticCompositionLocalOf { false }

private fun sceneDurationMs(s: Scene): Int = max(5500, s.narration.length * 80)

// ======================= ویڈیو پلیئر =======================

private val Night = Color(0xFF07131F)
private val Night2 = Color(0xFF0E2A3A)
private val Emerald = Color(0xFF12B886)
private val Gold = Color(0xFFFFD166)
private val GoldDeep = Color(0xFFE09B00)

@Composable
internal fun PracticalVideoScreen(
    idea: Idea,
    onClose: () -> Unit,
    initialScene: Int = 0,
    autoPlay: Boolean = true,
) {
    val scenes = remember(idea.id) { buildScenes(idea) }
    var index by remember { mutableIntStateOf(initialScene.coerceIn(0, scenes.lastIndex)) }
    var playing by remember { mutableStateOf(autoPlay) }
    var muted by remember { mutableStateOf(false) }
    var finished by remember { mutableStateOf(false) }
    val progress = remember { Animatable(if (autoPlay) 0f else 0.6f) }
    val scene = scenes[index]

    // ---------- اردو آواز ----------
    val context = LocalContext.current
    val inPreview = LocalInspectionMode.current
    var ttsReady by remember { mutableStateOf(false) }
    var urduMissing by remember { mutableStateOf(false) }
    val tts = remember {
        if (inPreview) null else TextToSpeech(context) { status ->
            if (status == TextToSpeech.SUCCESS) ttsReady = true
        }
    }
    LaunchedEffect(ttsReady) {
        if (ttsReady && tts != null) {
            val r = tts.setLanguage(Locale("ur", "PK"))
            if (r == TextToSpeech.LANG_MISSING_DATA || r == TextToSpeech.LANG_NOT_SUPPORTED) {
                val r2 = tts.setLanguage(Locale("ur"))
                urduMissing = r2 == TextToSpeech.LANG_MISSING_DATA || r2 == TextToSpeech.LANG_NOT_SUPPORTED
            }
            tts.setSpeechRate(0.95f)
        }
    }
    DisposableEffect(Unit) { onDispose { tts?.stop(); tts?.shutdown() } }
    LaunchedEffect(index, playing, muted, ttsReady, urduMissing) {
        if (tts == null || !ttsReady || urduMissing) return@LaunchedEffect
        if (playing && !muted) tts.speak(scene.narration, TextToSpeech.QUEUE_FLUSH, null, "scene$index")
        else tts.stop()
    }

    // ---------- ٹائمر ----------
    var timedIndex by remember { mutableIntStateOf(index) }
    LaunchedEffect(index, playing) {
        if (timedIndex != index) {
            progress.snapTo(0f); timedIndex = index
        }
        if (!playing) return@LaunchedEffect
        val total = sceneDurationMs(scene)
        val remaining = ((1f - progress.value) * total).toInt().coerceAtLeast(1)
        progress.animateTo(1f, tween(remaining, easing = LinearEasing))
        if (index < scenes.lastIndex) {
            index++
        } else {
            playing = false; finished = true
        }
    }

    fun go(to: Int) {
        index = to.coerceIn(0, scenes.lastIndex)
        finished = false
    }

    Box(
        Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(Night, Night2, Night)))
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
            ) { if (!finished) playing = !playing },
    ) {
        Stage3D(moving = playing)

        AnimatedContent(
            targetState = index,
            transitionSpec = {
                (fadeIn(tween(500)) + scaleIn(tween(600), initialScale = 0.85f)) togetherWith
                    (fadeOut(tween(350)) + scaleOut(tween(350), targetScale = 1.12f))
            },
            label = "scene",
            modifier = Modifier.fillMaxSize(),
        ) { i ->
            CompositionLocalProvider(LocalStill provides !autoPlay) { SceneView(scenes[i]) }
        }

        // ---------- اوپر: پروگریس اور بند کرنے کا بٹن ----------
        Column(Modifier.fillMaxWidth().align(Alignment.TopCenter).padding(top = 12.dp, start = 12.dp, end = 12.dp)) {
            Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                scenes.indices.forEach { i ->
                    val p = when {
                        i < index -> 1f
                        i == index -> progress.value
                        else -> 0f
                    }
                    Box(
                        Modifier.weight(1f).height(4.dp).clip(RoundedCornerShape(2.dp))
                            .background(Color.White.copy(alpha = 0.25f)),
                    ) {
                        Box(Modifier.fillMaxHeight().fillMaxWidth(p).background(Gold))
                    }
                }
            }
            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(top = 6.dp)) {
                Text(
                    "🎬 پریکٹیکل ویڈیو",
                    color = Gold,
                    style = urduStyle(15, FontWeight.Bold),
                    modifier = Modifier.weight(1f),
                )
                IconButton(onClick = onClose) { Icon(Icons.Filled.Close, "بند کریں", tint = Color.White) }
            }
            if (urduMissing && !muted) {
                Text(
                    "اس فون میں اردو آواز انسٹال نہیں۔ سیٹنگز ← زبان ← ٹیکسٹ ٹو اسپیچ سے اردو شامل کریں۔",
                    color = Color.White.copy(alpha = 0.7f),
                    style = urduStyle(11),
                )
            }
        }

        // ---------- نیچے: کنٹرولز ----------
        Row(
            Modifier.align(Alignment.BottomCenter).fillMaxWidth().padding(bottom = 18.dp),
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            ControlButton(onClick = { go(index - 1) }) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, "پچھلا", tint = Color.White)
            }
            ControlButton(big = true, onClick = {
                if (finished) {
                    if (index == 0) timedIndex = -1
                    go(0); playing = true
                } else {
                    playing = !playing
                }
            }) {
                when {
                    finished -> Icon(Icons.Filled.Refresh, "دوبارہ", tint = Night, modifier = Modifier.size(34.dp))
                    playing -> PauseGlyph()
                    else -> Icon(Icons.Filled.PlayArrow, "چلائیں", tint = Night, modifier = Modifier.size(38.dp))
                }
            }
            ControlButton(onClick = { go(index + 1) }) {
                Icon(Icons.AutoMirrored.Filled.ArrowForward, "اگلا", tint = Color.White)
            }
            ControlButton(onClick = { muted = !muted }) {
                Text(if (muted) "🔇" else "🔊", fontSize = 20.sp)
            }
        }
    }
}

@Composable
private fun PauseGlyph() {
    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
        repeat(2) { Box(Modifier.size(width = 7.dp, height = 26.dp).background(Night, RoundedCornerShape(2.dp))) }
    }
}

@Composable
private fun ControlButton(big: Boolean = false, onClick: () -> Unit, content: @Composable () -> Unit) {
    val s = if (big) 68.dp else 48.dp
    Box(
        Modifier
            .size(s)
            .shadow(if (big) 16.dp else 6.dp, CircleShape, ambientColor = Gold, spotColor = Gold)
            .clip(CircleShape)
            .background(
                if (big) Brush.radialGradient(listOf(Color(0xFFFFF1B8), Gold, GoldDeep))
                else Brush.radialGradient(listOf(Color.White.copy(alpha = 0.25f), Color.White.copy(alpha = 0.08f))),
            )
            .border(1.dp, Color.White.copy(alpha = 0.35f), CircleShape)
            .clickable(onClick = onClick),
        contentAlignment = Alignment.Center,
    ) { content() }
}

// ======================= 3D اسٹیج =======================

/** پرسپیکٹو فرش، چلتی روشنی اور ذرات */
@Composable
private fun Stage3D(moving: Boolean) {
    val t = rememberInfiniteTransition(label = "stage")
    val flow by t.animateFloat(0f, 1f, infiniteRepeatable(tween(2400, easing = LinearEasing)), label = "flow")
    val sweep by t.animateFloat(-1f, 1f, infiniteRepeatable(tween(5000, easing = FastOutSlowInEasing), RepeatMode.Reverse), label = "sweep")
    val f = if (moving) flow else 0.3f
    Canvas(Modifier.fillMaxSize()) {
        val w = size.width
        val h = size.height
        val horizon = h * 0.56f
        val vp = Offset(w / 2, horizon)

        // آسمان پر روشنی
        drawCircle(
            Brush.radialGradient(listOf(Emerald.copy(alpha = 0.35f), Color.Transparent), center = Offset(w * (0.5f + 0.3f * sweep), h * 0.25f), radius = w * 0.8f),
            radius = w * 0.8f, center = Offset(w * (0.5f + 0.3f * sweep), h * 0.25f),
        )
        // فرش
        drawRect(
            Brush.verticalGradient(listOf(Color(0xFF0B3B3A), Color(0xFF04151C)), startY = horizon, endY = h),
            topLeft = Offset(0f, horizon), size = Size(w, h - horizon),
        )
        val grid = Emerald.copy(alpha = 0.35f)
        // عمودی لکیریں (ایک نقطے کی طرف)
        for (i in -12..12) {
            val x = w / 2 + i * w * 0.16f
            drawLine(grid, vp, Offset(x, h), strokeWidth = 1.5f)
        }
        // افقی لکیریں (حرکت کرتی ہوئی)
        for (k in 0..14) {
            val z = (k + f) / 14f
            val y = horizon + (h - horizon) * z * z
            drawLine(grid.copy(alpha = 0.12f + 0.4f * z), Offset(0f, y), Offset(w, y), strokeWidth = 1f + 2f * z)
        }
        // افق پر چمک
        drawRect(
            Brush.verticalGradient(listOf(Color.Transparent, Emerald.copy(alpha = 0.45f), Color.Transparent), startY = horizon - 40f, endY = horizon + 40f),
            topLeft = Offset(0f, horizon - 40f), size = Size(w, 80f),
        )
        // اسپاٹ لائٹ
        val sx = w * (0.5f + 0.25f * sweep)
        val beam = Path().apply {
            moveTo(sx - w * 0.04f, 0f); lineTo(sx + w * 0.04f, 0f)
            lineTo(w * 0.5f + w * 0.32f, h * 0.62f); lineTo(w * 0.5f - w * 0.32f, h * 0.62f); close()
        }
        drawPath(beam, Brush.verticalGradient(listOf(Color.White.copy(alpha = 0.16f), Color.Transparent), endY = h * 0.62f))
        // ذرات
        for (p in 0 until 26) {
            val px = ((p * 137) % 100) / 100f * w
            val base = ((p * 61) % 100) / 100f
            val py = ((base - f * (0.3f + (p % 5) * 0.06f)) % 1f + 1f) % 1f * h * 0.6f
            drawCircle(Gold.copy(alpha = 0.15f + (p % 4) * 0.1f), radius = 2f + (p % 3) * 2f, center = Offset(px, py))
        }
    }
}

/** گھومنے والی 3D چیز جو چبوترے پر رکھی ہے */
@Composable
private fun Hero3D(emoji: String, modifier: Modifier = Modifier, size: Int = 120) {
    val t = rememberInfiniteTransition(label = "hero")
    val rot by t.animateFloat(-28f, 28f, infiniteRepeatable(tween(2600, easing = FastOutSlowInEasing), RepeatMode.Reverse), label = "rot")
    val bob by t.animateFloat(0f, 1f, infiniteRepeatable(tween(1800, easing = FastOutSlowInEasing), RepeatMode.Reverse), label = "bob")
    Box(modifier.size((size * 1.6f).dp, (size * 1.55f).dp), contentAlignment = Alignment.TopCenter) {
        // چبوترہ
        Canvas(Modifier.fillMaxSize()) { drawPedestal(bob) }
        Text(
            emoji,
            fontSize = size.sp * 0.62f,
            modifier = Modifier
                .padding(top = (6 + bob * 10).dp)
                .graphicsLayer {
                    rotationY = rot
                    rotationX = 8f
                    cameraDistance = 14f * density
                },
        )
    }
}

private fun DrawScope.drawPedestal(bob: Float) {
    val w = size.width
    val h = size.height
    val cx = w / 2
    val topY = h * 0.72f
    val rw = w * 0.42f
    val rh = h * 0.07f
    // سایہ
    drawOval(
        Brush.radialGradient(listOf(Color.Black.copy(alpha = 0.55f - bob * 0.15f), Color.Transparent), center = Offset(cx, topY + rh * 2.4f), radius = rw * 1.2f),
        topLeft = Offset(cx - rw * 1.2f, topY + rh * 1.2f), size = Size(rw * 2.4f, rh * 2.4f),
    )
    // سلنڈر کی دیوار
    drawRect(
        Brush.horizontalGradient(listOf(Color(0xFF0A5C4A), Color(0xFF26D9A6), Color(0xFF0A5C4A)), startX = cx - rw, endX = cx + rw),
        topLeft = Offset(cx - rw, topY), size = Size(rw * 2, rh * 1.6f),
    )
    drawOval(Color(0xFF07402F), topLeft = Offset(cx - rw, topY + rh * 1.6f - rh), size = Size(rw * 2, rh * 2))
    // اوپر کی سطح
    drawOval(
        Brush.radialGradient(listOf(Color(0xFF9CF5D6), Emerald, Color(0xFF0B6E4F)), center = Offset(cx - rw * 0.2f, topY - rh * 0.3f), radius = rw * 1.1f),
        topLeft = Offset(cx - rw, topY - rh), size = Size(rw * 2, rh * 2),
    )
    // چمکتا کنارہ
    drawOval(Gold.copy(alpha = 0.7f), topLeft = Offset(cx - rw, topY - rh), size = Size(rw * 2, rh * 2), style = androidx.compose.ui.graphics.drawscope.Stroke(3f))
}

/** نیچے سے پلٹ کر آنے والا شیشے کا پینل */
@Composable
private fun GlassPanel(modifier: Modifier = Modifier, delayMs: Int = 250, content: @Composable ColumnScope.() -> Unit) {
    val still = LocalStill.current
    val flip = remember { Animatable(if (still) 0f else 80f) }
    LaunchedEffect(Unit) { flip.animateTo(0f, tween(700, delayMs, FastOutSlowInEasing)) }
    Column(
        modifier
            .fillMaxWidth()
            .padding(horizontal = 18.dp)
            .graphicsLayer {
                rotationX = flip.value
                transformOrigin = TransformOrigin(0.5f, 1f)
                cameraDistance = 16f * density
                alpha = 1f - flip.value / 100f
            }
            .clip(RoundedCornerShape(22.dp))
            .background(Brush.verticalGradient(listOf(Color.White.copy(alpha = 0.2f), Color.White.copy(alpha = 0.07f))))
            .border(1.dp, Brush.verticalGradient(listOf(Color.White.copy(alpha = 0.6f), Color.White.copy(alpha = 0.1f))), RoundedCornerShape(22.dp))
            .padding(horizontal = 18.dp, vertical = 14.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        content = content,
    )
}

private val glow = Shadow(Color.Black.copy(alpha = 0.6f), Offset(0f, 5f), 12f)

@Composable
private fun SceneView(scene: Scene) {
    // کیمرے کی آہستہ حرکت (ڈولی زوم اور ہلکا گھماؤ)
    val still = LocalStill.current
    val cam = remember { Animatable(if (still) 1f else 0f) }
    LaunchedEffect(Unit) { cam.animateTo(1f, tween(6000, easing = LinearOutSlowInEasing)) }
    Box(
        Modifier
            .fillMaxSize()
            .padding(top = 70.dp, bottom = 100.dp)
            .graphicsLayer {
                scaleX = 0.96f + 0.06f * cam.value
                scaleY = 0.96f + 0.06f * cam.value
                rotationY = 6f - 9f * cam.value
                cameraDistance = 20f * density
            },
    ) {
        when (scene) {
            is Scene.Intro -> IntroScene(scene.idea)
            is Scene.Money -> MoneyScene(scene)
            is Scene.Step -> StepScene(scene)
            is Scene.Tips -> TipsScene(scene)
            is Scene.Profit -> ProfitScene(scene)
            is Scene.Outro -> OutroScene(scene)
        }
    }
}

@Composable
private fun BoxScope.IntroScene(idea: Idea) {
    val budget = budgets.first { it.id == idea.budget }
    Column(Modifier.align(Alignment.Center), horizontalAlignment = Alignment.CenterHorizontally) {
        Text("⭐ آج کا آئیڈیا", color = Gold, style = urduStyle(18, FontWeight.Bold).copy(shadow = glow))
        Spacer(Modifier.height(6.dp))
        Hero3D(emojiFor(idea.title + " " + idea.description, idea, domainFirst = true), size = 130)
        GlassPanel {
            Text(idea.title, color = Color.White, textAlign = TextAlign.Center, style = urduStyle(24, FontWeight.Bold).copy(shadow = glow))
            Text("📁 ${budget.label} روپے  •  ${idea.level}", color = Gold, style = urduStyle(14))
            Spacer(Modifier.height(4.dp))
            Text(idea.description, color = Color.White.copy(alpha = 0.9f), textAlign = TextAlign.Center, style = urduStyle(15))
        }
    }
}

@Composable
private fun BoxScope.MoneyScene(scene: Scene.Money) {
    Column(Modifier.align(Alignment.Center), horizontalAlignment = Alignment.CenterHorizontally) {
        Text("💰 سرمایہ کہاں لگے گا", color = Gold, style = urduStyle(18, FontWeight.Bold).copy(shadow = glow))
        CoinStack(count = max(4, scene.items.size + 3))
        GlassPanel {
            Text(scene.amount, color = Gold, style = urduStyle(28, FontWeight.Bold).copy(shadow = glow))
            scene.items.forEachIndexed { i, item ->
                AppearItem(delayMs = 700 + i * 450) {
                    Text("✔️ $item", color = Color.White, style = urduStyle(15), textAlign = TextAlign.Center)
                }
            }
        }
    }
}

/** ایک ایک کر کے گرنے والے 3D سکے */
@Composable
private fun CoinStack(count: Int) {
    val stillNow = LocalStill.current
    val drop = remember { Animatable(if (stillNow) count.toFloat() else 0f) }
    LaunchedEffect(Unit) { drop.animateTo(count.toFloat(), tween(count * 300, easing = LinearEasing)) }
    val t = rememberInfiniteTransition(label = "coin")
    val shine by t.animateFloat(0f, 1f, infiniteRepeatable(tween(1600, easing = LinearEasing)), label = "shine")
    Canvas(Modifier.size(200.dp, 170.dp)) {
        val cx = size.width / 2
        val base = size.height * 0.88f
        val rw = size.width * 0.3f
        val rh = rw * 0.32f
        val thick = size.height * 0.07f
        drawOval(
            Brush.radialGradient(listOf(Color.Black.copy(alpha = 0.5f), Color.Transparent), center = Offset(cx, base + rh), radius = rw * 1.4f),
            topLeft = Offset(cx - rw * 1.4f, base), size = Size(rw * 2.8f, rh * 2),
        )
        val shown = drop.value
        for (i in 0 until count) {
            val fall = (shown - i).coerceIn(0f, 1f)
            if (fall <= 0f) break
            val y = base - i * thick - (1f - fall) * size.height * 0.8f
            val jitter = if (i % 2 == 0) 3f else -3f
            drawRect(
                Brush.horizontalGradient(listOf(GoldDeep, Gold, Color(0xFFFFF3C4), GoldDeep), startX = cx - rw, endX = cx + rw),
                topLeft = Offset(cx - rw + jitter, y - thick), size = Size(rw * 2, thick),
            )
            drawOval(GoldDeep, topLeft = Offset(cx - rw + jitter, y - rh), size = Size(rw * 2, rh * 2))
            drawOval(
                Brush.linearGradient(
                    listOf(Gold, Color(0xFFFFF7D6), Gold),
                    start = Offset(cx - rw + rw * 2 * shine - rw, y - thick - rh),
                    end = Offset(cx - rw + rw * 2 * shine + rw, y - thick + rh),
                ),
                topLeft = Offset(cx - rw + jitter, y - thick - rh), size = Size(rw * 2, rh * 2),
            )
            drawOval(GoldDeep.copy(alpha = 0.6f), topLeft = Offset(cx - rw * 0.7f + jitter, y - thick - rh * 0.7f), size = Size(rw * 1.4f, rh * 1.4f), style = androidx.compose.ui.graphics.drawscope.Stroke(2f))
        }
    }
}

@Composable
private fun AppearItem(delayMs: Int, content: @Composable () -> Unit) {
    val stillNow = LocalStill.current
    val a = remember { Animatable(if (stillNow) 1f else 0f) }
    LaunchedEffect(Unit) { a.animateTo(1f, tween(450, delayMs)) }
    Box(Modifier.graphicsLayer { alpha = a.value; translationX = (1f - a.value) * 80f; rotationY = (1f - a.value) * -40f }) { content() }
}

@Composable
private fun BoxScope.StepScene(scene: Scene.Step) {
    val stillNow = LocalStill.current
    val spin = remember { Animatable(if (stillNow) 0f else -180f) }
    LaunchedEffect(Unit) { spin.animateTo(0f, spring(dampingRatio = 0.45f, stiffness = 60f)) }
    Column(Modifier.align(Alignment.Center), horizontalAlignment = Alignment.CenterHorizontally) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text("عملی قدم", color = Gold, style = urduStyle(20, FontWeight.Bold).copy(shadow = glow))
            Spacer(Modifier.width(10.dp))
            // گھومتا ہوا نمبر کیوب
            Box(
                Modifier
                    .size(54.dp)
                    .graphicsLayer { rotationY = spin.value; cameraDistance = 10f * density }
                    .shadow(12.dp, RoundedCornerShape(12.dp), ambientColor = Gold, spotColor = Gold)
                    .clip(RoundedCornerShape(12.dp))
                    .background(Brush.linearGradient(listOf(Color(0xFFFFF1B8), Gold, GoldDeep)))
                    .border(2.dp, Color.White, RoundedCornerShape(12.dp)),
                contentAlignment = Alignment.Center,
            ) {
                Text(urduNumber(scene.index + 1), color = Color(0xFF5A3D00), style = urduStyle(22, FontWeight.Bold))
            }
        }
        Text(
            "قدم ${urduNumber(scene.index + 1)} از ${urduNumber(scene.total)}",
            color = Color.White.copy(alpha = 0.7f),
            style = urduStyle(13),
        )
        Hero3D(scene.emoji, size = 120)
        GlassPanel {
            Text(scene.text, color = Color.White, textAlign = TextAlign.Center, style = urduStyle(19, FontWeight.Bold).copy(shadow = glow))
        }
    }
}

@Composable
private fun BoxScope.TipsScene(scene: Scene.Tips) {
    Column(Modifier.align(Alignment.Center), horizontalAlignment = Alignment.CenterHorizontally) {
        Text("اہم مشورے", color = Gold, style = urduStyle(20, FontWeight.Bold).copy(shadow = glow))
        Hero3D("💡", size = 110)
        GlassPanel {
            scene.tips.forEachIndexed { i, tip ->
                AppearItem(delayMs = 600 + i * 900) {
                    Text("💡 $tip", color = Color.White, textAlign = TextAlign.Center, style = urduStyle(16), modifier = Modifier.padding(vertical = 4.dp))
                }
            }
        }
    }
}

@Composable
private fun BoxScope.ProfitScene(scene: Scene.Profit) {
    val stillNow = LocalStill.current
    val grow = remember { Animatable(if (stillNow) 1f else 0f) }
    LaunchedEffect(Unit) { grow.animateTo(1f, tween(1800, 300, FastOutSlowInEasing)) }
    Column(Modifier.align(Alignment.Center), horizontalAlignment = Alignment.CenterHorizontally) {
        Text("📈 کمائی کا اندازہ", color = Gold, style = urduStyle(20, FontWeight.Bold).copy(shadow = glow))
        Canvas(Modifier.size(260.dp, 190.dp)) { drawBars3D(grow.value) }
        GlassPanel {
            Text("📈 متوقع آمدنی", color = Gold, style = urduStyle(16, FontWeight.Bold))
            Text(scene.profit, color = Color.White, textAlign = TextAlign.Center, style = urduStyle(22, FontWeight.Bold).copy(shadow = glow))
            Text("مشکل کا درجہ: ${scene.level}", color = Color.White.copy(alpha = 0.8f), style = urduStyle(14))
        }
    }
}

private fun DrawScope.drawBars3D(g: Float) {
    val w = size.width
    val h = size.height
    val base = h * 0.92f
    val bw = w * 0.16f
    val depth = bw * 0.45f
    val heights = listOf(0.28f, 0.48f, 0.68f, 0.9f)
    val colors = listOf(Color(0xFF26D9A6), Color(0xFF12B886), Color(0xFF0CA678), Gold)
    // فرش کی پلیٹ
    val plate = Path().apply {
        moveTo(w * 0.04f, base); lineTo(w * 0.86f, base); lineTo(w * 0.96f, base - depth); lineTo(w * 0.14f, base - depth); close()
    }
    drawPath(plate, Color.White.copy(alpha = 0.12f))
    heights.forEachIndexed { i, hh ->
        val x = w * 0.08f + i * (bw + w * 0.05f)
        val bh = (h * 0.8f * hh) * g
        val top = base - bh
        val c = colors[i]
        // سامنے کا رخ
        drawRect(Brush.verticalGradient(listOf(lerp(c, Color.White, 0.25f), c), startY = top, endY = base), topLeft = Offset(x, top), size = Size(bw, bh))
        // دایاں رخ
        val side = Path().apply {
            moveTo(x + bw, top); lineTo(x + bw + depth, top - depth); lineTo(x + bw + depth, base - depth); lineTo(x + bw, base); close()
        }
        drawPath(side, lerp(c, Color.Black, 0.35f))
        // اوپر کا رخ
        val topFace = Path().apply {
            moveTo(x, top); lineTo(x + depth, top - depth); lineTo(x + bw + depth, top - depth); lineTo(x + bw, top); close()
        }
        drawPath(topFace, lerp(c, Color.White, 0.5f))
    }
    // اوپر جاتا تیر
    if (g > 0.6f) {
        val a = (g - 0.6f) / 0.4f
        val sx = w * 0.1f; val sy = base - h * 0.2f
        val ex = w * 0.85f; val ey = h * 0.1f
        val px = sx + (ex - sx) * a; val py = sy + (ey - sy) * a
        drawLine(Gold, Offset(sx, sy), Offset(px, py), strokeWidth = 7f)
        val head = Path().apply { moveTo(px, py); lineTo(px - 26f, py + 4f); lineTo(px - 10f, py + 22f); close() }
        drawPath(head, Gold)
    }
}

@Composable
private fun BoxScope.OutroScene(scene: Scene.Outro) {
    val t = rememberInfiniteTransition(label = "outro")
    val pulse by t.animateFloat(0.94f, 1.06f, infiniteRepeatable(tween(900), RepeatMode.Reverse), label = "pulse")
    Column(Modifier.align(Alignment.Center), horizontalAlignment = Alignment.CenterHorizontally) {
        Hero3D("🏆", size = 140)
        GlassPanel {
            Text("مبارک ہو!", color = Gold, style = urduStyle(26, FontWeight.Bold).copy(shadow = glow))
            Text(
                "آپ نے ${scene.title} کا مکمل پریکٹیکل دیکھ لیا",
                color = Color.White,
                textAlign = TextAlign.Center,
                style = urduStyle(16),
            )
            Spacer(Modifier.height(6.dp))
            Text(
                "اللہ کا نام لے کر آج ہی پہلا قدم اٹھائیں",
                color = Color.White,
                textAlign = TextAlign.Center,
                style = urduStyle(18, FontWeight.Bold),
                modifier = Modifier.graphicsLayer { scaleX = pulse; scaleY = pulse },
            )
        }
        Spacer(Modifier.height(10.dp))
        Text("— انعام کاروبار —", color = Gold.copy(alpha = 0.8f), style = urduStyle(14))
    }
}
