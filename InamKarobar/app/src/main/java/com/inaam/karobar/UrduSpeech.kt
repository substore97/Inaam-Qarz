package com.inaam.karobar

import android.content.Context
import android.content.Intent
import android.speech.tts.TextToSpeech
import android.speech.tts.Voice
import java.util.Locale

/**
 * اردو آواز کے لیے متن کی تیاری:
 * ہندسوں کو اردو الفاظ میں بدلنا (1,00,000 → ایک لاکھ، 2,50,000 → ڈھائی لاکھ)
 * اور ایسے نشانات ہٹانا جنہیں آواز غلط پڑھتی ہے۔
 */
object UrduSpeech {

    private val units = arrayOf(
        "صفر", "ایک", "دو", "تین", "چار", "پانچ", "چھ", "سات", "آٹھ", "نو",
        "دس", "گیارہ", "بارہ", "تیرہ", "چودہ", "پندرہ", "سولہ", "سترہ", "اٹھارہ", "انیس",
        "بیس", "اکیس", "بائیس", "تئیس", "چوبیس", "پچیس", "چھبیس", "ستائیس", "اٹھائیس", "انتیس",
        "تیس", "اکتیس", "بتیس", "تینتیس", "چونتیس", "پینتیس", "چھتیس", "سینتیس", "اڑتیس", "انتالیس",
        "چالیس", "اکتالیس", "بیالیس", "تینتالیس", "چوالیس", "پینتالیس", "چھیالیس", "سینتالیس", "اڑتالیس", "انچاس",
        "پچاس", "اکیاون", "باون", "ترپن", "چون", "پچپن", "چھپن", "ستاون", "اٹھاون", "انسٹھ",
        "ساٹھ", "اکسٹھ", "باسٹھ", "تریسٹھ", "چونسٹھ", "پینسٹھ", "چھیاسٹھ", "سڑسٹھ", "اڑسٹھ", "انہتر",
        "ستر", "اکہتر", "بہتر", "تہتر", "چوہتر", "پچھتر", "چھہتر", "ستتر", "اٹھہتر", "اناسی",
        "اسی", "اکیاسی", "بیاسی", "تراسی", "چوراسی", "پچاسی", "چھیاسی", "ستاسی", "اٹھاسی", "نواسی",
        "نوے", "اکانوے", "بانوے", "ترانوے", "چورانوے", "پچانوے", "چھیانوے", "ستانوے", "اٹھانوے", "ننانوے",
    )

    private val ordinals = arrayOf(
        "پہلا", "دوسرا", "تیسرا", "چوتھا", "پانچواں", "چھٹا", "ساتواں", "آٹھواں", "نواں", "دسواں",
    )

    /** پہلا، دوسرا، تیسرا ... */
    fun ordinal(n: Int): String = if (n in 1..ordinals.size) ordinals[n - 1] else "${words(n.toLong())}واں"

    /**
     * ڈیڑھ، ڈھائی، ساڑھے اور سوا والی بول چال:
     * 1,50,000 → ڈیڑھ لاکھ، 2,50,000 → ڈھائی لاکھ، 3,50,000 → ساڑھے تین لاکھ، 1,25,000 → سوا لاکھ
     */
    private fun fractional(n: Long, unit: Long, name: String): String? {
        if (n < unit || n % (unit / 4) != 0L) return null
        val whole = n / unit
        val rest = n % unit
        return when {
            rest == unit / 2 && whole == 1L -> "ڈیڑھ $name"
            rest == unit / 2 && whole == 2L -> "ڈھائی $name"
            rest == unit / 2 -> "ساڑھے ${words(whole)} $name"
            rest == unit / 4 && whole == 1L -> "سوا $name"
            rest == unit / 4 -> "سوا ${words(whole)} $name"
            else -> null
        }
    }

