// ==========================================
// AR NutriQuest Audio & Voice Engine
// Web Audio API Procedural SFX + Web Speech Thai Voice
// Fully compatible with GitHub Pages, Chrome, Safari, iOS & Android
// ==========================================

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.sfxEnabled = true;
    this.voiceEnabled = true;
    this.speechSynth = typeof window !== 'undefined' && window.speechSynthesis ? window.speechSynthesis : null;
    this.thaiVoice = null;
    this.isUnlocked = false;
    this.activeUtterances = new Set();
    this.voicePollCount = 0;
    this.speechWatchdog = null;

    this.initAudioContext();
    this.loadVoices();
    this.setupUnlockListeners();
  }

  // Initialize AudioContext safely
  initAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx && !this.ctx) {
        this.ctx = new AudioCtx();
      }
    } catch (e) {
      console.warn('AudioContext initialization error:', e);
    }
  }

  // Setup global user-gesture unlock listeners for strict browser autoplay policies (GitHub Pages HTTPS)
  setupUnlockListeners() {
    const unlockHandler = () => {
      this.unlock();
    };

    const events = ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown'];
    events.forEach(evt => {
      window.addEventListener(evt, unlockHandler, { passive: true, capture: true });
      document.addEventListener(evt, unlockHandler, { passive: true, capture: true });
    });
  }

  // Unlock Web Audio and Web Speech upon first user interaction
  unlock() {
    if (this.isUnlocked && this.ctx && this.ctx.state === 'running') return;

    try {
      if (!this.ctx) {
        this.initAudioContext();
      }

      if (this.ctx) {
        if (this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }

        // Play 1 silent frame to unlock iOS/Safari WebKit audio hardware pipe
        try {
          const buffer = this.ctx.createBuffer(1, 1, 22050);
          const source = this.ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(this.ctx.destination);
          source.start(0);
        } catch (err) {}
      }

      // Unlock SpeechSynthesis if paused
      if (this.speechSynth) {
        if (this.speechSynth.paused) {
          this.speechSynth.resume();
        }
        // If voice was not loaded yet, try loading now
        if (!this.thaiVoice) {
          this.loadVoices();
        }
      }

      this.isUnlocked = true;
    } catch (e) {
      console.warn('Audio unlock warning:', e);
    }
  }

  ensureContext() {
    if (!this.ctx) {
      this.initAudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Multi-stage Voice loading with polling fallback for Chrome / Android / iOS
  loadVoices() {
    if (!this.speechSynth) return;

    const findVoice = () => {
      const best = this.getBestThaiVoice();
      if (best) {
        this.thaiVoice = best;
      }
    };

    findVoice();

    // Listen to voiceschanged event
    if (typeof this.speechSynth.addEventListener === 'function') {
      this.speechSynth.addEventListener('voiceschanged', findVoice);
    }
    this.speechSynth.onvoiceschanged = findVoice;

    // Polling retry for browsers where voices load asynchronously (Chrome/Android)
    const pollInterval = setInterval(() => {
      this.voicePollCount++;
      findVoice();
      if (this.thaiVoice || this.voicePollCount > 10) {
        clearInterval(pollInterval);
      }
    }, 400);
  }

  getBestThaiVoice() {
    if (!this.speechSynth) return null;
    let voices = [];
    try {
      voices = this.speechSynth.getVoices() || [];
    } catch (e) {
      return null;
    }
    if (voices.length === 0) return null;

    // กรองเสียงภาษาไทยทั้งหมด
    const thaiVoices = voices.filter(v => {
      const lang = (v.lang || '').toLowerCase();
      const name = (v.name || '').toLowerCase();
      return lang.includes('th') || lang.includes('th-th') || lang.includes('th_th') || name.includes('thai') || name.includes('ไทย');
    });

    if (thaiVoices.length > 0) {
      // 1. ตรวจสอบเสียงผู้ชายภาษาไทยคุณภาพสูง (Natural / Neural)
      const maleVoice = thaiVoices.find(v => {
        const info = `${v.name} ${v.voiceURI || ''}`.toLowerCase();
        return info.includes('niwat') || info.includes('pattara') || info.includes('male') || info.includes('man') || info.includes('boy');
      });
      if (maleVoice) return maleVoice;

      // 2. ตรวจสอบเสียงไทยคุณภาพสูงอื่นๆ (Google, Premwadee, Kanya, Narisa, Siri)
      const naturalVoice = thaiVoices.find(v => {
        const info = `${v.name} ${v.voiceURI || ''}`.toLowerCase();
        return info.includes('natural') || info.includes('google') || info.includes('premwadee') || info.includes('kanya') || info.includes('narisa') || info.includes('siri');
      });
      if (naturalVoice) return naturalVoice;

      // 3. ใช้เสียงภาษาไทยตัวแรกที่พบ
      return thaiVoices[0];
    }

    return null;
  }

  // เสียงสังเคราะห์ (Web Audio API Synthesizer)
  playTone(freq, type = 'sine', duration = 0.2, gainVal = 0.15) {
    if (!this.sfxEnabled) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(gainVal, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      // Ignore audio rendering glitches
    }
  }

  playClick() {
    this.playTone(800, 'sine', 0.08, 0.1);
  }

  playCorrect() {
    if (!this.sfxEnabled) return;
    try {
      this.ensureContext();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'triangle', 0.25, 0.2);
        }, idx * 75);
      });
    } catch (e) {}
  }

  playWrong() {
    if (!this.sfxEnabled) return;
    try {
      this.ensureContext();
      const notes = [220, 180];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'sawtooth', 0.2, 0.15);
        }, idx * 120);
      });
    } catch (e) {}
  }

  playGrab() {
    this.playTone(440, 'sine', 0.12, 0.15);
  }

  playDrop() {
    this.playTone(600, 'sine', 0.15, 0.18);
  }

  playLevelUp() {
    if (!this.sfxEnabled) return;
    try {
      this.ensureContext();
      const chords = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      chords.forEach((freq, i) => {
        setTimeout(() => {
          this.playTone(freq, 'sine', 0.35, 0.2);
        }, i * 90);
      });
    } catch (e) {}
  }

  playBubble() {
    if (!this.sfxEnabled) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;
      const startFreq = 300 + Math.random() * 200;
      const endFreq = startFreq + 300;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const now = this.ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.15);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  playFanfare() {
    if (!this.sfxEnabled) return;
    try {
      this.ensureContext();
      const song = [
        { f: 523.25, d: 150 },
        { f: 523.25, d: 150 },
        { f: 523.25, d: 150 },
        { f: 659.25, d: 350 },
        { f: 783.99, d: 200 },
        { f: 1046.50, d: 600 }
      ];
      let t = 0;
      song.forEach(note => {
        setTimeout(() => {
          this.playTone(note.f, 'triangle', note.d / 1000, 0.25);
        }, t);
        t += note.d + 30;
      });
    } catch (e) {}
  }

  playCountdownBeep(isFinal = false) {
    if (!this.sfxEnabled) return;
    try {
      this.ensureContext();
      if (isFinal) {
        this.playTone(783.99, 'triangle', 0.12, 0.25);
        setTimeout(() => this.playTone(1046.50, 'sine', 0.4, 0.28), 100);
      } else {
        this.playTone(587.33, 'sine', 0.2, 0.22);
      }
    } catch (e) {}
  }

  // เสียงพูดภาษาไทย (Web Speech API) - รองรับ Chrome, Safari iOS, Android และ GitHub Pages
  speak(text) {
    if (!this.voiceEnabled || !this.speechSynth || !text) return;

    try {
      this.unlock();

      // Clear any pending speech queue cleanly to avoid Chrome freeze
      if (this.speechSynth.speaking || this.speechSynth.pending) {
        this.speechSynth.cancel();
      }
      if (this.speechSynth.paused) {
        this.speechSynth.resume();
      }

      // Small delay after cancel to prevent Chrome from silently dropping next utterance
      setTimeout(() => {
        this.executeSpeak(text);
      }, 35);
    } catch (e) {
      console.warn('Speech error:', e);
    }
  }

  executeSpeak(text) {
    if (!this.speechSynth || !this.voiceEnabled) return;

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'th-TH';
      utterance.rate = 1.0;
      utterance.pitch = 0.98;

      // Select best Thai voice
      const chosenVoice = this.thaiVoice || this.getBestThaiVoice();
      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      // Prevent Chrome Garbage Collection bug by retaining reference in Set
      this.activeUtterances.add(utterance);

      utterance.onend = () => {
        this.activeUtterances.delete(utterance);
        if (this.speechWatchdog) {
          clearInterval(this.speechWatchdog);
          this.speechWatchdog = null;
        }
      };

      utterance.onerror = (e) => {
        this.activeUtterances.delete(utterance);
        if (this.speechWatchdog) {
          clearInterval(this.speechWatchdog);
          this.speechWatchdog = null;
        }
      };

      // Chrome long-speech pause workaround
      if (this.speechSynth.resume) {
        this.speechSynth.resume();
      }

      this.speechSynth.speak(utterance);

      // Start watchdog to keep speech alive on Chromium
      if (!this.speechWatchdog && this.speechSynth.speaking) {
        this.speechWatchdog = setInterval(() => {
          if (this.speechSynth && this.speechSynth.speaking) {
            this.speechSynth.pause();
            this.speechSynth.resume();
          } else {
            clearInterval(this.speechWatchdog);
            this.speechWatchdog = null;
          }
        }, 8000);
      }
    } catch (err) {
      console.warn('Speech execute error:', err);
    }
  }

  toggleSfx() {
    this.sfxEnabled = !this.sfxEnabled;
    this.unlock();
    return this.sfxEnabled;
  }

  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    this.unlock();
    if (!this.voiceEnabled && this.speechSynth) {
      this.speechSynth.cancel();
    }
    return this.voiceEnabled;
  }
}

export const audio = new AudioEngine();
