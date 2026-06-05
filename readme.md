# 🔥 Thermal Trend – Theme Momentum Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)](https://python.org)
[![Supabase](https://img.shields.io/badge/Supabase-database-green?logo=supabase)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com)
[![GitHub Actions](https://img.shields.io/badge/scheduled%20by-GitHub%20Actions-2088FF?logo=githubactions)](https://github.com/features/actions)

**Thermal Trend** tracks 27+ thematic stock baskets and ranks them using proprietary momentum and technical-structure scoring models.

Rather than simply measuring performance, Thermal Trend identifies:

* Themes experiencing accelerating momentum
* Themes building strong breakout setups
* Themes offering attractive pullback opportunities

The result is a market-wide view of where institutional capital is rotating and which sectors are setting up for their next move.

---

## 📈 Core Metrics

Every theme is evaluated using three primary scores.

### 🔥 Hot Theme Score

Measures overall momentum and acceleration within a theme.

The score combines:

* 1-Month Median Return
* 3-Month Median Return
* 6-Month Median Return
* Momentum Acceleration (1M vs 3M performance)

```
Hot Theme Score =
  30% Acceleration
+ 30% 1-Month Return
+ 20% 3-Month Return
+ 20% 6-Month Return (dampened)
```

Themes with rising momentum tend to rank higher than themes that have already peaked.

---

### 🚀 Breakout Score

Identifies themes whose constituent stocks are forming high-quality breakout setups.

Each stock is evaluated based on:

* Prior price run-up
* Distance from recent highs
* Range contraction
* Volume dry-up
* Higher-low structure

```
Breakout Score =
  30% Prior Run-Up
+ 25% Near Highs
+ 20% Volume Contraction
+ 15% Range Contraction
+ 10% Higher Lows
```

Higher scores indicate stocks consolidating beneath potential breakout levels.

---

### 📉 Pullback Score

Identifies strong stocks that are pulling back into support.

Each stock is evaluated based on:

* Prior trend strength
* Pullback depth
* EMA alignment
* Volume contraction

```
Pullback Score =
  45% Prior Run-Up
+ 20% Pullback Depth
+ 20% EMA Cluster
+ 15% Volume Dry-Up
```

Higher scores suggest healthier pullbacks within established uptrends.

---

## ✨ Features

* **27+ thematic baskets** covering AI, Semiconductors, Robotics, Nuclear Energy, Defense, Biotech, Crypto, and more.
* **Hot Theme Rankings** showing which sectors are gaining momentum.
* **Breakout Rankings** highlighting themes with strong technical setups.
* **Pullback Rankings** identifying potential buy-the-dip opportunities.
* **Automated daily analysis** using GitHub Actions.
* **Live Supabase database** powering real-time dashboard updates.
* **Modern responsive UI** built with Next.js and Tailwind CSS.

---

## 🧱 Tech Stack

| Layer      | Technology                      |
| ---------- | ------------------------------- |
| Frontend   | Next.js 15, React, Tailwind CSS |
| Backend    | Python, Pandas, NumPy, yFinance |
| Database   | Supabase (PostgreSQL)           |
| Scheduling | GitHub Actions                  |
| Hosting    | Vercel                          |

---

## 🧠 How It Works

For every stock in a theme:

1. Download historical price and volume data from Yahoo Finance.
2. Calculate:

   * 1-Month Returns
   * 3-Month Returns
   * 6-Month Returns
   * Breakout Structure Score
   * Pullback Structure Score
3. Aggregate results at the theme level.
4. Store rankings in Supabase.
5. Display updated rankings on the dashboard.

The system uses median returns instead of averages to reduce the impact of outliers.

---

## 📁 Project Structure

```text
thermal-trend/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── ...
│
├── backend/
│   ├── main.py
│   ├── Themes.json
│   ├── requirements.txt
│   └── ...
│
└── .github/
    └── workflows/
        └── update_scores.yml
```

---

## ⚙️ Local Development

### Clone Repository

```bash
git clone https://github.com/mystifine/thermal-trend.git
cd thermal-trend
```

### Frontend

```bash
cd frontend

npm install

cp .env.local.example .env.local

npm run dev
```

Open:

```text
http://localhost:3000
```

---

### Backend

```bash
cd backend

python -m venv venv

source venv/bin/activate
# Windows:
# venv\Scripts\activate

pip install -r requirements.txt
```

Create:

```text
backend/.env
```

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

Run:

```bash
python main.py
```

---

## 🗄️ Database Schema

```sql
create table industry_heat (
  id uuid primary key,
  theme text not null unique,

  hot_theme_score numeric,
  breakout_score numeric,
  pullback_score numeric,

  return_1_months numeric,
  return_3_months numeric,
  return_6_months numeric,

  stocks_analyzed text[],

  created_at timestamptz,
  last_updated timestamptz
);
```

---

## 🚀 Deployment

### Frontend (Vercel)

1. Push repository to GitHub.
2. Import project into Vercel.
3. Set root directory to:

```text
frontend
```

4. Add environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

### Backend (GitHub Actions)

Add repository secrets:

```text
SUPABASE_URL
SUPABASE_KEY
```

The workflow automatically:

* Downloads market data
* Calculates all theme metrics
* Updates Supabase
* Refreshes dashboard data

You can also run the workflow manually from the GitHub Actions tab.

---

## 📊 Example Themes

Current theme coverage includes:

* AI
* Semiconductors
* Robotics
* Cybersecurity
* Cloud Computing
* Defense
* Nuclear Energy
* Uranium
* Biotech
* FinTech
* Crypto Infrastructure
* Autonomous Vehicles
* Renewable Energy
* Industrial Automation

…and many more.

---

## 🤝 Contributing

Contributions are welcome.

If you'd like to:

* Add new themes
* Improve scoring models
* Enhance the dashboard
* Improve performance

please open an issue before submitting major changes.

---

## 📄 License

MIT © Mystifine

---

### Data Source

Market data is provided by Yahoo Finance through the `yfinance` library.

This project is intended for educational and research purposes only and should not be considered investment advice.