    /** کوئی بھی عدد اردو الفاظ میں (پاکستانی طریقہ: ہزار، لاکھ، کروڑ) */
    fun words(n: Long): String {
        if (n < 0) return "منفی " + words(-n)
        if (n < 100) return units[n.toInt()]
        // بڑی رقموں میں ڈیڑھ/ڈھائی/ساڑھے
        when {
            n >= 1_00_00_000 -> fractional(n, 1_00_00_000, "کروڑ")
            n >= 1_00_000 -> fractional(n, 1_00_000, "لاکھ")
            n >= 1_000 -> fractional(n, 1_000, "ہزار")
            else -> null
        }?.let { return it }

        val parts = mutableListOf<String>()
        var r = n
        val crore = r / 1_00_00_000; r %= 1_00_00_000
        val lakh = r / 1_00_000; r %= 1_00_000
        val thousand = r / 1_000; r %= 1_000
        val hundred = r / 100; r %= 100
        if (crore > 0) parts += words(crore) + " کروڑ"
        if (lakh > 0) parts += units[lakh.toInt()] + " لاکھ"
        if (thousand > 0) parts += units[thousand.toInt()] + " ہزار"
        if (hundred > 0) parts += if (hundred == 1L && parts.isEmpty() && r == 0L) "سو" else units[hundred.toInt()] + " سو"
        if (r > 0) parts += units[r.toInt()]
        return parts.joinToString(" ")
    }

    /**
     * عام الفاظ پر اعراب (زیر، زبر، پیش) تاکہ آواز صحیح تلفظ کرے۔
     * صرف بولنے کے لیے، اسکرین پر لکھائی ویسی ہی رہتی ہے۔
     */
    private val pronunciation = mapOf(
        "منافع" to "مُنافَع", "متوقع" to "مُتَوَقَّع", "مشکل" to "مُشکِل", "درجہ" to "دَرجہ",
        "سرمایہ" to "سَرمایہ", "سرمائے" to "سَرمائے", "قدم" to "قَدَم", "مشورے" to "مَشوَرے",
        "گاہک" to "گاہَک", "گاہکوں" to "گاہَکوں", "معیار" to "مِعیار", "معیاری" to "مِعیاری",
        "تشہیر" to "تَشہیر", "مستقل" to "مُستَقِل", "مختلف" to "مُختَلِف", "تجربہ" to "تَجرِبہ",
        "تجربہ کار" to "تَجرِبہ کار", "تربیت" to "تَربِیَت", "ماہر" to "ماہِر", "معاہدہ" to "مُعاہِدہ",
        "مقامی" to "مُقامی", "ضرورت" to "ضَرورَت", "سہولت" to "سَہولَت", "حساب" to "حِساب",
        "خواتین" to "خَواتِین", "اعتماد" to "اِعتِماد", "محفوظ" to "مَحفوظ", "مکمل" to "مُکَمَّل",
        "طلبہ" to "طَلَبہ", "خالص" to "خالِص", "تنصیب" to "تَنصیب", "مناسب" to "مُناسِب",
        "ابتدائی" to "اِبتِدائی", "مقبول" to "مَقبول", "منڈی" to "مَنڈی", "دکان" to "دُکان",
        "دکانوں" to "دُکانوں", "دکانیں" to "دُکانیں", "کرایہ" to "کِرایہ", "کرائے" to "کِرائے",
        "تقریبات" to "تَقریبات", "اضافی" to "اِضافی", "مہینے" to "مَہینے", "ہنر" to "ہُنَر",
        "قیمت" to "قِیمَت", "مرمت" to "مَرَمَّت", "ترسیل" to "تَرسِیل", "استعمال" to "اِستِعمال",
        "انتظام" to "اِنتِظام", "علاقے" to "عِلاقے", "علاقوں" to "عِلاقوں", "قریب" to "قَریب",
        "قریبی" to "قَریبی", "فروخت" to "فَروخت", "تیار" to "تَیّار", "آمدنی" to "آمَدَنی",
        "کاروبار" to "کاروبار", "مشین" to "مَشین", "مشینیں" to "مَشینیں", "بہت" to "بَہُت",
        "تاکہ" to "تاکہ", "مانگ" to "مانگ", "اوزار" to "اَوزار", "سیکھیں" to "سیکھیں",
        "کرنے" to "کَرنے", "مستقل" to "مُستَقِل", "دفاتر" to "دَفاتِر", "دفتر" to "دَفتَر",
        "حاصل" to "حاصِل", "نمونے" to "نَمونے", "عید" to "عید", "مقصد" to "مَقصَد",
        "ضروری" to "ضَروری", "ذریعے" to "ذَریعے", "اجازت" to "اِجازَت", "نسل" to "نَسل",
        "قابل" to "قابِل", "والدین" to "والِدَین", "کلینک" to "کلِینِک", "زرعی" to "زَرعی",
        "مقبول" to "مَقبول", "محلے" to "مَحَلّے", "ذخیرہ" to "ذَخیرہ", "مفت" to "مُفت",
        "صنعتی" to "صَنعَتی", "خریداری" to "خَریداری", "تقریباً" to "تَقریباً", "مطابق" to "مُطابِق",
        "منصوبہ" to "مَنصوبہ", "معلومات" to "مَعلومات", "مضبوط" to "مَضبوط", "کمیشن" to "کمِیشَن",
        "متوجہ" to "مُتَوَجِّہ", "مسلسل" to "مُسَلسَل", "صحت" to "صِحَّت", "حفاظتی" to "حِفاظَتی",
        "فوراً" to "فَوراً", "ہمیشہ" to "ہَمیشہ", "روزمرہ" to "روزمَرّہ", "مزید" to "مَزید",
    )
    private val pronunciationRegex = Regex(
        "(?<![\\p{L}\\p{M}])(" + pronunciation.keys.sortedByDescending { it.length }
            .joinToString("|") { Regex.escape(it) } + ")(?![\\p{L}\\p{M}])",
    )

