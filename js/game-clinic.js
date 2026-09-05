// ==========================================
// Mode 3: AR หมอน้อยพิชิตโรคขาดสารอาหาร
// (AR Nutrition Hospital & Disease Cures)
// วิทยาศาสตร์ ป.6: โรคที่เกิดจากการขาดสารอาหาร
// ==========================================

import { DEFICIENCY_CASES, FOOD_ITEMS, NUTRIENT_GROUPS } from './food-data.js';
import { audio } from './audio.js';

export class GameClinic {
  constructor(app) {
    this.app = app;
    this.container = null;
    this.isActive = false;

    this.currentCaseIndex = 0;
    this.curedCount = 0;
    this.totalCases = DEFICIENCY_CASES.length;
    this.isCured = false;
  }

  mount(containerElement) {
    this.container = containerElement;
    this.renderLayout();
    this.bindEvents();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="game-mode-header">
        <div class="stat-badge"><span class="stat-icon">🏥</span> คลินิกโภชนาการ: <strong>เคสที่ <span id="clinic-case-num">1</span> / ${this.totalCases}</strong></div>
        <div class="stat-badge"><span class="stat-icon">🩺</span> รักษาหายแล้ว: <strong id="clinic-cured-num">0</strong> คน</div>
        <button id="clinic-next-patient" class="btn-icon-pill">⏭️ คนไข้ถัดไป</button>
      </div>

      <div class="clinic-workspace-grid">
        <!-- Patient Examination Card -->
        <div class="patient-card glassmorphism">
          <div class="patient-avatar-box">
            <div id="patient-avatar" class="patient-avatar-emoji pulse-slow">🤢</div>
            <div class="patient-heart-status">❤️❤️❤️</div>
          </div>
          
          <div class="patient-details">
            <span class="patient-tag" id="patient-disease-name">โรคขาดสารอาหาร</span>
            <h3 class="patient-symptom-title" id="patient-symptoms">อาการ...</h3>
            <p class="patient-expression-text" id="patient-expression">ตรวจพบ: ...</p>
          </div>

          <div class="doctor-mission-box">
            <span class="mission-icon">💡</span>
            <div class="mission-text">
              <strong>ภารกิจหมอน้อย ป.6:</strong> เลือกหรือสัมผัสจับอาหาร AR ที่มีสารอาหารรักษาอาการนี้มาป้อนคนไข้!
            </div>
          </div>
        </div>

        <!-- Medicine Food Selection / AR Floating Cures -->
        <div class="cures-shelf-panel glassmorphism">
          <div class="cures-panel-title">
            <span>🥗 ยาอาหารบำบัดรักษา (แตะหรือลากมาป้อนคนไข้)</span>
            <button id="btn-read-symptom" class="btn-sound-small" title="ฟังเสียงอ่านอาการ">🔊 อ่านโจทย์</button>
          </div>

          <div class="cures-food-grid" id="cures-food-container"></div>
        </div>
      </div>

      <!-- Treatment Success / Explanation Modal -->
      <div id="clinic-result-modal" class="modal-overlay hidden">
        <div class="modal-card glassmorphism bounce-in">
          <div id="clinic-modal-body"></div>
        </div>
      </div>
    `;
  }

  start() {
    this.isActive = true;
    this.currentCaseIndex = 0;
    this.curedCount = 0;
    this.loadPatientCase(0);
  }

  loadPatientCase(index) {
    this.isCured = false;
    const currentCase = DEFICIENCY_CASES[index];
    if (!currentCase) return;

    // Update Header
    const numEl = document.getElementById('clinic-case-num');
    const curedEl = document.getElementById('clinic-cured-num');
    if (numEl) numEl.textContent = index + 1;
    if (curedEl) curedEl.textContent = this.curedCount;

    // Update Patient Details
    const nameEl = document.getElementById('patient-disease-name');
    const symEl = document.getElementById('patient-symptoms');
    const expEl = document.getElementById('patient-expression');
    const avatarEl = document.getElementById('patient-avatar');

    if (nameEl) nameEl.textContent = currentCase.nameTh;
    if (symEl) symEl.textContent = `🚨 อาการ: ${currentCase.symptoms}`;
    if (expEl) expEl.textContent = `📋 สิ่งที่ตรวจพบ: ${currentCase.characterExpression}`;
    if (avatarEl) {
      avatarEl.textContent = '🤒';
      avatarEl.className = 'patient-avatar-emoji shake-subtle';
    }

    // Prepare Cure Choices (Mix correct cure foods with distractors)
    const correctFoods = FOOD_ITEMS.filter(f => currentCase.cureFoodIds.includes(f.id));
    const wrongFoods = FOOD_ITEMS.filter(f => !currentCase.cureFoodIds.includes(f.id));
    
    // Pick 2 correct foods and 4 wrong foods, then shuffle
    const shuffledWrong = [...wrongFoods].sort(() => Math.random() - 0.5).slice(0, 4);
    const chosenOptions = [...correctFoods.slice(0, 2), ...shuffledWrong].sort(() => Math.random() - 0.5);

    const container = document.getElementById('cures-food-container');
    if (container) {
      container.innerHTML = chosenOptions.map(food => `
        <div class="cure-food-card" data-food-id="${food.id}" style="border-top: 4px solid ${food.color}">
          <span class="cure-food-emoji">${food.icon}</span>
          <div class="cure-food-name">${food.nameTh}</div>
          <div class="cure-nutrient-tag" style="color: ${NUTRIENT_GROUPS[food.primaryNutrient].color}">
            ${NUTRIENT_GROUPS[food.primaryNutrient].shortName}
          </div>
          <button class="btn-feed-patient">💊 ป้อนรักษา</button>
        </div>
      `).join('');

      // Bind feed events
      container.querySelectorAll('.cure-food-card').forEach(card => {
        card.addEventListener('click', () => {
          const foodId = card.dataset.foodId;
          this.treatPatient(foodId);
        });
      });
    }

    // Speak symptoms aloud in Thai
    audio.speak(`คนไข้รายนี้ มีอาการ ${currentCase.nameTh} ${currentCase.symptoms} นักเรียนควรเลือกอาหารชนิดใดมารักษาครับ`);
  }

  treatPatient(foodId) {
    if (this.isCured) return;
    const currentCase = DEFICIENCY_CASES[this.currentCaseIndex];
    const food = FOOD_ITEMS.find(f => f.id === foodId);
    if (!currentCase || !food) return;

    const isCorrect = currentCase.cureFoodIds.includes(foodId);

    if (isCorrect) {
      // SUCCESS CURE!
      this.isCured = true;
      this.curedCount++;
      audio.playCorrect();

      const avatarEl = document.getElementById('patient-avatar');
      if (avatarEl) {
        avatarEl.textContent = '🥳';
        avatarEl.className = 'patient-avatar-emoji bounce-in-joy';
      }

      audio.speak(`ยอดเยี่ยมมากครับ! ${food.nameTh} มี ${currentCase.specificSubstance} ช่วยรักษา ${currentCase.nameTh} ได้สำเร็จ`);

      this.showCureSuccessModal(currentCase, food);
    } else {
      // WRONG CURE
      audio.playWrong();
      audio.speak(`ยังไม่ตรงจุดครับ ${food.nameTh} ยังไม่มีสารอาหารที่รักษา ${currentCase.nameTh} ลองดูสารอาหารที่ช่วยแก้อาการนี้นะครับ`);
      
      const avatarEl = document.getElementById('patient-avatar');
      if (avatarEl) {
        avatarEl.textContent = '😵';
        setTimeout(() => {
          if (!this.isCured) avatarEl.textContent = '🤒';
        }, 1200);
      }
    }
  }

  showCureSuccessModal(currentCase, food) {
    const modal = document.getElementById('clinic-result-modal');
    const body = document.getElementById('clinic-modal-body');
    if (!modal || !body) return;

    body.innerHTML = `
      <div class="cure-success-view text-center">
        <div class="doctor-badge-star">🌟 รักษาสำเร็จ!</div>
        <h2>คนไข้อาการดีขึ้นแล้ว!</h2>
        <div class="cure-food-showcase">
          <span class="cure-big-emoji">${food.icon}</span>
          <strong>${food.nameTh}</strong>
        </div>

        <div class="cure-science-explanation">
          <h4 style="color: #3B82F6;">🔬 ความรู้ทางวิทยาศาสตร์ ป.6:</h4>
          <p><strong>สารอาหารสำคัญ:</strong> <span class="badge-pill" style="background:#22C55E22; color:#16A34A">${currentCase.specificSubstance}</span></p>
          <p>${currentCase.explanation}</p>
        </div>

        <div class="modal-actions" style="margin-top: 20px;">
          <button class="btn-primary" id="btn-clinic-next">🩺 รักษาคนไข้คนต่อไป</button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');

    document.getElementById('btn-clinic-next')?.addEventListener('click', () => {
      modal.classList.add('hidden');
      this.nextPatient();
    });
  }

