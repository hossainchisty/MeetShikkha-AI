'use client';
import { useClerk, useUser } from "@clerk/nextjs";
import { Bell, Camera, ChevronLeft, Lock, LogOut, Mail, Settings, ShieldCheck, Sparkles, User, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ProfilePage() {
    const { user, isLoaded } = useUser();
    const { signOut } = useClerk();
    const [activeTab, setActiveTab] = useState('profile');

    if (!isLoaded) return null;

    return (
        <div className="min-h-screen bg-slate-50/30 dark:bg-[#0f172a] relative overflow-hidden font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900 transition-colors duration-500">
            {/* Background Decoration */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-50/50 dark:bg-indigo-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-50/50 dark:bg-purple-500/5 blur-[100px] rounded-full" />
            </div>

            {/* Navigation */}
            <nav className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-slate-100/80 dark:border-slate-800/80 px-6 sticky top-0 z-50 transition-colors duration-500">
                <div className="max-w-6xl mx-auto h-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/chat" className="p-2.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-sm transition-all active:scale-95">
                            <ChevronLeft size={20} />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 dark:shadow-none">
                                <Sparkles size={18} />
                            </div>
                            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">অ্যাকাউন্ট সেটিংস</h1>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-rose-500 dark:text-rose-400 font-bold hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all text-sm"
                    >
                        <LogOut size={18} />
                        লগ আউট
                    </button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 py-10 relative z-10">
                <div className="grid lg:grid-cols-[280px_1fr] gap-8">

                    {/* Custom Sidebar Navigation */}
                    <aside className="space-y-2">
                        {[
                            { id: 'profile', label: 'প্রোফাইল তথ্য', icon: User },
                            { id: 'security', label: 'নিরাপত্তা', icon: Lock },
                            { id: 'notifications', label: 'নোটিফিকেশন', icon: Bell },
                            { id: 'preferences', label: 'পছন্দসমূহ', icon: Settings },
                        ].map((tab) => (
                            tab.id === 'preferences' ? (
                                <Link
                                    key={tab.id}
                                    href="/dashboard/settings"
                                    className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-sm transition-all text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-sm"
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                </Link>
                            ) : (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === tab.id
                                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-sm'
                                        }`}
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                </button>
                            )
                        ))}
                    </aside>

                    {/* Custom Form Area (Replacing Clerk UI) */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden group transition-colors duration-500">
                            <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
                                {/* Avatar Section */}
                                <div className="relative group/avatar shrink-0">
                                    <div className="w-32 h-32 rounded-[40px] overflow-hidden ring-4 ring-slate-50 dark:ring-slate-800 shadow-2xl transition-transform group-hover/avatar:scale-[1.02]">
                                        <img
                                            src={user?.imageUrl}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <button className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-3 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all ring-4 ring-white dark:ring-slate-900">
                                        <Camera size={18} />
                                    </button>
                                </div>

                                {/* Form Section */}
                                <div className="flex-1 w-full space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">আপনার ব্যক্তিগত তথ্য</h2>
                                        <p className="text-slate-400 dark:text-slate-500 font-medium text-sm">আপনার বিস্তারিত তথ্য এখান থেকে আপডেট করতে পারেন</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2 text-left">
                                            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">পুরো নাম</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={18} />
                                                <input
                                                    type="text"
                                                    defaultValue={user?.fullName || ''}
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-700 dark:text-white focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 pointer-events-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-left">
                                            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">ইমেইল এড্রেস</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={18} />
                                                <input
                                                    type="email"
                                                    defaultValue={user?.primaryEmailAddress?.emailAddress || ''}
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-700 dark:text-white focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 pointer-events-none"
                                                />
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider">Verified</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 pt-4">
                                        <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 dark:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all">
                                            তথ্য আপডেট করুন
                                        </button>
                                        <button className="px-8 py-4 rounded-2xl font-bold text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                                            বাতিল করুন
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Verification Status Card */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 flex items-center gap-6 shadow-sm">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500 dark:text-emerald-400 shrink-0">
                                    <ShieldCheck size={28} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 dark:text-white mb-0.5 tracking-tight uppercase text-xs">Security Status</h4>
                                    <p className="font-bold text-slate-500 dark:text-slate-400 text-sm">আপনার অ্যাকাউন্ট নিরাপদ আছে</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 flex items-center gap-6 shadow-sm">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500 dark:text-indigo-400 shrink-0">
                                    <Zap size={28} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 dark:text-white mb-0.5 tracking-tight uppercase text-xs">Plan Details</h4>
                                    <p className="font-bold text-slate-500 dark:text-slate-400 text-sm">প্রো মেম্বারশিপ ২০৩১ পর্যন্ত</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
