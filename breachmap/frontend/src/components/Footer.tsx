const Footer = () => {
  return (
    <footer className="blueprint-grid corner-marks py-12 px-6">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-6 h-6 border border-foreground/30"
            style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
          />
          <span className="font-display font-bold text-sm tracking-wide text-electric">BREACHMAP</span>
        </div>
        <div className="flex gap-6 items-center">
          <a
            href="https://github.com/ananyaa-k/BreachMap"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono-tech text-[11px] hover:text-electric transition-colors"
            style={{ color: 'rgba(224,240,255,0.45)' }}
          >
            GITHUB ↗
          </a>
          <a
            href="https://owasp.org/www-project-web-security-testing-guide/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono-tech text-[11px] hover:text-electric transition-colors"
            style={{ color: 'rgba(224,240,255,0.45)' }}
          >
            OWASP WSTG ↗
          </a>
        </div>
        <span className="font-mono-tech text-[10px]" style={{ color: 'rgba(224,240,255,0.3)' }}>
          © 2026 BREACHMAP // SECURITY RESEARCH TOOL
        </span>
      </div>
    </footer>
  );
};

export default Footer;
