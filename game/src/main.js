// main.js — Lantern Lane's game controller: state, input, timer, scoring.
// It boots the two panels, runs the frame loop, and turns mouse clicks
// and keyboard moves into found differences, hints and level endings.

import { LEVELS } from './levels.js';
import { PANEL_W, PANEL_H, drawScene } from './scenes.js';
import { SoundBank } from './audio.js';
import { Effects } from './effects.js';

const FIND_POINTS = 100;
const HINT_COST = 50;
const WRONG_CLICK_SECONDS = 5;
const CROSSHAIR_STEP = 24;

const canvasLeft = document.getElementById('canvasLeft');
const canvasRight = document.getElementById('canvasRight');
const ctxLeft = canvasLeft.getContext('2d');
const ctxRight = canvasRight.getContext('2d');

const el = {
  levelName: document.getElementById('levelName'),
  score: document.getElementById('score'),
  hintsLeft: document.getElementById('hintsLeft'),
  timeLeft: document.getElementById('timeLeft'),
  timerBar: document.getElementById('timerBar'),
  foundCounter: document.getElementById('foundCounter'),
  levelHint: document.getElementById('levelHint'),
  overlay: document.getElementById('overlay'),
  overlayTitle: document.getElementById('overlayTitle'),
  overlayText: document.getElementById('overlayText'),
  overlayStats: document.getElementById('overlayStats'),
  overlayBtn: document.getElementById('overlayBtn'),
  hintBtn: document.getElementById('hintBtn'),
  soundBtn: document.getElementById('soundBtn'),
  restartBtn: document.getElementById('restartBtn'),
};

const sound = new SoundBank();
const effects = new Effects();

const game = {
  state: 'title',
  levelIndex: 0,
  found: new Set(),
  score: 0,
  hintsLeft: 3,
  timeLeft: LEVELS[0].timeLimit,
  crosshair: { x: PANEL_W / 2, y: PANEL_H / 2, visible: false },
  lastFrame: performance.now(),
};

function level() {
  return LEVELS[game.levelIndex];
}

function remaining() {
  return level().diffs.length - game.found.size;
}

