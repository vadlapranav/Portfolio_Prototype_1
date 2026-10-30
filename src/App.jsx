import {
  Component,
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiBriefcase,
  FiCode,
  FiCompass,
  FiGithub,
  FiHexagon,
  FiHome,
  FiMap,
  FiSend,
  FiSmile,
  FiX,
} from "react-icons/fi";
import { destinations, profile } from "./data/portfolio";
import { ResumeLink } from "./components/portfolio/PortfolioContent";
import PortfolioPanel from "./components/portfolio/PortfolioPanel";
import StandardPortfolio from "./components/portfolio/StandardPortfolio";
import { useMediaQuery, usePageVisible } from "./hooks/usePreferences";
import { useSound } from "./hooks/useSound";
import { useMemeSystem } from "./hooks/useMemeSystem";
import SoundControls from "./components/audio/SoundControls";
import MemeOverlay from "./components/memes/MemeOverlay";
import SlowLoadingMeme from "./components/memes/SlowLoadingMeme";

const SpaceScene = lazy(() => import("./components/game/SpaceScene"));
const icons = {
  home: FiHome,
  projects: FiCode,
  experience: FiBriefcase,
  skills: FiHexagon,
  memes: FiSmile,
  contact: FiSend,
};
const sectionHashes = [
  "#about",
  "#projects",
  "#experience",
  "#internship",
  "#skills",
  "#contact",
  "#portfolio",
];

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
SceneBoundary.propTypes = {
  onFailure: PropTypes.func.isRequired,
  children: PropTypes.node,
};

function GalaxyMap({ telemetry, onTravel, onClose, visited }) {
  return (
    <aside className="galaxy-map" aria-label="Galaxy map">
      <div className="map-heading">
        <span className="eyebrow">LOCAL SYSTEM / 6 DESTINATIONS</span>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close map"
        >
          <FiX />
        </button>
      </div>
      <div className="map-space">
        <svg viewBox="0 0 240 170" aria-hidden="true">
          <ellipse cx="120" cy="86" rx="59" ry="42" />
          <ellipse cx="120" cy="86" rx="105" ry="74" />
          <path d="M0 86H240M120 0V170" />
        </svg>
        {destinations.map((d) => (
          <button
            key={d.id}
            style={{
              left: `${((d.position[0] + 48) / 96) * 100}%`,
              top: `${((d.position[2] + 60) / 100) * 100}%`,
              "--destination-color": d.color,
            }}
            aria-label={`Map: ${d.label}`}
            onClick={() => onTravel(d.id)}
          >
            <span className={visited.includes(d.id) ? "visited" : ""} />
            <small>{d.short}</small>
          </button>
        ))}
        <span
          className="map-craft"
          title="Your spacecraft"
          style={{
            left: `${((telemetry.x + 48) / 96) * 100}%`,
            top: `${((telemetry.z + 60) / 100) * 100}%`,
          }}
        >
          ▲
        </span>
      </div>
      <p>
        {visited.length} / 6 destinations visited{" "}
        <span>Click a signal to travel</span>
      </p>
    </aside>
  );
}
GalaxyMap.propTypes = {
  telemetry: PropTypes.object.isRequired,
  onTravel: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  visited: PropTypes.array.isRequired,
};

