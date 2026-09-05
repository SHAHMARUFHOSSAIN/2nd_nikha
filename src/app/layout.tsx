import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/constants';
import { AuthProvider } from '@/lib/auth-context';
import { ConnectionProvider } from '@/lib/connection-context';
import { CommunicationProvider } from '@/lib/communication-context';
import { AdminProvider } from '@/lib/admin-context';
import { CurrencyProvider } from '@/lib/currency-context';
import { getServerSettings } from '@/lib/server-settings';

export const metadata: Metadata = {
  title: `${BRAND_NAME} - ${BRAND_TAGLINE} | Premium Matrimonial Platform`,
  description:
    'Dedicated, trustworthy matrimonial platform designed specifically for divorced, widowed, single parents, and mature singles seeking a genuine second chance at marriage.',
  keywords: [
    '2nd Nikah Matrimonial',
    'Divorced Matrimony',
    'Widowed Matrimony',
    'Single Parent Marriage',
    'Second Marriage Platform',
    'Verified Matrimony Bangladesh',
  ],
  authors: [{ name: BRAND_NAME }],
  openGraph: {
    title: `${BRAND_NAME} - ${BRAND_TAGLINE}`,
    description:
      'A respectful, secure, and dignified matrimonial sanctuary for divorced, widowed, single parents, and mature singles.',
    type: 'website',
    siteName: BRAND_NAME,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialSettings = await getServerSettings();

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" id="dynamic-favicon" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: {
                  extend: {
                    colors: {
                      brand: {
                        blush: '#FDF2F8',
                        blushLight: '#FFF1F2',
                        pinkSoft: '#FCE7F3',
                        pink: '#EC4899',
                        pinkHot: '#DB2777',
                        pinkDark: '#BE185D',
                        rose: '#E11D48',
                        roseHover: '#9F1239',
                        wine: '#831843',
                        wineDark: '#500724',
                        wineHover: '#701A75',
                        textMain: '#1C1917',
                        textMuted: '#78716C',
                        borderSoft: '#FBCFE8',
                      }
                    },
                    fontFamily: {
                      serif: ['Georgia', 'Cambria', 'serif'],
                      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                    }
                  }
                }
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-white text-stone-900 selection:bg-pink-100 selection:text-pink-900 pb-16 lg:pb-0">
        <AuthProvider>
          <ConnectionProvider>
            <CommunicationProvider>
              <AdminProvider initialSettings={initialSettings}>
                <CurrencyProvider>
                  <Navbar />
                  <main className="flex-1">{children}</main>
                  <Footer />
                  <MobileBottomNav />
                </CurrencyProvider>
              </AdminProvider>
            </CommunicationProvider>
          </ConnectionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
