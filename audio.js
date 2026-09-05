// ==========================================
// AR NutriQuest Audio & Voice Engine
// Web Audio API Procedural SFX + Web Speech Thai Voice + Cloud TTS Fallback
// Fully compatible with GitHub Pages, PC/Mac, iOS/iPadOS, Android
// ==========================================

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.sfxEnabled = true;
    this.voiceEnabled = true;
    this.speechSynth = typeof window !== 'undefined' && window.speechSynthesis ? window.speechSynthesis : null;
    this.thaiVoice = null;
    this.hasThaiVoiceChecked = false;
    this.isUnlocked = false;
    this.activeUtterances = new Set();
    this.voicePollCount = 0;
    this.speechWatchdog = null;
    this.fallbackAudio = null; // HTML5 Audio for Cloud Thai TTS fallback

    this.initAudioContext();
    this.loadVoices();
    this.setupUnlockListeners();
  }

  // Initialize AudioContext safely
  initAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx && !this.ctx) {
        this.ctx = new AudioCtx({ latencyHint: 'interactive' });
      }
    } catch (e) {
      console.warn('AudioContext initialization error:', e);
    }
  }

  // Setup global user-gesture unlock listeners for strict browser autoplay policies & iOS WebKit
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

  // Unlock Web Audio and Web Speech upon first user interaction (handles iPad Silent Mode & WebKit AudioSession)
  unlock() {
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

      // iOS Silent Switch Promotion: play a tiny silent WAV audio element to promote iOS AudioSession to Playback
      if (!this.isUnlocked) {
        try {
          const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
          silentAudio.volume = 0.01;
          silentAudio.play().then(() => {
            silentAudio.pause();
          }).catch(() => {});
        } catch (e) {}
      }

      // Unlock SpeechSynthesis if paused
      if (this.speechSynth) {
        if (this.speechSynth.paused) {
          this.speechSynth.resume();
        }
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

  // Multi-stage Voice loading with polling fallback for Chrome / Android / iOS / Windows
  loadVoices() {
    if (!this.speechSynth) return;

    const findVoice = () => {
      const best = this.getBestThaiVoice();
      if (best) {
        this.thaiVoice = best;
        this.hasThaiVoiceChecked = true;
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
    }, 350);
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

    // กรองเสียงภาษาไทยทั้งหมดอย่างละเอียด (รองรับทุกระบบปฏิบัติการ)
    const thaiVoices = voices.filter(v => {
      const lang = (v.lang || '').toLowerCase().replace(/_/g, '-');
      const name = (v.name || '').toLowerCase();
      const uri = (v.voiceURI || '').toLowerCase();
      return lang.includes('th') || 
             lang === 'th-th' || 
             name.includes('thai') || 
             name.includes('ไทย') || 
             name.includes('kanya') || 
             name.includes('narisa') || 
             name.includes('niwat') || 
             name.includes('pattara') || 
             name.includes('premwadee') || 
             name.includes('achara') || 
             uri.includes('th-th');
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

  // เสียงสังเคราะห์ (Web Audio API Synthesizer) - ปรับปรุงให้รองรับ iPad / iOS WebKit 100%
  playTone(freq, type = 'sine', duration = 0.2, gainVal = 0.3) {
    if (!this.sfxEnabled) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      // WebKit / iOS Safari safe linear ramp + setTargetAtTime
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(gainVal, now + 0.015);
      gain.gain.setTargetAtTime(0.0001, now + 0.03, duration * 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch (e) {
      // Fallback: try resume on next tick
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }
  }

  playClick() {
    this.playTone(850, 'sine', 0.08, 0.25);
  }

  playCorrect() {
    if (!this.sfxEnabled) return;
    try {
      this.ensureContext();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'triangle', 0.25, 0.35);
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
          this.playTone(freq, 'sawtooth', 0.2, 0.28);
        }, idx * 120);
      });
    } catch (e) {}
  }

  playGrab() {
    this.playTone(440, 'sine', 0.12, 0.28);
  }

  playDrop() {
    this.playTone(600, 'sine', 0.15, 0.3);
  }

  playLevelUp() {
    if (!this.sfxEnabled) return;
    try {
      this.ensureContext();
      const chords = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      chords.forEach((freq, i) => {
        setTimeout(() => {
          this.playTone(freq, 'sine', 0.35, 0.35);
        }, i * 90);
      });
    } catch (e) {}
  }

  playBubble() {
    if (!this.sfxEnabled) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;
      const startFreq = 320 + Math.random() * 200;
      const endFreq = startFreq + 350;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const now = this.ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.linearRampToValueAtTime(endFreq, now + 0.15);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.02);
      gain.gain.setTargetAtTime(0.0001, now + 0.04, 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
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
          this.playTone(note.f, 'triangle', note.d / 1000, 0.38);
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
        this.playTone(783.99, 'triangle', 0.12, 0.35);
        setTimeout(() => this.playTone(1046.50, 'sine', 0.4, 0.4), 100);
      } else {
        this.playTone(587.33, 'sine', 0.2, 0.3);
      }
    } catch (e) {}
  }

  // เสียงพูดภาษาไทย - รองรับ Web Speech API + Cloud TTS Fallback (ป้องกันเสียงอ่านเป็นภาษาอังกฤษบนเครื่องที่ไม่มี Thai Voice Pack)
  speak(text) {
    if (!this.voiceEnabled || !text) return;

    try {
      this.unlock();

      // Stop previous fallback audio if playing
      if (this.fallbackAudio) {
        this.fallbackAudio.pause();
        this.fallbackAudio = null;
      }

      // Clear any pending Web Speech queue cleanly to avoid Chrome freeze
      if (this.speechSynth) {
        if (this.speechSynth.speaking || this.speechSynth.pending) {
          this.speechSynth.cancel();
        }
        if (this.speechSynth.paused) {
          this.speechSynth.resume();
        }
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
    if (!this.voiceEnabled || !text) return;

    // Check if browser has a valid Thai voice
    const chosenVoice = this.thaiVoice || this.getBestThaiVoice();

    // 1. If genuine Thai voice is available -> Use high-performance Web Speech API
    if (chosenVoice && this.speechSynth) {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = chosenVoice;
        utterance.lang = 'th-TH';
        utterance.rate = 1.0;
        utterance.pitch = 0.98;

        // Retain reference to prevent Chrome Garbage Collection bug
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

        if (this.speechSynth.resume) {
          this.speechSynth.resume();
        }

        this.speechSynth.speak(utterance);

        // Chrome watchdog to prevent long-speech pausing
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
        return;
      } catch (err) {
        console.warn('Web Speech API failed, falling back to Cloud TTS:', err);
      }
    }

    // 2. If NO Thai voice is installed on this machine (e.g., English Windows PC):
    // Use Natural Cloud Thai TTS stream to ensure it NEVER speaks in English!
    this.playCloudThaiTts(text);
  }

  // Cloud Thai TTS Fallback using Google Thai audio synthesis
  playCloudThaiTts(text) {
    try {
      if (this.fallbackAudio) {
        this.fallbackAudio.pause();
        this.fallbackAudio = null;
      }

      // Encode clean text (limit length for URL safety)
      const cleanText = text.trim().substring(0, 180);
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=th&client=tw-ob&q=${encodeURIComponent(cleanText)}`;

      const audio = new Audio(url);
      audio.volume = 1.0;
      this.fallbackAudio = audio;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          // If network / CORS blocks cloud TTS, play a soft melodic prompt instead of speaking broken English
          this.playTone(523.25, 'triangle', 0.25, 0.25);
        });
      }
    } catch (e) {
      console.warn('Cloud TTS fallback error:', e);
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
    if (!this.voiceEnabled) {
      if (this.speechSynth) this.speechSynth.cancel();
      if (this.fallbackAudio) {
        this.fallbackAudio.pause();
        this.fallbackAudio = null;
      }
    }
    return this.voiceEnabled;
  }
}

export const audio = new AudioEngine();

