// ==========================================
// AR NutriQuest Audio & Voice Engine
// Web Audio API Procedural SFX + Web Speech Thai Voice
// ==========================================

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.sfxEnabled = true;
    this.voiceEnabled = true;
    this.speechSynth = window.speechSynthesis || null;
    this.thaiVoice = null;
    this.initAudioContext();
    this.loadVoices();
  }

  initAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    } catch (e) {
      console.warn('AudioContext not supported:', e);
    }
  }

  ensureContext() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  loadVoices() {
    if (!this.speechSynth) return;
    const findVoice = () => {
      this.thaiVoice = this.getBestMaleVoice();
    };
    findVoice();
    if (this.speechSynth.onvoiceschanged !== undefined) {
      this.speechSynth.onvoiceschanged = findVoice;
    }
  }

  getBestMaleVoice() {
    if (!this.speechSynth) return null;
    const voices = this.speechSynth.getVoices() || [];
    if (voices.length === 0) return null;

    // กรองเสียงภาษาไทยทั้งหมด
    const thaiVoices = voices.filter(v => v.lang === 'th-TH' || v.lang.startsWith('th') || v.lang.toLowerCase().includes('th_th'));

    // ตรวจสอบเสียงผู้ชาย
    const isMale = (v) => {
      const info = `${v.name} ${v.voiceURI || ''}`.toLowerCase();
      return info.includes('niwat') || info.includes('pattara') || info.includes('male') || info.includes('man') || info.includes('boy');
    };

    if (thaiVoices.length > 0) {
      // ลำดับความสำคัญของเสียงผู้ชายภาษาไทยคุณภาพสูง
      const niwat = thaiVoices.find(v => v.name.includes('Niwat')); // Microsoft Niwat Natural (เสียงผู้ชายธรรมชาติ นุ่มนวล ชัดเจน)
      if (niwat) return niwat;

      const pattara = thaiVoices.find(v => v.name.includes('Pattara')); // Microsoft Pattara
      if (pattara) return pattara;

      const explicitMale = thaiVoices.find(v => isMale(v));
      if (explicitMale) return explicitMale;

      // หากเบราว์เซอร์ไม่มีเสียงระบุเพศชัดเจน ให้ใช้เสียงไทยแล้วปรับ pitch ให้เป็นเสียงผู้ชาย
      return thaiVoices[0];
    }

    // กรณีไม่มีเสียงภาษาไทยโดยตรง ลองหาเสียงภาษาไทยทั่วไป
    return voices.find(v => v.lang.includes('th')) || null;
  }

  // เสียงสังเคราะห์ (Web Audio API)
  playTone(freq, type = 'sine', duration = 0.2, gainVal = 0.15) {
    if (!this.sfxEnabled || !this.ctx) return;
    try {
      this.ensureContext();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // ignore
    }
  }

  playClick() {
    this.playTone(800, 'sine', 0.08, 0.1);
  }

  playCorrect() {
    if (!this.sfxEnabled || !this.ctx) return;
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
    if (!this.sfxEnabled || !this.ctx) return;
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
    if (!this.sfxEnabled || !this.ctx) return;
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
    if (!this.sfxEnabled || !this.ctx) return;
    try {
      this.ensureContext();
      const startFreq = 300 + Math.random() * 200;
      const endFreq = startFreq + 300;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {}
  }

  playFanfare() {
    if (!this.sfxEnabled || !this.ctx) return;
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
    if (!this.sfxEnabled || !this.ctx) return;
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

  // เสียงพูดภาษาไทย (Web Speech API) - โทนเสียงผู้ชาย อบอุ่น นุ่มนวล ชัดเจน
  speak(text) {
    if (!this.voiceEnabled || !this.speechSynth) return;
    try {
      this.speechSynth.cancel(); // หยุดเสียงก่อนหน้า
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'th-TH';
      utterance.rate = 1.02; // จังหวะกำลังดี สุภาพ ฟังชัด
      utterance.pitch = 0.95; // ปรับคีย์เสียงทุ้ม-กลาง สุภาพ แบบเสียงผู้ชาย

      const maleVoice = this.thaiVoice || this.getBestMaleVoice();
      if (maleVoice) {
        utterance.voice = maleVoice;
      }
      this.speechSynth.speak(utterance);
    } catch (e) {
      console.warn('Speech error:', e);
    }
  }

  toggleSfx() {
    this.sfxEnabled = !this.sfxEnabled;
    return this.sfxEnabled;
  }

  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    if (!this.voiceEnabled && this.speechSynth) {
      this.speechSynth.cancel();
    }
    return this.voiceEnabled;
  }
}

export const audio = new AudioEngine();
