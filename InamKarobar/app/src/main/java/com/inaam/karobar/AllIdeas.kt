package com.inaam.karobar

/** تمام آئیڈیاز، فولڈر کی ترتیب سے */
val ideas: List<Idea> by lazy {
    (baseIdeas + ideasA + ideasB + ideasC + ideasD + ideasE + ideasF + ideasG + ideasH + ideasI).sortedBy { it.budget }
}
