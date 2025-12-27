import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ClientLayout } from '@/components/ClientLayout';

export const dynamic = 'force-dynamic';

const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-jakarta',
    display: 'swap',
    weight: ['300', '400', '500', '600', '700'],
});

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
    display: 'swap',
    weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title: {
        default: 'Sarpong Andrews Boakye - Communication Coach & Leadership Expert',
        template: '%s | Sarpong Andrews Boakye',
    },
    description: 'Helping executives, entrepreneurs, and leaders master the art of speaking with impact — both offline and online.',
    keywords: ['communication coach', 'public speaking', 'leadership', 'executive coaching', 'entrepreneur', 'presentation skills', 'voice training'],
    authors: [{ name: 'Sarpong Andrews Boakye' }],
    creator: 'Sarpong Andrews Boakye',
    openGraph: {
        title: 'Sarpong Andrews Boakye - Communication Coach',
        description: 'Master the art of speaking with impact',
        url: 'https://sarpongandrews.com',
        siteName: 'Sarpong Andrews Boakye',
        locale: 'en_US',
        type: 'website',
        images: [
            {
                url: '/andrews-portrait.jpg',
                width: 1200,
                height: 630,
                alt: 'Sarpong Andrews Boakye',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Sarpong Andrews Boakye',
        description: 'Helping executives and leaders master the art of impact.',
        creator: '@sarpongandrews',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        // Add verification codes when available
        // google: 'your-google-verification-code',
        // yandex: 'your-yandex-verification-code',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${jakarta.variable} ${outfit.variable} relative overflow-x-hidden`}>
            <body className="font-sans antialiased relative overflow-x-hidden max-w-full">
                <a href="#main-content" className="skip-to-content">
                    Skip to main content
                </a>
                <ClientLayout>
                    <Navbar />
                    <main id="main-content" className="min-h-screen relative">
                        {children}
                    </main>
                    <Footer />
                </ClientLayout>
            </body>
        </html>
    );
}