function formatTime(seconds) {
  const total = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

function showOverlay(title, text, stats, buttonLabel) {
  el.overlayTitle.textContent = title;
  el.overlayText.textContent = text;
  el.overlayStats.textContent = stats;
  el.overlayBtn.textContent = buttonLabel;
  el.overlay.classList.add('show');
}

function hideOverlay() {
  el.overlay.classList.remove('show');
}

function refreshHud() {
  const current = level();
  el.levelName.textContent = `${game.levelIndex + 1} · ${current.name}`;
  el.score.textContent = String(game.score);
  el.hintsLeft.textContent = String(game.hintsLeft);
  el.timeLeft.textContent = formatTime(game.timeLeft);
  const fraction = game.timeLeft / current.timeLimit;
  el.timerBar.style.width = `${Math.max(0, fraction * 100)}%`;
  el.timerBar.classList.toggle('low', fraction < 0.25);
  el.timerBar.classList.toggle('mid', fraction >= 0.25 && fraction < 0.5);
  el.foundCounter.textContent =
    `Found ${game.found.size} / ${current.diffs.length} · ${remaining()} remain`;
  el.hintBtn.disabled = game.hintsLeft <= 0 || game.state !== 'playing';
  document.querySelectorAll('.level-btn').forEach((button) => {
    button.classList.toggle('active', Number(button.dataset.level) === game.levelIndex);
  });
}

function startLevel(index) {
  game.levelIndex = index;
  game.found = new Set();
  game.hintsLeft = 3;
  game.timeLeft = level().timeLimit;
  game.state = 'playing';
  game.crosshair.visible = false;
  effects.rings = [];
  effects.floaters = [];
  effects.misses = [];
  effects.hintRing = null;
  hideOverlay();
  el.levelHint.textContent =
    `${level().subtitle} — ${level().diffs.length} differences hide in Picture B.`;
  refreshHud();
}

function starsForLevel() {
  const fraction = game.timeLeft / level().timeLimit;
  if (fraction > 0.5) return 3;
  if (fraction > 0.25) return 2;
  return 1;
}

function finishLevel() {
  const bonus = Math.round(game.timeLeft) * 5;
  game.score += bonus;
  const stars = '★'.repeat(starsForLevel()) + '☆'.repeat(3 - starsForLevel());
  sound.levelWin();
  refreshHud();
  if (game.levelIndex + 1 >= LEVELS.length) {
    game.state = 'gameDone';
    sound.gameWin();
    showOverlay(
      'You found them all!',
      `Every difference across all three scenes — ${LEVELS.reduce((n, l) => n + l.diffs.length, 0)} in total. The lanterns stay lit tonight thanks to you.`,
      `${stars}  Final score: ${game.score}  ·  Time bonus +${bonus}`,
      'Play again',
    );
  } else {
    game.state = 'levelDone';
    showOverlay(
      `${level().name} complete!`,
      `All ${level().diffs.length} differences found. The next scene is harder — more differences, less time.`,
      `${stars}  Time bonus +${bonus}  ·  Score: ${game.score}`,
      'Next scene',
    );
  }
}

function runOutOfTime() {
  game.state = 'timeUp';
  sound.wrong();
  showOverlay(
    'Out of time!',
    `The lanterns burned down with ${remaining()} difference${remaining() === 1 ? '' : 's'} still hiding. Try the scene again — you know where some of them are now.`,
    `Found ${game.found.size} / ${level().diffs.length}  ·  Score: ${game.score}`,
    'Try this scene again',
  );
  refreshHud();
}

function checkSpot(x, y) {
  if (game.state !== 'playing') return;
  sound.ensure();
  const hit = level().diffs.find(
    (diff) => !game.found.has(diff.id) && Math.hypot(diff.x - x, diff.y - y) <= diff.r + 6,
  );
  if (hit) {
    game.found.add(hit.id);
    game.score += FIND_POINTS;
    effects.addFoundRing(hit.x, hit.y);
    effects.addFloater(hit.x, hit.y - 24, `+${FIND_POINTS}`);
    el.levelHint.textContent = hit.label + ' — nice eyes!';
    sound.found();
    if (game.found.size === level().diffs.length) finishLevel();
  } else {
    game.timeLeft = Math.max(0, game.timeLeft - WRONG_CLICK_SECONDS);
    effects.addMiss(x, y);
    el.levelHint.textContent = `Nothing different there — ${WRONG_CLICK_SECONDS} seconds lost. Look closer!`;
    sound.wrong();
    if (game.timeLeft <= 0) runOutOfTime();
  }
  refreshHud();
}

function useHint() {
  if (game.state !== 'playing' || game.hintsLeft <= 0) return;
  const hidden = level().diffs.filter((diff) => !game.found.has(diff.id));
  if (hidden.length === 0) return;
  const pick = hidden[Math.floor(Math.random() * hidden.length)];
  game.hintsLeft -= 1;
  game.score = Math.max(0, game.score - HINT_COST);
  effects.setHint(pick.x, pick.y);
  el.levelHint.textContent = `Hint: something changed near the glowing ring (−${HINT_COST} pts).`;
  sound.hint();
  refreshHud();
}

function canvasPoint(event, canvas) {
  const box = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - box.left) / box.width) * PANEL_W,
    y: ((event.clientY - box.top) / box.height) * PANEL_H,
  };
}

function render(now) {
  const dt = Math.min(0.1, (now - game.lastFrame) / 1000);
  game.lastFrame = now;
  if (game.state === 'playing') {
    game.timeLeft -= dt;
    if (game.timeLeft <= 0) {
      game.timeLeft = 0;
      runOutOfTime();
    }
    el.timeLeft.textContent = formatTime(game.timeLeft);
    const fraction = game.timeLeft / level().timeLimit;
    el.timerBar.style.width = `${Math.max(0, fraction * 100)}%`;
    el.timerBar.classList.toggle('low', fraction < 0.25);
    el.timerBar.classList.toggle('mid', fraction >= 0.25 && fraction < 0.5);
  }
  effects.prune(now);
  const shake = effects.isShaking(now) ? (Math.random() - 0.5) * 6 : 0;
  for (const [ctx, isRight] of [[ctxLeft, false], [ctxRight, true]]) {
    ctx.save();
    ctx.translate(shake, 0);
    drawScene(ctx, level().id, isRight);
    effects.drawMarkers(ctx, level().diffs, game.found);
    effects.drawFoundRings(ctx, now);
    effects.drawHint(ctx, now);
    effects.drawMisses(ctx, now);
    effects.drawFloaters(ctx, now);
    if (game.crosshair.visible && game.state === 'playing') {
      effects.drawCrosshair(ctx, game.crosshair.x, game.crosshair.y);
    }
    ctx.restore();
  }
  requestAnimationFrame(render);
}

