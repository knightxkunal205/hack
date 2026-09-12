"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  WasteBatch,
  CarbonToken,
  LeaderboardCompany,
  ActivityFeedItem,
  INITIAL_BATCHES,
  INITIAL_CARBON_TOKENS,
  LEADERBOARD_COMPANIES,
  INITIAL_ACTIVITY_FEED,
  WasteType,
} from "@/lib/mockData";

export type ViewRole = "home" | "supplier" | "driver" | "recycler" | "auditor";

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: "success" | "info" | "warning" | "error";
}

export interface PurchasedCertificate {
  id: string;
  tokenProject: string;
  tonnes: number;
  totalCostUSD: number;
  retiredAt: string;
  certificateHash: string;
  supplierName: string;
}

interface ChainTrackerContextType {
  currentView: ViewRole;
  setCurrentView: (view: ViewRole) => void;
  batches: WasteBatch[];
  carbonTokens: CarbonToken[];
  activityFeed: ActivityFeedItem[];
  leaderboard: LeaderboardCompany[];
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
  showToast: (title: string, description: string, type?: ToastMessage["type"]) => void;
  
  // High-level Metrics
  totalCarbonSavedTonnes: number;
  totalWasteRecycledTonnes: number;
  activeFacilitiesCount: number;
  walletBalanceUSD: number;
  purchasedCertificates: PurchasedCertificate[];

  // Flow Actions
  addWasteBatch: (data: {
    wasteType: WasteType;
    weightKg: number;
    moisture: number;
    photoUrl: string;
    supplierName?: string;
    location?: string;
  }) => string;
  
  verifyDriverArrival: (batchId: string) => void;
  logDriverWeight: (batchId: string, weightKg: number) => void;
  startRecyclingBatch: (batchId: string) => void;
  submitRecyclingRun: (
    batchId: string,
    method: "Biochar Pyrolysis" | "Anaerobic Biogas" | "Industrial Composting",
    energyKwh: number,
    yieldKg: number
  ) => void;
  approveAndMintCredit: (batchId: string) => void;
  buyCarbonCredit: (tokenId: string, tonnes: number) => boolean;
  resetDemoData: () => void;
}

const ChainTrackerContext = createContext<ChainTrackerContextType | undefined>(undefined);

