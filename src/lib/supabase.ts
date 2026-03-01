import { createClient } from '@supabase/supabase-js'
import type { IntelRun } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function getLatestRun(): Promise<IntelRun | null> {
  const { data, error } = await supabase
    .from('market_intelligence_runs')
    .select('*')
    .eq('status', 'complete')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) return null
  return data as IntelRun
}

export async function getRecentRuns(limit = 5): Promise<IntelRun[]> {
  const { data, error } = await supabase
    .from('market_intelligence_runs')
    .select('id, created_at, query_topic, sentiment, article_count, ai_summary, status')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !data) return []
  return data as IntelRun[]
}