function overlayAction() {
  if (game.state === 'title' || game.state === 'gameDone') {
    startLevel(0);
  } else if (game.state === 'levelDone') {
    startLevel(game.levelIndex + 1);
  } else if (game.state === 'timeUp') {
    startLevel(game.levelIndex);
  }
}

canvasLeft.addEventListener('click', (event) => {
  // The mouse takes over from the keyboard: hide the crosshair again.
  game.crosshair.visible = false;
  checkSpot(...Object.values(canvasPoint(event, canvasLeft)));
});
canvasRight.addEventListener('click', (event) => {
  game.crosshair.visible = false;
  checkSpot(...Object.values(canvasPoint(event, canvasRight)));
});
el.hintBtn.addEventListener('click', useHint);
el.soundBtn.addEventListener('click', () => {
  const muted = sound.toggleMute();
  el.soundBtn.textContent = muted ? 'Sound: Off (M)' : 'Sound: On (M)';
});
el.restartBtn.addEventListener('click', () => startLevel(game.levelIndex));
el.overlayBtn.addEventListener('click', overlayAction);
document.querySelectorAll('.level-btn').forEach((button) => {
  button.addEventListener('click', () => startLevel(Number(button.dataset.level)));
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && game.state !== 'playing') {
    overlayAction();
    return;
  }
  if (game.state !== 'playing') return;
  const step = event.shiftKey ? CROSSHAIR_STEP * 2 : CROSSHAIR_STEP;
  if (event.key === 'ArrowLeft') {
    game.crosshair.x = Math.max(0, game.crosshair.x - step);
    game.crosshair.visible = true;
    event.preventDefault();
  } else if (event.key === 'ArrowRight') {
    game.crosshair.x = Math.min(PANEL_W, game.crosshair.x + step);
    game.crosshair.visible = true;
    event.preventDefault();
  } else if (event.key === 'ArrowUp') {
    game.crosshair.y = Math.max(0, game.crosshair.y - step);
    game.crosshair.visible = true;
    event.preventDefault();
  } else if (event.key === 'ArrowDown') {
    game.crosshair.y = Math.min(PANEL_H, game.crosshair.y + step);
    game.crosshair.visible = true;
    event.preventDefault();
  } else if (event.key === ' ' || event.key === 'Enter') {
    game.crosshair.visible = true;
    checkSpot(game.crosshair.x, game.crosshair.y);
    event.preventDefault();
  } else if (event.key === 'h' || event.key === 'H') {
    useHint();
  } else if (event.key === 'r' || event.key === 'R') {
    startLevel(game.levelIndex);
  } else if (event.key === 'm' || event.key === 'M') {
    const muted = sound.toggleMute();
    el.soundBtn.textContent = muted ? 'Sound: Off (M)' : 'Sound: On (M)';
  } else if (event.key === '1' || event.key === '2' || event.key === '3') {
    startLevel(Number(event.key) - 1);
  }
});

// A small handle for automated play-testing: the game's own state and a
// way to click a panel point without a mouse. The game never reads it.
window.__spot = {
  get state() { return game.state; },
  get levelIndex() { return game.levelIndex; },
  get level() { return level(); },
  get foundCount() { return game.found.size; },
  get score() { return game.score; },
  get timeLeft() { return game.timeLeft; },
  get hintsLeft() { return game.hintsLeft; },
  clickAt(x, y) { checkSpot(x, y); },
  startLevel(index) { startLevel(index); },
  useHint() { useHint(); },
};

refreshHud();
requestAnimationFrame(render);
