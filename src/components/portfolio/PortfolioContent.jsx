import { useState } from "react";
import MemeImage from "../memes/MemeImage";
import { useSound } from "../../hooks/useSound";
import PropTypes from "prop-types";
import {
  FiArrowUpRight,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiDownload,
  FiPhone,
} from "react-icons/fi";
import { projects } from "../../data/projects";
import { skillCategories } from "../../data/skills";
import {
  profile,
  experience,
  education,
  discoveries,
} from "../../data/portfolio";

export function ResumeLink({ compact = false }) {
  return (
    <a
      className={compact ? "text-link" : "button button-light"}
      href={profile.resume}
      target="_blank"
      rel="noopener noreferrer"
    >
      <FiDownload /> <span>Résumé</span>
      {!compact && <FiArrowUpRight />}
    </a>
  );
}

export function ContactLinks() {
  return (
    <div className="contact-links">
      <a href={`mailto:${profile.email}`}>
        <FiMail />
        <span>{profile.email}</span>
        <FiArrowUpRight />
      </a>
      <a href={profile.github} target="_blank" rel="noopener noreferrer">
        <FiGithub />
        <span>GitHub / vadlapranav</span>
        <FiArrowUpRight />
      </a>
      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
        <FiLinkedin />
        <span>LinkedIn / Vadla Pranav</span>
        <FiArrowUpRight />
      </a>
      <a href={`tel:${profile.phone.replace(/[^+\d]/g, "")}`}>
        <FiPhone />
        <span>{profile.phone}</span>
        <FiArrowUpRight />
      </a>
    </div>
  );
}

