const COLORS = [
  { text: '#00d4ff', border: 'rgba(0,212,255,0.3)', bg: 'rgba(0,212,255,0.08)' },
  { text: '#7b2fff', border: 'rgba(123,47,255,0.3)', bg: 'rgba(123,47,255,0.08)' },
  { text: '#ff2d78', border: 'rgba(255,45,120,0.3)', bg: 'rgba(255,45,120,0.08)' },
  { text: '#00ff87', border: 'rgba(0,255,135,0.3)', bg: 'rgba(0,255,135,0.08)' },
  { text: '#ffb800', border: 'rgba(255,184,0,0.3)', bg: 'rgba(255,184,0,0.08)' },
]

export default function ThemeBadge({ label, index = 0 }: { label: string; index?: number }) {
  const color = COLORS[index % COLORS.length]
  return (
    <span
      className="theme-badge"
      style={{ color: color.text, borderColor: color.border, background: color.bg }}
    >
      {label}
    </span>
  )
}
