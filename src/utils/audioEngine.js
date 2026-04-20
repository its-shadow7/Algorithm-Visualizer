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
    // 1. Hard Unlock (Absolute first line to satisfy browser strictness)
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (!this.ctx) return;

    try {
      // Polyphony Prevention
      if (this.activeOscillator) {
        try {
          this.activeOscillator.stop();
          this.activeOscillator.disconnect();
          this.activeGain.disconnect();
        } catch (e) {
          // Already stopped
        }
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // 3. Frequency Safety & Mapping
      // Fallback for maxVal to avoid division by zero or NaN
      const safeMax = maxVal || 100;
      const safeVal = value || 0;
      
      const minFreq = 200;
      const maxFreq = 1000;
      
      // Calculate Logarithmic Frequency
      let freq = minFreq * Math.pow(maxFreq / minFreq, safeVal / safeMax);
      
      // 4. Frequency Health Check (Avoid 0Hz)
      freq = Math.max(20, Math.min(3000, freq));
      
      // Heartbeat Log for Debugging
      console.log("🔊 Playing Note:", Math.round(freq), "Hz (Value:", safeVal, "/", safeMax, ")");

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // 5. Volume Bump & Envelope (0.3 starting gain)
      const decayTime = 0.05; 
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime); 
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + decayTime);

      // 6. Explicit Destination Connection
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + decayTime);

      this.activeOscillator = osc;
      this.activeGain = gain;

    } catch (e) {
      console.warn("Audio trigger failed:", e);
    }
  }
}

export const audioEngine = new AudioEngine();