export function ProjectDiagram({ id }) {
  const routes = id === "logistics";
  const labels = routes
    ? ["ORDERS", "CONSTRAINTS", "FEASIBLE TRIPS"]
    : id === "phishing"
      ? ["CONTEXT", "LLM ENGINE", "CAMPAIGN ANALYTICS"]
      : id === "url-classifier"
        ? ["URL / IP", "RULES + ML", "BEHAVIOR ANALYSIS"]
        : id === "rc-car"
          ? ["CAMERA", "CNN + SENSORS", "MOTOR CONTROL"]
          : ["HEALTH DATA", "PIPELINES", "OUTBREAK MAP"];
  return (
    <div className={`project-diagram diagram-${id}`}>
      <span className="eyebrow">
        {routes ? "ILLUSTRATIVE ROUTE NETWORK" : "SYSTEM AT A GLANCE"}
      </span>
      <svg
        viewBox="0 0 600 150"
        role="img"
        aria-label={
          routes
            ? "Illustrative network connecting orders to a central depot, not customer locations"
            : labels.join(" to ")
        }
      >
        <defs>
          <linearGradient id={`line-${id}`}>
            <stop stopColor="#78d8c7" />
            <stop offset="1" stopColor="#9b91e8" />
          </linearGradient>
        </defs>
        {routes ? (
          <>
            <path
              className="route-line"
              d="M70 40L175 100L290 65L408 115L530 45M175 100L110 135M290 65L340 15M408 115L490 140M290 65L430 35"
              fill="none"
              stroke={`url(#line-${id})`}
              strokeWidth="2"
            />
            {[
              [70, 40],
              [175, 100],
              [110, 135],
              [340, 15],
              [408, 115],
              [530, 45],
              [490, 140],
              [430, 35],
            ].map(([x, y]) => (
              <g key={`${x}-${y}`}>
                <circle cx={x} cy={y} r="9" fill="#122e37" stroke="#78d8c7" />
                <circle cx={x} cy={y} r="3" fill="#a7ffdf" />
              </g>
            ))}
            <circle cx="290" cy="65" r="23" fill="#89e4ce" />
            <path
              d="M280 72V59L290 52L300 59V72ZM287 72V63H293V72"
              stroke="#0b272b"
              fill="none"
              strokeWidth="2"
            />
          </>
        ) : (
          <>
            <path
              d="M100 75H500"
              stroke={`url(#line-${id})`}
              strokeWidth="2"
              strokeDasharray="5 8"
            />
            {[100, 300, 500].map((x, i) => (
              <g key={x}>
                <rect
                  x={x - 28}
                  y="47"
                  width="56"
                  height="56"
                  rx="15"
                  fill="#142536"
                  stroke="#82baba"
                />
                <text
                  x={x}
                  y="83"
                  textAnchor="middle"
                  fill="#bde9e4"
                  fontFamily="monospace"
                  fontSize="23"
                >
                  {["⌁", "⟐", "◎"][i]}
                </text>
              </g>
            ))}
          </>
        )}
      </svg>
      <div className="diagram-labels">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}

export function ProjectDetails({ project }) {
  return (
    <article className="project-detail">
      <p className="eyebrow">{project.subtitle}</p>
      <h2>{project.title}</h2>
      <p className="lead">{project.description}</p>
      <ProjectDiagram id={project.id} />
      <div className="detail-columns">
        <section>
          <h3>The problem</h3>
          <p>{project.problem}</p>
        </section>
        <section>
          <h3>What I built</h3>
          <p>{project.solution}</p>
        </section>
      </div>
      <section>
        <h3>
          {project.id === "logistics"
            ? "Synthetic test results"
            : "Documented outcomes"}
        </h3>
        <ul className="outcome-list">
          {project.impact.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {project.note && <p className="content-note">{project.note}</p>}
      </section>
      <div className="tech-tags">
        {project.techStack.map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </div>
      {["logistics", "rc-car"].includes(project.id) && (
        <div className="project-easter">
          <MemeImage id={project.id === "logistics" ? "choices" : "chill"} />
        </div>
      )}
      {project.github && (
        <a
          className="text-link"
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code <FiArrowUpRight />
        </a>
      )}
      {project.demo && (
        <a
          className="text-link"
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
        >
          Live demo <FiArrowUpRight />
        </a>
      )}
    </article>
  );
}

export function ProjectList({ onProject }) {
  return (
    <div className="project-list">
      {projects.map((project, index) => (
        <button
          key={project.id}
          className={`project-row ${index === 0 ? "featured-project" : ""}`}
          onClick={() => onProject(project.id)}
        >
          <span className="project-number">0{index + 1}</span>
          <span className="project-row-copy">
            <span className="eyebrow">
              {index === 0 ? "FEATURED / OPTIMIZATION" : project.subtitle}
            </span>
            <strong>{project.title}</strong>
            <span>{project.description}</span>
            <span className="tech-preview">
              {project.techStack.slice(0, 4).join(" · ")}
            </span>
          </span>
          <FiArrowUpRight className="project-arrow" />
        </button>
      ))}
    </div>
  );
}

export function AboutContent() {
  return (
    <div className="about-copy">
      <p className="lead">
        Hey, I’m Pranav. I build things that solve real problems.
      </p>
      <p>{profile.summary}</p>
      <p>
        My work spans logistics planning, phishing simulations, threat
        intelligence pipelines, and a self-driving car powered by solar panels.
        From training models to deploying them, I like connecting the pieces
        into a useful system.
      </p>
      <blockquote>
        “If it solves a problem, I’ll learn whatever it takes to build it.”
      </blockquote>
      <div className="education">
        <h3>Education</h3>
        {education.map((item) => (
          <article key={item.course}>
            <span className="eyebrow">{item.period}</span>
            <h4>{item.course}</h4>
            <p>{item.school}</p>
            <span className="education-result">{item.result}</span>
          </article>
        ))}
      </div>
    </div>
  );
}

export function ExperienceContent() {
  return (
    <div className="timeline">
      {experience.map((role, index) => (
        <article key={role.organization}>
          <div className="timeline-dot" />
          <p className="eyebrow">
            {role.duration}
            {index === 0 && <span className="live-badge">CURRENT MISSION</span>}
          </p>
          <h3>{role.organization}</h3>
          <p className="role-title">{role.role}</p>
          <ul>
            {role.contributions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {role.outcomes && (
            <div className="content-note">{role.outcomes.join(" · ")}</div>
          )}
        </article>
      ))}
      <aside className="transmission">
        MISSION LOG // Trying to fix yesterday’s bug introduced today’s bug.
      </aside>
      <MemeImage id="cinema" className="lore-meme" />
    </div>
  );
}

export function SkillsContent() {
  return (
    <div className="skills-grid">
      {skillCategories.map((category, index) => (
        <article key={category.name}>
          <span className="eyebrow">MODULE 0{index + 1}</span>
          <h3>{category.name}</h3>
          <div className="tech-tags">
            {category.skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

export function MemeContent({ found, onDiscover }) {
  const [active, setActive] = useState(0);
  const { play } = useSound();
  return (
    <div className="meme-content">
      <div className="meme-terminal">
        <span className="eyebrow">
          INCOMING TRANSMISSION / {discoveries[active].title}
        </span>
        <p key={active}>{discoveries[active].message}</p>
        <code>{discoveries[active].code}</code>
      </div>
      <div className="discovery-buttons">
        {discoveries.map((item, index) => (
          <button
            key={item.title}
            aria-pressed={active === index}
            onClick={() => {
              setActive(index);
              if (!found.includes(index))
                play(index === 2 ? "discovery" : "reaction");
              onDiscover(index);
            }}
          >
            <span>{found.includes(index) ? "✓" : "+"}</span>
            {item.title}
          </button>
        ))}
      </div>
      <MemeImage id="chill" className="nebula-meme" />
      <p className="content-note">
        {found.length} / {discoveries.length} signals discovered. Entirely
        optional. Absolutely no XP required to see the résumé.
      </p>
    </div>
  );
}

export function ContactContent() {
  return (
    <div className="contact-content">
      <p className="lead">Want to build something interesting?</p>
      <p>
        Let’s talk about intelligent systems, useful software, or the next idea
        worth exploring.
      </p>
      <ContactLinks />
      <ResumeLink />
      <div className="contact-memes">
        <MemeImage id="request" />
        <MemeImage id="flowers" />
        <MemeImage id="heart" />
      </div>
      <p className="content-note">
        Mission complete. Thanks for stopping by my little corner of the
        universe.
      </p>
    </div>
  );
}

ResumeLink.propTypes = { compact: PropTypes.bool };
ProjectDiagram.propTypes = { id: PropTypes.string.isRequired };
ProjectDetails.propTypes = { project: PropTypes.object.isRequired };
ProjectList.propTypes = { onProject: PropTypes.func.isRequired };
MemeContent.propTypes = {
  found: PropTypes.array.isRequired,
  onDiscover: PropTypes.func.isRequired,
};
