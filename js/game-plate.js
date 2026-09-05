// ==========================================
// Mode 2: AR เชฟจิ๋วจัดจานสุขภาพ (Healthy Plate & Calories)
// ธงโภชนาการและสัดส่วนพลังงานสำหรับนักเรียนชั้น ป.6
// ==========================================

import { FOOD_ITEMS, NUTRIENT_GROUPS } from './food-data.js';
import { audio } from './audio.js';

export class GamePlate {
  constructor(app) {
    this.app = app;
    this.container = null;
    this.isActive = false;

    this.plateItems = []; // items placed on plate
    this.targetCalories = 550; // ideal single meal calories for 12yo (ป.6)
    this.mealType = 'lunch'; // breakfast, lunch, dinner
  }

  mount(containerElement) {
    this.container = containerElement;
    this.renderLayout();
    this.bindEvents();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="game-mode-header">
        <div class="stat-badge"><span class="stat-icon">🍱</span> มื้ออาหาร: <strong>มื้อกลางวัน ป.6</strong></div>
        <div class="stat-badge"><span class="stat-icon">🎯</span> พลังงานเป้าหมาย: <strong>500 - 600 kcal</strong></div>
        <button id="btn-plate-reset" class="btn-icon-pill">🗑️ ล้างจาน</button>
        <button id="btn-plate-evaluate" class="btn-primary-pill pulse-glow">✨ ประเมินจานสุขภาพ</button>
      </div>

      <div class="plate-workbench-grid">
        <!-- Left: Nutrition Meters & Mascot -->
        <div class="plate-sidebar-left glassmorphism">
          <div class="mascot-status-card">
            <div id="plate-mascot-avatar" class="mascot-face">😋</div>
            <div class="mascot-bubble" id="plate-mascot-msg">
              "สวัสดีจ้า! ช่วยพี่อิ่มอุ่นจัดมื้อกลางวันให้ได้สารอาหารครบ 5 หมู่ และพลังงานพอดี 500-600 kcal นะครับ"
            </div>
          </div>

          <div class="nutrition-meters-box">
            <h4 class="meters-title">📊 สรุปสารอาหารในจาน</h4>
            
            <div class="meter-group">
              <div class="meter-label">
                <span>⚡ พลังงานรวม</span>
                <strong id="total-calories-text">0 / 550 kcal</strong>
              </div>
              <div class="meter-bar-track">
                <div id="cal-bar-fill" class="meter-bar-fill" style="width: 0%; background: #F59E0B;"></div>
              </div>
            </div>

            <div class="meter-group">
              <div class="meter-label">
                <span>🥩 โปรตีน</span>
                <span id="meter-protein-text">0 กรัม</span>
              </div>
              <div class="meter-bar-track">
                <div id="meter-protein-bar" class="meter-bar-fill" style="width: 0%; background: #FF6B6B;"></div>
              </div>
            </div>

            <div class="meter-group">
              <div class="meter-label">
                <span>🍚 คาร์โบไฮเดรต</span>
                <span id="meter-carb-text">0 กรัม</span>
              </div>
              <div class="meter-bar-track">
                <div id="meter-carb-bar" class="meter-bar-fill" style="width: 0%; background: #FFA94D;"></div>
              </div>
            </div>

            <div class="meter-group">
              <div class="meter-label">
                <span>🥑 ไขมัน</span>
                <span id="meter-fat-text">0 กรัม</span>
              </div>
              <div class="meter-bar-track">
                <div id="meter-fat-bar" class="meter-bar-fill" style="width: 0%; background: #FFD43B;"></div>
              </div>
            </div>

            <div class="meter-group">
              <div class="meter-label">
                <span>🍊 ผัก-ผลไม้-วิตามิน</span>
                <span id="meter-vit-text">0 รายการ</span>
              </div>
              <div class="meter-bar-track">
                <div id="meter-vit-bar" class="meter-bar-fill" style="width: 0%; background: #51CF66;"></div>
              </div>
            </div>

            <div class="meter-group">
              <div class="meter-label">
                <span>💧 น้ำดื่มสะอาด</span>
                <span id="meter-water-text">0 แก้ว</span>
              </div>
              <div class="meter-bar-track">
                <div id="meter-water-bar" class="meter-bar-fill" style="width: 0%; background: #22B8CF;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Center: Interactive Smart Plate -->
        <div class="plate-center-stage">
          <div class="smart-plate-container">
            <div class="smart-plate-rim">
              <div class="smart-plate-inner" id="smart-plate-dropzone">
                <!-- Plate Sectors Indicator -->
                <div class="plate-guideline-overlay">
                  <div class="guide-sector sector-carb">🍚 ข้าว-แป้ง (1/4)</div>
                  <div class="guide-sector sector-protein">🥩 เนื้อ-โปรตีน (1/4)</div>
                  <div class="guide-sector sector-veg">🥦 ผัก-ผลไม้ (2/4)</div>
                </div>

                <!-- Placed Food Items Container -->
                <div id="plate-items-container" class="placed-items-layer"></div>
              </div>
            </div>
          </div>
          <div class="plate-hint-text">💡 แตะหรือลากอาหารจากตู้กับข้าวข้างล่างมาวางลงในจานสุขภาพ</div>
        </div>

        <!-- Right / Bottom: Food Pantry Shelf -->
        <div class="plate-pantry-panel glassmorphism">
          <div class="pantry-tabs">
            <button class="pantry-tab active" data-filter="all">ทั้งหมด</button>
            <button class="pantry-tab" data-filter="carb">ข้าว-แป้ง</button>
            <button class="pantry-tab" data-filter="protein">เนื้อสัตว์</button>
            <button class="pantry-tab" data-filter="vitamin">ผัก-ผลไม้</button>
            <button class="pantry-tab" data-filter="water">น้ำดื่ม</button>
          </div>

          <div class="pantry-scroll-grid" id="pantry-items-grid">
            ${this.renderPantryCards('all')}
          </div>
        </div>
      </div>

      <!-- Evaluation Modal -->
      <div id="plate-eval-modal" class="modal-overlay hidden">
        <div class="modal-card glassmorphism bounce-in">
          <button class="modal-close" id="eval-modal-close">&times;</button>
          <div id="eval-modal-content"></div>
        </div>
      </div>
    `;
  }

  renderPantryCards(filter = 'all') {
    let items = FOOD_ITEMS;
    if (filter !== 'all') {
      if (filter === 'vitamin') {
        items = FOOD_ITEMS.filter(f => f.category === 'vitamin' || f.category === 'mineral');
      } else {
        items = FOOD_ITEMS.filter(f => f.category === filter);
      }
    }

    return items.map(food => `
      <div class="pantry-item-card" data-food-id="${food.id}">
        <span class="pantry-emoji">${food.icon}</span>
        <div class="pantry-info">
          <div class="pantry-name">${food.nameTh}</div>
          <div class="pantry-cal">⚡ ${food.calories} kcal</div>
        </div>
        <button class="btn-add-food" title="หยิบใส่จาน">➕ ใส่จาน</button>
      </div>
    `).join('');
  }

  start() {
    this.isActive = true;
    this.plateItems = [];
    this.updatePlateDisplay();
    audio.speak('โหมดจัดจานสุขภาพ ลองเลือกอาหารให้ได้พลังงานและสารอาหารครบถ้วนตามหลักธงโภชนาการสำหรับเด็ก ป.6 นะครับ');
  }

  addFoodToPlate(foodId) {
    const food = FOOD_ITEMS.find(f => f.id === foodId);
    if (!food) return;

    if (this.plateItems.length >= 8) {
      audio.speak('จานเต็มแล้วครับ ลองประเมินจานอาหาร หรือนำอาหารบางชิ้นออกก่อนนะครับ');
      return;
    }

    this.plateItems.push(food);
    audio.playDrop();
    this.updatePlateDisplay();
  }

  removeFoodFromPlate(index) {
    if (index >= 0 && index < this.plateItems.length) {
      const removed = this.plateItems.splice(index, 1)[0];
      audio.playTone(350, 'sine', 0.1);
      this.updatePlateDisplay();
    }
  }

  updatePlateDisplay() {
    const container = document.getElementById('plate-items-container');
    if (!container) return;

    container.innerHTML = this.plateItems.map((food, idx) => {
      // Random slight offset around plate center
      const angle = (idx / Math.max(this.plateItems.length, 1)) * Math.PI * 2;
      const radius = 60 + (idx % 2) * 35;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      return `
        <div class="plate-food-token bounce-in" style="transform: translate(${x}px, ${y}px);" data-index="${idx}">
          <span class="token-emoji">${food.icon}</span>
          <span class="token-name">${food.nameTh}</span>
          <button class="token-remove-btn" data-index="${idx}" title="นำออก">&times;</button>
        </div>
      `;
    }).join('');

    // Bind remove buttons
    container.querySelectorAll('.token-remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.index, 10);
        this.removeFoodFromPlate(idx);
      });
    });

    this.calculateNutritionTotals();
  }

  calculateNutritionTotals() {
    let totalCal = 0;
    let totalProt = 0;
    let totalCarb = 0;
    let totalFat = 0;
    let vegFruitCount = 0;
    let waterCount = 0;

    this.plateItems.forEach(item => {
      totalCal += item.calories;
      totalProt += item.proteinGrams;
      totalCarb += item.carbGrams;
      totalFat += item.fatGrams;
      if (item.category === 'vitamin' || item.category === 'mineral') vegFruitCount++;
      if (item.category === 'water') waterCount++;
    });

    // Update UI Meters
    const calText = document.getElementById('total-calories-text');
    const calBar = document.getElementById('cal-bar-fill');
    if (calText) calText.textContent = `${totalCal} / 550 kcal`;
    if (calBar) {
      const calPercent = Math.min((totalCal / 550) * 100, 100);
      calBar.style.width = `${calPercent}%`;
      calBar.style.background = totalCal > 650 ? '#EF4444' : totalCal >= 450 ? '#22C55E' : '#F59E0B';
    }

    const protText = document.getElementById('meter-protein-text');
    const protBar = document.getElementById('meter-protein-bar');
    if (protText) protText.textContent = `${totalProt.toFixed(1)} g`;
    if (protBar) protBar.style.width = `${Math.min((totalProt / 25) * 100, 100)}%`;

    const carbText = document.getElementById('meter-carb-text');
    const carbBar = document.getElementById('meter-carb-bar');
    if (carbText) carbText.textContent = `${totalCarb.toFixed(1)} g`;
    if (carbBar) carbBar.style.width = `${Math.min((totalCarb / 60) * 100, 100)}%`;

    const fatText = document.getElementById('meter-fat-text');
    const fatBar = document.getElementById('meter-fat-bar');
    if (fatText) fatText.textContent = `${totalFat.toFixed(1)} g`;
    if (fatBar) fatBar.style.width = `${Math.min((totalFat / 18) * 100, 100)}%`;

    const vitText = document.getElementById('meter-vit-text');
    const vitBar = document.getElementById('meter-vit-bar');
    if (vitText) vitText.textContent = `${vegFruitCount} ชนิด`;
    if (vitBar) vitBar.style.width = `${Math.min((vegFruitCount / 2) * 100, 100)}%`;

    const waterText = document.getElementById('meter-water-text');
    const waterBar = document.getElementById('meter-water-bar');
    if (waterText) waterText.textContent = `${waterCount} แก้ว`;
    if (waterBar) waterBar.style.width = `${Math.min((waterCount / 1) * 100, 100)}%`;

    // Dynamic Mascot feedback
    this.updateMascotFeedback(totalCal, totalProt, totalCarb, totalFat, vegFruitCount, waterCount);
  }

  updateMascotFeedback(cal, prot, carb, fat, veg, water) {
    const avatar = document.getElementById('plate-mascot-avatar');
    const msg = document.getElementById('plate-mascot-msg');
    if (!avatar || !msg) return;

    if (this.plateItems.length === 0) {
      avatar.textContent = '🍽️';
      msg.textContent = '"จานยังว่างอยู่เลย! เลือกอาหารที่มีประโยชน์ใส่จานกันเถอะ"';
    } else if (cal > 700) {
      avatar.textContent = '😵';
      msg.textContent = '"อิ่มแน่นเกินไปแล้ว! แคลอรี่เกินความต้องการของเด็ก ป.6 ใน 1 มื้อ ลองลดอาหารมันๆ หรือของหวานดูนะ"';
    } else if (cal >= 480 && cal <= 620 && veg >= 1 && prot >= 10 && carb >= 20) {
      avatar.textContent = '🌟';
      msg.textContent = '"สุดยอดมาก! จานนี้สัดส่วนเป๊ะตามธงโภชนาการ ป.6 เลย ได้พลังงานกำลังดีและสารอาหารครบถ้วน!"';
    } else if (veg === 0) {
      avatar.textContent = '🥦';
      msg.textContent = '"อย่าลืมเพิ่ม ผักหรือผลไม้ นะครับ เพื่อให้ร่างกายได้รับวิตามินและเกลือแร่ป้องกันโรค"';
    } else if (carb < 15) {
      avatar.textContent = '🍚';
      msg.textContent = '"ต้องการพลังงานหลักเพิ่ม! อย่าลืมใส่ข้าวสวยหรือขนมปังโฮลวีตนะ"';
    } else {
      avatar.textContent = '😋';
      msg.textContent = '"กำลังไปได้สวย! สังเกตแถบสารอาหารแล้วจัดให้สมดุลนะ"';
    }
  }

  evaluatePlate() {
    if (this.plateItems.length === 0) {
      audio.speak('กรุณาเลือกอาหารใส่จานก่อนกดประเมินนะครับ');
      alert('⚠️ กรุณาเลือกอาหารใส่จานก่อนนะครับ');
      return;
    }

    let totalCal = 0;
    let hasProtein = false;
    let hasCarb = false;
    let hasVegFruit = false;
    let hasWater = false;

    this.plateItems.forEach(i => {
      totalCal += i.calories;
      if (i.category === 'protein') hasProtein = true;
      if (i.category === 'carb') hasCarb = true;
      if (i.category === 'vitamin' || i.category === 'mineral') hasVegFruit = true;
      if (i.category === 'water') hasWater = true;
    });

    let score = 50;
    const tips = [];

    // Check Calories Range (500 - 600 kcal)
    if (totalCal >= 480 && totalCal <= 620) {
      score += 25;
      tips.push('✅ พลังงานอยู่ในเกณฑ์เหมาะสมเลิศสำหรับเด็ก ป.6 (500-600 kcal)');
    } else if (totalCal < 480) {
      score += 10;
      tips.push('⚠️ พลังงานน้อยไปเล็กน้อย อาจทำให้รู้สึกหิวระหว่างเรียน');
    } else {
      tips.push('⚠️ พลังงานสูงเกินไป หากทานแบบนี้เป็นประจำอาจเสี่ยงต่อภาวะโภชนาการเกิน');
    }

    // Check 5 Food Groups
    if (hasProtein && hasCarb && hasVegFruit) {
      score += 25;
      tips.push('✅ ได้รับสารอาหารหลักครบ 5 หมู่ (คาร์โบไฮเดรต, โปรตีน, ผัก-ผลไม้, ไขมัน)');
    } else {
      if (!hasCarb) tips.push('❌ ขาดกลุ่มข้าว-แป้ง ซึ่งเป็นแหล่งพลังงานหลัก');
      if (!hasProtein) tips.push('❌ ขาดกลุ่มเนื้อสัตว์-โปรตีน สำหรับซ่อมแซมร่างกายและสร้างกล้ามเนื้อ');
      if (!hasVegFruit) tips.push('❌ ขาดกลุ่มผักและผลไม้ (วิตามินและเกลือแร่)');
    }

    if (hasWater) {
      score = Math.min(100, score + 5);
      tips.push('💧 เยี่ยมมาก! มีน้ำสะอาดดื่มปิดท้ายมื้ออาหาร');
    }

    let grade = 'B';
    let gradeBadge = '🥈 ดี';
    if (score >= 90) {
      grade = 'A+';
      gradeBadge = '🥇 ยอดเยี่ยมระดับมาสเตอร์!';
      audio.playFanfare();
      audio.speak('ยอดเยี่ยมมากครับ จานอาหารของหนูได้รับเกรด A+ ถูกต้องตามหลักโภชนาการ ป.6 อย่างสมบูรณ์แบบ');
    } else if (score >= 75) {
      grade = 'A';
      gradeBadge = '🌟 ดีมาก';
      audio.playCorrect();
      audio.speak('เก่งมากครับ จานอาหารมีประโยชน์ครบถ้วน');
    } else {
      audio.playCorrect();
      audio.speak('ดีครับ ลองปรับสัดส่วนตามคำแนะนำเพิ่มเติมดูนะครับ');
    }

    const modal = document.getElementById('plate-eval-modal');
    const content = document.getElementById('eval-modal-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="eval-result-card text-center">
        <div class="grade-badge-circle">${grade}</div>
        <h2>ผลประเมินจานสุขภาพ ป.6</h2>
        <h3 style="color: #10B981">${gradeBadge} (คะแนน: ${score}/100)</h3>
        
        <div class="eval-summary-stats">
          <div class="eval-stat-pill">⚡ พลังงานรวม: <strong>${totalCal} kcal</strong></div>
          <div class="eval-stat-pill">🥗 อาหารทั้งหมด: <strong>${this.plateItems.length} ชนิด</strong></div>
        </div>

        <div class="eval-tips-list">
          ${tips.map(t => `<div class="eval-tip-row">${t}</div>`).join('')}
        </div>

        <div class="modal-actions" style="margin-top: 20px;">
          <button class="btn-primary" id="btn-eval-done">👌 รับทราบและจัดจานใหม่</button>
          <button class="btn-secondary" id="btn-goto-clinic">🏥 ไปโหมดหมอน้อยรักษาโรค</button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');

    document.getElementById('btn-eval-done')?.addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    document.getElementById('btn-goto-clinic')?.addEventListener('click', () => {
      modal.classList.add('hidden');
      this.app.switchMode('clinic');
    });
  }

  bindEvents() {
    // Pantry item click to add
    this.container.addEventListener('click', (e) => {
      const card = e.target.closest('.pantry-item-card');
      if (card) {
        const foodId = card.dataset.foodId;
        this.addFoodToPlate(foodId);
      }
    });

    // Pantry filter tabs
    this.container.querySelectorAll('.pantry-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.container.querySelectorAll('.pantry-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.filter;
        const grid = document.getElementById('pantry-items-grid');
        if (grid) grid.innerHTML = this.renderPantryCards(filter);
      });
    });

    // Reset button
    document.getElementById('btn-plate-reset')?.addEventListener('click', () => {
      this.plateItems = [];
      this.updatePlateDisplay();
      audio.playTone(300, 'sine', 0.15);
    });

    // Evaluate button
    document.getElementById('btn-plate-evaluate')?.addEventListener('click', () => {
      this.evaluatePlate();
    });

    document.getElementById('eval-modal-close')?.addEventListener('click', () => {
      document.getElementById('plate-eval-modal')?.classList.add('hidden');
    });
  }

  stop() {
    this.isActive = false;
  }
}
