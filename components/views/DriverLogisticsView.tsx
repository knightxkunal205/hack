"use client";

import React, { useState } from "react";
import { useChainTracker } from "@/context/ChainTrackerContext";
import { QrWaybillModal } from "@/components/modals/QrWaybillModal";
import { WasteBatch } from "@/lib/mockData";
import {
  Truck,
  MapPin,
  Compass,
  CheckCircle2,
  Scale,
  FileCheck,
  AlertTriangle,
  Radio,
  QrCode,
  Sparkles,
  ShieldCheck,
  Navigation,
  Fuel,
  Clock
} from "lucide-react";

export function DriverLogisticsView() {
  const {
    batches,
    verifyDriverArrival,
    logDriverWeight,
    setCurrentView
  } = useChainTracker();

  // Pick an active or selectable batch for the driver
  const driverBatches = batches.filter((b) => b.status !== "minted");
  const [selectedBatchId, setSelectedBatchId] = useState<string>(
    driverBatches.find((b) => b.status === "in_transit" || b.status === "created")?.id || batches[0].id
  );

  const activeBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];

  // Scale weight form state
  const [scaleWeight, setScaleWeight] = useState<number>(
    activeBatch.driverVerifiedWeightKg || Math.round(activeBatch.declaredWeightKg * 0.985)
  );
  const [isVerifyingGps, setIsVerifyingGps] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState<WasteBatch | null>(null);

  const isGeofenceVerified = !!activeBatch.geofenceVerified;
  const isScaled = !!activeBatch.driverVerifiedWeightKg;

  // Weight variance calculation
  const deltaKg = activeBatch.declaredWeightKg - scaleWeight;
  const deltaPercent = ((deltaKg / activeBatch.declaredWeightKg) * 100).toFixed(1);
  const isVarianceNormal = Math.abs(parseFloat(deltaPercent)) <= 5.0;

  const handleVerifyGps = () => {
    setIsVerifyingGps(true);
    setTimeout(() => {
      verifyDriverArrival(activeBatch.id);
      setIsVerifyingGps(false);
    }, 1200);
  };

  const handleGenerateReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    logDriverWeight(activeBatch.id, scaleWeight);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Vehicle Status */}
      <div className="rounded-3xl border border-sky-500/20 bg-gradient-to-r from-slate-900 via-sky-950/30 to-slate-900 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-semibold border border-sky-500/20">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Active Fleet Vehicle TRK-08 • EcoHaul Logistics
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Driver & Logistics Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Simulate GPS geofence proximity verification and calibrated scale tare logging before facility gate check-in.
          </p>
        </div>

        {/* Vehicle Telemetry Snapshot */}
        <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl">
          <div className="flex items-center gap-2 text-xs">
            <Compass className="w-4 h-4 text-sky-400" />
            <div>
              <span className="text-[10px] text-slate-400 block">GPS Coordinates</span>
              <span className="font-mono text-white font-semibold">28.5562° N, 77.0999° E</span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="flex items-center gap-2 text-xs">
            <Navigation className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-[10px] text-slate-400 block">Distance to Gate</span>
              <span className="font-semibold text-emerald-400">38 meters</span>
            </div>
          </div>
        </div>
      </div>

      {/* Batch Selector Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-semibold whitespace-nowrap">Select Active Run:</span>
        {driverBatches.map((b) => (
          <button
            key={b.id}
            onClick={() => {
              setSelectedBatchId(b.id);
              setScaleWeight(b.driverVerifiedWeightKg || Math.round(b.declaredWeightKg * 0.985));
            }}
            className={`px-3 py-2 rounded-xl border font-medium whitespace-nowrap transition flex items-center gap-2 ${
              b.id === selectedBatchId
                ? "bg-sky-600 text-white border-sky-500 shadow-md shadow-sky-950/50"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            <span>Batch #{b.id}</span>
            <span className="text-[10px] opacity-80 font-normal">({b.wasteType} • {b.declaredWeightKg}kg)</span>
          </button>
        ))}
      </div>

      {/* Main Grid: Map & Geofence (Left) & Verified Scale / Receipt (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left (7 cols): Large Map Placeholder with Route and 50m Geofence Circle */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Navigation className="w-4 h-4 text-sky-400" />
                GPS Route & Geofence Boundary Map
              </h2>
              <p className="text-xs text-slate-400">
                Facility drop-off perimeter with calibrated 50-meter geofence
              </p>
            </div>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                isGeofenceVerified
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
              }`}
            >
              {isGeofenceVerified ? "✓ Within 50m Geofence" : "Proximity Detection Active"}
            </span>
          </div>

          {/* Map Graphic Canvas */}
          <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-4 flex flex-col justify-between">
            {/* GIS Topographic grid backdrop */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

            {/* Dark GIS Roads / Contour Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <path
                d="M 20 80 Q 150 40, 240 160 T 480 200"
                fill="none"
                stroke="#334155"
                strokeWidth="4"
              />
              <path
                d="M 60 260 C 180 220, 280 280, 420 180"
                fill="none"
                stroke="#334155"
                strokeWidth="3"
              />
              {/* Active Route Dash */}
              <path
                d="M 60 90 L 190 140 L 320 180 L 410 160"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="4"
                strokeDasharray="8 4"
                className="animate-pulse"
              />
            </svg>

            {/* 50-Meter Geofence Circle Overlay */}
            <div className="absolute right-12 sm:right-20 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
              {/* Radar Rings */}
              <div className="absolute w-44 h-44 rounded-full border border-emerald-400/30 bg-emerald-500/5 animate-radar-ping" />
              <div className="w-36 h-36 rounded-full border-2 border-dashed border-emerald-400/60 bg-emerald-500/10 flex items-center justify-center">
                <span className="text-[10px] font-mono text-emerald-300 font-bold bg-slate-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  50m Geofence
                </span>
              </div>
            </div>

            {/* Destination Facility Marker */}
            <div className="absolute right-20 sm:right-28 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-slate-900/90 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-xs z-10 shadow-lg">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="font-bold text-white block text-[11px]">BioChar Hub #1</span>
                <span className="text-[9px] text-emerald-400 font-mono">Dest Gate #A</span>
              </div>
            </div>

            {/* Vehicle TRK-08 Marker near / inside geofence */}
            <div className="absolute right-36 sm:right-48 top-[58%] flex items-center gap-2 bg-sky-600 text-white px-2.5 py-1 rounded-xl text-xs z-10 shadow-xl shadow-sky-950/60 animate-bounce">
              <Truck className="w-3.5 h-3.5" />
              <span className="font-bold text-[11px]">TRK-08 (At Facility)</span>
            </div>

            {/* Origin Marker */}
            <div className="relative z-10 flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-xl w-max text-xs">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <div>
                <span className="text-slate-400 text-[10px] block">Pickup Origin</span>
                <span className="font-medium text-white">{activeBatch.supplierName}</span>
              </div>
            </div>

            {/* Live GPS Telemetry Overlay Footer */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-sky-400" /> Current Distance:{" "}
                <strong className="text-emerald-400 font-mono">38.4 meters to gate</strong>
              </span>
              <span className="font-mono text-slate-300">
                Geofence Radius: <strong>50.0m</strong>
              </span>
            </div>
          </div>

          {/* Prominent "Verify Arrival" Button */}
          <div className="pt-2">
            {!isGeofenceVerified ? (
              <button
                onClick={handleVerifyGps}
                disabled={isVerifyingGps}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 via-emerald-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-sky-950/50 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                {isVerifyingGps
                  ? "Pinging GPS Geofence Proximity..."
                  : "Verify Arrival (Check 50m Geofence)"}
              </button>
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Arrival Verified: Vehicle within 50m geofence radius.</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {activeBatch.geofenceTimestamp || "Just now"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right (5 cols): Verified Scale Weight & Generate Digital Receipt */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                Calibrated Scale Weigh-In
              </h2>
              <p className="text-xs text-slate-400">
                Log certified weighbridge reading before batch unloading
              </p>
            </div>

            {/* Declared vs Verified Reference Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Declared Generator Weight:</span>
                <span className="font-bold text-white">{activeBatch.declaredWeightKg} kg</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Moisture Index:</span>
                <span className="text-sky-300 font-semibold">{activeBatch.moisturePercentage}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Tare Weight Allowance:</span>
                <span className="text-slate-400">±5% Tolerated Moisture Loss</span>
              </div>
            </div>

            {/* Scale Form */}
            <form onSubmit={handleGenerateReceipt} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Verified Scale Weight (kg)</span>
                  <span className="text-[10px] text-slate-400">Digital Scale Reading</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={scaleWeight}
                    onChange={(e) => setScaleWeight(parseFloat(e.target.value) || 0)}
                    disabled={!isGeofenceVerified}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-sky-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    KG
                  </span>
                </div>
                {!isGeofenceVerified && (
                  <p className="text-[11px] text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Verify 50m geofence arrival above to unlock scale logging.
                  </p>
                )}
              </div>

              {/* Weight Variance Indicator */}
              <div
                className={`p-3 rounded-xl border text-xs space-y-1 ${
                  isVarianceNormal
                    ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-200"
                    : "bg-amber-950/30 border-amber-500/30 text-amber-200"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Moisture & Transit Delta:</span>
                  <span className="font-mono font-bold">
                    {deltaKg >= 0 ? `-${deltaKg.toFixed(1)} kg` : `+${Math.abs(deltaKg).toFixed(1)} kg`} ({deltaPercent}%)
                  </span>
                </div>
                <p className="text-[10px] opacity-80">
                  {isVarianceNormal
                    ? "✓ Variance within standard biogenic moisture evaporation tolerance."
                    : "⚠ Variance exceeds 5%. Secondary audit flag will be attached."}
                </p>
              </div>

              {/* Submit / Generate Digital Receipt Button */}
              <button
                type="submit"
                disabled={!isGeofenceVerified}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileCheck className="w-4 h-4" />
                Generate Digital Receipt & Sign Waybill
              </button>
            </form>
          </div>

          {/* Receipt Status & Waybill Viewer Button */}
          {isScaled && (
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Digital Waybill Active
                </div>
                <span className="font-mono text-[10px] text-slate-400 truncate block max-w-[180px]">
                  Hash: {activeBatch.waybillHash || "0x8b3a7...d419e"}
                </span>
              </div>
              <button
                onClick={() => setShowReceiptModal(activeBatch)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition"
              >
                <QrCode className="w-3.5 h-3.5" />
                View Receipt
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Waybill Modal */}
      {showReceiptModal && (
        <QrWaybillModal
          batch={showReceiptModal}
          onClose={() => setShowReceiptModal(null)}
        />
      )}
    </div>
  );
}
