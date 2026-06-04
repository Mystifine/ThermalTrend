'use client';

import { useState, useEffect } from 'react';
import { Activity, Layers, Target, Clock } from 'lucide-react';
import { supabase } from "@/lib/supabaseClient"
import ThemeRow from "@/app/components/ThemeRow";

interface ThemeHeat {
  id: string;
  theme: string;
  score: number;
  stocks_analyzed: string[];
  return_3_months: number,
  return_1_months: number,
  return_6_months: number,
  created_at: Date;
}

export default function Dashboard({mode}: {mode: "breakouts" | "pullbacks"}) {
  const [themes, setThemes] = useState<ThemeHeat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchThemes() {
      try {
        const sortColumn = mode === "breakouts" ? "breakout_score" : "pullback_score";

        const { data, error } = await supabase
          .from("industry_heat")
          .select("*")
          .order(sortColumn, { ascending: false });

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
          
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Desktop Table Headers - Hidden on Mobile */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 pb-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-white/5 mb-4">
          <div className="col-span-3 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5" /> Theme
          </div>
          <div className="col-span-2 text-center">Heat Score</div>
          <div className="col-span-2 text-right">1M Returns</div>
          <div className="col-span-2 text-right">3M Returns</div>
          <div className="col-span-2 text-right">6M Returns</div>
          <div className="col-span-1 flex items-center gap-1">
            <Clock className="w-3 h-3"/> Updated
          </div>
        </div>

        {/* Data Rows */}
        <div className="space-y-3">
          {themes.map((item, index) => {
            return <ThemeRow key={item.id} item={item} index={index} mode={mode} />;
          })}
        </div>
      </div>
    </div>
  );
}