    private val easternDigits = "۰۱۲۳۴۵۶۷۸۹"
    private val numberRegex = Regex("""\d[\d,]*(?:\.\d+)?""")
    private val emojiRegex = Regex("[\\x{1F000}-\\x{1FAFF}\\x{2600}-\\x{27BF}\\x{FE0F}\\x{200D}\\x{2B00}-\\x{2BFF}]")

    /** متن کو بولنے کے قابل اردو بنانا */
    fun spoken(text: String): String {
        var s = text
        // اردو ہندسے → انگریزی ہندسے تاکہ ایک ہی طریقے سے پڑھے جائیں
        s = s.map { c -> val i = easternDigits.indexOf(c); if (i >= 0) ('0' + i) else c }.joinToString("")
        s = emojiRegex.replace(s, "")
        // حدود: 10-15 → 10 سے 15
        s = Regex("""(\d[\d,]*)\s*[-–]\s*(\d[\d,]*)""").replace(s) { "${it.groupValues[1]} سے ${it.groupValues[2]}" }
        // 1,00,000+ → ایک لاکھ سے زیادہ
        s = Regex("""(\d[\d,]*)\s*\+""").replace(s) { "${it.groupValues[1]} سے زیادہ" }
        s = s.replace("%", " فیصد")
        s = numberRegex.replace(s) { m ->
            val raw = m.value.replace(",", "")
            if (raw.contains('.')) {
                val (a, b) = raw.split('.', limit = 2)
                if (b == "5" && a.isNotEmpty()) {
                    when (a) { "1" -> "ڈیڑھ"; "2" -> "ڈھائی"; else -> "ساڑھے " + words(a.toLong()) }
                } else {
                    words(a.toLongOrNull() ?: 0) + " اعشاریہ " + b.map { units[it - '0'] }.joinToString(" ")
                }
            } else {
                raw.toLongOrNull()?.let { words(it) } ?: m.value
            }
        }
        // ایسے نشانات جو آواز میں عجیب لگتے ہیں
        s = s.replace("(", "، ").replace(")", "، ")
            .replace("/", " یا ")
            .replace("•", "، ")
            .replace("—", "، ")
            .replace("–", "، ")
            .replace("…", "۔ ")
            .replace("...", "۔ ")
            .replace("\"", "")
            .replace("'", "")
            .replace(":", "، ")
        s = Regex("""\s*،\s*(،\s*)+""").replace(s, "، ")
        s = Regex("""\s+""").replace(s, " ").trim()
        s = pronunciationRegex.replace(s) { pronunciation[it.value] ?: it.value }
        s = Regex("""\s+،""").replace(s, "،")
        s = Regex("""،\s*۔""").replace(s, "۔")
        return s.trim(' ', '،')
    }

