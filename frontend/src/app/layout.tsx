import type { Metadata } from 'next';
import { Fraunces, Red_Hat_Display } from 'next/font/google';
import { AuthProvider } from '@/components/auth-provider';
import '@/styles/globals.css';

const heading = Fraunces({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-heading' });
const body = Red_Hat_Display({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-body' });

export const metadata: Metadata = {
  title: 'Serenica Platform',
  description: 'Therapy operations workspace with secure Keycloak authentication.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${heading.variable} ${body.variable}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
