"use client";

import React from "react";
import { WasteBatch } from "@/lib/mockData";
import { X, QrCode, ShieldCheck, Copy, Check, MapPin, Scale } from "lucide-react";

interface QrWaybillModalProps {
  batch: WasteBatch | null;
  onClose: () => void;
}

export function QrWaybillModal({ batch, onClose }: QrWaybillModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!batch) return null;

  const waybillPayload = JSON.stringify({
    batchId: batch.id,
    type: batch.wasteType,
    declaredKg: batch.declaredWeightKg,
    driverScaleKg: batch.driverVerifiedWeightKg || "pending",
    geofenceVerified: batch.geofenceVerified || false,
    hash: batch.waybillHash || "0x98b41...f2e0",
    dMRV_Registry: "ISO-14064-2",
  }, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(waybillPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Digital Cryptographic Waybill</h3>
              <p className="text-xs text-slate-400">Batch #{batch.id} • dMRV Provenance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* QR Code Presentation */}
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-inner max-w-[240px] mx-auto border-4 border-emerald-500/20">
            {/* High visual fidelity QR Code SVG pattern */}
            <svg viewBox="0 0 100 100" className="w-48 h-48 text-slate-900" fill="currentColor">
              {/* Corner position markers */}
              <rect x="5" y="5" width="28" height="28" fill="currentColor" rx="4" />
              <rect x="9" y="9" width="20" height="20" fill="white" rx="2" />
              <rect x="13" y="13" width="12" height="12" fill="currentColor" rx="1" />

              <rect x="67" y="5" width="28" height="28" fill="currentColor" rx="4" />
              <rect x="71" y="9" width="20" height="20" fill="white" rx="2" />
              <rect x="75" y="13" width="12" height="12" fill="currentColor" rx="1" />

              <rect x="5" y="67" width="28" height="28" fill="currentColor" rx="4" />
              <rect x="9" y="71" width="20" height="20" fill="white" rx="2" />
              <rect x="13" y="75" width="12" height="12" fill="currentColor" rx="1" />

              {/* Data matrix dots */}
              <rect x="38" y="8" width="5" height="5" />
              <rect x="48" y="8" width="5" height="5" />
              <rect x="43" y="18" width="5" height="5" />
              <rect x="53" y="18" width="5" height="5" />
              <rect x="38" y="28" width="5" height="5" />
              <rect x="48" y="28" width="5" height="5" />

              <rect x="8" y="38" width="5" height="5" />
              <rect x="18" y="43" width="5" height="5" />
              <rect x="28" y="38" width="5" height="5" />
              
              <rect x="38" y="38" width="7" height="7" fill="#059669" />
              <rect x="48" y="48" width="7" height="7" fill="#059669" />
              <rect x="38" y="58" width="7" height="7" fill="#059669" />
              <rect x="58" y="38" width="7" height="7" fill="#059669" />

              <rect x="68" y="38" width="5" height="5" />
              <rect x="78" y="43" width="5" height="5" />
              <rect x="88" y="38" width="5" height="5" />
              <rect x="73" y="53" width="5" height="5" />
              <rect x="83" y="58" width="5" height="5" />

              <rect x="8" y="58" width="5" height="5" />
              <rect x="23" y="53" width="5" height="5" />

              <rect x="38" y="72" width="5" height="5" />
              <rect x="48" y="77" width="5" height="5" />
              <rect x="43" y="87" width="5" height="5" />
              <rect x="58" y="72" width="5" height="5" />
              <rect x="68" y="77" width="5" height="5" />
              <rect x="83" y="72" width="5" height="5" />
              <rect x="78" y="87" width="5" height="5" />
            </svg>
            <p className="mt-2 text-[11px] font-mono text-slate-600 font-medium">SCAN FOR DIGITAL SIGNATURE</p>
          </div>

          {/* Metadata Cards */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <span className="text-slate-400">Declared Generator Weight:</span>
              <p className="font-semibold text-white flex items-center gap-1.5 text-sm">
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                {batch.declaredWeightKg} kg
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <span className="text-slate-400">Driver Scale Weight:</span>
              <p className="font-semibold text-white flex items-center gap-1.5 text-sm">
                <Scale className="w-3.5 h-3.5 text-sky-400" />
                {batch.driverVerifiedWeightKg ? `${batch.driverVerifiedWeightKg} kg` : "Pending Scaling"}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1 col-span-2">
              <span className="text-slate-400">Origin Facility:</span>
              <p className="font-medium text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                {batch.supplierName} ({batch.supplierLocation})
              </p>
            </div>
          </div>

          {/* Cryptographic Proof Hash */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Waybill Hash (SHA-256)</p>
              <p className="font-mono text-xs text-emerald-400 truncate">
                {batch.waybillHash || "0x98b417e29aa0418c3919b"}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 border border-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
            <ShieldCheck className="w-4 h-4" />
            Tamper-Evident Chain Record
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition"
          >
            Close Waybill
          </button>
        </div>
      </div>
    </div>
  );
}
