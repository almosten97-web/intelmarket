const CONFIG = {
  bullish:  { label: '↑ Bullish',  className: 'sentiment-bullish', dot: '#00ff87' },
  neutral:  { label: '→ Neutral',  className: 'sentiment-neutral',  dot: '#00d4ff' },
  cautious: { label: '↓ Cautious', className: 'sentiment-cautious', dot: '#ff2d78' },
}

export default function SentimentBadge({ sentiment }: { sentiment: 'bullish' | 'neutral' | 'cautious' }) {
  const cfg = CONFIG[sentiment] || CONFIG.neutral
  return (
    <span className={`theme-badge ${cfg.className}`}>
      <span
        className="inline-block w-2 h-2 rounded-full mr-2 animate-pulse-glow"
        style={{ background: cfg.dot, boxShadow: `0 0 8px ${cfg.dot}` }}
      />
      {cfg.label}
    </span>
  )
}
