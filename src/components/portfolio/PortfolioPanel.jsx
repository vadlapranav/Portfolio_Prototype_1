import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { FiArrowLeft, FiX } from "react-icons/fi";
import { destinations } from "../../data/portfolio";
import { projects } from "../../data/projects";
import {
  AboutContent,
  ProjectList,
  ProjectDetails,
  ExperienceContent,
  SkillsContent,
  MemeContent,
  ContactContent,
} from "./PortfolioContent";

export default function PortfolioPanel({
  selection,
  onSelect,
  onClose,
  found,
  onDiscover,
}) {
  const dialog = useRef(null);
  const content = useRef(null);
  const destination =
    destinations.find((item) => item.id === selection.destination) ||
    destinations[0];
  const project = projects.find((item) => item.id === selection.project);
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement;
    element.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, []);
  useEffect(() => {
    content.current.scrollTop = 0;
  }, [selection]);
  return (
    <dialog
      ref={dialog}
      className="portfolio-dialog"
      aria-labelledby="panel-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialog.current) onClose();
      }}
    >
      <div className="dialog-shell">
        <header className="dialog-header">
          <div>
            <p className="eyebrow">{destination.kicker}</p>
            <h2 id="panel-title">
              {project ? "Project archive" : destination.label}
            </h2>
          </div>
          <button
            autoFocus
            className="icon-button"
            aria-label="Close panel"
            onClick={onClose}
          >
            <FiX />
          </button>
        </header>
        <nav className="panel-tabs" aria-label="Portfolio sections">
          {destinations.map((item) => (
            <button
              key={item.id}
              aria-current={destination.id === item.id ? "page" : undefined}
              onClick={() => onSelect({ destination: item.id })}
            >
              {item.short}
            </button>
          ))}
        </nav>
        <div className="dialog-content" ref={content}>
          {project ? (
            <>
              <button
                className="text-link back-link"
                onClick={() => onSelect({ destination: "projects" })}
              >
                <FiArrowLeft /> All projects
              </button>
              <ProjectDetails project={project} />
            </>
          ) : (
            <>
              <p className="panel-description">{destination.description}</p>
              {destination.id === "home" && <AboutContent />}
              {destination.id === "projects" && (
                <ProjectList
                  onProject={(id) =>
                    onSelect({ destination: "projects", project: id })
                  }
                />
              )}
              {destination.id === "experience" && <ExperienceContent />}
              {destination.id === "skills" && <SkillsContent />}
              {destination.id === "memes" && (
                <MemeContent found={found} onDiscover={onDiscover} />
              )}
              {destination.id === "contact" && <ContactContent />}
            </>
          )}
        </div>
        <footer className="dialog-footer">
          <span>PRANAV.EXE / PORTFOLIO ARCHIVE</span>
          <span>
            <kbd>ESC</kbd> to close
          </span>
        </footer>
      </div>
    </dialog>
  );
}
PortfolioPanel.propTypes = {
  selection: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  found: PropTypes.array.isRequired,
  onDiscover: PropTypes.func.isRequired,
};
