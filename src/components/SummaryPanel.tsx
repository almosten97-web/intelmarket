import ThemeBadge from './ThemeBadge'
import SentimentBadge from './SentimentBadge'
import type { IntelRun } from '@/lib/types'

export default function SummaryPanel({ run }: { run: IntelRun }) {
  return (
    <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'rgba(0,212,255,0.6)' }}>
            AI Analysis · GPT-4o Mini
          </p>
          <h2 className="text-lg font-bold text-white">Market Intelligence Summary</h2>
        </div>
        <SentimentBadge sentiment={run.sentiment} />
      </div>

      {/* Summary text */}
      <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(226,232,240,0.8)' }}>
        {run.ai_summary}
      </p>

      {/* Key themes */}
      {run.key_themes?.length > 0 && (
        <div className="mb-5">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Key Themes
          </p>
          <div className="flex flex-wrap gap-2">
            {run.key_themes.map((theme, i) => (
              <ThemeBadge key={theme} label={theme} index={i} />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Top insights */}
        {run.top_insights?.length > 0 && (
          <div>
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Top Insights
            </p>
            <ul className="space-y-2">
              {run.top_insights.map((insight, i) => (
                <li key={i} className="flex gap-3 text-sm" style={{ color: 'rgba(226,232,240,0.75)' }}>
                  <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'rgba(0,212,255,0.15)', color: 'var(--neon-cyan)' }}>
                    {i + 1}
                  </span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Emerging opportunities */}
        {run.emerging_opportunities?.length > 0 && (
          <div>
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Emerging Opportunities
            </p>
            <ul className="space-y-2">
              {run.emerging_opportunities.map((opp, i) => (
                <li key={i} className="flex gap-3 text-sm" style={{ color: 'rgba(226,232,240,0.75)' }}>
                  <span className="shrink-0 text-base" style={{ color: 'var(--neon-green)' }}>◆</span>
                  {opp}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
