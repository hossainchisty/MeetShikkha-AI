'use client';

import { SUBJECTS } from '@/lib/constants';
import { useLanguage } from '@/lib/LanguageContext';
import { supabase } from '@/lib/supabase'; // Imported Supabase here
import { useTheme } from '@/lib/ThemeContext';
import { Message, Subject } from '@/lib/types';
import { SignedIn, useClerk, UserButton, useUser } from '@clerk/nextjs';
import DOMPurify from 'dompurify';
import Link from 'next/link';
// @ts-ignore
import renderMathInElement from 'katex/dist/contrib/auto-render';
import {
  AlertTriangle,
  Atom,
  Calculator,
  Check,
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
  Pencil,
  Pin,
  PlayCircle,
  Plus,
  Send,
  Settings,
  Sparkles,
  Sun,
  Trash2,
  User,
  X,
  Zap
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

interface Chat {
  id: string;
  title: string;
  subject: Subject | string;
  is_pinned: boolean;
  updated_at: string;
}

export default function Home() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { t } = useLanguage();
  const { theme: appTheme, toggleTheme } = useTheme();

  const [selectedSubject, setSelectedSubject] = useState<Subject>('Mathematics');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatInput, setChatInput] = useState('');

  // Usage State
  const [dailyUsage, setDailyUsage] = useState(0);
  const [maxUsage, setMaxUsage] = useState(5);
  const [userPlan, setUserPlan] = useState('FREE');

  // Supabase State
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isSubjectMenuOpen, setIsSubjectMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // UI State for editing
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [menuOpenChatId, setMenuOpenChatId] = useState<string | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load Chats on Mount
  useEffect(() => {
    fetchChats();
    if (user) checkUsage();
  }, [user]);

  const checkUsage = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_tier, daily_usage_count, last_usage_date')
        .eq('clerk_id', user.id)
        .single();

      if (data) {
        // Reset logic also on frontend for display
        const todayStr = new Date().toISOString().split('T')[0];
        let usage = data.daily_usage_count;
        if (data.last_usage_date !== todayStr) usage = 0;

        setDailyUsage(usage);
        setUserPlan(data.subscription_tier);

        // Set max based on plan (simpler lookup)
        if (data.subscription_tier === 'PRO') setMaxUsage(50);
        else if (data.subscription_tier === 'UNLIMITED') setMaxUsage(Infinity);
        else setMaxUsage(5);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchChats = async () => {
    try {
      const res = await fetch('/api/conversations');
      if (res.ok) {
        const data = await res.json();
        setChats(data);
      }
    } catch (e) {
      console.error("Failed to fetch chats", e);
    }
  };

  const loadChat = async (chatId: string) => {
    try {
      setCurrentChatId(chatId);
      setMessages([]); // Clear current view
      setIsSidebarOpen(false);

      const res = await fetch(`/api/conversations/${chatId}`);
      if (!res.ok) throw new Error("Failed to load conversation");

      const data = await res.json();

      // Transform DB messages to UI messages
      const uiMessages: Message[] = data.messages.map((m: any) => ({
        id: m.id,
        role: m.role,
        text: m.content,
        timestamp: new Date(m.created_at).getTime(),
        subject: data.chat.subject
      }));

      setMessages(uiMessages);
      if (data.chat.subject) {
        setSelectedSubject(data.chat.subject as Subject);
      }
    } catch (e) {
      console.error(e);
      setError("Failed to load chat history");
    }
  };

  // Dynamic color configuration
  const theme = useMemo(() => {
    const color = 'indigo';
    // ... (Keep existing color logic)
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

  // Math Rendering
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
  }, [messages, isTyping]);

  const handleSendTextMessage = async (textOverride?: string) => {
    const textToSend = textOverride || chatInput.trim();
    if (!textToSend || isTyping) return;

    setChatInput('');
    setIsTyping(true);
    setError(null);

    // Frontend Check
    if (dailyUsage >= maxUsage) {
      setShowLimitModal(true);
      setIsTyping(false);
      return;
    }

    // Optimistic Update
    const tempId = Date.now() + '-tu';
    const userMessageObj: Message = {
      id: tempId,
      role: 'user',
      text: textToSend,
      timestamp: Date.now(),
      subject: selectedSubject
    };
    setMessages(prev => [...prev, userMessageObj]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          subject: selectedSubject,
          conversation_id: currentChatId
        }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // If new chat created, update ID and refresh list
      if (data.conversation_id && data.conversation_id !== currentChatId) {
        setCurrentChatId(data.conversation_id);
        fetchChats();
      }

      // Increment Usage locally
      setDailyUsage(prev => prev + 1);

      const assistantMessageObj: Message = {
        id: Date.now() + '-tm',
        role: 'assistant',
        text: data.text,
        timestamp: Date.now(),
        subject: selectedSubject
      };
      setMessages(prev => [...prev, assistantMessageObj]);
    } catch (err: any) {
      console.error(err);
      setError((t.settings.languageName === 'বাংলা' ? "সংযোগ বিচ্ছিন্ন হয়েছে। " : "Connection lost. ") + (err.message || ""));
    } finally {
      setIsTyping(false);
    }
  };

  const startNewQuestion = () => {
    setChatInput('');
    setCurrentChatId(null);
    setMessages([]);
    setIsSidebarOpen(false);
  };

  // Chat Management
  const handlePinChat = async (e: React.MouseEvent, chat: Chat) => {
    e.stopPropagation();
    try {
      await fetch(`/api/conversations/${chat.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_pinned: !chat.is_pinned })
      });
      fetchChats();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setChatToDelete(chatId);
  };

  const confirmDelete = async () => {
    if (!chatToDelete) return;
    const chatId = chatToDelete;
    setChatToDelete(null);
    try {
      await fetch(`/api/conversations/${chatId}`, { method: 'DELETE' });
      if (currentChatId === chatId) startNewQuestion();
      fetchChats();
    } catch (e) {
      console.error(e);
    }
  };

  const startEditing = (e: React.MouseEvent, chat: Chat) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
    setMenuOpenChatId(null);
  };

  const saveTitle = async (chatId: string) => {
    try {
      await fetch(`/api/conversations/${chatId}`, {
        method: 'PATCH',
        body: JSON.stringify({ title: editTitle })
      });
      setEditingChatId(null);
      fetchChats();
    } catch (e) {
      console.error(e);
    }
  };

  const renderMarkdown = (text: string) => {
    const rawHtml = text ? (marked.parse(text) as string) : '';
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    return { __html: cleanHtml };
  };

  // Helper arrays (popular questions etc)
  const popularQuestions = t.settings.languageName === 'বাংলা'
    ? ["ত্রিভুজের ক্ষেত্রফল কিভাবে বের করবো?", "দ্বিঘাত সমীকরণ কিভাবে সমাধান করবো?", "ম্যাট্রিক্স যোগ করার শর্টকাট কী?", "সমান্তর ধারার সাধারণ পদ বের করার নিয়ম কী?", "বিন্যাস ও সমাবেশের মধ্যে পার্থক্য কী?"]
    : ["How to find the area of a triangle?", "How do I solve a quadratic equation?", "What is the shortcut for matrix addition?", "What is the rule for finding the general term of an arithmetic progression?", "What is the difference between permutation and combination?"];

  const getSubjectIcon = (subjectName: Subject, className?: string) => {
    const sub = SUBJECTS.find(s => s.name === subjectName);
    if (!sub) return <Sparkles className={className} />;
    const IconComp = IconMap[sub.icon] || Sparkles;
    return <IconComp className={className} />;
  };

  const getSubjectTextColor = (subjectName: Subject | string) => {
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
  } : {
    'Mathematics': 'Mathematics',
    'Physics': 'Physics',
    'Chemistry': 'Chemistry',
    'Biology': 'Biology',
    'English': 'English',
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
            onClick={startNewQuestion}
            className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-2.5 rounded-lg font-bold transition-all text-sm shadow-sm active:scale-95"
          >
            <Plus size={16} className={theme.text} />
            {t.settings.languageName === 'বাংলা' ? 'নতুন প্রশ্ন' : 'New Question'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 custom-scrollbar" onClick={() => setMenuOpenChatId(null)}>
          <h3 className="px-4 text-[12px] font-bold text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-wider">{t.settings.languageName === 'বাংলা' ? 'হিস্ট্রি' : 'History'}</h3>
          <div className="space-y-0.5">
            {chats.length > 0 ? chats.map((chat) => (
              <div
                key={chat.id}
                className={`w-full text-left px-4 py-2.5 rounded-lg group flex items-center justify-between transition-colors relative cursor-pointer ${currentChatId === chat.id
                  ? 'bg-slate-100 dark:bg-slate-800'
                  : 'hover:bg-[#F9FAFB] dark:hover:bg-slate-800'
                  }`}
                onClick={() => loadChat(chat.id)}
              >
                {editingChatId === chat.id ? (
                  <div className="flex items-center gap-2 w-full" onClick={(e) => e.stopPropagation()}>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="bg-white dark:bg-slate-900 border border-indigo-500 rounded px-2 py-1 text-xs w-full outline-none"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveTitle(chat.id);
                        if (e.key === 'Escape') setEditingChatId(null);
                      }}
                    />
                    <button onClick={() => saveTitle(chat.id)} className="text-emerald-500"><Check size={14} /></button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${chat.is_pinned ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'} group-hover:${theme.primary} shrink-0 transition-colors`}></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium truncate leading-tight flex-1">{chat.title || chat.subject}</span>
                    </div>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenChatId(menuOpenChatId === chat.id ? null : chat.id);
                        }}
                        className={`text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded opacity-0 group-hover:opacity-100 ${menuOpenChatId === chat.id ? 'opacity-100' : ''}`}
                      >
                        <MoreVertical size={14} />
                      </button>

                      {menuOpenChatId === chat.id && (
                        <div className="absolute right-0 top-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg shadow-xl z-50 w-32 py-1 animate-in fade-in zoom-in-95 duration-150">
                          <button onClick={(e) => handlePinChat(e, chat)} className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <Pin size={12} className={chat.is_pinned ? "fill-current" : ""} /> {chat.is_pinned ? "Unpin" : "Pin"}
                          </button>
                          <button onClick={(e) => startEditing(e, chat)} className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <Pencil size={12} /> Rename
                          </button>
                          <button onClick={(e) => handleDeleteChat(e, chat.id)} className="w-full text-left px-3 py-2 text-xs hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-2 text-rose-600">
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )) : (
              <div className="px-4 py-2 text-xs text-slate-400 dark:text-slate-500 font-medium">
                {t.settings.languageName === 'বাংলা' ? 'হিস্ট্রি খালি' : 'History is empty'}
              </div>
            )}
          </div>
        </div>

        {/* Footer Area */}
        <div className="p-4 bg-white dark:bg-slate-900 mt-auto border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-4">
            {/* ... (Existing Footer Buttons) */}
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
                    {userPlan}
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
                  {getSubjectIcon(selectedSubject as Subject, "w-5 h-5")}
                </div>
                <span className="font-bold">{subjectNames[selectedSubject as string] || selectedSubject}</span>
                <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 ${isSubjectMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {/* Subject Menu */}
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
                      <div className={getSubjectTextColor(s.name)}>
                        {getSubjectIcon(s.name, "w-4 h-4")}
                      </div>
                      {subjectNames[s.name] || s.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-slate-100 dark:border-slate-700">
              {appTheme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button className={`bg-gradient-to-r ${theme.gradient} hover:brightness-110 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full font-bold text-xs md:text-sm shadow-lg transition-all active:scale-95 whitespace-nowrap`}>
              {t.chat.upgrade}
            </button>
            {/* Profile Menu (Existing) */}
            <div className="relative">
              <SignedIn>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)}
                  className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-3 py-1.5 rounded-full hover:bg-white dark:hover:bg-slate-700 hover:shadow-md transition-all active:scale-95 group focus:outline-none"
                >
                  <div className="hidden sm:flex flex-col items-end mr-1 translate-y-[-1px]">
                    <span className="text-[11px] font-black text-slate-900 dark:text-white leading-none mb-0.5">{user?.firstName} {user?.lastName}</span>
                    <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest leading-none">{userPlan}</span>
                  </div>
                  <img src={user?.imageUrl} className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-slate-700" alt="avatar" />
                </button>
                {/* Profile Dropdown Content (Keeping existing Links) */}
                {isProfileOpen && (
                  <div className="absolute top-full right-0 mt-3 w-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] py-4 px-2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="px-4 py-3 mb-2 border-b border-slate-50 dark:border-slate-800">
                      <p className="text-sm font-black text-slate-900 dark:text-white truncate">{user?.fullName}</p>
                      <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                    </div>
                    <div className="space-y-1">
                      <Link href="/dashboard/profile" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 rounded-2xl transition-all group/item text-left"><div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center"><User size={16} /></div>{t.common.profile}</Link>
                      <Link href="/dashboard/subscription" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 rounded-2xl transition-all group/item text-left"><div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center"><CreditCard size={16} /></div>{t.common.subscription}</Link>
                      <Link href="/dashboard/settings" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 rounded-2xl transition-all group/item text-left"><div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center"><Settings size={16} /></div>{t.common.settings}</Link>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-50 dark:border-slate-800 px-2">
                      <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-2xl transition-all group/item text-left"><div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center"><LogOut size={16} /></div>{t.common.logout}</button>
                    </div>
                  </div>
                )}
              </SignedIn>
            </div>
          </div>
        </header>

        {/* Messaging Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-8 custom-scrollbar relative bg-white dark:bg-[#0f172a] transition-colors duration-500">
          <div className="max-w-[800px] mx-auto min-h-full flex flex-col">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 py-12 animate-in fade-in duration-700 bg-white dark:bg-[#0f172a] px-6">
                <div className="relative w-full flex justify-center mb-8 h-[120px]">
                  <img src="/qna.webp" alt="Illustration" className="h-full object-contain animate-in fade-in zoom-in-95 duration-1000 z-10" />
                </div>
                <div className="flex flex-col items-center justify-center flex-1 animate-in fade-in duration-700 bg-white dark:bg-[#0f172a]">
                  <h2 className="text-xl md:text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2 tracking-tight leading-tight text-center">{t.chat.askAnything}</h2>
                  <p className="text-slate-500 dark:text-slate-400 max-w-[580px] text-center font-medium leading-relaxed px-4 text-[13px] mb-10 w-full max-w-[800px]">
                    {t.settings.languageName === 'বাংলা' ? 'তোমার প্রশ্নটি যত স্পষ্ট ও সুনির্দিষ্ট করে লিখবে অথবা ছবিটি যত স্পষ্ট হবে, MeetShikkha AI তত নির্ভুলভাবে প্রশ্নের উত্তর দিতে পারবে।' : 'The clearer and more specific your question is, or the clearer the image, the more accurately MeetShikkha AI can answer.'}
                  </p>
                </div>

                <div className="w-full max-w-[800px]">
                  <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-[#E5E7EB] dark:border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden p-6 relative rounded-2xl">
                    <textarea
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value.slice(0, 500))}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendTextMessage(); } }}
                      placeholder={t.chat.inputPlaceholder}
                      className="w-full bg-transparent border-none focus:ring-0 outline-none text-[#111827] dark:text-white placeholder:text-slate-400 resize-none py-0 px-0 text-md font-small min-h-[80px] leading-relaxed"
                    />
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-wide">{t.settings.languageName === 'বাংলা' ? 'ক্যারেক্টার লিমিট' : 'Character limit'}: {chatInput.length}/৫০০</span>
                      <div className="flex items-center gap-3">
                        <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-all hover:scale-105"><ImageIcon size={20} strokeWidth={2} /></button>
                        <button onClick={() => handleSendTextMessage()} disabled={!chatInput.trim() || isTyping} className={`p-1.5 rounded-full transition-all duration-300 ${chatInput.trim() && !isTyping ? 'text-indigo-600 hover:text-indigo-600 dark:text-indigo-600 dark:hover:text-indigo-600' : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'}`}><Send size={20} fill="currentColor" /></button>
                      </div>
                    </div>
                  </div>

                  {/* Popular Questions */}
                  <div className="mt-10 flex flex-col items-center gap-4">
                    <span className="text-[11px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest">{t.settings.languageName === 'বাংলা' ? 'পপুলার প্রশ্ন' : 'Popular Questions'}</span>
                    <div className="flex flex-wrap justify-center gap-2 px-4">
                      {popularQuestions.map((q, idx) => (
                        <button key={idx} onClick={() => handleSendTextMessage(q)} className="bg-gradient-to-b from-white to-[#F9FAFB] dark:from-slate-800 dark:to-slate-900 border border-[#E5E7EB] dark:border-slate-700 px-4 py-1.5 text-[12px] font-bold text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:to-slate-100 dark:hover:to-slate-800 transition-all shadow-sm active:scale-95 whitespace-nowrap rounded-full">{q}</button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-12 flex flex-col items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-500">
                      {t.settings.languageName === 'বাংলা' ? 'আজকের ব্যবহার' : 'Today\'s Usage'}: {dailyUsage}/{maxUsage === Infinity ? '∞' : maxUsage} <span className="text-xs text-indigo-500">({userPlan})</span>
                    </span>
                    <div className="w-[120px] md:w-[140px] h-[6px] bg-[#E5E7EB] dark:bg-slate-800 overflow-hidden shadow-inner rounded-full">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.2)] transition-all duration-500"
                        style={{ width: `${maxUsage === Infinity ? 0 : Math.min((dailyUsage / maxUsage) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mt-8 text-center pb-4"><p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em] opacity-70 px-4">{t.settings.languageName === 'বাংলা' ? 'MeetShikkha AI ভুল করতে পারে। তথ্য যাচাই করো।' : 'MeetShikkha AI can make mistakes. Check information.'}</p></div>
                </div>
              </div>
            ) : (
              <div className="space-y-10 pb-44 pt-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-6 duration-500`}>
                    <div className={`flex gap-3 md:gap-4 max-w-[92%] md:max-w-[88%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {msg.role === 'assistant' && (
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl ${theme.primary} flex items-center justify-center text-white shadow-lg shrink-0 mt-1 transition-colors duration-500`}><BrandIcon size={20} className="md:w-6 md:h-6" /></div>
                      )}
                      <div className={`p-4 md:p-6 shadow-sm ${msg.role === 'user' ? 'bg-[#F3F4F6] dark:bg-slate-800 text-[#1F2937] dark:text-white border border-[#E5E7EB] dark:border-slate-700 rounded-2xl md:rounded-3xl' : `bg-gradient-to-br from-white to-indigo-50/30 dark:from-slate-800 dark:to-slate-900 border ${theme.borderLight} text-[#1F2937] dark:text-slate-200 shadow-lg overflow-x-auto rounded-2xl md:rounded-3xl`}`}>
                        {msg.role === 'user' ? <p className="text-md md:text-lg font-medium leading-relaxed">{msg.text}</p> : <div className={`prose dark:prose-invert prose-slate max-w-none text-md md:text-lg font-medium leading-relaxed`} dangerouslySetInnerHTML={renderMarkdown(msg.text)} />}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-3 md:gap-4">
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl ${theme.primary} flex items-center justify-center text-white shadow-lg shrink-0 transition-colors duration-500`}><BrandIcon size={20} className="md:w-6 md:h-6" /></div>
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

        {/* Input Dock */}
        {messages.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 px-2 md:px-8 pb-4 md:pb-8 pt-10 bg-gradient-to-t from-white via-white to-transparent dark:from-[#0f172a] dark:via-[#0f172a] dark:to-transparent pointer-events-none z-20 transition-colors duration-500">
            <div className="max-w-[800px] mx-auto pointer-events-auto">
              <div className="bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.08)] overflow-hidden p-4 md:p-6 rounded-2xl md:rounded-3xl">
                <div className="relative">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value.slice(0, 500))}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendTextMessage(); } }}
                    placeholder={t.chat.inputPlaceholder}
                    className="w-full bg-transparent border-none focus:ring-0 outline-none text-[#111827] dark:text-white placeholder:text-slate-400 resize-none py-0 px-0 text-md font-medium min-h-[50px] md:min-h-[60px] custom-scrollbar"
                  />
                  <div className="flex items-center justify-between mt-3 md:mt-4">
                    <span className="text-[10px] md:text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-wide uppercase">{t.settings.languageName === 'বাংলা' ? 'লিমিট' : 'Limit'}: {chatInput.length}/৫০০</span>
                    <div className="flex items-center gap-2 md:gap-3">
                      <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-all p-1"><ImageIcon size={18} className="md:w-5 md:h-5" strokeWidth={2} /></button>
                      <button onClick={() => handleSendTextMessage()} disabled={!chatInput.trim() || isTyping} className={`p-1.5 rounded-full transition-all duration-300 ${chatInput.trim() && !isTyping ? theme.primary + ' text-white shadow-md' : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'}`}><Send size={18} className="md:w-5 md:h-5" fill="currentColor" /></button>
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
            <div className="flex items-center gap-3"><X size={18} className="text-red-400" /> {error}</div>
          </div>
        )}
      </main>
      {/* Usage Limit Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowLimitModal(false)} />
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[40px] p-8 md:p-10 max-w-md w-full relative z-10 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 text-center">
            <div className={`w-20 h-20 rounded-3xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500 mx-auto mb-8 ring-8 ring-amber-50/50 dark:ring-amber-900/10`}>
              <Zap size={40} className="fill-current" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
              {t.settings.languageName === 'বাংলা' ? 'আজকের লিমিট শেষ!' : 'Daily Limit Reached!'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 leading-relaxed">
              {t.settings.languageName === 'বাংলা'
                ? `আপনি আপনার ${userPlan} প্ল্যানের লিমিট (${maxUsage}) অতিক্রম করেছেন। কোনো বাধা ছাড়াই ব্যবহার চালিয়ে যেতে প্রো মেম্বারশিপে আপগ্রেড করুন।`
                : `You've reached your ${userPlan} plan limit of ${maxUsage} questions. Upgrade to Pro for unlimited access and premium features.`}
            </p>
            <div className="flex flex-col gap-4">
              <Link
                href="/dashboard/subscription"
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 dark:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {t.chat.upgrade}
              </Link>
              <button
                onClick={() => setShowLimitModal(false)}
                className="w-full py-4 rounded-2xl font-bold text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                {t.common.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {chatToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setChatToDelete(null)} />
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[40px] p-8 md:p-10 max-w-sm w-full relative z-10 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-500 mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-3">
              {t.settings.languageName === 'বাংলা' ? 'আপনি কি নিশ্চিত?' : 'Are you sure?'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-8 leading-relaxed">
              {t.settings.languageName === 'বাংলা'
                ? 'এই চ্যাটটি মুছে ফেললে পুনরায় আর ফিরে পাওয়া সম্ভব হবে না।'
                : 'Deleted conversations cannot be recovered. Do you want to continue?'}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setChatToDelete(null)}
                className="py-3.5 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border border-slate-100 dark:border-slate-800"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={confirmDelete}
                className="bg-rose-500 text-white py-3.5 rounded-xl font-black shadow-lg shadow-rose-100 dark:shadow-none hover:bg-rose-600 transition-all"
              >
                {t.settings.languageName === 'বাংলা' ? 'হ্যাঁ, মুছুন' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
