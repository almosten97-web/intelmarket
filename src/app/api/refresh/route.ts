import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

const TOPIC = 'AI automation'

export async function POST() {
  const serpKey = process.env.SERPAPI_KEY
  const openAiKey = process.env.OPENAI_API_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serpKey || !openAiKey || !supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Missing required env vars' }, { status: 500 })
  }

  try {
    // 1. Fetch Google Search + Google News in parallel
    const [searchRes, newsRes] = await Promise.all([
      fetch(
        `https://serpapi.com/search?engine=google&q=${encodeURIComponent(TOPIC + ' trends 2026 tools')}&num=10&api_key=${serpKey}`,
        { signal: AbortSignal.timeout(30_000) }
      ),
      fetch(
        `https://serpapi.com/search?engine=google_news&q=${encodeURIComponent(TOPIC)}&num=10&api_key=${serpKey}`,
        { signal: AbortSignal.timeout(30_000) }
      ),
    ])

    const [searchData, newsData] = await Promise.all([
      searchRes.json(),
      newsRes.json(),
    ])

    const organic_results = (searchData.organic_results || []).slice(0, 8)
    const news_results = (newsData.news_results || []).slice(0, 8)

    const organicText = organic_results
      .map((r: any, i: number) => `${i + 1}. "${r.title}"\n   ${r.snippet || 'N/A'}\n   URL: ${r.link || 'N/A'}`)
      .join('\n\n')

    const newsText = news_results
      .map((r: any, i: number) => `${i + 1}. "${r.title}"\n   ${r.date || ''} - ${r.source?.name || 'N/A'}\n   URL: ${r.link || 'N/A'}`)
      .join('\n\n')

    const combined_text = `## GOOGLE SEARCH (AI Automation Trends 2026)\n\n${organicText || 'No results'}\n\n## GOOGLE NEWS (AI Automation)\n\n${newsText || 'No results'}`

    // 2. Analyze with OpenAI
    const openai = new OpenAI({ apiKey: openAiKey })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a market intelligence analyst. Analyze the search results and return ONLY a raw JSON object with no markdown, no code fences, no explanation. Structure:\n{"summary": "2-3 sentence executive summary", "key_themes": ["theme1", "theme2", "theme3"], "sentiment": "bullish", "top_insights": ["insight1", "insight2", "insight3"], "emerging_opportunities": ["opp1", "opp2"]}\nsentiment must be: bullish, neutral, or cautious. Output raw JSON only.',
        },
        { role: 'user', content: combined_text },
      ],
      max_tokens: 1000,
    })

    const llmText = (completion.choices[0]?.message?.content || '').trim()

    // 3. Parse LLM output
    let ai_summary = llmText.substring(0, 1000)
    let key_themes: string[] = []
    let sentiment = 'neutral'
    let top_insights: string[] = []
    let emerging_opportunities: string[] = []

    try {
      const clean = llmText.replace(/```(?:json)?/gi, '').trim()
      const start = clean.indexOf('{')
      const end = clean.lastIndexOf('}')
      if (start !== -1 && end > start) {
        const parsed = JSON.parse(clean.substring(start, end + 1))
        if (typeof parsed.summary === 'string') ai_summary = parsed.summary
        if (Array.isArray(parsed.key_themes)) key_themes = parsed.key_themes.map(String)
        if (['bullish', 'neutral', 'cautious'].includes(parsed.sentiment)) sentiment = parsed.sentiment
        if (Array.isArray(parsed.top_insights)) top_insights = parsed.top_insights.map(String)
        if (Array.isArray(parsed.emerging_opportunities)) emerging_opportunities = parsed.emerging_opportunities.map(String)
      }
    } catch (_) {}

    // 4. Save to Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: row, error: dbError } = await supabase
      .from('market_intelligence_runs')
      .insert({
        query_topic: TOPIC,
        run_type: 'webhook',
        ai_summary,
        key_themes,
        sentiment,
        top_insights,
        emerging_opportunities,
        article_count: organic_results.length + news_results.length,
        organic_results,
        news_results,
        status: 'complete',
      })
      .select()
      .single()

    if (dbError) throw new Error(dbError.message)

    return NextResponse.json({
      success: true,
      id: row.id,
      summary: ai_summary,
      articleCount: organic_results.length + news_results.length,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
