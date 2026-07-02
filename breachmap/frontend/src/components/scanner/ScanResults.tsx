import React, { useState } from 'react';
import { ScanReport, Finding } from '@/types/scan';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, AlertTriangle, ChevronDown, ChevronUp, Shield, FileText } from 'lucide-react';

interface ScanResultsProps {
  report: ScanReport;
}

const owaspCategories = [
  { id: "A01:2021", name: "Broken Access Control" },
  { id: "A02:2021", name: "Cryptographic Failures" },
  { id: "A03:2021", name: "Injection" },
  { id: "A05:2021", name: "Security Misconfiguration" },
  { id: "A07:2021", name: "Identification & Authentication Failures" },
  { id: "A08:2021", name: "Software & Data Integrity Failures" },
  { id: "A09:2021", name: "Security Logging & Monitoring Failures" }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function ScanResults({ report }: ScanResultsProps) {
  const [expandedFindingId, setExpandedFindingId] = useState<string | null>(null);

  const score = report.overall_risk_score;
  
  // Risk Score Color Logic
  const getScoreColor = (val: number) => {
    if (val < 30) return "#22C55E"; // Green
    if (val <= 70) return "#F59E0B"; // Yellow
    return "#EF4444"; // Red
  };

  const getScoreBorderClass = (val: number) => {
    if (val < 30) return "border-green-500 shadow-green-500/10";
    if (val <= 70) return "border-yellow-500 shadow-yellow-500/10";
    return "border-red-500 shadow-red-500/10";
  };

  // Severity color badge mapping helper
  const getSeverityBadgeClass = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
  };

  const downloadJsonReport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `breachmap_report_${report.scan_id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const toggleExpand = (id: string) => {
    setExpandedFindingId(prev => (prev === id ? null : id));
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-10 w-full max-w-5xl mx-auto pb-16 font-sans text-foreground"
    >
      {/* SECTION 1 — Risk Score Header */}
      <motion.div 
        variants={itemVariants} 
        className="bg-[#060E1A] border border-[rgba(30,77,140,0.3)] rounded-xl p-8 relative overflow-hidden shadow-xl"
      >
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-electric/30" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-electric/30" />
        
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          {/* Large centered risk score circle */}
          <div 
            className={`w-[120px] h-[120px] rounded-full border-4 flex flex-col items-center justify-center bg-background shadow-lg ${getScoreBorderClass(score)}`}
            style={{ transition: 'border-color 0.3s ease' }}
          >
            <span className="font-display font-bold text-5xl tracking-tight" style={{ color: getScoreColor(score) }}>
              {score}
            </span>
            <span className="font-mono-tech text-[10px] tracking-widest text-muted-foreground mt-0.5">
              RISK SCORE
            </span>
          </div>

          {/* Five stat boxes in a row */}
          <div className="grid grid-cols-5 gap-4 w-full max-w-xl">
            <div className="bg-[#0A1628]/40 border border-electric/10 rounded-lg p-3 text-center">
              <span className="block font-mono-tech text-[10px] tracking-widest text-muted-foreground uppercase">Total</span>
              <span className="font-display font-bold text-2xl text-foreground mt-1 block">{report.total_findings}</span>
            </div>
            <div className="bg-[#0A1628]/40 border border-electric/10 rounded-lg p-3 text-center">
              <span className="block font-mono-tech text-[10px] tracking-widest text-red-500/70 uppercase">Critical</span>
              <span className="font-display font-bold text-2xl text-red-500 mt-1 block">{report.findings_by_severity.Critical}</span>
            </div>
            <div className="bg-[#0A1628]/40 border border-electric/10 rounded-lg p-3 text-center">
              <span className="block font-mono-tech text-[10px] tracking-widest text-orange-500/70 uppercase">High</span>
              <span className="font-display font-bold text-2xl text-orange-400 mt-1 block">{report.findings_by_severity.High}</span>
            </div>
            <div className="bg-[#0A1628]/40 border border-electric/10 rounded-lg p-3 text-center">
              <span className="block font-mono-tech text-[10px] tracking-widest text-yellow-500/70 uppercase">Medium</span>
              <span className="font-display font-bold text-2xl text-yellow-400 mt-1 block">{report.findings_by_severity.Medium}</span>
            </div>
            <div className="bg-[#0A1628]/40 border border-electric/10 rounded-lg p-3 text-center">
              <span className="block font-mono-tech text-[10px] tracking-widest text-green-500/70 uppercase">Low</span>
              <span className="font-display font-bold text-2xl text-green-400 mt-1 block">{report.findings_by_severity.Low}</span>
            </div>
          </div>

          {/* Executive summary paragraph */}
          <div className="max-w-3xl border-t border-electric/15 pt-6 w-full">
            <h3 className="font-mono-tech text-xs tracking-widest text-electric uppercase mb-3 flex items-center justify-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              Executive Risk Summary
            </h3>
            <p className="font-body text-sm leading-relaxed text-[rgba(224,240,255,0.6)]">
              {report.executive_summary}
            </p>
          </div>

          {/* DOWNLOAD REPORT (JSON) button */}
          <button
            onClick={downloadJsonReport}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-electric/40 text-electric hover:bg-electric/10 font-display font-bold tracking-wide text-xs uppercase transition-all duration-300"
          >
            <Download className="w-4 h-4" />
            DOWNLOAD REPORT (JSON)
          </button>
        </div>
      </motion.div>

      {/* SECTION 2 — Findings Table */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="font-display font-bold text-2xl tracking-wide uppercase border-b border-electric/20 pb-2">
          SCAN FINDINGS DETAILS
        </h2>
        
        {report.findings.length === 0 ? (
          <div className="bg-[#060E1A] border border-[rgba(30,77,140,0.3)] rounded-xl p-8 text-center text-muted-foreground">
            No vulnerabilities identified during this scan.
          </div>
        ) : (
          <div className="bg-[#060E1A] border border-[rgba(30,77,140,0.3)] rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0A1628]/60 border-b border-electric/20">
                    <th className="py-4 px-6 font-mono-tech text-[11px] tracking-widest text-electric uppercase">Severity</th>
                    <th className="py-4 px-6 font-mono-tech text-[11px] tracking-widest text-electric uppercase">OWASP</th>
                    <th className="py-4 px-6 font-mono-tech text-[11px] tracking-widest text-electric uppercase">File</th>
                    <th className="py-4 px-6 font-mono-tech text-[11px] tracking-widest text-electric uppercase">Line</th>
                    <th className="py-4 px-6 font-mono-tech text-[11px] tracking-widest text-electric uppercase">Vulnerability</th>
                    <th className="py-4 px-6 font-mono-tech text-[11px] tracking-widest text-electric uppercase text-right">CVSS</th>
                  </tr>
                </thead>
                <tbody>
                  {report.findings.map((finding) => {
                    const isExpanded = expandedFindingId === finding.id;
                    const vulnTruncated = finding.pattern_matched.length > 60 
                      ? `${finding.pattern_matched.substring(0, 60)}...` 
                      : finding.pattern_matched;

                    return (
                      <React.Fragment key={finding.id}>
                        {/* Clickable Row */}
                        <tr 
                          onClick={() => toggleExpand(finding.id)}
                          className={`border-b border-electric/10 hover:bg-[#0A1628]/35 transition-colors cursor-pointer select-none ${isExpanded ? 'bg-[#0A1628]/25' : ''}`}
                        >
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadgeClass(finding.severity)}`}>
                              {finding.severity}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-mono-tech text-xs tracking-wider text-neutral-300">
                            {finding.owasp_id}
                          </td>
                          <td className="py-4 px-6 font-body text-xs text-neutral-300">
                            {finding.filename || "—"}
                          </td>
                          <td className="py-4 px-6 font-mono-tech text-xs text-neutral-300">
                            {finding.line_number ?? "—"}
                          </td>
                          <td className="py-4 px-6 font-body text-xs text-neutral-300 font-medium">
                            {vulnTruncated}
                          </td>
                          <td className="py-4 px-6 font-display font-semibold text-sm text-right" style={{ color: getScoreColor(finding.cvss_score) }}>
                            {finding.cvss_score.toFixed(1)}
                          </td>
                        </tr>

                        {/* Accordion content inside row wrapper */}
                        <tr className="border-none">
                          <td colSpan={6} className="p-0 border-none">
                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden bg-[#071324]/40 border-b border-electric/15"
                                >
                                  <div className="p-6 space-y-6 text-sm">
                                    <div className="flex items-center gap-2 border-b border-electric/10 pb-2">
                                      <Shield className="w-4 h-4 text-electric" />
                                      <h4 className="font-display font-bold text-sm tracking-widest text-electric uppercase">VULNERABILITY DETAIL</h4>
                                    </div>

                                    {/* Code Snippet in Red border block */}
                                    <div className="space-y-2">
                                      <span className="font-mono-tech text-[10px] tracking-widest text-neutral-500 uppercase">Vulnerable Code Snippet</span>
                                      <pre className="p-4 bg-[#030811] border-l-4 border-red-500 text-red-400 font-mono text-xs overflow-x-auto leading-relaxed rounded-r-md">
                                        <code>{finding.code_snippet}</code>
                                      </pre>
                                    </div>

                                    {/* Explanation */}
                                    <div className="space-y-1">
                                      <span className="font-mono-tech text-[10px] tracking-widest text-electric/80 block uppercase">WHY THIS IS DANGEROUS</span>
                                      <p className="font-body text-neutral-300 leading-relaxed max-w-4xl text-xs">
                                        {finding.explanation}
                                      </p>
                                    </div>

                                    {/* Fixed Code snippet in Green border block */}
                                    <div className="space-y-2">
                                      <span className="font-mono-tech text-[10px] tracking-widest text-neutral-500 uppercase">FIXED CODE</span>
                                      <pre className="p-4 bg-[#030811] border-l-4 border-green-500 text-green-400 font-mono text-xs overflow-x-auto leading-relaxed rounded-r-md">
                                        <code>{finding.fixed_code}</code>
                                      </pre>
                                    </div>

                                    {/* CVSS Justification */}
                                    <div className="space-y-1 border-t border-electric/10 pt-4">
                                      <span className="font-mono-tech text-[10px] tracking-widest text-electric/80 block uppercase">CVSS JUSTIFICATION</span>
                                      <p className="font-body text-neutral-300 italic text-xs leading-relaxed max-w-4xl">
                                        {finding.cvss_justification}
                                      </p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>

      {/* SECTION 3 — OWASP Coverage Grid */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="font-display font-bold text-2xl tracking-wide uppercase border-b border-electric/20 pb-2">
          OWASP COVERAGE MATRIX
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {owaspCategories.map((cat) => {
            const count = report.owasp_coverage[cat.id] || 0;
            const hasFindings = count > 0;

            return (
              <div
                key={cat.id}
                className={`bg-[#060E1A] rounded-xl p-5 border flex flex-col justify-between h-36 transition-all duration-300 relative overflow-hidden ${
                  hasFindings
                    ? "border-electric/60 shadow-lg shadow-electric/5"
                    : "border-[rgba(30,77,140,0.15)] opacity-40 hover:opacity-60"
                }`}
              >
                {/* Visual highlight corner line for cards with findings */}
                {hasFindings && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-electric" />
                )}

                <div>
                  <span className="font-mono-tech text-[10px] tracking-widest text-electric/80 block uppercase mb-1">
                    {cat.id}
                  </span>
                  <h3 className="font-display font-bold text-base leading-tight text-foreground">
                    {cat.name}
                  </h3>
                </div>

                <div className="flex justify-end items-end">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono-tech tracking-wider uppercase font-semibold ${
                    hasFindings
                      ? "bg-electric/20 text-electric border border-electric/30"
                      : "bg-neutral-900 text-neutral-600 border border-neutral-800"
                  }`}>
                    {count} {count === 1 ? "finding" : "findings"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
