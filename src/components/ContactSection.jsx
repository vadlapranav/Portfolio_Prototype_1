import { motion } from 'framer-motion';
import { FiMail, FiGithub, FiLinkedin, FiPhone, FiDownload } from 'react-icons/fi';

const links = [
  { icon: FiMail, label: 'vadlapranav91@gmail.com', href: 'mailto:vadlapranav91@gmail.com' },
  { icon: FiGithub, label: 'github.com/vadlapranav', href: 'https://github.com/vadlapranav' },
  { icon: FiLinkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/vadla-pranav-2b3a64302' },
  { icon: FiPhone, label: '+91-8790985088', href: 'tel:+918790985088' },
];

export default function ContactSection() {
  return (
    <section id="contact" className="relative">
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
            05 // CONTACT
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-neon-green/40 to-transparent" />
        </motion.div>

        {/* Main content */}
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            className="text-lg md:text-xl text-neon-blue mb-4"
            style={{ fontFamily: 'var(--font-pixel)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            GAME OVER?
          </motion.h2>

          <motion.p
            className="text-text-secondary mb-2"
            style={{ fontFamily: 'var(--font-retro)', fontSize: '1.5rem' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Nah. Let’s build something that actually works.
          </motion.p>

          <motion.p
            className="text-text-muted mb-8 text-sm"
            style={{ fontFamily: 'var(--font-body)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Looking for internships, collaborations, or just want to nerd out about ML and systems.
          </motion.p>

          {/* Contact Links */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            {links.map((link, i) => (
              <motion.a
                key={i}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-2 px-4 py-2.5 pixel-border rounded-lg bg-bg-card text-text-secondary hover:text-neon-blue hover:border-neon-blue/30 transition-all duration-300 interactive hover:shadow-[0_0_20px_rgba(0,212,255,0.15)]"
                style={{ fontFamily: 'var(--font-retro)', fontSize: '1rem' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <link.icon size={16} />
                <span className="text-sm">{link.label}</span>
              </motion.a>
            ))}
          </motion.div>

          {/* Resume Button */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <motion.a
              href="/assets/resume.pdf"
              download
              className="inline-flex items-center gap-2 px-6 py-3 bg-neon-blue/10 border-2 border-neon-blue/40 rounded-lg text-neon-blue hover:bg-neon-blue/20 hover:border-neon-blue/60 transition-all duration-300 interactive glow-blue"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.65rem' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiDownload size={14} />
              Download Resume
            </motion.a>
          </motion.div>

          {/* End memes */}
          <motion.div
            className="flex justify-center items-center gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <div className="pixel-border rounded-lg p-2 bg-bg-card rotate-3 hover:rotate-0 transition-transform duration-300">
              <img
                src="/assets/memes/this is a requesting pic so use it  at the end like get me a job or a internship would be good .jpg"
                alt="hire me"
                className="w-20 h-20 object-cover rounded"
              />
            </div>
            <div className="pixel-border rounded-lg p-2 bg-bg-card -rotate-2 hover:rotate-0 transition-transform duration-300">
              <img
                src="/assets/memes/use it at the end the picture represnts a heart  as u can see .jpg"
                alt="heart"
                className="w-20 h-20 object-cover rounded"
              />
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="pt-8 border-t border-border-pixel"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-text-muted text-xs" style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.5rem' }}>
              DESIGNED & BUILT BY VADLA PRANAV
            </p>
            <p className="text-text-muted/50 text-xs mt-2" style={{ fontFamily: 'var(--font-retro)' }}>
              ♥ ♥ ♥ — Thanks for playing — ♥ ♥ ♥
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
