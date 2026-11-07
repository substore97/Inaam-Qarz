package com.inaam.karobar

/** تمام آئیڈیاز، فولڈر کی ترتیب سے */
val ideas: List<Idea> by lazy {
    (baseIdeas + ideasA + ideasB + ideasC).sortedBy { it.budget }
}
