// audio.js — every sound in the game, synthesised with WebAudio.
// No audio files are shipped: each effect is a few oscillators shaped
// with a gain envelope, so the game stays silent on the network.

export class SoundBank {
  constructor() {
    this.context = null;
    this.muted = false;
  }

  ensure() {
    if (!this.context) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return false;
      this.context = new AudioContext();
    }
    if (this.context.state === 'suspended') void this.context.resume();
    return true;
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  tone(freq, startAt, length, type, volume) {
    if (this.muted || !this.ensure()) return;
    const now = this.context.currentTime + startAt;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + length);
    osc.connect(gain);
    gain.connect(this.context.destination);
    osc.start(now);
    osc.stop(now + length + 0.05);
  }

  found() {
    this.tone(659.25, 0, 0.22, 'sine', 0.22);
    this.tone(880.0, 0.09, 0.3, 'sine', 0.22);
    this.tone(1318.5, 0.18, 0.34, 'triangle', 0.12);
  }

  wrong() {
    this.tone(160, 0, 0.25, 'square', 0.12);
    this.tone(110, 0.08, 0.3, 'square', 0.1);
  }

  hint() {
    this.tone(1046.5, 0, 0.16, 'sine', 0.16);
    this.tone(1046.5, 0.18, 0.22, 'sine', 0.16);
  }

  tick() {
    this.tone(1200, 0, 0.05, 'sine', 0.06);
  }

  levelWin() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => this.tone(freq, i * 0.11, 0.32, 'triangle', 0.2));
  }

  gameWin() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5];
    notes.forEach((freq, i) => this.tone(freq, i * 0.12, 0.36, 'triangle', 0.2));
  }
}
