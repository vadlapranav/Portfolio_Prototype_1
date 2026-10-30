import { motion } from 'framer-motion';
import { skillCategories } from '../data/skills';

export default function SkillsSection() {
  return (
    <section id="skills" className="relative">
      <div className="section-container">
        {/* Section Label */}
        <motion.div
          className="flex items-center gap-3 mb-4"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span
            className="text-neon-blue text-xs tracking-widest"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            04 // SKILLS
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-neon-blue/40 to-transparent" />
        </motion.div>

        <div className="flex flex-wrap items-center gap-4 mb-10">
          <motion.p
            className="text-text-secondary max-w-lg"
            style={{ fontFamily: 'var(--font-retro)', fontSize: '1.2rem' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Skill tree unlocked. Here’s what I’ve leveled up so far.
          </motion.p>
        </div>

        {/* Skill Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.name}
              className="pixel-border rounded-xl bg-bg-card p-5"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: catIndex * 0.1 }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl">{category.icon}</span>
                <h3
                  className={`text-xs ${category.color === 'neon-green' ? 'text-neon-green' : 'text-neon-blue'}`}
                  style={{ fontFamily: 'var(--font-pixel)' }}
                >
                  {category.name}
                </h3>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skill}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-all duration-300 interactive ${
                      category.color === 'neon-green'
                        ? 'bg-neon-green/5 text-neon-green/80 border-neon-green/15 hover:bg-neon-green/15 hover:border-neon-green/30 hover:text-neon-green hover:shadow-[0_0_15px_rgba(57,255,20,0.2)]'
                        : 'bg-neon-blue/5 text-neon-blue/80 border-neon-blue/15 hover:bg-neon-blue/15 hover:border-neon-blue/30 hover:text-neon-blue hover:shadow-[0_0_15px_rgba(0,212,255,0.2)]'
                    }`}
                    style={{ fontFamily: 'var(--font-retro)', fontSize: '1rem' }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: catIndex * 0.1 + skillIndex * 0.05 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chill meme */}
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="pixel-border rounded-lg p-2 bg-bg-card inline-flex items-center gap-3 px-4">
            <img
              src="/assets/memes/this a picture that represents chilll bro u can use it near skills or u can use it near one of my projects ex solar rc car.jpg"
              alt="chill"
              className="w-10 h-10 rounded object-cover"
            />
            <p className="text-text-muted text-xs" style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.45rem' }}>
              “just vibing with my stack”
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
