import { getLatestRun } from '@/lib/supabase'
import RefreshButton from '@/components/RefreshButton'
import SummaryPanel from '@/components/SummaryPanel'
import ArticleGrid from '@/components/ArticleGrid'
import StatsBar from '@/components/StatsBar'
import { formatDistanceToNow } from 'date-fns'

export const revalidate = 0 // Always fetch fresh on navigation

export default async function DashboardPage() {
  const run = await getLatestRun()

  return (
    <main className="min-h-screen grid-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-2">
              <span className="gradient-text">INTEL.</span>
              <span className="text-white">MARKET</span>
            </h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Real-time AI automation market intelligence
              {run && (
                <span className="ml-3" style={{ color: 'rgba(0,212,255,0.6)' }}>
                  · Updated {formatDistanceToNow(new Date(run.created_at), { addSuffix: true })}
                </span>
              )}
            </p>
          </div>
          <RefreshButton />
        </header>

        {run ? (
          <div className="space-y-6">
            {/* Stats row */}
            <StatsBar run={run} />

            {/* AI Summary */}
            <SummaryPanel run={run} />

            {/* Article grid */}
            <ArticleGrid
              organic={run.organic_results ?? []}
              news={run.news_results ?? []}
            />
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </main>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="animate-float mb-8">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(123,47,255,0.15))',
            border: '1px solid rgba(0,212,255,0.2)',
            boxShadow: '0 0 40px rgba(0,212,255,0.1)',
          }}
        >
          📡
        </div>
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">No intelligence collected yet</h2>
      <p className="text-sm mb-8 max-w-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Hit &ldquo;Refresh Intel&rdquo; to trigger the n8n workflow and collect your first AI automation market report.
      </p>
      <div className="glass-card px-6 py-4 text-left max-w-sm w-full">
        <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'rgba(0,212,255,0.6)' }}>
          What happens on refresh
        </p>
        <ul className="space-y-2 text-sm" style={{ color: 'rgba(226,232,240,0.6)' }}>
          {[
            '⚡ SerpAPI scrapes Google trends + news',
            '🤖 GPT-4o Mini analyzes the data',
            '💾 Results stored in Supabase',
            '📊 Dashboard updates instantly',
          ].map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
