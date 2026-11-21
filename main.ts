// main.ts — Lantern Lane's hand-in program (Node 22, standard library only).
// It gathers the finished game and its screenshots from beside this file
// and lays them out under the output directory the grader provides,
// together with the dossier the judge reads, built by the kit library.

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const gameDir = join(repoRoot, 'game');
const shotsDir = join(repoRoot, 'screenshots');

if (!existsSync(join(gameDir, 'index.html'))) {
  throw new Error('game/index.html is missing — the entry has no game to hand in');
}
const shots = existsSync(shotsDir) ? readdirSync(shotsDir).filter((name) => !name.startsWith('.')) : [];
if (shots.length < 3 || shots.length > 4) {
  throw new Error(`expected 3 or 4 screenshots, found ${shots.length}`);
}

mkdirSync(outputDir, { recursive: true });
cpSync(gameDir, join(outputDir, 'game'), { recursive: true });
cpSync(shotsDir, join(outputDir, 'screenshots'), { recursive: true });

const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
const dossierPath = join(outputDir, 'dossier.json');
writeFileSync(dossierPath, dossier);

// Read back what was written: a dossier that is empty or over the
// gate's 1.5 MiB cap would fail the entry, so refuse to call it done.
const written = readFileSync(dossierPath, 'utf8');
if (written.length === 0 || written.length > 1572864) {
  throw new Error(`dossier.json is ${written.length} bytes — expected a non-empty file under 1.5 MiB`);
}
const gameFiles = readdirSync(join(outputDir, 'game'), { recursive: true }).length;
const indexBytes = statSync(join(outputDir, 'game', 'index.html')).size;
if (indexBytes > 1048576) {
  throw new Error(`game/index.html is ${indexBytes} bytes — over the 1 MiB gate cap`);
}

console.log(`handed in ${shots.length} screenshots, ${gameFiles} game entries and a ${written.length}-byte dossier to ${outputDir}`);
