'use client';
import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Toaster } from '@/components/ui/toaster';
import { usePathname } from 'next/navigation';


const inter = Inter({ subsets: ['latin'] });

// Move metadata to a separate file since we're using 'use client'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showNavbar = pathname !== '/';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen bg-background">
            {showNavbar && <Navbar />}
            <main>
            
              {children}</main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}