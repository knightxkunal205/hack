"use client";

import React, { useState } from "react";
import { WasteBatch } from "@/lib/mockData";
import { useChainTracker } from "@/context/ChainTrackerContext";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Scale,
  Zap,
  Leaf,
  MapPin,
  Calendar,
  Sparkles,
  Award,
  FileCheck,
  ExternalLink,
  ChevronRight,
  Flame,
  AlertCircle
} from "lucide-react";

interface AuditDetailsModalProps {
  batch: WasteBatch | null;
  onClose: () => void;
}

export function AuditDetailsModal({ batch, onClose }: AuditDetailsModalProps) {
  const { approveAndMintCredit } = useChainTracker();
  const [isMinting, setIsMinting] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "generator" | "logistics" | "recycler">("all");

  if (!batch) return null;

  const isMinted = batch.status === "minted";
  const weightDeltaPercent = batch.driverVerifiedWeightKg
    ? Math.abs(((batch.declaredWeightKg - batch.driverVerifiedWeightKg) / batch.declaredWeightKg) * 100).toFixed(1)
    : "0.0";

  const handleApproveAndMint = () => {
    setIsMinting(true);
    setTimeout(() => {
      approveAndMintCredit(batch.id);
      setIsMinting(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white">dMRV Chain of Custody Audit</h3>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${
                  isMinted 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                    : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                }`}>
                  {isMinted ? "Verified & Minted" : "Pending Auditor Sign-Off"}
                </span>
              </div>
              <p className="text-xs text-slate-400">Batch #{batch.id} • {batch.wasteType} • Registered: {batch.timestamp}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Stage Tabs */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-950/40 border-b border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === "all" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            Full Provenance Chain (3-Tier)
          </button>
          <button
            onClick={() => setActiveTab("generator")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === "generator" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            1. Origin & Bin Photo
          </button>
          <button
            onClick={() => setActiveTab("logistics")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === "logistics" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            2. Logistics & Scale Weight
          </button>
          <button
            onClick={() => setActiveTab("recycler")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === "recycler" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            3. Pyrolysis & Energy Telemetry
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300">
          {/* Carbon Sequestration Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Verified Sequestration Potential
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-white">
                  {batch.calculatedCarbonTonne || 0.088}
                </span>
                <span className="text-sm font-semibold text-emerald-300">Tonnes CO₂e</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Carbon Removal Index: 82% C-Purity Biochar @ 100-Year Soil Durability
              </p>
            </div>
            <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6">
              <span className="text-xs text-slate-400 block">Estimated Market Value:</span>
              <span className="text-xl font-bold text-emerald-400">
                ${((batch.calculatedCarbonTonne || 0.088) * 80).toFixed(2)} USD
              </span>
              <span className="text-[11px] text-slate-500 block">(@ $80.00 / Tonne)</span>
            </div>
          </div>

          {/* Tier 1: Generator & Original Bin Photo */}
          {(activeTab === "all" || activeTab === "generator") && (
            <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">1</span>
                  Generator Declaration & Bin Image
                </div>
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Pre-Shipment Verified
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Image Preview */}
                <div className="space-y-2">
                  <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 group aspect-video">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={batch.binPhotoUrl}
                      alt="Original Waste Bin"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                      <span className="text-[11px] text-slate-200 font-mono">
                        IMAGE HASH: 0x5a18c...7b2
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <FileCheck className="w-3 h-3 text-emerald-400" /> Tamper-evident EXIF GPS match verified
                  </span>
                </div>

                {/* Generator Metadata */}
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="text-slate-400 block">Supplier Name:</span>
                    <span className="font-semibold text-white">{batch.supplierName}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="text-slate-400 block">Waste Classification:</span>
                    <span className="font-semibold text-emerald-400">{batch.wasteType}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                      <span className="text-slate-400 block">Declared Weight:</span>
                      <span className="font-semibold text-white">{batch.declaredWeightKg} kg</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                      <span className="text-slate-400 block">Moisture Content:</span>
                      <span className="font-semibold text-amber-300">{batch.moisturePercentage}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tier 2: Driver Logistics & Geofence Verification */}
          {(activeTab === "all" || activeTab === "logistics") && (
            <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-bold">2</span>
                  Logistics & Geofence GPS Audit
                </div>
                <span className="text-xs text-sky-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 50m Geofence Lock Passed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block">Driver & Haul Fleet:</span>
                  <span className="font-medium text-white block mt-0.5">
                    {batch.driverName || "Rajesh Sharma (EcoHaul TRK-08)"}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block">Verified Scale Weight:</span>
                  <span className="font-semibold text-white text-sm block mt-0.5">
                    {batch.driverVerifiedWeightKg || batch.declaredWeightKg} kg
                  </span>
                  <span className="text-[10px] text-emerald-400">
                    Δ {weightDeltaPercent}% variance (Moisture evap)
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block">GPS Geofence Status:</span>
                  <span className="font-semibold text-emerald-400 block mt-0.5">
                    Within 50m Radius
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Timestamp: {batch.geofenceTimestamp || "Verified"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tier 3: Recycler Pyrolysis & Energy Consumption */}
          {(activeTab === "all" || activeTab === "recycler") && (
            <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">3</span>
                  Conversion Logs & Thermochemical Yield
                </div>
                <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> Pyrolysis Run #PYR-942
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block">Conversion Process:</span>
                  <span className="font-semibold text-white block mt-0.5">
                    {batch.conversionMethod || "Biochar Pyrolysis"}
                  </span>
                  <span className="text-[10px] text-slate-400">550°C Anoxic Chamber</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block">Thermal / Electric Energy:</span>
                  <span className="font-semibold text-amber-400 text-sm block mt-0.5">
                    {batch.energyConsumedKwh || 38.5} kWh
                  </span>
                  <span className="text-[10px] text-slate-400">Deducted from gross yield</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block">Biochar Yield (Net):</span>
                  <span className="font-semibold text-emerald-400 text-sm block mt-0.5">
                    {batch.yieldKg || 35.5} kg
                  </span>
                  <span className="text-[10px] text-emerald-500 font-medium">82% Fixed Elemental Carbon</span>
                </div>
              </div>

              {/* Formula explanation */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p>
                  <strong className="text-slate-200">dMRV Calculation Rule:</strong> Net Sequestration = (Biochar Yield × Carbon Fraction × 3.67 CO₂/C) − (Energy Consumption × 0.35 kg CO₂/kWh). Certified under Puro.earth & Verra VM0044 methodology.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
          >
            Close
          </button>

          {!isMinted ? (
            <button
              onClick={handleApproveAndMint}
              disabled={isMinting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isMinting ? "Simulating On-Chain Minting..." : "Approve & Mint Carbon Credits"}
            </button>
          ) : (
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              On-Chain Token Active: {batch.tokenCertificateId || "CRT-2026-0094"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
