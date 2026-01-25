import { Bell, ChevronLeft, Eye, Globe, Moon, Shield, Smartphone, Sparkles } from "lucide-react";
import Link from "next/link";

interface SettingItem {
    name: string;
    bangla: string;
    icon: any;
    description: string;
    active?: boolean;
    value?: string;
}

interface SettingGroup {
    title: string;
    bangla: string;
    items: SettingItem[];
}

const SETTINGS_GROUPS: SettingGroup[] = [
    {
        title: "Preference",
        bangla: "পছন্দ",
        items: [
            { name: "Dark Mode", bangla: "ডার্ক মোড", icon: Moon, description: "চোখের আরামের জন্য ডার্ক থিম ব্যবহার করুন", active: false },
            { name: "Language", bangla: "ভাষা পরিবর্তন", icon: Globe, description: "বাংলা বা ইংরেজি ভাষা সেট করুন", value: "Bengali" },
        ]
    },
    {
        title: "Account & Safety",
        bangla: "অ্যাকাউন্ট ও নিরাপত্তা",
        items: [
            { name: "Notifications", bangla: "নোটিফিকেশন", icon: Bell, description: "নতুন আপডেট এবং খবরের বার্তা পান", active: true },
            { name: "Privacy", bangla: "প্রাইভেসি", icon: Eye, description: "আপনার ডাটা কার সাথে শেয়ার করবেন তা নিয়ন্ত্রণ করুন" },
            { name: "Security", bangla: "নিরাপত্তা", icon: Shield, description: "দ্বি-স্তর বিশিষ্ট নিরাপত্তা ব্যবস্থার সেটিংস" },
        ]
    },
    {
        title: "Usage",
        bangla: "ব্যবহার",
        items: [
            { name: "Devices", bangla: "ডিভাইস লিস্ট", icon: Smartphone, description: "কোন কোন ডিভাইসে লগ ইন করা আছে তা দেখুন" },
        ]
    }
];

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
            {/* Navigation Header */}
            <nav className="h-20 bg-white border-b border-slate-100 px-6 mb-8 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/chat" className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-all">
                            <ChevronLeft size={24} />
                        </Link>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                                <Sparkles size={18} />
                            </div>
                            <span className="text-xl font-black text-slate-900">সেটিংস</span>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6">
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {SETTINGS_GROUPS.map((group, gIdx) => (
                        <div key={gIdx}>
                            <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-4">{group.bangla}</h3>
                            <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
                                {group.items.map((item, iIdx) => (
                                    <div
                                        key={iIdx}
                                        className={`p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors cursor-pointer group ${iIdx !== group.items.length - 1 ? 'border-b border-slate-50' : ''}`}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                                                <item.icon size={22} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-[15px]">{item.bangla}</h4>
                                                <p className="text-[12px] font-medium text-slate-400 mt-0.5">{item.description}</p>
                                            </div>
                                        </div>

                                        {/* Input UI Elements */}
                                        <div className="flex items-center">
                                            {item.active !== undefined && (
                                                <div className={`w-11 h-6 rounded-full transition-all relative ${item.active ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.active ? 'left-6' : 'left-1'}`}></div>
                                                </div>
                                            )}

                                            {item.value && (
                                                <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">{item.value}</span>
                                            )}

                                            {item.active === undefined && !item.value && (
                                                <ChevronLeft size={16} className="text-slate-300 rotate-180" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
