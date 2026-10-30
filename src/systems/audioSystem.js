import { soundCatalog, defaultSoundSettings } from "../data/soundCatalog.js";

export function createAudioSystem(options = {}) {
  const settings = { ...defaultSoundSettings, ...options.settings };
  const createMedia = options.createMedia || ((file) => new Audio(file));
  const createContext =
    options.createContext ||
    (() => {
      const Context = window.AudioContext || window.webkitAudioContext;
      return Context ? new Context() : null;
    });
  const now = options.now || Date.now,
    schedule = options.schedule || setTimeout,
    cancel = options.cancel || clearTimeout;
  const played = new Map(),
    media = new Map(),
    timers = new Set(),
    voices = new Set();
  let unlocked = false,
    context = null,
    disposed = false;
  const stopAll = () => {
    for (const timer of timers) cancel(timer);
    timers.clear();
    for (const player of media.values()) {
      player.pause();
      try {
        player.currentTime = 0;
      } catch {
        /* An unavailable clip is nonessential. */
      }
    }
    for (const voice of voices) {
      try {
        voice.stop();
      } catch {
        /* Already stopped. */
      }
    }
    voices.clear();
  };
  const system = {
    get settings() {
      return { ...settings };
    },
    unlock() {
      if (disposed) return;
      unlocked = true;
      if (!settings.muted) {
        try {
          context ??= createContext();
          const resumed = context?.resume();
          resumed?.catch(() => {});
        } catch {
          /* Audio cannot block navigation. */
        }
      }
    },
    configure(next) {
      Object.assign(settings, next);
      settings.volume = Math.max(0, Math.min(1, settings.volume));
      stopAll();
    },
    stop: stopAll,
    play(name) {
      const sound = soundCatalog[name],
        time = now();
      if (
        disposed ||
        !sound ||
        !unlocked ||
        settings.muted ||
        settings.volume === 0 ||
        !settings[sound.category] ||
        time - (played.get(name) ?? -Infinity) < sound.cooldownMs
      )
        return false;
      played.set(name, time);
      try {
        if (sound.file) {
          // One supplied clip at a time, even when several discoveries happen together.
          for (const player of media.values()) player.pause();
          let player = media.get(name);
          if (!player) {
            player = createMedia(sound.file);
            player.preload = "none";
            media.set(name, player);
          }
          player.volume = settings.volume * sound.gain;
          player.currentTime = 0;
          const playback = player.play();
          playback?.catch(() => {});
          const timer = schedule(() => {
            player.pause();
            timers.delete(timer);
          }, sound.maxSeconds * 1000);
          timers.add(timer);
        } else {
          context ??= createContext();
          if (!context) return false;
          const oscillator = context.createOscillator(),
            gain = context.createGain(),
            start = context.currentTime;
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(sound.frequency, start);
          oscillator.frequency.exponentialRampToValueAtTime(
            sound.frequency * 0.72,
            start + sound.maxSeconds,
          );
          gain.gain.setValueAtTime(
            Math.max(0.0001, settings.volume * sound.gain),
            start,
          );
          gain.gain.exponentialRampToValueAtTime(
            0.0001,
            start + sound.maxSeconds,
          );
          oscillator.connect(gain);
          gain.connect(context.destination);
          voices.add(oscillator);
          oscillator.onended = () => {
            voices.delete(oscillator);
            oscillator.disconnect();
            gain.disconnect();
          };
          oscillator.start();
          oscillator.stop(start + sound.maxSeconds);
        }
        return true;
      } catch {
        return false;
      }
    },
    dispose() {
      disposed = true;
      stopAll();
      for (const player of media.values()) {
        player.removeAttribute?.("src");
        player.load?.();
      }
      media.clear();
      try {
        context?.close()?.catch(() => {});
      } catch {
        /* The context may already be closed. */
      }
      context = null;
    },
  };
  return system;
}
