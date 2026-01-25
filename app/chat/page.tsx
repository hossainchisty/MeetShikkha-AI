'use client';

import { SUBJECTS } from '@/lib/constants';
import { useLanguage } from '@/lib/LanguageContext';
import { useTheme } from '@/lib/ThemeContext';
import { Message, Subject } from '@/lib/types';
import { SignedIn, useClerk, UserButton, useUser } from '@clerk/nextjs';
import DOMPurify from 'dompurify';
import Link from 'next/link';
// @ts-ignore
import renderMathInElement from 'katex/dist/contrib/auto-render';
import {
  Atom,
  Calculator,
  ChevronDown,
  CreditCard,
  FlaskConical,
  Image as ImageIcon,
  Languages,
  LogOut,
  Menu,
  Microscope,
  Moon,
  MoreVertical,
  PlayCircle,
  Plus,
  Send,
  Settings,
  Sparkles,
  Sun,
  User,
  X
} from 'lucide-react';
import { marked } from 'marked';
import React, { useEffect, useMemo, useRef, useState } from 'react';

const IconMap: Record<string, React.FC<any>> = {
  Calculator: Calculator,
  Atom: Atom,
  FlaskConical: FlaskConical,
  Microscope: Microscope,
  Languages: Languages,
};

export default function Home() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { t } = useLanguage();
  const { theme: appTheme, toggleTheme } = useTheme();

  const [selectedSubject, setSelectedSubject] = useState<Subject>('Mathematics');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubjectMenuOpen, setIsSubjectMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('studyx_history');
    if (saved) {
      try {
        setAllMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Dynamic color configuration
  const theme = useMemo(() => {
    const color = 'indigo';

    const colorMap: Record<string, any> = {
      blue: {
        primary: 'bg-blue-600',
        primaryHover: 'hover:bg-blue-700',
        text: 'text-blue-600',
        bgLight: 'bg-blue-50 dark:bg-blue-900/20',
        borderLight: 'border-blue-100 dark:border-blue-800/50',
        ring: 'ring-blue-500/10',
        gradient: 'from-blue-600 to-indigo-600',
        softGradient: 'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.08) 0%, rgba(255, 255, 255, 0) 70%)'
      },
      purple: {
        primary: 'bg-purple-600',
        primaryHover: 'hover:bg-purple-700',
        text: 'text-purple-600',
        bgLight: 'bg-purple-50 dark:bg-purple-900/20',
        borderLight: 'border-purple-100 dark:border-purple-800/50',
        ring: 'ring-purple-500/10',
        gradient: 'from-purple-600 to-fuchsia-600',
        softGradient: 'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.08) 0%, rgba(255, 255, 255, 0) 70%)'
      },
      emerald: {
        primary: 'bg-emerald-600',
        primaryHover: 'hover:bg-emerald-700',
        text: 'text-emerald-600',
        bgLight: 'bg-emerald-50 dark:bg-emerald-900/20',
        borderLight: 'border-emerald-100 dark:border-emerald-800/50',
        ring: 'ring-emerald-500/10',
        gradient: 'from-emerald-600 to-teal-600',
        softGradient: 'radial-gradient(circle at 50% 50%, rgba(5, 150, 105, 0.08) 0%, rgba(255, 255, 255, 0) 70%)'
      },
      rose: {
        primary: 'bg-rose-600',
        primaryHover: 'hover:bg-rose-700',
        text: 'text-rose-600',
        bgLight: 'bg-rose-50 dark:bg-rose-900/20',
        borderLight: 'border-rose-100 dark:border-rose-800/50',
        ring: 'ring-rose-500/10',
        gradient: 'from-rose-600 to-pink-600',
        softGradient: 'radial-gradient(circle at 50% 50%, rgba(225, 29, 72, 0.08) 0%, rgba(255, 255, 255, 0) 70%)'
      },
      amber: {
        primary: 'bg-amber-600',
        primaryHover: 'hover:bg-amber-700',
        text: 'text-amber-600',
        bgLight: 'bg-amber-50 dark:bg-amber-900/20',
        borderLight: 'border-amber-100 dark:border-amber-800/50',
        ring: 'ring-amber-500/10',
        gradient: 'from-amber-600 to-amber-700',
        softGradient: 'none'
      },
      indigo: {
        primary: 'bg-indigo-600',
        primaryHover: 'hover:bg-indigo-700',
        text: 'text-indigo-600',
        bgLight: 'bg-indigo-50 dark:bg-indigo-900/20',
        borderLight: 'border-indigo-100 dark:border-indigo-800/50',
        ring: 'ring-indigo-500/10',
        gradient: 'from-indigo-600 to-purple-600',
        softGradient: 'radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.08) 0%, rgba(255, 255, 255, 0) 70%)'
      }
    };

    return colorMap[color] || colorMap.indigo;
  }, []);

  // Persistence
  useEffect(() => {
    if (allMessages.length > 0) {
      localStorage.setItem('studyx_history', JSON.stringify(allMessages));
    }
  }, [allMessages]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Math Rendering & Auto-scroll Effect
  useEffect(() => {
    if (chatContainerRef.current) {
      try {
        renderMathInElement(chatContainerRef.current, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\(", right: "\\)", display: false },
            { left: "\\[", right: "\\]", display: true }
          ],
          throwOnError: false
        });
      } catch (e) {
        console.error("Math rendering error:", e);
      }
    }

    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);

    return () => clearTimeout(timer);
  }, [allMessages, isTyping, selectedSubject]);

  const currentSubjectMessages = useMemo(() => {
    return allMessages.filter(m => m.subject === selectedSubject);
  }, [allMessages, selectedSubject]);

  const historySummaries = useMemo(() => {
    const userMsgs = allMessages.filter(m => m.role === 'user');
    const seen = new Set();
    return userMsgs.filter(m => {
      const isDuplicate = seen.has(m.text);
      seen.add(m.text);
      return !isDuplicate;
    }).slice(-10).reverse();
  }, [allMessages]);

  const handleSendTextMessage = async (textOverride?: string) => {
    const textToSend = textOverride || chatInput.trim();
    if (!textToSend || isTyping) return;

    setChatInput('');
    setIsTyping(true);
    setError(null);

    const userMessageObj: Message = {
      id: Date.now() + '-tu',
      role: 'user',
      text: textToSend,
      timestamp: Date.now(),
      subject: selectedSubject
    };
    setAllMessages(prev => [...prev, userMessageObj]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, subject: selectedSubject }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const assistantMessageObj: Message = {
        id: Date.now() + '-tm',
        role: 'assistant',
        text: data.text,
        timestamp: Date.now(),
        subject: selectedSubject
      };
      setAllMessages(prev => [...prev, assistantMessageObj]);
    } catch (err: any) {
      console.error(err);
      setError((t.settings.languageName === 'বাংলা' ? "সংযোগ বিচ্ছিন্ন হয়েছে। অনুগ্রহ করে আবার বার্তাটি পাঠান। " : "Connection lost. Please try sending the message again. ") + (err.message || ""));
    } finally {
      setIsTyping(false);
    }
  };

  const startNewQuestion = () => {
    setChatInput('');
    setAllMessages(prev => prev.filter(m => m.subject !== selectedSubject));
  };

  const renderMarkdown = (text: string) => {
    const rawHtml = text ? (marked.parse(text) as string) : '';
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    return { __html: cleanHtml };
  };

  const popularQuestions = t.settings.languageName === 'বাংলা'
    ? [
      "ত্রিভুজের ক্ষেত্রফল কিভাবে বের করবো?",
      "দ্বিঘাত সমীকরণ কিভাবে সমাধান করবো?",
      "ম্যাট্রিক্স যোগ করার শর্টকাট কী?",
      "সমান্তর ধারার সাধারণ পদ বের করার নিয়ম কী?",
      "বিন্যাস ও সমাবেশের মধ্যে পার্থক্য কী?"
    ]
    : [
      "How to find the area of a triangle?",
      "How do I solve a quadratic equation?",
      "What is the shortcut for matrix addition?",
      "What is the rule for finding the general term of an arithmetic progression?",
      "What is the difference between permutation and combination?"
    ];

  const getSubjectIcon = (subjectName: Subject, className?: string) => {
    const sub = SUBJECTS.find(s => s.name === subjectName);
    if (!sub) return <Sparkles className={className} />;
    const IconComp = IconMap[sub.icon] || Sparkles;
    return <IconComp className={className} />;
  };

  const getSubjectTextColor = (subjectName: Subject) => {
    const sub = SUBJECTS.find(s => s.name === subjectName);
    const colorMap: Record<string, string> = {
      blue: 'text-blue-600 dark:text-blue-400',
      purple: 'text-purple-600 dark:text-purple-400',
      emerald: 'text-emerald-600 dark:text-emerald-400',
      rose: 'text-rose-600 dark:text-rose-400',
      amber: 'text-amber-600 dark:text-amber-400',
    };
    return colorMap[sub?.color || ''] || 'text-indigo-600 dark:text-indigo-400';
  };

  const subjectNames: Record<string, string> = t.settings.languageName === 'বাংলা' ? {
    'Mathematics': 'গণিত',
    'Physics': 'পদার্থবিজ্ঞান',
    'Chemistry': 'রসায়ন',
    'Biology': 'জীববিজ্ঞান',
    'English': 'ইংরেজি',
    'Class 6 Bangla 1st Paper': '[Class 6] বাংলা ১ম পত্র',
    'Class 6 Bangla 2nd Paper': '[Class 6] বাংলা ২য় পত্রর',
    'Class 6 English 2nd Paper': '[Class 6] ইংরেজী ২য় পত্র',
    'Class 6 ICT': '[Class 6] ICT',
    'Class 6 Math': '[Class 6] গণিত',
    'Class 6 Science': '[Class 6] বিজ্ঞান',
    'Class 7 Bangla 1st Paper': '[Class 7] বাংলা ১ম পত্র',
    'Class 7 Bangla 2nd Paper': '[Class 7] বাংলা ২য় পত্রর',
    'Class 7 English 2nd Paper': '[Class 7] ইংরেজী ২য় পত্র',
    'Class 7 ICT': '[Class 7] ICT',
    'Class 7 Bangladesh And Global Studies': '[Class 7] বাংলাদেশ ও বিশ্ব পরিচয়'
  } : {
    'Mathematics': 'Mathematics',
    'Physics': 'Physics',
    'Chemistry': 'Chemistry',
    'Biology': 'Biology',
    'English': 'English',
    'Class 6 Bangla 1st Paper': '[Class 6] Bangla 1st',
    'Class 6 Bangla 2nd Paper': '[Class 6] Bangla 2nd',
    'Class 6 English 2nd Paper': '[Class 6] English 2nd',
    'Class 6 ICT': '[Class 6] ICT',
    'Class 6 Math': '[Class 6] Mathematics',
    'Class 6 Science': '[Class 6] Science',
    'Class 7 Bangla 1st Paper': '[Class 7] Bangla 1st',
    'Class 7 Bangla 2nd Paper': '[Class 7] Bangla 2nd',
    'Class 7 English 2nd Paper': '[Class 7] English 2nd',
    'Class 7 ICT': '[Class 7] ICT',
    'Class 7 Bangladesh And Global Studies': '[Class 7] BGS'
  };

  const BrandIcon = Sparkles;

  return (
    <div className="flex h-screen bg-white dark:bg-[#0f172a] overflow-hidden font-sans relative transition-colors duration-500">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 border-r border-[#F3F4F6] dark:border-slate-800 z-50 md:static md:translate-x-0 transition-transform duration-300 flex flex-col ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl ${theme.primary} flex items-center justify-center text-white shadow-lg transition-colors duration-500`}>
              <BrandIcon size={20} />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">MeetShikkha<span className={theme.text}>AI</span></span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="px-4 mb-6">
          <button
            onClick={() => {
              startNewQuestion();
              setIsSidebarOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-2.5 rounded-lg font-bold transition-all text-sm shadow-sm active:scale-95"
          >
            <Plus size={16} className={theme.text} />
            {t.settings.languageName === 'বাংলা' ? 'নতুন প্রশ্ন' : 'New Question'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
          <h3 className="px-4 text-[12px] font-bold text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-wider">{t.settings.languageName === 'বাংলা' ? 'হিস্ট্রি' : 'History'}</h3>
          <div className="space-y-0.5">
            {historySummaries.length > 0 ? historySummaries.map((msg) => (
              <button
                key={msg.id}
                className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-[#F9FAFB] dark:hover:bg-slate-800 group flex items-center justify-between transition-colors"
                onClick={() => {
                  handleSendTextMessage(msg.text);
                  setIsSidebarOpen(false);
                }}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:${theme.primary} shrink-0 transition-colors`}></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-medium truncate leading-tight">{msg.text}</span>
                </div>
                <MoreVertical size={14} className="text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 shrink-0" />
              </button>
            )) : (
              <div className="px-4 py-2 text-xs text-slate-400 dark:text-slate-500 font-medium">
                {t.settings.languageName === 'বাংলা' ? 'হিস্ট্রি খালি' : 'History is empty'}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 mt-auto border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-4">
            <button className={`w-full flex items-center justify-center gap-2 ${theme.bgLight} ${theme.text} py-3 rounded-xl font-bold hover:brightness-95 transition-all text-sm border ${theme.borderLight}`}>
              <PlayCircle size={18} />
              {t.settings.languageName === 'বাংলা' ? 'AI ভিডিও টিউটোরিয়াল দেখো' : 'Watch AI Video Tutorials'}
            </button>

            <SignedIn>
              <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer group border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                <div className="relative">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-9 h-9 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700",
                        userButtonTrigger: "focus:shadow-none"
                      }
                    }}
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest leading-none mt-0.5">
                    {t.common.proMember}
                  </p>
                </div>
              </div>
            </SignedIn>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative bg-white dark:bg-[#0f172a] overflow-hidden transition-colors duration-500" ref={chatContainerRef}>
        {/* Navigation Header */}
        <header className="h-[72px] bg-white dark:bg-slate-900 border-b border-[#F3F4F6] dark:border-slate-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 shadow-sm transition-colors duration-500">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <div className="relative">
              <button
                onClick={() => setIsSubjectMenuOpen(!isSubjectMenuOpen)}
                className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold text-sm md:text-lg hover:bg-[#F9FAFB] dark:hover:bg-slate-800 px-2 md:px-3 py-1.5 rounded-lg transition-colors"
              >
                <div className={`${getSubjectTextColor(selectedSubject)} transition-colors duration-300`}>
                  {getSubjectIcon(selectedSubject, "w-5 h-5")}
                </div>
                <span className="font-bold">{subjectNames[selectedSubject] || selectedSubject}</span>
                <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 ${isSubjectMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSubjectMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 md:w-72 bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {SUBJECTS.map(s => (
                    <button
                      key={s.name}
                      onClick={() => {
                        setSelectedSubject(s.name);
                        setIsSubjectMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-[#F9FAFB] dark:hover:bg-slate-800 text-sm font-semibold flex items-center gap-3 transition-colors ${selectedSubject === s.name ? `${theme.text} ${theme.bgLight}` : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      <div className={selectedSubject === s.name ? getSubjectTextColor(s.name) : 'text-slate-400'}>
                        {getSubjectIcon(s.name, "w-4 h-4")}
                      </div>
                      {subjectNames[s.name] || s.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Theme Toggle in Header */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-slate-100 dark:border-slate-700"
            >
              {appTheme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button className={`bg-gradient-to-r ${theme.gradient} hover:brightness-110 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full font-bold text-xs md:text-sm shadow-lg transition-all active:scale-95 whitespace-nowrap`}>
              {t.chat.upgrade}
            </button>
            <div className="relative">
              <SignedIn>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)}
                  className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-3 py-1.5 rounded-full hover:bg-white dark:hover:bg-slate-700 hover:shadow-md transition-all active:scale-95 group focus:outline-none"
                >
                  <div className="hidden sm:flex flex-col items-end mr-1 translate-y-[-1px]">
                    <span className="text-[11px] font-black text-slate-900 dark:text-white leading-none mb-0.5">
                      {user?.firstName}
                    </span>
                    <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest leading-none">
                      PRO
                    </span>
                  </div>
                  <img
                    src={user?.imageUrl}
                    className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-slate-700"
                    alt="avatar"
                  />
                </button>
                {isProfileOpen && (
                  <div className="absolute top-full right-0 mt-3 w-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] py-4 px-2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="px-4 py-3 mb-2 border-b border-slate-50 dark:border-slate-800">
                      <p className="text-sm font-black text-slate-900 dark:text-white truncate">{user?.fullName}</p>
                      <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                    </div>

                    <div className="space-y-1">
                      <Link href="/dashboard/profile" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-2xl transition-all group/item text-left">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover/item:bg-indigo-100/50 transition-colors">
                          <User size={16} />
                        </div>
                        {t.common.profile}
                      </Link>
                      <Link href="/dashboard/subscription" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-2xl transition-all group/item text-left">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover/item:bg-indigo-100/50 transition-colors">
                          <CreditCard size={16} />
                        </div>
                        {t.common.subscription}
                      </Link>
                      <Link href="/dashboard/settings" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-2xl transition-all group/item text-left">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover/item:bg-indigo-100/50 transition-colors">
                          <Settings size={16} />
                        </div>
                        {t.common.settings}
                      </Link>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-50 dark:border-slate-800 px-2">
                      <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all group/item text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center group-hover/item:bg-rose-100/50 transition-colors">
                          <LogOut size={16} />
                        </div>
                        {t.common.logout}
                      </button>
                    </div>
                  </div>
                )}
              </SignedIn>
            </div>
          </div>
        </header>

        {/* Messaging Area / Home View */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-8 custom-scrollbar relative bg-white dark:bg-[#0f172a] transition-colors duration-500"
        >
          <div className="max-w-[800px] mx-auto min-h-full flex flex-col">
            {currentSubjectMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 py-12 animate-in fade-in duration-700 bg-white dark:bg-[#0f172a] px-6">
                {/* Visual Illustration */}
                <div className="relative w-full flex justify-center mb-4 h-[120px]">
                  <img
                    src="/qna.webp"
                    alt="MeetShikkha AI Q&A Illustration"
                    className="h-full object-contain animate-in fade-in zoom-in-95 duration-1000 z-10"
                  />
                </div>

                <h2 className="text-[24px] md:text-[28px] font-black text-[#374151] dark:text-white mb-2 tracking-tight leading-tight text-center">
                  {t.chat.welcome}, {user?.firstName || (t.settings.languageName === 'বাংলা' ? 'শিক্ষার্থী' : 'Student')}!
                </h2>
                <h3 className="text-xl md:text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2 tracking-tight leading-tight text-center">
                  {t.chat.askAnything}
                </h3>
                <p className="text-[#6B7280] dark:text-slate-400 max-w-[580px] text-center font-medium leading-relaxed px-4 text-[13px] mb-10">
                  {t.settings.languageName === 'বাংলা'
                    ? 'তোমার প্রশ্নটি যত স্পষ্ট ও সুনির্দিষ্ট করে লিখবে অথবা ছবিটি যত স্পষ্ট হবে, MeetShikkha AI তত নির্ভুলভাবে প্রশ্নের উত্তর দিতে পারবে।'
                    : 'The clearer and more specific your question is, or the clearer the image, the more accurately MeetShikkha AI can answer.'}
                </p>

                {/* Reference-Matched Input Card */}
                <div className="w-full max-w-[620px]">
                  <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-[#E5E7EB] dark:border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden p-6 relative rounded-2xl">
                    <textarea
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value.slice(0, 500))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendTextMessage();
                        }
                      }}
                      placeholder={t.chat.inputPlaceholder}
                      className="w-full bg-transparent border-none focus:ring-0 outline-none text-[#111827] dark:text-white placeholder:text-slate-400 resize-none py-0 px-0 text-md font-medium min-h-[80px] leading-relaxed"
                    />

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-wide">
                        {t.settings.languageName === 'বাংলা' ? 'ক্যারেক্টার লিমিট' : 'Character limit'}: {chatInput.length}/৫০০
                      </span>

                      <div className="flex items-center gap-3">
                        <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-all hover:scale-105">
                          <ImageIcon size={20} strokeWidth={2} />
                        </button>
                        <button
                          onClick={() => handleSendTextMessage()}
                          disabled={!chatInput.trim() || isTyping}
                          className={`p-1.5 rounded-full transition-all duration-300 ${chatInput.trim() && !isTyping
                            ? 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                            : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                            }`}
                        >
                          <Send size={20} fill="currentColor" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Popular Questions Chips */}
                  <div className="mt-10 flex flex-col items-center gap-4">
                    <span className="text-[11px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest">
                      {t.settings.languageName === 'বাংলা' ? 'পপুলার প্রশ্ন' : 'Popular Questions'}
                    </span>
                    <div className="flex flex-wrap justify-center gap-2 px-4">
                      {popularQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendTextMessage(q)}
                          className="bg-gradient-to-b from-white to-[#F9FAFB] dark:from-slate-800 dark:to-slate-900 border border-[#E5E7EB] dark:border-slate-700 px-4 py-1.5 text-[12px] font-bold text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:to-slate-100 dark:hover:to-slate-800 transition-all shadow-sm active:scale-95 whitespace-nowrap rounded-full"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Usage Progress Bar */}
                  <div className="mt-12 flex flex-col items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-500">
                      {t.settings.languageName === 'বাংলা' ? 'আজকের ব্যবহার' : 'Today\'s Usage'}: ২/৩
                    </span>
                    <div className="w-[120px] md:w-[140px] h-[6px] bg-[#E5E7EB] dark:bg-slate-800 overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 w-[66%] shadow-[0_0_8px_rgba(16,185,129,0.2)]"></div>
                    </div>
                  </div>

                  {/* AI Disclaimer below usage bar */}
                  <div className="mt-8 text-center pb-4">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em] opacity-70 px-4">
                      {t.settings.languageName === 'বাংলা' ? 'MeetShikkha AI ভুল করতে পারে। তথ্য যাচাই করো।' : 'MeetShikkha AI can make mistakes. Check information.'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-10 pb-44 pt-4">
                {currentSubjectMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-6 duration-500`}
                  >
                    <div className={`flex gap-3 md:gap-4 max-w-[92%] md:max-w-[88%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {msg.role === 'assistant' && (
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl ${theme.primary} flex items-center justify-center text-white shadow-lg shrink-0 mt-1 transition-colors duration-500`}>
                          <BrandIcon size={20} className="md:w-6 md:h-6" />
                        </div>
                      )}
                      <div className={`p-4 md:p-6 shadow-sm ${msg.role === 'user'
                        ? 'bg-[#F3F4F6] dark:bg-slate-800 text-[#1F2937] dark:text-white border border-[#E5E7EB] dark:border-slate-700 rounded-2xl md:rounded-3xl'
                        : `bg-gradient-to-br from-white to-indigo-50/30 dark:from-slate-800 dark:to-slate-900 border ${theme.borderLight} text-[#1F2937] dark:text-slate-200 shadow-lg overflow-x-auto rounded-2xl md:rounded-3xl`
                        }`}>
                        {msg.role === 'user' ? (
                          <p className="text-md md:text-lg font-medium leading-relaxed">{msg.text}</p>
                        ) : (
                          <div className={`prose dark:prose-invert prose-slate max-w-none text-md md:text-lg font-medium leading-relaxed`} dangerouslySetInnerHTML={renderMarkdown(msg.text)} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-3 md:gap-4">
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl ${theme.primary} flex items-center justify-center text-white shadow-lg shrink-0 transition-colors duration-500`}>
                        <BrandIcon size={20} className="md:w-6 md:h-6" />
                      </div>
                      <div className="bg-white dark:bg-slate-800 border border-[#F3F4F6] dark:border-slate-700 p-4 md:p-5 rounded-2xl md:rounded-3xl flex gap-1.5 shadow-lg">
                        <div className={`w-2 h-2 md:w-2.5 md:h-2.5 ${theme.primary} rounded-full animate-bounce`}></div>
                        <div className={`w-2 h-2 md:w-2.5 md:h-2.5 ${theme.primary} rounded-full animate-bounce [animation-delay:0.2s]`}></div>
                        <div className={`w-2 h-2 md:w-2.5 md:h-2.5 ${theme.primary} rounded-full animate-bounce [animation-delay:0.4s]`}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-0 w-full" />
              </div>
            )}
          </div>
        </div>

        {/* Input Dock - Floating only when messages exist */}
        {currentSubjectMessages.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 px-2 md:px-8 pb-4 md:pb-8 pt-10 bg-gradient-to-t from-white via-white to-transparent dark:from-[#0f172a] dark:via-[#0f172a] dark:to-transparent pointer-events-none z-20 transition-colors duration-500">
            <div className="max-w-[800px] mx-auto pointer-events-auto">
              <div className="bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.08)] overflow-hidden p-4 md:p-6 rounded-2xl md:rounded-3xl">
                <div className="relative">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value.slice(0, 500))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendTextMessage();
                      }
                    }}
                    placeholder={t.chat.inputPlaceholder}
                    className="w-full bg-transparent border-none focus:ring-0 outline-none text-[#111827] dark:text-white placeholder:text-slate-400 resize-none py-0 px-0 text-md font-medium min-h-[50px] md:min-h-[60px] custom-scrollbar"
                  />

                  <div className="flex items-center justify-between mt-3 md:mt-4">
                    <span className="text-[10px] md:text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-wide uppercase">
                      {t.settings.languageName === 'বাংলা' ? 'লিমিট' : 'Limit'}: {chatInput.length}/৫০০
                    </span>

                    <div className="flex items-center gap-2 md:gap-3">
                      <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-all p-1">
                        <ImageIcon size={18} className="md:w-5 md:h-5" strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => handleSendTextMessage()}
                        disabled={!chatInput.trim() || isTyping}
                        className={`p-1.5 rounded-full transition-all duration-300 ${chatInput.trim() && !isTyping
                          ? theme.primary + ' text-white shadow-md'
                          : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                          }`}
                      >
                        <Send size={18} className="md:w-5 md:h-5" fill="currentColor" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="fixed md:absolute top-24 right-4 md:right-8 left-4 md:left-auto bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 text-red-600 dark:text-red-400 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-[20px] text-sm font-bold shadow-2xl animate-in fade-in slide-in-from-right-4 z-50">
            <div className="flex items-center gap-3">
              <X size={18} className="text-red-400" />
              {error}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
