import * as THREE from 'three';
import type { PackageItem, ExecutionFrame } from '../../types/algorithm';

// ============================================================================
// PHOTOREALISTIC PROCEDURAL PBR TEXTURE GENERATORS (GROUNDED REAL-WORLD)
// ============================================================================

function createPhotorealisticConcreteFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Worn Industrial Polished Concrete Base
  ctx.fillStyle = '#262d3a';
  ctx.fillRect(0, 0, 1024, 1024);

  // Realistic Concrete Noise & Aggregate Speckles
  for (let i = 0; i < 25000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const shade = Math.floor(Math.random() * 40);
    ctx.fillStyle = `rgba(${35 + shade}, ${45 + shade}, ${60 + shade}, 0.18)`;
    ctx.fillRect(x, y, 2, 2);
  }

  // Concrete Slab Expansion Joints (Seams)
  ctx.strokeStyle = '#121824';
  ctx.lineWidth = 6;
  const tileSize = 256;
  for (let x = 0; x <= 1024; x += tileSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1024); ctx.stroke();
  }
  for (let y = 0; y <= 1024; y += tileSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke();
  }

  // Tire Skid Marks near AGV Lanes (Real-world warehouse wear)
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.45)';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(490, 100); ctx.lineTo(490, 900);
  ctx.moveTo(534, 100); ctx.lineTo(534, 900);
  ctx.stroke();

  // Worn Yellow Industrial Safety Hazard Borders
  ctx.fillStyle = '#d97706'; // Grounded warm safety amber
  ctx.fillRect(0, 0, 1024, 36);
  ctx.fillRect(0, 988, 1024, 36);

  ctx.fillStyle = '#121824';
  for (let i = -1024; i < 2048; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0); ctx.lineTo(i + 20, 0); ctx.lineTo(i - 10, 36); ctx.lineTo(i - 30, 36);
    ctx.closePath(); ctx.fill();

    ctx.beginPath();
    ctx.moveTo(i, 988); ctx.lineTo(i + 20, 988); ctx.lineTo(i - 10, 1024); ctx.lineTo(i - 30, 1024);
    ctx.closePath(); ctx.fill();
  }

  // AGV Safety Lane Markings
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 6;
  ctx.setLineDash([24, 16]);
  ctx.beginPath();
  ctx.moveTo(512, 45); ctx.lineTo(512, 979);
  ctx.stroke();

  // Painted Aisle Floor Markings
  ctx.setLineDash([]);
  ctx.font = '800 30px sans-serif';
  ctx.fillStyle = 'rgba(226, 232, 240, 0.7)';
  ctx.fillText('AISLE A-01', 110, 520);
  ctx.fillText('AISLE A-02', 750, 520);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

