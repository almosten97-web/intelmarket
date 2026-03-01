import type { SearchResult, NewsResult } from '@/lib/types'

function ArticleCard({
  title,
  link,
  snippet,
  label,
  labelColor,
  index,
}: {
  title: string
  link: string
  snippet?: string
  label: string
  labelColor: string
  index: number
}) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-card p-4 block group transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${0.05 * index}s` }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className="theme-badge text-xs shrink-0"
          style={{
            color: labelColor,
            borderColor: `${labelColor}40`,
            background: `${labelColor}10`,
            fontSize: '0.65rem',
          }}
        >
          {label}
        </span>
        <span
          className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: 'var(--neon-cyan)' }}
        >
          ↗
        </span>
      </div>
      <p className="text-sm font-medium text-white leading-snug mb-2 group-hover:text-cyan-300 transition-colors line-clamp-2">
        {title}
      </p>
      {snippet && (
        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'rgba(226,232,240,0.5)' }}>
          {snippet}
        </p>
      )}
    </a>
  )
}

export default function ArticleGrid({
  organic,
  news,
}: {
  organic: SearchResult[]
  news: NewsResult[]
}) {
  if (!organic?.length && !news?.length) return null

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <p className="text-xs tracking-widest uppercase mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
        Sources &amp; References · {(organic?.length || 0) + (news?.length || 0)} results
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {(organic || []).map((r, i) => (
          <ArticleCard
            key={r.link + i}
            title={r.title}
            link={r.link}
            snippet={r.snippet}
            label="Search"
            labelColor="#00d4ff"
            index={i}
          />
        ))}
        {(news || []).map((r, i) => (
          <ArticleCard
            key={r.link + i}
            title={r.title}
            link={r.link}
            snippet={r.snippet || (typeof r.source === 'object' ? r.source?.name : r.source)}
            label="News"
            labelColor="#7b2fff"
            index={(organic?.length || 0) + i}
          />
        ))}
      </div>
    </div>
  )
}
