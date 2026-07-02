import { motion } from 'framer-motion';

const GitHubCTA = () => {
  return (
    <section className="py-28 px-6 bg-blueprint-dark">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          className="font-display font-bold text-4xl md:text-[56px] text-foreground mb-8 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Open Source.<br />Audit everything.
        </motion.h2>
        <motion.div
          className="flex gap-4 justify-center flex-wrap"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <a
            href="https://github.com/ananyaa-k/BreachMap"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display font-semibold text-sm bg-electric text-primary-foreground px-7 py-3.5 rounded-md hover:brightness-110 transition"
          >
            VIEW ON GITHUB
          </a>
          <a
            href="https://owasp.org/www-project-web-security-testing-guide/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display font-semibold text-sm text-electric px-7 py-3.5 rounded-md transition hover:bg-electric/10"
            style={{ border: '1px solid rgba(14,165,233,0.4)' }}
          >
            OWASP WSTG ↗
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default GitHubCTA;
