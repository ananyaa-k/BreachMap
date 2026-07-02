import { motion } from 'framer-motion';
import { useState } from 'react';

const cards = [
  { title: 'SQL Injection', desc: 'Detects concatenated queries, unparameterized inputs across PHP/Python' },
  { title: 'Cross-Site Scripting', desc: 'Unescaped output, DOM manipulation vulnerabilities, reflected/stored' },
  { title: 'Authentication Flaws', desc: 'Weak session handling, insecure credential storage, bypass vectors' },
  { title: 'OWASP WSTG Mapping', desc: 'Every finding tagged to WSTG test case ID for compliance reporting' },
];

const ScanCard = ({ title, desc, index }: { title: string; desc: string; index: number }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    setRotate({ x, y });
  };

  return (
    <motion.div
      className="relative p-6 rounded-lg bg-background cursor-default"
      style={{
        border: '1px solid rgba(30,77,140,0.4)',
        borderLeft: '3px solid hsl(199 89% 48%)',
        perspective: '1000px',
        transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
      onMouseMove={handleMouse}
      onMouseLeave={() => setRotate({ x: 0, y: 0 })}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      {/* Corner mark top-right */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r" style={{ borderColor: 'rgba(14,165,233,0.6)' }} />
      
      <h3 className="font-display font-bold text-xl text-foreground mb-2">{title}</h3>
      <p className="font-body text-sm" style={{ color: 'rgba(224,240,255,0.45)' }}>{desc}</p>
    </motion.div>
  );
};

const ScanTypes = () => {
  return (
    <section className="py-24 px-6 bg-blueprint-dark">
      <div className="max-w-4xl mx-auto">
        <span className="font-mono-tech text-xs uppercase tracking-widest text-electric mb-3 block">
          DETECTION COVERAGE
        </span>
        <h2 className="font-display font-bold text-4xl md:text-[52px] text-foreground mb-12 leading-tight">
          What BreachMap Finds
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cards.map((c, i) => (
            <ScanCard key={i} title={c.title} desc={c.desc} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScanTypes;
