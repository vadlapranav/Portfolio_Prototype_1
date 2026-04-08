import { AnimatePresence, motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const colorAccent = {
  blue: 'text-neon-blue',
  green: 'text-neon-green',
  gold: 'text-gold',
};

const colorBorder = {
  blue: 'border-neon-blue/20',
  green: 'border-neon-green/20',
  gold: 'border-gold/20',
};

const colorBg = {
  blue: 'bg-neon-blue/5',
  green: 'bg-neon-green/5',
  gold: 'bg-gold/5',
};

export default function ProjectModal({ project, onClose }) {
  if (!project) return null;

  const accent = colorAccent[project.color] || colorAccent.blue;
  const border = colorBorder[project.color] || colorBorder.blue;
  const bg = colorBg[project.color] || colorBg.blue;

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-bg-card pixel-border rounded-xl p-6 md:p-8"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors interactive p-1"
              onClick={onClose}
            >
              <FiX size={20} />
            </button>

            {/* Special badge */}
            {project.special && (
              <div
                className="inline-block bg-gold/15 text-gold px-3 py-1 rounded-full text-xs border border-gold/30 mb-4"
                style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.55rem' }}
              >
                🏆 HACKATHON WINNER — 2ND RUNNER-UP
              </div>
            )}

            {/* Title */}
            <h2
              className={`text-base md:text-lg mb-1 ${accent}`}
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              {project.title}
            </h2>
            <p className="text-text-muted mb-6" style={{ fontFamily: 'var(--font-retro)', fontSize: '1.2rem' }}>
              {project.subtitle}
            </p>

            {/* Placeholder visual */}
            <div className={`w-full h-48 rounded-lg ${bg} border ${border} flex items-center justify-center mb-6`}>
              <p className="text-text-muted text-sm" style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.55rem' }}>
                [ PROJECT VISUAL — COMING SOON ]
              </p>
            </div>

            {/* Problem */}
            <div className="mb-5">
              <h3
                className="text-xs mb-2 text-text-muted tracking-wider"
                style={{ fontFamily: 'var(--font-pixel)' }}
              >
                THE PROBLEM
              </h3>
              <p className="text-text-secondary leading-relaxed" style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>
                {project.problem}
              </p>
            </div>

            {/* Solution */}
            <div className="mb-5">
              <h3
                className="text-xs mb-2 text-text-muted tracking-wider"
                style={{ fontFamily: 'var(--font-pixel)' }}
              >
                THE SOLUTION
              </h3>
              <p className="text-text-secondary leading-relaxed" style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>
                {project.solution}
              </p>
            </div>

            {/* Impact */}
            <div className="mb-5">
              <h3
                className="text-xs mb-2 text-text-muted tracking-wider"
                style={{ fontFamily: 'var(--font-pixel)' }}
              >
                IMPACT
              </h3>
              <ul className="space-y-2">
                {project.impact.map((item, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-2 text-sm ${accent}`}
                    style={{ fontFamily: 'var(--font-retro)', fontSize: '1.1rem' }}
                  >
                    <span className="text-xs mt-1">▸</span>
                    <span className="text-text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack */}
            <div>
              <h3
                className="text-xs mb-3 text-text-muted tracking-wider"
                style={{ fontFamily: 'var(--font-pixel)' }}
              >
                TECH STACK
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map(tech => (
                  <span
                    key={tech}
                    className={`px-3 py-1 rounded text-xs border ${
                      project.color === 'gold'
                        ? 'bg-gold/10 text-gold border-gold/20'
                        : project.color === 'green'
                        ? 'bg-neon-green/10 text-neon-green border-neon-green/20'
                        : 'bg-neon-blue/10 text-neon-blue border-neon-blue/20'
                    }`}
                    style={{ fontFamily: 'var(--font-retro)' }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
