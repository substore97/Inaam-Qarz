package com.inaam.karobar

import org.junit.Assert.assertEquals
import org.junit.Test

class UrduSpeechTest {
    private fun s(t: String) = UrduSpeech.spoken(t)

    @Test fun lakhs() {
        assertEquals("ایک لاکھ روپے", s("1,00,000 روپے"))
        assertEquals("ڈیڑھ لاکھ روپے", s("1,50,000 روپے"))
        assertEquals("دو لاکھ روپے", s("2,00,000 روپے"))
        assertEquals("ڈھائی لاکھ روپے", s("2,50,000 روپے"))
        assertEquals("ساڑھے تین لاکھ روپے", s("3,50,000 روپے"))
        assertEquals("سوا لاکھ", s("1,25,000"))
        assertEquals("دس لاکھ روپے", s("10,00,000 روپے"))
        assertEquals("ایک لاکھ بیس ہزار", s("1,20,000"))
        assertEquals("دو لاکھ پینتیس ہزار", s("2,35,000"))
    }

    @Test fun thousands() {
        assertEquals("پچاس ہزار روپے", s("50,000 روپے"))
        assertEquals("پچیس ہزار سے ستر ہزار روپے ماہانہ", s("25,000 سے 70,000 روپے ماہانہ"))
        assertEquals("ڈیڑھ ہزار", s("1,500"))
        assertEquals("پچاس ہزار", s("50 ہزار"))
        assertEquals("ایک لاکھ", s("1 لاکھ"))
    }

    @Test fun smallAndRanges() {
        assertEquals("تین سے چھ مہینے", s("3 سے 6 مہینے"))
        assertEquals("دس سے پندرہ دن", s("10-15 دن"))
        assertEquals("سو", s("100"))
        assertEquals("ایک سو بیس", s("120"))
        assertEquals("ایک لاکھ سے زیادہ", s("1,00,000+"))
        assertEquals("ڈیڑھ لاکھ", s("1.5 لاکھ"))
        assertEquals("تیسرا قدم", "${UrduSpeech.ordinal(3)} قدم")
    }

    @Test fun cleanup() {
        assertEquals("سرمایہ، کیمرہ، لینس", s("💰 سرمایہ (کیمرہ، لینس)"))
        assertEquals("موبائل یا لیپ ٹاپ", s("موبائل/لیپ ٹاپ"))
    }

    @Test fun allIdeasSpeakWithoutDigits() {
        val bad = ideas.flatMap { listOf(it.investment, it.profit) + it.steps + it.tips }
            .map { s(it) }.filter { t -> t.any { it.isDigit() } }
        assertEquals(emptyList<String>(), bad.take(5))
    }
}
