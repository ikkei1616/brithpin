import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/context/auth";
import { Layout } from "@/components/Layout";
import { ColorProvider } from '@/context/ColorContext';

export const metadata: Metadata = {
  title: "Birth PIN",
  description: "とくべつな日を もっとたのしく",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png"></link>
        <meta name="theme-color" content="#FFFEFA" />
      </head>
      <body>
        <Layout>
          <ColorProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ColorProvider>
        </Layout>
      </body>
    </html>
  );
}
