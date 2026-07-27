# AI UI Audit 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-cyan.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3-blue.svg)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Gemini%20API-1.5%20Flash-indigo.svg)](https://ai.google.dev/)

> **"AI-powered UI & UX Review Platform"**
>
> Scans screenshots of websites, SaaS dashboards, landing pages, mobile wireframes, and portfolios to deliver deep, professional UX/UI audits matching the recommendations of a Senior Product Designer.

---

## 📖 Table of Contents
- [Features](#-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Folder Structure](#-folder-structure)
- [Installation & Running Locally](#-installation--running-locally)
- [Environment Variables](#-environment-variables)
- [Suggested Git Commit History](#-suggested-git-commit-history)
- [Deployment](#-deployment)
- [Future Roadmap](#-future-roadmap)
- [License](#-license)

---

## ✨ Features

- **Stunning Landing Page**: Premium, animated UI highlighting core features, pricing tiers, mock client testimonials, and interactive FAQs.
- **Mock Google & Credentials Login**: Full JSON-Web-Token (JWT) authentication flow with a simulated Google OAuth login.
- **Designer Cockpit (Dashboard)**: Track cumulative stats (Average UI Score, total submissions, pending high-severity issues), view category averages, and list recent report submissions.
- **Drag & Drop Screenshot Upload**: Supports PNG, JPG, and JPEG images up to 10MB, with responsive error checks.
- **Interactive AI Thinking Loader**: Multi-step spinner cycling through analytical steps (scanning typography, layout grids, accessibility, and contrast check).
- **Dual-Pane Deep-Dive Review**: Side-by-side view featuring a sticky uploaded image panel and a scrolling design recommendation report.
- **Actionable Priority Matrix**: Organizes fixes into *Quick Wins* and *Long-Term Improvements* categorized by severity (High/Medium/Low).
- **Command Palette (`Ctrl + K`)**: Instantly search history reports, toggle themes, navigate views, or sign out.
- **Offline Banner Detection**: Gracefully alerts users of network connectivity interruptions.

---

## 🛠️ Architecture & Tech Stack

### Frontend
- **React (Vite)**: Fast, modern SPA framework.
- **Tailwind CSS**: Custom tokens defining our background (`#F8FAFC`), rounding constraints (`16px`), and Slate typography scale.
- **Framer Motion**: Controls spotlight fades, slide-overs, and collapsible FAQ lists.
- **React Dropzone**: Manages file drags and sizes validation.
- **Axios**: Handles auth requests and image uploads.
- **Lucide Icons**: Modern vector icon support.

### Backend
- **Node.js & Express.js**: REST API server.
- **Multer**: Stores screenshots in local memory buffers before analysis.
- **Gemini 1.5 Flash**: Assesses design layouts with structured JSON schemas.
- **Bcrypt.js & JWT**: Protects API routes.
- **JSON Database**: Local `db.json` persisting accounts, sessions, pins, and reports without PostgreSQL/MongoDB requirements.

---

## 📂 Folder Structure

```
AI_UI_AUDIT/
├── backend/
│   ├── config/          # db.json helper driver
│   ├── controllers/     # Auth and Audit logics
│   ├── middleware/      # JWT route protectors
│   ├── routes/          # API route definitions
│   ├── uploads/         # Stores audited screenshots
│   ├── server.js        # Express entry point
│   ├── package.json     # Backend node config
│   └── .env.example     # Environment template
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # DesignSystem.jsx & CommandPalette.jsx
│   │   ├── context/     # AuthContext.jsx
│   │   ├── layouts/     # AppLayout.jsx (Sidebar + search)
│   │   ├── pages/       # Landing, Login, Dashboard, Upload, Analysis, History, Profile
│   │   ├── App.jsx      # React router configuration
│   │   ├── main.jsx     # App mount script
│   │   └── index.css    # Tailwind bases + glass-effects
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Installation & Running Locally

### Prerequisites
- Node.js v18.0.0 or higher
- npm v9.0.0 or higher

### Step 1: Install Dependencies
Open a terminal in the root project folder, then run:

```bash
# Install backend packages
cd backend
npm install

# Install frontend packages
cd ../frontend
npm install
```

### Step 2: Configure Environment
Create a `.env` file in the `backend/` directory:

```bash
cd ../backend
cp .env.example .env
```
Add your **Gemini API Key**:
```env
PORT=5000
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_actual_gemini_api_key
```
*(Note: If no Gemini API Key is supplied, the backend automatically responds with high-quality simulated mockup audits matching the screenshot upload. This ensures out-of-the-box operation for evaluation).*

### Step 3: Run the Servers
Start both servers simultaneously in separate terminals:

**Terminal 1 (Backend Express Server)**:
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend Client)**:
```bash
cd frontend
npm run dev
```
Open **`http://localhost:5173`** in your browser to view the application.

---

## ⚙️ Environment Variables

The backend relies on the following configurations in its `.env` file:
| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Express listener port | `5000` |
| `JWT_SECRET` | Secret key used to encrypt auth tokens | `ai_ui_audit_secret_key_super_secure_987654321` |
| `GEMINI_API_KEY` | Gemini API Developer Key | *(Optional; Mock fallbacks enabled)* |

---

## 🪵 Suggested Git Commit History

For a professional repository presentation, use this progression of commits:

1. `feat(repo): initialize project structures and configure gitignores`
2. `feat(backend): implement local JSON database utility and JWT auth routes`
3. `feat(backend): configure Multer uploads and Gemini 1.5 Flash client auditor`
4. `feat(frontend): set up Vite, Tailwind CSS configurations, and Inter fonts`
5. `feat(frontend): build central AuthContext and protected routing shell`
6. `feat(frontend): implement modular DesignSystem and AppLayout Sidebar`
7. `feat(frontend): construct animated Command Palette (Ctrl+K) search triggers`
8. `feat(frontend): create animated Landing Page and interactive FAQs`
9. `feat(frontend): implement credentials login, signup, and Google OAuth mock`
10. `feat(frontend): design Dashboard cockpit and multi-step AI thinking loader`
11. `feat(frontend): build dual-pane Analysis report screen and History pinning`
12. `docs(readme): compile final setup documentation and architectural logs`

---

## 📦 Deployment

### Backend → Render
1. Create a Web Service on Render.
2. Link your GitHub repository.
3. Configure settings:
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
4. Set Environment Variables: Add `JWT_SECRET` and `GEMINI_API_KEY`.

### Frontend → Vercel
1. Create a Project on Vercel.
2. Link your GitHub repository.
3. Configure settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Set Environment Variables:
   - `VITE_API_URL`: Add the URL of your deployed Render service (e.g. `https://your-backend.onrender.com/api`).

---

## 🗺️ Future Roadmap

- [ ] **AI Redesigns**: Let Gemini automatically output Tailwind CSS structural modifications.
- [ ] **Design Tokens**: Export color boards and font scales as standard CSS variables.
- [ ] **Figma Integration**: Export report issues directly to Figma projects via plugin API keys.
- [ ] **Accessibility Contrast Heatmap**: Overlay screenshot nodes highlighting severe visual contrast violations.

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for more details.
