"use client";

import React from "react";
import { useChainTracker } from "@/context/ChainTrackerContext";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { ImpactDashboardView } from "@/components/views/ImpactDashboardView";
import { SupplierView } from "@/components/views/SupplierView";
import { DriverLogisticsView } from "@/components/views/DriverLogisticsView";
import { RecyclerFacilityView } from "@/components/views/RecyclerFacilityView";
import { AuditorMarketplaceView } from "@/components/views/AuditorMarketplaceView";
import { Globe, Leaf, Truck, Factory, ShieldCheck } from "lucide-react";

export default function Home() {
  const { currentView, setCurrentView } = useChainTracker();

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      {/* Top Header */}
      <Header />

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main View Container */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-8 max-w-7xl mx-auto w-full mb-16 md:mb-0">
          {currentView === "home" && <ImpactDashboardView />}
          {currentView === "supplier" && <SupplierView />}
          {currentView === "driver" && <DriverLogisticsView />}
          {currentView === "recycler" && <RecyclerFacilityView />}
          {currentView === "auditor" && <AuditorMarketplaceView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden items-center justify-around bg-slate-950/95 border-t border-slate-800 p-2 backdrop-blur-md">
        <button
          onClick={() => setCurrentView("home")}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-medium transition ${
            currentView === "home" ? "text-emerald-400 bg-emerald-500/10" : "text-slate-400"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Home</span>
        </button>
        <button
          onClick={() => setCurrentView("supplier")}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-medium transition ${
            currentView === "supplier" ? "text-emerald-400 bg-emerald-500/10" : "text-slate-400"
          }`}
        >
          <Leaf className="w-4 h-4" />
          <span>Supplier</span>
        </button>
        <button
          onClick={() => setCurrentView("driver")}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-medium transition ${
            currentView === "driver" ? "text-sky-400 bg-sky-500/10" : "text-slate-400"
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Driver</span>
        </button>
        <button
          onClick={() => setCurrentView("recycler")}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-medium transition ${
            currentView === "recycler" ? "text-amber-400 bg-amber-500/10" : "text-slate-400"
          }`}
        >
          <Factory className="w-4 h-4" />
          <span>Recycler</span>
        </button>
        <button
          onClick={() => setCurrentView("auditor")}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-medium transition ${
            currentView === "auditor" ? "text-teal-400 bg-teal-500/10" : "text-slate-400"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Audit & Mkt</span>
        </button>
      </div>
    </div>
  );
}
