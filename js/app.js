// ==========================================
// AR NutriQuest Master Application Controller
// วิทยาศาสตร์และเทคโนโลยี ป.6: อาหารและสารอาหาร
// ==========================================

import { AREngine } from './ar-engine.js';
import { ThreeSceneManager } from './three-scene.js';
import { audio } from './audio.js';
import { NUTRIENT_GROUPS, VITAMINS_GUIDE, MINERALS_GUIDE, FOOD_ITEMS } from './food-data.js';

import { GameClassify } from './game-classify.js';
import { GamePlate } from './game-plate.js';
import { GameClinic } from './game-clinic.js';
import { GameLab } from './game-lab.js';
import { GameQuiz } from './game-quiz.js';

class App {
  constructor() {
    this.currentMode = 'classify'; // 'classify', 'plate', 'clinic', 'lab', 'quiz'
    this.arEngine = null;
    this.threeScene = null;

    this.modes = {};
    this.init();
  }

  async init() {
    // 1. Setup Camera & AR
    const video = document.getElementById('webcam-video');
    const overlayCanvas = document.getElementById('ar-hand-canvas');
    this.arEngine = new AREngine(video, overlayCanvas);

    // 2. Setup 3D Scene
    const threeContainer = document.getElementById('three-container');
    if (threeContainer) {
      this.threeScene = new ThreeSceneManager(threeContainer);
    }

    // 3. Initialize Game Modes
    this.modes = {
      classify: new GameClassify(this),
      plate: new GamePlate(this),
      clinic: new GameClinic(this),
      lab: new GameLab(this),
      quiz: new GameQuiz(this)
    };

    // 4. Mount Game Modes to DOM
    this.modes.classify.mount(document.getElementById('mode-classify-container'));
    this.modes.plate.mount(document.getElementById('mode-plate-container'));
    this.modes.clinic.mount(document.getElementById('mode-clinic-container'));
    this.modes.lab.mount(document.getElementById('mode-lab-container'));
    this.modes.quiz.mount(document.getElementById('mode-quiz-container'));

    // 5. Connect AR & Touch Events
    this.bindArEvents();

    // 6. Bind Global Navigation & UI
    this.bindGlobalUI();

    // 7. Render Encyclopedia Data
    this.renderEncyclopedia();

    // 8. Start Initial Mode
    this.switchMode('classify');

    // Welcome Voice Prompt
    setTimeout(() => {
      audio.speak('ยินดีต้อนรับสู่เกม AR อาหารและสารอาหาร ชั้น ป.6 แตะเปิดกล้องเพื่อสัมผัสอาหารในอากาศ หรือเลือกโหมดการเล่นได้เลยครับ');
    }, 800);
  }

  bindArEvents() {
    this.arEngine.on('move', (data) => {
      if (this.currentMode === 'classify' && this.modes.classify) {
        this.modes.classify.handlePointerMove(data.x, data.y, data.isPinching);
      }
    });

    this.arEngine.on('grab', (data) => {
      if (this.currentMode === 'classify' && this.modes.classify) {
        this.modes.classify.handlePointerGrab(data.x, data.y);
      }
    });

    this.arEngine.on('release', (data) => {
      if (this.currentMode === 'classify' && this.modes.classify) {
        this.modes.classify.handlePointerRelease(data.x, data.y);
      }
    });
  }

