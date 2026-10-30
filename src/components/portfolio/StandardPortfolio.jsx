import { FiArrowRight } from "react-icons/fi";
import PropTypes from "prop-types";
import { profile } from "../../data/portfolio";
import {
  AboutContent,
  ContactContent,
  ExperienceContent,
  ProjectList,
  SkillsContent,
  ResumeLink,
} from "./PortfolioContent";

export default function StandardPortfolio({ onProject, onExplore, fallback }) {
  return (
    <main id="portfolio" className="standard-portfolio">
      {fallback && (
        <p role="status" className="fallback-notice">
          The 3D universe couldn’t launch on this device. The complete portfolio
          is ready below.
        </p>
      )}
      <section className="standard-intro">
        <p className="eyebrow">THE HUMAN BEHIND THE UNIVERSE</p>
        <h1>
          Vadla Pranav
          <span>
            Engineering things
            <br />
            that make a difference.
          </span>
        </h1>
        <p>{profile.summary}</p>
        <div className="button-row">
          <ResumeLink />
          <button className="button button-ghost" onClick={onExplore}>
            Explore the universe <FiArrowRight />
          </button>
        </div>
      </section>
      <nav className="standard-nav" aria-label="Portfolio navigation">
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#experience">Experience</a>
        <a href="#skills">Skills</a>
        <a href="#contact">Contact</a>
      </nav>
      <section id="about" className="standard-section">
        <div className="section-heading">
          <p className="eyebrow">01 / THE ORIGIN</p>
          <h2>A little about me.</h2>
        </div>
        <AboutContent />
      </section>
      <section id="projects" className="standard-section">
        <div className="section-heading">
          <p className="eyebrow">02 / SELECTED WORK</p>
          <h2>Built to solve something.</h2>
        </div>
        <ProjectList onProject={onProject} />
      </section>
      <section id="experience" className="standard-section">
        <div className="section-heading">
          <p className="eyebrow">03 / PROFESSIONAL LORE</p>
          <h2>The journey so far.</h2>
        </div>
        <ExperienceContent />
      </section>
      <section id="skills" className="standard-section">
        <div className="section-heading">
          <p className="eyebrow">04 / THE TECH TREE</p>
          <h2>Tools of the trade.</h2>
        </div>
        <SkillsContent />
      </section>
      <section id="contact" className="standard-section">
        <div className="section-heading">
          <p className="eyebrow">05 / NEXT MISSION</p>
          <h2>Let’s build something.</h2>
        </div>
        <ContactContent />
      </section>
      <footer className="standard-footer">
        <span>DESIGNED & BUILT BY VADLA PRANAV</span>
        <span>
          A ridiculous little universe. A serious engineer’s portfolio.
        </span>
      </footer>
    </main>
  );
}
StandardPortfolio.propTypes = {
  onProject: PropTypes.func.isRequired,
  onExplore: PropTypes.func.isRequired,
  fallback: PropTypes.bool,
};
