# Contextual memes, sound and MOG craft

## Asset audit

`asset-inventory.json` records exact paths, byte sizes, SHA-256 hashes, image dimensions and ratios, and MP3 duration/sample-rate/channel metadata. `asset-contact-sheet.jpg` was visually inspected. There were 23 raster image files representing 11 distinct images, and 16 MP3 files representing eight distinct clips. No model files were present. Existing duplicate files were left in place; the implementation uses the existing public URLs. The newly supplied Cinema PNG is referenced from its existing `Meme_Images` path and is bundled by Vite.

All supplied raster images were visually inspected and contain no embedded caption text. The subjects are: a heart-gesture monkey, a seated filmmaker with raised hands, a timeout gesture, a pleading cat, a dog holding flowers, a relaxed hands-up gesture, a dog checking a phone, an astonished dog, a laughing baby, and the two blue MOG expressions. The supplied MOG JPGs are opaque with white backgrounds. They show different expressions of the same subject, not orthogonal views for a realistic reconstruction. The 735 × 546 MOG image also shows a raised gloved finger; the other is 736 × 736.

## Additional template research and provenance

The requested [template catalogue](https://imgflip.com/memetemplates) and [skeleton search](https://imgflip.com/memesearch?q=skeleton+waiting) were inspected. Selected concepts:

| Candidate | Evaluation | Local implementation |
| --- | --- | --- |
| [Waiting Skeleton](https://imgflip.com/meme/Waiting-Skeleton) | Clear inactivity joke, understandable at a small size; the original photo has no established redistribution licence here. | An original 640 × 420 SVG of a skeleton astronaut on an orbital bench, used for idle check-ins and genuinely slow scene loads. |
| [Skeleton Computer](https://imgflip.com/meme/36584403/Skeleton-Computer) | Relevant to loading, but would duplicate the waiting joke and adds computer detail that becomes small. | Not copied or added; the orbital-bench illustration covers the waiting context. |
| [Two Buttons](https://imgflip.com/meme/Two-Buttons) | Suits engineering trade-offs; short labels remain readable when the display is approached. | Original 720 × 420 SVG of a robotic hand and two console buttons; on the project travel route and after the logistics case study. |
| [Expanding Brain](https://imgflip.com/meme/Expanding-Brain) | Suits the tech tree; three compact debugging stages work better here than a tall photographic panel. | Original 600 × 600 SVG of increasingly cosmic debugging stages, on a billboard near the skill belt. |
| [This Is Fine](https://imgflip.com/meme/This-Is-Fine) | Suitable for errors but could trivialise real failure and would repeat another error joke. | Not integrated. |

[Imgflip's terms](https://imgflip.com/terms) do not establish blanket permission to redistribute the underlying user-uploaded images. No Imgflip image files were downloaded, hotlinked, or bundled. The source links in the catalog identify inspiration, not an image licence. The three added SVGs are original code-authored compositions. Existing media retains its user-supplied provenance; independent third-party rights were not verified.

## Placement and timing

The central catalog is `src/data/memeCatalog.js`. Physical monitors, billboards and satellites are placed near home, project outposts, the experience station, the skill belt, the meme region and the contact route. Displays load textures only when the craft is nearby. Their screen height is calculated as width divided by the measured image ratio. Missing images leave the frame in place and cannot take down the scene.

The shared HTML image component uses measured `width`, `height`, and `object-fit: contain`. Cinema appears beneath the formal experience timeline; selected project notes and the contact section reuse supplied images. It also renders the contextual overlays independently of WebGL.

`src/data/memeTiming.js` defines the 15-second idle threshold, eight-second display period, 60-second idle cooldown, 24-second encounter cooldown and six-second real-loading threshold. The director has one overlay slot. Pointer, keyboard, touch, wheel and scroll activity reset it. Held keys, active touches and craft motion prevent idle. Hidden tabs, form inputs and open portfolio dialogs suppress idle; returning begins a fresh activity period. An idle signal does not repeat continuously after auto-dismissal. Overlays never take keyboard focus. Reduced-motion mode removes their entrance motion.

## Sound

MP3 measurements:

| Supplied file | Duration | Rate / channels | Use |
| --- | ---: | --- | --- |
| `bruh-sound-effect_WstdzdM.mp3` | 0.864 s | 48 kHz / stereo | Occasional optional encounters and meme-terminal discoveries. |
| `shocked-sound-effect.mp3` | 1.463 s | 44.1 kHz / stereo | The surprised-dog signal and AI probe discovery. |
| `windows-xp-startup_1ph012N.mp3` | 4.911 s | 44.1 kHz / stereo | First 1.7 seconds on exploration entry when sound has already been enabled; 60-second cooldown. |
| `punch-gaming-sound-effect-hd_RzlG1GE.mp3` | 1.567 s | 44.1 kHz / stereo | Audited, unused. |
| `meme-violin-sad-violin.mp3` | 4.598 s | 44.1 kHz / stereo | Audited, unused. |
| `snore-mimimimimimi.mp3` | 5.695 s | 44.1 kHz / stereo | Audited, unused; idle check-ins remain silent. |
| `fbi-open-up_dwLhIFf.mp3` | 7.080 s | 48 kHz / stereo | Audited, unused. |
| `bye-bye-lumi-athena-sfx.mp3` | 7.320 s | 48 kHz / stereo | Audited, unused. |

Short sine-based UI signals are generated by Web Audio for archive open/close, map and travel. No supplied clip was suitable for an unobtrusive ambient or thrust loop, so those loops were omitted. No audio dependency was added. The sound manager starts muted, unlocks through user interaction, offers master volume and UI/meme category toggles, and persists preferences. It caps simultaneous supplied clips at one, rate-limits events, stops audio on mute or tab hiding, and handles unavailable or rejected playback without blocking navigation. The files were measured through metadata, the playback controls were exercised in the browser, and manager policies were tested. Actual listening and subjective loudness cannot be verified by the assistant's audio-input capability.

## MOG spacecraft

This is a stylized dimensional interpretation, not a photogrammetric reconstruction. A rounded blue hull, rear facial pod, dorsal cockpit, raised gloved hand, tapered bow, fins and twin engines form actual geometry. `mog2.jpg` forms the rear flight portrait; `mog1.jpg` forms the dorsal navigator display. Each portrait preserves its native ratio and uses a shader to remove only the near-white background. The portraits remain fixed to the craft's surfaces rather than billboard-facing the camera. The complete shape is rendered by `MogCraft.jsx`, attached to the existing flight transform. The movement, camera, proximity and collision code is retained. Decorative fins do not enlarge the collision boundary. Textures are local and disposed on unmount.

## Checks

`npm test`: 18 passed. `npm run lint`: passed. `npm run build`: passed. `node scripts/check_local_assets.mjs`: 18 local URLs served with status 200 and byte hashes matching their source files. The automated suite covers director timing and suppression, single-slot/cooldown behavior, audio opt-in/muting/categories/deduplication/failure handling, local asset paths and measured ratios, and existing content/navigation regressions.

Browser checks performed at desktop and phone viewport sizes: exploration entry; WASD and arrow movement; drag-to-look; map toggle and fast travel; keyboard E interaction; project/career archive opening and Escape closing at the same location; no idle signal while an archive remained open beyond the threshold; 15-second idle display in exploration and in a fresh conventional-mode session; signal auto-expiration and explicit dismissal; environmental images and the two MOG portraits; sound enable/mute/settings and the test-reaction action; and conventional-mode professional links and content. No runtime errors or warnings were reported by the captured browser console. Screenshots are under `docs/inspection`.

The real tab-hidden state and reduced-motion preference were not emulated in the browser; their guards were reviewed and the director's suspension behavior was unit-tested. A forced WebGL context loss was not tested. Subjective audio listening and device-wide GPU performance benchmarking were not performed. The inherited 687 KB Three.js vendor-chunk warning remains a performance consideration.

## Try it

Run `npm run dev`. Start exploring, use destination travel to find the framed signals, and click an optional signal. Stop interacting for 15 seconds to receive the silent skeleton check-in. Open an archive to read uninterrupted. Use the speaker button to opt into sound and its adjacent settings button for volume/categories. Switch to 2D Portfolio to see the shared content and idle system without the game.
