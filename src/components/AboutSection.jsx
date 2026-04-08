import { motion } from 'framer-motion';

export default function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden">
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
            01 // ABOUT
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-neon-green/40 to-transparent" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Main Text */}
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2
              className="text-xl md:text-2xl text-neon-blue mb-6"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              WHO AM I?
            </h2>

            <div className="space-y-4 text-text-secondary leading-relaxed" style={{ fontFamily: 'var(--font-retro)', fontSize: '1.3rem' }}>
              <p>
                Hey! I'm <span className="text-white font-semibold">Pranav</span> — a developer who
                builds things that actually work in the real world.
              </p>
              <p>
                I don't just write code. I build{' '}
                <span className="text-neon-blue">phishing simulations that fool real employees</span>,{' '}
                <span className="text-neon-green">threat intelligence pipelines that catch malware</span>,
                and{' '}
                <span className="text-neon-blue">self-driving cars powered by solar panels</span>.
              </p>
              <p>
                My stack? <span className="text-white">Full Stack + ML + DevOps</span>. I go from
                training models to deploying them. From Flask APIs to production pipelines.
                From Raspberry Pi to cloud infrastructure.
              </p>
              <p className="text-text-muted italic">
                "If it solves a problem, I'll learn whatever it takes to build it."
              </p>
            </div>

            {/* Stats bar */}
            <motion.div
              className="mt-8 flex flex-wrap gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {[
                { label: 'Projects', value: '10+' },
                { label: 'Hackathons', value: '3+' },
                { label: 'Campaigns', value: '3+' },
                { label: 'Hours Debugging', value: '∞' },
              ].map((stat, i) => (
                <div key={i} className="pixel-border rounded-lg px-4 py-3 bg-bg-card">
                  <p className="text-neon-blue text-lg font-bold" style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.9rem' }}>{stat.value}</p>
                  <p className="text-text-muted text-xs mt-1" style={{ fontFamily: 'var(--font-retro)' }}>{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Meme / Visual side */}
          <motion.div
            className="hidden md:flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="pixel-border rounded-lg p-3 bg-bg-card rotate-2 hover:rotate-0 transition-transform duration-300">
              <img
                src="/assets/memes/Baby holding laugh meme on Tiktok(use for elevation or to grab attention or use it near the intership period cuz it syncs well).jpeg"
                alt="mood"
                className="w-48 h-48 object-cover rounded"
              />
              <p
                className="text-center text-neon-green mt-2 text-xs"
                style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.5rem' }}
              >
                me after deploying
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
