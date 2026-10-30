import { motion } from 'framer-motion';
import { useMemo } from 'react';
import PropTypes from 'prop-types';

function Star({ style }) {
  const duration = 2 + Math.random() * 4;
  return (
    <motion.div
      className="absolute rounded-full bg-white"
      style={style}
      animate={{ opacity: [0.2, 1, 0.2] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}
Star.propTypes = { style: PropTypes.object.isRequired };

export default function HeroSection({ onStart }) {
  const stars = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${1 + Math.random() * 2}px`,
        height: `${1 + Math.random() * 2}px`,
      },
    }));
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-bg-dark overflow-hidden z-50"
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      onClick={onStart}
      style={{ cursor: 'url(/assets/cursor/mog2.jpg) 16 16, pointer' }}
    >
      {/* Stars */}
      {stars.map(star => (
        <Star key={star.id} style={star.style} />
      ))}

      {/* Scanline overlay */}
      <div className="absolute inset-0 scanlines opacity-30" />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        {/* Pixel art border frame */}
        <div className="inline-block p-8 md:p-12 pixel-border rounded-lg bg-bg-dark/80 backdrop-blur-sm">
          {/* Level indicator */}
          <motion.p
            className="text-neon-green text-xs md:text-sm mb-6 tracking-widest"
            style={{ fontFamily: 'var(--font-pixel)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            LEVEL 1 — PORTFOLIO LOADED
          </motion.p>

          {/* Name */}
          <motion.h1
            className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 text-glow-blue"
            style={{ fontFamily: 'var(--font-pixel)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <span className="text-neon-blue">VADLA</span>{' '}
            <span className="text-white">PRANAV</span>
          </motion.h1>

          {/* Title */}
          <motion.p
            className="text-lg md:text-2xl text-text-secondary mb-2"
            style={{ fontFamily: 'var(--font-retro)', letterSpacing: '0.1em' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            Full Stack · Machine Learning · DevOps
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-text-muted mb-8"
            style={{ fontFamily: 'var(--font-retro)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Building real-world systems, not just projects.
          </motion.p>

          {/* Start prompt */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <p
              className="text-neon-green text-xs md:text-sm blink tracking-wider"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              ▶ CLICK ANYWHERE TO START ◀
            </p>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-4 text-text-muted text-xs"
          style={{ fontFamily: 'var(--font-pixel)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <span>♥ ♥ ♥</span>
          <span>COINS: 99</span>
          <span>WORLD 1-1</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
HeroSection.propTypes = { onStart: PropTypes.func.isRequired };
