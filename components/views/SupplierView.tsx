"use client";

import React, { useState } from "react";
import { useChainTracker } from "@/context/ChainTrackerContext";
import { WasteType, WasteBatch } from "@/lib/mockData";
import { QrWaybillModal } from "@/components/modals/QrWaybillModal";
import {
  Leaf,
  PlusCircle,
  QrCode,
  MapPin,
  Scale,
  Droplets,
  Upload,
  CheckCircle2,
  Clock,
  Truck,
  Award,
  Coins,
  ChevronRight,
  Sparkles,
  Image as ImageIcon
} from "lucide-react";

export function SupplierView() {
  const { batches, addWasteBatch, setCurrentView } = useChainTracker();

  // Form State
  const [wasteType, setWasteType] = useState<WasteType>("Food Waste");
  const [weightKg, setWeightKg] = useState<number>(150);
  const [moisture, setMoisture] = useState<number>(38);
  const [photoUrl, setPhotoUrl] = useState<string>(
    "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=600&q=80"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBatchForQr, setSelectedBatchForQr] = useState<WasteBatch | null>(null);

  // Filter batches for this supplier persona
  const supplierBatches = batches.filter(
    (b) => b.supplierName.includes("Hotel Green Leaf") || b.supplierName.includes("Eco Resort") || b.declaredWeightKg > 0
  );

  const sampleImages = [
    { label: "Kitchen Food Scraps", url: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=600&q=80" },
    { label: "Crop Residue Straw", url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80" },
    { label: "Brewer Mash & Grain", url: "https://images.unsplash.com/photo-1584225064785-c62a8b43d148?auto=format&fit=crop&w=600&q=80" },
    { label: "Timber Mill Sawdust", url: "https://images.unsplash.com/photo-1520116468418-887952dc64ec?auto=format&fit=crop&w=600&q=80" },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      addWasteBatch({
        wasteType,
        weightKg,
        moisture,
        photoUrl,
        supplierName: "Hotel Green Leaf (Eco Resort)",
        location: "Aerocity Sector 4, Bayfront",
      });
      setIsSubmitting(false);
      // Reset to defaults
      setWeightKg(120);
    }, 600);
  };

  // Active shipment for tracking section
  const activeShipment = batches.find((b) => b.status === "in_transit" || b.status === "created") || batches[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Supplier Header */}
      <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <Leaf className="w-3.5 h-3.5" />
            Verified Generator Node #GN-409
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Waste Supplier Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Logged in as <strong className="text-white">Hotel Green Leaf (Eco Resort)</strong>. Register segregated biogenic batches, track real-time logistics, and claim verified carbon offset rewards.
          </p>
        </div>

        {/* Supplier Rewards & Past Deliveries Summary */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-shrink-0">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[130px]">
            <span className="text-[11px] text-slate-400 block font-medium">Past Deliveries</span>
            <span className="text-xl sm:text-2xl font-black text-white block mt-0.5">45.6 t</span>
            <span className="text-[10px] text-emerald-400 font-semibold">98 Batches</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 text-center min-w-[130px]">
            <span className="text-[11px] text-emerald-400 block font-medium flex items-center justify-center gap-1">
              <Coins className="w-3 h-3" /> Earned Rewards
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-300 block mt-0.5">1,240</span>
            <span className="text-[10px] text-slate-400">Green dMRV Points</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Add Waste Form (Left) & Delivery Tracking (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left (7 cols): Add New Waste Form */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                Register New Waste Batch
              </h2>
              <p className="text-xs text-slate-400">
                Log biogenic waste specs to dispatch an IoT-tracked pickup
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              Auto dMRV Stamped
            </span>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            {/* Waste Type Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Waste Classification Type</span>
                <span className="text-[11px] text-slate-400">Select feedstock</span>
              </label>
              <select
                value={wasteType}
                onChange={(e) => setWasteType(e.target.value as WasteType)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              >
                <option value="Food Waste">Food Waste (Commercial / Kitchen Scraps)</option>
                <option value="Crop Residue">Crop Residue (Stubble, Straw, Husk)</option>
                <option value="Spent Brewery Grain">Spent Brewery Grain (Brewery Byproduct)</option>
                <option value="Forestry Byproducts">Forestry Byproducts (Sawdust, Woodchips)</option>
                <option value="Municipal Organic">Municipal Organic (Segregated Green Waste)</option>
              </select>
            </div>

            {/* Weight in kg */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-emerald-400" />
                  Estimated Weight (kg)
                </label>
                <span className="text-slate-400">Will be verified by driver scale</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="10"
                  max="5000"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Math.max(1, parseInt(e.target.value) || 0))}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500 transition"
                  required
                />
                <div className="flex gap-1.5">
                  {[50, 120, 250, 500].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setWeightKg(preset)}
                      className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition ${
                        weightKg === preset
                          ? "bg-emerald-600 text-white border-emerald-500"
                          : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                      }`}
                    >
                      {preset}kg
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Moisture Level (Slider) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-sky-400" />
                  Feedstock Moisture Level:{" "}
                  <span className="text-sky-300 font-bold ml-1">{moisture}%</span>
                </label>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    moisture <= 45
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {moisture <= 45 ? "Optimal for Pyrolysis" : "Requires Pre-Drying"}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="85"
                value={moisture}
                onChange={(e) => setMoisture(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>10% (Dry Biomass)</span>
                <span>45% (Pyrolysis Threshold)</span>
                <span>85% (High Moisture Slurry)</span>
              </div>
            </div>

            {/* Upload Bin Photo (Drag & Drop placeholder with quick sample switchers) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Upload Bin Photo (Visual dMRV Proof)</span>
                <span className="text-[11px] text-slate-400">Required for Auditor Verification</span>
              </label>

              <div className="relative border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-4 text-center transition bg-slate-950/60 group">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Photo Preview Thumbnail */}
                  <div className="relative w-32 h-24 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoUrl}
                      alt="Bin preview"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-1 right-1 bg-black/60 rounded p-0.5 text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  </div>

                  <div className="flex-1 text-left space-y-2">
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-white">
                        Photo Attached & Ready
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Drag and drop your bin photo here, or select one of the pre-loaded sample feeds:
                    </p>
                    {/* Sample image quick-select buttons */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {sampleImages.map((sample) => (
                        <button
                          key={sample.label}
                          type="button"
                          onClick={() => setPhotoUrl(sample.url)}
                          className={`text-[10px] px-2 py-1 rounded-md border transition ${
                            photoUrl === sample.url
                              ? "bg-emerald-600 text-white border-emerald-500 font-semibold"
                              : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                          }`}
                        >
                          {sample.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isSubmitting ? "Registering On-Chain Batch..." : "Register Batch & Dispatch Pickup"}
            </button>
          </form>
        </div>

        {/* Right (5 cols): Active Delivery Tracking & QR Section */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Delivery Tracking Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Truck className="w-4 h-4 text-sky-400" />
                  Active Shipment Telemetry
                </h3>
                <p className="text-xs text-slate-400">Batch #{activeShipment.id}</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                {activeShipment.status === "in_transit" ? "In Transit (En Route)" : "Pickup Dispatched"}
              </span>
            </div>

            {/* Map Placeholder */}
            <div className="relative h-44 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-3 flex flex-col justify-between">
              {/* Simulated Map Visuals */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* SVG Route Line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line
                  x1="20%"
                  y1="35%"
                  x2="80%"
                  y2="75%"
                  stroke="#38bdf8"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />
              </svg>

              {/* Waypoint 1: Generator */}
              <div className="relative z-10 flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-2.5 py-1 rounded-lg w-max text-xs">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-white font-medium">Hotel Green Leaf (Origin)</span>
              </div>

              {/* Vehicle in Transit marker */}
              <div className="relative z-10 self-center bg-sky-500 text-slate-950 font-bold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 shadow-lg shadow-sky-500/40">
                <Truck className="w-3 h-3" /> TRK-08 (ETA 18 min)
              </div>

              {/* Waypoint 2: BioChar Facility */}
              <div className="relative z-10 self-end flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-2.5 py-1 rounded-lg w-max text-xs">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-white font-medium">BioChar Facility Hub #1</span>
              </div>
            </div>

            {/* Dummy QR Code Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white text-slate-900 flex-shrink-0">
                  <QrCode className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Digital Manifest QR</h4>
                  <p className="text-[11px] text-slate-400">
                    Scan by Driver at pickup for handoff proof
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedBatchForQr(activeShipment)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition"
              >
                Inspect QR
              </button>
            </div>
          </div>

          {/* Past Deliveries List */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-3 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recent Generator Batches
            </h3>
            <div className="space-y-2">
              {supplierBatches.slice(0, 3).map((b) => (
                <div
                  key={b.id}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-white flex items-center gap-2">
                      <span>#{b.id}</span>
                      <span className="text-[11px] text-slate-400 font-normal">({b.wasteType})</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{b.declaredWeightKg} kg • {b.timestamp}</span>
                  </div>
                  <button
                    onClick={() => setSelectedBatchForQr(b)}
                    className="text-slate-400 hover:text-emerald-400 transition"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* QR Waybill Modal */}
      {selectedBatchForQr && (
        <QrWaybillModal
          batch={selectedBatchForQr}
          onClose={() => setSelectedBatchForQr(null)}
        />
      )}
    </div>
  );
}
