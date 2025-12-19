import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/lib/providers/query-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { geistMono, geistSans } from '@/lib/config/fonts';
import '../../globals.css';

export const metadata: Metadata = {
  title: 'Ascencio Tax Inc.',
  description:
    'Ascencio Tax Inc. - Your Trusted Partner for Expert Tax Services',
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="system" storageKey="ascencio-tax-theme">
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>

        <Toaster position="top-right" />
      </body>
    </html>
  );
}