function createPhotorealisticCardboardTexture(accentHex: string = '#d97706'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Grounded Craft Brown Paper Base
  ctx.fillStyle = '#b5855c';
  ctx.fillRect(0, 0, 512, 512);

  // Corrugated Grain Lines
  for (let y = 0; y < 512; y += 3) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.fillRect(0, y, 512, 1.5);
  }

  // Sealing Tape Flaps
  ctx.fillStyle = 'rgba(241, 245, 249, 0.35)';
  ctx.fillRect(190, 0, 132, 512);
  ctx.fillStyle = 'rgba(160, 110, 60, 0.2)';
  ctx.fillRect(194, 0, 124, 512);

  // Realistic White Shipping Label Pouch
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(30, 100, 210, 170);

  // Barcode & Logistics Data
  ctx.fillStyle = '#0f172a';
  for (let x = 50; x < 225; x += Math.random() * 8 + 3) {
    const width = Math.random() > 0.4 ? 3.5 : 1.5;
    ctx.fillRect(x, 120, width, 65);
  }

  // QR Code Box
  ctx.fillRect(175, 195, 55, 55);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(185, 205, 16, 16);
  ctx.fillRect(203, 223, 16, 16);

  // Printed Handling Stamps
  ctx.font = '900 15px sans-serif';
  ctx.fillStyle = '#b91c1c';
  ctx.fillText('↑ THIS SIDE UP ↑', 50, 215);
  ctx.fillText('FRAGILE', 50, 240);

  // Category Color Accent Band
  ctx.fillStyle = accentHex;
  ctx.fillRect(0, 0, 512, 24);
  ctx.fillRect(0, 488, 512, 24);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function createPhotorealisticWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Weathered Timber Base
  ctx.fillStyle = '#875836';
  ctx.fillRect(0, 0, 512, 512);

  // Natural Wood Grain Streaks
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    ctx.fillRect(Math.random() * 512, 0, Math.random() * 3 + 1, 512);
  }

  // Plank Seams & Bevel Lines
  ctx.strokeStyle = '#422817';
  ctx.lineWidth = 6;
  for (let x = 0; x <= 512; x += 128) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
  }

  // Structural Cross Braces
  ctx.lineWidth = 12;
  ctx.strokeStyle = '#633c22';
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(512, 512); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(512, 0); ctx.lineTo(0, 512); ctx.stroke();

  // Steel Corner Band Guards & Rivets
  ctx.fillStyle = '#334155';
  ctx.fillRect(0, 0, 44, 512);
  ctx.fillRect(468, 0, 44, 512);
  ctx.fillRect(0, 0, 512, 44);
  ctx.fillRect(0, 468, 512, 44);

  ctx.fillStyle = '#94a3b8';
  [22, 256, 490].forEach(bx => {
    [22, 256, 490].forEach(by => {
      ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI * 2); ctx.fill();
    });
  });

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// ============================================================================
// ULTRA-REALISTIC WAREHOUSE SCENE CLASS
// ============================================================================

export class Warehouse3DScene {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private animFrameId: number | null = null;

  private packageMeshes: Map<number, THREE.Group> = new Map();
  private shelfMeshes: THREE.Group[] = [];
  private scannerLaser: THREE.Mesh | null = null;
  private scannerSpotlight: THREE.PointLight | null = null;
  private forklift: THREE.Group | null = null;
  private beaconLight: THREE.PointLight | null = null;

  private conveyorPackages: THREE.Mesh[] = [];
  private dustParticles: THREE.Points | null = null;

  private onPackageSelect?: (pkgId: number) => void;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  // Smooth Orbit Controls
  private isMouseDown = false;
  private mouseX = 0;
  private mouseY = 0;
  private targetRotationY = 0;
  private targetRotationX = 0.45;

  private floorTexture: THREE.CanvasTexture;
  private woodPalletTexture: THREE.CanvasTexture;
  private woodCrateTexture: THREE.CanvasTexture;
  private cardboardTextures: Map<string, THREE.CanvasTexture> = new Map();

  constructor(container: HTMLElement, onPackageSelect?: (pkgId: number) => void) {
    this.container = container;
    this.onPackageSelect = onPackageSelect;

    this.floorTexture = createPhotorealisticConcreteFloorTexture();
    this.woodPalletTexture = createPhotorealisticWoodTexture();
    this.woodCrateTexture = createPhotorealisticWoodTexture();

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x161b24); // Warm Industrial Atmosphere (NOT pitch black/neon void)
    this.scene.fog = new THREE.FogExp2(0x161b24, 0.012);

    // Camera
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500;
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    this.camera.position.set(0, 22, 38);
    this.camera.lookAt(0, 2, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    this.setSize(width, height);

    container.innerHTML = '';
    container.appendChild(this.renderer.domElement);

    // Build Realistic Environment
    this.setupNaturalLighting();
    this.setupWarehouseArchitecture();
    this.setupLoadingDockAndFreightTruck();
    this.setupConveyorBeltSystem();
    this.setupShelvesAndForklift();
    this.setupHumanEngineers();
    this.setupWarehouseClutterAndBollards();
    this.setupFloatingDustParticles();

    // Event Listeners
    window.addEventListener('resize', this.onWindowResize);
    this.container.addEventListener('pointerdown', this.onPointerDown);
    this.container.addEventListener('pointermove', this.onPointerMove);
    this.container.addEventListener('pointerup', this.onPointerUp);

    this.animate();
  }

