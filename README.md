# StudyX AI — The Intelligent Academic Assistant

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=flat-square&logo=clerk)](https://clerk.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-Private-red?style=flat-square)](LICENSE)

**StudyX AI** is a high-performance, empathetic AI-driven academic assistant designed to empower students in mastering complex subjects including Mathematics, Physics, Chemistry, Biology, and English. Built with a modern glassmorphism UI, it provides a seamless and engaging learning experience.

---

## 🚀 Key Features

### 🎓 Academic Excellence
*   **Subject-Specific Intelligence**: Tailored AI reasoning for STEM and Humanities, providing accurate and context-aware explanations.
*   **Advanced Math Rendering**: Full integration with **KaTeX** for crystal-clear mathematical equations and scientific notation.
*   **Bilingual Support**: Native-level support for both **English** and **Bangla**, breaking language barriers in education.

### 🎨 Premium User Experience
*   **Glassmorphism UI**: A modern, sleek interface designed with **Next.js 15** and **Tailwind CSS v4** for maximum focus and aesthetic appeal.
*   **Real-time Interaction**: Low-latency AI chat interface powered by **Qwen 2.5 7B** via OpenRouter.
*   **Responsive Design**: Fully optimized for desktop, tablet, and mobile learning environments.

### 🛠️ Enterprise-Grade Infrastructure
*   **Secure Authentication**: User identity and session management handled by **Clerk**.
*   **Scalable Backend**: Data persistence and real-time capabilities powered by **Supabase**.
*   **Robust Content Processing**: Secure Markdown rendering with **Marked** and **DOMPurify**.

---

## 💻 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, React 19) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/) |
| **Authentication** | [Clerk](https://clerk.com/) |
| **Database** | [Supabase](https://supabase.com/) |
| **AI Engine** | [OpenRouter](https://openrouter.ai/) (Qwen 2.5 7B) |
| **Math Rendering** | [KaTeX](https://katex.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 🛠️ Getting Started

### Prerequisites
*   Node.js 20+
*   npm / yarn / pnpm
*   API keys for OpenRouter, Clerk, and Supabase

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hossainchisty/StudyX-AI.git
   cd StudyX-AI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory:
   ```env
   # AI Configuration
   OPENROUTER_API_KEY=your_openrouter_api_key

   # Authentication (Clerk)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Database (Supabase)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000) to start learning.

---

## 📂 Project Structure

```text
├── app/                # Next.js App Router (Pages & API)
├── components/         # Reusable UI Components
├── lib/                # Utilities, Contexts, and I18n
├── public/             # Static Assets & Images
├── next.config.ts      # Next.js Configuration
└── package.json        # Project Dependencies
```

---

## 📄 License

This project is currently **Private**. All rights reserved.

---

Developed with ❤️ by [hossainchisty](https://github.com/hossainchisty)
