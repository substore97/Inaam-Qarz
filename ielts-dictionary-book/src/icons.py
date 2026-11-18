# 20 simple two-tone line icons (viewBox 0 0 64 64) – one per topic.
# Drawn with the topic accent colour (stroke) and its pale tint (fill).
ICONS = {
 1: '<path class="f" d="M32 14 L60 26 L32 38 L4 26 Z"/><path d="M14 31 V44 C14 50 50 50 50 44 V31"/><path d="M60 26 V40"/><circle class="f" cx="60" cy="42" r="2.5"/>',
 2: '<path class="f" d="M14 50 C10 26 26 12 54 10 C54 38 40 54 14 50 Z"/><path d="M14 50 C24 40 32 32 44 22"/><path d="M8 58 L14 50"/>',
 3: '<rect class="f" x="12" y="14" width="40" height="28" rx="3"/><path d="M6 48 H58 L54 54 H10 Z"/><path d="M26 28 L30 32 L38 24"/>',
 4: '<path class="f" d="M32 54 C10 40 6 28 10 20 C14 12 26 10 32 20 C38 10 50 12 54 20 C58 28 54 40 32 54 Z"/><path d="M14 32 H24 L28 24 L34 40 L38 32 H50"/>',
 5: '<rect class="f" x="8" y="20" width="48" height="32" rx="4"/><path d="M24 20 V14 H40 V20"/><path d="M8 34 H56"/><rect x="28" y="31" width="8" height="7" rx="1.5"/>',
 6: '<rect class="f" x="6" y="18" width="52" height="28" rx="4"/><circle cx="32" cy="32" r="7"/><path d="M14 26 V38 M50 26 V38"/>',
 7: '<path d="M32 10 V54 M20 54 H44 M12 18 H52"/><path d="M12 18 L4 36 H20 Z" class="f"/><path d="M52 18 L44 36 H60 Z" class="f"/>',
 8: '<path class="f" d="M8 24 L32 10 L56 24 Z"/><path d="M8 52 H56 M10 58 H54"/><path d="M16 28 V48 M27 28 V48 M37 28 V48 M48 28 V48"/>',
 9: '<rect class="f" x="8" y="12" width="40" height="40" rx="3"/><path d="M48 22 H56 V48 C56 51 54 52 52 52 H12"/><path d="M15 20 H41 M15 28 H27 M15 35 H27 M15 42 H41"/><rect x="31" y="27" width="10" height="9"/>',
 10: '<path class="f" d="M26 8 H38 M28 8 V26 L12 52 C10 56 12 58 16 58 H48 C52 58 54 56 52 52 L36 26 V8"/><path d="M18 44 H46"/><circle cx="28" cy="50" r="2"/><circle cx="38" cy="48" r="1.6"/>',
 11: '<path class="f" d="M30 8 C34 8 35 12 35 16 V26 L58 38 V44 L35 37 V50 L42 55 V59 L32 56 L22 59 V55 L29 50 V37 L6 44 V38 L29 26 V16 C29 12 28 8 30 8 Z"/>',
 12: '<path class="f" d="M6 56 V30 H20 V56 M20 56 V14 H38 V56 M38 56 V24 H58 V56"/><path d="M4 56 H60 M26 22 H32 M26 30 H32 M26 38 H32 M44 32 H52 M44 40 H52 M10 38 H16"/>',
 13: '<path class="f" d="M8 30 L32 10 L56 30 V56 H8 Z"/><path d="M32 48 C22 41 21 35 24 32 C27 29 31 31 32 34 C33 31 37 29 40 32 C43 35 42 41 32 48 Z"/>',
 14: '<path class="f" d="M32 8 C14 8 6 22 8 34 C10 46 20 50 26 46 C30 43 28 38 32 36 C38 33 44 40 50 36 C58 30 56 8 32 8 Z"/><circle cx="20" cy="26" r="3.5"/><circle cx="31" cy="18" r="3.5"/><circle cx="43" cy="21" r="3.5"/>',
 15: '<circle class="f" cx="32" cy="32" r="24"/><path d="M8 32 H56 M32 8 C20 20 20 44 32 56 M32 8 C44 20 44 44 32 56 M12 20 H52 M12 44 H52"/>',
 16: '<path class="f" d="M36 6 L12 36 H30 L26 58 L52 26 H34 Z"/>',
 17: '<path d="M32 58 V14"/><path class="f" d="M32 16 C24 14 22 8 24 4 C30 6 32 10 32 16 Z M32 16 C40 14 42 8 40 4 C34 6 32 10 32 16 Z M32 28 C23 26 20 19 22 15 C29 17 32 22 32 28 Z M32 28 C41 26 44 19 42 15 C35 17 32 22 32 28 Z M32 40 C23 38 20 31 22 27 C29 29 32 34 32 40 Z M32 40 C41 38 44 31 42 27 C35 29 32 34 32 40 Z"/>',
 18: '<path class="f" d="M18 8 H46 V22 C46 32 40 38 32 38 C24 38 18 32 18 22 Z"/><path d="M18 14 H8 C8 24 12 28 18 28 M46 14 H56 C56 24 52 28 46 28 M32 38 V48 M22 56 H42 L40 48 H24 Z"/>',
 19: '<ellipse class="f" cx="32" cy="44" rx="13" ry="11"/><ellipse class="f" cx="14" cy="30" rx="5.5" ry="7"/><ellipse class="f" cx="25" cy="17" rx="5.5" ry="7.5"/><ellipse class="f" cx="39" cy="17" rx="5.5" ry="7.5"/><ellipse class="f" cx="50" cy="30" rx="5.5" ry="7"/>',
 20: '<path d="M8 8 V56 H58"/><path class="f" d="M8 50 L20 38 L30 44 L44 22 L56 28 V56 H8 Z"/><path d="M8 50 L20 38 L30 44 L44 22 L56 28"/>',
 'book': '<path class="f" d="M32 14 C24 8 12 8 6 12 V54 C12 50 24 50 32 56 C40 50 52 50 58 54 V12 C52 8 40 8 32 14 Z"/><path d="M32 14 V56"/>',
}


def icon(k, cls='ic'):
    return f'<svg class="{cls}" viewBox="0 0 64 64" fill="none" stroke-linecap="round" stroke-linejoin="round">{ICONS[k]}</svg>'
