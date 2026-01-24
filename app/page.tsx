'use client';

import {
  ArrowRight,
  Atom,
  Calculator,
  CheckCircle2,
  ChevronDown,
  Copy,
  FlaskConical,
  Languages,
  Microscope,
  PlayCircle,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const FAQS = [
  {
    question: "MeetShikkha AI কি ভাবে সাহায্য করে?",
    answer: "MeetShikkha AI একটি অগ্রসর AI প্ল্যাটফর্ম যা গণিত, বিজ্ঞান এবং ইংরেজি সহ বিভিন্ন বিষয়ের জটিল সমস্যার সমাধান এবং ব্যাখ্যা প্রদান করে। এটি NCTB কারিকুলাম অনুসরণ করে এবং ধাপে ধাপে বুঝিয়ে দেয়।"
  },
  {
    question: "এটি কি বাংলা ভাষা সাপোর্ট করে?",
    answer: "হ্যাঁ! MeetShikkha AI বাংলা এবং ইংরেজি উভয় ভাষাই সাবলীলভাবে বুঝতে পারে এবং উত্তর দিতে পারে।"
  },
  {
    question: "আমি কি আমার প্রশ্নের ছবি আপলোড করতে পারি?",
    answer: "হ্যাঁ, আপনি আপনার টেক্সটবুক বা নোটের ছবি তুলে সরাসরি আপলোড করতে পারবেন এবং MeetShikkha AI সেটি স্ক্যান করে সমাধান করে দিবে।"
  },
  {
    question: "গণিতের ইকুয়েশন কি সঠিকভাবে দেখায়?",
    answer: "অবশ্যই। আমরা KaTeX প্রযুক্তি ব্যবহার করি যা সব ধরণের গাণিতিক সমীকরণ এবং ফর্মুলা একদম পরিষ্কারভাবে রেন্ডার করে।"
  }
];

const SUBJECTS_PREVIEW = [
  { name: 'Mathematics', bangla: 'গণিত', icon: Calculator, color: 'text-blue-600', bg: 'bg-blue-50' },
  { name: 'Physics', bangla: 'পদার্থবিজ্ঞান', icon: Atom, color: 'text-purple-600', bg: 'bg-purple-50' },
  { name: 'Chemistry', bangla: 'রসায়ন', icon: FlaskConical, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { name: 'Biology', bangla: 'জীববিজ্ঞান', icon: Microscope, color: 'text-rose-600', bg: 'bg-rose-50' },
  { name: 'English', bangla: 'ইংরেজি', icon: Languages, color: 'text-amber-600', bg: 'bg-amber-50' },
  { name: 'ICT', bangla: 'আইসিটি', icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
];

const PRICING = [
  {
    name: 'Free',
    bangla: 'ফ্রি',
    price: '৳০',
    features: ['প্রতিদিন ৩টি প্রশ্ন', 'বেসিক ব্যাখ্যা', 'সব বিষয় এক্সেস', 'মোবাইল সাপোর্ট'],
    button: 'ফ্রি শুরু করুন',
    popular: false
  },
  {
    name: 'Pro',
    bangla: 'প্রো',
    price: '৳২৯৯',
    period: '/মাস',
    features: ['আনলিমিটেড প্রশ্ন', 'ধাপে ধাপে বিস্তারিত ব্যাখ্যা', 'ফটো আপলোড (OCR)', '১০০% নয়েজ ফ্রি এক্সপেরিয়েন্স', 'প্রায়োরিটি সাপোর্ট'],
    button: 'প্রো মেম্বার হন',
    popular: true
  },
  {
    name: 'Student Plus',
    bangla: 'স্টুডেন্ট প্লাস',
    price: '৳৭৯৯',
    period: '/বছর',
    features: ['সব প্রো ফিচার', 'এআই ভিডিও টিউটোরিয়াল', 'অফলাইন পড়ার সুবিধা', 'এক্সাম প্রিপারেশন নোট'],
    button: 'বছরের সেরা ডিল নিন',
    popular: false
  }
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-600">

      {/* Soft Background Accent */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-indigo-50/50 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-purple-50/50 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900 font-inter">Meet<span className="text-indigo-600">ShikkhaAI</span></span>
          </div>

          {/* <div className="hidden lg:flex items-center gap-10">
            <a href="#features" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Features</a>
            <a href="#subjects" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Subjects</a>
            <a href="#pricing" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Pricing</a>
            <a href="#faq" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">FAQ</a>
          </div> */}

          <div className="flex items-center gap-4">
            <Link
              href="/ai"
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-100"
            >
              লগ ইন / সাইন আপ
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Image Layout with Soft White Theme */}
      <section className="relative pt-40 pb-20 px-6 lg:px-20 min-h-[85vh] flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">

          <div className="flex flex-col items-start animate-in fade-in slide-in-from-left-8 duration-1000">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
              শিক্ষার ভবিষ্যৎ <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">এবার তোমার হাতে</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 font-medium mb-10 max-w-xl leading-relaxed">
              দেশের প্রথম সম্পূর্ণ বাংলায় AI; জাতীয় কারিকুলাম অনুযায়ী সকল প্রশ্নের ইনস্ট্যান্ট উত্তর। পড়াশোনাকে সহজ করতে MeetShikkha AI সবসময় তোমার পাশে।
            </p>

            <div className="flex flex-wrap items-center gap-5 mb-14">
              <Link
                href="/ai"
                className="bg-indigo-600 text-white px-10 py-5 rounded-full font-bold text-lg shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:scale-105 transition-all active:scale-95"
              >
                ফ্রি'তে ট্রাই করুন
              </Link>
              <a
                href="#pricing"
                className="bg-white text-slate-700 border border-slate-200 px-10 py-5 rounded-full font-bold text-lg hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
              >
                প্যাকেজ দেখুন
              </a>
            </div>

            {/* Stats Badges from Image Structure */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-indigo-50/50 border border-indigo-100 px-4 py-2.5 rounded-xl">
                <div className="flex -space-x-2">
                  <div className="w-5 h-5 rounded-full bg-indigo-500 border border-white" />
                  <div className="w-5 h-5 rounded-full bg-purple-500 border border-white" />
                </div>
                <span className="text-[13px] font-bold text-slate-600">৫,০০০+ শিক্ষার্থী যুক্ত হয়েছে</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50/50 border border-emerald-100 px-4 py-2.5 rounded-xl">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span className="text-[13px] font-bold text-slate-600">১ লক্ষ+ প্রশ্নের সমাধান</span>
              </div>
              <div className="flex items-center gap-2 bg-amber-50/50 border border-amber-100 px-4 py-2.5 rounded-xl">
                <PlayCircle size={16} className="text-amber-600" />
                <span className="text-[13px] font-bold text-slate-600">১০,০০০+ ছবি দিয়ে সমাধান</span>
              </div>
            </div>
          </div>

          {/* Right Side Chat Preview (Dark Styled for Contrast) */}
          <div className="relative animate-in fade-in zoom-in-95 duration-1000 delay-200 hidden lg:block">
            <div className="bg-[#1a1625] border border-white/5 rounded-[40px] p-10 shadow-[0_32px_100px_-20px_rgba(0,0,0,0.3)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full" />

              <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-4">
                <span className="text-slate-200 font-bold text-lg">প্রশ্ন - উত্তর</span>
              </div>

              <div className="space-y-8">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-white/5 border border-white/10 p-5 rounded-3xl rounded-tr-none max-w-[80%]">
                    <p className="text-white font-bold mb-1 font-inter">X^2 - 9 = 0</p>
                    <p className="text-slate-400 text-sm font-medium">এই অংকটার সমাধান করে দিন</p>
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 mt-1 shadow-lg shadow-indigo-900/20">
                    <Sparkles size={20} />
                  </div>
                  <div className="space-y-4 flex-1">
                    <div className="text-slate-200 font-medium leading-relaxed">
                      <p className="mb-2">x² - 9 = 0 সমাধানের জন্য:</p>
                      <p className="mb-1">x² = 9</p>
                      <p className="mb-1">x = ±√9 = ±3</p>
                      <p className="font-bold text-indigo-400">সুতরাং, x = 3 অথবা x = -3</p>
                    </div>
                    <div className="flex items-center gap-4 text-slate-600 pt-4">
                      <Copy size={16} className="hover:text-slate-300 cursor-pointer transition-colors" />
                      <ThumbsUp size={16} className="hover:text-indigo-400 cursor-pointer transition-colors" />
                      <ThumbsDown size={16} className="hover:text-indigo-400 cursor-pointer transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decoration elements */}
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-indigo-50 rounded-2xl -z-10 animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-purple-50 rounded-full -z-10" />
          </div>
        </div>
      </section>

      {/* Subject Grid */}
      <section id="subjects" className="py-32 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">সব বিষয় এক জায়গায়</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">ষষ্ঠ শ্রেণী থেকে ডিগ্ৰি পর্যন্ত সব বিষয়ের সমস্যার সমাধান এখন এক জায়গায়।</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {SUBJECTS_PREVIEW.map((s, i) => (
              <div key={i} className="p-8 rounded-[32px] bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1 transition-all text-center group cursor-pointer">
                <div className={`w-14 h-14 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <s.icon className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-slate-900 mb-1">{s.bangla}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{s.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">সঠিক প্ল্যানটি বেছে নিন</h2>
            <p className="text-slate-500 font-medium">পড়াশোনা শুরু হোক কোনো বাধা ছাড়াই।</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {PRICING.map((p, i) => (
              <div key={i} className={`p-10 rounded-[44px] bg-white border ${p.popular ? 'border-indigo-500 shadow-2xl shadow-indigo-100 ring-4 ring-indigo-50' : 'border-slate-100 shadow-sm'} flex flex-col relative group`}>
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
                <button className={`w-full py-5 rounded-3xl font-black transition-all ${p.popular ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:scale-[1.02]' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}>
                  {p.button}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 px-6 bg-slate-50/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-16 text-slate-900">জিজ্ঞাসিত প্রশ্নাবলী</h2>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:border-indigo-100 transition-all shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left"
                >
                  <span className="text-lg font-bold text-slate-700">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === idx ? 'max-h-96' : 'max-h-0 opacity-0'}`}>
                  <p className="px-8 pb-6 text-slate-500 font-medium leading-relaxed border-t border-slate-50 pt-4">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-indigo-600 rounded-[60px] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-100">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-black mb-10 leading-tight">সাফল্যের পথে আরও এক ধাপ এগিয়ে যাও আজই।</h2>
            <Link
              href="/ai"
              className="inline-flex items-center gap-4 bg-white text-indigo-600 px-12 py-6 rounded-full font-black text-xl shadow-2xl hover:scale-105 transition-all active:scale-95"
            >
              ফ্রি অ্যাকাউন্ট খোলো
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 font-inter">MeetShikkha<span className="text-indigo-600">AI</span></span>
          </div>

          <div className="flex gap-10 text-sm font-bold text-slate-400">
            <a href="#" className="hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]">Contact</a>
            <a href="#" className="hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]">Terms</a>
          </div>

          <p className="text-sm font-bold text-slate-400 font-inter">© 2026 MeetShikkha AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
