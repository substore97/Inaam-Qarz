package com.inaam.karobar

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.clipPath
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.graphics.lerp
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/** ہر فولڈر کا اپنا رنگ (اوپر کا ہلکا رنگ، نیچے کا گہرا رنگ) */
private val folderColors = listOf(
    Color(0xFF38EF7D) to Color(0xFF11998E),
    Color(0xFF6DD5ED) to Color(0xFF2193B0),
    Color(0xFFC471ED) to Color(0xFF8E2DE2),
    Color(0xFFFFD200) to Color(0xFFF7971E),
    Color(0xFFFF6A00) to Color(0xFFEE0979),
    Color(0xFF8E54E9) to Color(0xFF4776E6),
    Color(0xFFA8E063) to Color(0xFF56AB2F),
    Color(0xFFEF473A) to Color(0xFFCB2D3E),
    Color(0xFF00D2FF) to Color(0xFF0083B0),
    Color(0xFFF3A683) to Color(0xFFC0392B),
    Color(0xFF3A5A85) to Color(0xFF141E30),
)

private val GoldBright = Color(0xFFFFD166)

private fun darker(c: Color, f: Float = 0.35f) = lerp(c, Color.Black, f)

/** چمکدار 3D فولڈر کارڈ */
@Composable
internal fun Folder3DCard(budget: Budget, count: Int, modifier: Modifier = Modifier, onClick: () -> Unit) {
    val (light, deep) = folderColors[(budget.id - 1) % folderColors.size]
    val premium = budget.id == budgets.last().id

    // روشنی کی لکیر جو فولڈر پر سے گزرتی رہتی ہے
    val transition = rememberInfiniteTransition(label = "shine")
    val shine by transition.animateFloat(
        initialValue = -0.6f,
        targetValue = 1.6f,
        animationSpec = infiniteRepeatable(
            tween(durationMillis = 2600 + budget.id * 120, easing = LinearEasing),
            RepeatMode.Restart,
        ),
        label = "shineX",
    )

    Box(
        modifier
            .padding(8.dp)
            .aspectRatio(1f)
            .clickable(onClick = onClick),
    ) {
        Canvas(Modifier.fillMaxSize()) {
            drawFolder(light, deep, shine, premium)
        }

        // نمبر کا سنہری بیج
        Box(
            Modifier
                .align(Alignment.TopStart)
                .padding(start = 8.dp, top = 4.dp)
                .size(30.dp)
                .shadow(6.dp, CircleShape)
                .clip(CircleShape)
                .border(1.5.dp, Color.White, CircleShape),
            contentAlignment = Alignment.Center,
        ) {
            Canvas(Modifier.fillMaxSize()) {
                drawCircle(
                    Brush.radialGradient(
                        listOf(Color(0xFFFFF3B0), GoldBright, Color(0xFFE0A100)),
                        center = Offset(size.width * 0.35f, size.height * 0.3f),
                        radius = size.width,
                    ),
                )
            }
            Text(
                urduNumber(budget.id),
                color = Color(0xFF5A3D00),
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
            )
        }

        // فولڈر کے سامنے والے حصے پر لکھائی
        Column(
            Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .fillMaxHeight(0.62f)
                .padding(horizontal = 10.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
        ) {
            Text(
                budget.label,
                color = if (premium) GoldBright else Color.White,
                textAlign = TextAlign.Center,
                style = urduStyle(22, FontWeight.Bold).copy(
                    shadow = Shadow(Color.Black.copy(alpha = 0.45f), Offset(0f, 4f), 8f),
                ),
            )
            Text(
                "${urduNumber(count)} آئیڈیاز",
                color = Color.White.copy(alpha = 0.92f),
                style = urduStyle(13).copy(
                    shadow = Shadow(Color.Black.copy(alpha = 0.35f), Offset(0f, 2f), 4f),
                ),
            )
        }
    }
}

private fun DrawScope.drawFolder(light: Color, deep: Color, shine: Float, premium: Boolean) {
    val w = size.width
    val h = size.height
    val r = w * 0.07f

    // زمین پر پڑنے والا سایہ
    drawOval(
        Brush.radialGradient(
            listOf(Color.Black.copy(alpha = 0.28f), Color.Transparent),
            center = Offset(w / 2, h * 0.95f),
            radius = w * 0.5f,
        ),
        topLeft = Offset(w * 0.06f, h * 0.88f),
        size = Size(w * 0.88f, h * 0.12f),
    )

    // پچھلا حصہ اور ٹیب
    val back = Path().apply {
        val top = h * 0.14f
        val tabTop = h * 0.06f
        moveTo(w * 0.06f + r, tabTop)
        lineTo(w * 0.40f, tabTop)
        quadraticBezierTo(w * 0.45f, tabTop, w * 0.48f, top)
        lineTo(w * 0.94f - r, top)
        quadraticBezierTo(w * 0.94f, top, w * 0.94f, top + r)
        lineTo(w * 0.94f, h * 0.86f)
        lineTo(w * 0.06f, h * 0.86f)
        lineTo(w * 0.06f, tabTop + r)
        quadraticBezierTo(w * 0.06f, tabTop, w * 0.06f + r, tabTop)
        close()
    }
    drawPath(back, Brush.verticalGradient(listOf(darker(light, 0.15f), darker(deep, 0.45f))))

    // اندر رکھے کاغذات (ہلکے سے ترچھے)
    rotate(-5f, pivot = Offset(w / 2, h * 0.5f)) {
        drawRoundRect(
            Color(0xFFF1F1F1),
            topLeft = Offset(w * 0.16f, h * 0.17f),
            size = Size(w * 0.66f, h * 0.5f),
            cornerRadius = CornerRadius(r * 0.5f),
        )
    }
    rotate(4f, pivot = Offset(w / 2, h * 0.5f)) {
        drawRoundRect(
            Color.White,
            topLeft = Offset(w * 0.18f, h * 0.20f),
            size = Size(w * 0.64f, h * 0.48f),
            cornerRadius = CornerRadius(r * 0.5f),
        )
        for (i in 0..2) {
            drawRoundRect(
                Color(0xFFDDE3E0),
                topLeft = Offset(w * 0.26f, h * (0.25f + i * 0.05f)),
                size = Size(w * (0.48f - i * 0.08f), h * 0.018f),
                cornerRadius = CornerRadius(4f),
            )
        }
    }

    // سامنے والا حصہ (3D جھکاؤ کے ساتھ)
    val frontTop = h * 0.36f
    val front = Path().apply {
        moveTo(w * 0.02f + r, frontTop)
        lineTo(w * 0.98f - r, frontTop)
        quadraticBezierTo(w * 0.98f, frontTop, w * 0.975f, frontTop + r)
        lineTo(w * 0.94f, h * 0.86f - r)
        quadraticBezierTo(w * 0.935f, h * 0.88f, w * 0.94f - r, h * 0.88f)
        lineTo(w * 0.06f + r, h * 0.88f)
        quadraticBezierTo(w * 0.065f, h * 0.88f, w * 0.06f, h * 0.86f - r)
        lineTo(w * 0.025f, frontTop + r)
        quadraticBezierTo(w * 0.02f, frontTop, w * 0.02f + r, frontTop)
        close()
    }
    drawPath(front, Brush.verticalGradient(listOf(light, deep), startY = frontTop, endY = h * 0.88f))

    clipPath(front) {
        // اوپر کا چمکدار حصہ (گلاس جیسی چمک)
        drawRect(
            Brush.verticalGradient(
                listOf(Color.White.copy(alpha = 0.45f), Color.White.copy(alpha = 0.05f), Color.Transparent),
                startY = frontTop,
                endY = frontTop + h * 0.28f,
            ),
            topLeft = Offset(0f, frontTop),
            size = Size(w, h * 0.28f),
        )
        // چلتی ہوئی روشنی
        val x = w * shine
        drawRect(
            Brush.linearGradient(
                listOf(Color.Transparent, Color.White.copy(alpha = 0.38f), Color.Transparent),
                start = Offset(x - w * 0.25f, frontTop),
                end = Offset(x + w * 0.05f, h),
            ),
            topLeft = Offset(0f, frontTop),
            size = Size(w, h),
        )
        // نیچے کا گہرا کنارہ
        drawRect(
            Brush.verticalGradient(
                listOf(Color.Transparent, Color.Black.copy(alpha = 0.25f)),
                startY = h * 0.72f,
                endY = h * 0.88f,
            ),
            topLeft = Offset(0f, h * 0.72f),
            size = Size(w, h * 0.16f),
        )
    }
    // اوپر کی روشن لکیر
    drawLine(
        Color.White.copy(alpha = 0.85f),
        start = Offset(w * 0.02f + r, frontTop + 1.5f),
        end = Offset(w * 0.98f - r, frontTop + 1.5f),
        strokeWidth = 3f,
    )
    if (premium) {
        drawPath(
            front,
            Brush.linearGradient(listOf(GoldBright, Color(0xFFB8860B), GoldBright)),
            style = androidx.compose.ui.graphics.drawscope.Stroke(width = 5f),
        )
    }
}

/** اوپر بائیں کونے میں گول تصویر */
@Composable
internal fun ProfileAvatar(size: Int = 40, onClick: () -> Unit = {}) {
    Image(
        painter = painterResource(R.drawable.dp),
        contentDescription = "پروفائل تصویر",
        contentScale = ContentScale.Crop,
        modifier = Modifier
            .padding(horizontal = 8.dp)
            .size(size.dp)
            .shadow(6.dp, CircleShape)
            .clip(CircleShape)
            .border(2.dp, GoldBright, CircleShape)
            .clickable(onClick = onClick),
    )
}

@Composable
internal fun ProfileDialogContent() {
    Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
        Image(
            painter = painterResource(R.drawable.dp),
            contentDescription = "پروفائل تصویر",
            contentScale = ContentScale.Crop,
            modifier = Modifier
                .size(160.dp)
                .shadow(10.dp, CircleShape)
                .clip(CircleShape)
                .border(3.dp, GoldBright, CircleShape),
        )
        Spacer(Modifier.height(10.dp))
        Text("انعام کاروبار", style = urduStyle(20, FontWeight.Bold), color = Color(0xFF0B6E4F))
        Text(
            "سرمائے کے مطابق ${urduNumber(ideas.size)} کاروباری آئیڈیاز",
            style = urduStyle(14),
            color = Color.Gray,
            textAlign = TextAlign.Center,
        )
    }
}

