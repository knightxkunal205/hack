"use client";

import React from "react";
import { useChainTracker, ViewRole } from "@/context/ChainTrackerContext";
import {
  Recycle,
  Sparkles,
  Wallet,
  RotateCcw,
  Activity,
  Layers,
  ChevronDown
} from "lucide-react";

export function Header() {
  const {
    currentView,
    setCurrentView,
    walletBalanceUSD,
    resetDemoData,
    batches
  } = useChainTracker();

  const pendingAudits = batches.filter((b) => b.status === "pending_audit").length;

  const roleLabels: Record<ViewRole, string> = {
    home: "Public Impact & Overview",
    supplier: "Waste Supplier (Generator)",
    driver: "Driver & Logistics (GPS)",
    recycler: "Recycler (Pyrolysis Facility)",
    auditor: "Auditor & Carbon Marketplace",
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-950/50">
            <Recycle className="h-5 w-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white sm:text-lg">
                CarbonLoop <span className="text-emerald-400">dMRV</span>
              </h1>
              <span className="hidden rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20 sm:inline-block">
                Hackathon MVP
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Waste-to-Carbon-Value Chain Tracker</p>
          </div>
        </div>

        {/* Center: Quick Role Switcher Dropdown (Responsive) */}
        <div className="hidden md:flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl p-1 shadow-inner">
          <span className="text-[11px] font-medium text-slate-400 px-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" /> Active Role:
          </span>
          {(["home", "supplier", "driver", "recycler", "auditor"] as ViewRole[]).map((role) => (
            <button
              key={role}
              onClick={() => setCurrentView(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                currentView === role
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {role === "home" && "Overview"}
              {role === "supplier" && "Supplier"}
              {role === "driver" && "Driver"}
              {role === "recycler" && "Recycler"}
              {role === "auditor" && (
                <>
                  Auditor
                  {pendingAudits > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </>
              )}
            </button>
          ))}
        </div>

        {/* Right: Network Status, Wallet & Reset Demo */}
        <div className="flex items-center gap-3">
          {/* Live Node status */}
          <div className="hidden lg:flex items-center gap-2 rounded-xl bg-slate-900/60 px-3 py-1.5 border border-slate-800 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] text-slate-300">dMRV Net • #19,402</span>
          </div>

          {/* Wallet Balance Pill */}
          <div className="flex items-center gap-2 rounded-xl bg-slate-900 border border-emerald-500/20 px-3 py-1.5 text-xs text-white">
            <Wallet className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-mono font-semibold text-emerald-300">
              ${walletBalanceUSD.toLocaleString()}
            </span>
          </div>

          {/* Reset Demo button */}
          <button
            onClick={resetDemoData}
            title="Reset to Initial Demo State"
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset State</span>
          </button>
        </div>
      </div>
    </header>
  );
}
