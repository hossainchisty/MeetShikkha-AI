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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#4f46e5", // indigo-600
          colorText: "#0f172a",    // slate-900
          colorTextSecondary: "#64748b", // slate-500
          colorBackground: "#ffffff",
          colorInputBackground: "#f8fafc", // slate-50
          colorInputText: "#0f172a",
          borderRadius: "1rem",
        },
        elements: {
          formButtonPrimary:
            "bg-indigo-600 hover:bg-indigo-700 text-sm font-bold py-3.5 rounded-2xl shadow-xl shadow-indigo-100 uppercase tracking-wider transition-all active:scale-95 border-none",
          card: "shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100/50 rounded-[40px] p-10 bg-white/80 backdrop-blur-xl",
          headerTitle: "text-3xl font-black text-slate-900 tracking-tight",
          headerSubtitle: "text-slate-500 font-medium text-base",
          socialButtonsBlockButton: "rounded-2xl border-slate-100 hover:bg-slate-50 transition-all font-bold text-slate-600 h-12",
          formFieldInput: "rounded-2xl border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all py-3 px-4 text-slate-700 bg-slate-50/50 font-medium",
          formFieldLabel: "font-bold text-slate-700 mb-1.5",
          footerActionLink: "text-indigo-600 hover:text-indigo-700 font-bold transition-colors",
          dividerLine: "bg-slate-100",
          dividerText: "text-slate-400 font-bold text-[10px] uppercase tracking-widest",
        }
      }}
    >
      <html lang="en">
        <body className={`${inter.variable} ${hindSiliguri.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