  nextPatient() {
    this.currentCaseIndex++;
    if (this.currentCaseIndex >= this.totalCases) {
      this.finishClinicAll();
    } else {
      this.loadPatientCase(this.currentCaseIndex);
    }
  }

  finishClinicAll() {
    audio.playFanfare();
    audio.speak('ยินดีด้วยครับ! หนูผ่านการรักษาคนไข้ครบทุกเคสแล้ว ได้รับเหรียญแพทย์โภชนาการจิ๋วดีเด่น ป.6');

    const modal = document.getElementById('clinic-result-modal');
    const body = document.getElementById('clinic-modal-body');
    if (modal && body) {
      body.innerHTML = `
        <div class="clinic-finish-view text-center">
          <div class="trophy-bounce">🏆</div>
          <h2>สุดยอดคุณหมอโภชนาการน้อย ป.6!</h2>
          <p>คุณได้ช่วยเหลือคนไข้จากโรคขาดสารอาหารครบทั้งหมด <strong>${this.totalCases} เคส</strong></p>
          <div class="rating-stars">⭐⭐⭐⭐⭐</div>
          <div class="modal-actions">
            <button class="btn-primary" id="btn-replay-clinic">🔄 เล่นใหม่อีกรอบ</button>
            <button class="btn-secondary" id="btn-goto-lab">🔬 ไปโหมดห้องทดลองเคมีอาหาร</button>
          </div>
        </div>
      `;
      modal.classList.remove('hidden');

      document.getElementById('btn-replay-clinic')?.addEventListener('click', () => {
        modal.classList.add('hidden');
        this.start();
      });

      document.getElementById('btn-goto-lab')?.addEventListener('click', () => {
        modal.classList.add('hidden');
        this.app.switchMode('lab');
      });
    }
  }

  bindEvents() {
    document.getElementById('clinic-next-patient')?.addEventListener('click', () => {
      this.nextPatient();
    });

    document.getElementById('btn-read-symptom')?.addEventListener('click', () => {
      const currentCase = DEFICIENCY_CASES[this.currentCaseIndex];
      if (currentCase) {
        audio.speak(`คนไข้เป็น ${currentCase.nameTh} มีอาการ ${currentCase.symptoms} ครับ`);
      }
    });
  }

  stop() {
    this.isActive = false;
  }
}
