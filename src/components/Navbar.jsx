import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'internship', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Determine active section
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] && sections[i].offsetTop <= scrollPos) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-bg-dark/90 backdrop-blur-md border-b border-border-pixel' : 'bg-transparent'
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-neon-blue font-bold text-sm interactive"
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          VP<span className="text-neon-green">.</span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`relative text-sm transition-colors interactive ${
                activeSection === item.id ? 'text-neon-blue' : 'text-text-secondary hover:text-white'
              }`}
              style={{ fontFamily: 'var(--font-retro)', fontSize: '1.1rem' }}
            >
              {item.label}
              {activeSection === item.id && (
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neon-blue"
                  layoutId="nav-underline"
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1 interactive p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <motion.span
            className="block w-5 h-0.5 bg-neon-blue"
            animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
          />
          <motion.span
            className="block w-5 h-0.5 bg-neon-blue"
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
          />
          <motion.span
            className="block w-5 h-0.5 bg-neon-blue"
            animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden bg-bg-dark/95 backdrop-blur-md border-b border-border-pixel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`text-left py-2 text-sm transition-colors interactive ${
                    activeSection === item.id ? 'text-neon-blue' : 'text-text-secondary'
                  }`}
                  style={{ fontFamily: 'var(--font-retro)', fontSize: '1.2rem' }}
                >
                  {activeSection === item.id ? '▶ ' : '  '}{item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
