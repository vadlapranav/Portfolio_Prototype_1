import { useState } from 'react';
import { motion } from 'framer-motion';
import { projects } from '../data/projects';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section id="projects" className="relative">
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
            02 // PROJECTS
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-neon-blue/40 to-transparent" />
        </motion.div>

        <motion.p
          className="text-text-secondary mb-10 max-w-xl"
          style={{ fontFamily: 'var(--font-retro)', fontSize: '1.2rem' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Not toy projects. Real systems, real deployments, real impact.
        </motion.p>

        {/* Project Grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
