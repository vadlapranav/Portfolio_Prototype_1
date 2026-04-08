import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const IDLE_TIMEOUT = 30000; // 30 seconds

export default function IdleDetector() {
  const [isIdle, setIsIdle] = useState(false);

  const resetTimer = useCallback(() => {
    setIsIdle(false);
  }, []);

  useEffect(() => {
    let timer;

    const startTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setIsIdle(true), IDLE_TIMEOUT);
    };

    const handleActivity = () => {
      resetTimer();
      startTimer();
    };

    // Listen to user activity
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('click', handleActivity);

    startTimer();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [resetTimer]);

  return (
    <AnimatePresence>
      {isIdle && (
        <motion.div
          className="fixed bottom-6 right-6 z-30 pixel-border rounded-lg bg-bg-card/95 backdrop-blur-sm p-4 flex items-center gap-3 max-w-xs"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.4 }}
          onClick={resetTimer}
          style={{ cursor: 'url(/assets/cursor/mog2.jpg) 16 16, pointer' }}
        >
          <img
            src="/assets/memes/this represents a timeout type  meme so, we can use it near a project.jpg"
            alt="idle"
            className="w-12 h-12 rounded object-cover flex-shrink-0"
          />
          <div>
            <p
              className="text-neon-blue text-xs mb-1"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.5rem' }}
            >
              STILL THERE?
            </p>
            <p className="text-text-muted text-xs" style={{ fontFamily: 'var(--font-retro)', fontSize: '0.9rem' }}>
              Don't leave me hanging... Scroll around!
            </p>
          </div>

          {/* Floating Z's */}
          <motion.span
            className="absolute -top-2 -right-2 text-neon-blue text-lg"
            animate={{ y: [-2, -8, -2], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            z
          </motion.span>
          <motion.span
            className="absolute -top-4 right-2 text-neon-green text-sm"
            animate={{ y: [-2, -10, -2], opacity: [0.8, 0.3, 0.8] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            z
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
