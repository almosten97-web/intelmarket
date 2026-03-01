'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RefreshButton() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const router = useRouter()

  async function handleRefresh() {
    setLoading(true)
    setStatus('idle')
    try {
      const res = await fetch('/api/refresh', { method: 'POST' })
      if (!res.ok) throw new Error('Workflow failed')
      setStatus('success')
      router.refresh()
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleRefresh}
        disabled={loading}
        className="relative group px-6 py-3 rounded-xl font-semibold text-sm tracking-widest uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
        style={{
          background: loading
            ? 'rgba(0,212,255,0.1)'
            : 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(123,47,255,0.15))',
          border: '1px solid rgba(0,212,255,0.3)',
          color: loading ? 'rgba(0,212,255,0.5)' : 'var(--neon-cyan)',
          boxShadow: loading ? 'none' : '0 0 20px rgba(0,212,255,0.15)',
        }}
      >
        {/* Shimmer sweep on hover */}
        <span
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.1), transparent)',
          }}
        />
        <span className="relative flex items-center gap-2">
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Collecting Intel...
            </>
          ) : (
            <>
              <span className="text-base">⚡</span>
              Refresh Intel
            </>
          )}
        </span>
      </button>
      {status === 'success' && (
        <span className="text-xs text-green-400 animate-fade-in-up" style={{ color: 'var(--neon-green)' }}>
          Intelligence updated
        </span>
      )}
      {status === 'error' && (
        <span className="text-xs animate-fade-in-up" style={{ color: 'var(--neon-pink)' }}>
          Collection failed — check n8n
        </span>
      )}
    </div>
  )
}
