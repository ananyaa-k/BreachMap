import React, { useState } from 'react'
import { Play, Loader2, ShieldAlert, FileCode, CheckCircle, BrainCircuit } from 'lucide-react'
import Button from '../components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

interface Finding {
  id: string
  title: string
  filePath: string
  line: number
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info'
  owasp: string
  score: number
  description: string
}

export default function Dashboard() {
  const [targetPath, setTargetPath] = useState('')
  const [deepAi, setDeepAi] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [findings, setFindings] = useState<Finding[]>([])

  const triggerScan = async () => {
    if (!targetPath) return
    setScanning(true)
    setFindings([])

    // Simulate scan execution
    setTimeout(() => {
      setFindings([
        {
          id: 'BM-001',
          title: 'Hardcoded API Key',
          filePath: '/backend/config.py',
          line: 12,
          severity: 'High',
          owasp: 'A05:2021-Security Misconfiguration',
          score: 7.5,
          description: 'A hardcoded secret key was detected inside config.py. This can allow attackers to authenticate as administrative users.',
        },
        {
          id: 'BM-002',
          title: 'SQL Injection in raw query',
          filePath: '/backend/auth.py',
          line: 45,
          severity: 'Critical',
          owasp: 'A03:2021-Injection',
          score: 9.8,
          description: 'Concatenating user-supplied input into database execution functions without parameterization leads to severe SQL injection vulnerabilities.',
        },
      ])
      setScanning(false)
    }, 2000)
  }

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'High':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
      case 'Medium':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'Low':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      default:
        return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
    }
  }

  return (
    <div className="space-y-8">
      {/* Search Header panel */}
      <div className="glass rounded-2xl p-8 border border-white/5 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Static Analysis Orchestration</h1>
          <p className="text-neutral-400 text-sm">
            Configure target paths and start scanning the codebase structure.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-xs font-semibold text-neutral-400 block">
              TARGET WORKSPACE DIRECTORY
            </label>
            <input
              type="text"
              value={targetPath}
              onChange={(e) => setTargetPath(e.target.value)}
              placeholder="e.g. c:/projects/my-vulnerable-app"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 h-11 text-sm text-white focus:outline-none focus:border-primary/50 placeholder:text-neutral-600"
            />
          </div>

          <div className="flex items-center gap-3 h-11 px-4 rounded-xl bg-white/5 border border-white/10 select-none">
            <input
              type="checkbox"
              id="deepAi"
              checked={deepAi}
              onChange={(e) => setDeepAi(e.target.checked)}
              className="rounded border-neutral-800 bg-neutral-900 text-primary focus:ring-primary/40 focus:ring-offset-neutral-950 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="deepAi" className="text-sm font-medium text-neutral-300 cursor-pointer flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-primary/80" />
              Deep AI Audit (Groq)
            </label>
          </div>

          <Button
            onClick={triggerScan}
            disabled={scanning || !targetPath}
            variant="primary"
            className="flex items-center gap-2"
          >
            {scanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Run Audit
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Findings results block */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span>Audit Findings</span>
          {findings.length > 0 && (
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
              {findings.length}
            </span>
          )}
        </h2>

        <AnimatePresence mode="popLayout">
          {findings.length === 0 && !scanning && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass rounded-2xl p-12 text-center border border-white/5"
            >
              <CheckCircle className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
              <h3 className="text-base font-semibold mb-1">No Scan Active</h3>
              <p className="text-neutral-400 text-xs max-w-sm mx-auto">
                Enter a target folder path above and trigger an audit to analyze files and visualize issues.
              </p>
            </motion.div>
          )}

          {scanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass rounded-2xl p-12 text-center border border-white/5"
            >
              <Loader2 className="w-12 h-12 text-primary/80 animate-spin mx-auto mb-4" />
              <h3 className="text-base font-semibold mb-1">Analyzing Codebase</h3>
              <p className="text-neutral-400 text-xs">
                Executing static rules and scanning target files...
              </p>
            </motion.div>
          )}

          {findings.length > 0 && !scanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-4"
            >
              {findings.map((finding) => (
                <div
                  key={finding.id}
                  className="glass rounded-xl p-6 border border-white/5 flex flex-col md:flex-row justify-between gap-6 hover:border-white/10 transition-all duration-300"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${getSeverityBadgeColor(finding.severity)}`}>
                        {finding.severity}
                      </span>
                      <span className="text-xs text-neutral-500 font-mono">
                        CVSS: {finding.score.toFixed(1)}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {finding.owasp}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-primary" />
                        {finding.title}
                      </h3>
                      <p className="text-neutral-400 text-xs mt-1">
                        {finding.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                      <FileCode className="w-3.5 h-3.5" />
                      <span>{finding.filePath}</span>
                      <span className="text-neutral-600">·</span>
                      <span>Line {finding.line}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">
                      Inspect
                    </Button>
                    <Button variant="secondary" size="sm">
                      AI Assist
                    </Button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
