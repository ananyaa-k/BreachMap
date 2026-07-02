import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, Terminal, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScanReport } from '@/types/scan';

interface ScannerFormProps {
  onScanStart: () => void;
  onScanComplete: (report: ScanReport) => void;
  onScanError: (error: string) => void;
}

const loadingMessages = [
  "Analyzing code...",
  "Mapping to OWASP...",
  "Generating fixes...",
  "Building report..."
];

export default function ScannerForm({
  onScanStart,
  onScanComplete,
  onScanError
}: ScannerFormProps) {
  const [activeTab, setActiveTab] = useState<'code' | 'repo'>('code');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<'python' | 'php'>('python');
  const [githubUrl, setGithubUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentMessageIdx, setCurrentMessageIdx] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setCurrentMessageIdx(0);
      interval = setInterval(() => {
        setCurrentMessageIdx((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

  const handleScanCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    onScanStart();

    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const formData = new FormData();
    formData.append("code", code);
    formData.append("language", language);

    try {
      const response = await fetch(`${baseUrl}/api/scan/code`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Scan failed with status ${response.status}`);
      }

      const report: ScanReport = await response.json();
      onScanComplete(report);
    } catch (err: any) {
      onScanError(err.message || "An unexpected error occurred during raw code scan.");
    } finally {
      setLoading(false);
    }
  };

  const handleScanRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrl.trim()) return;

    setLoading(true);
    onScanStart();

    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    try {
      const response = await fetch(`${baseUrl}/api/scan/repo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ github_url: githubUrl }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Scan failed with status ${response.status}`);
      }

      const report: ScanReport = await response.json();
      onScanComplete(report);
    } catch (err: any) {
      onScanError(err.message || "An unexpected error occurred during repository scan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto bg-[#060E1A] border border-[rgba(30,77,140,0.3)] rounded-xl p-8 relative overflow-hidden shadow-2xl shadow-blue-950/20"
    >
      {/* Visual blueprint corner decorations */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-electric/30" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-electric/30" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-electric/30" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-electric/30" />

      <Tabs 
        defaultValue="code" 
        className="w-full" 
        onValueChange={(val) => setActiveTab(val as 'code' | 'repo')}
      >
        <TabsList className="grid w-full grid-cols-2 bg-[#0A1628]/60 border border-electric/25 p-1 rounded-lg mb-8">
          <TabsTrigger 
            value="code"
            disabled={loading}
            className="data-[state=active]:bg-electric data-[state=active]:text-primary-foreground text-electric/60 font-display font-bold uppercase tracking-wider text-sm py-2 rounded transition-all flex items-center justify-center gap-2"
          >
            <Code2 className="w-4 h-4" />
            PASTE CODE
          </TabsTrigger>
          <TabsTrigger 
            value="repo"
            disabled={loading}
            className="data-[state=active]:bg-electric data-[state=active]:text-primary-foreground text-electric/60 font-display font-bold uppercase tracking-wider text-sm py-2 rounded transition-all flex items-center justify-center gap-2"
          >
            <Terminal className="w-4 h-4" />
            SCAN GITHUB REPO
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="mt-0 outline-none">
          <form onSubmit={handleScanCode} className="space-y-6">
            <div className="space-y-2">
              <label className="font-mono-tech text-[11px] tracking-widest text-electric/80 block uppercase">
                Select Language
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setLanguage('python')}
                  className={`px-5 py-2 rounded-md font-mono-tech text-xs tracking-widest uppercase transition-all duration-200 ${
                    language === 'python'
                      ? 'bg-electric text-primary-foreground shadow-lg shadow-electric/20'
                      : 'border border-electric/30 text-electric/60 hover:bg-electric/5 hover:text-electric'
                  }`}
                >
                  Python
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setLanguage('php')}
                  className={`px-5 py-2 rounded-md font-mono-tech text-xs tracking-widest uppercase transition-all duration-200 ${
                    language === 'php'
                      ? 'bg-electric text-primary-foreground shadow-lg shadow-electric/20'
                      : 'border border-electric/30 text-electric/60 hover:bg-electric/5 hover:text-electric'
                  }`}
                >
                  PHP
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-mono-tech text-[11px] tracking-widest text-electric/80 block uppercase">
                Source Code Input
              </label>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={loading}
                placeholder="// Paste your code here..."
                className="w-full bg-[#060E1A] border border-[rgba(30,77,140,0.4)] text-foreground placeholder:text-neutral-600 font-mono text-sm p-4 rounded-lg focus:outline-none focus:border-electric/60 focus:ring-1 focus:ring-electric/40 transition-all leading-relaxed"
                style={{ minHeight: '280px' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="w-full bg-electric hover:brightness-110 text-primary-foreground font-display font-semibold uppercase tracking-wider text-sm h-12 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-primary-foreground" />
                  <span className="font-display font-semibold uppercase tracking-wider text-sm">
                    {loadingMessages[currentMessageIdx]}
                  </span>
                </>
              ) : (
                <span>RUN SCAN</span>
              )}
            </button>
          </form>
        </TabsContent>

        <TabsContent value="repo" className="mt-0 outline-none">
          <form onSubmit={handleScanRepo} className="space-y-6">
            <div className="space-y-2">
              <label className="font-mono-tech text-[11px] tracking-widest text-electric/80 block uppercase">
                GitHub Repository URL
              </label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                disabled={loading}
                placeholder="https://github.com/username/repository"
                className="w-full h-12 bg-[#060E1A] border border-[rgba(30,77,140,0.4)] text-foreground placeholder:text-neutral-600 font-mono text-sm px-4 rounded-lg focus:outline-none focus:border-electric/60 focus:ring-1 focus:ring-electric/40 transition-all"
              />
              <p className="text-[11px] font-mono-tech text-neutral-500 tracking-wide mt-1">
                Public repositories only · Python and PHP files scanned
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !githubUrl.trim()}
              className="w-full bg-electric hover:brightness-110 text-primary-foreground font-display font-semibold uppercase tracking-wider text-sm h-12 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-primary-foreground" />
                  <span className="font-display font-semibold uppercase tracking-wider text-sm">
                    {loadingMessages[currentMessageIdx]}
                  </span>
                </>
              ) : (
                <span>SCAN REPOSITORY</span>
              )}
            </button>
          </form>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
