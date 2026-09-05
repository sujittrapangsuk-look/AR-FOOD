// ==========================================
// Mode 1: AR สารอาหาร 6 ประเภท (Catch & Classify)
// จับอาหารลอยในอากาศ AR แยกประเภทสารอาหาร 6 หมู่
// ==========================================

import { NUTRIENT_GROUPS, FOOD_ITEMS } from './food-data.js';
import { audio } from './audio.js';

export class GameClassify {
  constructor(app) {
    this.app = app;
    this.container = null;
    this.isActive = false;

    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.totalTime = 90; // 1 นาที 30 วินาที
    this.timeLeft = 90;
    this.timerInterval = null;
    this.spawnInterval = null;
    this.countdownTimeouts = [];

    this.floatingFoods = []; // list of active floating food objects
    this.heldFood = null; // currently grabbed food
    this.heldBySource = null; // 'hand' or 'pointer'

    this.targetBuckets = [];
    this.bucketHoverTimer = null;
    this.currentHoveredBucket = null;

    this.classifiedHistory = []; // list of all items classified during this session
  }

  mount(containerElement) {
    this.container = containerElement;
    this.renderLayout();
    this.setupBuckets();
    this.bindEvents();
  }

  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="game-mode-header">
        <div class="stat-badge"><span class="stat-icon">⭐</span> คะแนน: <strong id="classify-score">0</strong></div>
        <div class="stat-badge"><span class="stat-icon">🔥</span> คอมโบ: <strong id="classify-combo">0x</strong></div>
        <div class="stat-badge timer-badge"><span class="stat-icon">⏱️</span> เวลา: <strong id="classify-timer">1:30</strong> นาที</div>
        <button id="classify-hint-btn" class="btn-icon-pill">💡 คำใบ้</button>
      </div>

      <!-- AR Food Spawning Arena -->
      <div id="classify-arena" class="ar-arena">
        <!-- Will be populated by showStartLobby or beginGamePlay -->
      </div>

      <!-- 6 Nutrient Target Baskets -->
      <div class="nutrient-buckets-grid">
        ${Object.values(NUTRIENT_GROUPS).map(group => `
          <div class="nutrient-bucket" data-category="${group.id}" style="--group-color: ${group.color}">
            <div class="bucket-glow"></div>
            <div class="bucket-icon">${group.icon}</div>
            <div class="bucket-name">${group.shortName}</div>
            <div class="bucket-energy-tag ${group.givesEnergy ? 'energy-yes' : 'energy-no'}">
              ${group.givesEnergy ? '⚡ ให้พลังงาน' : '🛡️ ไม่ให้พลังงาน'}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Detail / Summary Card Modal -->
      <div id="food-detail-modal" class="modal-overlay hidden">
        <div class="modal-card glassmorphism bounce-in" style="max-width: 780px;">
          <button class="modal-close" id="modal-close-btn">&times;</button>
          <div id="modal-content-body"></div>
        </div>
      </div>
    `;
  }

  setupBuckets() {
    const bucketElements = this.container.querySelectorAll('.nutrient-bucket');
    this.targetBuckets = Array.from(bucketElements).map(el => {
      const rect = el.getBoundingClientRect();
      return {
        element: el,
        category: el.dataset.category,
        rect: rect
      };
    });
  }

  updateBucketRects() {
    if (!this.container) return;
    const bucketElements = this.container.querySelectorAll('.nutrient-bucket');
    this.targetBuckets = Array.from(bucketElements).map(el => ({
      element: el,
      category: el.dataset.category,
      rect: el.getBoundingClientRect()
    }));
  }

  start() {
    this.stop();
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.timeLeft = this.totalTime;
    this.floatingFoods = [];
    this.heldFood = null;
    this.classifiedHistory = [];

    this.updateStatsUI();
    this.updateBucketRects();
    this.showStartLobby();
  }

  showStartLobby() {
    this.isActive = false;
    const arena = document.getElementById('classify-arena');
    if (!arena) return;

    arena.innerHTML = `
      <div class="classify-start-lobby">
        <div class="lobby-card glassmorphism">
          <div class="lobby-badge">🎮 ภารกิจจำแนกอาหาร • วิทยาศาสตร์ ป.6</div>
          <h2 class="lobby-title">สารอาหาร 6 ประเภท (Catch & Classify)</h2>
          <p class="lobby-subtitle">สัมผัสอาหารที่ลอยในอากาศแล้วลากไปใส่ถังสารอาหาร 6 หมู่ให้ถูกต้อง</p>
          
          <div class="lobby-rules-grid">
            <div class="lobby-rule-card">
              <span class="rule-icon">🖐️</span>
              <div class="rule-info">
                <strong>สัมผัสหรือลากอาหาร</strong>
                <p>แตะโดนอาหารแล้วลากไปที่ถังได้ทันที</p>
              </div>
            </div>
            <div class="lobby-rule-card">
              <span class="rule-icon">📥</span>
              <div class="rule-info">
                <strong>ถังสารอาหาร 6 หมู่</strong>
                <p>โปรตีน, คาร์โบไฮเดรต, ไขมัน, วิตามิน, เกลือแร่, น้ำ</p>
              </div>
            </div>
            <div class="lobby-rule-card">
              <span class="rule-icon">⏱️</span>
              <div class="rule-info">
                <strong>เวลา 1 นาที 30 วินาที</strong>
                <p>ทำคอมโบต่อเนื่องเพื่อรับคะแนนพิเศษ</p>
              </div>
            </div>
          </div>

          <button id="btn-classify-start" class="btn-start-game pulse-start-btn">
            <span class="btn-start-icon">🚀</span>
            <span>กดเริ่มเกม (Start Game)</span>
          </button>
        </div>
      </div>
    `;

    const startBtn = document.getElementById('btn-classify-start');
    if (startBtn) {
      let started = false;
      const handleStart = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (started) return;
        started = true;
        startBtn.disabled = true;
        this.runCountdown();
      };
      startBtn.addEventListener('click', handleStart);
      startBtn.addEventListener('pointerup', handleStart);
    }
  }