export default function App() {
  const [mode, setMode] = useState(() =>
    sectionHashes.includes(window.location.hash) ? "portfolio" : "landing",
  );
  const [selection, setSelection] = useState(null);
  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [nearby, setNearby] = useState("home");
  const [travel, setTravel] = useState(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [visited, setVisited] = useState(["home"]);
  const [found, setFound] = useState([]);
  const [telemetry, setTelemetry] = useState({ x: 0, z: 17, speed: 0 });
  const flight = useRef({ position: [0, 0, 17] });
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const mobile = useMediaQuery("(max-width: 760px)");
  const visible = usePageVisible();
  const { play } = useSound();
  const { overlay, emit, dismiss } = useMemeSystem({
    blocked: Boolean(selection) || !visible || mode === "landing",
    moving: mode === "explore" && telemetry.speed > 0,
  });
  const encounter = useCallback(
    (id, meme) => {
      if (emit(meme, `encounter-${id}`))
        play(meme === "shocked" ? "discovery" : "reaction");
    },
    [emit, play],
  );
  const sceneReady = useCallback(() => setReady(true), []);
  const fail = useCallback(() => {
    setFallback(true);
    setMode("portfolio");
  }, []);
  const updateTelemetry = useCallback(
    (next) =>
      setTelemetry((old) =>
        old.x === next.x && old.z === next.z && old.speed === next.speed
          ? old
          : next,
      ),
    [],
  );
  const open = useCallback(
    (next) => {
      play("open");
      setSelection(next);
      setVisited((old) =>
        old.includes(next.destination) ? old : [...old, next.destination],
      );
    },
    [play],
  );
  const discover = useCallback(
    (index) => setFound((old) => (old.includes(index) ? old : [...old, index])),
    [],
  );
  const close = useCallback(() => {
    play("close");
    setSelection(null);
  }, [play]);
  const go = useCallback(
    (id) => {
      play("travel");
      setMode("explore");
      setTravel({ id, nonce: Date.now() });
      setVisited((old) => (old.includes(id) ? old : [...old, id]));
      setMapOpen(false);
    },
    [play],
  );
  const explore = () => {
    play("launch");
    setMode("explore");
    setFallback(false);
    history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
    window.scrollTo(0, 0);
  };
  const standard = () => {
    setMode("portfolio");
    setMapOpen(false);
    window.scrollTo(0, 0);
  };
  useEffect(() => {
    const handler = (event) => {
      if (
        event.target.closest("input,textarea,select,dialog") ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
      )
        return;
      if (event.code === "KeyM" && mode === "explore") {
        event.preventDefault();
        setMapOpen((old) => !old);
      }
      if (event.code === "KeyE" && mode === "explore" && nearby && !selection) {
        event.preventDefault();
        open({ destination: nearby });
      }
      if (event.code === "Escape") {
        if (selection) close();
        else setMapOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mode, nearby, selection, open, close]);
  useEffect(() => {
    const handle = () => {
      if (sectionHashes.includes(window.location.hash)) setMode("portfolio");
    };
    window.addEventListener("hashchange", handle);
    return () => window.removeEventListener("hashchange", handle);
  }, []);
  useEffect(() => {
    if (mode === "portfolio" && window.location.hash) {
      const id =
        window.location.hash === "#internship"
          ? "experience"
          : window.location.hash.slice(1);
      document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
    }
  }, [mode]);
  const current = destinations.find((d) => d.id === nearby);
  return (
    <div
      className={`memeverse ${mode === "portfolio" ? "portfolio-mode" : "universe-mode"} ${reduced ? "reduced-motion" : ""}`}
      data-page-visible={visible}
    >
      <a className="skip-link" href="#portfolio" onClick={standard}>
        Skip exploration and view portfolio
      </a>
      <header className="site-header">
        <button
          className="brand"
          onClick={() => {
            setMode("landing");
            window.scrollTo(0, 0);
          }}
          aria-label="Memeverse home"
        >
          <span className="brand-orbit">✦</span>
          <span>
            MEMEVERSE<small>THE GALAXY OF PRANAV</small>
          </span>
        </button>
        <nav aria-label="Primary navigation">
          <a
            className="header-github icon-button"
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pranav on GitHub"
          >
            <FiGithub />
          </a>
          <ResumeLink compact />
          <SoundControls />
          <button
            className="mode-switch"
            onClick={mode === "portfolio" ? explore : standard}
          >
            {mode === "portfolio" ? <FiCompass /> : <FiArrowUpRight />}
            {mode === "portfolio" ? "3D EXPLORATION" : "2D PORTFOLIO"}
          </button>
        </nav>
      </header>
      {mode !== "portfolio" && (
        <main className="universe" aria-label="Memeverse space exploration">
          <div className="cosmic-backdrop" aria-hidden="true">
            <div className="nebula nebula-one" />
            <div className="nebula nebula-two" />
            <div className="css-stars" />
          </div>
          <SceneBoundary onFailure={fail}>
            <Suspense fallback={<SlowLoadingMeme />}>
              <SpaceScene
                mode={mode}
                paused={Boolean(selection)}
                reduced={reduced}
                mobile={mobile}
                visible={visible}
                flight={flight}
                travel={travel}
                nearby={nearby}
                found={found}
                onOpen={open}
                onDiscover={discover}
                onNearby={setNearby}
                onReady={sceneReady}
                onTelemetry={updateTelemetry}
                onFailure={fail}
                onEncounter={encounter}
              />
            </Suspense>
          </SceneBoundary>
          {mode === "landing" ? (
            <>
              <div className="hero-copy">
                <p className="eyebrow">
                  <span className="status-dot" /> AN INDEPENDENT DEVELOPER’S
                  UNIVERSE
                </p>
                <h1>
                  PRANAV<span>.EXE</span>
                </h1>
                <h2>
                  Serious engineering.
                  <br />
                  <em>Slightly unserious universe.</em>
                </h2>
                <p className="hero-description">
                  AI, optimization, and real-world systems.
                  <br />
                  Welcome to my little corner of the universe.
                </p>
                <div className="button-row">
                  <button className="button button-primary" onClick={explore}>
                    Start exploring <FiArrowRight />
                  </button>
                  <button className="button button-ghost" onClick={standard}>
                    View portfolio <FiArrowUpRight />
                  </button>
                </div>
                <p className="hero-hint">
                  {mobile ? (
                    "Tap a destination. Discover something interesting."
                  ) : (
                    <>
                      <kbd>W A S D</kbd> to fly <span>·</span> Drag to look{" "}
                      <span>·</span> <kbd>E</kbd> to interact
                    </>
                  )}
                </p>
              </div>
              <div className="planet-caption" aria-hidden="true">
                <span className="caption-line" />
                <p>
                  HOME / PRANAV-01<small>A GOOD PLACE TO START</small>
                </p>
              </div>
              <div className="landing-footer">
                <span className="eyebrow">
                  <span className="status-dot" />
                  {ready ? "SYSTEMS ONLINE" : "ESTABLISHING ORBIT"}
                </span>
                <span>
                  Full Stack <i>·</i> Machine Learning <i>·</i> Optimization
                </span>
                <span className="landing-coordinate">SOL SYSTEM / 001</span>
              </div>
            </>
          ) : (
            <>
              <div className="flight-status">
                <p className="eyebrow">
                  <span className="status-dot" />
                  {telemetry.speed > 0 ? "IN FLIGHT" : "FREE EXPLORATION"}
                </p>
                <h1>{current?.label || "Open space"}</h1>
                <p>
                  {current
                    ? current.description
                    : "Pick a destination or follow a signal."}
                </p>
              </div>
              <button
                className="map-toggle"
                aria-expanded={mapOpen}
                onClick={() => {
                  play("map");
                  setMapOpen((old) => !old);
                }}
              >
                <FiMap />
                <span>System map</span>
                <kbd>M</kbd>
              </button>
              {mapOpen && (
                <GalaxyMap
                  telemetry={telemetry}
                  visited={visited}
                  onTravel={go}
                  onClose={() => setMapOpen(false)}
                />
              )}
              <div className="flight-reticle" aria-hidden="true">
                <span />+
              </div>
              {current && (
                <button
                  className="interaction-prompt"
                  onClick={() => open({ destination: current.id })}
                >
                  <kbd>{mobile ? "↗" : "E"}</kbd>
                  <span>Explore {current.short.toLowerCase()}</span>
                  <FiArrowRight />
                </button>
              )}
              <div className="destination-hud">
                <div className="dock-heading">
                  <span className="eyebrow">CHOOSE YOUR NEXT ORBIT</span>
                  <span>{visited.length} / 6 visited</span>
                </div>
                <nav
                  className="destination-dock"
                  aria-label="Travel to a destination"
                >
                  {destinations.map((d) => {
                    const Icon = icons[d.id];
                    return (
                      <button
                        key={d.id}
                        aria-label={`Travel to ${d.label}`}
                        aria-current={nearby === d.id ? "location" : undefined}
                        style={{ "--destination-color": d.color }}
                        onClick={() => go(d.id)}
                      >
                        <Icon />
                        <span>{d.short}</span>
                        <i
                          className={visited.includes(d.id) ? "is-visited" : ""}
                        />
                      </button>
                    );
                  })}
                </nav>
              </div>
              <div className="flight-bottom">
                <span>
                  {mobile ? (
                    "TAP TO TRAVEL"
                  ) : (
                    <>
                      <kbd>WASD / ↑↓←→</kbd> fly <b>·</b> Drag to look <b>·</b>{" "}
                      <kbd>E</kbd> interact
                    </>
                  )}
                </span>
                <span className="telemetry" aria-label="Ship coordinates">
                  X {telemetry.x} / Z {telemetry.z}
                  <i /> {telemetry.speed} u/s
                </span>
              </div>
            </>
          )}
        </main>
      )}
      {mode === "portfolio" && (
        <StandardPortfolio
          onProject={(id) => open({ destination: "projects", project: id })}
          onExplore={explore}
          fallback={fallback}
        />
      )}
      {!selection && <MemeOverlay overlay={overlay} onDismiss={dismiss} />}
      {selection && (
        <PortfolioPanel
          selection={selection}
          onSelect={open}
          onClose={close}
          found={found}
          onDiscover={discover}
        />
      )}
    </div>
  );
}
