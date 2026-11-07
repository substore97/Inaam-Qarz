package com.inaam.karobar

/** تمام آئیڈیاز، فولڈر کی ترتیب سے */
val ideas: List<Idea> by lazy {
    (baseIdeas + ideasA + ideasB + ideasC + ideasD + ideasE + ideasF + ideasG + ideasH + ideasI +
        more01 + more02 + more03 + more04 + more05 + more06 + more07 + more08 + more09 + more10 + more11 +
        replR1 + replR2 + replR3 + replR4 + replR5).sortedBy { it.budget }
}
