# 📄 AI Resume & Cover Letter Generator

An AI-powered job application toolkit that helps you generate tailored resumes and cover letters using OpenAI, manage saved jobs, and track application statuses – all securely stored in Supabase.

## Live Demo Disclaimer

Please note that the live demo linked above is intended **only** for development and testing. To keep hosting costs low:
- New user registrations may be restricted or disabled at any time.
- Some features may be unstable or unavailable.
- Use this demo **at your own risk**; do **not** rely on it for production data.

---

## Employer / Hiring Inquiries

If you’re an employer interested in leveraging this project, or if you encounter an issue you’d like me to solve, please reach out!  
Email me at: **francesco.vurchio82@gmail.com** with:
1. A brief description of the problem or feature you need, and  
2. Any relevant deadlines or context.  
I’ll get back to you as soon as possible.

---

## 📚 Table of Contents

- [🚀 Live Demo](#-live-demo)
- [🛠 Tech Stack](#-tech-stack)
- [✨ Features](#-features)
- [🔐 Authentication & Access](#-authentication--access)
- [📦 Project Structure](#-project-structure)
- [📸 Screenshots](#-screenshots)
- [💻 Local Development](#-local-development)
- [🚀 Deployment](#-deployment)
- [🧠 Future Improvements](#-future-improvements)

---

## 🚀 Live Demo

🔗 [Click to view the deployed version](https://applywise-one.vercel.app/)

> ⚠️ **Note:** Access is restricted to the app owner. Only the authorized Clerk user ID is allowed to sign in and use AI generation features.

---

## 🛠 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.dev/)
- **Authentication:** [Clerk](https://clerk.com/)
- **Database:** [Supabase (PostgreSQL)](https://supabase.com/)
- **AI Generation:** [OpenAI API (GPT-4 / 3.5)](https://platform.openai.com/)
- **Markdown Rendering:** `react-markdown`
- **Notifications:** `sonner`
- **Hosting:** [Vercel](https://vercel.com/)

---

## ✨ Features

✅ Parse job descriptions and extract skills/experience  
✅ Generate custom-tailored resumes with OpenAI  
✅ Generate professional cover letters from a pre-defined tone and template  
✅ Track job applications by status, notes, and linked documents  
✅ Save and edit resumes and cover letters  
✅ Fully authenticated experience using Clerk  
✅ Mobile-responsive UI with modern UX  

---

## 🔐 Authentication & Access

This app is for **personal use only**. Here's how access is restricted:

- **Clerk Middleware:** Only your Clerk `userId` is allowed to access `/dashboard` and `/api` routes.
- **Sign-in UI Hidden in Production:** The sign-in button is hidden unless `NODE_ENV !== production`.
- **Restricted Signups:** Clerk settings are set to "Restricted" sign-up mode to prevent new account creation.

---

## 📦 Project Structure

```
app/
  ├── api/                       # Server-side API routes
  ├── dashboard/                 # Main authenticated app pages
  ├── layout.tsx                # App layout (Navbar, Toaster, ThemeProvider)
  └── page.tsx                  # Public landing page

components/
  ├── ui/                        # ShadCN UI components
  ├── Navbar.tsx
  ├── InputWithButton.tsx
  └── ThemeToggle.tsx

lib/
  ├── supabase-server.ts         # Supabase server client
  └── utils.ts                   # Any shared helpers

middleware.ts                    # Clerk auth middleware
.env.local                       # Environment variables
```

---

## 💻 Local Development

### 1. Clone the repo
```bash
git clone https://github.com/munaciella/resume-ai
cd resume-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file:

```env
CLERK_SECRET_KEY=your_clerk_secret
CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
NEXT_PUBLIC_CLERK_FRONTEND_API=your_clerk_frontend_api
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

OPENAI_API_KEY=your_openai_key
SUPABASE_URL=https://your.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_key
```

### 4. Run the app locally
```bash
npm run dev
```

---

## 🚀 Deployment

The app is ready for [Vercel](https://vercel.com) deployment.

- Push to GitHub and import the repo into Vercel
- Add all environment variables to the Vercel dashboard
- Set **sign-up mode to "Restricted"** in Clerk dashboard
- Deploy 🚀

---

## 🧠 Future Improvements

- Export resume & cover letter as PDF
- Improved job parsing with AI summarization
- Email alerts for job application deadlines
- Admin dashboard to manually manage job/resume/cover letter records
- Internationalization support

---

## 🧑‍💻 Built by Francesco Vurchio

Connect with me:  
[LinkedIn](https://linkedin.com/in/francesco-vurchio) • [GitHub](https://github.com/munaciella) • [Website](https://francescovurchio-dev.netlify.app/)
