import "katex/dist/katex.min.css";
import type { Metadata } from "next";
import { Hind_Siliguri, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  weight: ["400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
});

export const metadata: Metadata = {
  title: "MeetShikkha AI - শিক্ষার ভবিষ্যৎ, এবার তোমার হাতে",
  description: "A highly intelligent, empathetic, and professional AI Academic Chat Assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${hindSiliguri.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
