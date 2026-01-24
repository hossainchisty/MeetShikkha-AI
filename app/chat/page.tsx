'use client';

import { SUBJECTS } from '@/lib/constants';
import { Message, Subject } from '@/lib/types';
import DOMPurify from 'dompurify';
import Link from 'next/link';
// @ts-ignore
import renderMathInElement from 'katex/dist/contrib/auto-render';
import {
  Atom,
  Calculator,
  ChevronDown,
  ChevronLeft,
  FlaskConical,
  Image as ImageIcon,
  Languages,
  Menu,
  Microscope,
  MoreVertical,
  PlayCircle,
  Plus,
  Send,
  Sparkles,
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
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Mathematics');
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
        bgLight: 'bg-blue-50',
        borderLight: 'border-blue-100',
        ring: 'ring-blue-500/10',
        gradient: 'from-blue-600 to-indigo-600',
        softGradient: 'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.08) 0%, rgba(255, 255, 255, 0) 70%)'
      },
      purple: {
        primary: 'bg-purple-600',
        primaryHover: 'hover:bg-purple-700',
        text: 'text-purple-600',
        bgLight: 'bg-purple-50',
        borderLight: 'border-purple-100',
        ring: 'ring-purple-500/10',
        gradient: 'from-purple-600 to-fuchsia-600',
        softGradient: 'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.08) 0%, rgba(255, 255, 255, 0) 70%)'
      },
      emerald: {
        primary: 'bg-emerald-600',
        primaryHover: 'hover:bg-emerald-700',
        text: 'text-emerald-600',
        bgLight: 'bg-emerald-50',
        borderLight: 'border-emerald-100',
        ring: 'ring-emerald-500/10',
        gradient: 'from-emerald-600 to-teal-600',
        softGradient: 'radial-gradient(circle at 50% 50%, rgba(5, 150, 105, 0.08) 0%, rgba(255, 255, 255, 0) 70%)'
      },
      rose: {
        primary: 'bg-rose-600',
        primaryHover: 'hover:bg-rose-700',
        text: 'text-rose-600',
        bgLight: 'bg-rose-50',
        borderLight: 'border-rose-100',
        ring: 'ring-rose-500/10',
        gradient: 'from-rose-600 to-pink-600',
        softGradient: 'radial-gradient(circle at 50% 50%, rgba(225, 29, 72, 0.08) 0%, rgba(255, 255, 255, 0) 70%)'
      },
      amber: {
        primary: 'bg-amber-600',
        primaryHover: 'hover:bg-amber-700',
        text: 'text-amber-600',
        bgLight: 'bg-amber-50',
        borderLight: 'border-amber-100',
        ring: 'ring-amber-500/10',
        gradient: 'from-amber-600 to-amber-700',
        softGradient: 'none'
      },
      indigo: {
        primary: 'bg-indigo-600',
        primaryHover: 'hover:bg-indigo-700',
        text: 'text-indigo-600',
        bgLight: 'bg-indigo-50',
        borderLight: 'border-indigo-100',
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

    // Scroll to bottom after potential layout shifts
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
      setError("সংযোগ বিচ্ছিন্ন হয়েছে। অনুগ্রহ করে আবার বার্তাটি পাঠান। " + (err.message || ""));
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

  const popularQuestions = [
    "ত্রিভুজের ক্ষেত্রফল কিভাবে বের করবো?",
    "How do I solve a quadratic equation?",
    "Matrix addition er shortcut ki?",
    "সমান্তর ধারার সাধারণ পদ বের করার নিয়ম কী?",
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
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      emerald: 'text-emerald-600',
      rose: 'text-rose-600',
      amber: 'text-amber-600',
    };
    return colorMap[sub?.color || ''] || 'text-indigo-600';
  };

  const subjectNamesBangla: Record<string, string> = {
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
  };

  const BrandIcon = Sparkles;

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Left Navigation */}
      <aside className={`fixed md:relative w-[280px] h-full bg-white border-r border-[#E5E7EB] flex flex-col shrink-0 z-50 shadow-xl md:shadow-none transition-transform duration-300 ease-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors p-1">
              <ChevronLeft size={20} />
            </Link>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg ${theme.primary} flex items-center justify-center text-white shadow-sm transition-all duration-500`}>
                <BrandIcon className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-[#111827]">Meet<span className={`font-extrabold ${theme.text} transition-colors duration-500`}>Shikkha AI</span></span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="px-4 mb-6 mt-4">
          <button
            onClick={() => {
              startNewQuestion();
              setIsSidebarOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 bg-white border border-[#E5E7EB] hover:bg-slate-50 text-slate-700 py-2.5 rounded-lg font-bold transition-all text-sm shadow-sm active:scale-95"
          >
            <Plus size={16} className={theme.text} />
            নতুন প্রশ্ন
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
          <h3 className="px-4 text-[12px] font-bold text-slate-400 mb-3 uppercase tracking-wider">হিস্ট্রি</h3>
          <div className="space-y-0.5">
            {historySummaries.length > 0 ? historySummaries.map((msg) => (
              <button
                key={msg.id}
                className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-[#F9FAFB] group flex items-center justify-between transition-colors"
                onClick={() => {
                  handleSendTextMessage(msg.text);
                  setIsSidebarOpen(false);
                }}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:${theme.primary} shrink-0 transition-colors`}></div>
                  <span className="text-sm text-slate-600 font-medium truncate leading-tight">{msg.text}</span>
                </div>
                <MoreVertical size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 shrink-0" />
              </button>
            )) : (
              <div className="px-4 py-2 text-xs text-slate-400 font-medium">হিস্ট্রি খালি</div>
            )}
          </div>
        </div>

        <div className="p-4 bg-white">
          <button className={`w-full flex items-center justify-center gap-2 ${theme.bgLight} ${theme.text} py-3 rounded-xl font-bold hover:brightness-95 transition-all text-sm border ${theme.borderLight}`}>
            <PlayCircle size={18} />
            AI ভিডিও টিউটোরিয়াল দেখো
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative bg-white overflow-hidden" ref={chatContainerRef}>
        {/* Navigation Header */}
        <header className="h-[72px] bg-white border-b border-[#F3F4F6] flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <div className="relative">
              <button
                onClick={() => setIsSubjectMenuOpen(!isSubjectMenuOpen)}
                className="flex items-center gap-2 text-slate-700 font-bold text-sm md:text-lg hover:bg-[#F9FAFB] px-2 md:px-3 py-1.5 rounded-lg transition-colors"
              >
                <div className={`${getSubjectTextColor(selectedSubject)} transition-colors duration-300`}>
                  {getSubjectIcon(selectedSubject, "w-5 h-5")}
                </div>
                <span className="font-bold">{subjectNamesBangla[selectedSubject] || selectedSubject}</span>
                <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 ${isSubjectMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSubjectMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 md:w-72 bg-white border border-[#F3F4F6] rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {SUBJECTS.map(s => (
                    <button
                      key={s.name}
                      onClick={() => {
                        setSelectedSubject(s.name);
                        setIsSubjectMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-[#F9FAFB] text-sm font-semibold flex items-center gap-3 transition-colors ${selectedSubject === s.name ? `${theme.text} ${theme.bgLight}` : 'text-slate-600'}`}
                    >
                      <div className={selectedSubject === s.name ? getSubjectTextColor(s.name) : 'text-slate-400'}>
                        {getSubjectIcon(s.name, "w-4 h-4")}
                      </div>
                      {subjectNamesBangla[s.name] || s.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className={`bg-gradient-to-r ${theme.gradient} hover:brightness-110 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full font-bold text-xs md:text-sm shadow-lg transition-all active:scale-95 whitespace-nowrap`}>
              আপগ্রেড
            </button>
            <div className="flex items-center gap-2 pl-2 cursor-pointer group">
              <div className={`w-10 h-10 rounded-full ${theme.primary} flex items-center justify-center text-white shadow-sm ring-2 ring-transparent transition-all duration-500`}>
                <User size={20} />
              </div>
              <ChevronDown size={16} className="text-slate-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Messaging Area / Home View */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-8 custom-scrollbar relative bg-white"
        >
          <div className="max-w-[800px] mx-auto min-h-full flex flex-col">
            {currentSubjectMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 py-12 animate-in fade-in duration-700 bg-white px-6">
                {/* Visual Illustration */}
                <div className="relative w-full flex justify-center mb-4 h-[120px]">
                  <img
                    src="/qna.webp"
                    alt="MeetShikkha AI Q&A Illustration"
                    className="h-full object-contain animate-in fade-in zoom-in-95 duration-1000 z-10"
                  />
                </div>

                <h2 className="text-[24px] md:text-[28px] font-black text-[#374151] mb-2 tracking-tight leading-tight text-center">প্রশ্ন করে ইনস্ট্যান্ট উত্তর দেখো</h2>
                <p className="text-[#6B7280] max-w-[580px] text-center font-medium leading-relaxed px-4 text-[13px] mb-10">
                  তোমার প্রশ্নটি যত স্পষ্ট ও সুনির্দিষ্ট করে লিখবে অথবা ছবিটি যত স্পষ্ট হবে, MeetShikkha AI তত নির্ভুলভাবে প্রশ্নের উত্তর দিতে পারবে।
                </p>

                {/* Reference-Matched Input Card */}
                <div className="w-full max-w-[620px]">
                  <div className="bg-gradient-to-br from-white to-slate-50 border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden p-6 relative rounded-2xl">
                    <textarea
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value.slice(0, 500))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendTextMessage();
                        }
                      }}
                      placeholder="তোমার প্রশ্নটি লিখো"
                      className="w-full bg-transparent border-none focus:ring-0 outline-none text-[#111827] placeholder:text-slate-400 resize-none py-0 px-0 text-md font-medium min-h-[80px] leading-relaxed"
                    />

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-[11px] font-bold text-slate-400 tracking-wide">
                        ক্যারেক্টার লিমিট: {chatInput.length}/৫০০
                      </span>

                      <div className="flex items-center gap-3">
                        <button className="text-slate-400 hover:text-slate-600 transition-all hover:scale-105">
                          <ImageIcon size={20} strokeWidth={2} />
                        </button>
                        <button
                          onClick={() => handleSendTextMessage()}
                          disabled={!chatInput.trim() || isTyping}
                          className={`p-1.5 rounded-full transition-all duration-300 ${chatInput.trim() && !isTyping
                            ? 'text-slate-400 hover:text-slate-600'
                            : 'text-slate-300 cursor-not-allowed'
                            }`}
                        >
                          <Send size={20} fill="currentColor" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Popular Questions Chips */}
                  <div className="mt-10 flex flex-col items-center gap-4">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">পপুলার প্রশ্ন</span>
                    <div className="flex flex-wrap justify-center gap-2 px-4">
                      {popularQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendTextMessage(q)}
                          className="bg-gradient-to-b from-white to-[#F9FAFB] border border-[#E5E7EB] px-4 py-1.5 text-[12px] font-bold text-slate-600 hover:border-slate-300 hover:to-slate-100 transition-all shadow-sm active:scale-95 whitespace-nowrap rounded-full"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Usage Progress Bar */}
                  <div className="mt-12 flex flex-col items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-500">আজকের ব্যবহার: ২/৩</span>
                    <div className="w-[120px] md:w-[140px] h-[6px] bg-[#E5E7EB] overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 w-[66%] shadow-[0_0_8px_rgba(16,185,129,0.2)]"></div>
                    </div>
                  </div>

                  {/* AI Disclaimer below usage bar */}
                  <div className="mt-8 text-center pb-4">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] opacity-70 px-4">
                      MeetShikkha AI ভুল করতে পারে। তথ্য যাচাই করো।
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
                        ? 'bg-[#F3F4F6] text-[#1F2937] border border-[#E5E7EB] rounded-2xl md:rounded-3xl'
                        : `bg-gradient-to-br from-white to-indigo-50/30 border ${theme.borderLight} text-[#1F2937] shadow-lg overflow-x-auto rounded-2xl md:rounded-3xl`
                        }`}>
                        {msg.role === 'user' ? (
                          <p className="text-md md:text-lg font-medium leading-relaxed">{msg.text}</p>
                        ) : (
                          <div className="prose prose-slate max-w-none text-md md:text-lg font-medium leading-relaxed" dangerouslySetInnerHTML={renderMarkdown(msg.text)} />
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
                      <div className="bg-white border border-[#F3F4F6] p-4 md:p-5 rounded-2xl md:rounded-3xl flex gap-1.5 shadow-lg">
                        <div className={`w-2 h-2 md:w-2.5 md:h-2.5 ${theme.primary} rounded-full animate-bounce`}></div>
                        <div className={`w-2 h-2 md:w-2.5 md:h-2.5 ${theme.primary} rounded-full animate-bounce [animation-delay:0.2s]`}></div>
                        <div className={`w-2 h-2 md:w-2.5 md:h-2.5 ${theme.primary} rounded-full animate-bounce [animation-delay:0.4s]`}></div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Scroll Anchor */}
                <div ref={messagesEndRef} className="h-0 w-full" />
              </div>
            )}
          </div>
        </div>

        {/* Input Dock - Floating only when messages exist */}
        {currentSubjectMessages.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 px-2 md:px-8 pb-4 md:pb-8 pt-10 bg-gradient-to-t from-white via-white to-transparent pointer-events-none z-20">
            <div className="max-w-[800px] mx-auto pointer-events-auto">
              <div className="bg-white border border-[#E5E7EB] shadow-[0_4px_25px_-5px_rgba(0,0,0,0.08)] overflow-hidden p-4 md:p-6 rounded-2xl md:rounded-3xl">
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
                    placeholder="তোমার প্রশ্নটি লিখো"
                    className="w-full bg-transparent border-none focus:ring-0 outline-none text-[#111827] placeholder:text-slate-400 resize-none py-0 px-0 text-md font-medium min-h-[50px] md:min-h-[60px] custom-scrollbar"
                  />

                  <div className="flex items-center justify-between mt-3 md:mt-4">
                    <span className="text-[10px] md:text-[11px] font-bold text-slate-400 tracking-wide uppercase">
                      LIMIT: {chatInput.length}/৫০০
                    </span>

                    <div className="flex items-center gap-2 md:gap-3">
                      <button className="text-slate-400 hover:text-slate-600 transition-all p-1">
                        <ImageIcon size={18} className="md:w-5 md:h-5" strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => handleSendTextMessage()}
                        disabled={!chatInput.trim() || isTyping}
                        className={`p-1.5 rounded-full transition-all duration-300 ${chatInput.trim() && !isTyping
                          ? theme.primary + ' text-white shadow-md'
                          : 'text-slate-300 cursor-not-allowed'
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
          <div className="fixed md:absolute top-24 right-4 md:right-8 left-4 md:left-auto bg-red-50 border border-red-100 text-red-600 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-[20px] text-sm font-bold shadow-2xl animate-in fade-in slide-in-from-right-4 z-50">
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
