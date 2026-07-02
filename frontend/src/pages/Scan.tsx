import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ScannerForm from '@/components/scanner/ScannerForm';
import ScanResults from '@/components/scanner/ScanResults';
import { ScanReport } from '@/types/scan';
import { ArrowLeft, RefreshCw, AlertTriangle, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ScanStatus = "idle" | "scanning" | "complete" | "error";

export default function Scan() {
  const [scanStatus, setScanStatus] = useState<ScanStatus>("idle");
  const [report, setReport] = useState<ScanReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleScanStart = () => {
    setScanStatus("scanning");
    setErrorMessage(null);
  };

  const handleScanComplete = (completedReport: ScanReport) => {
    setReport(completedReport);
    setScanStatus("complete");
  };

  const handleScanError = (error: string) => {
    setErrorMessage(error);
    setScanStatus("error");
  };

  const handleReset = () => {
    setReport(null);
    setErrorMessage(null);
    setScanStatus("idle");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden font-sans">
      <Navigation />

      {/* Blueprint Grid Background Section */}
      <section className="flex-1 blueprint-grid corner-marks flex flex-col pt-32 pb-16 px-6 relative">
        <div className="max-w-4xl mx-auto w-full text-center flex flex-col items-center mb-12">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="font-mono-tech text-xs tracking-widest text-electric uppercase mb-4"
          >
            BREACHMAP SCANNER
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-bold text-5xl md:text-6xl text-foreground mb-4 tracking-wide"
          >
            Scan Your Codebase
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-body text-base max-w-2xl text-muted-foreground leading-relaxed"
          >
            Upload Python or PHP code and get an instant OWASP-mapped vulnerability report with AI-powered remediation guidance.
          </motion.p>
        </div>

        <div className="w-full max-w-5xl mx-auto px-4">
          <AnimatePresence mode="wait">
            {/* IDLE state: Show ScannerForm */}
            {scanStatus === "idle" && (
              <motion.div
                key="idle-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <ScannerForm
                  onScanStart={handleScanStart}
                  onScanComplete={handleScanComplete}
                  onScanError={handleScanError}
                />
              </motion.div>
            )}

            {/* SCANNING state: Show ScannerForm (with form disabled & internal loading states active) */}
            {scanStatus === "scanning" && (
              <motion.div
                key="scanning-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ScannerForm
                  onScanStart={handleScanStart}
                  onScanComplete={handleScanComplete}
                  onScanError={handleScanError}
                />
              </motion.div>
            )}

            {/* COMPLETE state: Show NEW SCAN trigger and findings */}
            {scanStatus === "complete" && report && (
              <motion.div
                key="complete-results"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="flex justify-start">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 border border-electric/30 hover:border-electric/60 bg-[#060E1A] hover:bg-electric/5 text-electric rounded-lg font-display font-semibold tracking-wider text-xs uppercase transition-all duration-300"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    ← NEW SCAN
                  </button>
                </div>
                <ScanResults report={report} />
              </motion.div>
            )}

            {/* ERROR state: Show structured error view */}
            {scanStatus === "error" && (
              <motion.div
                key="error-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl mx-auto bg-[#0A0505] border border-red-500/20 rounded-xl p-8 text-center space-y-6 relative overflow-hidden shadow-2xl shadow-red-950/10"
              >
                {/* Visual blueprint corner decorations (red theme) */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500/40" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500/40" />
                
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-xl uppercase tracking-wider text-red-400">Scan Execution Failed</h3>
                  <div className="p-4 bg-[#030101] border-l-4 border-red-500 rounded text-left overflow-x-auto max-w-lg mx-auto">
                    <pre className="font-mono text-xs text-red-400 leading-relaxed whitespace-pre-wrap">
                      <code>{errorMessage || "An unexpected error occurred during static analysis."}</code>
                    </pre>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50 text-red-400 rounded-lg font-display font-bold tracking-wider text-xs uppercase transition-all duration-300 mx-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  TRY AGAIN
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
}
