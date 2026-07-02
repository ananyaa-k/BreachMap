import { motion } from 'framer-motion';
import VulnerabilityGrid from './VulnerabilityGrid';
import { Link } from 'react-router-dom';

const headlines = ['Map Every', 'Vulnerability.', 'Miss Nothing.'];

const Hero = () => {
  return (
    <section className="min-h-screen blueprint-grid corner-marks corner-marks-bottom flex flex-col items-center justify-center px-6 pt-16 relative">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-mono-tech text-[10px] tracking-widest px-3 py-1 mb-8 text-electric"
          style={{ border: '1px solid rgba(14,165,233,0.3)', borderRadius: '4px' }}
        >
          OWASP WSTG COMPLIANT
        </motion.div>

        {/* Headline */}
        <div className="mb-6">
          {headlines.map((line, i) => (
            <motion.h1
              key={i}
              className="font-display font-bold text-5xl md:text-7xl lg:text-[76px] leading-[0.95] text-foreground"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.2 }}
            >
              {line}
            </motion.h1>
          ))}
        </div>

        {/* Subtext */}
        <motion.p
          className="font-body text-lg max-w-[540px] mb-10"
          style={{ color: 'rgba(224,240,255,0.45)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          BreachMap performs automated OWASP code review across PHP and Python codebases — mapping vulnerabilities to WSTG test cases and generating structured security reports.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex gap-4 items-center flex-wrap justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.2 }}
        >
          <Link
            to="/scan"
            className="font-display font-semibold text-sm bg-electric text-primary-foreground px-7 py-3.5 rounded-md hover:brightness-110 transition"
          >
            LAUNCH SCANNER
          </Link>
          <a
            href="#methodology"
            className="font-display font-semibold text-sm text-electric px-7 py-3.5 hover:bg-electric/10 rounded-md transition"
          >
            SEE METHODOLOGY →
          </a>
        </motion.div>

        <VulnerabilityGrid />
      </div>
    </section>
  );
};

export default Hero;
