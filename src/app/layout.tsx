import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeProvider';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { Navbar } from '@/components/navbar/Navbar';
import { Footer } from '@/components/footer/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ToastProvider } from '@/components/ui/ToastProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Easy-Cart | Everything You Need. Just a Cart Away.',
  description: 'Shop smarter and live better with Easy-Cart — your modern destination for electronics, fashion, beauty, home decor, groceries, and premium lifestyle products.',
  keywords: ['e-commerce', 'online shopping', 'easy-cart', 'electronics', 'fashion', 'deals'],
  openGraph: {
    title: 'Easy-Cart - Premium E-Commerce Shopping',
    description: 'Shop smarter and live better with Easy-Cart.',
    url: 'https://easycart.com',
    siteName: 'Easy-Cart',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1498049860654-af1a5c566876?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Easy-Cart Store',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased selection:bg-brand-500 selection:text-white dark:bg-gray-950 dark:text-gray-100 flex flex-col min-h-screen`}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ThemeProvider>
                <ToastProvider />
                <Navbar />
                <main className="flex-1">{children}</main>
                <CartDrawer />
                <Footer />
              </ThemeProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
