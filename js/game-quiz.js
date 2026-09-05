// ==========================================
// Mode 5: แบบทดสอบวัดระดับ ป.6 + เกียรติบัตร
// (Grade 6 Nutrition Quiz & Certificate Generator)
// ==========================================

import { QUIZ_QUESTIONS } from './food-data.js';
import { audio } from './audio.js';

export class GameQuiz {
  constructor(app) {
    this.app = app;
    this.container = null;
    this.isActive = false;

    this.currentQIndex = 0;
    this.score = 0;
    this.userAnswers = [];
    this.isAnswered = false;
  }

  mount(containerElement) {
    this.container = containerElement;
    this.renderLayout();
    this.bindEvents();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="game-mode-header">
        <div class="stat-badge"><span class="stat-icon">📝</span> แบบทดสอบ ป.6: <strong>ข้อที่ <span id="quiz-curr-num">1</span> / ${QUIZ_QUESTIONS.length}</strong></div>
        <div class="stat-badge"><span class="stat-icon">⭐</span> คะแนนสะสม: <strong id="quiz-score-num">0</strong></div>
        <button id="btn-quiz-speak" class="btn-sound-small" title="ฟังเสียงอ่านโจทย์">🔊 อ่านโจทย์</button>
      </div>

      <div class="quiz-workspace-container">
        <div class="quiz-card glassmorphism">
          <!-- Progress Bar -->
          <div class="quiz-progress-track">
            <div id="quiz-progress-bar" class="quiz-progress-fill" style="width: 10%;"></div>
          </div>

          <!-- Question Body -->
          <div class="quiz-question-box">
            <h2 id="quiz-question-text" class="quiz-question-heading">คำถาม...</h2>
          </div>

          <!-- 4 Multiple Choice Options -->
          <div class="quiz-options-grid" id="quiz-options-container"></div>

          <!-- Explanation Banner -->
          <div id="quiz-explanation-box" class="quiz-explanation-box hidden">
            <h4 id="quiz-result-title">คำอธิบาย:</h4>
            <p id="quiz-explanation-text"></p>
            <button id="btn-next-question" class="btn-primary-pill">ข้อถัดไป ➡️</button>
          </div>
        </div>
      </div>

      <!-- Certificate & Final Score Modal -->
      <div id="certificate-modal" class="modal-overlay hidden">
        <div class="modal-card glassmorphism certificate-modal-card bounce-in">
          <div id="cert-modal-body"></div>
        </div>
      </div>
    `;
  }

  start() {
    this.isActive = true;
    this.currentQIndex = 0;
    this.score = 0;
    this.userAnswers = [];
    this.loadQuestion(0);
  }

  loadQuestion(index) {
    this.isAnswered = false;
    this.currentQIndex = index;
    const q = QUIZ_QUESTIONS[index];
    if (!q) return;

    // Update Headers
    document.getElementById('quiz-curr-num').textContent = index + 1;
    document.getElementById('quiz-score-num').textContent = this.score;

    const progressFill = document.getElementById('quiz-progress-bar');
    if (progressFill) {
      progressFill.style.width = `${((index + 1) / QUIZ_QUESTIONS.length) * 100}%`;
    }

    // Question Text
    const qText = document.getElementById('quiz-question-text');
    if (qText) qText.textContent = `${index + 1}. ${q.question}`;

    // Hide Explanation Box
    const expBox = document.getElementById('quiz-explanation-box');
    if (expBox) expBox.classList.add('hidden');

    // Render Options
    const optContainer = document.getElementById('quiz-options-container');
    if (optContainer) {
      optContainer.innerHTML = q.options.map((opt, optIdx) => `
        <button class="quiz-option-btn" data-opt-index="${optIdx}">
          <span class="option-indicator">${['A', 'B', 'C', 'D'][optIdx]}</span>
          <span class="option-text">${opt}</span>
        </button>
      `).join('');

      optContainer.querySelectorAll('.quiz-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const chosenIdx = parseInt(btn.dataset.optIndex, 10);
          this.handleAnswer(chosenIdx);
        });
      });
    }

    // Speak Question in Thai
    audio.speak(`ข้อที่ ${index + 1} ${q.question}`);
  }

  handleAnswer(chosenIdx) {
    if (this.isAnswered) return;
    this.isAnswered = true;

    const q = QUIZ_QUESTIONS[this.currentQIndex];
    const isCorrect = chosenIdx === q.correctAnswer;
    const buttons = document.querySelectorAll('.quiz-option-btn');

    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correctAnswer) {
        btn.classList.add('opt-correct');
      } else if (idx === chosenIdx) {
        btn.classList.add('opt-wrong');
      }
    });

    const expBox = document.getElementById('quiz-explanation-box');
    const resTitle = document.getElementById('quiz-result-title');
    const expText = document.getElementById('quiz-explanation-text');

    if (isCorrect) {
      this.score += 10;
      audio.playCorrect();
      audio.speak(`ตอบถูกต้องครับ! ${q.explanation}`);
      if (resTitle) {
        resTitle.innerHTML = '🎉 ถูกต้องแล้วครับ!';
        resTitle.style.color = '#10B981';
      }
    } else {
      audio.playWrong();
      audio.speak(`ยังไม่ถูกต้องครับ ข้อที่ถูกคือ ${q.options[q.correctAnswer]} ${q.explanation}`);
      if (resTitle) {
        resTitle.innerHTML = '❌ ยังไม่ถูกต้องครับ';
        resTitle.style.color = '#EF4444';
      }
    }

    if (expText) expText.textContent = q.explanation;
    if (expBox) expBox.classList.remove('hidden');

    document.getElementById('quiz-score-num').textContent = this.score;

    document.getElementById('btn-next-question').onclick = () => {
      if (this.currentQIndex + 1 < QUIZ_QUESTIONS.length) {
        this.loadQuestion(this.currentQIndex + 1);
      } else {
        this.finishQuiz();
      }
    };
  }

  finishQuiz() {
    audio.playFanfare();
    const finalScore = this.score;
    const totalPossible = QUIZ_QUESTIONS.length * 10;

    audio.speak(`ยินดีด้วยครับ! ทำแบบทดสอบเสร็จเรียบร้อย ได้คะแนน ${finalScore} เต็ม ${totalPossible} คะแนน สามารถกรอกชื่อเพื่อพิมพ์เกียรติบัตรได้เลยครับ`);

    const modal = document.getElementById('certificate-modal');
    const body = document.getElementById('cert-modal-body');
    if (!modal || !body) return;

    body.innerHTML = `
      <div class="cert-form-container text-center">
        <div class="trophy-bounce">🎖️</div>
        <h2>สำเร็จหลักสูตร อาหารและสารอาหาร ป.6!</h2>
        <div class="final-quiz-score">คะแนนของคุณ: <strong>${finalScore} / ${totalPossible}</strong> (${(finalScore / totalPossible) * 100}%)</div>

        <div class="cert-input-group">
          <label for="student-name-input">📝 กรอกชื่อ - นามสกุล นักเรียน:</label>
          <input type="text" id="student-name-input" class="text-input-field" placeholder="เช่น ด.ช. วิทยา ใฝ่รู้ (ป.6)" value="ด.ช. นักเรียนยอดเยี่ยม ป.6">
        </div>

        <div class="cert-input-group">
          <label for="school-name-input">🏫 ชื่อโรงเรียน:</label>
          <input type="text" id="school-name-input" class="text-input-field" placeholder="เช่น โรงเรียนบ้านสันดาบ" value="โรงเรียนบ้านสันดาบ">
        </div>

        <button id="btn-generate-cert" class="btn-primary-pill pulse-glow" style="margin-top: 15px;">
          🖨️ สร้างเกียรติบัตรผู้เชี่ยวชาญโภชนาการ
        </button>

        <!-- Canvas for Certificate -->
        <div class="certificate-preview-box" id="cert-preview-wrap" style="display: none; margin-top: 20px;">
          <canvas id="cert-canvas" width="850" height="600" class="cert-canvas-el"></canvas>
          <div class="cert-actions" style="margin-top: 15px;">
            <button id="btn-download-cert" class="btn-primary">📥 บันทึกรูปเกียรติบัตร (PNG)</button>
            <button id="btn-replay-quiz" class="btn-secondary">🔄 ทำแบบทดสอบอีกครั้ง</button>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');

    document.getElementById('btn-generate-cert')?.addEventListener('click', () => {
      const studentName = document.getElementById('student-name-input').value.trim() || 'นักเรียนชั้น ป.6 ผู้เก่งกาจ';
      const schoolName = document.getElementById('school-name-input').value.trim() || 'โรงเรียนบ้านสันดาบ';
      this.drawCertificate(studentName, schoolName, finalScore);
      document.getElementById('cert-preview-wrap').style.display = 'block';
    });
  }

