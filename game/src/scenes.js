// scenes.js — every picture in the game, drawn in code.
// Each scene paints the same 560x420 panel twice: the left panel plain,
// the right panel with that scene's differences applied. Nothing here is
// copied art: every roof, lantern, boat and bloom is drawn from shapes.

export const PANEL_W = 560;
export const PANEL_H = 420;

function disc(ctx, x, y, r, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, colour) {
  ctx.fillStyle = colour;
  ctx.fillRect(x, y, w, h);
}

function poly(ctx, points, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

function star(ctx, x, y, r, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const rad = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(angle) * rad;
    const py = y + Math.sin(angle) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function skyWash(ctx, top, bottom) {
  const wash = ctx.createLinearGradient(0, 0, 0, PANEL_H);
  wash.addColorStop(0, top);
  wash.addColorStop(1, bottom);
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, PANEL_W, PANEL_H);
}

function sprinkleStars(ctx, seeds) {
  ctx.fillStyle = '#ffffff';
  for (const [x, y, r] of seeds) {
    ctx.globalAlpha = 0.55 + (r % 5) * 0.09;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function bird(ctx, x, y, colour) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x - 12, y);
  ctx.quadraticCurveTo(x - 5, y - 8, x, y);
  ctx.quadraticCurveTo(x + 5, y - 8, x + 12, y);
  ctx.stroke();
}

function lantern(ctx, x, y, colour, lit) {
  ctx.strokeStyle = '#3a2415';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 26);
  ctx.lineTo(x, y - 12);
  ctx.stroke();
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.ellipse(x, y, 15, 19, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(x, y, 15, 19, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 13, y - 7);
  ctx.lineTo(x + 13, y - 7);
  ctx.moveTo(x - 13, y + 7);
  ctx.lineTo(x + 13, y + 7);
  ctx.stroke();
  if (lit) {
    disc(ctx, x, y, 5, 'rgba(255, 236, 170, 0.9)');
  }
  disc(ctx, x, y - 20, 4, '#c9a227');
  rect(ctx, x - 5, y + 18, 10, 5, '#c9a227');
}

// ---- Scene 1: Lantern Lane ---------------------------------------------
function drawLanternLane(ctx, right) {
  skyWash(ctx, '#1b2340', '#3d2b52');
  sprinkleStars(ctx, [[40, 40, 1.6], [150, 30, 1.2], [250, 55, 1.8], [330, 28, 1.2], [520, 40, 1.5], [200, 90, 1.1], [520, 120, 1.3], [60, 140, 1.1]]);
  // Moon: crescent on the left, full on the right.
  disc(ctx, 88, 66, 26, '#f6e7a8');
  if (!right) {
    disc(ctx, 99, 60, 22, '#232c4a');
  } else {
    disc(ctx, 80, 60, 4, '#d9c37a');
    disc(ctx, 96, 72, 3, '#d9c37a');
  }
  if (!right) bird(ctx, 478, 58, '#dfe6ff');
  // Back houses.
  rect(ctx, 30, 170, 150, 130, '#2a2440');
  poly(ctx, [[20, 172], [105, 120], [190, 172]], '#1d1830');
  rect(ctx, 360, 150, 170, 150, '#2f2547');
  poly(ctx, [[350, 152], [445, 96], [540, 152]], '#221a38');
  // The roof cat: only on the left.
  if (!right) {
    ctx.fillStyle = '#0f0c1a';
    ctx.beginPath();
    ctx.ellipse(432, 112, 16, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    disc(ctx, 444, 100, 7, '#0f0c1a');
    poly(ctx, [[439, 95], [441, 86], [445, 94]], '#0f0c1a');
    poly(ctx, [[447, 94], [450, 86], [451, 95]], '#0f0c1a');
    ctx.strokeStyle = '#0f0c1a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(417, 110);
    ctx.quadraticCurveTo(405, 100, 408, 90);
    ctx.stroke();
  }
  // Windows: the left one glows, the right one stays dark.
  rect(ctx, 160, 210, 36, 44, right ? '#171226' : '#ffd97a');
  rect(ctx, 176, 210, 3, 44, '#1d1830');
  rect(ctx, 160, 230, 36, 3, '#1d1830');
  rect(ctx, 400, 200, 36, 44, '#ffd97a');
  rect(ctx, 416, 200, 3, 44, '#1d1830');
  // Festival lanterns on a string.
  ctx.strokeStyle = '#0f0c1a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 118);
  ctx.quadraticCurveTo(280, 150, 560, 116);
  ctx.stroke();
  lantern(ctx, 150, 132, '#e2483d', true);
  lantern(ctx, 282, 148, right ? '#2fae8f' : '#e2483d', true);
  lantern(ctx, 420, 132, '#e2483d', true);
  // Market stall with a striped awning.
  poly(ctx, [[300, 240], [410, 240], [420, 268], [290, 268]], '#c94f43');
  const stripes = right ? 4 : 5;
  for (let i = 0; i < stripes; i++) {
    const x0 = 300 + (i * 110) / 5;
    poly(ctx, [[x0, 240], [x0 + 11, 240], [x0 + 13, 268], [x0 + 2, 268]], '#f2e3c2');
  }
  rect(ctx, 296, 268, 120, 66, '#7a4a2b');
  rect(ctx, 296, 268, 120, 8, '#9c6a3e');
  disc(ctx, 320, 300, 9, '#e2483d');
  disc(ctx, 345, 300, 9, '#e8a13c');
  disc(ctx, 370, 300, 9, '#7fb069');
  disc(ctx, 395, 300, 9, '#e2483d');
  // Cobbles and the flower pot by the door.
  rect(ctx, 0, 334, 560, 86, '#4a3f55');
  ctx.fillStyle = '#5d4f68';
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      ctx.beginPath();
      ctx.ellipse(40 + col * 70 + (row % 2) * 30, 352 + row * 22, 26, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  poly(ctx, [[98, 336], [138, 336], [132, 372], [104, 372]], '#b0613a');
  if (!right) {
    ctx.strokeStyle = '#3f7d44';
    ctx.lineWidth = 2.5;
    for (const [fx, fy] of [[108, 330], [118, 322], [128, 330]]) {
      ctx.beginPath();
      ctx.moveTo(fx, 338);
      ctx.lineTo(fx, fy + 4);
      ctx.stroke();
      disc(ctx, fx, fy, 6, '#e86a92');
      disc(ctx, fx, fy, 2.5, '#ffd97a');
    }
  }
  // Stall crates and a paper kite leaning by the wall.
  rect(ctx, 470, 330, 46, 34, '#8a6a45');
  rect(ctx, 478, 322, 30, 12, '#a5845a');
  ctx.strokeStyle = '#5d4020';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(470, 330, 46, 34);
}

// ---- Scene 2: Harbour Dawn ---------------------------------------------
function drawHarbourDawn(ctx, right) {
  skyWash(ctx, '#f7c489', '#8fb8d8');
  // Sun: rays on the left, a plain disc on the right.
  disc(ctx, 72, 68, 26, '#ffdf6b');
  if (!right) {
    ctx.strokeStyle = '#ffdf6b';
    ctx.lineWidth = 4;
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(72 + Math.cos(a) * 32, 68 + Math.sin(a) * 32);
      ctx.lineTo(72 + Math.cos(a) * 44, 68 + Math.sin(a) * 44);
      ctx.stroke();
    }
  }
  // Clouds and the morning gull.
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  for (const [cx, cy] of [[220, 60], [380, 45], [500, 90]]) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, 34, 12, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + 22, cy + 4, 24, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  if (!right) bird(ctx, 302, 66, '#3c4a5a');
  bird(ctx, 340, 92, '#3c4a5a');
  // Harbour house, chimney and flag.
  rect(ctx, 110, 150, 120, 110, '#f2e3c2');
  poly(ctx, [[100, 152], [170, 100], [240, 152]], '#b3543f');
  rect(ctx, 222, 108, 18, 44, '#8a6a45');
  if (!right) {
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    for (const [sx, sy, sr] of [[231, 96, 9], [236, 82, 12], [243, 66, 14]]) {
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.strokeStyle = '#5d4020';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(152, 100);
  ctx.lineTo(152, 58);
  ctx.stroke();
  poly(ctx, [[152, 58], [184, 66], [152, 76]], right ? '#3f6fb5' : '#d94f3d');
  rect(ctx, 140, 190, 30, 34, '#7fb069');
  rect(ctx, 190, 190, 30, 34, '#7fb069');
  // Lighthouse with its beam.
  rect(ctx, 436, 120, 34, 140, '#f2ede0');
  rect(ctx, 436, 150, 34, 14, '#d94f3d');
  rect(ctx, 436, 196, 34, 14, '#d94f3d');
  rect(ctx, 442, 96, 22, 26, '#3c4a5a');
  disc(ctx, 453, 109, 7, '#ffe9a0');
  if (!right) {
    const beam = ctx.createLinearGradient(470, 109, 560, 90);
    beam.addColorStop(0, 'rgba(255, 233, 160, 0.75)');
    beam.addColorStop(1, 'rgba(255, 233, 160, 0)');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(470, 100);
    ctx.lineTo(560, 78);
    ctx.lineTo(560, 132);
    ctx.lineTo(470, 118);
    ctx.closePath();
    ctx.fill();
  }
  // Sea, boats and the jumping fish.
  rect(ctx, 0, 260, 560, 160, '#3f7d9c');
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 2;
  for (const [wx, wy] of [[60, 300], [300, 330], [480, 300], [180, 380], [420, 385]]) {
    ctx.beginPath();
    ctx.moveTo(wx - 26, wy);
    ctx.quadraticCurveTo(wx, wy - 8, wx + 26, wy);
    ctx.stroke();
  }
  poly(ctx, [[80, 280], [180, 280], [165, 306], [95, 306]], '#7a4a2b');
  rect(ctx, 118, 236, 10, 46, '#5d4020');
  poly(ctx, [[128, 240], [168, 272], [128, 272]], '#f2e3c2');
  if (!right) disc(ctx, 122, 290, 6, '#ffe9a0');
  disc(ctx, 150, 292, 6, '#ffe9a0');
  if (!right) {
    ctx.strokeStyle = '#2f5d75';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(202, 336, 14, Math.PI, 0);
    ctx.stroke();
    poly(ctx, [[212, 322], [222, 318], [214, 330]], '#2f5d75');
  }
  disc(ctx, 382, 322, 12, right ? '#e8c33c' : '#e2703a');
  rect(ctx, 378, 306, 8, 10, '#5d4020');
  // Dock, crate and rope coil.
  rect(ctx, 420, 340, 140, 22, '#8a6a45');
  ctx.strokeStyle = '#6b4f30';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(430 + i * 28, 340);
    ctx.lineTo(430 + i * 28, 362);
    ctx.stroke();
  }
  if (!right) {
    rect(ctx, 470, 318, 26, 22, '#a5845a');
    ctx.strokeRect(470, 318, 26, 22);
  }
  if (!right) {
    ctx.strokeStyle = '#c9a227';
    ctx.lineWidth = 3;
    for (const r of [6, 11, 16]) {
      ctx.beginPath();
      ctx.arc(88, 362, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

// ---- Scene 3: Starlight Garden -----------------------------------------
function drawStarlightGarden(ctx, right) {
  skyWash(ctx, '#141a38', '#2c4a5e');
  sprinkleStars(ctx, [[50, 36, 1.5], [150, 48, 1.2], [260, 30, 1.6], [440, 40, 1.3], [520, 70, 1.5], [200, 80, 1.1], [320, 110, 1.2]]);
  if (!right) star(ctx, 368, 56, 9, '#ffe9a0');
  star(ctx, 90, 130, 6, '#ffffff');
  // Fireflies: one blinks out on the right.
  for (const [fx, fy] of [[96, 84], [160, 120], [420, 180], [300, 90]]) {
    if (right && fx === 96) continue;
    disc(ctx, fx, fy, 4, '#d8f26a');
    ctx.fillStyle = 'rgba(216,242,106,0.25)';
    ctx.beginPath();
    ctx.arc(fx, fy, 11, 0, Math.PI * 2);
    ctx.fill();
  }
  if (!right) {
    ctx.fillStyle = '#f2a6c0';
    ctx.beginPath();
    ctx.ellipse(468, 96, 10, 14, 0.5, 0, Math.PI * 2);
    ctx.ellipse(468, 96, 10, 14, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#5a3a52';
    ctx.fillRect(465, 88, 5, 18);
  }
  // Garden wall and ivy.
  rect(ctx, 0, 150, 560, 60, '#6b5a72');
  ctx.fillStyle = '#7d6b84';
  for (let i = 0; i < 14; i++) ctx.fillRect(i * 42, 150, 38, 8);
  ctx.fillStyle = '#3f7d44';
  for (const [ix, iy] of [[58, 196], [80, 182], [102, 200]]) {
    if (right && ix === 58) continue;
    ctx.beginPath();
    ctx.ellipse(ix, iy, 10, 7, 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  // Birdhouse on its post.
  rect(ctx, 396, 170, 8, 60, '#5d4020');
  poly(ctx, [[378, 172], [400, 148], [422, 172]], '#b3543f');
  rect(ctx, 382, 170, 36, 30, '#c9a227');
  if (right) {
    disc(ctx, 400, 185, 6, '#8a6a45');
  } else {
    disc(ctx, 400, 185, 6, '#241a10');
  }
  // Fountain with sparkling water.
  ctx.fillStyle = '#8fb8d8';
  ctx.beginPath();
  ctx.ellipse(282, 210, 46, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  rect(ctx, 276, 170, 12, 34, '#b8c4cc');
  disc(ctx, 282, 168, 10, '#b8c4cc');
  if (!right) {
    ctx.fillStyle = '#ffffff';
    for (const [sx, sy] of [[268, 200], [282, 194], [296, 202], [276, 208], [290, 208]]) {
      star(ctx, sx, sy, 4, '#ffffff');
    }
  }
  // Flower bed: one bloom changes colour.
  for (const [fx, fy, col] of [[132, 238, '#e86a92'], [160, 246, '#e8a13c'], [104, 246, '#b678d8']]) {
    const bloom = right && fx === 132 ? '#3f6fb5' : col;
    ctx.strokeStyle = '#3f7d44';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(fx, 262);
    ctx.lineTo(fx, fy + 4);
    ctx.stroke();
    disc(ctx, fx, fy, 7, bloom);
    disc(ctx, fx, fy, 2.5, '#ffd97a');
  }
  // Lawn, path and stepping stones.
  rect(ctx, 0, 262, 560, 158, '#2f5d33');
  poly(ctx, [[240, 262], [320, 262], [360, 420], [200, 420]], '#c9b18a');
  ctx.fillStyle = '#a8946e';
  for (const [sx, sy] of [[282, 300], [268, 340], [296, 380]]) {
    if (right && sx === 342) continue;
    ctx.beginPath();
    ctx.ellipse(sx, sy, 20, 9, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  if (!right) {
    ctx.beginPath();
    ctx.ellipse(342, 352, 20, 9, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // Mushroom with spots, garden lamp, bench and snail.
  disc(ctx, 178, 322, 12, '#f2ede0');
  ctx.fillStyle = '#d94f3d';
  ctx.beginPath();
  ctx.arc(178, 322, 16, Math.PI, 0);
  ctx.fill();
  if (!right) {
    disc(ctx, 170, 312, 3, '#ffffff');
    disc(ctx, 182, 308, 2.5, '#ffffff');
    disc(ctx, 186, 316, 2, '#ffffff');
  }
  rect(ctx, 494, 262, 6, 44, '#3c4a5a');
  disc(ctx, 497, 258, 9, right ? '#3c4a5a' : '#ffe9a0');
  if (!right) {
    ctx.fillStyle = 'rgba(255,233,160,0.3)';
    ctx.beginPath();
    ctx.arc(497, 258, 18, 0, Math.PI * 2);
    ctx.fill();
  }
  rect(ctx, 420, 300, 64, 10, '#8a6a45');
  rect(ctx, 426, 310, 6, 22, '#6b4f30');
  rect(ctx, 472, 310, 6, 22, '#6b4f30');
  if (!right) rect(ctx, 428, 292, 48, 10, '#e86a92');
  if (!right) {
    ctx.fillStyle = '#c9a227';
    ctx.beginPath();
    ctx.arc(232, 368, 10, Math.PI, 0);
    ctx.fill();
    disc(ctx, 240, 360, 4, '#8a6a45');
  }
  // Bushes.
  ctx.fillStyle = '#274d2b';
  for (const [bx, by] of [[40, 300], [520, 300], [60, 380], [500, 390]]) {
    ctx.beginPath();
    ctx.arc(bx, by, 26, 0, Math.PI * 2);
    ctx.arc(bx + 20, by + 6, 20, 0, Math.PI * 2);
    ctx.fill();
  }
}

const SCENE_DRAWERS = {
  'lantern-lane': drawLanternLane,
  'harbour-dawn': drawHarbourDawn,
  'starlight-garden': drawStarlightGarden,
};

export function drawScene(ctx, levelId, isRightPanel) {
  const drawer = SCENE_DRAWERS[levelId] ?? drawLanternLane;
  ctx.clearRect(0, 0, PANEL_W, PANEL_H);
  drawer(ctx, isRightPanel);
}
