import {
  ClerkProvider
} from '@clerk/nextjs';
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

import { LanguageProvider } from '@/lib/LanguageContext';
import { ThemeProvider } from '@/lib/ThemeContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#4f46e5",
          colorText: "var(--foreground)",
          colorBackground: "var(--background)",
          colorInputBackground: "var(--background)",
          colorInputText: "var(--foreground)",
          borderRadius: "1rem",
        },
        elements: {
          formButtonPrimary:
            "bg-indigo-600 hover:bg-indigo-700 text-sm font-bold py-3.5 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none uppercase tracking-wider transition-all active:scale-95 border-none",
          card: "shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100/50 dark:border-slate-800/50 rounded-[40px] p-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl",
          headerTitle: "text-3xl font-black text-slate-900 dark:text-white tracking-tight",
          headerSubtitle: "text-slate-500 dark:text-slate-400 font-medium text-base",
          socialButtonsBlockButton: "rounded-2xl border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold text-slate-600 dark:text-slate-300 h-12",
          formFieldInput: "rounded-2xl border-slate-100 dark:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all py-3 px-4 text-slate-700 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-800/50 font-medium",
          formFieldLabel: "font-bold text-slate-700 dark:text-slate-300 mb-1.5",
          footerActionLink: "text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-bold transition-colors",
          dividerLine: "bg-slate-100 dark:bg-slate-800",
          dividerText: "text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest",
        }
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} ${hindSiliguri.variable} antialiased transition-colors duration-300`}>
          <ThemeProvider>
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
