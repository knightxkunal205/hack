"use client";

import React, { useState } from "react";
import { useChainTracker } from "@/context/ChainTrackerContext";
import { WasteBatch, CarbonToken } from "@/lib/mockData";
import { AuditDetailsModal } from "@/components/modals/AuditDetailsModal";
import { BuyCreditModal } from "@/components/modals/BuyCreditModal";
import {
  ShieldCheck,
  Coins,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  Award,
  Wallet,
  ShoppingBag,
  FileCheck,
  AlertCircle,
  Eye,
  ArrowRight,
  Flame,
  Scale
} from "lucide-react";

export function AuditorMarketplaceView() {
  const {
    batches,
    carbonTokens,
    walletBalanceUSD,
    purchasedCertificates,
    approveAndMintCredit,
    totalCarbonSavedTonnes
  } = useChainTracker();

  // Audit queue: pending_audit or minted or scaled
  const auditBatches = batches.filter((b) => b.status === "pending_audit" || b.status === "minted");
  const pendingCount = batches.filter((b) => b.status === "pending_audit").length;

  // Selected modals state
  const [selectedBatchForAudit, setSelectedBatchForAudit] = useState<WasteBatch | null>(null);
  const [selectedTokenForBuy, setSelectedTokenForBuy] = useState<CarbonToken | null>(null);

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="rounded-3xl border border-teal-500/20 bg-gradient-to-r from-slate-900 via-teal-950/30 to-slate-900 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold border border-teal-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Independent dMRV Auditor & Carbon Exchange
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Auditor Verification & Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Inspect cryptographic chain of custody (Bin photo, GPS geofence, scale logs, pyrolysis yield), sign off to mint ERC-1155 carbon removal credits, and trade on the spot market ($80/t).
          </p>
        </div>

        {/* Auditor Snapshot */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-shrink-0">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[130px]">
            <span className="text-[11px] text-slate-400 block font-medium">Pending Audit</span>
            <span className="text-xl sm:text-2xl font-black text-amber-400 block mt-0.5">{pendingCount}</span>
            <span className="text-[10px] text-slate-400">Batches Queue</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 text-center min-w-[130px]">
            <span className="text-[11px] text-emerald-400 block font-medium">Carbon Spot Price</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-300 block mt-0.5">$80.00</span>
            <span className="text-[10px] text-slate-400">USD / Tonne CO₂e</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: Checker (Auditor) Verification Queue */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              dMRV Audit Queue: Pending Chain of Custody Verification
            </h2>
            <p className="text-xs text-slate-400">
              Click any batch to inspect 3-tier provenance and execute on-chain minting
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 w-max">
            {pendingCount} Awaiting Verification
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3 font-semibold">Batch ID</th>
                <th className="py-3 px-3 font-semibold">Generator (Origin)</th>
                <th className="py-3 px-3 font-semibold">Waste Category</th>
                <th className="py-3 px-3 font-semibold text-right">Scale Tare (kg)</th>
                <th className="py-3 px-3 font-semibold text-right">Biochar Yield</th>
                <th className="py-3 px-3 font-semibold text-right">Net CO₂e</th>
                <th className="py-3 px-3 font-semibold text-center">Audit Status</th>
                <th className="py-3 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {auditBatches.map((batch) => {
                const isPending = batch.status === "pending_audit";
                const isMinted = batch.status === "minted";

                return (
                  <tr key={batch.id} className="hover:bg-slate-800/40 transition">
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
                    <td className="py-3.5 px-3 text-right font-semibold text-white">
                      {batch.driverVerifiedWeightKg || batch.declaredWeightKg} kg
                    </td>
                    <td className="py-3.5 px-3 text-right font-medium text-amber-300">
                      {batch.yieldKg || 35.5} kg
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-400">
                      {batch.calculatedCarbonTonne || 0.088} tCO₂e
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                          isMinted
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse"
                        }`}
                      >
                        {isMinted ? "✓ Minted On-Chain" : "● Ready to Audit"}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedBatchForAudit(batch)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Inspect Details
                        </button>

                        {isPending && (
                          <button
                            onClick={() => approveAndMintCredit(batch.id)}
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition shadow-sm flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" />
                            Approve & Mint
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: Carbon Credit Wallet & Marketplace Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              Carbon Credit Marketplace (Approved Tokens)
            </h2>
            <p className="text-xs text-slate-400">
              Verified high-permanence biochar removal tokens available for corporate Scope-3 retirement
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-xs text-slate-300 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>Wallet Available:</span>
              <strong className="text-emerald-400 font-mono">${walletBalanceUSD.toLocaleString()} USD</strong>
            </div>
          </div>
        </div>

        {/* Marketplace Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carbonTokens.map((token) => (
            <div
              key={token.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition shadow-xl group"
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {token.id}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    Vintage: {token.vintage}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                    {token.projectName}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {token.supplierName} • {token.location}
                  </p>
                </div>

                {/* Method and Durability */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Removal Method:</span>
                    <span className="text-white font-medium">{token.method}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Durability Permanence:</span>
                    <span className="text-emerald-400 font-semibold">{token.permanenceYears}+ Years</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Registry ID:</span>
                    <span className="text-slate-300 font-mono">{token.registryId}</span>
                  </div>
                </div>

                {/* Co-Benefits Tags */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Co-Benefits:</span>
                  <div className="flex flex-wrap gap-1">
                    {token.coBenefits.map((benefit) => (
                      <span
                        key={benefit}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Buy Action */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Spot Price:</span>
                  <span className="text-xl font-black text-emerald-400">${token.pricePerTonne}.00</span>
                  <span className="text-[10px] text-slate-400"> / tonne</span>
                </div>

                <button
                  onClick={() => setSelectedTokenForBuy(token)}
                  disabled={token.availableTonnes <= 0}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950/50 flex items-center gap-1.5 transition disabled:opacity-40"
                >
                  <Coins className="w-3.5 h-3.5" />
                  {token.availableTonnes > 0 ? "Buy Credit" : "Sold Out"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: Retired Certificates Wallet Section */}
      {purchasedCertificates.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            Your Corporate Retirement Certificates (Scope-3 Compliance)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {purchasedCertificates.map((cert) => (
              <div
                key={cert.id}
                className="p-4 rounded-xl bg-slate-950 border border-emerald-500/20 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-400">{cert.id}</span>
                    <span className="text-[10px] text-slate-400">{cert.retiredAt}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white mt-1">{cert.tokenProject}</h4>
                  <p className="text-xs text-slate-400">Beneficiary: Hackathon Demo Corp</p>
                </div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">{cert.tonnes} tCO₂e Retired</span>
                  <span className="font-mono text-[10px] text-slate-500 truncate max-w-[150px]">
                    Hash: {cert.certificateHash}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedBatchForAudit && (
        <AuditDetailsModal
          batch={selectedBatchForAudit}
          onClose={() => setSelectedBatchForAudit(null)}
        />
      )}

      {selectedTokenForBuy && (
        <BuyCreditModal
          token={selectedTokenForBuy}
          onClose={() => setSelectedTokenForBuy(null)}
        />
      )}
    </div>
  );
}
