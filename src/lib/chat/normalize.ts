// src/lib/chat/normalize.ts
// Make rigid, ALL-CAPS bot text look human + lightly formatted.

export function soften(text: string): string {
  if (!text) return text;
  let t = text.trim();

  // Map ALL-CAPS labels to emoji + bold Title Case
  // Add whatever you emit on the server here:
  const labelEmoji: Record<string, string> = {
    'FUTURE DRAFT MONEY': '💰',
    'DRAFT BUDGET': '💵',
    'TRADE': '🔁',
    'WAIVER': '🧾',
    'RESULTS': '📊',
    'STANDING': '🏆',        // NEW
    'STANDINGS': '🏆',       // NEW
  };

  // 1) Label lines like "STANDING:" → "🏆 **Standing:**"
  t = t.replace(/^([A-Z][A-Z ]{2,})(:)/gm, (_, label, _colon) => {
    const key = label.trim();
    const emoji = labelEmoji[key] ?? '•';
    const nice = toTitleCase(key.toLowerCase());
    return `${emoji} **${nice}:**`;
  });

  // 2) Tone: reduce shouty words (>=4 caps) to Title Case
  t = t.replace(/\b([A-Z]{4,})\b/g, (m) => toTitleCase(m.toLowerCase()));

  // 3) Typography: normalize hyphen-minus to en dash around numbers/phrases
  t = t.replace(/ ?- ?/g, ' — ');

  // 4) Emphasis: bold plain numbers like “9 wins” → “**9** wins”
  t = t.replace(/\b(\d+)(\s+(wins?|losses?|ties?))\b/gi, '**$1**$2');

  // 5) Gentle contractions
  t = t.replace(/\bis not\b/gi, "isn't").replace(/\bdo not\b/gi, "don't");

  // 6) Ensure lines end with punctuation (light heuristic)
  t = t.replace(/([^\.\!\?\n])\n/g, '$1.\n');

  return t;
}

export function toTitleCase(s: string) {
  return s.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1));
}
