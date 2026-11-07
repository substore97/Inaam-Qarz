package com.inaam.karobar

import android.content.Context
import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// ---------- رنگ اور فونٹ ----------
private val Green = Color(0xFF0B6E4F)
private val GreenLight = Color(0xFFE3F2EC)
private val Gold = Color(0xFFFFD166)
private val Bg = Color(0xFFF4F7F5)

private val Nastaliq = FontFamily(Font(R.font.nastaliq, FontWeight.Normal))

internal fun urduStyle(size: Int, weight: FontWeight = FontWeight.Normal) = TextStyle(
    fontFamily = Nastaliq,
    fontSize = size.sp,
    lineHeight = (size * 2.1).sp,
    fontWeight = weight,
    textDirection = androidx.compose.ui.text.style.TextDirection.Rtl,
)

private val UrduTypography = Typography(
    headlineSmall = urduStyle(22),
    titleLarge = urduStyle(20),
    titleMedium = urduStyle(17),
    titleSmall = urduStyle(15),
    bodyLarge = urduStyle(16),
    bodyMedium = urduStyle(15),
    bodySmall = urduStyle(13),
    labelLarge = urduStyle(15),
    labelMedium = urduStyle(13),
    labelSmall = urduStyle(12),
)

private val AppColors = lightColorScheme(
    primary = Green,
    onPrimary = Color.White,
    secondary = Gold,
    background = Bg,
    surface = Color.White,
    primaryContainer = GreenLight,
)

internal fun urduNumber(n: Int): String {
    val digits = "۰۱۲۳۴۵۶۷۸۹"
    return n.toString().map { if (it.isDigit()) digits[it - '0'] else it }.joinToString("")
}

// ---------- پسندیدہ آئیڈیاز (فون میں محفوظ) ----------
private class Favorites(context: Context) {
    private val prefs = context.getSharedPreferences("favorites", Context.MODE_PRIVATE)
    var ids by mutableStateOf(prefs.getStringSet("ids", emptySet())!!.map { it.toInt() }.toSet())
        private set

    fun toggle(id: Int) {
        ids = if (id in ids) ids - id else ids + id
        prefs.edit().putStringSet("ids", ids.map { it.toString() }.toSet()).apply()
    }
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { AppRoot() }
    }
}

@Composable
internal fun AppRoot(initialFolder: Int? = null, initialIdea: Int? = null) {
    MaterialTheme(colorScheme = AppColors, typography = UrduTypography) {
        CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
            App(initialFolder, initialIdea)
        }
    }
}

@Composable
internal fun App(initialFolder: Int? = null, initialIdea: Int? = null) {
    val context = LocalContext.current
    val favorites = remember { Favorites(context) }
    var folderId by rememberSaveable { mutableStateOf(initialFolder) }
    var selectedId by rememberSaveable { mutableStateOf(initialIdea) }

    val selected = ideas.firstOrNull { it.id == selectedId }
    val folder = budgets.firstOrNull { it.id == folderId }
    when {
        selected != null -> {
            BackHandler { selectedId = null }
            DetailScreen(
                idea = selected,
                isFavorite = selected.id in favorites.ids,
                onToggleFavorite = { favorites.toggle(selected.id) },
                onBack = { selectedId = null },
            )
        }
        folder != null -> {
            BackHandler { folderId = null }
            FolderScreen(folder, favorites, onOpen = { selectedId = it.id }, onBack = { folderId = null })
        }
        else -> HomeScreen(
            favorites = favorites,
            onOpenFolder = { folderId = it.id },
            onOpen = { selectedId = it.id },
        )
    }
}

private fun budgetOf(idea: Idea) = budgets.first { it.id == idea.budget }

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun GreenTopBar(
    title: String,
    onBack: (() -> Unit)? = null,
    actions: @Composable RowScope.() -> Unit = {},
) {
    TopAppBar(
        title = { Text(title, maxLines = 1, overflow = TextOverflow.Ellipsis, style = urduStyle(20, FontWeight.Bold)) },
        navigationIcon = {
            if (onBack != null) IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "واپس") }
        },
        actions = actions,
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = Green,
            titleContentColor = Color.White,
            navigationIconContentColor = Color.White,
            actionIconContentColor = Color.White,
        ),
    )
}

