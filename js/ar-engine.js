// ==========================================
// AR Engine & Hand Tracking Controller
// MediaPipe Hands + Camera Stream + Screen Touch Integration
// ==========================================

export class AREngine {
  constructor(videoElement, canvasOverlayElement) {
    this.video = videoElement;
    this.overlayCanvas = canvasOverlayElement;
    this.overlayCtx = this.overlayCanvas ? this.overlayCanvas.getContext('2d') : null;

    this.isCameraActive = false;
    this.isHandTrackingActive = false;
    this.stream = null;
    this.hands = null;
    this.cameraUtils = null;

    this.pointerState = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      isPinching: false,
      isHovering: false,
      activeHand: null,
      source: 'mouse' // 'hand' or 'touch' or 'mouse'
    };

    this.eventListeners = {
      move: [],
      grab: [],
      release: []
    };

    this.isPinchingPrev = false;
    this.facingMode = 'user'; // 'user' or 'environment'
    this.setupTouchAndMouseEvents();
  }

  // เริ่มต้นเปิดกล้องเว็บแคม
  async startCamera(facingMode = 'user') {
    this.facingMode = facingMode;
    try {
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: {
          facingMode: this.facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.video.srcObject = this.stream;
      await this.video.play();
      this.isCameraActive = true;

      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());

      // เริ่มต้นระบบตรวจจับมือ MediaPipe
      this.initMediaPipeHands();

      return true;
    } catch (err) {
      console.warn('Cannot access camera or permission denied:', err);
      this.isCameraActive = false;
      return false;
    }
  }

  // ปิดกล้อง
  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.video.srcObject = null;
    this.isCameraActive = false;
    this.isHandTrackingActive = false;
    if (this.overlayCtx) {
      this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
    }
  }

  toggleCamera() {
    if (this.isCameraActive) {
      this.stopCamera();
      return false;
    } else {
      return this.startCamera(this.facingMode);
    }
  }

  switchCamera() {
    this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
    if (this.isCameraActive) {
      return this.startCamera(this.facingMode);
    }
  }

  resizeCanvas() {
    if (!this.overlayCanvas) return;
    this.overlayCanvas.width = window.innerWidth;
    this.overlayCanvas.height = window.innerHeight;
  }

  // โหลดและตั้งค่า MediaPipe Hands
  initMediaPipeHands() {
    if (typeof window.Hands === 'undefined') {
      console.log('MediaPipe Hands library loading from CDN...');
      return;
    }

    try {
      this.hands = new window.Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      // Ultra-fast lite model for zero latency
      this.hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 0,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      this.hands.onResults((results) => this.onHandResults(results));

      if (typeof window.Camera !== 'undefined') {
        let isProcessingFrame = false;
        this.cameraUtils = new window.Camera(this.video, {
          onFrame: async () => {
            if (this.isCameraActive && this.hands && !isProcessingFrame) {
              isProcessingFrame = true;
              try {
                await this.hands.send({ image: this.video });
              } catch (err) {
                // Ignore transient frame error
              } finally {
                isProcessingFrame = false;
              }
            }
          },
          width: 640,
          height: 480
        });
        this.cameraUtils.start();
        this.isHandTrackingActive = true;
      }
    } catch (e) {
      console.warn('Error initializing MediaPipe Hands:', e);
    }
  }

  // ประมวลผลจุดพิกัดมือจาก MediaPipe แบบทันที (Zero Latency)
  onHandResults(results) {
    if (!this.overlayCtx || !this.overlayCanvas) return;
    const ctx = this.overlayCtx;
    const width = this.overlayCanvas.width;
    const height = this.overlayCanvas.height;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];

      // Mirror coordinates if front camera
      const isMirrored = this.facingMode === 'user';

      const getScreenPos = (landmark) => {
        const x = isMirrored ? (1 - landmark.x) * width : landmark.x * width;
        const y = landmark.y * height;
        return { x, y };
      };

      // วาดเส้นกระดูกมือ AR สไตล์นีออนเรืองแสง
      this.drawHandSkeleton(ctx, landmarks, getScreenPos);

      // ตรวจสอบตำแหน่งปลายนิ้วชี้ (Landmark 8) และนิ้วโป้ง (Landmark 4)
      const indexTip = getScreenPos(landmarks[8]);
      const thumbTip = getScreenPos(landmarks[4]);

      // คำนวณระยะห่างเพื่อเช็คการจีบนิ้ว / จับ (Pinch Gesture)
      const dist = Math.hypot(indexTip.x - thumbTip.x, indexTip.y - thumbTip.y);
      const isPinching = dist < 65;

      // พิกัด Cursor สัมผัส: ใช้ปลายนิ้วชี้เป็นหลักเพื่อความแม่นยำสูง
      const cursorX = indexTip.x;
      const cursorY = indexTip.y;

      this.pointerState = {
        x: cursorX,
        y: cursorY,
        isPinching: isPinching,
        isHovering: true,
        activeHand: landmarks,
        source: 'hand'
      };

      // วาด Holographic Ring Cursor
      this.drawArCursor(ctx, cursorX, cursorY, isPinching, dist);

      // Trigger Events ทันที
      this.emit('move', { x: cursorX, y: cursorY, isPinching });

      if (isPinching && !this.isPinchingPrev) {
        this.emit('grab', { x: cursorX, y: cursorY });
      } else if (!isPinching && this.isPinchingPrev) {
        this.emit('release', { x: cursorX, y: cursorY });
      }

      this.isPinchingPrev = isPinching;
    } else {
      this.pointerState.isHovering = false;
      if (this.isPinchingPrev) {
        this.emit('release', { x: this.pointerState.x, y: this.pointerState.y });
        this.isPinchingPrev = false;
      }
    }
    ctx.restore();
  }

  // วาดโครงกระดูกมือ AR
  drawHandSkeleton(ctx, landmarks, getScreenPos) {
    const CONNECTIONS = [
      [0, 1], [1, 2], [2, 3], [3, 4], // โป้ง
      [0, 5], [5, 6], [6, 7], [7, 8], // ชี้
      [0, 9], [9, 10], [10, 11], [11, 12], // กลาง
      [0, 13], [13, 14], [14, 15], [15, 16], // นาง
      [0, 17], [17, 18], [18, 19], [19, 20], // ก้อย
      [5, 9], [9, 13], [13, 17] // ฝ่ามือ
    ];

    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(74, 222, 128, 0.6)'; // เขียวเรืองแสง
    ctx.shadowColor = '#22C55E';
    ctx.shadowBlur = 10;

    CONNECTIONS.forEach(([i, j]) => {
      const p1 = getScreenPos(landmarks[i]);
      const p2 = getScreenPos(landmarks[j]);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    });

    // วาดจุดข้อต่อ
    landmarks.forEach((lm, idx) => {
      const p = getScreenPos(lm);
      ctx.beginPath();
      ctx.arc(p.x, p.y, idx === 8 || idx === 4 ? 7 : 4, 0, Math.PI * 2);
      ctx.fillStyle = idx === 8 || idx === 4 ? '#FACC15' : '#38BDF8';
      ctx.fill();
    });
  }

  // วาดวงแหวนเป้าสัมผัส AR
  drawArCursor(ctx, x, y, isPinching, dist) {
    ctx.save();
    ctx.shadowBlur = 15;
    ctx.shadowColor = isPinching ? '#EF4444' : '#38BDF8';

    // วงกลมหลัก
    ctx.beginPath();
    ctx.arc(x, y, isPinching ? 22 : 32, 0, Math.PI * 2);
    ctx.lineWidth = isPinching ? 4 : 2.5;
    ctx.strokeStyle = isPinching ? '#EF4444' : '#38BDF8';
    ctx.stroke();

    // จุดกึ่งกลาง
    ctx.beginPath();
    ctx.arc(x, y, isPinching ? 8 : 5, 0, Math.PI * 2);
    ctx.fillStyle = isPinching ? '#EF4444' : '#FBBF24';
    ctx.fill();

    // ข้อความบอกสถานะสัมผัส/จับ
    ctx.font = 'bold 14px Prompt, Kanit, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText(isPinching ? '✊ จับอยู่! ลากไปใส่ถังได้เลย' : '🖐️ สัมผัสโดนภาพเพื่อลาก', x, y - 40);

    ctx.restore();
  }

  // ระบบตรวจจับการแตะหน้าจอและเมาส์ (Touch & Mouse Support)
  setupTouchAndMouseEvents() {
    let isMouseDown = false;

    const handlePointerDown = (clientX, clientY, source) => {
      this.pointerState = {
        x: clientX,
        y: clientY,
        isPinching: true,
        isHovering: true,
        activeHand: null,
        source: source
      };
      this.emit('grab', { x: clientX, y: clientY });
    };

    const handlePointerMove = (clientX, clientY, source) => {
      this.pointerState.x = clientX;
      this.pointerState.y = clientY;
      this.pointerState.source = source;
      this.emit('move', { x: clientX, y: clientY, isPinching: this.pointerState.isPinching });
    };

    const handlePointerUp = (clientX, clientY, source) => {
      this.pointerState.isPinching = false;
      this.pointerState.source = source;
      this.emit('release', { x: clientX, y: clientY });
    };

    // Mouse Events
    window.addEventListener('mousedown', (e) => {
      if (this.isHandTrackingActive && this.pointerState.source === 'hand') return;
      isMouseDown = true;
      handlePointerDown(e.clientX, e.clientY, 'mouse');
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isHandTrackingActive && this.pointerState.source === 'hand') return;
      handlePointerMove(e.clientX, e.clientY, 'mouse');
    });

    window.addEventListener('mouseup', (e) => {
      if (this.isHandTrackingActive && this.pointerState.source === 'hand') return;
      if (isMouseDown) {
        isMouseDown = false;
        handlePointerUp(e.clientX, e.clientY, 'mouse');
      }
    });

    // Touch Events for Mobile / Tablet / iPad
    window.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        handlePointerDown(touch.clientX, touch.clientY, 'touch');
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        handlePointerMove(touch.clientX, touch.clientY, 'touch');
      }
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      const x = this.pointerState.x;
      const y = this.pointerState.y;
      handlePointerUp(x, y, 'touch');
    }, { passive: true });
  }

  on(event, callback) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].push(callback);
    }
  }

  off(event, callback) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(cb => cb(data));
    }
  }
}
