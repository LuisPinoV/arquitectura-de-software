import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AntdRegistry } from '@ant-design/nextjs-registry';

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Administración Hospital Padre Hurtado",
  description: "Gestión de boxes para el Hospital Padre Hurtado",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) 
{
  return (
    <html lang="en" suppressHydrationWarning>
      
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <AntdRegistry>{children}</AntdRegistry>
          <Toaster />
      </body>
    </html>
  );
}
