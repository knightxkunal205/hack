import type { Metadata } from "next";
import "./globals.css";
import { ChainTrackerProvider } from "@/context/ChainTrackerContext";
import { ToastContainer } from "@/components/ToastContainer";

export const metadata: Metadata = {
  title: "Waste-to-Carbon-Value Chain Tracker | dMRV Platform",
  description:
    "Decentralized Measurement, Reporting & Verification (dMRV) tracking biogenic waste from origin to verified on-chain carbon credits.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        <ChainTrackerProvider>
          {children}
          <ToastContainer />
        </ChainTrackerProvider>
      </body>
    </html>
  );
}
