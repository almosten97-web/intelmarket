import { NextResponse } from 'next/server'

export async function POST() {
  const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL

  if (!webhookUrl) {
    return NextResponse.json(
      { error: 'N8N_WEBHOOK_URL not configured' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: 'dashboard', triggeredAt: new Date().toISOString() }),
      // Generous timeout — workflow runs SerpAPI + OpenAI
      signal: AbortSignal.timeout(120_000),
    })

    if (!response.ok) {
      const text = await response.text()
      return NextResponse.json(
        { error: 'Workflow failed', details: text },
        { status: 502 }
      )
    }

    const result = await response.json().catch(() => ({ success: true }))
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
