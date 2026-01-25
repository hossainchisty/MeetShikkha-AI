import { SignIn } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col justify-center items-center p-6 relative overflow-hidden">
            {/* Soft Background Accent */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-indigo-50/50 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-purple-50/50 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4" />
            </div>

            <div className="relative z-10 w-full max-w-[440px] flex flex-col items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 mb-8 group transition-transform hover:scale-105 active:scale-95">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100 group-hover:rotate-6 transition-transform">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black tracking-tight text-slate-900">
                        Meet<span className="text-indigo-600">ShikkhaAI</span>
                    </span>
                </Link>

                {/* Clerk Sign In Component */}
                <div className="w-full">
                    <SignIn
                        appearance={{
                            variables: {
                                colorPrimary: "#4f46e5", // indigo-600
                                colorText: "#0f172a",    // slate-900
                                colorTextSecondary: "#64748b", // slate-500
                                colorBackground: "#ffffff",
                                colorInputBackground: "#f8fafc", // slate-50
                                colorInputText: "#0f172a",
                                borderRadius: "1rem",
                                fontFamily: "var(--font-inter)",
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
                                identityPreviewText: "font-bold text-slate-700",
                                identityPreviewEditButtonIcon: "text-indigo-600",
                            }
                        }}
                    />
                </div>

                {/* Bottom Help Text */}
                <p className="mt-8 text-center text-[13px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                    দেশর সেরা AI লার্নিং প্ল্যাটফর্মে <br /> তোমাকে স্বাগতম।
                </p>
            </div>
        </div>
    );
}
