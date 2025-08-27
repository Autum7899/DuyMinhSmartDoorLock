import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import "@/app/globals.css";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ContactBubble from '@/components/ContactBubble';
import { CartProvider } from '@/app/contexts/CartContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Cửa hàng khóa thông minh',
    description: 'Chuyên cung cấp các loại khóa cửa thông minh cao cấp.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={`${inter.className} bg-gray-50`}>
            <CartProvider>
                <Header />
                <Navbar />
                <main className="min-h-screen">
                    {children}
                </main>
                <ContactBubble />
                <Footer />
            </CartProvider>
        </body>
        </html>
    );
}