'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Layers, Target, Clock } from 'lucide-react';
import { supabase } from "@/lib/supabaseClient"

interface ThemeHeat {
  id: string;
  theme: string;
  heat_score: number;
  ["breadth_%"]: number;
  ["near_highs_%"]: number;
  return_3_months: number;
  consolidation_score: number;
  stocks_analyzed: string[];
  created_at: Date;
  last_updated: Date;
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

        if (error) throw error;
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

  const isMarketTheme = (theme : string) => {
    return theme == "Broad Market";
  }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex justify-center items-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-t-emerald-500 border-r-transparent border-b-emerald-500 border-l-transparent"></div>
          <span className="text-sm font-medium text-gray-500 tracking-widest uppercase">Calculating Heat...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-4">
        <div className="text-center p-6 bg-red-500/10 border border-red-500/30 rounded-2xl max-w-md">
          <p className="text-red-400 font-medium text-lg">Failed to load market data</p>
          <p className="text-gray-500 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-200 p-4 md:p-8 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6 md:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-400 mb-3 md:mb-4">
          <Activity className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-400" />
          Live Market Metrics
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-2">
          Thermal Trend
        </h1>
        <p className="text-gray-400 text-xs md:text-sm max-w-xl leading-relaxed">
          Theme Heat Score (0‑100) = 40% avg 3‑month return + 25% breadth + 20% near‑highs + 15% consolidation.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Desktop Table Headers - Hidden on Mobile */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 pb-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-white/5 mb-4">
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
            <Clock className="w-3 h-3"/> Updated
          </div>
        </div>

