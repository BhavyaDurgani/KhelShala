import * as THREE from 'three';
import type { Sector, AttackGraph } from '../../types/cyber';

// ============================================================================
// ULTRA-REALISTIC PROCEDURAL CITY TEXTURE GENERATORS
// ============================================================================

function createAsphaltRoadTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Dark asphalt surface base
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, 1024, 1024);

  // Asphalt grain texture
  for (let i = 0; i < 18000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const shade = Math.floor(Math.random() * 25);
    ctx.fillStyle = `rgba(${20 + shade}, ${28 + shade}, ${45 + shade}, 0.15)`;
    ctx.fillRect(x, y, 2, 2);
  }

  // 4-Lane City Street Grid
  const streetW = 140;
  ctx.fillStyle = '#090d16';

  // Vertical Avenues
  ctx.fillRect(160, 0, streetW, 1024);
  ctx.fillRect(724, 0, streetW, 1024);

  // Horizontal Streets
  ctx.fillRect(0, 160, 1024, streetW);
  ctx.fillRect(0, 724, 1024, streetW);

  // Double Yellow Center Lines
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 4;
  ctx.setLineDash([24, 16]);

  ctx.beginPath();
  ctx.moveTo(226, 0); ctx.lineTo(226, 1024);
  ctx.moveTo(234, 0); ctx.lineTo(234, 1024);

  ctx.moveTo(790, 0); ctx.lineTo(790, 1024);
  ctx.moveTo(798, 0); ctx.lineTo(798, 1024);
  ctx.stroke();

  ctx.strokeStyle = '#38bdf8';
  ctx.beginPath();
  ctx.moveTo(0, 226); ctx.lineTo(1024, 226);
  ctx.moveTo(0, 234); ctx.lineTo(1024, 234);

  ctx.moveTo(0, 790); ctx.lineTo(1024, 790);
  ctx.moveTo(0, 798); ctx.lineTo(1024, 798);
  ctx.stroke();

  // White Crosswalk Stripes
  ctx.setLineDash([]);
  ctx.fillStyle = '#e2e8f0';
  for (let x = 168; x < 290; x += 18) {
    ctx.fillRect(x, 130, 8, 26);
    ctx.fillRect(x, 304, 8, 26);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

function createBuildingWindowTexture(glowHex: string = '#06b6d4'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Dark Architectural Facade Base
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 512, 512);

  // Window Grid
  const cols = 16;
  const rows = 20;
  const cellW = 512 / cols;
  const cellH = 512 / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isLit = Math.random() > 0.4;
      if (isLit) {
        ctx.fillStyle = Math.random() > 0.75 ? '#38bdf8' : glowHex;
        ctx.fillRect(c * cellW + 4, r * cellH + 4, cellW - 8, cellH - 8);
      } else {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(c * cellW + 4, r * cellH + 4, cellW - 8, cellH - 8);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// ============================================================================
// ULTRA-REALISTIC 3D CYBER CRIME CITY SCENE ENGINE
// ============================================================================

export class CyberCity3DScene {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private animFrameId: number | null = null;

  private sectorMeshes: Map<string, THREE.Group> = new Map();
  private shieldMeshes: Map<string, THREE.Mesh> = new Map();
  private attackBeams: THREE.Line[] = [];

  // Living City Elements (Cars, Drones, Streetlights)
  private trafficVehicles: THREE.Group[] = [];
  private droneUnits: THREE.Group[] = [];

  private onSectorSelect?: (sectorId: string) => void;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  // Mouse Orbit Controls State
  private isMouseDown = false;
  private mouseX = 0;
  private mouseY = 0;
  private targetRotationY = 0;
  private targetRotationX = 0.55;

  private roadTexture: THREE.CanvasTexture;
  private windowTextureCyan: THREE.CanvasTexture;
  private windowTextureMagenta: THREE.CanvasTexture;

  constructor(container: HTMLElement, onSectorSelect?: (sectorId: string) => void) {
    this.container = container;
    this.onSectorSelect = onSectorSelect;

    this.roadTexture = createAsphaltRoadTexture();
    this.windowTextureCyan = createBuildingWindowTexture('#06b6d4');
    this.windowTextureMagenta = createBuildingWindowTexture('#f43f5e');

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f172a); // Deep Twilight Slate Blue (Real-world evening city)
    this.scene.fog = new THREE.FogExp2(0x0f172a, 0.012);

    // Camera
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 520;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 24, 38);
    this.camera.lookAt(0, 2, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;

    container.innerHTML = '';
    container.appendChild(this.renderer.domElement);

    // Build City Environment
    this.setupLighting();
    this.setupCityGridFloor();
    this.setupBackgroundSkyscrapers();
    this.setupStreetlights();
    this.setupRoadTrafficVehicles();
    this.setupSecurityDrones();

    // Event Listeners
    window.addEventListener('resize', this.onWindowResize);
    this.container.addEventListener('pointerdown', this.onPointerDown);
    this.container.addEventListener('pointermove', this.onPointerMove);
    this.container.addEventListener('pointerup', this.onPointerUp);

    this.animate();
  }

  private setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.9);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(30, 50, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    this.scene.add(dirLight);

    const cyanPointLight = new THREE.PointLight(0x06b6d4, 6, 60);
    cyanPointLight.position.set(-18, 20, 12);
    this.scene.add(cyanPointLight);

    const magentaPointLight = new THREE.PointLight(0xec4899, 6, 60);
    magentaPointLight.position.set(18, 20, -12);
    this.scene.add(magentaPointLight);
  }

  private setupCityGridFloor() {
    // Asphalt Road Network Floor
    const planeGeo = new THREE.PlaneGeometry(90, 90);
    const planeMat = new THREE.MeshStandardMaterial({
      map: this.roadTexture,
      roughness: 0.35,
      metalness: 0.25,
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0;
    plane.receiveShadow = true;
    this.scene.add(plane);
  }

  private setupBackgroundSkyscrapers() {
    const buildingGroup = new THREE.Group();

    for (let i = 0; i < 40; i++) {
      const h = 12 + Math.random() * 26;
      const w = 4.0 + Math.random() * 5.0;
      const d = 4.0 + Math.random() * 5.0;

      const windowTex = i % 2 === 0 ? this.windowTextureCyan : this.windowTextureMagenta;
      const mat = new THREE.MeshStandardMaterial({
        map: windowTex,
        roughness: 0.25,
        metalness: 0.75,
      });

      const geo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geo, mat);

      const radius = 55 + Math.random() * 25;
      const angle = Math.random() * Math.PI * 2;
      mesh.position.set(Math.cos(angle) * radius, h / 2, Math.sin(angle) * radius);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Rooftop Helipad & Antenna Tower
      const roofGeo = new THREE.CylinderGeometry(w * 0.35, w * 0.35, 0.5, 16);
      const roofMat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x06b6d4 : 0xf43f5e });
      const roofPad = new THREE.Mesh(roofGeo, roofMat);
      roofPad.position.y = h / 2 + 0.25;
      mesh.add(roofPad);

      const antennaGeo = new THREE.CylinderGeometry(0.08, 0.08, 4.5, 8);
      const antennaMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95 });
      const antenna = new THREE.Mesh(antennaGeo, antennaMat);
      antenna.position.y = h / 2 + 2.5;
      mesh.add(antenna);

      buildingGroup.add(mesh);
    }
    this.scene.add(buildingGroup);
  }

  private setupStreetlights() {
    // Street Lamp Posts lining city sidewalks
    const lampMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 });
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

    const lampPositions = [
      [-12, -12], [12, -12], [-12, 12], [12, 12],
      [-22, -8], [22, -8], [-22, 8], [22, 8]
    ];

    lampPositions.forEach(([x, z]) => {
      const lampGroup = new THREE.Group();

      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 5, 12), lampMat);
      pole.position.y = 2.5;
      lampGroup.add(pole);

      const arm = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.1), lampMat);
      arm.position.set(0.5, 4.9, 0);
      lampGroup.add(arm);

      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), bulbMat);
      bulb.position.set(1.0, 4.7, 0);
      lampGroup.add(bulb);

      const light = new THREE.SpotLight(0xfef08a, 2.5, 18, Math.PI / 4, 0.4);
      light.position.set(1.0, 4.6, 0);
      light.target.position.set(1.0, 0, 0);
      lampGroup.add(light);
      lampGroup.add(light.target);

      lampGroup.position.set(x, 0, z);
      this.scene.add(lampGroup);
    });
  }

  private setupRoadTrafficVehicles() {
    // Vehicles moving along street lanes
    const carColors = [0x38bdf8, 0xf43f5e, 0xf59e0b, 0x10b981, 0x94a3b8];

    for (let i = 0; i < 8; i++) {
      const car = new THREE.Group();

      // Car Body
      const bodyGeo = new THREE.BoxGeometry(1.6, 0.8, 3.2);
      const bodyMat = new THREE.MeshStandardMaterial({ color: carColors[i % carColors.length], metalness: 0.8, roughness: 0.2 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = 0.5;
      body.castShadow = true;
      car.add(body);

      // Cabin Glass
      const cabinGeo = new THREE.BoxGeometry(1.3, 0.6, 1.6);
      const cabinMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.9 });
      const cabin = new THREE.Mesh(cabinGeo, cabinMat);
      cabin.position.set(0, 1.0, -0.2);
      car.add(cabin);

      // Headlights & Taillights
      const headlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const hlLeft = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), headlightMat);
      hlLeft.position.set(-0.6, 0.5, 1.6);
      car.add(hlLeft);

      const hlRight = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), headlightMat);
      hlRight.position.set(0.6, 0.5, 1.6);
      car.add(hlRight);

      const tailMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const tlLeft = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), tailMat);
      tlLeft.position.set(-0.6, 0.5, -1.6);
      car.add(tlLeft);

      const tlRight = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), tailMat);
      tlRight.position.set(0.6, 0.5, -1.6);
      car.add(tlRight);

      // Position along avenues
      car.position.set(-14 + (i % 2 === 0 ? 0 : 28), 0, -30 + i * 8);
      this.scene.add(car);
      this.trafficVehicles.push(car);
    }
  }

  private setupSecurityDrones() {
    this.droneUnits.forEach(d => this.scene.remove(d));
    this.droneUnits = [];

    for (let i = 0; i < 6; i++) {
      const drone = new THREE.Group();

      const bodyGeo = new THREE.SphereGeometry(0.5, 16, 16);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.95, roughness: 0.1 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      drone.add(body);

      // Rotators
      const rotorGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.05, 12);
      const rotorMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true });

      const rLeft = new THREE.Mesh(rotorGeo, rotorMat);
      rLeft.position.set(-0.7, 0.2, 0);
      drone.add(rLeft);

      const rRight = new THREE.Mesh(rotorGeo, rotorMat);
      rRight.position.set(0.7, 0.2, 0);
      drone.add(rRight);

      // Searchlight Spotlight
      const spot = new THREE.SpotLight(0x06b6d4, 4, 18, Math.PI / 5, 0.4);
      spot.position.set(0, 0, 0);
      spot.target.position.set(0, -12, 0);
      drone.add(spot);
      drone.add(spot.target);

      drone.position.set((Math.random() - 0.5) * 30, 5 + Math.random() * 4, (Math.random() - 0.5) * 30);
      this.scene.add(drone);
      this.droneUnits.push(drone);
    }
  }

  public updateSectors(sectors: Sector[]) {
    this.sectorMeshes.forEach(group => this.scene.remove(group));
    this.sectorMeshes.clear();
    this.shieldMeshes.clear();

    sectors.forEach(sector => {
      const group = new THREE.Group();
      group.position.set(sector.x, sector.y, sector.z);

      const statusColorHex = sector.status === 'CRITICAL' ? 0xf43f5e : sector.status === 'WARNING' ? 0xf59e0b : 0x06b6d4;

      // Build Real-World Sector Specific Architecture!
      if (sector.id.includes('health') || sector.name.toLowerCase().includes('hospital')) {
        // Municipal Hospital (Medical Glass Atrium + Red Cross Beacon + Helipad)
        const bldgGeo = new THREE.BoxGeometry(5.2, 8.5, 5.2);
        const bldgMat = new THREE.MeshStandardMaterial({ map: this.windowTextureCyan, roughness: 0.2, metalness: 0.8 });
        const bldg = new THREE.Mesh(bldgGeo, bldgMat);
        bldg.position.y = 4.25;
        bldg.userData = { sectorId: sector.id };
        group.add(bldg);

        // Glowing Red Cross Sign Badge
        const crossH = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.6, 0.3), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
        crossH.position.set(0, 7.5, 2.7);
        group.add(crossH);

        const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.2, 0.3), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
        crossV.position.set(0, 7.5, 2.7);
        group.add(crossV);

      } else if (sector.id.includes('finance') || sector.name.toLowerCase().includes('bank')) {
        // Central Bank Cathedral (Classic Pillars + Gold Trim + Glass Vault)
        const bldgGeo = new THREE.BoxGeometry(5.5, 7.5, 5.5);
        const bldgMat = new THREE.MeshStandardMaterial({ map: this.windowTextureMagenta, roughness: 0.3, metalness: 0.7 });
        const bldg = new THREE.Mesh(bldgGeo, bldgMat);
        bldg.position.y = 3.75;
        bldg.userData = { sectorId: sector.id };
        group.add(bldg);

        // Neoclassical Columns
        const pillarGeo = new THREE.CylinderGeometry(0.3, 0.3, 6, 16);
        const pillarMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });
        for (let x = -2.0; x <= 2.0; x += 1.3) {
          const pillar = new THREE.Mesh(pillarGeo, pillarMat);
          pillar.position.set(x, 3.0, 2.9);
          group.add(pillar);
        }

      } else if (sector.id.includes('power') || sector.name.toLowerCase().includes('grid')) {
        // Smart Power Substation (Transformer Coils + High Tension Towers)
        const baseGeo = new THREE.BoxGeometry(5.0, 2.0, 5.0);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.y = 1.0;
        base.userData = { sectorId: sector.id };
        group.add(base);

        // High Voltage Transformer Coils
        const coilGeo = new THREE.CylinderGeometry(0.8, 0.8, 4.0, 16);
        const coilMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.9, roughness: 0.1 });
        const coilLeft = new THREE.Mesh(coilGeo, coilMat);
        coilLeft.position.set(-1.5, 3.0, 0);
        group.add(coilLeft);

        const coilRight = new THREE.Mesh(coilGeo, coilMat);
        coilRight.position.set(1.5, 3.0, 0);
        group.add(coilRight);

      } else {
        // Standard Municipal Command Tower
        const bldgGeo = new THREE.BoxGeometry(4.8, 8.0, 4.8);
        const bldgMat = new THREE.MeshStandardMaterial({ map: this.windowTextureCyan, roughness: 0.3, metalness: 0.8 });
        const bldg = new THREE.Mesh(bldgGeo, bldgMat);
        bldg.position.y = 4.0;
        bldg.userData = { sectorId: sector.id };
        group.add(bldg);
      }

      // Rooftop Beacon Light Lens
      const beaconGeo = new THREE.SphereGeometry(0.8, 16, 16);
      const beaconMat = new THREE.MeshStandardMaterial({ color: statusColorHex, emissive: statusColorHex, emissiveIntensity: 0.9 });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.y = 9.0;
      group.add(beacon);

      const beaconLight = new THREE.PointLight(statusColorHex, 4.5, 18);
      beaconLight.position.y = 9.5;
      group.add(beaconLight);

      // Base Security Pedestal
      const baseGeo = new THREE.BoxGeometry(6.0, 0.4, 6.0);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.25 });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = 0.2;
      group.add(baseMesh);

      // Holographic Shield Dome
      if (sector.deployedControlIds.length > 0) {
        const shieldGeo = new THREE.SphereGeometry(4.8, 32, 32);
        const shieldMat = new THREE.MeshBasicMaterial({
          color: 0x10b981,
          wireframe: true,
          transparent: true,
          opacity: 0.65,
        });
        const shield = new THREE.Mesh(shieldGeo, shieldMat);
        shield.position.y = 4.0;
        group.add(shield);
        this.shieldMeshes.set(sector.id, shield);
      }

      this.scene.add(group);
      this.sectorMeshes.set(sector.id, group);
    });
  }

  public updateAttackGraph(attackGraph: AttackGraph) {
    this.attackBeams.forEach(beam => this.scene.remove(beam));
    this.attackBeams = [];

    attackGraph.edges.forEach(edge => {
      const sourceNode = attackGraph.nodes.find(n => n.id === edge.source);
      const targetNode = attackGraph.nodes.find(n => n.id === edge.target);

      if (sourceNode && targetNode) {
        const points = [
          new THREE.Vector3(...sourceNode.position3D),
          new THREE.Vector3(...targetNode.position3D),
        ];

        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const lineColor = targetNode.status === 'BLOCKED' ? 0x10b981 : targetNode.status === 'EXECUTED' ? 0xf43f5e : 0x06b6d4;
        const lineMat = new THREE.LineBasicMaterial({ color: lineColor, linewidth: 3 });
        const line = new THREE.Line(lineGeo, lineMat);

        this.scene.add(line);
        this.attackBeams.push(line);
      }
    });
  }

  public triggerCinematicCameraIntro() {
    let t = 0;
    const startPos = new THREE.Vector3(0, 45, 55);
    const targetPos = new THREE.Vector3(0, 24, 38);

    const animateCamera = () => {
      t += 0.02;
      if (t <= 1.0) {
        this.camera.position.lerpVectors(startPos, targetPos, t);
        this.camera.lookAt(0, 2, 0);
        requestAnimationFrame(animateCamera);
      }
    };
    animateCamera();
  }

  private onPointerDown = (event: MouseEvent) => {
    this.isMouseDown = true;
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    for (const intersect of intersects) {
      const sectorId = intersect.object.userData?.sectorId;
      if (sectorId && this.onSectorSelect) {
        this.onSectorSelect(sectorId);
        break;
      }
    }
  };

  private onPointerMove = (event: MouseEvent) => {
    if (!this.isMouseDown) return;

    const deltaX = event.clientX - this.mouseX;
    const deltaY = event.clientY - this.mouseY;

    this.targetRotationY += deltaX * 0.005;
    this.targetRotationX = Math.max(0.1, Math.min(1.2, this.targetRotationX + deltaY * 0.005));

    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  };

  private onPointerUp = () => {
    this.isMouseDown = false;
  };

  private onWindowResize = () => {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight || 520;
    this.setSize(width, height);
  };

  public setSize(width: number, height: number) {
    if (!this.renderer || !this.camera) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private animate = () => {
    this.animFrameId = requestAnimationFrame(this.animate);

    // Smooth Orbit Camera Interpolation
    const radius = 38;
    this.camera.position.x = radius * Math.sin(this.targetRotationY) * Math.cos(this.targetRotationX);
    this.camera.position.z = radius * Math.cos(this.targetRotationY) * Math.cos(this.targetRotationX);
    this.camera.position.y = radius * Math.sin(this.targetRotationX);
    this.camera.lookAt(0, 2, 0);

    // Move Road Vehicles
    this.trafficVehicles.forEach((car) => {
      car.position.z += 0.12;
      if (car.position.z > 35) {
        car.position.z = -35;
      }
    });

    // Patrol Drones
    this.droneUnits.forEach((drone, idx) => {
      drone.position.x += Math.cos(Date.now() * 0.001 + idx) * 0.035;
      drone.position.z += Math.sin(Date.now() * 0.001 + idx) * 0.035;
    });

    this.renderer.render(this.scene, this.camera);
  };

  public destroy() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    window.removeEventListener('resize', this.onWindowResize);
    if (this.container) {
      this.container.removeEventListener('pointerdown', this.onPointerDown);
      this.container.removeEventListener('pointermove', this.onPointerMove);
      this.container.removeEventListener('pointerup', this.onPointerUp);
      this.container.innerHTML = '';
    }
    this.renderer.dispose();
  }
}
