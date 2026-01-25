import { CheckCircle2, ChevronLeft, Clock, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

const PLANS = [
    {
        name: 'Free',
        bangla: 'ফ্রি',
        price: '৳০',
        features: ['প্রতিদিন ৩টি প্রশ্ন', 'বেসিক ব্যাখ্যা', 'সব বিষয় এক্সেস', 'মোবাইল সাপোর্ট'],
        current: true
    },
    {
        name: 'Pro',
        bangla: 'প্রো',
        price: '৳২৯৯',
        period: '/মাস',
        features: ['আনলিমিটেড প্রশ্ন', 'ধাপে ধাপে বিস্তারিত ব্যাখ্যা', 'ফটো আপলোড (OCR)', '১০০% নয়েজ ফ্রি এক্সপেরিয়েন্স', 'প্রায়োরিটি সাপোর্ট'],
        popular: true
    },
    {
        name: 'Student Plus',
        bangla: 'স্টুডেন্ট প্লাস',
        price: '৳৭৯৯',
        period: '/বছর',
        features: ['সব প্রো ফিচার', 'এআই ভিডিও টিউটোরিয়াল', 'অফলাইন পড়ার সুবিধা', 'এক্সাম প্রিপারেশন নোট'],
    }
];

export default function SubscriptionPage() {
    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
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
                            <span className="text-xl font-black text-slate-900">সাবস্ক্রিপশন প্ল্যান</span>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6">
                {/* Status Card */}
                <div className="bg-indigo-600 rounded-[32px] p-8 md:p-12 text-white mb-12 relative overflow-hidden shadow-2xl shadow-indigo-100">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <p className="text-indigo-100 font-bold uppercase tracking-widest text-[12px] mb-2">আপনার বর্তমান স্ট্যাটাস</p>
                                <h2 className="text-3xl md:text-4xl font-black mb-4">ফ্রি মেম্বারশিপ</h2>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-bold">
                                        <Clock size={16} /> ২০ দিন বাকি
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-bold">
                                        <Zap size={16} /> ১ লক্ষ্য+ প্রশ্নের উত্তর
                                    </div>
                                </div>
                            </div>
                            <button className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all active:scale-95">
                                প্লাটিক পরিবর্তন করুন
                            </button>
                        </div>
                    </div>
                </div>

                {/* Pricing Grid */}
                <div className="grid md:grid-cols-3 gap-8 items-stretch">
                    {PLANS.map((p, i) => (
                        <div key={i} className={`p-10 rounded-[44px] bg-white border ${p.popular ? 'border-indigo-500 shadow-2xl shadow-indigo-100 ring-4 ring-indigo-50' : 'border-slate-100 shadow-sm'} flex flex-col relative group transition-all hover:-translate-y-1`}>
                            {p.popular && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">Most Popular</div>
                            )}
                            <h3 className="text-xl font-bold mb-4 text-slate-800">{p.bangla}</h3>
                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-5xl font-black text-slate-900">{p.price}</span>
                                <span className="text-slate-400 font-bold">{p.period || ''}</span>
                            </div>
                            <div className="space-y-4 mb-12 flex-1">
                                {p.features.map((f, fi) => (
                                    <div key={fi} className="flex gap-3 text-sm text-slate-600 font-medium leading-snug">
                                        <CheckCircle2 size={18} className="text-indigo-500 shrink-0" /> {f}
                                    </div>
                                ))}
                            </div>
                            <button
                                disabled={p.current}
                                className={`w-full py-5 rounded-3xl font-black transition-all ${p.current
                                        ? 'bg-slate-50 text-slate-400 cursor-default'
                                        : p.popular
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:scale-[1.02]'
                                            : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                                    }`}
                            >
                                {p.current ? 'বর্তমান প্ল্যান' : 'আপগ্রেড করুন'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
