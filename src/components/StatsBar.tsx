import type { IntelRun } from '@/lib/types'

function Stat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="glass-card px-5 py-4 text-center">
      <p className="text-2xl font-bold mb-1" style={{ color }}>
        {value}
      </p>
      <p className="text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>
        {label}
      </p>
    </div>
  )
}

export default function StatsBar({ run }: { run: IntelRun }) {
  const sentimentEmoji = { bullish: '↑', neutral: '→', cautious: '↓' }[run.sentiment] ?? '→'

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in-up">
      <Stat label="Sources Found" value={run.article_count} color="var(--neon-cyan)" />
      <Stat label="Key Themes" value={run.key_themes?.length ?? 0} color="var(--neon-purple)" />
      <Stat label="Insights" value={run.top_insights?.length ?? 0} color="var(--neon-pink)" />
      <Stat label="Market Sentiment" value={sentimentEmoji} color="var(--neon-green)" />
    </div>
  )
}
