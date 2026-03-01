import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'INTEL.MARKET — AI Automation Intelligence',
  description: 'Real-time market intelligence for AI automation trends',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="noise-overlay" />
        {/* Ambient orbs */}
        <div className="orb" style={{ width: 600, height: 600, top: '-200px', left: '-200px', background: 'var(--neon-cyan)' }} />
        <div className="orb" style={{ width: 500, height: 500, bottom: '-100px', right: '-100px', background: 'var(--neon-purple)' }} />
        <div className="orb" style={{ width: 400, height: 400, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'var(--neon-pink)' }} />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}
