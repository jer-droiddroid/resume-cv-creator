# Papel

**Papel** is a privacy-first student resume and CV builder. Fill in your academic, internship, leadership, and project details once, then switch between ATS-friendly templates and export a crisp A4 PDF anytime.

---

## Features

- **Write Once, Switch Templates Anytime**: Your resume data is decoupled from visual themes. Switch instantaneously between **Harvard Classic**, **Single Column**, **Two Column**, **Sidebar Left**, **Header Banner**, and **Compact** layouts.
- **1-Page Resume & Multi-Page CV Modes**:
  - **Resume Mode**: Automatically adjusts typography and spacing density (`resumeFit`) to keep your resume on a single clean A4 page.
  - **CV Mode**: Supports multi-page academic CVs with automatic `Page X of Y` footer numbering and orphan-protected section breaks.
- **Action-Verb Bullet Builder for Student Organizations**: Enter your raw leadership metrics (members led, events organized, budget managed, funds raised, or campaign reach) and Papel generates quantified, action-verb bullets automatically.
- **Live A4 Preview**: Instant HTML paper preview on the right while you edit on the left, with optional writing examples that are excluded from PDF exports.
- **Privacy-First Local Storage**: All drafts stay in your browser's `localStorage`. No account required, no server-side database tracking your personal information, and a one-click **Start over** with undo available during the editing session.
- **Optional AI Resume Import**: Upload an existing PDF resume to extract and populate your details automatically via Gemini 2.0 Flash.

---

## Tech Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS v4, React Hook Form
- **PDF Generation**: `@react-pdf/renderer` (vector A4 PDF export)
- **PDF Text Extraction**: `pdfjs-dist` (in-browser PDF text parsing)
- **Typography**: `Unbounded` (brand wordmark) & `Plus Jakarta Sans` (UI)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### 3. Build for production

```bash
npm run build
```

---

## Optional: AI PDF Resume Import Setup

Papel works out of the box without any API keys. If you want to enable the **Import PDF** feature without requiring users to paste their own key in the modal:

1. Create a free API key in [Google AI Studio](https://aistudio.google.com/app/apikey).
2. For Vercel deployments, add `GEMINI_API_KEY` in **Project Settings → Environment Variables**.
3. For local development, create a `.env.local` file in the project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

*(Note: `.env*` and `*.local` files are git-ignored so your keys are never committed.)*