// ================= ہوم اسکرین (فولڈرز) =================
@Composable
private fun HomeScreen(favorites: Favorites, onOpenFolder: (Budget) -> Unit, onOpen: (Idea) -> Unit) {
    var query by rememberSaveable { mutableStateOf("") }
    var onlyFavorites by rememberSaveable { mutableStateOf(false) }
    var showTips by rememberSaveable { mutableStateOf(false) }
    var showProfile by rememberSaveable { mutableStateOf(false) }
    var todayIdea by remember { mutableStateOf(ideas.random()) }

    val showList = query.isNotBlank() || onlyFavorites
    val filtered = ideas.filter { idea ->
        (!onlyFavorites || idea.id in favorites.ids) &&
            (query.isBlank() || idea.title.contains(query.trim()) || idea.description.contains(query.trim()))
    }

    Scaffold(
        containerColor = Bg,
        topBar = {
            GreenTopBar("انعام کاروبار") {
                IconButton(onClick = { showTips = true }) { Icon(Icons.Filled.Info, contentDescription = "مشورے") }
                IconButton(onClick = { onlyFavorites = !onlyFavorites }) {
                    Icon(
                        if (onlyFavorites) Icons.Filled.Favorite else Icons.Filled.FavoriteBorder,
                        contentDescription = "پسندیدہ",
                        tint = if (onlyFavorites) Gold else Color.White,
                    )
                }
                // RTL میں آخری ایکشن سب سے بائیں طرف آتا ہے
                ProfileAvatar(onClick = { showProfile = true })
            }
        },
    ) { padding ->
        LazyColumn(
            modifier = Modifier.padding(padding).fillMaxSize(),
            contentPadding = PaddingValues(bottom = 24.dp),
        ) {
            item {
                OutlinedTextField(
                    value = query,
                    onValueChange = { query = it },
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 10.dp),
                    placeholder = { Text("آئیڈیا تلاش کریں...") },
                    leadingIcon = { Icon(Icons.Filled.Search, null) },
                    trailingIcon = {
                        if (query.isNotEmpty()) IconButton(onClick = { query = "" }) { Icon(Icons.Filled.Clear, "صاف کریں") }
                    },
                    singleLine = true,
                    shape = RoundedCornerShape(28.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = Color.White,
                        unfocusedContainerColor = Color.White,
                    ),
                )
            }
            if (!showList) {
                item {
                    TodayCard(todayIdea, onOpen = { onOpen(todayIdea) }, onNext = { todayIdea = ideas.random() })
                }
                item {
                    Text(
                        "اپنے سرمائے کے مطابق فولڈر چنیں",
                        style = urduStyle(17, FontWeight.Bold),
                        color = Green,
                        modifier = Modifier.padding(horizontal = 20.dp, vertical = 6.dp),
                    )
                }
                items(budgets.chunked(2)) { row ->
                    Row(
                        Modifier.fillMaxWidth().padding(horizontal = 12.dp),
                        horizontalArrangement = Arrangement.spacedBy(4.dp),
                    ) {
                        row.forEach { b ->
                            Folder3DCard(b, ideas.count { it.budget == b.id }, Modifier.weight(1f), onClick = { onOpenFolder(b) })
                        }
                        if (row.size == 1) Spacer(Modifier.weight(1f))
                    }
                }
            } else {
                item {
                    Text(
                        if (onlyFavorites) "پسندیدہ آئیڈیاز (${urduNumber(filtered.size)})"
                        else "تلاش کے نتائج: ${urduNumber(filtered.size)}",
                        style = MaterialTheme.typography.titleSmall,
                        color = Color.Gray,
                        modifier = Modifier.padding(horizontal = 20.dp, vertical = 4.dp),
                    )
                }
                if (filtered.isEmpty()) {
                    item {
                        Text(
                            if (onlyFavorites) "ابھی تک کوئی پسندیدہ آئیڈیا نہیں۔ کسی آئیڈیا پر ♥ دبائیں۔"
                            else "کوئی آئیڈیا نہیں ملا۔",
                            modifier = Modifier.fillMaxWidth().padding(32.dp),
                            textAlign = TextAlign.Center,
                            color = Color.Gray,
                        )
                    }
                }
                items(filtered, key = { it.id }) { idea ->
                    IdeaCard(idea, idea.id in favorites.ids, onClick = { onOpen(idea) }, onFavorite = { favorites.toggle(idea.id) })
                }
            }
        }
    }

    if (showProfile) {
        AlertDialog(
            onDismissRequest = { showProfile = false },
            confirmButton = { TextButton(onClick = { showProfile = false }) { Text("ٹھیک ہے") } },
            text = { ProfileDialogContent() },
        )
    }

    if (showTips) {
        AlertDialog(
            onDismissRequest = { showTips = false },
            confirmButton = { TextButton(onClick = { showTips = false }) { Text("ٹھیک ہے") } },
            title = { Text("کامیاب کاروبار کے سنہری اصول", style = urduStyle(18, FontWeight.Bold)) },
            text = {
                Column(Modifier.verticalScroll(rememberScrollState())) {
                    generalTips.forEachIndexed { i, t ->
                        Text("${urduNumber(i + 1)}۔ $t", modifier = Modifier.padding(vertical = 2.dp))
                    }
                }
            },
        )
    }
}

