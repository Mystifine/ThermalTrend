
'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Layers, Target, Clock } from 'lucide-react';
import { supabase } from "@/lib/supabaseClient"

// Updated Schema
interface ThemeHeat {
  id: string;
  theme: string;
  heat_score: number;            // 0-100 scale
  return_3_months: number;       // Percentage
  ["breadth_%"]: number;       // 0-100 scale
  ["near_highs_%"]: number;    // 0-100 scale
  consolidation_score: number;   // 1-10 scale
  stocks_analyzed: string[];     // list of ticker symbols
  created_at : Date,
  last_updated : Date,
}

export default function ModernDashboard() {
  const [themes, setThemes] = useState<ThemeHeat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchThemes() {
      try {
        const { data, error } = await supabase
          .from("industry_heat")
          .select("*")
          .order("heat_score", { ascending: false });
        console.log("Supabase data:", data);

        if (error) throw error;
        console.log("Supabase data:", data);
        setThemes(data as ThemeHeat[]);
      } catch (err) {
        console.error("Error fetching themes:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchThemes();
  }, []);

  // Visual helpers
  const getHeatBadge = (score: number) => {
    if (score >= 85) return 'bg-orange-500/10 text-orange-400 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]';
    if (score >= 70) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (score >= 40) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/10 text-red-400 border-red-500/30';
  };

  const getBarColor = (val: number) => {
    if (val >= 70) return 'bg-emerald-500';
    if (val >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-200 p-8 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-400 mb-4">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Live Market Metrics
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-2">
            Sector Heatmap
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl">
            Theme Heat Score (0‑100) = 40% average 3‑month return + 25% breadth (% of stocks with positive 1‑month returns) + 20% near‑highs (% within 20% of 52‑week high) + 15% price consolidation (low recent volatility).
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-t-emerald-500 border-r-transparent border-b-emerald-500 border-l-transparent"></div>
            <span className="text-sm font-medium text-gray-500 tracking-widest uppercase">Calculating Heat...</span>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          {/* Table Headers */}
          <div className="grid grid-cols-12 gap-4 px-6 pb-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-white/5 mb-4">
            <div className="col-span-3 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" /> Theme
            </div>
            <div className="col-span-2 text-center">Heat Score</div>
            <div className="col-span-2 text-right">3M Return</div>
            <div className="col-span-1">Breadth</div>
            <div className="col-span-1">Near Highs</div>
            <div className="col-span-1 text-right flex items-center justify-end gap-1">
              <Target className="w-3.5 h-3.5" /> Consol.
            </div>
            <div className="col-span-2 flex items-center gap-1">
              <Clock className="w-3 h-3"/> Last Updated
            </div>
          </div>

          {/* Data Rows */}
          <div className="space-y-3">
            {themes.map((item, index) => {
              const isTop = index === 0;

              return (
                <div
                  key={item.id}
                  className={`group grid grid-cols-12 gap-4 items-start px-6 py-4 rounded-2xl bg-white/[0.02] border transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-0.5 cursor-default ${
                    isTop
                      ? 'border-orange-500/30 shadow-[0_4px_30px_rgba(249,115,22,0.08)]'
                      : 'border-white/5 hover:border-white/10'
                  }`}
                >
                  {/* Theme + Stocks as tags */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className={`text-sm font-bold w-5 ${isTop ? 'text-orange-400' : 'text-gray-600'}`}>
                        {index + 1}
                      </span>
                      <div className="font-bold text-base text-gray-100 flex items-center gap-2">
                        {item.theme}
                        {isTop && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-orange-500/20 text-orange-400 uppercase tracking-widest">
                            Hot
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Ticker symbols as small tags */}
                    <div className="flex flex-wrap gap-1 ml-8">
                      {item.stocks_analyzed.map((symbol) => (
                        <span
                          key={symbol}
                          className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-white/5 text-gray-400 border border-white/5"
                        >
                          {symbol}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Heat Score */}
                  <div className="col-span-2 flex justify-center items-start pt-0.5">
                    <div
                      className={`flex items-center justify-center h-10 w-14 rounded-xl border font-bold text-lg font-mono ${getHeatBadge(
                        item.heat_score
                      )}`}
                    >
                      {item.heat_score.toFixed(1)}
                    </div>
                  </div>

                  {/* 3M Return */}
                  <div className="col-span-2 flex flex-col items-end justify-start pt-1 pr-4">
                    <div
                      className={`flex items-center gap-1 font-mono font-bold text-base ${
                        item.return_3_months >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {item.return_3_months >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {item.return_3_months > 0 ? '+' : ''}
                      {item.return_3_months.toFixed(1)}%
                    </div>
                  </div>

                  {/* Breadth % */}
                  <div className="col-span-1 flex flex-col justify-start gap-1.5 pr-4 pt-1">
                    <div className="flex justify-between text-xs font-mono font-medium">
                      <span className="text-gray-400">{item["breadth_%"]}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getBarColor(item["breadth_%"])} transition-all duration-1000 ease-out`}
                        style={{ width: `${item["breadth_%"]}%` }}
                      />
                    </div>
                  </div>

                  {/* Near Highs % */}
                  <div className="col-span-1 flex flex-col justify-start gap-1.5 pr-4 pt-1">
                    <div className="flex justify-between text-xs font-mono font-medium">
                      <span className="text-gray-400">{item["near_highs_%"]}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getBarColor(item["near_highs_%"])} transition-all duration-1000 ease-out`}
                        style={{ width: `${item["near_highs_%"]}%` }}
                      />
                    </div>
                  </div>

                  {/* Consolidation Score */}
                  <div className="col-span-1 text-right flex items-start justify-end pt-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-gray-200">
                        {item.consolidation_score.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-600">/10</span>
                    </div>
                  </div>

                  {/* Last Updated */}
                  <div className="col-span-2 flex items-center justify-start pt-1">
                    <Clock className="w-3 h-3 mr-1 text-gray-600 flex-shrink-0" />
                    <span className="text-[10px] font-mono text-gray-500 whitespace-nowrap">
                      {new Date(item.last_updated).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
