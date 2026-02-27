'use client'

// Key Islamic / pilgrimage terms to highlight in gold
const KEY_TERMS = [
  'Masjid al-Haram',
  'Hajar al-Aswad',
  'Black Stone',
  'Maqam Ibrahim',
  'Prophet Muhammad',
  'Prophet Ibrahim',
  'Zamzam',
  'Kaaba',
  "Ka'bah",
  'Tawaf',
  "Sa'i",
  'Ihram',
  'Talbiyah',
  'Arafah',
  'Arafat',
  'Mecca',
  'Makkah',
  'Medina',
  'Madinah',
  'Safa',
  'Marwa',
  'Hajj',
  'Umrah',
  'Ibrahim',
  'Ismail',
  'Ishmael',
  'Hajar',
  'Hagar',
  'Mina',
  'Jamarat',
  'Muzdalifah',
  'Qibla',
  'Kiswah',
  'Wuquf',
]

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

type Part = { text: string; isKey: boolean }

function parseText(text: string): Part[] {
  // Sort by length descending so longer matches take priority
  const sorted = [...KEY_TERMS].sort((a, b) => b.length - a.length)
  const pattern = new RegExp(`(${sorted.map(escapeRegex).join('|')})`, 'gi')

  const parts: Part[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index), isKey: false })
    }
    parts.push({ text: match[0], isKey: true })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), isKey: false })
  }

  return parts.length > 0 ? parts : [{ text, isKey: false }]
}

interface EditorialTextProps {
  text: string
  className?: string
}

export function EditorialText({ text, className }: EditorialTextProps) {
  const parts = parseText(text)

  return (
    <p
      className={
        className ??
        'text-[17px] leading-[1.72] text-foreground font-sans tracking-[-0.01em]'
      }
    >
      {parts.map((part, i) =>
        part.isKey ? (
          <span key={i} className="text-pilgrim-gold font-medium">
            {part.text}
          </span>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </p>
  )
}
