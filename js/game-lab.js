// ==========================================
// Mode 4: AR ห้องทดลองเคมีสารอาหาร (Virtual Food Lab)
// วิทยาศาสตร์ ป.6: การทดสอบแป้ง โปรตีน ไขมัน
// ==========================================

import { LAB_TESTS, FOOD_ITEMS } from './food-data.js';
import { audio } from './audio.js';

export class GameLab {
  constructor(app) {
    this.app = app;
    this.container = null;
    this.isActive = false;

    this.currentTestIndex = 0;
    this.selectedFood = null;
    this.isTesting = false;
    this.testHistory = [];
  }

  mount(containerElement) {
    this.container = containerElement;
    this.renderLayout();
    this.bindEvents();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="game-mode-header">
        <div class="stat-badge"><span class="stat-icon">🧪</span> หลอดทดลองเคมี: <strong>วิทยาศาสตร์ ป.6</strong></div>
        <div class="lab-test-switch-tabs">
          ${LAB_TESTS.map((t, idx) => `
            <button class="lab-tab-btn ${idx === 0 ? 'active' : ''}" data-index="${idx}">
              ${t.titleTh}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="lab-workspace-grid">
        <!-- Left: Chemical Reagent & Principle -->
        <div class="lab-sidebar-left glassmorphism">
          <div class="lab-reagent-card">
            <div class="reagent-icon-bottle" id="reagent-bottle-icon">🧴</div>
            <h3 id="lab-reagent-name">สารละลายไอโอดีน</h3>
            <div class="reagent-color-preview">
              <span>สีเริ่มต้นของสารเคมี:</span>
              <div id="reagent-initial-color-box" class="color-swatch"></div>
            </div>
            <p class="reagent-desc" id="lab-science-principle">หลักการทางวิทยาศาสตร์...</p>
          </div>

          <div class="lab-expected-result">
            <h4>💡 ข้อสังเกตผลการทดลอง:</h4>
            <div class="result-rule-box positive">
              <span class="rule-icon">✅ ผลบวก (มีสารอาหาร):</span>
              <p id="rule-positive-text">เปลี่ยนเป็นสีน้ำเงินเข้มแกมม่วง</p>
            </div>
            <div class="result-rule-box negative">
              <span class="rule-icon">❌ ผลลบ (ไม่มีสารอาหาร):</span>
              <p id="rule-negative-text">ไม่เปลี่ยนสี</p>
            </div>
          </div>
        </div>

        <!-- Center: Interactive Test Tube Experiment Stage -->
        <div class="lab-center-stage glassmorphism">
          <div class="experiment-apparatus">
            <!-- Animated Dropper / Pipette -->
            <div id="lab-dropper" class="dropper-tool">
              <div class="dropper-bulb"></div>
              <div class="dropper-body" id="dropper-liquid"></div>
              <div class="dropper-tip"></div>
              <div id="dropper-drop" class="liquid-drop"></div>
            </div>

            <!-- Test Tube or Paper Bench -->
            <div id="lab-apparatus-view" class="apparatus-container">
              <div class="test-tube-rack">
                <div class="test-tube" id="active-test-tube">
                  <div class="tube-rim"></div>
                  <div class="tube-glass">
                    <div id="tube-liquid" class="tube-liquid-level">
                      <div class="liquid-bubbles"></div>
                    </div>
                  </div>
                  <div class="tube-label" id="tube-food-label">เลือกตัวอย่างอาหาร</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Button -->
          <div class="lab-action-bar text-center">
            <button id="btn-perform-test" class="btn-primary-pill pulse-glow" disabled>
              🧪 หยดสารเคมีทดสอบ (หยดสารละลาย)
            </button>
            <div id="lab-reaction-banner" class="reaction-banner hidden"></div>
          </div>
        </div>

        <!-- Right: Food Sample Rack -->
        <div class="lab-sidebar-right glassmorphism">
          <h4 class="sample-rack-title">🥩 เลือกตัวอย่างอาหารมาทดสอบ</h4>
          <div class="sample-food-list" id="sample-food-container"></div>
        </div>
      </div>
    `;
  }

  start() {
    this.isActive = true;
    this.loadTest(0);
  }

  loadTest(testIndex) {
    this.currentTestIndex = testIndex;
    const test = LAB_TESTS[testIndex];
    if (!test) return;

    this.selectedFood = null;
    this.isTesting = false;

    // Update UI Elements
    document.getElementById('lab-reagent-name').textContent = test.reagent;
    document.getElementById('lab-science-principle').textContent = test.sciencePrinciple;
    document.getElementById('rule-positive-text').textContent = test.positiveResultText;
    document.getElementById('rule-negative-text').textContent = test.negativeResultText;

    const colorBox = document.getElementById('reagent-initial-color-box');
    if (colorBox) colorBox.style.backgroundColor = test.reagentColor;

    const dropperLiquid = document.getElementById('dropper-liquid');
    if (dropperLiquid) dropperLiquid.style.backgroundColor = test.reagentColor;

    const banner = document.getElementById('lab-reaction-banner');
    if (banner) banner.classList.add('hidden');

    const testBtn = document.getElementById('btn-perform-test');
    if (testBtn) {
      testBtn.disabled = true;
      testBtn.textContent = test.id === 'paper_fat' ? '📄 นำอาหารมาถูบนกระดาษ' : `🧪 หยด ${test.reagent}`;
    }

    // Reset Tube
    this.resetTube();

    // Render Food Samples for this test
    const container = document.getElementById('sample-food-container');
    if (container) {
      container.innerHTML = test.testableFoods.map(item => {
        const food = FOOD_ITEMS.find(f => f.id === item.foodId);
        if (!food) return '';
        return `
          <div class="sample-food-card" data-food-id="${food.id}">
            <span class="sample-emoji">${food.icon}</span>
            <div class="sample-info">
              <div class="sample-name">${food.nameTh}</div>
              <div class="sample-category">${food.portion}</div>
            </div>
          </div>
        `;
      }).join('');

      container.querySelectorAll('.sample-food-card').forEach(card => {
        card.addEventListener('click', () => {
          container.querySelectorAll('.sample-food-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          const foodId = card.dataset.foodId;
          this.selectFoodSample(foodId);
        });
      });
    }

    // Voice announcement
    audio.speak(`การทดลองที่ ${testIndex + 1} ${test.titleTh} โดยใช้ ${test.reagent} เลือกอาหารที่ต้องการทดสอบได้เลยครับ`);
  }

  selectFoodSample(foodId) {
    const food = FOOD_ITEMS.find(f => f.id === foodId);
    if (!food) return;

    this.selectedFood = food;
    audio.playClick();

    // Put sample into tube
    const tubeLabel = document.getElementById('tube-food-label');
    const tubeLiquid = document.getElementById('tube-liquid');
    const testBtn = document.getElementById('btn-perform-test');
    const banner = document.getElementById('lab-reaction-banner');

    if (banner) banner.classList.add('hidden');
    if (tubeLabel) tubeLabel.textContent = `${food.icon} ${food.nameTh}`;
    if (tubeLiquid) {
      tubeLiquid.style.height = '40%';
      tubeLiquid.style.backgroundColor = '#E2E8F0'; // Initial sample color
    }
    if (testBtn) testBtn.disabled = false;

    audio.speak(`ใส่ตัวอย่าง ${food.nameTh} ลงในหลอดทดลองแล้ว กดปุ่มทดสอบได้เลยครับ`);
  }

  resetTube() {
    const tubeLabel = document.getElementById('tube-food-label');
    const tubeLiquid = document.getElementById('tube-liquid');
    if (tubeLabel) tubeLabel.textContent = 'เลือกตัวอย่างอาหาร';
    if (tubeLiquid) {
      tubeLiquid.style.height = '15%';
      tubeLiquid.style.backgroundColor = '#CBD5E1';
    }
  }

  performTest() {
    if (!this.selectedFood || this.isTesting) return;
    this.isTesting = true;

    const test = LAB_TESTS[this.currentTestIndex];
    const testItem = test.testableFoods.find(t => t.foodId === this.selectedFood.id);
    const isPositive = testItem ? testItem.isPositive : false;

    const dropper = document.getElementById('lab-dropper');
    const drop = document.getElementById('dropper-drop');
    const tubeLiquid = document.getElementById('tube-liquid');
    const banner = document.getElementById('lab-reaction-banner');
    const testBtn = document.getElementById('btn-perform-test');

    if (testBtn) testBtn.disabled = true;

    // Dropper drop animation
    if (dropper && drop) {
      drop.style.backgroundColor = test.reagentColor;
      drop.classList.add('dropping-anim');
      audio.playBubble();
    }

    setTimeout(() => {
      if (drop) drop.classList.remove('dropping-anim');
      audio.playBubble();

      // Change liquid color
      if (tubeLiquid) {
        tubeLiquid.style.height = '65%';
        tubeLiquid.style.transition = 'background-color 1.2s ease, height 0.6s ease';
        tubeLiquid.style.backgroundColor = isPositive ? test.positiveColor : test.negativeColor;
      }

      // Show observation result
      setTimeout(() => {
        if (isPositive) {
          audio.playCorrect();
          audio.speak(`ผลการทดลองเป็นบวกครับ! ${this.selectedFood.nameTh} ${test.positiveResultText}`);
          if (banner) {
            banner.className = 'reaction-banner positive-banner bounce-in';
            banner.innerHTML = `
              <strong>🎉 ได้ผลบวก (Positive):</strong> ${this.selectedFood.nameTh} 
              <br><span style="font-size:14px">${test.positiveResultText} แสดงว่ามีสารอาหารที่ทดสอบอยู่จริง!</span>
            `;
            banner.classList.remove('hidden');
          }
        } else {
          audio.playTone(300, 'sine', 0.2);
          audio.speak(`ผลการทดลองเป็นลบครับ ${this.selectedFood.nameTh} ${test.negativeResultText}`);
          if (banner) {
            banner.className = 'reaction-banner negative-banner bounce-in';
            banner.innerHTML = `
              <strong>⚪ ได้ผลลบ (Negative):</strong> ${this.selectedFood.nameTh} 
              <br><span style="font-size:14px">${test.negativeResultText} แสดงว่าไม่มีสารอาหารชนิดนี้หรือมีปริมาณน้อยมาก</span>
            `;
            banner.classList.remove('hidden');
          }
        }

        this.isTesting = false;
        if (testBtn) testBtn.disabled = false;
      }, 1200);

    }, 800);
  }

  bindEvents() {
    this.container.querySelectorAll('.lab-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.container.querySelectorAll('.lab-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const idx = parseInt(btn.dataset.index, 10);
        this.loadTest(idx);
      });
    });

    document.getElementById('btn-perform-test')?.addEventListener('click', () => {
      this.performTest();
    });
  }

  stop() {
    this.isActive = false;
  }
}