  runCountdown() {
    const arena = document.getElementById('classify-arena');
    if (!arena) return;

    if (this.countdownTimeouts) {
      this.countdownTimeouts.forEach(t => clearTimeout(t));
    }
    this.countdownTimeouts = [];

    // Create Countdown Overlay
    arena.innerHTML = `
      <div id="classify-countdown-overlay" class="countdown-overlay">
        <div class="countdown-card">
          <div id="countdown-display" class="countdown-number count-pop count-3">3</div>
          <div id="countdown-subtext" class="countdown-subtext">เตรียมตัวให้พร้อม...</div>
        </div>
      </div>
    `;

    const countDisplay = document.getElementById('countdown-display');
    const countSub = document.getElementById('countdown-subtext');

    // 3
    audio.playCountdownBeep(false);
    audio.speak('สาม');

    // 2 (after 1000ms)
    this.countdownTimeouts.push(setTimeout(() => {
      if (countDisplay) {
        countDisplay.textContent = '2';
        countDisplay.className = 'countdown-number count-pop count-2';
      }
      if (countSub) countSub.textContent = 'เตรียมพร้อมแยกสารอาหาร...';
      audio.playCountdownBeep(false);
      audio.speak('สอง');
    }, 1000));

    // 1 (after 2000ms)
    this.countdownTimeouts.push(setTimeout(() => {
      if (countDisplay) {
        countDisplay.textContent = '1';
        countDisplay.className = 'countdown-number count-pop count-1';
      }
      if (countSub) countSub.textContent = 'เข้าประจำตำแหน่ง!';
      audio.playCountdownBeep(false);
      audio.speak('หนึ่ง');
    }, 2000));

    // เริ่มได้! (after 3000ms)
    this.countdownTimeouts.push(setTimeout(() => {
      if (countDisplay) {
        countDisplay.textContent = 'เริ่มได้! 🚀';
        countDisplay.className = 'countdown-number count-pop count-go';
      }
      if (countSub) countSub.textContent = 'เริ่มจับอาหารได้เลย!';
      audio.playCountdownBeep(true);
      audio.speak('เริ่มได้ครับ!');
    }, 3000));

    // Officially begin game play (after 3800ms)
    this.countdownTimeouts.push(setTimeout(() => {
      const overlay = document.getElementById('classify-countdown-overlay');
      if (overlay) overlay.remove();
      this.beginGamePlay();
    }, 3800));
  }

