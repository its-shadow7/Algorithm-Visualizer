class AudioEngine {
  constructor() {
    this.ctx = null;
    this.activeOscillator = null;
    this.activeGain = null;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playNote(value, maxVal) {
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      // 1. Polyphony Prevention (Monophonic Pattern)
      // Immediately stop and disconnect previous note to prevent muddiness
      if (this.activeOscillator) {
        try {
          this.activeOscillator.stop();
          this.activeOscillator.disconnect();
          this.activeGain.disconnect();
        } catch (e) {
          // Silently fail if already stopped
        }
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // 2. Logarithmic Frequency Mapping (Musical Scale)
      // Range: 200Hz - 1000Hz
      const minFreq = 200;
      const maxFreq = 1000;
      const freq = minFreq * Math.pow(maxFreq / minFreq, value / maxVal);
      
      osc.type = 'triangle'; // Plucky/Chiptune characteristic
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // 3. 'Pluck' Envelope (Percussive sharp decay)
      // Instant attack, very sharp 50ms exponential decay
      const decayTime = 0.05; // 50ms
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime); 
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + decayTime);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + decayTime);

      // Track active nodes
      this.activeOscillator = osc;
      this.activeGain = gain;

    } catch (e) {
      console.warn("Audio trigger failed:", e);
    }
  }
}

export const audioEngine = new AudioEngine();
