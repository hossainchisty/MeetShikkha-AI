'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { useTheme } from '@/lib/ThemeContext';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import {
  ArrowRight,
  Atom,
  Calculator,
  CheckCircle2,
  ChevronDown,
  FlaskConical,
  Globe,
  Languages,
  Microscope,
  Moon,
  PlayCircle,
  Sparkles,
  Sun,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useState } from 'react';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const isBn = t.settings.languageName === 'বাংলা';

  const SUBJECTS_PREVIEW = [
    { name: 'Mathematics', bangla: isBn ? 'গণিত' : 'Mathematics', icon: Calculator, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { name: 'Physics', bangla: isBn ? 'পদার্থবিজ্ঞান' : 'Physics', icon: Atom, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { name: 'Chemistry', bangla: isBn ? 'রসায়ন' : 'Chemistry', icon: FlaskConical, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { name: 'Biology', bangla: isBn ? 'জীববিজ্ঞান' : 'Biology', icon: Microscope, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20' },
    { name: 'English', bangla: isBn ? 'ইংরেজি' : 'English', icon: Languages, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { name: 'ICT', bangla: isBn ? 'আইসিটি' : 'ICT', icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
  ];

  const PRICING = [
    {
      name: 'Free',
      bangla: isBn ? 'ফ্রি' : 'Free',
      price: isBn ? '৳০' : '$0',
      features: isBn
        ? ['প্রতিদিন ৩টি প্রশ্ন', 'বেসিক ব্যাখ্যা', 'সব বিষয় এক্সেস', 'মোবাইল সাপোর্ট']
        : ['3 questions per day', 'Basic explanation', 'All subjects access', 'Mobile support'],
      button: isBn ? 'ফ্রি শুরু করুন' : 'Start Free',
      popular: false
    },
    {
      name: 'Pro',
      bangla: isBn ? 'প্রো' : 'Pro',
      price: isBn ? '৳২৯৯' : '$3',
      period: isBn ? '/মাস' : '/mo',
      features: isBn
        ? ['আনলিমিটেড প্রশ্ন', 'ধাপে ধাপে বিস্তারিত ব্যাখ্যা', 'ফটো আপলোড (OCR)', '১০০% নয়েজ ফ্রি এক্সপেরিয়েন্স', 'প্রায়োরিটি সাপোর্ট']
        : ['Unlimited questions', 'Step-by-step explanations', 'Photo upload (OCR)', '100% Ad-free experience', 'Priority support'],
      button: isBn ? 'প্রো মেম্বার হন' : 'Go Pro',
      popular: true
    },
    {
      name: 'Student Plus',
      bangla: isBn ? 'স্টুডেন্ট প্লাস' : 'Student Plus',
      price: isBn ? '৳৭৯৯' : '$8',
      period: isBn ? '/বছর' : '/yr',
      features: isBn
        ? ['সব প্রো ফিচার', 'এআই ভিডিও টিউটোরিয়াল', 'অফলাইন পড়ার সুবিধা', 'এক্সাম প্রিপারেশন নোট']
        : ['All Pro features', 'AI video tutorials', 'Offline study mode', 'Exam prep notes'],
      button: isBn ? 'বছরের সেরা ডিল নিন' : 'Best Deal',
      popular: false
    }
  ];

  const FAQS = [
    {
      question: isBn ? "MeetShikkha AI কি ভাবে সাহায্য করে?" : "How does MeetShikkha AI help?",
      answer: isBn
        ? "MeetShikkha AI একটি অগ্রসর AI প্ল্যাটফর্ম যা গণিত, বিজ্ঞান এবং ইংরেজি সহ বিভিন্ন বিষয়ের জটিল সমস্যার সমাধান এবং ব্যাখ্যা প্রদান করে। এটি NCTB কারিকুলাম অনুসরণ করে এবং ধাপে ধাপে বুঝিয়ে দেয়।"
        : "MeetShikkha AI is an advanced AI platform that provides solutions and explanations for complex problems in subjects like Math, Science, and English. It follows the NCTB curriculum and explains things step-by-step."
    },
    {
      question: isBn ? "এটি কি বাংলা ভাষা সাপোর্ট করে?" : "Does it support Bangla?",
      answer: isBn
        ? "হ্যাঁ! MeetShikkha AI বাংলা এবং ইংরেজি উভয় ভাষাই সাবলীলভাবে বুঝতে পারে এবং উত্তর দিতে পারে।"
        : "Yes! MeetShikkha AI can understand and respond fluently in both Bangla and English."
    },
    {
      question: isBn ? "আমি কি আমার প্রশ্নের ছবি আপলোড করতে পারি?" : "Can I upload photos of my questions?",
      answer: isBn
        ? "হ্যাঁ, আপনি আপনার টেক্সটবুক বা নোটের ছবি তুলে সরাসরি আপলোড করতে পারবেন এবং MeetShikkha AI সেটি স্ক্যান করে সমাধান করে দিবে।"
        : "Yes, you can upload photos of your textbook or notes directly, and MeetShikkha AI will scan and solve them for you."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] font-sans text-slate-900 dark:text-slate-100 selection:bg-indigo-100 dark:selection:bg-indigo-900 transition-colors duration-500">

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-indigo-50/50 dark:bg-indigo-900/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-purple-50/50 dark:bg-purple-900/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-b border-slate-100/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-inter">
                Meet<span className="text-indigo-600">ShikkhaAI</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {/* Theme Toggle */}
              {/* <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-slate-100 dark:border-slate-700 shadow-sm"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button> */}

              {/* Language Switcher */}
              {/* <button
                onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-xs font-black uppercase tracking-wider"
              >
                <Globe size={14} />
                {language === 'bn' ? 'English' : 'বাংলা'}
              </button> */}

              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />

              <SignedOut>
                <div className="flex items-center gap-4">
                  {/* <SignInButton mode="modal">
                    <button className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors">
                      {t.common.login}
                    </button>
                  </SignInButton> */}
                  {/* <SignUpButton mode="modal">
                    <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-100 dark:shadow-none">
                      {t.common.signup}
                    </button>
                  </SignUpButton> */}
                  <SignInButton mode="modal">
                    <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-100 dark:shadow-none">
                      {t.common.signup}
                    </button>
                  </SignInButton>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center gap-5">
                  <Link href="/chat" className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-100 dark:shadow-none">
                    {t.common.dashboard}
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
              <button
                onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              >
                <Globe size={18} />
              </button>
              <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-full font-bold text-xs shadow-lg shadow-indigo-100 dark:shadow-none">
                    {t.common.login}
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-20 px-6 lg:px-20 min-h-[85vh] flex items-center overflow-hidden z-10">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center relative">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="flex flex-col items-start">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
              {isBn ? (
                <>শিক্ষার ভবিষ্যৎ <br /><motion.span animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 5, repeat: Infinity }} className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto]">এবার তোমার হাতে</motion.span></>
              ) : (
                <>The Future of Education <br /><motion.span animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 5, repeat: Infinity }} className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto]">In Your Hands</motion.span></>
              )}
            </h1>
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium mb-10 max-w-xl leading-relaxed">{t.landing.heroSubtitle}</p>
            <div className="flex flex-wrap items-center gap-5 mb-14">
              <SignedOut><SignUpButton mode="modal"><button className="bg-indigo-600 text-white px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-all">{t.landing.getStarted}</button></SignUpButton></SignedOut>
              <SignedIn><Link href="/chat" className="bg-indigo-600 text-white px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-all">{t.common.dashboard}</Link></SignedIn>
              <a href="#pricing" className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-10 py-5 rounded-full font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">{t.landing.viewPricing}</a>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/50 px-4 py-2.5 rounded-xl"><div className="flex -space-x-2"><div className="w-5 h-5 rounded-full bg-indigo-500 border border-white dark:border-slate-900" /><div className="w-5 h-5 rounded-full bg-purple-500 border border-white dark:border-slate-900" /></div><span className="text-[13px] font-bold text-slate-600 dark:text-slate-400">{t.landing.statsStudents}</span></div>
              <div className="flex items-center gap-2 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/50 px-4 py-2.5 rounded-xl"><CheckCircle2 size={16} className="text-emerald-600" /><span className="text-[13px] font-bold text-slate-600 dark:text-slate-400">{t.landing.statsSolutions}</span></div>
              <div className="flex items-center gap-2 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/50 px-4 py-2.5 rounded-xl"><PlayCircle size={16} className="text-amber-600" /><span className="text-[13px] font-bold text-slate-600 dark:text-slate-400">{t.landing.statsImages}</span></div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="relative hidden lg:block lg:-mt-20">
            <div className="bg-[#1a1625] dark:bg-slate-900 border border-white/5 dark:border-white/10 rounded-[40px] p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 transition-opacity" />
              <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-4"><span className="text-slate-200 dark:text-white font-bold text-lg">{isBn ? 'প্রশ্ন - উত্তর' : 'Questions & Answers'}</span></div>
              <div className="space-y-8">
                <div className="flex justify-end"><div className="bg-white/5 border border-white/10 p-5 rounded-3xl rounded-tr-none max-w-[80%]"><p className="text-white font-bold mb-1 font-inter">X^2 - 9 = 0</p><p className="text-slate-400 text-sm font-medium">{isBn ? 'এই অংকটার সমাধান করে দিন' : 'Solve this math problem'}</p></div></div>
                <div className="flex gap-4"><div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg"><Sparkles size={20} /></div><div className="space-y-4 flex-1"><div className="text-slate-200 font-medium leading-relaxed"><p className="mb-2">{isBn ? 'x² - 9 = 0 সমাধানের জন্য:' : 'To solve x² - 9 = 0:'}</p><p className="mb-1">x² = 9</p><p className="mb-1">x = ±√9 = ±3</p><p className="font-bold text-indigo-400">{isBn ? 'সুতরাং, x = 3 অথবা x = -3' : 'So, x = 3 or x = -3'}</p></div></div></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Subjects */}
      <section id="subjects" className="py-32 px-6 bg-slate-50/50 dark:bg-slate-900/50 z-10 relative">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">{t.landing.subjectsTitle}</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium mb-16">{t.landing.subjectsSubtitle}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {SUBJECTS_PREVIEW.map((s, i) => (
              <motion.div key={i} whileHover={{ y: -8, scale: 1.02 }} className="p-8 rounded-[32px] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500 hover:shadow-2xl transition-all text-center group cursor-pointer">
                <div className={`w-14 h-14 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110`}><s.icon className="w-7 h-7" /></div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">{s.bangla}</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{s.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-6 z-10 relative">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">{t.landing.pricingTitle}</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-20">{t.landing.pricingSubtitle}</p>
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {PRICING.map((p, i) => (
              <div key={i} className={`p-10 rounded-[44px] bg-white dark:bg-slate-800 border ${p.popular ? 'border-indigo-500 shadow-2xl dark:shadow-none ring-4 ring-indigo-50 dark:ring-indigo-900/20' : 'border-slate-100 dark:border-slate-700'} flex flex-col relative text-left transition-all hover:-translate-y-1`}>
                {p.popular && <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">Most Popular</div>}
                <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">{p.bangla}</h3>
                <div className="flex items-baseline gap-1 mb-8"><span className="text-5xl font-black text-slate-900 dark:text-white">{p.price}</span><span className="text-slate-400 dark:text-slate-500 font-bold">{p.period || ''}</span></div>
                <div className="space-y-4 mb-12 flex-1">
                  {p.features.map((f, fi) => (
                    <div key={fi} className="flex gap-3 text-sm text-slate-600 dark:text-slate-300 font-medium leading-snug"><CheckCircle2 size={18} className="text-indigo-500 shrink-0" /> {f}</div>
                  ))}
                </div>
                <button className={`w-full py-5 rounded-3xl font-black transition-all ${p.popular ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600'}`}>{p.button}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-32 px-6 bg-slate-50/50 dark:bg-slate-900/50 z-10 relative">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-16 text-slate-900 dark:text-white">{t.landing.faqTitle}</h2>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden hover:border-indigo-100 dark:hover:border-indigo-500 transition-all shadow-sm">
                <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full px-8 py-6 flex items-center justify-between text-left">
                  <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === idx ? 'max-h-96' : 'max-h-0 opacity-0'}`}><p className="px-8 pb-6 text-slate-500 dark:text-slate-400 font-medium leading-relaxed border-t border-slate-50 dark:border-slate-700 pt-4">{faq.answer}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 z-10 relative">
        <div className="max-w-7xl mx-auto bg-indigo-600 rounded-[60px] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-black mb-10 leading-tight">{t.landing.ctaTitle}</h2>
            <SignedOut><SignUpButton mode="modal"><button className="inline-flex items-center gap-4 bg-white text-indigo-600 px-12 py-6 rounded-full font-black text-xl shadow-2xl hover:scale-105 transition-all">{t.landing.ctaButton}<ArrowRight className="w-6 h-6" /></button></SignUpButton></SignedOut>
            <SignedIn><Link href="/chat" className="inline-flex items-center gap-4 bg-white text-indigo-600 px-12 py-6 rounded-full font-black text-xl shadow-2xl hover:scale-105 transition-all">{t.landing.ctaDashboard}<ArrowRight className="w-6 h-6" /></Link></SignedIn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-100 dark:border-slate-800 z-10 relative bg-white dark:bg-[#0f172a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 text-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white"><Sparkles className="w-5 h-5" /></div>
            <span className="text-xl font-black text-slate-900 dark:text-white font-inter">MeetShikkha<span className="text-indigo-600">AI</span></span>
          </div>
          <div className="flex gap-10 text-sm font-bold text-slate-400 dark:text-slate-500">
            <a href="#" className="hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]">{t.common.contact}</a>
            <a href="#" className="hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]">{t.common.privacy}</a>
            <a href="#" className="hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]">{t.common.terms}</a>
          </div>
          <p className="text-sm font-bold text-slate-400 dark:text-slate-500 font-inter">© {new Date().getFullYear()} MeetShikkha AI. {t.common.rights}</p>
        </div>
      </footer>
    </div>
  );
}
