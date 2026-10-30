export const soundCatalog = {
  launch: {
    file: "/assets/sounds/windows-xp-startup_1ph012N.mp3",
    category: "ui",
    gain: 0.32,
    maxSeconds: 1.7,
    cooldownMs: 60000,
    duration: 4.911,
  },
  reaction: {
    file: "/assets/sounds/bruh-sound-effect_WstdzdM.mp3",
    category: "memes",
    gain: 0.45,
    maxSeconds: 0.864,
    cooldownMs: 9000,
    duration: 0.864,
  },
  discovery: {
    file: "/assets/sounds/shocked-sound-effect.mp3",
    category: "memes",
    gain: 0.27,
    maxSeconds: 1.463,
    cooldownMs: 15000,
    duration: 1.463,
  },
  open: {
    category: "ui",
    frequency: 420,
    gain: 0.08,
    maxSeconds: 0.075,
    cooldownMs: 250,
  },
  close: {
    category: "ui",
    frequency: 280,
    gain: 0.06,
    maxSeconds: 0.06,
    cooldownMs: 250,
  },
  travel: {
    category: "ui",
    frequency: 640,
    gain: 0.07,
    maxSeconds: 0.12,
    cooldownMs: 500,
  },
  map: {
    category: "ui",
    frequency: 520,
    gain: 0.06,
    maxSeconds: 0.055,
    cooldownMs: 400,
  },
};

export const defaultSoundSettings = {
  muted: true,
  volume: 0.32,
  ui: true,
  memes: true,
};