  beginGamePlay() {
    this.isActive = true;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.timeLeft = this.totalTime;
    this.floatingFoods = [];
    this.heldFood = null;
    this.classifiedHistory = [];

    this.updateStatsUI();
    this.updateBucketRects();

    const arena = document.getElementById('classify-arena');
    if (arena) {
      arena.innerHTML = `
        <div class="arena-instruction">
          <span class="pulse-hand">🖐️</span> แตะโดนภาพอาหารแล้วลากไปใส่ถังสารอาหาร 6 หมู่ได้ทันที
        </div>
      `;
    }

    // Start Timer (1:30 countdown)
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      const timerEl = document.getElementById('classify-timer');
      if (timerEl) timerEl.textContent = this.formatTime(this.timeLeft);

      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);

    // Start Food Spawner
    clearInterval(this.spawnInterval);
    this.spawnFood();
    this.spawnInterval = setInterval(() => {
      if (this.floatingFoods.length < 5) {
        this.spawnFood();
      }
    }, 1900);

    // Animation loop for floating food
    this.animateLoop();
  }

  spawnFood() {
    if (!this.isActive) return;
    const arena = document.getElementById('classify-arena');
    if (!arena) return;

    // Random food item
    const randomFood = FOOD_ITEMS[Math.floor(Math.random() * FOOD_ITEMS.length)];
    const id = 'food_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);

    const arenaRect = arena.getBoundingClientRect();
    const startX = Math.max(20, Math.min(arenaRect.width - 150, 40 + Math.random() * (arenaRect.width - 180)));
    const startY = Math.max(40, Math.min(arenaRect.height - 150, 40 + Math.random() * (arenaRect.height - 180)));

    const el = document.createElement('div');
    el.className = 'floating-food-card floating-anim';
    el.id = id;
    el.style.left = '0px';
    el.style.top = '0px';
    el.style.transform = `translate3d(${startX}px, ${startY}px, 0px)`;
    el.style.borderColor = randomFood.color;
    el.innerHTML = `
      <div class="food-emoji-bubble" style="background: ${randomFood.color}22">
        <span class="emoji-main">${randomFood.icon}</span>
      </div>
      <div class="food-label">${randomFood.nameTh}</div>
      <div class="food-cal-tag">🔥 ${randomFood.calories} kcal</div>
    `;

    arena.appendChild(el);

    const foodObj = {
      id: id,
      data: randomFood,
      element: el,
      x: startX,
      y: startY,
      vx: (Math.random() > 0.5 ? 1 : -1) * (0.25 + Math.random() * 0.2), // ลอยช้าลงอย่างนุ่มนวล
      vy: (Math.random() > 0.5 ? 1 : -1) * (0.2 + Math.random() * 0.15),
      floatPhase: Math.random() * Math.PI * 2,
      isHeld: false,
      scale: 1
    };

    // Direct Touch & Pointer drag handler directly on card
    this.attachCardPointerEvents(foodObj);

    this.floatingFoods.push(foodObj);
  }

  attachCardPointerEvents(foodObj) {
    const el = foodObj.element;

    const startDrag = (clientX, clientY, e) => {
      if (!this.isActive) return;
      if (e && e.preventDefault) e.preventDefault();

      this.heldFood = foodObj;
      this.heldBySource = 'pointer';
      foodObj.isHeld = true;
      foodObj.element.classList.add('is-dragged');
      foodObj.element.style.transition = 'none'; // Zero delay direct follow
      audio.playGrab();

      const arena = document.getElementById('classify-arena');
      if (arena) {
        const arenaRect = arena.getBoundingClientRect();
        foodObj.x = clientX - arenaRect.left - 55;
        foodObj.y = clientY - arenaRect.top - 55;
        foodObj.element.style.transform = `translate3d(${foodObj.x}px, ${foodObj.y}px, 0px) scale(1.25)`;
      }
    };

    const moveDrag = (clientX, clientY, e) => {
      if (!this.isActive || this.heldFood !== foodObj) return;
      if (e && e.preventDefault) e.preventDefault();

      const arena = document.getElementById('classify-arena');
      if (arena) {
        const arenaRect = arena.getBoundingClientRect();
        foodObj.x = clientX - arenaRect.left - 55;
        foodObj.y = clientY - arenaRect.top - 55;
        foodObj.element.style.transform = `translate3d(${foodObj.x}px, ${foodObj.y}px, 0px) scale(1.25)`;
        this.highlightHoveredBucket(clientX, clientY);
      }
    };

    const endDrag = (clientX, clientY) => {
      if (!this.isActive || this.heldFood !== foodObj) return;
      foodObj.element.style.transition = '';
      this.handlePointerRelease(clientX, clientY);
    };

    // Pointer Events (Touch / Pen / Mouse) with Pointer Capture
    el.addEventListener('pointerdown', (e) => {
      try { el.setPointerCapture(e.pointerId); } catch(err) {}
      startDrag(e.clientX, e.clientY, e);
    });

    el.addEventListener('pointermove', (e) => {
      if (this.heldFood === foodObj) {
        moveDrag(e.clientX, e.clientY, e);
      }
    });

    el.addEventListener('pointerup', (e) => {
      try { el.releasePointerCapture(e.pointerId); } catch(err) {}
      endDrag(e.clientX, e.clientY);
    });

    el.addEventListener('pointercancel', (e) => {
      try { el.releasePointerCapture(e.pointerId); } catch(err) {}
      endDrag(e.clientX, e.clientY);
    });
  }

  animateLoop() {
    if (!this.isActive) return;

    const arena = document.getElementById('classify-arena');
    if (arena) {
      const arenaRect = arena.getBoundingClientRect();

      this.floatingFoods.forEach(food => {
        if (!food.isHeld) {
          food.floatPhase += 0.015;
          food.x += food.vx;
          food.y += food.vy + Math.sin(food.floatPhase) * 0.18; // การลอยขึ้นลงแบบคลื่นเบาๆ ช้าและนุ่มนวล

          // Bounce off arena bounds
          if (food.x < 10) { food.x = 10; food.vx = Math.abs(food.vx); }
          if (food.x > arenaRect.width - 130) { food.x = arenaRect.width - 130; food.vx = -Math.abs(food.vx); }
          if (food.y < 10) { food.y = 10; food.vy = Math.abs(food.vy); }
          if (food.y > arenaRect.height - 130) { food.y = arenaRect.height - 130; food.vy = -Math.abs(food.vy); }

          food.element.style.transform = `translate3d(${food.x}px, ${food.y}px, 0px) scale(1)`;
        }
      });
    }

    requestAnimationFrame(() => this.animateLoop());
  }

  // Pointer Interaction from AREngine (Hand tracking in AR Camera)
  handlePointerMove(screenX, screenY, isPinching) {
    if (!this.isActive) return;

    const arena = document.getElementById('classify-arena');
    if (!arena) return;
    const arenaRect = arena.getBoundingClientRect();
    const handArenaX = screenX - arenaRect.left;
    const handArenaY = screenY - arenaRect.top;

    // 1. If NOT holding food: Check if hand cursor touches/contacts any floating food
    if (!this.heldFood) {
      for (let i = this.floatingFoods.length - 1; i >= 0; i--) {
        const food = this.floatingFoods[i];
        const foodCenterX = food.x + 55;
        const foodCenterY = food.y + 55;
        const dist = Math.hypot(foodCenterX - handArenaX, foodCenterY - handArenaY);

        // เมื่อมือสัมผัสโดนในระยะ 90px จับติดมือทันที
        if (dist < 90) {
          this.heldFood = food;
          this.heldBySource = 'hand';
          food.isHeld = true;
          food.element.classList.add('is-dragged');
          food.element.style.transition = 'none';
          audio.playGrab();
          break;
        }
      }
    }

    // 2. If holding food: smoothly move it along with the hand (ไม่หลุดระหว่างลาก)
    if (this.heldFood && this.heldBySource === 'hand') {
      this.heldFood.x = handArenaX - 55;
      this.heldFood.y = handArenaY - 55;
      this.heldFood.element.style.transform = `translate3d(${this.heldFood.x}px, ${this.heldFood.y}px, 0px) scale(1.28)`;

      // Highlight target bucket if hovering over
      this.highlightHoveredBucket(screenX, screenY);

      // Check if dropped into bucket
      this.checkAutoDropOverBucket(screenX, screenY);
    }
  }

  handlePointerGrab(screenX, screenY) {
    if (!this.isActive || this.heldFood) return;

    const arena = document.getElementById('classify-arena');
    if (!arena) return;
    const arenaRect = arena.getBoundingClientRect();
    const clickX = screenX - arenaRect.left;
    const clickY = screenY - arenaRect.top;

    for (let i = this.floatingFoods.length - 1; i >= 0; i--) {
      const food = this.floatingFoods[i];
      const dist = Math.hypot(food.x + 55 - clickX, food.y + 55 - clickY);

      if (dist < 85) {
        this.heldFood = food;
        this.heldBySource = 'hand';
        food.isHeld = true;
        food.element.classList.add('is-dragged');
        audio.playGrab();
        break;
      }
    }
  }

  handlePointerRelease(screenX, screenY) {
    if (!this.isActive || !this.heldFood) return;

    const food = this.heldFood;
    this.heldFood = null;
    this.heldBySource = null;
    food.isHeld = false;
    food.element.classList.remove('is-dragged');

    // Check which bucket it dropped into
    this.updateBucketRects();
    const droppedBucket = this.targetBuckets.find(bucket => {
      const r = bucket.rect;
      return (
        screenX >= r.left &&
        screenX <= r.right &&
        screenY >= r.top &&
        screenY <= r.bottom
      );
    });

    if (droppedBucket) {
      this.evaluateClassification(food, droppedBucket.category);
    } else {
      audio.playDrop();
    }

    // Reset bucket highlights
    this.targetBuckets.forEach(b => b.element.classList.remove('bucket-hover'));
  }

  checkAutoDropOverBucket(screenX, screenY) {
    this.updateBucketRects();
    const hoveredBucket = this.targetBuckets.find(bucket => {
      const r = bucket.rect;
      return (
        screenX >= r.left &&
        screenX <= r.right &&
        screenY >= r.top &&
        screenY <= r.bottom
      );
    });

    if (hoveredBucket) {
      if (this.currentHoveredBucket !== hoveredBucket.category) {
        this.currentHoveredBucket = hoveredBucket.category;
        clearTimeout(this.bucketHoverTimer);
        // Auto drop if held over bucket for 0.45s
        this.bucketHoverTimer = setTimeout(() => {
          if (this.heldFood && this.currentHoveredBucket === hoveredBucket.category) {
            this.handlePointerRelease(screenX, screenY);
          }
        }, 450);
      }
    } else {
      this.currentHoveredBucket = null;
      clearTimeout(this.bucketHoverTimer);
    }
  }

  highlightHoveredBucket(screenX, screenY) {
    this.targetBuckets.forEach(b => {
      const r = b.rect;
      const isInside = (
        screenX >= r.left &&
        screenX <= r.right &&
        screenY >= r.top &&
        screenY <= r.bottom
      );
      if (isInside) {
        b.element.classList.add('bucket-hover');
      } else {
        b.element.classList.remove('bucket-hover');
      }
    });
  }

  evaluateClassification(food, targetCategory) {
    const isPrimary = food.data.primaryNutrient === targetCategory;
    const isSecondary = food.data.secondaryNutrients && food.data.secondaryNutrients.includes(targetCategory);
    const isCorrect = isPrimary || isSecondary;

    if (isCorrect) {
      // CORRECT!
      this.combo++;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;

      const comboBonus = Math.min(this.combo * 10, 50);
      const points = 100 + comboBonus;
      this.score += points;

      audio.playCorrect();
      this.createCelebrationParticles(food.x, food.y, food.data.color);

      // In-game non-intrusive floating toast
      const toastText = this.combo > 1 ? `+${points} 🔥 COMBO ${this.combo}x` : `+${points} ⭐ ถูกต้อง!`;
      this.showFloatingToast(food.x + 55, food.y + 40, toastText, true);

      // Save to history for final summary
      this.classifiedHistory.push({
        food: food.data,
        chosenCategory: targetCategory,
        correctCategory: food.data.primaryNutrient,
        isCorrect: true,
        points: points
      });

      // Remove from arena
      this.removeFloatingFood(food.id);
    } else {
      // WRONG
      this.combo = 0;
      audio.playWrong();

      const correctGroup = NUTRIENT_GROUPS[food.data.primaryNutrient].shortName;
      this.showFloatingToast(food.x + 55, food.y + 40, `❌ กลุ่ม ${correctGroup}`, false);

      // Save to history for final summary
      this.classifiedHistory.push({
        food: food.data,
        chosenCategory: targetCategory,
        correctCategory: food.data.primaryNutrient,
        isCorrect: false,
        points: 0
      });

      // Shake animation
      food.element.classList.add('shake-anim');
      setTimeout(() => food.element?.classList.remove('shake-anim'), 600);
    }

    this.updateStatsUI();
  }

  // Floating toast inside the arena without pausing gameplay
  showFloatingToast(x, y, text, isCorrect) {
    const arena = document.getElementById('classify-arena');
    if (!arena) return;

    const toast = document.createElement('div');
    toast.className = `floating-score-toast ${isCorrect ? 'toast-correct' : 'toast-wrong'}`;
    toast.textContent = text;
    toast.style.left = `${x}px`;
    toast.style.top = `${y}px`;

    arena.appendChild(toast);
    setTimeout(() => toast.remove(), 1200);
  }

  createCelebrationParticles(x, y, color) {
    const arena = document.getElementById('classify-arena');
    if (!arena) return;

    for (let i = 0; i < 15; i++) {
      const p = document.createElement('div');
      p.className = 'sparkle-particle';
      p.style.left = `${x + 40}px`;
      p.style.top = `${y + 40}px`;
      p.style.backgroundColor = color || '#FACC15';

      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 80;
      const dx = Math.cos(angle) * speed;
      const dy = Math.sin(angle) * speed;

      p.style.setProperty('--dx', `${dx}px`);
      p.style.setProperty('--dy', `${dy}px`);

      arena.appendChild(p);
      setTimeout(() => p.remove(), 700);
    }
  }

  removeFloatingFood(id) {
    const idx = this.floatingFoods.findIndex(f => f.id === id);
    if (idx !== -1) {
      const food = this.floatingFoods[idx];
      if (food.element) food.element.remove();
      this.floatingFoods.splice(idx, 1);
    }
  }

  updateStatsUI() {
    const scoreEl = document.getElementById('classify-score');
    const comboEl = document.getElementById('classify-combo');
    if (scoreEl) scoreEl.textContent = this.score;
    if (comboEl) {
      comboEl.textContent = `${this.combo}x`;
      comboEl.style.color = this.combo > 2 ? '#EF4444' : '#F59E0B';
    }
  }

  endGame() {
    this.isActive = false;
    clearInterval(this.timerInterval);
    clearInterval(this.spawnInterval);

    audio.playFanfare();

    const totalAnswered = this.classifiedHistory.length;
    const correctCount = this.classifiedHistory.filter(h => h.isCorrect).length;
    const wrongCount = totalAnswered - correctCount;
    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

    audio.speak(`หมดเวลาครับ! คุณทำคะแนนได้ทั้งหมด ${this.score} คะแนน ตอบถูก ${correctCount} จาก ${totalAnswered} รายการ ความแม่นยำ ${accuracy} เปอร์เซ็นต์ครับ`);

    let stars = '⭐⭐⭐';
    if (accuracy < 60) stars = '⭐';
    else if (accuracy < 85) stars = '⭐⭐';

    const modal = document.getElementById('food-detail-modal');
    const content = document.getElementById('modal-content-body');
    if (modal && content) {
      content.innerHTML = `
        <div class="game-over-modal text-center">
          <div class="trophy-bounce">🏆</div>
          <h2 style="color: #1E3A8A; margin-top: 4px;">สรุปผลการเล่น: แยกสารอาหาร 6 หมู่</h2>
          <div class="final-score-display" style="font-size: 32px; font-weight: 800; color: #D97706; margin: 8px 0;">
            ${this.score} คะแนน
          </div>
          <div class="rating-stars" style="font-size: 24px; margin-bottom: 8px;">${stars}</div>

          <!-- Summary Stats -->
          <div class="summary-stats-bar">
            <div class="summary-stat-pill">
              🥗 จำแนกทั้งหมด: <strong>${totalAnswered}</strong> รายการ
            </div>
            <div class="summary-stat-pill">
              ✅ ถูกต้อง: <strong style="color: #10B981">${correctCount}</strong>
            </div>
            <div class="summary-stat-pill">
              ❌ ต้องทบทวน: <strong style="color: #EF4444">${wrongCount}</strong>
            </div>
            <div class="summary-stat-pill">
              🎯 ความแม่นยำ: <strong style="color: #6366F1">${accuracy}%</strong>
            </div>
            <div class="summary-stat-pill">
              🔥 คอมโบสูงสุด: <strong style="color: #F59E0B">${this.maxCombo}x</strong>
            </div>
          </div>

          <!-- Detailed Nutrition Summary List -->
          <h4 style="text-align: left; margin: 14px 0 6px; color: #1E293B;">
            📚 สรุปความรู้สารอาหารและอาหารที่พบในเกม (${totalAnswered} รายการ):
          </h4>
          <div class="summary-food-list">
            ${totalAnswered === 0 ? '<p style="color:#6B7280; text-align:center; padding:20px;">ยังไม่มีการจำแนกอาหาร</p>' : ''}
            ${this.classifiedHistory.map((item, idx) => {
              const primaryNutrient = NUTRIENT_GROUPS[item.food.primaryNutrient];
              return `
                <div class="summary-food-card ${item.isCorrect ? 'card-correct' : 'card-wrong'}">
                  <span class="summary-food-emoji">${item.food.icon}</span>
                  <div class="summary-food-info">
                    <div class="summary-food-top">
                      <span class="summary-food-name">${idx + 1}. ${item.food.nameTh}</span>
                      <span class="badge-pill" style="background:${primaryNutrient.color}22; color:${primaryNutrient.color}">
                        ${primaryNutrient.nameTh}
                      </span>
                      <span style="font-size: 11px; color: #D97706; font-weight: 600;">⚡ ${item.food.calories} kcal</span>
                    </div>
                    <p class="summary-food-fact">💡 <strong>ประโยชน์:</strong> ${item.food.funFact}</p>
                    <p class="summary-food-fact" style="font-size: 11px; color: #64748B;">
                      🧪 <strong>การทดสอบ:</strong> ไอโอดีน: ${item.food.labReaction.iodine}
                    </p>
                  </div>
                  <span class="summary-badge-result ${item.isCorrect ? 'badge-result-correct' : 'badge-result-wrong'}">
                    ${item.isCorrect ? `+${item.points} คะแนน` : 'ตอบผิด'}
                  </span>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Actions -->
          <div class="modal-actions" style="margin-top: 18px;">
            <button class="btn-primary" id="btn-replay-classify">🔄 เล่นใหม่อีกครั้ง (1:30 น.)</button>
            <button class="btn-secondary" id="btn-next-mode">🍱 ไปโหมดจัดจานสุขภาพ</button>
          </div>
        </div>
      `;
      modal.classList.remove('hidden');

      document.getElementById('btn-replay-classify')?.addEventListener('click', () => {
        modal.classList.add('hidden');
        this.start();
      });

      document.getElementById('btn-next-mode')?.addEventListener('click', () => {
        modal.classList.add('hidden');
        this.app.switchMode('plate');
      });
    }
  }

  bindEvents() {
    document.getElementById('modal-close-btn')?.addEventListener('click', () => {
      document.getElementById('food-detail-modal')?.classList.add('hidden');
    });

    document.getElementById('classify-hint-btn')?.addEventListener('click', () => {
      audio.speak('สารอาหารที่ให้พลังงานคือ โปรตีน คาร์โบไฮเดรต ไขมัน ส่วนวิตามิน เกลือแร่ และน้ำ ไม่ให้พลังงานครับ');
      alert('💡 คำใบ้ ป.6:\n⚡ ให้พลังงาน: โปรตีน (4 kcal), คาร์โบไฮเดรต (4 kcal), ไขมัน (9 kcal)\n🛡️ ไม่ให้พลังงาน: วิตามิน, เกลือแร่, น้ำ');
    });

    window.addEventListener('resize', () => this.updateBucketRects());
  }

  stop() {
    this.isActive = false;
    if (this.countdownTimeouts) {
      this.countdownTimeouts.forEach(t => clearTimeout(t));
      this.countdownTimeouts = [];
    }
    clearInterval(this.timerInterval);
    clearInterval(this.spawnInterval);
    this.floatingFoods.forEach(f => f.element?.remove());
    this.floatingFoods = [];
    this.heldFood = null;
  }
}