  drawCertificate(studentName, schoolName, score) {
    const canvas = document.getElementById('cert-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Background Parchment & Gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.5, '#FFFDF5');
    grad.addColorStop(1, '#FEF3C7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Elegant Golden Border
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 12;
    ctx.strokeRect(20, 20, w - 40, h - 40);

    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 3;
    ctx.strokeRect(32, 32, w - 64, h - 64);

    // Decorative Corner Knots
    const drawCorner = (cx, cy) => {
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCorner(32, 32);
    drawCorner(w - 32, 32);
    drawCorner(32, h - 32);
    drawCorner(w - 32, h - 32);

    // Header Emblem
    ctx.fillStyle = '#D97706';
    ctx.font = '32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏆 🎖️ 🥗', w / 2, 75);

    // Certificate Title
    ctx.font = 'bold 30px Prompt, Kanit, sans-serif';
    ctx.fillStyle = '#92400E';
    ctx.fillText('เกียรติบัตรแสดงความรู้ความสามารถ', w / 2, 120);

    ctx.font = 'bold 20px Prompt, Kanit, sans-serif';
    ctx.fillStyle = '#B45309';
    ctx.fillText('โครงการ AR NutriQuest: สารอาหารและโภชนาการ วิทยาศาสตร์ ป.6', w / 2, 155);

    // Awarded To
    ctx.font = '16px Sarabun, sans-serif';
    ctx.fillStyle = '#4B5563';
    ctx.fillText('ขอมอบเกียรติบัตรฉบับนี้ไว้เพื่อแสดงว่า', w / 2, 210);

    // Student Name
    ctx.font = 'bold 28px Prompt, Sarabun, sans-serif';
    ctx.fillStyle = '#1E3A8A';
    ctx.fillText(studentName, w / 2, 260);

    // Underline
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 180, 275);
    ctx.lineTo(w / 2 + 180, 275);
    ctx.stroke();

    // School Name & Achievement
    ctx.font = 'bold 19px Sarabun, Prompt, sans-serif';
    ctx.fillStyle = '#374151';
    ctx.fillText(`${schoolName}`, w / 2, 310);

    ctx.font = '17px Sarabun, sans-serif';
    ctx.fillStyle = '#15803D';
    ctx.fillText(`ได้ผ่านการเรียนรู้และทำแบบทดสอบวัดระดับ เรื่อง อาหารและสารอาหาร`, w / 2, 355);
    ctx.fillText(`ได้คะแนนยอดเยี่ยม ${score} / 100 คะแนน (ระดับดีเด่น)`, w / 2, 385);

    // Footer Signatures & Date
    const todayStr = new Date().toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    ctx.font = '15px Sarabun, sans-serif';
    ctx.fillStyle = '#6B7280';
    ctx.fillText(`ให้ไว้ ณ วันที่ ${todayStr}`, w / 2, 440);

    // ================= ลงนามครูผู้สอน (จัดวางกึ่งกลางอย่างเป็นทางการ) =================
    const sigX = w / 2;
    const sigY = 505;

    ctx.font = '15px Sarabun, sans-serif';
    ctx.fillStyle = '#6B7280';
    ctx.fillText('ลงชื่อ....................................................................', sigX, sigY);

    ctx.font = 'bold 17px Prompt, Sarabun, sans-serif';
    ctx.fillStyle = '#1E3A8A';
    ctx.fillText('(นางสาวสุจิตตรา ปางสุข)', sigX, sigY + 28);

    ctx.font = '14.5px Sarabun, sans-serif';
    ctx.fillStyle = '#4B5563';
    ctx.fillText('ครูผู้สอนกลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี', sigX, sigY + 50);

    // Download Button handler
    document.getElementById('btn-download-cert').onclick = () => {
      const link = document.createElement('a');
      link.download = `เกียรติบัตร_สารอาหาร_ป6_${studentName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    document.getElementById('btn-replay-quiz').onclick = () => {
      document.getElementById('certificate-modal').classList.add('hidden');
      this.start();
    };
  }

  bindEvents() {
    document.getElementById('btn-quiz-speak')?.addEventListener('click', () => {
      const q = QUIZ_QUESTIONS[this.currentQIndex];
      if (q) audio.speak(`ข้อที่ ${this.currentQIndex + 1} ${q.question}`);
    });
  }

  stop() {
    this.isActive = false;
  }
}
