export interface SearchResult {
  title: string
  link: string
  snippet?: string
  source?: string
  displayed_link?: string
}

export interface NewsResult {
  title: string
  link: string
  snippet?: string
  date?: string
  source?: { name: string; icon?: string } | string
}

export interface IntelRun {
  id: string
  created_at: string
  run_type: 'webhook' | 'schedule'
  query_topic: string
  ai_summary: string
  key_themes: string[]
  sentiment: 'bullish' | 'neutral' | 'cautious'
  top_insights: string[]
  emerging_opportunities: string[]
  article_count: number
  organic_results: SearchResult[]
  news_results: NewsResult[]
  status: 'complete' | 'error'
}
