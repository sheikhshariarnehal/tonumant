import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';
import { Navbar } from '@/components/Navbar';
import { Trophy, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'eFootball Tournament Platform | Bangladesh Community Esports',
  description: 'Join competitive eFootball tournaments in Bangladesh. Easy 2-step registration, manual bKash/Nagad/Rocket payments, prize pools, and live countdowns.',
  keywords: 'eFootball, Bangladesh, eSports, PES, tournament, bKash, Nagad, prize pool, gaming',
  icons: {
    icon: '/icon-tuna.webp',
    apple: '/icon-tuna.webp',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ backgroundColor: '#0e0c13', colorScheme: 'dark' }}>
      <body style={{ backgroundColor: '#0e0c13', color: '#f8fafc', margin: 0, minHeight: '100vh' }}>
        <AppProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#0e0c13' }}>
            <Navbar />
            <main style={{ flex: 1, backgroundColor: '#0e0c13' }}>{children}</main>

            {/* Footer */}
            <footer
              style={{
                borderTop: '1px solid var(--border-subtle)',
                background: '#120f17',
                padding: '2.5rem 0',
                marginTop: 'auto',
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
              }}
            >
              <div
                className="container"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img
                    src="/icon-tuna.webp"
                    alt="eFootball Arena"
                    style={{
                      width: '32px',
                      height: '32px',
                      objectFit: 'contain',
                      borderRadius: '0px',
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                      eFootball Arena Bangladesh
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Competitive grassroots esports platform for PES / eFootball players
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <Link href="/" style={{ color: 'var(--text-secondary)' }}>
                    All Tournaments
                  </Link>
                  <Link href="/my-tournaments" style={{ color: 'var(--text-secondary)' }}>
                    My Registrations
                  </Link>
                  <Link href="/admin" style={{ color: 'var(--text-secondary)' }}>
                    Organizer Console
                  </Link>
                </div>

                <div style={{ fontSize: '0.75rem' }}>
                  © {new Date().getFullYear()} eFootball Arena BD. All rights reserved.
                </div>
              </div>
            </footer>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
