# MEMEVERSE — The Galaxy of Pranav

An interactive solar system and a conventional portfolio in one React app. Explore the world with a small spacecraft, open actual project and career archives, or switch to a readable section-by-section portfolio at any time.

## Run locally

```sh
npm install
npm run dev
```

Use **2D Portfolio** at the top of the page to skip the 3D scene. To check the production bundle, run `npm run build`. To check data, travel boundaries, collision handling and navigation, run `npm test`. To lint the app, run `npm run lint`.

## Flight controls

- **WASD** or the arrow keys: fly forward, back, left and right.
- **Drag** the scene: look around.
- **E**: open the nearby destination.
- **M**: show or hide the system map.
- **Escape**: close an open archive or map.
- Choose any destination from the on-screen navigation for immediate fast travel.

On touchscreens, use the six destination buttons. Archive panels, résumé, and contact links also work with standard keyboard and screen-reader navigation. The animation honours the operating system’s reduced-motion setting.

## Portfolio content

Project, career, education and contact details are structured under `src/data/`. Project writeups retain the supplied portfolio descriptions and links; the 2026 logistics case study was added from the supplied résumé. Its cost and turnaround-time figures are identified as results from a synthetic test, not production savings. The backhaul component is described as a separately developed engine. The résumé is stored locally at `public/assets/resume.pdf`.

The portfolio is informative without WebGL: project panels, education, experience, skills, and contact remain accessible through the standard mode. On WebGL failure, the app returns to that mode.

## Implementation

- React 18 and Vite, retained from the original project.
- React Three Fiber 8, Drei 9 and Three.js 0.170 for the lazy-loaded local 3D world.
- Procedural planets, locally generated stars, spacecraft, stations, project outposts, asteroid groups, and meme probes; the scene requires no external model or texture hosts.
- Native HTML destination controls and a native modal dialog contain the real portfolio content.
- Reduced pixel ratio on mobile; rendering pauses in other tabs and when a panel is open.

Public GitHub, LinkedIn, and email links use the values in `src/data/portfolio.js`. No project code or demo links are invented where the source portfolio does not provide them.

## Contextual meme and MOG upgrade

The universe now uses a shared contextual meme catalog, physically framed environmental displays, a dimensional MOG spacecraft, and optional sound. Both supplied MOG images are used on the blue craft. The image planes preserve the source ratios, and the hull, hand, fins and engines provide actual 3D depth.

Pause interaction for 15 seconds after entering exploration or standard mode to receive a silent skeleton check-in. It disappears after eight seconds, respects a 60-second cooldown, and is suppressed while reading an archive or using form controls. The speaker button enables sound; the adjacent settings control provides master volume and UI/meme toggles.

See [the upgrade and asset notes](docs/MEME_UPGRADE.md) for file provenance, Imgflip research, environmental placements, timing, sound mappings, modelling details and verification limits. No externally hosted meme images are required at runtime.