  switchMode(modeKey) {
    if (!this.modes[modeKey]) return;

    // Stop previous mode
    if (this.modes[this.currentMode]) {
      this.modes[this.currentMode].stop();
    }

    this.currentMode = modeKey;

    // Update Nav Tabs UI
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === modeKey);
    });

    // Toggle Mode Containers Visibility
    document.querySelectorAll('.mode-view-pane').forEach(pane => {
      pane.classList.add('hidden');
    });

    const activeContainer = document.getElementById(`mode-${modeKey}-container`);
    if (activeContainer) {
      activeContainer.classList.remove('hidden');
    }

    // Start New Mode
    this.modes[modeKey].start();
    audio.playClick();
  }

  bindGlobalUI() {
    // Navigation Tabs
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        if (mode) this.switchMode(mode);
      });
    });

    // Fullscreen Toggle Button
    const fsBtn = document.getElementById('btn-toggle-fullscreen');
    if (fsBtn) {
      const updateFsState = () => {
        const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
        const icon = fsBtn.querySelector('.btn-icon');
        const label = fsBtn.querySelector('.btn-label');
        if (icon) icon.textContent = isFs ? '🗗' : '⛶';
        if (label) label.textContent = isFs ? 'ย่อจอ' : 'เต็มจอ';
        fsBtn.classList.toggle('active-glow', isFs);
      };

      fsBtn.addEventListener('click', () => {
        audio.playClick();
        if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
          const docEl = document.documentElement;
          if (docEl.requestFullscreen) docEl.requestFullscreen();
          else if (docEl.webkitRequestFullscreen) docEl.webkitRequestFullscreen();
          else if (docEl.mozRequestFullScreen) docEl.mozRequestFullScreen();
          else if (docEl.msRequestFullscreen) docEl.msRequestFullscreen();
        } else {
          if (document.exitFullscreen) document.exitFullscreen();
          else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
          else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
          else if (document.msExitFullscreen) document.msExitFullscreen();
        }
      });

      document.addEventListener('fullscreenchange', updateFsState);
      document.addEventListener('webkitfullscreenchange', updateFsState);
      document.addEventListener('mozfullscreenchange', updateFsState);
    }

    // Collapse / Expand Top Navigation
    const collapseBtn = document.getElementById('btn-toggle-collapse');
    const floatingRestore = document.getElementById('floating-nav-restore');
    const topNavBar = document.querySelector('.top-nav-bar');

    const setNavCollapsed = (collapsed) => {
      audio.playClick();
      if (topNavBar) topNavBar.classList.toggle('nav-collapsed', collapsed);
      if (floatingRestore) floatingRestore.classList.toggle('hidden', !collapsed);
    };

    if (collapseBtn) {
      collapseBtn.addEventListener('click', () => setNavCollapsed(true));
    }
    if (floatingRestore) {
      floatingRestore.addEventListener('click', () => setNavCollapsed(false));
    }

    // Camera Toggle Button
    const camBtn = document.getElementById('btn-toggle-camera');
    if (camBtn) {
      camBtn.addEventListener('click', async () => {
        audio.playClick();
        camBtn.disabled = true;
        const isActive = await this.arEngine.toggleCamera();
        camBtn.disabled = false;

        const icon = camBtn.querySelector('.btn-icon');
        const text = camBtn.querySelector('.btn-label');
        if (isActive) {
          if (icon) icon.textContent = '🟢';
          if (text) text.textContent = 'กล้อง AR (เปิดอยู่)';
          camBtn.classList.add('active-glow');
          audio.speak('เปิดกล้อง AR เรียบร้อยแล้วครับ');
        } else {
          if (icon) icon.textContent = '📷';
          if (text) text.textContent = 'เปิดกล้อง AR';
          camBtn.classList.remove('active-glow');
        }
      });
    }

    // Audio SFX Toggle
    const soundBtn = document.getElementById('btn-toggle-sound');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const isSfx = audio.toggleSfx();
        soundBtn.textContent = isSfx ? '🔊 เสียงเกม' : '🔇 ปิดเสียง';
        audio.playClick();
      });
    }

    // Voice Narration Toggle
    const voiceBtn = document.getElementById('btn-toggle-voice');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        const isVoice = audio.toggleVoice();
        voiceBtn.textContent = isVoice ? '🗣️ เสียงพากย์' : '🤐 ปิดเสียงพากย์';
        audio.playClick();
      });
    }

    // Encyclopedia Modal Toggle
    const encBtn = document.getElementById('btn-open-encyclopedia');
    const encModal = document.getElementById('encyclopedia-modal');
    const encClose = document.getElementById('enc-modal-close');

    if (encBtn && encModal) {
      encBtn.addEventListener('click', () => {
        encModal.classList.remove('hidden');
        audio.playClick();
      });
    }
    if (encClose && encModal) {
      encClose.addEventListener('click', () => {
        encModal.classList.add('hidden');
      });
    }

    // How to Play Tutorial Modal
    const helpBtn = document.getElementById('btn-how-to-play');
    const helpModal = document.getElementById('help-modal');
    const helpClose = document.getElementById('help-modal-close');

    if (helpBtn && helpModal) {
      helpBtn.addEventListener('click', () => {
        helpModal.classList.remove('hidden');
        audio.playClick();
      });
    }
    if (helpClose && helpModal) {
      helpClose.addEventListener('click', () => {
        helpModal.classList.add('hidden');
      });
    }
  }

  renderEncyclopedia() {
    const container = document.getElementById('encyclopedia-content-pane');
    if (!container) return;

    container.innerHTML = `
      <div class="enc-section">
        <h3 class="enc-header-title">📚 สารอาหาร 6 ประเภท (วิทย์ ป.6)</h3>
        <div class="enc-nutrients-grid">
          ${Object.values(NUTRIENT_GROUPS).map(g => `
            <div class="enc-nutrient-card" style="border-left: 5px solid ${g.color}">
              <div class="enc-n-top">
                <span class="enc-n-icon">${g.icon}</span>
                <h4>${g.nameTh}</h4>
                <span class="badge-pill ${g.givesEnergy ? 'energy-yes' : 'energy-no'}">
                  ${g.givesEnergy ? `⚡ ให้พลังงาน (${g.energyPerGram} kcal/g)` : '🛡️ ไม่ให้พลังงาน'}
                </span>
              </div>
              <p><strong>ประโยชน์:</strong> ${g.benefit}</p>
              <p><strong>แหล่งอาหาร:</strong> ${g.sources}</p>
              <p style="color:#DC2626"><strong>โรคจากการขาด:</strong> ${g.deficiencyDisease}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="enc-section" style="margin-top: 30px;">
        <h3 class="enc-header-title">🍊 ตารางวิตามินที่ควรรู้ (ป.6)</h3>
        <div class="enc-table-wrapper">
          <table class="science-table">
            <thead>
              <tr>
                <th>วิตามิน</th>
                <th>ประเภท</th>
                <th>ประโยชน์ต่อร่างกาย</th>
                <th>แหล่งอาหาร</th>
                <th>โรคจากการขาด</th>
              </tr>
            </thead>
            <tbody>
              ${Object.values(VITAMINS_GUIDE).map(v => `
                <tr>
                  <td><strong>${v.nameTh}</strong></td>
                  <td><span class="type-tag ${v.type.includes('น้ำ') ? 'water-sol' : 'fat-sol'}">${v.type}</span></td>
                  <td>${v.benefit}</td>
                  <td>${v.sources}</td>
                  <td style="color:#DC2626"><strong>${v.deficiency}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="enc-section" style="margin-top: 30px;">
        <h3 class="enc-header-title">🥦 ตารางเกลือแร่และแร่ธาตุสำคัญ (ป.6)</h3>
        <div class="enc-table-wrapper">
          <table class="science-table">
            <thead>
              <tr>
                <th>เกลือแร่ / แร่ธาตุ</th>
                <th>หน้าที่และประโยชน์</th>
                <th>แหล่งอาหารที่พบมาก</th>
                <th>โรคและอาการเมื่อขาด</th>
              </tr>
            </thead>
            <tbody>
              ${Object.values(MINERALS_GUIDE).map(m => `
                <tr>
                  <td><strong>${m.nameTh}</strong></td>
                  <td>${m.benefit}</td>
                  <td>${m.sources}</td>
                  <td style="color:#DC2626"><strong>${m.deficiency}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}

// Bootstrap Application on DOM Ready
window.addEventListener('DOMContentLoaded', () => {
  window.arApp = new App();
});
