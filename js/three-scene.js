// ==========================================
// AR 3D Food Model & Particle Scene Manager
// Built with Three.js (Procedural 3D Food Meshes + Sparkles)
// ==========================================

export class ThreeSceneManager {
  constructor(containerElement) {
    this.container = containerElement;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.foodMeshes = new Map(); // id -> Three.Mesh / Group
    this.particles = null;
    this.animationFrameId = null;
    this.clock = null;
    this.isInitialized = false;

    this.init();
  }

  init() {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded yet');
      return;
    }

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // Scene setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 15);

    // WebGL Renderer with Alpha for AR Camera overlay
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Clear existing children in container if any
    const existingCanvas = this.container.querySelector('canvas.three-canvas');
    if (existingCanvas) existingCanvas.remove();

    this.renderer.domElement.classList.add('three-canvas');
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.pointerEvents = 'none'; // allows touch & gesture to pass through
    this.container.appendChild(this.renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    this.scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xffd166, 1.0, 30);
    pointLight.position.set(-5, -5, 5);
    this.scene.add(pointLight);

    // Magic Particle Field
    this.createMagicParticles();

    this.clock = new THREE.Clock();
    this.isInitialized = true;

    window.addEventListener('resize', () => this.onResize());
    this.animate();
  }

  createMagicParticles() {
    const particleCount = 60;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color('#FF6B6B'),
      new THREE.Color('#FFA94D'),
      new THREE.Color('#FFD43B'),
      new THREE.Color('#51CF66'),
      new THREE.Color('#339AF0'),
      new THREE.Color('#22B8CF')
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  // สร้างโมเดล 3D อาหารแบบ Procedural Mesh สวยงาม
  createFoodMesh(foodItem) {
    const group = new THREE.Group();
    const shape = foodItem.shape || 'sphere';

    // Materials
    const shinyMat = (colorHex, roughness = 0.3) =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        roughness: roughness,
        metalness: 0.15
      });

    switch (shape) {
      case 'drumstick': { // ไก่ย่าง
        const boneGeom = new THREE.CylinderGeometry(0.12, 0.12, 1.2, 16);
        const boneMat = shinyMat('#F8FAFC', 0.5);
        const bone = new THREE.Mesh(boneGeom, boneMat);
        bone.position.y = -0.5;

        const meatGeom = new THREE.SphereGeometry(0.7, 16, 16);
        meatGeom.scale(1, 1.4, 0.9);
        const meatMat = shinyMat('#D97706', 0.4);
        const meat = new THREE.Mesh(meatGeom, meatMat);
        meat.position.y = 0.2;

        group.add(bone);
        group.add(meat);
        break;
      }

      case 'fish': { // แซลมอน
        const bodyGeom = new THREE.CylinderGeometry(0.3, 0.7, 1.8, 16);
        bodyGeom.scale(1.4, 1, 0.5);
        const bodyMat = shinyMat('#FB7185', 0.3);
        const body = new THREE.Mesh(bodyGeom, bodyMat);
        body.rotation.z = Math.PI / 2;

        const stripeGeom = new THREE.RingGeometry(0.2, 0.4, 16);
        const stripeMat = shinyMat('#FFFFFF', 0.2);
        const stripe = new THREE.Mesh(stripeGeom, stripeMat);
        stripe.position.z = 0.26;
        group.add(body);
        group.add(stripe);
        break;
      }

      case 'egg': { // ไข่ต้ม
        const eggGeom = new THREE.SphereGeometry(0.7, 24, 24);
        eggGeom.scale(0.85, 1.2, 0.85);
        const eggMat = shinyMat('#FFFBEB', 0.2);
        const egg = new THREE.Mesh(eggGeom, eggMat);
        group.add(egg);
        break;
      }

      case 'milk_carton': { // กล่องนม
        const boxGeom = new THREE.BoxGeometry(0.9, 1.3, 0.9);
        const boxMat = shinyMat('#38BDF8', 0.3);
        const box = new THREE.Mesh(boxGeom, boxMat);

        const topGeom = new THREE.ConeGeometry(0.65, 0.5, 4);
        const topMat = shinyMat('#0284C7', 0.3);
        const top = new THREE.Mesh(topGeom, topMat);
        top.position.y = 0.85;
        top.rotation.y = Math.PI / 4;

        group.add(box);
        group.add(top);
        break;
      }

      case 'bowl': // ข้าวสวย
      case 'noodles': {
        const bowlGeom = new THREE.CylinderGeometry(0.9, 0.5, 0.7, 24, 1, true);
        const bowlMat = shinyMat('#E2E8F0', 0.2);
        const bowl = new THREE.Mesh(bowlGeom, bowlMat);

        const foodTopGeom = new THREE.SphereGeometry(0.8, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const foodColor = shape === 'bowl' ? '#FFFFFF' : '#FEF08A';
        const foodTopMat = shinyMat(foodColor, 0.6);
        const foodTop = new THREE.Mesh(foodTopGeom, foodTopMat);
        foodTop.position.y = 0.1;

        group.add(bowl);
        group.add(foodTop);
        break;
      }

      case 'bread': { // ขนมปัง
        const breadGeom = new THREE.BoxGeometry(1.2, 1.1, 0.8);
        const breadMat = shinyMat('#B45309', 0.6);
        const bread = new THREE.Mesh(breadGeom, breadMat);
        group.add(bread);
        break;
      }

      case 'avocado': { // อะโวคาโด
        const skinGeom = new THREE.SphereGeometry(0.8, 16, 16);
        skinGeom.scale(0.9, 1.2, 0.9);
        const skinMat = shinyMat('#365314', 0.5);
        const skin = new THREE.Mesh(skinGeom, skinMat);

        const pitGeom = new THREE.SphereGeometry(0.35, 16, 16);
        const pitMat = shinyMat('#78350F', 0.2);
        const pit = new THREE.Mesh(pitGeom, pitMat);
        pit.position.z = 0.5;

        group.add(skin);
        group.add(pit);
        break;
      }

      case 'orange': // ส้ม
      case 'apple': {
        const fruitGeom = new THREE.SphereGeometry(0.8, 24, 24);
        const fruitMat = shinyMat(foodItem.color || '#F97316', 0.2);
        const fruit = new THREE.Mesh(fruitGeom, fruitMat);

        // Leaf
        const leafGeom = new THREE.ConeGeometry(0.15, 0.4, 8);
        const leafMat = shinyMat('#22C55E', 0.4);
        const leaf = new THREE.Mesh(leafGeom, leafMat);
        leaf.position.set(0.1, 0.85, 0);
        leaf.rotation.z = -Math.PI / 4;

        group.add(fruit);
        group.add(leaf);
        break;
      }

      case 'broccoli': { // บรอกโคลี
        const stemGeom = new THREE.CylinderGeometry(0.2, 0.3, 0.8, 12);
        const stemMat = shinyMat('#86EFAC', 0.5);
        const stem = new THREE.Mesh(stemGeom, stemMat);
        stem.position.y = -0.3;

        const headGeom = new THREE.DodecahedronGeometry(0.7, 1);
        const headMat = shinyMat('#15803D', 0.8);
        const head = new THREE.Mesh(headGeom, headMat);
        head.position.y = 0.4;

        group.add(stem);
        group.add(head);
        break;
      }

      case 'carrot': { // แครอท
        const coneGeom = new THREE.ConeGeometry(0.5, 1.5, 16);
        const coneMat = shinyMat('#EA580C', 0.3);
        const cone = new THREE.Mesh(coneGeom, coneMat);
        cone.rotation.x = Math.PI;

        const topGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 8);
        const topMat = shinyMat('#22C55E', 0.4);
        const top = new THREE.Mesh(topGeom, topMat);
        top.position.y = 0.8;

        group.add(cone);
        group.add(top);
        break;
      }

      case 'watermelon': { // แตงโม
        const melonGeom = new THREE.CylinderGeometry(1.0, 1.0, 0.4, 24, 1, false, 0, Math.PI);
        const melonMat = shinyMat('#EF4444', 0.4);
        const melon = new THREE.Mesh(melonGeom, melonMat);
        melon.rotation.z = Math.PI / 2;
        group.add(melon);
        break;
      }

      case 'water_glass': { // แก้วน้ำ
        const glassGeom = new THREE.CylinderGeometry(0.5, 0.4, 1.2, 16);
        const glassMat = new THREE.MeshPhysicalMaterial({
          color: 0x38bdf8,
          transmission: 0.9,
          opacity: 0.8,
          transparent: true,
          roughness: 0.1,
          ior: 1.33
        });
        const glass = new THREE.Mesh(glassGeom, glassMat);
        group.add(glass);
        break;
      }

      default: {
        const sphereGeom = new THREE.DodecahedronGeometry(0.75, 1);
        const sphereMat = shinyMat(foodItem.color || '#3B82F6', 0.3);
        const sphere = new THREE.Mesh(sphereGeom, sphereMat);
        group.add(sphere);
        break;
      }
    }

    // Glow halo ring
    const ringGeom = new THREE.RingGeometry(0.9, 1.05, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(foodItem.color || '#FFFFFF'),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.7;
    group.add(ring);

    group.userData = { foodItem, baseScale: 1.0, hoverScale: 1.25 };
    return group;
  }

  // เพิ่มวัตถุอาหารเข้าฉาก
  spawnFloatingFood(id, foodItem, worldPos) {
    if (!this.isInitialized) return null;
    this.removeFood(id);

    const meshGroup = this.createFoodMesh(foodItem);
    meshGroup.position.copy(worldPos);
    this.scene.add(meshGroup);
    this.foodMeshes.set(id, meshGroup);
    return meshGroup;
  }

  removeFood(id) {
    if (this.foodMeshes.has(id)) {
      const mesh = this.foodMeshes.get(id);
      this.scene.remove(mesh);
      this.foodMeshes.delete(id);
    }
  }

  clearAllFood() {
    this.foodMeshes.forEach(mesh => {
      this.scene.remove(mesh);
    });
    this.foodMeshes.clear();
  }

  // แปลงพิกัดหน้าจอ (Pixels) เป็นพิกัด 3D World (Three.js)
  screenToWorld(screenX, screenY, depthZ = 0) {
    if (!this.camera || !this.renderer) return new THREE.Vector3(0, 0, 0);
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    const ndcX = (screenX / width) * 2 - 1;
    const ndcY = -(screenY / height) * 2 + 1;

    const vector = new THREE.Vector3(ndcX, ndcY, 0.5);
    vector.unproject(this.camera);

    const dir = vector.sub(this.camera.position).normalize();
    const distance = (depthZ - this.camera.position.z) / dir.z;
    return this.camera.position.clone().add(dir.multiplyScalar(distance));
  }

  onResize() {
    if (!this.renderer || !this.camera || !this.container) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    const delta = this.clock ? this.clock.getDelta() : 0.016;
    const elapsedTime = this.clock ? this.clock.getElapsedTime() : 0;

    // Rotate and bob food meshes
    this.foodMeshes.forEach((mesh, id) => {
      mesh.rotation.y += delta * 1.2;
      mesh.rotation.x = Math.sin(elapsedTime * 2 + mesh.position.x) * 0.15;
      mesh.position.y += Math.sin(elapsedTime * 3 + mesh.position.x) * 0.005;
    });

    // Animate background magic sparkles
    if (this.particles) {
      this.particles.rotation.y += delta * 0.05;
      this.particles.rotation.x += delta * 0.02;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.clearAllFood();
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.remove();
    }
  }
}
