# 🌡️ ThermaTrend – Theme Heat Score Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)](https://python.org)
[![Supabase](https://img.shields.io/badge/Supabase-database-green?logo=supabase)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com)
[![GitHub Actions](https://img.shields.io/badge/scheduled%20by-GitHub%20Actions-2088FF?logo=githubactions)](https://github.com/features/actions)

**ThermaTrend** scans 27+ thematic stock baskets in real time and distills thousands of data points into a single **Theme Heat Score** (0–100).  
The dashboard reveals which sectors are gaining institutional momentum, so you can spot rotations before they become obvious.

---

## 🔥 What’s a Heat Score?

Each theme’s score is a weighted blend of four equally important signals:

```
Heat Score = 0.40 × (avg 3‑month return)
           + 0.25 × (% of stocks with positive 1‑month return)   ← breadth
           + 0.20 × (% of stocks within 20% of their 52‑week high) ← strength
           + 0.15 × (consolidation score 0–100)                   ← low recent volatility
```

All values are normalised so a higher number = more “heat”. Themes are ranked from hottest to coldest.

---

## ✨ Features

- **27+ thematic baskets** – Semiconductors, AI, Biotech, Clean Energy, Crypto, etc.
- **Clean, modern UI** – Color‑coded heat badges, progress bars, and per‑symbol tags.
- **Last updated per theme** – See exactly when each row was refreshed.
- **Fully automated pipeline** – Python backend recalculates scores daily via GitHub Actions.
- **Real Supabase data** – Your dashboard pulls live scores from a PostgreSQL database.

---

## 🧱 Tech Stack

| Layer         | Technology                                      |
|---------------|-------------------------------------------------|
| Frontend      | Next.js 15, React, Tailwind CSS, Lucide icons   |
| Backend       | Python (yfinance, pandas, numpy)                |
| Database      | Supabase (PostgreSQL)                           |
| Orchestration | GitHub Actions (cron schedule)                  |
| Hosting       | Vercel (frontend), GitHub Actions (backend)     |

---

## 📁 Project Structure

```
thermatrend/
├── frontend/                # Next.js application
│   ├── app/
│   │   ├── page.tsx         # Dashboard component
│   │   └── layout.tsx
│   ├── lib/
│   │   └── supabaseClient.ts
│   └── ...
├── backend/                 # Python heat‑score engine
│   ├── CalculateHeat.py   # main script
│   └── requirements.txt
└── .github/
    └── workflows/
        └── update_scores.yml  # daily cron job
```

---

## ⚙️ Setup (Local Development)

### 1. Clone the repo
```bash
git clone https://github.com/mystifine/thermatrend.git
cd thermatrend
```

### 2. Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local   # add your Supabase URL & anon key
npm run dev
```
The dashboard will be available at `http://localhost:3000`.

### 3. Backend (optional local run)
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```
Create a `.env` file in `backend/` with:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```
Then run:
```bash
python CalculateHeat.py
```
This will recalculate all themes and push the results to your Supabase table.

---

## 🗄️ Database Setup (Supabase)

1. Create a new project on [supabase.com](https://supabase.com).
2. In the SQL editor, create the `industry_heat` table:
   ```sql
   create table industry_heat (
     id bigint primary key generated always as identity,
     theme text not null unique,
     heat_score numeric,
     return_3_months numeric,
     "breadth_%" numeric,
     "near_highs_%" numeric,
     consolidation_score numeric,
     stocks_analyzed text[],
     created_at timestamptz default now(),
     last_updated timestamptz
   );
   ```
3. Enable Row‑Level Security and add a public read policy:
   ```sql
   alter table industry_heat enable row level security;
   create policy "Public read access"
     on industry_heat for select
     to anon
     using (true);
   ```
4. Copy the **anon public key** and **project URL** into your frontend `.env.local`.

---

## 🚀 Deployment

### Frontend (Vercel)
- Push the repository to GitHub.
- Import the project on [Vercel](https://vercel.com).
- Set the root directory to `frontend`.
- Add environment variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Backend (GitHub Actions)
- Add repository secrets (`SUPABASE_URL`, `SUPABASE_KEY`) under **Settings → Secrets and variables → Actions**.
- The workflow in `.github/workflows/update_scores.yml` will run automatically every weekday at 12:00 UTC.
- You can also trigger it manually from the **Actions** tab.

---

## 📊 Usage

- Open the dashboard to see the current heat ranking.
- Hover over a theme to see the full list of component stocks.
- The “Last Updated” column shows when each theme was last analysed.
- Data refreshes automatically every trading day (Mon–Fri).

---

## 🤝 Contributing

Pull requests are welcome! If you’d like to add a new theme or improve the heat formula, please open an issue first to discuss your idea.

---

## 📄 License

MIT © Mystifine

---

Data powered by Yahoo Finance (via `yfinance`) – use responsibly.