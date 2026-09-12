"use client";

import React from "react";
import { useChainTracker, ViewRole } from "@/context/ChainTrackerContext";
import {
  Globe,
  Leaf,
  Truck,
  Factory,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface NavItem {
  id: ViewRole;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  badge?: number | string;
}

export function Sidebar() {
  const { currentView, setCurrentView, batches } = useChainTracker();

  const pendingDriverBatches = batches.filter((b) => b.status === "in_transit" || b.status === "created").length;
  const waitingRecyclerBatches = batches.filter((b) => b.status === "scaled").length;
  const pendingAudits = batches.filter((b) => b.status === "pending_audit").length;

  const navItems: NavItem[] = [
    {
      id: "home",
      label: "Impact Dashboard",
      sublabel: "Public Overview & Metrics",
      icon: Globe,
    },
    {
      id: "supplier",
      label: "Waste Supplier",
      sublabel: "The Generator Portal",
      icon: Leaf,
    },
    {
      id: "driver",
      label: "Driver & Logistics",
      sublabel: "GPS 50m Geofence & Scale",
      icon: Truck,
      badge: pendingDriverBatches > 0 ? `${pendingDriverBatches} Active` : undefined,
    },
    {
      id: "recycler",
      label: "Recycler Facility",
      sublabel: "Pyrolysis & Energy Conversion",
      icon: Factory,
      badge: waitingRecyclerBatches > 0 ? `${waitingRecyclerBatches} Queue` : undefined,
    },
    {
      id: "auditor",
      label: "Auditor & Marketplace",
      sublabel: "dMRV Mint & $80/t Credits",
      icon: ShieldCheck,
      badge: pendingAudits > 0 ? `${pendingAudits} Pending` : undefined,
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-800 bg-slate-950/60 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Chain Value Stages
          </p>
          <nav className="mt-2 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-600/20 to-teal-600/10 text-white border border-emerald-500/30 shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                          : "bg-slate-900 text-slate-400 group-hover:text-emerald-400"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold truncate ${isActive ? "text-white" : "text-slate-300"}`}>
                        {item.label}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">{item.sublabel}</p>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.id === "auditor"
                          ? "bg-amber-500/15 text-amber-300 border-amber-500/30 animate-pulse"
                          : "bg-slate-800 text-slate-300 border-slate-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Live dMRV Integrity Widget */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              dMRV Standard
            </span>
            <span className="text-[10px] font-mono bg-emerald-500/15 text-emerald-300 px-1.5 py-0.5 rounded">
              VM0044
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Every tonne of CO₂ is cryptographically linked to bin photo, GPS geofence, and pyrolysis logs.
          </p>
          <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Carbon Spot:</span>
            <span className="font-bold text-emerald-400">$80.00 / tCO₂e</span>
          </div>
        </div>
      </div>

      {/* Bottom User/System Status */}
      <div className="pt-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-emerald-900/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
            dM
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">Smart Ledger v2.4</p>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Consensus Active
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
