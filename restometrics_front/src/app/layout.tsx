import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { AppProvider } from "@/app/providers/AppProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "RestoMetrics",
  description: "RestoMetrics - Система аналитики для ресторанов",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  
  return (
    <html lang="en" >
      <body
        className={`${inter.variable} font-sans`}
      >
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