export function ChainTrackerProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState<ViewRole>("home");
  const [batches, setBatches] = useState<WasteBatch[]>(INITIAL_BATCHES);
  const [carbonTokens, setCarbonTokens] = useState<CarbonToken[]>(INITIAL_CARBON_TOKENS);
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>(INITIAL_ACTIVITY_FEED);
  const [leaderboard, setLeaderboard] = useState<LeaderboardCompany[]>(LEADERBOARD_COMPANIES);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  const [totalCarbonSavedTonnes, setTotalCarbonSavedTonnes] = useState(1428.40);
  const [totalWasteRecycledTonnes, setTotalWasteRecycledTonnes] = useState(8920.50);
  const [activeFacilitiesCount] = useState(48);
  const [walletBalanceUSD, setWalletBalanceUSD] = useState(4800);
  const [purchasedCertificates, setPurchasedCertificates] = useState<PurchasedCertificate[]>([
    {
      id: "CERT-2026-8801",
      tokenProject: "Punjab Biochar Soil Sequestration Project",
      tonnes: 2.0,
      totalCostUSD: 160.0,
      retiredAt: "3 days ago",
      certificateHash: "0x4a91b...c7720",
      supplierName: "AgriCorp Punjab Green Belt",
    }
  ]);

  const showToast = (title: string, description: string, type: ToastMessage["type"] = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addWasteBatch = ({
    wasteType,
    weightKg,
    moisture,
    photoUrl,
    supplierName = "Hotel Green Leaf (Eco Resort)",
    location = "Aerocity Sector 4, Bayfront",
  }: {
    wasteType: WasteType;
    weightKg: number;
    moisture: number;
    photoUrl: string;
    supplierName?: string;
    location?: string;
  }) => {
    const nextIdNum = 1052 + Math.floor(Math.random() * 100);
    const newBatchId = `WST-${nextIdNum}`;
    const newBatch: WasteBatch = {
      id: newBatchId,
      supplierName,
      supplierLocation: location,
      wasteType,
      declaredWeightKg: weightKg,
      moisturePercentage: moisture,
      binPhotoUrl: photoUrl || "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=600&q=80",
      timestamp: "Just now",
      status: "created",
    };

    setBatches((prev) => [newBatch, ...prev]);

    // Update Activity
    const newActivity: ActivityFeedItem = {
      id: `act-${Date.now()}`,
      timestamp: "Just now",
      type: "waste_logged",
      title: `Batch #${newBatchId} Logged`,
      description: `${supplierName} registered ${weightKg} kg of ${wasteType}`,
      badge: "Supplier",
    };
    setActivityFeed((prev) => [newActivity, ...prev]);

    showToast(
      "Waste Batch Registered!",
      `Batch #${newBatchId} (${weightKg} kg ${wasteType}) is now queued for driver pickup.`,
      "success"
    );

    return newBatchId;
  };

  const verifyDriverArrival = (batchId: string) => {
    setBatches((prev) =>
      prev.map((b) => {
        if (b.id === batchId) {
          return {
            ...b,
            geofenceVerified: true,
            geofenceTimestamp: "Just now",
            status: "arrived_geofence",
            driverId: b.driverId || "TRK-08",
            driverName: b.driverName || "Rajesh Sharma (EcoHaul Fleet)",
          };
        }
        return b;
      })
    );

    setActivityFeed((prev) => [
      {
        id: `act-${Date.now()}`,
        timestamp: "Just now",
        type: "geofence_verified",
        title: `GPS Geofence Verified`,
        description: `Batch #${batchId} arrival confirmed within 50m facility radius`,
        badge: "GPS dMRV",
      },
      ...prev,
    ]);

    showToast(
      "Geofence Verified (50m)",
      `GPS proximity lock successful for Batch #${batchId}. You may now log scale weight.`,
      "info"
    );
  };

  const logDriverWeight = (batchId: string, weightKg: number) => {
    const randomHash = "0x" + Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join("") + "...";

    setBatches((prev) =>
      prev.map((b) => {
        if (b.id === batchId) {
          return {
            ...b,
            driverVerifiedWeightKg: weightKg,
            waybillHash: randomHash,
            status: "scaled",
            recyclerFacility: b.recyclerFacility || "BioChar Circular Hub #1",
          };
        }
        return b;
      })
    );

    setActivityFeed((prev) => [
      {
        id: `act-${Date.now()}`,
        timestamp: "Just now",
        type: "weight_scaled",
        title: `Digital Scale Waybill Signed`,
        description: `Batch #${batchId} verified weight logged at ${weightKg} kg`,
        badge: "IoT Scale",
      },
      ...prev,
    ]);

    showToast(
      "Scale Waybill Generated!",
      `Verified weight ${weightKg} kg logged with cryptographic hash ${randomHash}.`,
      "success"
    );
  };

  const startRecyclingBatch = (batchId: string) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, status: "processing" } : b))
    );
    showToast("Processing Started", `Batch #${batchId} claimed for conversion chamber.`, "info");
  };

  const submitRecyclingRun = (
    batchId: string,
    method: "Biochar Pyrolysis" | "Anaerobic Biogas" | "Industrial Composting",
    energyKwh: number,
    yieldKg: number
  ) => {
    // Scientific Carbon Sequestration calculation estimate
    // Biochar ~ 80-85% carbon purity. 1 kg Biochar removes ~2.5 to 3.0 kg CO2 equivalent after energy deduction
    const carbonPurity = method === "Biochar Pyrolysis" ? 84 : 65;
    const grossCarbonTonnes = (yieldKg * (carbonPurity / 100) * 3.67) / 1000;
    const energyPenaltyTonnes = (energyKwh * 0.7) / 1000; // grid emission factor ~0.7kg CO2/kWh
    const netCarbonTonnes = Math.max(0.01, parseFloat((grossCarbonTonnes - energyPenaltyPenalty(energyPenaltyTonnes)).toFixed(3)));

    function energyPenaltyPenalty(val: number) {
      return val * 0.5; // clean tech facility offset
    }

    setBatches((prev) =>
      prev.map((b) => {
        if (b.id === batchId) {
          return {
            ...b,
            conversionMethod: method,
            energyConsumedKwh: energyKwh,
            yieldKg,
            carbonPurityPercent: carbonPurity,
            calculatedCarbonTonne: netCarbonTonnes,
            status: "pending_audit",
          };
        }
        return b;
      })
    );

    setTotalWasteRecycledTonnes((prev) => prev + yieldKg / 1000);

    setActivityFeed((prev) => [
      {
        id: `act-${Date.now()}`,
        timestamp: "Just now",
        type: "conversion_done",
        title: `${method} Complete`,
        description: `Batch #${batchId} produced ${yieldKg} kg yield (${netCarbonTonnes} tCO2e est.)`,
        badge: "Recycler",
      },
      ...prev,
    ]);

    showToast(
      "Conversion Submitted for Audit",
      `Batch #${batchId} packaged with IoT telemetry for dMRV audit.`,
      "success"
    );
  };

  const approveAndMintCredit = (batchId: string) => {
    const targetBatch = batches.find((b) => b.id === batchId);
    if (!targetBatch) return;

    const netTonnes = targetBatch.calculatedCarbonTonne || 0.12;
    const txHash = "0x" + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("") + "...";
    const certId = `CRT-2026-${Math.floor(100 + Math.random() * 900)}`;

    setBatches((prev) =>
      prev.map((b) => {
        if (b.id === batchId) {
          return {
            ...b,
            status: "minted",
            auditPassed: true,
            mintTxHash: txHash,
            tokenCertificateId: certId,
          };
        }
        return b;
      })
    );

    // Create New Carbon Token for marketplace
    const newToken: CarbonToken = {
      id: certId,
      batchId: targetBatch.id,
      supplierName: targetBatch.supplierName,
      projectName: `${targetBatch.wasteType} Sequestration Project`,
      vintage: "2026 Q1",
      method: targetBatch.conversionMethod || "Biochar Pyrolysis",
      location: targetBatch.supplierLocation,
      pricePerTonne: 80,
      availableTonnes: netTonnes,
      permanenceYears: targetBatch.conversionMethod === "Biochar Pyrolysis" ? 100 : 25,
      coBenefits: ["Verified Biogenic Origin", "Methane Avoidance", "dMRV Certified"],
      registryId: `REG-${Math.floor(10000 + Math.random() * 90000)}`,
      carbonSavedTonnes: netTonnes,
      createdAt: "Just now",
    };

    setCarbonTokens((prev) => [newToken, ...prev]);
    setTotalCarbonSavedTonnes((prev) => parseFloat((prev + netTonnes).toFixed(2)));

    // Update leaderboard
    setLeaderboard((prev) =>
      prev.map((item) => {
        if (item.name.toLowerCase().includes(targetBatch.supplierName.slice(0, 5).toLowerCase())) {
          return {
            ...item,
            carbonOffsetTonne: parseFloat((item.carbonOffsetTonne + netTonnes).toFixed(1)),
            batchesCount: item.batchesCount + 1,
          };
        }
        return item;
      })
    );

    setActivityFeed((prev) => [
      {
        id: `act-${Date.now()}`,
        timestamp: "Just now",
        type: "credit_minted",
        title: `${netTonnes} Carbon Tokens Minted!`,
        description: `Verified Batch #${batchId} on-chain. Token ID: ${certId}`,
        badge: "On-Chain",
      },
      ...prev,
    ]);

    // Trigger Confetti Celebration!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#34d399", "#059669", "#0284c7"],
      });
    } catch {
      // ignore in test env
    }

    showToast(
      "Carbon Credits Minted & Listed!",
      `${netTonnes} tCO2e minted with Cert ID ${certId} and listed on the Marketplace at $80/t.`,
      "success"
    );
  };

  const buyCarbonCredit = (tokenId: string, tonnes: number) => {
    const token = carbonTokens.find((t) => t.id === tokenId);
    if (!token) return false;

    const totalCost = tonnes * token.pricePerTonne;
    if (walletBalanceUSD < totalCost) {
      showToast("Insufficient Balance", `You need $${totalCost} but have $${walletBalanceUSD}`, "error");
      return false;
    }

    setWalletBalanceUSD((prev) => prev - totalCost);

    // Deduct available
    setCarbonTokens((prev) =>
      prev.map((t) => {
        if (t.id === tokenId) {
          const remaining = Math.max(0, parseFloat((t.availableTonnes - tonnes).toFixed(2)));
          return { ...t, availableTonnes: remaining };
        }
        return t;
      })
    );

    const certHash = "0x" + Array.from({ length: 14 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const newCert: PurchasedCertificate = {
      id: `RETIRE-${Math.floor(1000 + Math.random() * 9000)}`,
      tokenProject: token.projectName,
      tonnes,
      totalCostUSD: totalCost,
      retiredAt: "Just now",
      certificateHash: certHash,
      supplierName: token.supplierName,
    };

    setPurchasedCertificates((prev) => [newCert, ...prev]);

    setActivityFeed((prev) => [
      {
        id: `act-${Date.now()}`,
        timestamp: "Just now",
        type: "credit_purchased",
        title: `${tonnes} tCO2e Offset Retired`,
        description: `Purchased from ${token.projectName} for $${totalCost}`,
        badge: "Marketplace",
      },
      ...prev,
    ]);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.5 },
      });
    } catch {}

    showToast(
      "Carbon Credit Retired!",
      `Successfully purchased and retired ${tonnes} tCO2e (${token.id}) for $${totalCost}.`,
      "success"
    );

    return true;
  };

  const resetDemoData = () => {
    setBatches(INITIAL_BATCHES);
    setCarbonTokens(INITIAL_CARBON_TOKENS);
    setActivityFeed(INITIAL_ACTIVITY_FEED);
    setLeaderboard(LEADERBOARD_COMPANIES);
    setTotalCarbonSavedTonnes(1428.40);
    setTotalWasteRecycledTonnes(8920.50);
    setWalletBalanceUSD(4800);
    showToast("Demo Data Reset", "Reset to original sample scenario.", "info");
  };

  return (
    <ChainTrackerContext.Provider
      value={{
        currentView,
        setCurrentView,
        batches,
        carbonTokens,
        activityFeed,
        leaderboard,
        toasts,
        removeToast,
        showToast,
        totalCarbonSavedTonnes,
        totalWasteRecycledTonnes,
        activeFacilitiesCount,
        walletBalanceUSD,
        purchasedCertificates,
        addWasteBatch,
        verifyDriverArrival,
        logDriverWeight,
        startRecyclingBatch,
        submitRecyclingRun,
        approveAndMintCredit,
        buyCarbonCredit,
        resetDemoData,
      }}
    >
      {children}
    </ChainTrackerContext.Provider>
  );
}

export function useChainTracker() {
  const context = useContext(ChainTrackerContext);
  if (!context) {
    throw new Error("useChainTracker must be used within a ChainTrackerProvider");
  }
  return context;
}
