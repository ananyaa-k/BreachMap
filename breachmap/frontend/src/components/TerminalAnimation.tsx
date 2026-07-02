import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const terminalLines = [
  { text: '$ breachmap scan --target ./webapp --lang php,python', type: 'command' as const, delay: 0 },
  { text: '[INIT] BreachMap v2.4.1 — OWASP WSTG Scanner', type: 'info' as const, delay: 600 },
  { text: '[INIT] Loading detection modules...', type: 'info' as const, delay: 900 },
  { text: '[SCAN] Recursive file discovery: 247 files indexed', type: 'info' as const, delay: 1400 },
  { text: '[SCAN] Analyzing PHP sources... 183 files', type: 'info' as const, delay: 2000 },
  { text: '[SCAN] Analyzing Python sources... 64 files', type: 'info' as const, delay: 2400 },
  { text: '', type: 'blank' as const, delay: 2800 },
  { text: '[VULN] SQL Injection detected — auth/login.php:42', type: 'critical' as const, delay: 3100 },
  { text: '       → Unparameterized query: $db->query("SELECT * FROM users WHERE id=".$_GET[\'id\'])', type: 'detail' as const, delay: 3300 },
  { text: '       → WSTG-INPV-05 | Severity: CRITICAL', type: 'tag' as const, delay: 3500 },
  { text: '', type: 'blank' as const, delay: 3700 },
  { text: '[VULN] Reflected XSS — templates/search.php:118', type: 'warning' as const, delay: 4000 },
  { text: '       → Unescaped output: echo $_REQUEST[\'q\']', type: 'detail' as const, delay: 4200 },
  { text: '       → WSTG-INPV-01 | Severity: HIGH', type: 'tag' as const, delay: 4400 },
  { text: '', type: 'blank' as const, delay: 4600 },
  { text: '[VULN] Weak Session Config — config/session.py:23', type: 'warning' as const, delay: 4900 },
  { text: '       → SESSION_COOKIE_SECURE = False', type: 'detail' as const, delay: 5100 },
  { text: '       → WSTG-SESS-02 | Severity: MEDIUM', type: 'tag' as const, delay: 5300 },
  { text: '', type: 'blank' as const, delay: 5500 },
  { text: '[VULN] Hardcoded Credentials — utils/db_connect.php:8', type: 'critical' as const, delay: 5800 },
  { text: '       → password = "admin123" in plaintext', type: 'detail' as const, delay: 6000 },
  { text: '       → WSTG-ATHN-02 | Severity: CRITICAL', type: 'tag' as const, delay: 6200 },
  { text: '', type: 'blank' as const, delay: 6400 },
  { text: '[DONE] Scan complete — 247 files | 4 vulnerabilities | 2 CRITICAL', type: 'success' as const, delay: 6800 },
  { text: '[DONE] Report saved → ./breachmap-report-2026-03-08.json', type: 'success' as const, delay: 7200 },
];

const colorMap: Record<string, string> = {
  command: '#38BDF8',
  info: 'rgba(224,240,255,0.5)',
  critical: '#EF4444',
  warning: '#F59E0B',
  detail: 'rgba(224,240,255,0.35)',
  tag: '#0EA5E9',
  success: '#22C55E',
  blank: 'transparent',
};

const TerminalAnimation = () => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const timers = terminalLines.map((line, i) =>
      setTimeout(() => {
        setVisibleLines(i + 1);
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }, line.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [started]);

  return (
    <section ref={ref} className="py-24 px-6 bg-blueprint-dark">
      <div className="max-w-4xl mx-auto">
        <span className="font-mono-tech text-xs uppercase tracking-widest text-electric mb-3 block text-center">
          LIVE OUTPUT
        </span>
        <h2 className="font-display font-bold text-4xl md:text-[52px] text-foreground mb-12 leading-tight text-center">
          See It In Action
        </h2>

        <motion.div
          className="rounded-lg overflow-hidden"
          style={{ border: '1px solid rgba(30,77,140,0.4)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3" style={{ background: 'rgba(10,22,40,0.8)', borderBottom: '1px solid rgba(30,77,140,0.3)' }}>
            <div className="w-3 h-3 rounded-full bg-[#EF4444]/60" />
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]/60" />
            <div className="w-3 h-3 rounded-full bg-[#22C55E]/60" />
            <span className="font-mono-tech text-[11px] ml-3" style={{ color: 'rgba(224,240,255,0.3)' }}>
              breachmap — scan
            </span>
          </div>

          {/* Terminal body */}
          <div
            ref={scrollRef}
            className="p-5 h-[380px] overflow-y-auto"
            style={{ background: '#060E1A' }}
          >
            {terminalLines.slice(0, visibleLines).map((line, i) => (
              <div key={i} className="font-mono-tech text-[12px] md:text-[13px] leading-6 whitespace-pre-wrap" style={{ color: colorMap[line.type] }}>
                {line.text || '\u00A0'}
              </div>
            ))}
            {visibleLines < terminalLines.length && started && (
              <span className="inline-block w-2 h-4 bg-electric/70 animate-pulse ml-0.5" />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TerminalAnimation;
