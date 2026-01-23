# StudyX - AI Academic Assistant

StudyX is a powerful, empathetic AI-driven academic assistant designed to help students master Mathematics, Physics, Chemistry, Biology, and English.

## Features
- **Intelligent AI**: Powered by **Qwen 2.5 7B** via OpenRouter for high-quality academic reasoning.
- **Bilingual Support**: Full support for both **English** and **Bangla**.
- **Math Rendering**: Built-in **KaTeX** support for beautiful mathematical equations.
- **Glassmorphism UI**: A premium, modern design built with **Next.js 15+** and **Tailwind CSS v4**.
- **Subject-Specific Guidance**: Tailored prompts for different academic subjects.

## Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Formatting**: [Marked](https://marked.js.org/) & [DOMPurify](https://github.com/cure53/dompurify)
- **Math**: [KaTeX](https://katex.org/)
- **LLM API**: [OpenRouter](https://openrouter.ai/) (Model: `qwen/qwen-2.5-7b-instruct`)

## Configuration

Create a `.env.local` file in the root directory and add your OpenRouter API key:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
