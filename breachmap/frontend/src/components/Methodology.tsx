import { motion } from 'framer-motion';

const steps = [
  { label: 'INPUT', desc: 'PHP/Python codebase is scanned recursively for security-sensitive patterns' },
  { label: 'ANALYSIS', desc: 'Pattern matching against OWASP WSTG test cases with contextual analysis' },
  { label: 'REPORT', desc: 'Structured output with vulnerability type, severity, and WSTG mapping' },
];

const Methodology = () => {
  return (
    <section id="methodology" className="py-24 px-6 blueprint-grid">
      <div className="max-w-5xl mx-auto">
        <span className="font-mono-tech text-xs uppercase tracking-widest text-electric mb-3 block text-center">
          METHODOLOGY
        </span>
        <h2 className="font-display font-bold text-4xl md:text-[52px] text-foreground mb-16 leading-tight text-center">
          How It Works
        </h2>

        <div className="flex flex-col md:flex-row items-stretch gap-0">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center flex-1">
              <motion.div
                className="corner-marks corner-marks-bottom p-6 flex-1"
                style={{ border: '1px dashed rgba(30,77,140,0.6)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                viewport={{ once: true }}
              >
                <span className="font-mono-tech text-[11px] text-electric tracking-widest block mb-3">
                  STEP {i + 1}
                </span>
                <h3 className="font-display font-bold text-2xl text-foreground mb-2">{step.label}</h3>
                <p className="font-body text-sm" style={{ color: 'rgba(224,240,255,0.45)' }}>{step.desc}</p>
              </motion.div>
              {i < steps.length - 1 && (
                <div className="hidden md:flex items-center px-2">
                  <div className="w-8 border-t border-dashed border-electric" />
                  <span className="text-electric text-lg">→</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Methodology;
