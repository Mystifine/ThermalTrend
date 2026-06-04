import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import LayoutClient from "@/app/components/LayoutComponent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thermal Trend",
  description: "Find the hottest themes setting up in the market",
  icons: {
    icon: {url: "/icon-1024.png", sizes: "1024x1024", type: "image/png"},
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <LayoutClient>{children}</LayoutClient>
        <Analytics />
      </body>
    </html>
  );
}