// ================= فولڈر اسکرین =================
@Composable
private fun FolderScreen(budget: Budget, favorites: Favorites, onOpen: (Idea) -> Unit, onBack: () -> Unit) {
    val list = ideas.filter { it.budget == budget.id }
    Scaffold(
        containerColor = Bg,
        topBar = { GreenTopBar("📁 ${budget.label} روپے", onBack = onBack) },
    ) { padding ->
        LazyColumn(
            modifier = Modifier.padding(padding).fillMaxSize(),
            contentPadding = PaddingValues(vertical = 10.dp),
        ) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 6.dp),
                    colors = CardDefaults.cardColors(containerColor = Green),
                    shape = RoundedCornerShape(18.dp),
                ) {
                    Column(Modifier.padding(16.dp)) {
                        Text("سرمایہ: ${budget.amount}", color = Gold, style = urduStyle(18, FontWeight.Bold))
                        Text(
                            "اس رقم سے شروع ہونے والے ${urduNumber(list.size)} بہترین کاروباری آئیڈیاز",
                            color = Color.White,
                        )
                    }
                }
            }
            items(list, key = { it.id }) { idea ->
                IdeaCard(idea, idea.id in favorites.ids, onClick = { onOpen(idea) }, onFavorite = { favorites.toggle(idea.id) })
            }
        }
    }
}

@Composable
private fun TodayCard(idea: Idea, onOpen: () -> Unit, onNext: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 10.dp).clickable(onClick = onOpen),
        colors = CardDefaults.cardColors(containerColor = Green),
        shape = RoundedCornerShape(20.dp),
    ) {
        Column(Modifier.padding(18.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Filled.Star, null, tint = Gold)
                Spacer(Modifier.width(6.dp))
                Text("آج کا آئیڈیا", color = Gold, style = urduStyle(15, FontWeight.Bold))
                Spacer(Modifier.weight(1f))
                IconButton(onClick = onNext) { Icon(Icons.Filled.Refresh, "دوسرا آئیڈیا", tint = Color.White) }
            }
            Text(idea.title, color = Color.White, style = urduStyle(21, FontWeight.Bold))
            Text(
                idea.description,
                color = Color.White.copy(alpha = 0.9f),
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
            )
        }
    }
}

