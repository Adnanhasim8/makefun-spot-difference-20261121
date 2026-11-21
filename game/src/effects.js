// effects.js — the celebration on top of the pictures: found-rings that
// bloom around a difference, a pulsing hint ring, floating score text and
// the red cross of a wrong click. All of it is drawn on the canvases,
// so it shows up in screenshots exactly as the player sees it.

export class Effects {
  constructor() {
    this.rings = [];
    this.floaters = [];
    this.misses = [];
    this.hintRing = null;
    this.shakeUntil = 0;
  }

  addFoundRing(x, y) {
    this.rings.push({ x, y, born: performance.now(), life: 900 });
  }

  addFloater(x, y, text) {
    this.floaters.push({ x, y, text, born: performance.now(), life: 1100 });
  }

  addMiss(x, y) {
    this.misses.push({ x, y, born: performance.now(), life: 600 });
    this.shakeUntil = performance.now() + 220;
  }

  setHint(x, y) {
    this.hintRing = { x, y, born: performance.now(), life: 2500 };
  }

  isShaking(now) {
    return now < this.shakeUntil;
  }

  prune(now) {
    this.rings = this.rings.filter((ring) => now - ring.born < ring.life);
    this.floaters = this.floaters.filter((item) => now - item.born < item.life);
    this.misses = this.misses.filter((miss) => now - miss.born < miss.life);
    if (this.hintRing && now - this.hintRing.born >= this.hintRing.life) {
      this.hintRing = null;
    }
  }

  drawFoundRings(ctx, now) {
    for (const ring of this.rings) {
      const age = (now - ring.born) / ring.life;
      const radius = 14 + age * 14;
      ctx.strokeStyle = `rgba(255, 215, 90, ${1 - age * 0.55})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, radius + 3, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  drawMarkers(ctx, diffs, foundIds) {
    for (const diff of diffs) {
      if (!foundIds.has(diff.id)) continue;
      ctx.strokeStyle = '#ffd75a';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(diff.x, diff.y, diff.r + 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.95)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(diff.x, diff.y, diff.r + 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#2f7d4f';
      ctx.beginPath();
      ctx.arc(diff.x + diff.r - 2, diff.y - diff.r + 2, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(diff.x + diff.r - 6, diff.y - diff.r + 2);
      ctx.lineTo(diff.x + diff.r - 2, diff.y - diff.r + 6);
      ctx.lineTo(diff.x + diff.r + 5, diff.y - diff.r - 4);
      ctx.stroke();
    }
  }

  drawHint(ctx, now) {
    if (!this.hintRing) return;
    const age = (now - this.hintRing.born) / this.hintRing.life;
    const pulse = 1 + 0.25 * Math.sin(now / 130);
    ctx.strokeStyle = `rgba(120, 220, 255, ${0.95 - age * 0.5})`;
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.arc(this.hintRing.x, this.hintRing.y, 26 * pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawMisses(ctx, now) {
    for (const miss of this.misses) {
      const age = (now - miss.born) / miss.life;
      ctx.strokeStyle = `rgba(255, 80, 70, ${1 - age})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(miss.x - 10, miss.y - 10);
      ctx.lineTo(miss.x + 10, miss.y + 10);
      ctx.moveTo(miss.x + 10, miss.y - 10);
      ctx.lineTo(miss.x - 10, miss.y + 10);
      ctx.stroke();
    }
  }

  drawFloaters(ctx, now) {
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.textAlign = 'center';
    for (const item of this.floaters) {
      const age = (now - item.born) / item.life;
      ctx.fillStyle = `rgba(255, 240, 170, ${1 - age})`;
      ctx.fillText(item.text, item.x, item.y - age * 34);
    }
  }

  drawCrosshair(ctx, x, y) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 18, y);
    ctx.lineTo(x - 6, y);
    ctx.moveTo(x + 6, y);
    ctx.lineTo(x + 18, y);
    ctx.moveTo(x, y - 18);
    ctx.lineTo(x, y - 6);
    ctx.moveTo(x, y + 6);
    ctx.lineTo(x, y + 18);
    ctx.stroke();
  }
}
