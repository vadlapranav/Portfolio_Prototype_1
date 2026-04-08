import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import HeroSection from './components/HeroSection';
import Navbar from './components/Navbar';
import AboutSection from './components/AboutSection';
import ProjectsSection from './components/ProjectsSection';
import InternshipSection from './components/InternshipSection';
import SkillsSection from './components/SkillsSection';
import ContactSection from './components/ContactSection';
import IdleDetector from './components/IdleDetector';

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="min-h-screen bg-bg-dark">
      <AnimatePresence mode="wait">
        {!gameStarted ? (
          <HeroSection key="hero" onStart={() => setGameStarted(true)} />
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Navbar />
            <main>
              <AboutSection />
              <ProjectsSection />
              <InternshipSection />
              <SkillsSection />
              <ContactSection />
            </main>
            <IdleDetector />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