@Composable
private fun IdeaCard(idea: Idea, isFavorite: Boolean, onClick: () -> Unit, onFavorite: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 6.dp).clickable(onClick = onClick),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(2.dp),
        shape = RoundedCornerShape(16.dp),
    ) {
        Row(Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(
                Modifier.size(44.dp).background(GreenLight, CircleShape),
                contentAlignment = Alignment.Center,
            ) {
                Text("💡", fontSize = 20.sp)
            }
            Spacer(Modifier.width(12.dp))
            Column(Modifier.weight(1f)) {
                Text(idea.title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                Text(
                    "📁 ${budgetOf(idea).label}  •  ${idea.level}",
                    style = MaterialTheme.typography.bodySmall,
                    color = Green,
                )
                Text(
                    "سرمایہ: ${idea.investment}",
                    style = MaterialTheme.typography.bodySmall,
                    color = Color.Gray,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
            }
            IconButton(onClick = onFavorite) {
                Icon(
                    if (isFavorite) Icons.Filled.Favorite else Icons.Filled.FavoriteBorder,
                    contentDescription = "پسندیدہ",
                    tint = if (isFavorite) Color(0xFFE63946) else Color.Gray,
                )
            }
        }
    }
}

// ================= تفصیل اسکرین =================
@Composable
private fun DetailScreen(idea: Idea, isFavorite: Boolean, onToggleFavorite: () -> Unit, onBack: () -> Unit) {
    val context = LocalContext.current
    Scaffold(
        containerColor = Bg,
        topBar = {
            GreenTopBar(idea.title, onBack = onBack) {
                IconButton(onClick = onToggleFavorite) {
                    Icon(
                        if (isFavorite) Icons.Filled.Favorite else Icons.Filled.FavoriteBorder,
                        "پسندیدہ",
                        tint = if (isFavorite) Gold else Color.White,
                    )
                }
                IconButton(onClick = { shareIdea(context, idea) }) { Icon(Icons.Filled.Share, "شیئر کریں") }
            }
        },
    ) { padding ->
        Column(
            Modifier.padding(padding).fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp),
        ) {
            AssistChip(onClick = {}, label = { Text("📁 ${budgetOf(idea).label} روپے والے آئیڈیاز") })
            Spacer(Modifier.height(8.dp))
            Text(idea.description, style = MaterialTheme.typography.bodyLarge)
            Spacer(Modifier.height(12.dp))

            InfoRow("سرمایہ", idea.investment)
            InfoRow("متوقع آمدنی", idea.profit)
            InfoRow("مشکل کا درجہ", idea.level)

            Section("شروع کرنے کا طریقہ") {
                idea.steps.forEachIndexed { i, s ->
                    Row(Modifier.padding(vertical = 4.dp), verticalAlignment = Alignment.Top) {
                        Box(
                            Modifier.padding(top = 6.dp).size(28.dp).background(Green, CircleShape),
                            contentAlignment = Alignment.Center,
                        ) { Text(urduNumber(i + 1), color = Color.White, style = urduStyle(13, FontWeight.Bold)) }
                        Spacer(Modifier.width(10.dp))
                        Text(s, modifier = Modifier.weight(1f))
                    }
                }
            }

            Section("اہم مشورے") {
                idea.tips.forEach { t ->
                    Row(Modifier.padding(vertical = 2.dp)) {
                        Text("💡 ", style = urduStyle(15))
                        Text(t, modifier = Modifier.weight(1f))
                    }
                }
            }

            Spacer(Modifier.height(12.dp))
            Button(
                onClick = { shareIdea(context, idea) },
                modifier = Modifier.fillMaxWidth().height(54.dp),
                shape = RoundedCornerShape(14.dp),
            ) {
                Icon(Icons.Filled.Share, null)
                Spacer(Modifier.width(8.dp))
                Text("یہ آئیڈیا دوستوں کو بھیجیں")
            }
        }
    }
}

@Composable
private fun InfoRow(label: String, value: String) {
    Card(
        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
        colors = CardDefaults.cardColors(containerColor = GreenLight),
        shape = RoundedCornerShape(12.dp),
    ) {
        Row(Modifier.padding(horizontal = 14.dp, vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
            Text("$label:", color = Green, style = urduStyle(15, FontWeight.Bold))
            Spacer(Modifier.width(8.dp))
            Text(value, modifier = Modifier.weight(1f))
        }
    }
}

@Composable
private fun Section(title: String, content: @Composable ColumnScope.() -> Unit) {
    Spacer(Modifier.height(14.dp))
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        shape = RoundedCornerShape(16.dp),
    ) {
        Column(Modifier.padding(16.dp)) {
            Text(title, style = urduStyle(18, FontWeight.Bold), color = Green)
            HorizontalDivider(Modifier.padding(vertical = 6.dp), color = GreenLight)
            content()
        }
    }
}

private fun shareIdea(context: Context, idea: Idea) {
    val text = buildString {
        appendLine("💼 ${idea.title}")
        appendLine()
        appendLine(idea.description)
        appendLine()
        appendLine("سرمایہ: ${idea.investment}")
        appendLine("متوقع آمدنی: ${idea.profit}")
        appendLine()
        appendLine("شروع کرنے کا طریقہ:")
        idea.steps.forEachIndexed { i, s -> appendLine("${urduNumber(i + 1)}۔ $s") }
        appendLine()
        append("— انعام کاروبار ایپ")
    }
    val intent = Intent(Intent.ACTION_SEND).apply {
        type = "text/plain"
        putExtra(Intent.EXTRA_TEXT, text)
    }
    context.startActivity(Intent.createChooser(intent, "شیئر کریں"))
}
