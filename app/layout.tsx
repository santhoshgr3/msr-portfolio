import type { Metadata } from 'next';
import { Inter, Noto_Sans_Telugu } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SettingsProvider } from '@/contexts/SettingsContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoTelugu = Noto_Sans_Telugu({ subsets: ['telugu'], variable: '--font-telugu', weight: ['400', '600', '700', '900'] });

export const metadata: Metadata = {
  title: 'Dr. Madhiraj Sairathan — Sunny Anna Yuvasena | Empowering Today. Transforming Tomorrow.',
  description: 'Join the movement. Dr. Madhiraj Sairathan (Sunny Anna) — Social Innovator, Community Leader, Change Maker from Bhupalpally, Telangana. Youth Empowerment · Women Empowerment · Healthcare · Education.',
  keywords: 'Madhiraj Sairathan, Sunny Anna, Sunny Anna Yuvasena, Helping Hands Organization, Bhupalpally, Telangana, social movement, community leader, youth empowerment',
  openGraph: {
    title: 'Dr. Madhiraj Sairathan — Sunny Anna Yuvasena',
    description: 'Empowering Today. Transforming Tomorrow. Join the movement transforming Telangana.',
    url: 'https://madhirajsairathan.com',
    siteName: 'Sunny Anna Yuvasena',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dr. Madhiraj Sairathan — Sunny Anna Yuvasena',
    description: 'Empowering Today. Transforming Tomorrow.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${notoTelugu.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <LanguageProvider>
          <SettingsProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </SettingsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