  public setSize(width: number, height: number) {
    if (!this.renderer || !this.camera) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private setupNaturalLighting() {
    // Natural Grounded Warm LED Ambient Lighting (Temperature ~4500K Warm White)
    const ambientLight = new THREE.AmbientLight(0xfef3c7, 0.95);
    this.scene.add(ambientLight);

    // Main Overhead Industrial Sunlight
    const dirLight = new THREE.DirectionalLight(0xfffbeb, 2.3);
    dirLight.position.set(30, 50, 25);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 120;
    dirLight.shadow.camera.left = -35;
    dirLight.shadow.camera.right = 35;
    dirLight.shadow.camera.top = 35;
    dirLight.shadow.camera.bottom = -35;
    this.scene.add(dirLight);

    // High-Bay Overhead LED Spotlights with Soft Volumetric Light Cones
    const spotPositions = [
      [-14, -12], [14, -12],
      [-14, 12], [14, 12]
    ];

    spotPositions.forEach(([x, z]) => {
      const spot = new THREE.SpotLight(0x0284c7, 3.2, 45, Math.PI / 4, 0.4, 1);
      spot.position.set(x, 24, z);
      spot.castShadow = true;
      this.scene.add(spot);

      const coneGeo = new THREE.CylinderGeometry(0.5, 8.0, 24, 16, 1, true);
      const coneMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.05,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.set(x, 12, z);
      this.scene.add(cone);
    });

    this.scannerSpotlight = new THREE.PointLight(0x0284c7, 4.5, 30);
    this.scannerSpotlight.position.set(0, 14, 0);
    this.scene.add(this.scannerSpotlight);
  }

  private setupWarehouseArchitecture() {
    // Grounded Polished Concrete Floor
    const floorGeo = new THREE.PlaneGeometry(80, 80);
    const floorMat = new THREE.MeshStandardMaterial({
      map: this.floorTexture,
      roughness: 0.35,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Industrial Steel Wall Paneling
    const backWallGeo = new THREE.PlaneGeometry(80, 28);
    const backWallMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.6,
      metalness: 0.5,
    });
    const backWall = new THREE.Mesh(backWallGeo, backWallMat);
    backWall.position.set(0, 14, -40);
    backWall.receiveShadow = true;
    this.scene.add(backWall);

    // Steel Roof Trusses & Ventilation Lines
    const trussMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
    for (let z = -35; z <= 35; z += 17.5) {
      const trussGeo = new THREE.BoxGeometry(80, 1.4, 0.7);
      const truss = new THREE.Mesh(trussGeo, trussMat);
      truss.position.set(0, 25, z);
      this.scene.add(truss);
    }

    const ductGeo = new THREE.CylinderGeometry(1.2, 1.2, 80, 24);
    const ductMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.1 });
    const duct = new THREE.Mesh(ductGeo, ductMat);
    duct.rotation.z = Math.PI / 2;
    duct.position.set(0, 23, -20);
    this.scene.add(duct);
  }

  private setupLoadingDockAndFreightTruck() {
    // 2 Loading Dock Bay Doors on Back Wall
    const doorGeo = new THREE.BoxGeometry(12, 16, 0.4);
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.4 });

    const dockPositions = [-20, 20];
    dockPositions.forEach((xPos) => {
      const door = new THREE.Mesh(doorGeo, doorMat);
      door.position.set(xPos, 8, -39.6);
      this.scene.add(door);

      const bumperGeo = new THREE.BoxGeometry(1.2, 6, 0.8);
      const bumperMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 });

      const bumperLeft = new THREE.Mesh(bumperGeo, bumperMat);
      bumperLeft.position.set(xPos - 6.8, 3, -39.2);
      this.scene.add(bumperLeft);

      const bumperRight = new THREE.Mesh(bumperGeo, bumperMat);
      bumperRight.position.set(xPos + 6.8, 3, -39.2);
      this.scene.add(bumperRight);

      const signGeo = new THREE.BoxGeometry(6, 1.5, 0.3);
      const signMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, emissive: 0x0284c7, emissiveIntensity: 0.7 });
      const sign = new THREE.Mesh(signGeo, signMat);
      sign.position.set(xPos, 17.5, -39.4);
      this.scene.add(sign);
    });

    // Parked Freight Semi-Truck backing into Bay 01 (-20, 0, -28)
    const truckGroup = new THREE.Group();

    const trailerGeo = new THREE.BoxGeometry(9.0, 9.5, 20.0);
    const trailerMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, metalness: 0.2 });
    const trailer = new THREE.Mesh(trailerGeo, trailerMat);
    trailer.position.set(0, 5.5, -10.0);
    trailer.castShadow = true;
    truckGroup.add(trailer);

    const cabGeo = new THREE.BoxGeometry(8.6, 8.0, 6.5);
    const cabMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.7 });
    const cab = new THREE.Mesh(cabGeo, cabMat);
    cab.position.set(0, 4.8, -23.0);
    cab.castShadow = true;
    truckGroup.add(cab);

    const windshieldGeo = new THREE.BoxGeometry(8.0, 2.6, 0.2);
    const windshieldMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.9 });
    const windshield = new THREE.Mesh(windshieldGeo, windshieldMat);
    windshield.position.set(0, 6.2, -19.7);
    truckGroup.add(windshield);

    const wheelGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.8, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.95 });

    [-3, -7, -20, -24].forEach(z => {
      const wLeft = new THREE.Mesh(wheelGeo, wheelMat);
      wLeft.rotation.z = Math.PI / 2;
      wLeft.position.set(-4.5, 1.2, z);
      truckGroup.add(wLeft);

      const wRight = new THREE.Mesh(wheelGeo, wheelMat);
      wRight.rotation.z = Math.PI / 2;
      wRight.position.set(4.5, 1.2, z);
      truckGroup.add(wRight);
    });

    truckGroup.position.set(-20, 0, -28);
    this.scene.add(truckGroup);
  }

  private setupConveyorBeltSystem() {
    const conveyorGroup = new THREE.Group();

    const frameGeo = new THREE.BoxGeometry(40, 0.4, 2.5);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.set(0, 0.8, 16);
    conveyorGroup.add(frame);

    const legGeo = new THREE.BoxGeometry(0.3, 0.8, 2.3);
    for (let x = -18; x <= 18; x += 6) {
      const leg = new THREE.Mesh(legGeo, frameMat);
      leg.position.set(x, 0.4, 16);
      conveyorGroup.add(leg);
    }

    const rollerGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.4, 12);
    const rollerMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.1 });
    for (let x = -19.5; x <= 19.5; x += 0.8) {
      const roller = new THREE.Mesh(rollerGeo, rollerMat);
      roller.rotation.x = Math.PI / 2;
      roller.position.set(x, 1.05, 16);
      conveyorGroup.add(roller);
    }

    const boxGeo = new THREE.BoxGeometry(1.2, 1.0, 1.2);
    const boxMat = new THREE.MeshStandardMaterial({ map: createPhotorealisticCardboardTexture('#0284c7'), roughness: 0.6 });

    for (let i = 0; i < 5; i++) {
      const pBox = new THREE.Mesh(boxGeo, boxMat);
      pBox.position.set(-15 + i * 8, 1.6, 16);
      pBox.castShadow = true;
      conveyorGroup.add(pBox);
      this.conveyorPackages.push(pBox);
    }

    this.scene.add(conveyorGroup);
  }

  private setupShelvesAndForklift() {
    for (let aisle = -2; aisle <= 2; aisle += 2) {
      for (let shelfZ = -16; shelfZ <= 12; shelfZ += 4.5) {
        const rackGroup = this.createSteelRackStructure();
        rackGroup.position.set(aisle * 4.8, 0, shelfZ);
        this.scene.add(rackGroup);
        this.shelfMeshes.push(rackGroup);
      }
    }

    // High-Detail Autonomous Guided Vehicle (AGV Forklift Robot)
    const forkliftGroup = new THREE.Group();

    const bodyGeo = new THREE.BoxGeometry(3.0, 1.3, 4.4);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.65, roughness: 0.3 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.9;
    body.castShadow = true;
    forkliftGroup.add(body);

    const wheelGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.45, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.95 });

    [[-1.4, 0.55, 1.5], [1.4, 0.55, 1.5], [-1.4, 0.55, -1.5], [1.4, 0.55, -1.5]].forEach(([x, y, z]) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, y, z);
      wheel.castShadow = true;
      forkliftGroup.add(wheel);
    });

    const mastGeo = new THREE.BoxGeometry(0.22, 3.8, 0.22);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 });
    const mastLeft = new THREE.Mesh(mastGeo, mastMat);
    mastLeft.position.set(-0.9, 2.2, 2.2);
    forkliftGroup.add(mastLeft);

    const mastRight = new THREE.Mesh(mastGeo, mastMat);
    mastRight.position.set(0.9, 2.2, 2.2);
    forkliftGroup.add(mastRight);

    const forkGeo = new THREE.BoxGeometry(2.2, 0.1, 2.4);
    const forkMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95 });
    const fork = new THREE.Mesh(forkGeo, forkMat);
    fork.position.set(0, 0.6, 3.0);
    fork.castShadow = true;
    forkliftGroup.add(fork);

    const cargoOnFork = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 1.4, 1.6),
      new THREE.MeshStandardMaterial({ map: this.woodCrateTexture, roughness: 0.7 })
    );
    cargoOnFork.position.set(0, 1.45, 3.0);
    cargoOnFork.castShadow = true;
    forkliftGroup.add(cargoOnFork);

    const beaconGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.45, 12);
    const beaconMat = new THREE.MeshStandardMaterial({ color: 0xd97706, emissive: 0xd97706, emissiveIntensity: 0.9 });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(0, 1.8, -1.3);
    forkliftGroup.add(beacon);

    this.beaconLight = new THREE.PointLight(0xd97706, 2.5, 10);
    this.beaconLight.position.set(0, 2.0, -1.3);
    forkliftGroup.add(this.beaconLight);

    const headLightLeft = new THREE.SpotLight(0xffffff, 3.5, 22, Math.PI / 6, 0.3);
    headLightLeft.position.set(-1.1, 1.3, 2.3);
    headLightLeft.target.position.set(-1.1, 0.5, 12);
    forkliftGroup.add(headLightLeft);
    forkliftGroup.add(headLightLeft.target);

    forkliftGroup.position.set(-9, 0, 8);
    this.scene.add(forkliftGroup);
    this.forklift = forkliftGroup;

    const laserGeo = new THREE.PlaneGeometry(18, 0.3);
    const laserMat = new THREE.MeshBasicMaterial({ color: 0x0284c7, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
    const laser = new THREE.Mesh(laserGeo, laserMat);
    laser.rotation.x = Math.PI / 2;
    laser.position.set(0, 2.8, 0);
    this.scene.add(laser);
    this.scannerLaser = laser;
  }

  private createSteelRackStructure(): THREE.Group {
    const rackGroup = new THREE.Group();

    const postGeo = new THREE.BoxGeometry(0.16, 4.5, 0.16);
    const postMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a, // Metallic Industrial Blue Frame
      metalness: 0.85,
      roughness: 0.25,
    });

    const positions = [[-1.2, 0.85], [1.2, 0.85], [-1.2, -0.85], [1.2, -0.85]];
    positions.forEach(([x, z]) => {
      const post = new THREE.Mesh(postGeo, postMat);
      post.position.set(x, 2.25, z);
      post.castShadow = true;
      post.receiveShadow = true;
      rackGroup.add(post);
    });

    const beamMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.7,
      roughness: 0.35,
    });

    const shelfLevels = [0.2, 1.9, 3.6];
    const palletMat = new THREE.MeshStandardMaterial({ map: this.woodPalletTexture, roughness: 0.8 });

    shelfLevels.forEach((yLevel) => {
      const longBeamGeo = new THREE.BoxGeometry(2.5, 0.12, 0.08);
      const frontBeam = new THREE.Mesh(longBeamGeo, beamMat);
      frontBeam.position.set(0, yLevel, 0.85);
      rackGroup.add(frontBeam);

      const backBeam = new THREE.Mesh(longBeamGeo, beamMat);
      backBeam.position.set(0, yLevel, -0.85);
      rackGroup.add(backBeam);

      const palletGeo = new THREE.BoxGeometry(2.3, 0.12, 1.6);
      const pallet = new THREE.Mesh(palletGeo, palletMat);
      pallet.position.set(0, yLevel + 0.06, 0);
      pallet.castShadow = true;
      pallet.receiveShadow = true;
      rackGroup.add(pallet);
    });

    return rackGroup;
  }

  private setupHumanEngineers() {
    const engineerPositions = [[10, 0, 8], [-12, 0, -4]];

    const shirtMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.7 });
    const hatMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.3 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.6 });

    engineerPositions.forEach(([x, y, z]) => {
      const engineer = new THREE.Group();

      const legLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.4, 8), pantsMat);
      legLeft.position.set(-0.25, 0.7, 0);
      engineer.add(legLeft);

      const legRight = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.4, 8), pantsMat);
      legRight.position.set(0.25, 0.7, 0);
      engineer.add(legRight);

      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.3, 0.5), shirtMat);
      torso.position.set(0, 2.05, 0);
      engineer.add(torso);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), skinMat);
      head.position.set(0, 2.9, 0);
      engineer.add(head);

      const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.38, 0.2, 12), hatMat);
      hat.position.set(0, 3.15, 0);
      engineer.add(hat);

      const tablet = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 0.5), new THREE.MeshBasicMaterial({ color: 0x0284c7 }));
      tablet.position.set(0.3, 2.0, 0.4);
      engineer.add(tablet);

      engineer.position.set(x, y, z);
      this.scene.add(engineer);
    });
  }

  private setupWarehouseClutterAndBollards() {
    // Corner Safety Bollards
    const bollardGeo = new THREE.CylinderGeometry(0.16, 0.16, 1.2, 16);
    const bollardMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 });

    [-10, 10].forEach(x => {
      [-14, 10].forEach(z => {
        const bollard = new THREE.Mesh(bollardGeo, bollardMat);
        bollard.position.set(x, 0.6, z);
        bollard.castShadow = true;
        this.scene.add(bollard);
      });
    });

    // Fire Extinguisher Posts
    const extGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.1, 12);
    const extMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3 });

    const ext1 = new THREE.Mesh(extGeo, extMat);
    ext1.position.set(-18, 2.0, -39.0);
    this.scene.add(ext1);

    const ext2 = new THREE.Mesh(extGeo, extMat);
    ext2.position.set(18, 2.0, -39.0);
    this.scene.add(ext2);
  }

  private setupFloatingDustParticles() {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 60;
      positions[i + 1] = Math.random() * 20 + 2;
      positions[i + 2] = (Math.random() - 0.5) * 60;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xfef3c7,
      size: 0.15,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });

    this.dustParticles = new THREE.Points(geometry, material);
    this.scene.add(this.dustParticles);
  }

  private getCardboardTexture(colorHex: string): THREE.CanvasTexture {
    if (!this.cardboardTextures.has(colorHex)) {
      this.cardboardTextures.set(colorHex, createPhotorealisticCardboardTexture(colorHex));
    }
    return this.cardboardTextures.get(colorHex)!;
  }

  public updatePackages(packages: PackageItem[]) {
    this.packageMeshes.forEach(group => this.scene.remove(group));
    this.packageMeshes.clear();

    const cols = Math.ceil(Math.sqrt(packages.length));
    const spacing = 2.5;

    packages.forEach((pkg, idx) => {
      const group = new THREE.Group();
      const row = Math.floor(idx / cols);
      const col = idx % cols;

      const posX = (col - cols / 2) * spacing;
      const posZ = (row - cols / 2) * spacing;
      group.position.set(posX, 1.7, posZ);

      const isWoodCrate = idx % 5 === 0;
      const boxGeo = new THREE.BoxGeometry(1.6, 1.4, 1.6);
      const statusColorHex = pkg.status === 'FOUND' ? '#10b981' : pkg.status === 'INSPECTING' ? '#0284c7' : pkg.status === 'ELIMINATED' ? '#334155' : '#d97706';

      const boxMat = new THREE.MeshStandardMaterial({
        map: isWoodCrate ? this.woodCrateTexture : this.getCardboardTexture(statusColorHex),
        roughness: isWoodCrate ? 0.8 : 0.6,
        metalness: isWoodCrate ? 0.3 : 0.1,
      });

      const box = new THREE.Mesh(boxGeo, boxMat);
      box.castShadow = true;
      box.receiveShadow = true;
      box.userData = { packageId: pkg.id };
      group.add(box);

      const wrapGeo = new THREE.BoxGeometry(1.64, 1.44, 1.64);
      const wrapMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.15,
        roughness: 0.1,
        clearcoat: 1.0,
      });
      const wrap = new THREE.Mesh(wrapGeo, wrapMat);
      group.add(wrap);

      const ringGeo = new THREE.RingGeometry(0.9, 1.2, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x0284c7, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -0.65;
      group.add(ring);

      this.scene.add(group);
      this.packageMeshes.set(pkg.id, group);
    });
  }

  public renderExecutionFrame(frame: ExecutionFrame, packages: PackageItem[]) {
    packages.forEach((pkg, idx) => {
      const group = this.packageMeshes.get(pkg.id);
      if (!group) return;

      const isInspected = frame.inspectedIndices.includes(idx);
      const isEliminated = frame.eliminatedIndices.includes(idx);
      const isMatch = frame.highlightPackageId === pkg.id && frame.message.includes('MATCH FOUND');

      const boxMesh = group.children[0] as THREE.Mesh;
      const auraRing = group.children[2] as THREE.Mesh;

      if (boxMesh && boxMesh.material) {
        const mat = boxMesh.material as THREE.MeshStandardMaterial;

        if (isMatch) {
          mat.emissive.setHex(0x10b981);
          mat.emissiveIntensity = 0.95;
          group.position.y = 3.4;

          if (auraRing && auraRing.material) {
            (auraRing.material as THREE.MeshBasicMaterial).color.setHex(0x10b981);
            (auraRing.material as THREE.MeshBasicMaterial).opacity = 0.95;
          }

          this.camera.position.x = group.position.x * 0.4;
          this.camera.position.z = group.position.z + 16;
          this.camera.lookAt(group.position.x, 2, group.position.z);
        } else if (isInspected) {
          mat.emissive.setHex(0x0284c7);
          mat.emissiveIntensity = 0.75;
          group.position.y = 2.4;

          if (auraRing && auraRing.material) {
            (auraRing.material as THREE.MeshBasicMaterial).color.setHex(0x0284c7);
            (auraRing.material as THREE.MeshBasicMaterial).opacity = 0.85;
          }

          if (this.scannerLaser) {
            this.scannerLaser.position.set(group.position.x, 2.8, group.position.z);
          }
          if (this.scannerSpotlight) {
            this.scannerSpotlight.position.set(group.position.x, 12, group.position.z);
          }
        } else if (isEliminated) {
          mat.emissive.setHex(0x0f172a);
          mat.emissiveIntensity = 0.05;
          group.position.y = 1.3;

          if (auraRing && auraRing.material) {
            (auraRing.material as THREE.MeshBasicMaterial).opacity = 0.1;
          }
        }
      }
    });
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
      const pkgId = intersect.object.userData?.packageId;
      if (pkgId && this.onPackageSelect) {
        this.onPackageSelect(pkgId);
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
    const height = this.container.clientHeight || 500;
    this.setSize(width, height);
  };

  private animate = () => {
    this.animFrameId = requestAnimationFrame(this.animate);

    const radius = 38;
    this.camera.position.x = radius * Math.sin(this.targetRotationY) * Math.cos(this.targetRotationX);
    this.camera.position.z = radius * Math.cos(this.targetRotationY) * Math.cos(this.targetRotationX);
    this.camera.position.y = radius * Math.sin(this.targetRotationX);
    this.camera.lookAt(0, 2, 0);

    this.conveyorPackages.forEach(pBox => {
      pBox.position.x += 0.04;
      if (pBox.position.x > 18) {
        pBox.position.x = -18;
      }
    });

    if (this.forklift) {
      this.forklift.position.x += Math.sin(Date.now() * 0.001) * 0.035;
    }
    if (this.beaconLight) {
      this.beaconLight.intensity = 1.8 + Math.sin(Date.now() * 0.012) * 1.2;
    }

    if (this.dustParticles) {
      const positions = this.dustParticles.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= 0.02;
        if (positions[i] < 0) positions[i] = 22;
      }
      this.dustParticles.geometry.attributes.position.needsUpdate = true;
    }

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
