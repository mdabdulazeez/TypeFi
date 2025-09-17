import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TypeFi - Blockchain Typing Game",
  description: "A decentralized typing game with rewards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ background: '#000000' }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ background: '#000000', color: '#f5f5f5' }}
      >
        <Providers>
          <div className="min-h-screen" style={{ background: '#000000', color: '#f5f5f5' }}>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
