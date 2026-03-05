import type { Metadata } from 'next';
import { Merriweather, Space_Grotesk } from 'next/font/google';
import { AuthProvider } from '@/components/auth-provider';
import '@/styles/globals.css';

const heading = Merriweather({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-heading' });
const body = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-body' });

export const metadata: Metadata = {
  title: 'Serenica Platform',
  description: 'Therapy operations platform with Keycloak authentication.'
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