    /** جملوں کے درمیان مختصر وقفے کے ساتھ بولنا */
    fun speak(tts: TextToSpeech, text: String, id: String) {
        val sentences = spoken(text).split("۔", "؟", "!").map { it.trim(' ', '،') }.filter { it.isNotEmpty() }
        sentences.forEachIndexed { i, sentence ->
            tts.speak(sentence, if (i == 0) TextToSpeech.QUEUE_FLUSH else TextToSpeech.QUEUE_ADD, null, "$id-$i")
            tts.playSilentUtterance(320, TextToSpeech.QUEUE_ADD, "$id-gap$i")
        }
    }

    const val GOOGLE_TTS = "com.google.android.tts"
    private const val PREFS = "speech"

    /** Google کا آواز انجن موجود ہو تو وہی استعمال کریں، اس کی اردو سب سے بہتر ہے */
    fun engineFor(context: Context): String? =
        runCatching { context.packageManager.getPackageInfo(GOOGLE_TTS, 0); GOOGLE_TTS }.getOrNull()

    fun urduVoices(tts: TextToSpeech): List<Voice> = runCatching {
        tts.voices.orEmpty()
            .filter { it.locale.language == "ur" && !it.features.orEmpty().contains("notInstalled") }
            .sortedWith(
                compareByDescending<Voice> { it.locale.country == "PK" }
                    .thenBy { it.isNetworkConnectionRequired }
                    .thenByDescending { it.quality }
                    .thenBy { it.name },
            )
    }.getOrDefault(emptyList())

    fun savedVoice(context: Context): String? =
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString("voice", null)

    fun savedRate(context: Context): Float =
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getFloat("rate", 0.88f)

    fun save(context: Context, voice: String?, rate: Float) {
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit()
            .putString("voice", voice).putFloat("rate", rate).apply()
    }

    /** آواز کا قابلِ فہم نام: آواز ۱ (پاکستانی، انٹرنیٹ) */
    fun label(v: Voice, index: Int): String {
        val country = when (v.locale.country) { "PK" -> "پاکستانی"; "IN" -> "بھارتی"; else -> "اردو" }
        val net = if (v.isNetworkConnectionRequired) "انٹرنیٹ والی، زیادہ قدرتی" else "فون میں محفوظ"
        return "آواز ${urduNumber(index + 1)} ($country، $net)"
    }

    /** اردو آواز کا ڈیٹا انسٹال کرنے کی اسکرین */
    fun installIntent(): Intent = Intent(TextToSpeech.Engine.ACTION_INSTALL_TTS_DATA).apply {
        setPackage(GOOGLE_TTS)
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    }

    /**
     * اردو زبان سیٹ کرنا اور محفوظ کی گئی یا سب سے اچھی اردو آواز چننا۔
     * واپس: true اگر اردو دستیاب ہے۔
     */
    fun setup(tts: TextToSpeech, context: Context): Boolean {
        val ok = listOf(Locale("ur", "PK"), Locale("ur", "IN"), Locale("ur")).any { loc ->
            val r = tts.setLanguage(loc)
            r != TextToSpeech.LANG_MISSING_DATA && r != TextToSpeech.LANG_NOT_SUPPORTED
        }
        if (!ok) return false
        runCatching {
            val voices = urduVoices(tts)
            val chosen = voices.firstOrNull { it.name == savedVoice(context) } ?: voices.firstOrNull()
            if (chosen != null) tts.voice = chosen
        }
        tts.setSpeechRate(savedRate(context))
        tts.setPitch(1.0f)
        return true
    }
}
