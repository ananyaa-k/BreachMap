import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-6 md:px-10"
      style={{
        background: 'rgba(10,22,40,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(30,77,140,0.3)',
      }}
    >
      <div className="flex items-center gap-3">
        {/* Hexagon logo */}
        <div
          className="w-8 h-8 border border-foreground flex items-center justify-center"
          style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
        >
          <div
            className="w-6 h-6"
            style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', border: '1px solid currentColor' }}
          />
        </div>
        <span className="font-display font-bold text-xl tracking-wide text-electric">BREACHMAP</span>
      </div>

      <div className="flex items-center gap-6">
        <Link
          to="/scan"
          className="font-display text-[13px] tracking-wide text-electric transition-colors hover:text-electric/80"
        >
          LAUNCH SCANNER
        </Link>
        <a
          href="https://github.com/ananyaa-k/BreachMap"
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-[13px] tracking-wide transition-colors hover:text-electric"
          style={{ color: 'rgba(224,240,255,0.45)' }}
        >
          GITHUB ↗
        </a>
        <a
          href="#methodology"
          className="font-body text-[13px] px-4 py-2 rounded-md text-electric transition-colors hover:bg-electric/10"
          style={{ border: '1px solid rgba(14,165,233,0.4)' }}
        >
          VIEW DOCS
        </a>
      </div>
    </nav>
  );
};

export default Navigation;
