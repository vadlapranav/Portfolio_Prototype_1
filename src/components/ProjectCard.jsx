import { motion } from 'framer-motion';

const colorMap = {
  blue: {
    border: 'border-neon-blue/30',
    shadow: '0 0 25px rgba(0,212,255,0.15)',
    hoverShadow: '0 0 35px rgba(0,212,255,0.3), 0 0 60px rgba(0,212,255,0.1)',
    tag: 'bg-neon-blue/10 text-neon-blue border-neon-blue/20',
    accent: 'text-neon-blue',
  },
  green: {
    border: 'border-neon-green/30',
    shadow: '0 0 25px rgba(57,255,20,0.15)',
    hoverShadow: '0 0 35px rgba(57,255,20,0.3), 0 0 60px rgba(57,255,20,0.1)',
    tag: 'bg-neon-green/10 text-neon-green border-neon-green/20',
    accent: 'text-neon-green',
  },
  gold: {
    border: 'border-gold/30',
    shadow: '0 0 25px rgba(255,215,0,0.15)',
    hoverShadow: '0 0 35px rgba(255,215,0,0.3), 0 0 60px rgba(255,215,0,0.1)',
    tag: 'bg-gold/10 text-gold border-gold/20',
    accent: 'text-gold',
  },
};

export default function ProjectCard({ project, index, onClick }) {
  const colors = colorMap[project.color] || colorMap.blue;

  return (
    <motion.div
      className={`relative group pixel-border rounded-xl bg-bg-card p-6 interactive overflow-hidden ${colors.border}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, boxShadow: colors.hoverShadow }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{ boxShadow: colors.shadow }}
    >
      {/* Special badge for MedFusion */}
      {project.special && (
        <div
          className="absolute top-3 right-3 bg-gold/20 text-gold px-3 py-1 rounded-full text-xs border border-gold/30"
          style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.5rem' }}
        >
          🏆 FEATURED
        </div>
      )}

      {/* Hover glow overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${project.color === 'gold' ? 'rgba(255,215,0,0.05)' : project.color === 'green' ? 'rgba(57,255,20,0.05)' : 'rgba(0,212,255,0.05)'}, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <h3
          className={`text-sm md:text-base mb-1 ${colors.accent}`}
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          {project.title}
        </h3>
        <p className="text-text-muted text-sm mb-3" style={{ fontFamily: 'var(--font-retro)', fontSize: '1.1rem' }}>
          {project.subtitle}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-4" style={{ fontFamily: 'var(--font-body)' }}>
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2">
          {project.techStack.slice(0, 4).map(tech => (
            <span
              key={tech}
              className={`px-2 py-1 rounded text-xs border ${colors.tag}`}
              style={{ fontFamily: 'var(--font-retro)' }}
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="px-2 py-1 rounded text-xs text-text-muted border border-border-pixel"
              style={{ fontFamily: 'var(--font-retro)' }}>
              +{project.techStack.length - 4}
            </span>
          )}
        </div>

        {/* Click hint */}
        <motion.p
          className="mt-4 text-xs text-text-muted opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.5rem' }}
        >
          ▶ CLICK TO EXPLORE
        </motion.p>
      </div>
    </motion.div>
  );
}
