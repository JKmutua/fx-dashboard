import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FX Dashboard',
  description: 'Live currency exchange rates and converter',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav style={{
          borderBottom: '1px solid var(--border)',
          padding: '0 2rem',
          background: 'rgba(8,12,20,0.95)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px',
          }}>
            <Link href="/" style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.2rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              textDecoration: 'none',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <span style={{
                background: 'var(--accent)',
                borderRadius: '8px',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
              }}>₿</span>
              FX<span style={{ color: 'var(--accent)' }}>Flow</span>
            </Link>

            <div style={{ display: 'flex', gap: '2rem' }}>
              {[
                { href: '/', label: 'Rates' },
                { href: '/convert', label: 'Convert' },
                { href: '/watchlist', label: 'Watchlist' },
                { href: '/alerts', label: 'Alerts' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  letterSpacing: '0.02em',
                  transition: 'color 0.2s',
                }}
                // onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                // onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >{label}</Link>
              ))}
            </div>
          </div>
        </nav>

        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 2rem' }}>
          {children}
        </main>
      </body>
    </html>
  );
}