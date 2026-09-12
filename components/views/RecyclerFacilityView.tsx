"use client";

import React, { useState } from "react";
import { useChainTracker } from "@/context/ChainTrackerContext";
import { WasteBatch } from "@/lib/mockData";
import {
  Factory,
  Flame,
  Zap,
  Leaf,
  CheckCircle2,
  Clock,
  Scale,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Gauge,
  HelpCircle,
  FileCheck
} from "lucide-react";

export function RecyclerFacilityView() {
  const {
    batches,
    startRecyclingBatch,
    submitRecyclingRun,
    setCurrentView
  } = useChainTracker();

  // Batches that have been verified/scaled and are ready for processing or already in processing
  const waitingBatches = batches.filter(
    (b) => b.status === "scaled" || b.status === "arrived_geofence" || b.status === "created"
  );
  const activeProcessingBatches = batches.filter((b) => b.status === "processing");

  // Pick a batch for the "Recycle Waste" form
  const [selectedBatchId, setSelectedBatchId] = useState<string>(
    batches.find((b) => b.status === "processing" || b.status === "scaled")?.id || batches[0].id
  );

  const activeBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];

  // Conversion Form State
  const [conversionMethod, setConversionMethod] = useState<
    "Biochar Pyrolysis" | "Anaerobic Biogas" | "Industrial Composting"
  >("Biochar Pyrolysis");
  const [energyKwh, setEnergyKwh] = useState<number>(36);
  const [yieldKg, setYieldKg] = useState<number>(
    activeBatch ? Math.round((activeBatch.driverVerifiedWeightKg || activeBatch.declaredWeightKg) * 0.3) : 35
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Real-time dMRV Carbon Calculator
  const carbonPurity = conversionMethod === "Biochar Pyrolysis" ? 0.84 : conversionMethod === "Anaerobic Biogas" ? 0.65 : 0.45;
  const grossCarbonTonne = (yieldKg * carbonPurity * 3.67) / 1000;
  const energyDeductionTonne = (energyKwh * 0.35) / 1000;
  const netEstimatedCredits = Math.max(0.01, parseFloat((grossCarbonTonne - energyDeductionTonne).toFixed(3)));

  const handleClaimBatch = (batchId: string) => {
    startRecyclingBatch(batchId);
    setSelectedBatchId(batchId);
    const target = batches.find((b) => b.id === batchId);
    if (target) {
      setYieldKg(Math.round((target.driverVerifiedWeightKg || target.declaredWeightKg) * 0.3));
    }
  };

  const handleSubmitAudit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      submitRecyclingRun(activeBatch.id, conversionMethod, energyKwh, yieldKg);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
            <Factory className="w-3.5 h-3.5" />
            Certified Pyrolysis Facility #01 • BioChar Circular Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Recycler Processing Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Intake segregated feedstock, manage high-temperature pyrolysis runs, log operational energy consumption, and submit batches for dMRV audit.
          </p>
        </div>

        {/* Facility Efficiency Metrics */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-shrink-0">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[130px]">
            <span className="text-[11px] text-slate-400 block font-medium">Kiln Temperature</span>
            <span className="text-xl sm:text-2xl font-black text-amber-400 block mt-0.5">550°C</span>
            <span className="text-[10px] text-slate-400">Anoxic Bio-Pyrolysis</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 text-center min-w-[130px]">
            <span className="text-[11px] text-emerald-400 block font-medium">Carbon Purity</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-300 block mt-0.5">84.2%</span>
            <span className="text-[10px] text-slate-400">Fixed Carbon Content</span>
          </div>
        </div>
      </div>

      {/* Waiting Waste Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Waiting Waste Intake Queue
            </h2>
            <p className="text-xs text-slate-400">
              Incoming batches available to claim and load into conversion chambers
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 w-max">
            {waitingBatches.length} Batches Ready
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3 font-semibold">Batch ID</th>
                <th className="py-3 px-3 font-semibold">Origin Supplier</th>
                <th className="py-3 px-3 font-semibold">Feedstock Type</th>
                <th className="py-3 px-3 font-semibold text-right">Driver Scale (kg)</th>
                <th className="py-3 px-3 font-semibold text-center">Moisture %</th>
                <th className="py-3 px-3 font-semibold text-right">Status</th>
                <th className="py-3 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {waitingBatches.map((batch) => {
                const isSelected = batch.id === selectedBatchId;
                return (
                  <tr
                    key={batch.id}
                    className={`transition ${
                      isSelected ? "bg-amber-500/10" : "hover:bg-slate-800/40"
                    }`}
                  >
                    <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">
                      #{batch.id}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-white">{batch.supplierName}</div>
                      <div className="text-[10px] text-slate-400">{batch.supplierLocation}</div>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-200">
                      {batch.wasteType}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-white">
                      {batch.driverVerifiedWeightKg || batch.declaredWeightKg} kg
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 text-[10px] font-semibold">
                        {batch.moisturePercentage}%
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {batch.status === "scaled"
                          ? "Scaled & Gate In"
                          : batch.status === "arrived_geofence"
                          ? "At Gate (Geofence)"
                          : "Scheduled"}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => handleClaimBatch(batch.id)}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold text-xs transition shadow-sm"
                      >
                        Claim Batch
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recycle Waste Form & Real-time Sequestration Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left (7 cols): Recycle Waste Form */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                Recycle & Convert Biomass Run
              </h2>
              <p className="text-xs text-slate-400">
                Active Batch: <strong className="text-emerald-400">#{activeBatch.id}</strong> ({activeBatch.supplierName})
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
              Conversion Chamber #A
            </span>
          </div>

          <form onSubmit={handleSubmitAudit} className="space-y-5">
            {/* Conversion Method Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Conversion Technology & Method
              </label>
              <select
                value={conversionMethod}
                onChange={(e) =>
                  setConversionMethod(
                    e.target.value as "Biochar Pyrolysis" | "Anaerobic Biogas" | "Industrial Composting"
                  )
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition"
              >
                <option value="Biochar Pyrolysis">
                  Biochar Pyrolysis (High Permanence ~100+ Years, 84% C-Purity)
                </option>
                <option value="Anaerobic Biogas">
                  Anaerobic Biogas Digestion (Renewable Biomethane, 65% C-Purity)
                </option>
                <option value="Industrial Composting">
                  Aerobic Industrial Composting (Organic Soil Amendment, 45% C-Purity)
                </option>
              </select>
            </div>

            {/* Grid of Inputs: Energy & Yield */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Energy Consumed (kWh) */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Energy Consumed (kWh)
                  </label>
                  <span className="text-slate-400">Telemetry Meter</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={energyKwh}
                    onChange={(e) => setEnergyKwh(Math.max(1, parseFloat(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-amber-500 transition"
                    required
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">
                    KWH
                  </span>
                </div>
              </div>

              {/* Finished Product Yield (kg) */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-emerald-400" />
                    Finished Product Yield (kg)
                  </label>
                  <span className="text-slate-400">Output Biochar</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={yieldKg}
                    onChange={(e) => setYieldKg(Math.max(1, parseFloat(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-amber-500 transition"
                    required
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">
                    KG
                  </span>
                </div>
              </div>
            </div>

            {/* Conversion Process Specs Banner */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Thermochemical Temperature:</span>
                <span className="text-white font-medium">550°C Continuous Feed</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Input Moisture Pre-conditioning:</span>
                <span className="text-sky-300 font-medium">{activeBatch.moisturePercentage}% Feedstock</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Fixed Carbon Retention Ratio:</span>
                <span className="text-emerald-400 font-medium">
                  {conversionMethod === "Biochar Pyrolysis" ? "84% (High Durability)" : "65%"}
                </span>
              </div>
            </div>

            {/* Submit for Audit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-emerald-600 to-teal-600 hover:from-amber-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <FileCheck className="w-4 h-4" />
              {isSubmitting ? "Compiling Telemetry & Packaging Audit..." : "Submit for dMRV Audit"}
            </button>
          </form>
        </div>

        {/* Right (5 cols): Live Carbon Removal Calculator Gauge */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Live Carbon Removal Gauge
              </h2>
              <p className="text-xs text-slate-400">
                Real-time dMRV formula calculation based on current yield & energy
              </p>
            </div>

            {/* Big Carbon Yield Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/50 via-slate-950 to-slate-900 border border-emerald-500/30 text-center space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Estimated Net Sequestration
              </span>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl sm:text-5xl font-black text-white font-mono">
                  {netEstimatedCredits}
                </span>
                <span className="text-base font-bold text-emerald-300">tCO₂e</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Yields approx. <strong className="text-emerald-400 font-mono">{netEstimatedCredits} Carbon Tokens</strong> at approval
              </p>
            </div>

            {/* Formula Breakdown */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Gross Biomass Carbon:</span>
                <span className="text-white font-mono">+{grossCarbonTonne.toFixed(3)} tCO₂e</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Process Energy Deduction:</span>
                <span className="text-amber-400 font-mono">-{energyDeductionTonne.toFixed(3)} tCO₂e</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold">
                <span className="text-white">Net Verifiable Credits:</span>
                <span className="text-emerald-400 font-mono">{netEstimatedCredits} tCO₂e</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
              <p className="font-semibold text-slate-300 mb-1">Audit Verification Standard:</p>
              Once submitted, batch #{activeBatch.id} will queue for third-party dMRV inspector sign-off before smart contract credit minting.
            </div>
          </div>

          <button
            onClick={() => setCurrentView("auditor")}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-slate-700"
          >
            Jump to Auditor Queue <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
