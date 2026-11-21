# Lantern Lane — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Adnanhasim8/makefun-spot-difference-20261121/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Adnanhasim8/makefun-spot-difference-20261121/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

An original spot-the-difference game for the make.fun bounty
`best-spot-the-difference-game-20261121-0451`.

Two near-identical pictures hang side by side. Picture B hides small
changes — a moon that changed shape, a cat that slipped off a roof, a
lantern that changed colour. Click each difference on either picture
before the timer runs out. A wrong click costs 5 seconds; a hint costs
50 points.

## Scenes

1. **Lantern Lane** — a night-market alley, 7 differences, 3:00 on the clock
2. **Harbour Dawn** — fishing boats at first light, 10 differences, 2:30
3. **Starlight Garden** — fireflies over the old garden wall, 12 differences, 2:30

## Play

- Mouse: click a difference on either picture
- Arrow keys: move the crosshair, Space: check that spot
- H: hint (reveals one difference, −50 pts, 3 per scene)
- R: restart the scene · M: mute · 1/2/3: jump to a scene

Every picture is drawn in code on a canvas, and every sound is
synthesised with WebAudio — the game ships no image or audio files and
makes no network request. Open `game/index.html` from any static server
and it plays in desktop Chrome.

## Layout

- `main.ts` — the hand-in program: copies `game/` and `screenshots/`
  to the output directory and writes `dossier.json` with the kit library
- `vendor/makefun-game.ts` — the kit's dossier library, unchanged
- `game/index.html`, `game/styles.css` — page and frame
- `game/src/main.js` — state, input, timer, scoring
- `game/src/levels.js` — the three scenes and their differences
- `game/src/scenes.js` — all the artwork, drawn in code
- `game/src/audio.js` — synthesised sounds
- `game/src/effects.js` — found-rings, hints, score floaters
- `screenshots/` — real renders of the running game

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see `LICENSE`.

---

<sub>Entered on [make.fun](https://make.fun/?ref=vev5ehp3&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
