import { FiSliders, FiVolume2, FiVolumeX } from "react-icons/fi";
import { useSound } from "../../hooks/useSound";
export default function SoundControls() {
  const { settings, configure, play } = useSound();
  return (
    <div className="sound-controls">
      <button
        className={`sound-toggle icon-button ${settings.muted ? "" : "sound-on"}`}
        aria-label={settings.muted ? "Enable sound" : "Mute sound"}
        aria-pressed={!settings.muted}
        onClick={() => {
          configure({ muted: !settings.muted });
          if (settings.muted) play("map");
        }}
      >
        {settings.muted ? <FiVolumeX /> : <FiVolume2 />}
      </button>
      <details className="sound-settings">
        <summary aria-label="Sound settings">
          <FiSliders />
        </summary>
        <div className="sound-popover">
          <p className="eyebrow">
            SHIP AUDIO / {settings.muted ? "MUTED" : "ENABLED"}
          </p>
          <label>
            Master volume <output>{Math.round(settings.volume * 100)}%</output>
            <input
              type="range"
              min="0"
              max="1"
              step=".05"
              value={settings.volume}
              aria-label="Master volume"
              onChange={(event) =>
                configure({ volume: Number(event.target.value) })
              }
            />
          </label>
          <label className="sound-category">
            <input
              type="checkbox"
              checked={settings.ui}
              onChange={(event) => configure({ ui: event.target.checked })}
            />{" "}
            Interface signals
          </label>
          <label className="sound-category">
            <input
              type="checkbox"
              checked={settings.memes}
              onChange={(event) => configure({ memes: event.target.checked })}
            />{" "}
            Occasional meme reactions
          </label>
          <button
            className="text-link"
            disabled={settings.muted || !settings.memes}
            onClick={() => play("reaction")}
          >
            Test reaction sound ↗
          </button>
          <small>Idle transmissions are silent.</small>
        </div>
      </details>
    </div>
  );
}
