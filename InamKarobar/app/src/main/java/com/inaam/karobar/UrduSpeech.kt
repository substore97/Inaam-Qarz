package com.inaam.karobar

import android.speech.tts.TextToSpeech
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

    /**
     * اردو زبان سیٹ کرنا اور فون میں موجود سب سے اچھی اردو آواز چننا۔
     * واپس: true اگر اردو دستیاب ہے۔
     */
    fun setup(tts: TextToSpeech): Boolean {
        val ok = listOf(Locale("ur", "PK"), Locale("ur", "IN"), Locale("ur")).any { loc ->
            val r = tts.setLanguage(loc)
            r != TextToSpeech.LANG_MISSING_DATA && r != TextToSpeech.LANG_NOT_SUPPORTED
        }
        if (!ok) return false
        runCatching {
            val best = tts.voices
                ?.filter { it.locale.language == "ur" && !it.features.contains("notInstalled") }
                ?.sortedWith(
                    compareByDescending<android.speech.tts.Voice> { it.locale.country == "PK" }
                        .thenByDescending { it.quality }
                        .thenBy { it.isNetworkConnectionRequired },
                )
                ?.firstOrNull()
            if (best != null) tts.voice = best
        }
        tts.setSpeechRate(0.88f)
        tts.setPitch(1.0f)
        return true
    }
}