        {/* Data Rows */}
        <div className="space-y-3">
          {themes.map((item, index) => {
            const isTop = index === 0;
            const showSymbols = 5;
            const remainingSymbols = item.stocks_analyzed.length - showSymbols;

            return (
              <div
                key={item.id}
                className={`rounded-2xl bg-white/[0.02] border transition-all duration-300 hover:bg-white/[0.04] ${
                  isTop
                    ? 'border-orange-500/30 shadow-[0_4px_30px_rgba(249,115,22,0.08)]'
                    : 'border-white/5 hover:border-white/10'
                }`}
              >
                {/* Desktop Row Layout */}
                <div className="hidden md:grid grid-cols-12 gap-4 items-start px-6 py-4">
                  {/* Theme + Stocks */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className={`text-sm font-bold w-5 ${isTop ? 'text-orange-400' : 'text-gray-600'}`}>
                        {index + 1}
                      </span>
                      <div className="font-bold text-base text-gray-100 flex items-center gap-2">
                        {item.theme}
                        {isTop && !isMarketTheme(item.theme) && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-orange-500/20 text-orange-400 uppercase tracking-widest">
                            Hot
                          </span>
                        )}
                        {isMarketTheme(item.theme) && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-blue-500/20 text-blue-400 uppercase tracking-widest border border-blue-500/30">
                            Benchmark
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 ml-8">
                      {item.stocks_analyzed.slice(0, showSymbols).map((symbol) => (
                        <span key={symbol} className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-white/5 text-gray-400 border border-white/5">
                          {symbol}
                        </span>
                      ))}
                      {remainingSymbols > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-mono text-gray-600">+{remainingSymbols}</span>
                      )}
                    </div>
                  </div>

                  {/* Heat Score */}
                  <div className="col-span-2 flex justify-center items-start pt-0.5">
                    <div className={`flex items-center justify-center h-10 w-14 rounded-xl border font-bold text-lg font-mono ${getHeatBadge(item.heat_score)}`}>
                      {item.heat_score.toFixed(1)}
                    </div>
                  </div>

                  {/* 3M Return */}
                  <div className="col-span-2 flex flex-col items-end justify-start pt-1 pr-4">
                    <div className={`flex items-center gap-1 font-mono font-bold text-base ${item.return_3_months >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {item.return_3_months >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {item.return_3_months > 0 ? '+' : ''}{item.return_3_months.toFixed(1)}%
                    </div>
                  </div>

                  {/* Breadth */}
                  <div className="col-span-1 flex flex-col justify-start gap-1.5 pr-4 pt-1">
                    <div className="flex justify-between text-xs font-mono font-medium">
                      <span className="text-gray-400">{item["breadth_%"]}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${getBarColor(item["breadth_%"])} transition-all duration-1000 ease-out`} style={{ width: `${item["breadth_%"]}%` }} />
                    </div>
                  </div>

                  {/* Near Highs */}
                  <div className="col-span-1 flex flex-col justify-start gap-1.5 pr-4 pt-1">
                    <div className="flex justify-between text-xs font-mono font-medium">
                      <span className="text-gray-400">{item["near_highs_%"]}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${getBarColor(item["near_highs_%"])} transition-all duration-1000 ease-out`} style={{ width: `${item["near_highs_%"]}%` }} />
                    </div>
                  </div>

                  {/* Consolidation */}
                  <div className="col-span-1 text-right flex items-start justify-end pt-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-gray-200">{item.consolidation_score.toFixed(1)}</span>
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

                {/* Mobile Card Layout */}
                <div className="md:hidden p-4">
                  {/* Top Row: Rank + Theme + Heat Score */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${isTop ? 'text-orange-400' : 'text-gray-600'}`}>
                        #{index + 1}
                      </span>
                      <h3 className="font-bold text-gray-100 text-sm">
                        {item.theme}
                        {isTop && (
                          <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] bg-orange-500/20 text-orange-400 uppercase tracking-widest">
                            Hot
                          </span>
                        )}
                      </h3>
                    </div>
                    <div className={`flex items-center justify-center h-9 w-12 rounded-lg border font-bold text-base font-mono ${getHeatBadge(item.heat_score)}`}>
                      {item.heat_score.toFixed(1)}
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {/* 3M Return */}
                    <div className="bg-white/[0.03] rounded-lg p-2">
                      <div className="text-[10px] text-gray-500 uppercase mb-1">3M Return</div>
                      <div className={`flex items-center gap-1 font-mono font-bold text-sm ${item.return_3_months >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {item.return_3_months >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {item.return_3_months > 0 ? '+' : ''}{item.return_3_months.toFixed(1)}%
                      </div>
                    </div>

                    {/* Breadth */}
                    <div className="bg-white/[0.03] rounded-lg p-2">
                      <div className="text-[10px] text-gray-500 uppercase mb-1">Breadth</div>
                      <div className="font-mono font-bold text-sm text-gray-300">{item["breadth_%"]}%</div>
                      <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden mt-1">
                        <div className={`h-full rounded-full ${getBarColor(item["breadth_%"])}`} style={{ width: `${item["breadth_%"]}%` }} />
                      </div>
                    </div>

                    {/* Near Highs */}
                    <div className="bg-white/[0.03] rounded-lg p-2">
                      <div className="text-[10px] text-gray-500 uppercase mb-1">Near Highs</div>
                      <div className="font-mono font-bold text-sm text-gray-300">{item["near_highs_%"]}%</div>
                      <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden mt-1">
                        <div className={`h-full rounded-full ${getBarColor(item["near_highs_%"])}`} style={{ width: `${item["near_highs_%"]}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Consolidation + Updated */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Target className="w-3 h-3 text-gray-600" />
                      <span className="text-gray-400">Consolidation:</span>
                      <span className="font-mono font-bold text-gray-200">{item.consolidation_score.toFixed(1)}</span>
                      <span className="text-gray-600">/10</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                      <Clock className="w-3 h-3" />
                      {new Date(item.last_updated).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>

                  {/* Symbols */}
                  <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-white/5">
                    {item.stocks_analyzed.slice(0, showSymbols).map((symbol) => (
                      <span key={symbol} className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-white/5 text-gray-400 border border-white/5">
                        {symbol}
                      </span>
                    ))}
                    {remainingSymbols > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono text-gray-600">+{remainingSymbols} more</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}