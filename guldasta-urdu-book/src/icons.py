# Line icons (viewBox 64), ornaments and the geometric pattern for «گلدستہ».
def _i(body):
    return f'<svg viewBox="0 0 64 64" stroke-linecap="round" stroke-linejoin="round">{body}</svg>'

ICON = {
 'quran': _i('<path class="f" d="M32 20 C24 14 14 14 8 17 V48 C14 45 24 45 32 51 C40 45 50 45 56 48 V17 C50 14 40 14 32 20 Z"/><path d="M32 20 V51 M14 56 L32 44 L50 56"/>'),
 'hadith': _i('<path class="f" d="M16 10 H44 C48 10 50 12 50 16 V54 H20 C16 54 14 52 14 48 V12"/><path d="M14 48 C14 44 16 42 20 42 H50 M22 20 H42 M22 27 H42 M22 34 H36"/>'),
 'seerat': _i('<path class="f" d="M14 54 V34 C14 22 22 16 32 12 C42 16 50 22 50 34 V54 Z"/><path d="M32 12 V6 M28 8 C30 6 34 6 36 8 M8 54 H56 M26 54 V42 C26 38 38 38 38 42 V54"/>'),
 'anbiya': _i('<path class="f" d="M20 30 H44 L40 50 H24 Z"/><path d="M32 30 C26 24 28 16 32 10 C36 16 38 24 32 30 Z M18 56 H46 M32 50 V56"/>'),
 'sahaba': _i('<path class="f" d="M32 6 L39 22 L56 24 L43 36 L47 54 L32 45 L17 54 L21 36 L8 24 L25 22 Z"/>'),
 'story': _i('<path class="f" d="M10 14 H28 C30 14 32 16 32 18 V54 C32 52 30 50 28 50 H10 Z M54 14 H36 C34 14 32 16 32 18 V54 C32 52 34 50 36 50 H54 Z"/><path d="M16 24 H26 M16 31 H26 M38 24 H48 M38 31 H48"/>'),
 'islah': _i('<path class="f" d="M32 54 C12 42 8 30 12 22 C16 14 27 13 32 22 C37 13 48 14 52 22 C56 30 52 42 32 54 Z"/><path d="M22 30 L29 37 L42 24"/>'),
 'science': _i('<circle class="f" cx="32" cy="32" r="6"/><ellipse cx="32" cy="32" rx="25" ry="10"/><ellipse cx="32" cy="32" rx="25" ry="10" transform="rotate(60 32 32)"/><ellipse cx="32" cy="32" rx="25" ry="10" transform="rotate(120 32 32)"/>'),
 'history': _i('<path class="f" d="M18 8 H46 C46 22 36 26 36 32 C36 38 46 42 46 56 H18 C18 42 28 38 28 32 C28 26 18 22 18 8 Z"/><path d="M14 8 H50 M14 56 H50 M24 50 C26 44 38 44 40 50"/>'),
 'health': _i('<path class="f" d="M32 54 C12 42 8 30 12 22 C16 14 27 13 32 22 C37 13 48 14 52 22 C56 30 52 42 32 54 Z"/><path d="M14 33 H24 L28 25 L34 41 L38 33 H50"/>'),
 'kitchen': _i('<path class="f" d="M10 28 H54 V40 C54 50 46 54 38 54 H26 C18 54 10 50 10 40 Z"/><path d="M6 28 H58 M24 22 C24 18 28 18 28 14 M36 22 C36 18 40 18 40 14"/>'),
 'travel': _i('<circle class="f" cx="32" cy="32" r="22"/><path d="M10 32 H54 M32 10 C22 20 22 44 32 54 M32 10 C42 20 42 44 32 54"/>'),
 'fun': _i('<circle class="f" cx="32" cy="32" r="24"/><path d="M20 38 C24 46 40 46 44 38"/><circle cx="24" cy="26" r="2.5"/><circle cx="40" cy="26" r="2.5"/>'),
 'riddle': _i('<circle class="f" cx="32" cy="32" r="24"/><path d="M24 25 C24 18 40 17 40 25 C40 31 32 31 32 38 M32 46 V47"/>'),
 'dua': _i('<path class="f" d="M40 10 C28 12 20 22 20 34 C20 46 30 54 42 54 C34 50 28 42 28 32 C28 22 33 14 40 10 Z"/><path d="M46 22 L48 27 L53 27 L49 30 L51 35 L46 32 L41 35 L43 30 L39 27 L44 27 Z"/>'),
 'health2': _i('<path class="f" d="M24 8 H40 V24 H56 V40 H40 V56 H24 V40 H8 V24 H24 Z"/>'),
}

ORN = ('<svg class="orn" viewBox="0 0 220 16"><path d="M4 8 H86 M134 8 H216" stroke="var(--a2)" stroke-width="1.4"/>'
       '<path d="M110 1 L117 8 L110 15 L103 8 Z" fill="var(--a2)"/><circle cx="94" cy="8" r="2.6" fill="var(--a2)"/>'
       '<circle cx="126" cy="8" r="2.6" fill="var(--a2)"/></svg>')

PATTERN = ('<svg class="pat" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 1130">'
           '<defs><pattern id="st" width="80" height="80" patternUnits="userSpaceOnUse">'
           '<path d="M40 6 L50 30 L74 40 L50 50 L40 74 L30 50 L6 40 L30 30 Z M40 18 L58 40 L40 62 L22 40 Z" fill="none" stroke="#fff" stroke-width="2"/>'
           '<rect x="28" y="28" width="24" height="24" transform="rotate(45 40 40)" fill="none" stroke="#fff" stroke-width="1.5"/>'
           '</pattern></defs><rect width="800" height="1130" fill="url(#st)"/></svg>')

FLOURISH = ('<svg viewBox="0 0 300 150" fill="none" stroke="#c9a24a" stroke-width="3" stroke-linecap="round">'
            '<path d="M150 20 C150 60 120 80 90 80 C60 80 50 60 64 50 C78 40 92 56 82 66"/>'
            '<path d="M150 20 C150 60 180 80 210 80 C240 80 250 60 236 50 C222 40 208 56 218 66"/>'
            '<path d="M30 110 H120 M180 110 H270"/><path d="M150 92 L164 110 L150 128 L136 110 Z" fill="#c9a24a"/>'
            '<circle cx="150" cy="20" r="6" fill="#c9a24a"/></svg>')
