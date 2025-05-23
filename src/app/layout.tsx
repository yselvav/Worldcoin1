import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import WorldcoinProvider from '@/components/providers/WorldcoinProvider'; // Import WorldcoinProvider

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AI Text Verifier & Voter',
  description: 'An application for verified humans to detect AI-generated text and vote on text authenticity, aiming to build a human-verified text dataset. This app leverages Gemini API for text analysis.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Apply dark class globally if preferred, or manage via theme toggle
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <WorldcoinProvider>
          {children}
        </WorldcoinProvider>
        <Toaster />
      </body>
    </html>
  );
}
