-- Market Intelligence: stores one row per n8n workflow run
CREATE TABLE IF NOT EXISTS market_intelligence_runs (
  id                     uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at             timestamptz DEFAULT now() NOT NULL,
  run_type               text NOT NULL DEFAULT 'webhook',
  query_topic            text NOT NULL,
  ai_summary             text,
  key_themes             jsonb DEFAULT '[]',
  sentiment              text DEFAULT 'neutral',
  top_insights           jsonb DEFAULT '[]',
  emerging_opportunities jsonb DEFAULT '[]',
  article_count          int DEFAULT 0,
  organic_results        jsonb DEFAULT '[]',
  news_results           jsonb DEFAULT '[]',
  status                 text DEFAULT 'complete'
);

-- Index for dashboard query (latest by date)
CREATE INDEX IF NOT EXISTS idx_intel_runs_created_at
  ON market_intelligence_runs (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_intel_runs_status
  ON market_intelligence_runs (status);

-- Row Level Security
ALTER TABLE market_intelligence_runs ENABLE ROW LEVEL SECURITY;

-- Allow anon read (dashboard uses anon key)
CREATE POLICY "Allow anon read"
  ON market_intelligence_runs FOR SELECT
  TO anon
  USING (true);

-- Allow service_role insert (n8n uses service key)
CREATE POLICY "Allow service insert"
  ON market_intelligence_runs FOR INSERT
  TO service_role
  WITH CHECK (true);
