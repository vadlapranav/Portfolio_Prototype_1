import { motion } from 'framer-motion';
import { FiBriefcase, FiCalendar, FiChevronRight } from 'react-icons/fi';

const contributions = [
  'Built LLM-based phishing simulation system with dynamic email generation',
  'Developed Cyber Threat Intelligence pipeline for URL/IP analysis',
  'Implemented sandbox-based dynamic detection using Playwright',
  'Designed hybrid ML + rule-based threat classification system',
];

const impacts = [
  { label: 'Real campaign deployment', icon: '🚀' },
  { label: '40% faster detection', icon: '⚡' },
  { label: 'Improved accuracy & reduced false positives', icon: '🎯' },
];

export default function InternshipSection() {
  return (
    <section id="internship" className="relative">
      <div className="section-container">
        {/* Section Label */}
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span
            className="text-neon-green text-xs tracking-widest"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            03 // EXPERIENCE
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-neon-green/40 to-transparent" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main card */}
          <motion.div
            className="md:col-span-2 pixel-border rounded-xl bg-bg-card p-6 md:p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="flex flex-wrap items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center">
                <FiBriefcase className="text-neon-green" size={20} />
              </div>
              <div className="flex-1">
                <h3
                  className="text-sm md:text-base text-neon-green mb-1"
                  style={{ fontFamily: 'var(--font-pixel)' }}
                >
                  CYBERGUARD360
                </h3>
                <p className="text-text-secondary" style={{ fontFamily: 'var(--font-retro)', fontSize: '1.2rem' }}>
                  Research Development Intern
                </p>
                <div className="flex items-center gap-2 text-text-muted text-sm mt-1" style={{ fontFamily: 'var(--font-retro)' }}>
                  <FiCalendar size={12} />
                  <span>Jul 2024 — Dec 2025</span>
                </div>
              </div>
            </div>

            {/* Contributions */}
            <div className="mb-6">
              <h4
                className="text-xs text-text-muted tracking-wider mb-3"
                style={{ fontFamily: 'var(--font-pixel)' }}
              >
                WHAT I BUILT
              </h4>
              <ul className="space-y-3">
                {contributions.map((item, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-3 text-text-secondary"
                    style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * i }}
                  >
                    <FiChevronRight className="text-neon-green mt-1 flex-shrink-0" size={14} />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Impact */}
            <div>
              <h4
                className="text-xs text-text-muted tracking-wider mb-3"
                style={{ fontFamily: 'var(--font-pixel)' }}
              >
                IMPACT
              </h4>
              <div className="flex flex-wrap gap-3">
                {impacts.map((item, i) => (
                  <motion.div
                    key={i}
                    className="pixel-border rounded-lg bg-bg-dark px-4 py-2.5 flex items-center gap-2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.2 + 0.1 * i }}
                  >
                    <span>{item.icon}</span>
                    <span className="text-sm text-text-secondary" style={{ fontFamily: 'var(--font-retro)', fontSize: '1rem' }}>
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Side visual */}
          <motion.div
            className="hidden md:flex flex-col items-center justify-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="pixel-border rounded-lg p-3 bg-bg-card -rotate-2 hover:rotate-0 transition-transform duration-300">
              <img
                src="/assets/memes/shocked meme , use it near my intership period so that i they can relate i did something big.jpeg"
                alt="shocked"
                className="w-36 h-36 object-cover rounded"
              />
              <p
                className="text-center text-neon-green mt-2 text-xs"
                style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.45rem' }}
              >
                them after seeing my work
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
