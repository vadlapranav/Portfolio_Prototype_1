import PropTypes from "prop-types";
import { FiX } from "react-icons/fi";
import MemeImage from "./MemeImage";
export default function MemeOverlay({ overlay, onDismiss }) {
  if (!overlay) return null;
  return (
    <aside
      className="meme-overlay"
      aria-label="Optional ship transmission"
      data-trigger={overlay.trigger}
    >
      <div className="meme-overlay-header">
        <span className="eyebrow">
          {overlay.trigger === "idle"
            ? "CREW CHECK-IN"
            : "UNEXPECTED TRANSMISSION"}
        </span>
        <button
          className="icon-button"
          aria-label="Dismiss meme"
          onClick={onDismiss}
        >
          <FiX />
        </button>
      </div>
      <MemeImage id={overlay.id} />
      <span className="meme-overlay-footnote">
        Optional signal · resumes normal orbit automatically
      </span>
    </aside>
  );
}
MemeOverlay.propTypes = {
  overlay: PropTypes.object,
  onDismiss: PropTypes.func.isRequired,
};
