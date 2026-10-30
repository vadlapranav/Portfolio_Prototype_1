import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { SoundContext } from "../../systems/soundContext";
import { createAudioSystem } from "../../systems/audioSystem";
import { defaultSoundSettings } from "../../data/soundCatalog";

function readSettings() {
  try {
    return {
      ...defaultSoundSettings,
      ...JSON.parse(localStorage.getItem("memeverse-sound") || "{}"),
    };
  } catch {
    return defaultSoundSettings;
  }
}
export default function SoundProvider({ children }) {
  const [settings, setSettings] = useState(readSettings);
  const system = useRef(null);
  const getSystem = useCallback(
    () => (system.current ??= createAudioSystem({ settings: readSettings() })),
    [],
  );
  const play = useCallback((name) => getSystem().play(name), [getSystem]);
  const configure = useCallback(
    (next) => {
      const audio = getSystem();
      audio.configure(next);
      audio.unlock();
      const nextSettings = audio.settings;
      setSettings(nextSettings);
      try {
        localStorage.setItem("memeverse-sound", JSON.stringify(nextSettings));
      } catch {
        /* Storage can be disabled. */
      }
    },
    [getSystem],
  );
  useEffect(() => {
    const unlock = () => getSystem().unlock();
    const visibility = () => {
      if (document.hidden) getSystem().stop();
    };
    window.addEventListener("pointerdown", unlock, { capture: true });
    window.addEventListener("keydown", unlock, { capture: true });
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("pointerdown", unlock, { capture: true });
      window.removeEventListener("keydown", unlock, { capture: true });
      document.removeEventListener("visibilitychange", visibility);
      system.current?.dispose();
      system.current = null;
    };
  }, [getSystem]);
  const value = useMemo(
    () => ({ settings, configure, play }),
    [settings, configure, play],
  );
  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}
SoundProvider.propTypes = { children: PropTypes.node };
