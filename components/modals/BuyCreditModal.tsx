"use client";

import React, { useState } from "react";
import { CarbonToken } from "@/lib/mockData";
import { useChainTracker } from "@/context/ChainTrackerContext";
import { X, Coins, ShieldCheck, CheckCircle2, Award, Sparkles, Building, Info } from "lucide-react";

interface BuyCreditModalProps {
  token: CarbonToken | null;
  onClose: () => void;
}

export function BuyCreditModal({ token, onClose }: BuyCreditModalProps) {
  const { buyCarbonCredit, walletBalanceUSD } = useChainTracker();
  const [tonnes, setTonnes] = useState<number>(1);
  const [retireImmediately, setRetireImmediately] = useState<boolean>(true);
  const [beneficiary, setBeneficiary] = useState<string>("Hackathon Demo Corp");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!token) return null;

  const totalCost = tonnes * token.pricePerTonne;
  const maxAvailable = token.availableTonnes;
  const canAfford = walletBalanceUSD >= totalCost;

  const handleConfirmPurchase = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const ok = buyCarbonCredit(token.id, tonnes);
      setIsProcessing(false);
      if (ok) {
        onClose();
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Purchase & Retire Carbon Credits</h3>
              <p className="text-xs text-slate-400">{token.projectName} • {token.vintage}</p>
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
        <div className="p-6 space-y-5">
          {/* Price & Registry Banner */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Current Market Spot Price</span>
              <span className="text-2xl font-black text-emerald-400">${token.pricePerTonne}.00</span>
              <span className="text-xs text-slate-400 ml-1">/ Tonne CO₂e</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Available Inventory</span>
              <span className="text-base font-semibold text-white">{token.availableTonnes} Tonnes</span>
              <span className="text-[11px] text-emerald-500 block">dMRV Verified</span>
            </div>
          </div>

          {/* Amount selection */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-300">Quantity to Purchase (Tonnes)</label>
              <span className="text-slate-400">Max: {maxAvailable} t</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0.1"
                max={maxAvailable}
                step="0.1"
                value={tonnes}
                onChange={(e) => setTonnes(Math.min(maxAvailable, Math.max(0.1, parseFloat(e.target.value) || 0.1)))}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-semibold focus:outline-none focus:border-emerald-500 transition"
              />
              <div className="flex gap-1.5">
                {[0.5, 1.0, 2.0].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setTonnes(Math.min(maxAvailable, preset))}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border transition ${
                      tonnes === preset
                        ? "bg-emerald-600 text-white border-emerald-500"
                        : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                    }`}
                  >
                    {preset}t
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Beneficiary Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              Retirement Beneficiary / Organization
            </label>
            <input
              type="text"
              value={beneficiary}
              onChange={(e) => setBeneficiary(e.target.value)}
              placeholder="e.g. Acme Corp Sustainability"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Retirement Option */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={retireImmediately}
                onChange={(e) => setRetireImmediately(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-900 border-slate-700"
              />
              <div>
                <span className="text-xs font-semibold text-white block">Immediately Retire for Scope-3 ESG Compliance</span>
                <span className="text-[11px] text-slate-400 block">Permanently locks token in dMRV registry burn address</span>
              </div>
            </label>
          </div>

          {/* Total & Wallet Balance breakdown */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal ({tonnes} t × ${token.pricePerTonne})</span>
              <span className="text-white">${totalCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>dMRV Registry Gas Fee (Simulated)</span>
              <span className="text-emerald-400">$0.00 (Subsidized)</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
              <span className="font-semibold text-white text-sm">Total Due:</span>
              <span className="text-xl font-bold text-emerald-400">${totalCost.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 pt-1">
              <span>Your Demo Wallet Balance:</span>
              <span className={canAfford ? "text-slate-300" : "text-rose-400 font-semibold"}>
                ${walletBalanceUSD.toFixed(2)} USD
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmPurchase}
            disabled={!canAfford || isProcessing || tonnes <= 0}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {isProcessing ? "Finalizing Transaction..." : `Confirm & Retire ${tonnes} Tonnes`}
          </button>
        </div>
      </div>
    </div>
  );
}
