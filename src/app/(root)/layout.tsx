
// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import "@/app/globals.css";
import Header from '@/components/Header'; // Import Header
import Footer from '@/components/Footer'; // Import Footer
import Navbar from '@/components/Navbar';

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
        <html lang="vi">
        <body className={`${inter.className} bg-gray-50`}>
        <Header />
        <Navbar />
        <main className="min-h-screen">
            {children}
        </main>
        <Footer />
        </body>
        </html>
    );
}