"use client";

import React, { useState } from "react";
import { useChainTracker, ViewRole } from "@/context/ChainTrackerContext";
import {
  Sparkles,
  TrendingUp,
  Leaf,
  Recycle,
  Building2,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Activity,
  ArrowRight,
  Clock,
  Flame,
  Award
} from "lucide-react";

export function ImpactDashboardView() {
  const {
    totalCarbonSavedTonnes,
    totalWasteRecycledTonnes,
    activeFacilitiesCount,
    leaderboard,
    activityFeed,
    setCurrentView,
    batches
  } = useChainTracker();

  const [feedFilter, setFeedFilter] = useState<"all" | "minted" | "verified">("all");

  const filteredFeed = activityFeed.filter((item) => {
    if (feedFilter === "minted") return item.type === "credit_minted" || item.type === "credit_purchased";
    if (feedFilter === "verified") return item.type === "geofence_verified" || item.type === "weight_scaled";
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Decentralized Measurement, Reporting & Verification (dMRV)
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Waste-to-Carbon <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
              Value Chain Tracker
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Closing the circular economy loop. Track biogenic waste from generator origin and IoT geofenced logistics, through high-permanence biochar pyrolysis, to audited on-chain carbon removal credits.
          </p>

          {/* Interactive Persona Quick Jump Cards */}
          <div className="pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Explore Value Chain Persona Roles:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => setCurrentView("supplier")}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/40 text-left transition group"
              >
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold block">STAGE 1</span>
                  <span className="text-xs font-semibold text-white group-hover:text-emerald-300">
                    Waste Supplier
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition" />
              </button>

              <button
                onClick={() => setCurrentView("driver")}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 hover:bg-sky-950/40 border border-slate-800 hover:border-sky-500/40 text-left transition group"
              >
                <div>
                  <span className="text-[10px] text-sky-400 font-bold block">STAGE 2</span>
                  <span className="text-xs font-semibold text-white group-hover:text-sky-300">
                    Driver Logistics
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition" />
              </button>

              <button
                onClick={() => setCurrentView("recycler")}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/40 text-left transition group"
              >
                <div>
                  <span className="text-[10px] text-amber-400 font-bold block">STAGE 3</span>
                  <span className="text-xs font-semibold text-white group-hover:text-amber-300">
                    Recycler Facility
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition" />
              </button>

              <button
                onClick={() => setCurrentView("auditor")}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 hover:bg-teal-950/40 border border-slate-800 hover:border-teal-500/40 text-left transition group"
              >
                <div>
                  <span className="text-[10px] text-teal-400 font-bold block">STAGE 4 & 5</span>
                  <span className="text-xs font-semibold text-white group-hover:text-teal-300">
                    Auditor & Market
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Large Statistic Cards (Impact Metrics) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: Total Carbon Saved */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-slate-900/90 p-6 shadow-xl group hover:border-emerald-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Carbon Saved
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Leaf className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white">
              {totalCarbonSavedTonnes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-sm font-semibold text-emerald-400">Tonnes CO₂e</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +14.2%
            </span>
            <span className="text-slate-400">vs. last month</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
            <span>Permanence Rating:</span>
            <span className="font-semibold text-slate-200">100+ Years (Biochar)</span>
          </div>
        </div>

        {/* Metric 2: Total Waste Recycled */}
        <div className="relative overflow-hidden rounded-2xl border border-teal-500/30 bg-slate-900/90 p-6 shadow-xl group hover:border-teal-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Waste Recycled
            </span>
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Recycle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white">
              {totalWasteRecycledTonnes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-sm font-semibold text-teal-400">Tonnes</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center text-teal-400 font-semibold bg-teal-500/10 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> 94.6%
            </span>
            <span className="text-slate-400">landfill diversion rate</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
            <span>Methane Emissions Avoided:</span>
            <span className="font-semibold text-slate-200">~3,120 tCH₄ Equiv</span>
          </div>
        </div>

        {/* Metric 3: Active Facilities */}
        <div className="relative overflow-hidden rounded-2xl border border-sky-500/30 bg-slate-900/90 p-6 shadow-xl group hover:border-sky-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Facilities
            </span>
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white">
              {activeFacilitiesCount}
            </span>
            <span className="text-sm font-semibold text-sky-400">Processing Hubs</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center text-sky-400 font-semibold bg-sky-500/10 px-1.5 py-0.5 rounded">
              <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" /> 192 Certified
            </span>
            <span className="text-slate-400">waste supplier nodes</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
            <span>Verification Standard:</span>
            <span className="font-semibold text-slate-200">ISO 14064-2 dMRV</span>
          </div>
        </div>
      </div>

      {/* Grid: Leaderboard & Simulated Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left (7 cols): Leaderboard of Top Contributing Companies */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                Top Contributing Waste Generators
              </h2>
              <p className="text-xs text-slate-400">
                Ranked by verified biogenic diversion & sequestered CO₂
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
              Updated Live
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-2 font-semibold">Rank</th>
                  <th className="py-3 px-3 font-semibold">Company / Generator</th>
                  <th className="py-3 px-3 font-semibold text-right">Waste (t)</th>
                  <th className="py-3 px-3 font-semibold text-right">CO₂ Sequestered</th>
                  <th className="py-3 px-2 font-semibold text-center">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {leaderboard.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-2">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                          item.rank === 1
                            ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                            : item.rank === 2
                            ? "bg-slate-300/20 text-slate-200 border border-slate-300/40"
                            : item.rank === 3
                            ? "bg-amber-700/20 text-amber-500 border border-amber-700/40"
                            : "text-slate-500 font-mono"
                        }`}
                      >
                        {item.rank}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{item.name}</div>
                      <div className="text-[10px] text-slate-400">{item.category}</div>
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-slate-300">
                      {item.totalWasteTonne} t
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-400">
                      {item.carbonOffsetTonne} tCO₂e
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-semibold">
                        {item.ecoScore}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right (5 cols): Simulated Live Feed of On-Chain Activity */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Live Value Chain Stream
                </h2>
                <p className="text-xs text-slate-400">Real-time dMRV consensus ticker</p>
              </div>
              <div className="flex gap-1 text-[10px]">
                <button
                  onClick={() => setFeedFilter("all")}
                  className={`px-2 py-1 rounded-md transition ${
                    feedFilter === "all" ? "bg-slate-800 text-white font-semibold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFeedFilter("minted")}
                  className={`px-2 py-1 rounded-md transition ${
                    feedFilter === "minted" ? "bg-slate-800 text-white font-semibold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Minted
                </button>
                <button
                  onClick={() => setFeedFilter("verified")}
                  className={`px-2 py-1 rounded-md transition ${
                    feedFilter === "verified" ? "bg-slate-800 text-white font-semibold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  IoT Verified
                </button>
              </div>
            </div>

            {/* Activity Stream Items */}
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {filteredFeed.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white leading-tight">{item.title}</span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">{item.description}</p>
                  <div className="pt-1 flex items-center gap-2">
                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {item.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Total Tracked Batches:</span>
            <span className="font-semibold text-emerald-400">{batches.length} Active in Pipeline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
