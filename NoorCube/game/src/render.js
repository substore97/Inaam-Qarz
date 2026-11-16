// Noor Cube — everything that is drawn in 3D.
// The Stage owns the scene and animates what the rules (logic.js) decide.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { makeTextures } from './textures.js';
import {
  T_VOID, T_WELL, T_LANT, T_SHADOW, T_FRAG, T_ICE, T_SPIN, T_TELE,
  DX, DY, rollFaces, spinFaces, facesToArray,
} from './logic.js';

const CUBE = 0.86; // cube edge; tiles are 1 apart
const HALF = CUBE / 2;
const TILE_H = 0.3;

// index = colour mask (R=1, G=2, B=4)
export const LIGHT_HEX = [0x56607a, 0xff2f47, 0x2bea6e, 0xffd43a, 0x3a8cff, 0xf04dff, 0x2ee6ee, 0xffffff];

export const THEMES = [
  { top: 0x140c2e, mid: 0x5b2f6b, bottom: 0xff9a70, glow: 0xffc890, tileA: 0xf0e2cf, tileB: 0xdcc7ad, under: 0x7a5368, sun: 0xfff0dc, hemi: 0xffd9c2 },
  { top: 0x04162a, mid: 0x0f4d6e, bottom: 0x35cfc6, glow: 0x9dfff0, tileA: 0xe6f0f2, tileB: 0xc7dbe2, under: 0x2a5b74, sun: 0xf2fbff, hemi: 0xbfeeff },
  { top: 0x050824, mid: 0x1c2a72, bottom: 0x8672f5, glow: 0xc9b8ff, tileA: 0xe2e2f5, tileB: 0xc8c9ea, under: 0x34357a, sun: 0xf3f0ff, hemi: 0xc9ccff },
  { top: 0x030d1c, mid: 0x0c3a60, bottom: 0x9fe2ff, glow: 0xe6f8ff, tileA: 0xf2f8fc, tileB: 0xd7e8f3, under: 0x2e607f, sun: 0xffffff, hemi: 0xd6f1ff },
  { top: 0x12051f, mid: 0x4d1a63, bottom: 0xff74b2, glow: 0xffb3d6, tileA: 0xf0e0f4, tileB: 0xdcc6e6, under: 0x57306b, sun: 0xfff0f8, hemi: 0xf5c9ff },
  { top: 0x020203, mid: 0x1c1507, bottom: 0xd39a35, glow: 0xffd98a, tileA: 0x3a3a46, tileB: 0x2d2d38, under: 0x15130f, sun: 0xfff2d2, hemi: 0xffe2a8 },
];

const QUALITY = {
  high: { dpr: 2, msaa: 4, bloom: true, shadow: 2048 },
  medium: { dpr: 1.4, msaa: 2, bloom: true, shadow: 1024 },
  low: { dpr: 1, msaa: 0, bloom: false, shadow: 512 },
};

const easeInOut = (k) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
const easeOut = (k) => 1 - (1 - k) * (1 - k) * (1 - k);
const easeOutBack = (k) => { const c = 1.70158; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
const easeOutBounce = (k) => {
  const n = 7.5625, d = 2.75;
  if (k < 1 / d) return n * k * k;
  if (k < 2 / d) return n * (k -= 1.5 / d) * k + 0.75;
  if (k < 2.5 / d) return n * (k -= 2.25 / d) * k + 0.9375;
  return n * (k -= 2.625 / d) * k + 0.984375;
};

const SHADER_TAIL = '\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n';

const MAX_PARTICLES = 900;

export class Stage {
  constructor(canvas) {
    this.canvas = canvas;
    this.onFaces = null; // (packedFaces) => void, fired whenever the visible cube changes
    this.onFx = null; // (name, arg) => void, sound / haptic cues in time with the animation
    this.busy = false;
    this.qualityName = 'high';
    this.q = QUALITY.high;
    this.time = 0;
    this.clips = [];
    this.tweens = [];
    this.level = null;
    this.tiles = [];
    this.lanterns = [];
    this.wells = [];
    this.spinners = [];
    this.visFaces = 0;
    this.showcase = false;
    this.celebrating = false;
    this.safeTop = 150;
    this.safeBottom = 150;
    this.frameMs = 16;
    this.slowFrames = 0;
    this.autoQuality = true;
    this.onQualityChange = null;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', alpha: false, stencil: false });
    this.renderer = renderer;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    this.canHDR = renderer.capabilities.isWebGL2 &&
      (renderer.extensions.has('EXT_color_buffer_float') || renderer.extensions.has('EXT_color_buffer_half_float'));

    const scene = new THREE.Scene();
    this.scene = scene;
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.55;
    pmrem.dispose();

    this.camera = new THREE.PerspectiveCamera(36, 1, 0.5, 300);
    this.view = { yaw: 0.45, pitch: 0.92, dist: 14, shift: 0 };
    this.goal = { yaw: 0.45, pitch: 0.92, dist: 14, shift: 0 };
    this.baseYaw = 0.45;
    this.viewQuarter = 0;

    this.tex = makeTextures();
    this._buildSky();
    this._buildLights();
    this._buildShared();
    this._buildCube();
    this._buildParticles();

    this.board = new THREE.Group();
    scene.add(this.board);

    this.setTheme(0);
    this.resize();
    this._last = performance.now();
    this._raf = this._frame.bind(this);
    requestAnimationFrame(this._raf);
  }

  // ---------------------------------------------------------------- set-up

  _buildSky() {
    this.skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, depthTest: false,
      uniforms: {
        top: { value: new THREE.Color() }, mid: { value: new THREE.Color() }, bottom: { value: new THREE.Color() },
        glow: { value: new THREE.Color() }, glowDir: { value: new THREE.Vector3(-0.35, 0.02, -1).normalize() }, time: { value: 0 },
      },
      vertexShader: 'varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: `
        uniform vec3 top; uniform vec3 mid; uniform vec3 bottom; uniform vec3 glow; uniform vec3 glowDir; uniform float time;
        varying vec3 vDir;
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        void main(){
          vec3 d = normalize(vDir);
          float h = d.y * 0.5 + 0.5;
          vec3 col = mix(bottom, mid, smoothstep(0.22, 0.52, h));
          col = mix(col, top, smoothstep(0.5, 0.86, h));
          col = mix(col, bottom * 0.35, smoothstep(0.3, 0.0, h));
          float g = max(dot(d, glowDir), 0.0);
          col += glow * (pow(g, 6.0) * 0.55 + pow(g, 60.0) * 0.9);
          vec2 uv = vec2(atan(d.z, d.x) * 28.0, d.y * 44.0);
          vec2 id = floor(uv); vec2 f = fract(uv) - 0.5;
          float r = hash(id);
          vec2 off = vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5;
          float tw = 0.6 + 0.4 * sin(time * (0.8 + r * 2.5) + r * 50.0);
          float star = step(0.93, r) * smoothstep(0.16, 0.0, length(f - off * 0.6)) * tw;
          col += vec3(star) * smoothstep(0.42, 0.75, h) * 1.4;
          gl_FragColor = vec4(col, 1.0);
          ${SHADER_TAIL}
        }`,
    });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(120, 32, 20), this.skyMat);
    this.sky.renderOrder = -10;
    this.sky.frustumCulled = false;
    this.scene.add(this.sky);
  }

  _buildLights() {
    this.hemi = new THREE.HemisphereLight(0xffffff, 0x334455, 0.85);
    this.scene.add(this.hemi);
    const sun = new THREE.DirectionalLight(0xffffff, 2.3);
    sun.position.set(-4.5, 10, 5.5);
    sun.castShadow = true;
    sun.shadow.bias = -0.0006;
    sun.shadow.normalBias = 0.03;
    sun.shadow.radius = 3.5;
    this.sun = sun;
    this.scene.add(sun, sun.target);
    this.cubeLight = new THREE.PointLight(0xffffff, 0, 4.5, 1.6);
    this.scene.add(this.cubeLight);
  }

  _buildShared() {
    const T = this.tex;
    this.geo = {
      tile: new RoundedBoxGeometry(0.95, TILE_H, 0.95, 3, 0.045),
      decal: new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2),
      under: new THREE.CylinderGeometry(0.6, 0.16, 1, 4, 1).rotateY(Math.PI / 4),
      beam: new THREE.CylinderGeometry(1, 1, 1, 24, 1, true).translate(0, 0.5, 0),
      gem: new THREE.OctahedronGeometry(0.17, 0),
      shard: new THREE.TetrahedronGeometry(0.16, 0),
    };
    const stone = (extra) => new THREE.MeshStandardMaterial({ map: T.tile, roughness: 0.58, metalness: 0.04, ...extra });
    this.mat = {
      tileA: stone(), tileB: stone(),
      dark: stone({ color: 0x1b1626, roughness: 0.35, metalness: 0.3 }),
      glass: new THREE.MeshStandardMaterial({ color: 0xbfe6ff, roughness: 0.06, metalness: 0.1, transparent: true, opacity: 0.5, envMapIntensity: 2.2 }),
      ice: new THREE.MeshStandardMaterial({ color: 0xb5e4ff, roughness: 0.07, metalness: 0.35, emissive: 0x2a86b8, emissiveIntensity: 0.22, envMapIntensity: 1.9 }),
      under: new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.85, metalness: 0, flatShading: true }),
    };
  }

  _decal(map, color, { additive = true, opacity = 1, size = 0.9 } = {}) {
    const m = new THREE.MeshBasicMaterial({
      map, color, transparent: true, opacity, depthWrite: false, toneMapped: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
    });
    const mesh = new THREE.Mesh(this.geo.decal, m);
    mesh.scale.setScalar(size);
    mesh.position.y = 0.006;
    mesh.renderOrder = 2;
    return mesh;
  }

  _beamMat(hex, strength) {
    return new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
      uniforms: { color: { value: new THREE.Color(hex) }, strength: { value: strength }, time: { value: 0 } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: `
        uniform vec3 color; uniform float strength; uniform float time; varying vec2 vUv;
        void main(){
          float a = pow(1.0 - vUv.y, 1.7);
          float f = 0.72 + 0.28 * sin(vUv.y * 9.0 - time * 2.6 + vUv.x * 12.566);
          gl_FragColor = vec4(color * a * f * strength, 1.0);
          ${SHADER_TAIL}
        }`,
    });
  }

  _buildCube() {
    const g = new THREE.Group();
    const body = new THREE.Mesh(
      new RoundedBoxGeometry(CUBE, CUBE, CUBE, 5, 0.085),
      new THREE.MeshStandardMaterial({ color: 0x0d111c, roughness: 0.2, metalness: 0.9, envMapIntensity: 1.5 }),
    );
    body.castShadow = true;
    g.add(body);
    const plane = new THREE.PlaneGeometry(CUBE * 0.78, CUBE * 0.78);
    const frameGeo = new THREE.PlaneGeometry(CUBE * 0.82, CUBE * 0.82);
    const frameMat = new THREE.MeshStandardMaterial({ map: this.tex.frame, color: 0xffc963, metalness: 1, roughness: 0.25, transparent: true, depthWrite: false, envMapIntensity: 1.6 });
    // U, D, N, S, E, W  (north is -z)
    const rots = [[-Math.PI / 2, 0], [Math.PI / 2, 0], [0, Math.PI], [0, 0], [0, Math.PI / 2], [0, -Math.PI / 2]];
    const dirs = [[0, 1, 0], [0, -1, 0], [0, 0, -1], [0, 0, 1], [1, 0, 0], [-1, 0, 0]];
    this.panels = [];
    for (let i = 0; i < 6; i++) {
      const mat = new THREE.MeshBasicMaterial({ map: this.tex.panel, transparent: true, toneMapped: false, depthWrite: false });
      const p = new THREE.Mesh(plane, mat);
      const f = new THREE.Mesh(frameGeo, frameMat);
      for (const m of [p, f]) {
        m.rotation.set(rots[i][0], rots[i][1], 0);
        m.position.set(dirs[i][0], dirs[i][1], dirs[i][2]).multiplyScalar(HALF + (m === p ? 0.002 : 0.004));
        g.add(m);
      }
      this.panels.push(mat);
    }
    this.cube = g;
    this.cubeBody = body;
    this.scene.add(g);

    this.underGlow = this._decal(this.tex.glow, 0xffffff, { size: 2.1 });
    this.underGlow.material.opacity = 0;
    this.underGlow.position.y = 0.012;
    this.scene.add(this.underGlow);

    this.hintArrow = this._decal(this.tex.arrow, 0xffd76a, { size: 0.78 });
    this.hintArrow.position.y = 0.03;
    this.hintArrow.visible = false;
    this.hintArrow.renderOrder = 3;
    this.scene.add(this.hintArrow);
    this.hintDir = -1;
  }

  _buildParticles() {
    const n = MAX_PARTICLES;
    this.p = {
      n, pos: new Float32Array(n * 3), col: new Float32Array(n * 4), size: new Float32Array(n),
      vel: new Float32Array(n * 3), life: new Float32Array(n), max: new Float32Array(n), grav: new Float32Array(n),
      base: new Float32Array(n * 4), next: 0,
    };
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.p.pos, 3));
    geo.setAttribute('pcolor', new THREE.BufferAttribute(this.p.col, 4));
    geo.setAttribute('psize', new THREE.BufferAttribute(this.p.size, 1));
    this.pMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { scale: { value: 500 } },
      vertexShader: `
        attribute vec4 pcolor; attribute float psize; uniform float scale; varying vec4 vColor;
        void main(){ vColor = pcolor; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = psize * scale / -mv.z; gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `
        varying vec4 vColor;
        void main(){ float a = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5)); gl_FragColor = vec4(vColor.rgb * vColor.a * a * a * 1.6, 1.0); ${SHADER_TAIL} }`,
    });
    this.points = new THREE.Points(geo, this.pMat);
    this.points.frustumCulled = false;
    this.points.renderOrder = 5;
    this.scene.add(this.points);
    this._c = new THREE.Color();
  }

  emit(x, y, z, vx, vy, vz, hex, life, size, grav = 0) {
    const p = this.p, i = p.next;
    p.next = (i + 1) % p.n;
    p.pos[i * 3] = x; p.pos[i * 3 + 1] = y; p.pos[i * 3 + 2] = z;
    p.vel[i * 3] = vx; p.vel[i * 3 + 1] = vy; p.vel[i * 3 + 2] = vz;
    const c = this._c.setHex(hex);
    p.base[i * 4] = c.r; p.base[i * 4 + 1] = c.g; p.base[i * 4 + 2] = c.b; p.base[i * 4 + 3] = 1;
    p.life[i] = life; p.max[i] = life; p.size[i] = size; p.grav[i] = grav;
  }

  burst(x, y, z, hex, count, speed = 2.2, life = 0.8, size = 0.16, up = 1.6, grav = -3.5) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2, s = speed * (0.35 + Math.random() * 0.65);
      this.emit(x, y, z, Math.cos(a) * s, up * (0.3 + Math.random()), Math.sin(a) * s, hex, life * (0.6 + Math.random() * 0.6), size * (0.6 + Math.random() * 0.8), grav);
    }
  }

  // ---------------------------------------------------------------- quality / size

  setQuality(name, auto = false) {
    if (!QUALITY[name]) name = 'high';
    this.qualityName = name;
    this.q = QUALITY[name];
    this.autoQuality = auto;
    this.slowFrames = 0;
    this.resize();
  }

  setSafeArea(topPx, bottomPx) {
    this.safeTop = topPx;
    this.safeBottom = bottomPx;
    this._fit(this.goal, true);
  }

  resize() {
    const w = Math.max(1, this.canvas.clientWidth || window.innerWidth);
    const h = Math.max(1, this.canvas.clientHeight || window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, this.q.dpr);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.w = w; this.h = h;
    this.camera.aspect = w / h;
    this.pMat.uniforms.scale.value = (h * dpr * 0.5) / Math.tan((this.camera.fov * Math.PI) / 360);
    this.sun.shadow.mapSize.set(this.q.shadow, this.q.shadow);
    if (this.sun.shadow.map) { this.sun.shadow.map.dispose(); this.sun.shadow.map = null; }

    if (this.composer) { this.composer.dispose(); this.rt.dispose(); this.composer = null; }
    if (this.q.bloom && this.canHDR) {
      const pw = Math.floor(w * dpr), ph = Math.floor(h * dpr);
      this.rt = new THREE.WebGLRenderTarget(pw, ph, { type: THREE.HalfFloatType, samples: this.q.msaa });
      const comp = new EffectComposer(this.renderer, this.rt);
      comp.addPass(new RenderPass(this.scene, this.camera));
      this.bloom = new UnrealBloomPass(new THREE.Vector2(pw / 2, ph / 2), 0.62, 0.55, 0.9);
      comp.addPass(this.bloom);
      comp.addPass(new OutputPass());
      this.composer = comp;
    }
    if (this.level) this._fit(this.goal, true);
  }

  // ---------------------------------------------------------------- theme / level

  setTheme(i) {
    const t = THEMES[i % THEMES.length];
    this.theme = t;
    const u = this.skyMat.uniforms;
    u.top.value.setHex(t.top); u.mid.value.setHex(t.mid); u.bottom.value.setHex(t.bottom); u.glow.value.setHex(t.glow);
    this.mat.tileA.color.setHex(t.tileA);
    this.mat.tileB.color.setHex(t.tileB);
    this.mat.under.color.setHex(t.under);
    this.sun.color.setHex(t.sun);
    this.hemi.color.setHex(t.hemi);
    this.hemi.groundColor.setHex(t.under);
    const dark = i % THEMES.length === 5;
    this.mat.tileA.roughness = this.mat.tileB.roughness = dark ? 0.3 : 0.58;
    this.mat.tileA.metalness = this.mat.tileB.metalness = dark ? 0.55 : 0.04;
    this.hemi.intensity = dark ? 1.25 : 0.85;
  }

  cellX(pos) { return (pos % this.level.w) - (this.level.w - 1) / 2; }
  cellZ(pos) { return ((pos / this.level.w) | 0) - (this.level.h - 1) / 2; }

  _clearBoard() {
    for (const t of this.tiles) if (t) {
      t.group.traverse((o) => { if (o.isMesh && o.userData.own) o.material.dispose(); });
    }
    this.board.clear();
    if (this.underMesh) { this.underMesh.dispose(); this.underMesh = null; }
    this.tiles = []; this.lanterns = []; this.wells = []; this.spinners = [];
    this.tweens.length = 0; this.clips.length = 0;
    this.celebrating = false;
    this.clearHint();
  }

  // Build the board for a compiled level and play the entrance.
  loadLevel(L, st, themeIndex, { showcase = false, instant = false } = {}) {
    this._clearBoard();
    this.level = L;
    this.showcase = showcase;
    this.setTheme(themeIndex);
    const T = this.tex, G = this.geo;
    const own = (mesh) => { mesh.userData.own = true; return mesh; };
    let count = 0;
    for (let p = 0; p < L.n; p++) if (L.type[p] !== T_VOID) count++;
    const under = new THREE.InstancedMesh(G.under, this.mat.under, count);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), v = new THREE.Vector3();
    let ui = 0;

    for (let p = 0; p < L.n; p++) {
      const type = L.type[p];
      if (type === T_VOID) { this.tiles.push(null); continue; }
      const x = this.cellX(p), z = this.cellZ(p);
      const cx = p % L.w, cy = (p / L.w) | 0;
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      let mat = (cx + cy) % 2 ? this.mat.tileA : this.mat.tileB;
      if (type === T_FRAG) mat = this.mat.glass;
      else if (type === T_ICE) mat = this.mat.ice;
      else if (type === T_SHADOW || type === T_TELE) mat = this.mat.dark;
      const base = new THREE.Mesh(G.tile, mat);
      base.position.y = -TILE_H / 2;
      base.receiveShadow = type !== T_FRAG;
      group.add(base);
      const tile = { group, base, type, pos: p, broken: false };

      if (type === T_WELL) {
        const hex = LIGHT_HEX[L.color[p]];
        const disc = own(this._decal(T.well, hex, { size: 0.86 }));
        const beam = own(new THREE.Mesh(G.beam, this._beamMat(hex, 0.5)));
        beam.scale.set(0.36, 1.5, 0.36);
        beam.renderOrder = 4;
        group.add(disc, beam);
        this.wells.push({ pos: p, hex, disc: disc.material, beam: beam.material, flash: 0, x, z, tick: Math.random() });
      } else if (type === T_LANT) {
        const hex = LIGHT_HEX[L.color[p]];
        const plate = own(this._decal(T.lantern, hex, { size: 0.9 }));
        const beam = own(new THREE.Mesh(G.beam, this._beamMat(hex, 0)));
        beam.scale.set(0.2, 5.5, 0.2);
        beam.renderOrder = 4;
        const gem = own(new THREE.Mesh(G.gem, new THREE.MeshBasicMaterial({ color: hex, toneMapped: false })));
        gem.position.y = 1.62;
        const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.glow, color: hex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, opacity: 0 }));
        halo.userData.own = true;
        halo.position.y = 1.62;
        halo.scale.setScalar(1.1);
        halo.renderOrder = 4;
        group.add(plate, beam, gem, halo);
        const lit = !!((st.lit >> L.idx[p]) & 1);
        this.lanterns.push({ pos: p, index: L.idx[p], hex, color: new THREE.Color(hex), plate: plate.material, beam: beam.material, gem, halo: halo.material, lit, k: lit ? 1 : 0, shake: 0, x, z, phase: Math.random() * 6 });
      } else if (type === T_SHADOW) {
        const sw = own(this._decal(T.swirl, 0x9a4dff, { size: 0.9 }));
        group.add(sw);
        this.spinners.push({ mesh: sw, speed: 0.9 });
      } else if (type === T_FRAG) {
        group.add(own(this._decal(T.crack, 0xffffff, { size: 0.95, additive: false, opacity: 0.55 })));
      } else if (type === T_ICE) {
        group.add(own(this._decal(T.frost, 0xffffff, { size: 0.95, additive: false, opacity: 0.6 })));
      } else if (type === T_SPIN) {
        const ar = own(this._decal(T.arrows, 0xffc04d, { size: 0.9 }));
        group.add(ar);
        tile.arrows = ar;
        this.spinners.push({ mesh: ar, speed: -0.5 });
      } else if (type === T_TELE) {
        const hex = L.color[p] ? 0xffb347 : 0x9b6bff;
        const a = own(this._decal(T.swirl, hex, { size: 0.92 }));
        const b = own(this._decal(T.swirl, 0xffffff, { size: 0.55, opacity: 0.6 }));
        b.position.y = 0.01;
        group.add(a, b);
        tile.hex = hex;
        this.spinners.push({ mesh: a, speed: -1.6 }, { mesh: b, speed: 2.4 });
      }

      const depth = 0.55 + ((cx * 7 + cy * 13) % 5) * 0.16;
      sc.set(1, depth, 1); v.set(x, -TILE_H - depth / 2 + 0.02, z);
      under.setMatrixAt(ui++, m4.compose(v, q, sc));
      this.board.add(group);
      this.tiles.push(tile);
    }
    under.instanceMatrix.needsUpdate = true;
    this.underMesh = under;
    this.board.add(under);

    // light and shadow frustum sized to the board
    const r = Math.max(L.w, L.h) / 2 + 1.6;
    const cam = this.sun.shadow.camera;
    cam.left = -r; cam.right = r; cam.top = r; cam.bottom = -r; cam.near = 1; cam.far = 30;
    cam.updateProjectionMatrix();

    this.viewQuarter = 0;
    this.goal.yaw = this.baseYaw;
    this._fit(this.goal, false);
    if (instant) { Object.assign(this.view, this.goal); }
    else { this.view.dist = this.goal.dist * 1.25; this.view.yaw = this.goal.yaw - 0.5; this.view.pitch = this.goal.pitch; this.view.shift = this.goal.shift; }

    this.setState(st, true);
    this._intro(st, instant);
  }

  _intro(st, instant) {
    const L = this.level;
    if (instant) { this.busy = false; return; }
    this.busy = true;
    const sx = st.pos % L.w, sy = (st.pos / L.w) | 0;
    let maxDelay = 0;
    for (const t of this.tiles) {
      if (!t) continue;
      const d = Math.hypot((t.pos % L.w) - sx, ((t.pos / L.w) | 0) - sy) * 0.05;
      maxDelay = Math.max(maxDelay, d);
      t.group.position.y = -9;
      t.group.scale.setScalar(0.5);
      this.tween(0.55, (k) => { const e = easeOutBack(k); t.group.position.y = -9 * (1 - e); t.group.scale.setScalar(0.5 + 0.5 * easeOut(k)); }, d);
    }
    this.underMesh.position.y = -9;
    this.tween(0.6, (k) => { this.underMesh.position.y = -9 * (1 - easeOut(k)); }, maxDelay * 0.5);
    if (this.showcase) { this.busy = false; return; }
    const y0 = this.cube.position.y;
    this.cube.position.y = y0 + 6;
    this.cube.visible = false;
    this.tween(0.5, (k) => { this.cube.visible = true; this.cube.position.y = y0 + 6 * (1 - easeOutBounce(k)); }, maxDelay + 0.3, () => {
      this.busy = false;
      this.fx('land');
      this.burst(this.cube.position.x, 0.05, this.cube.position.z, 0xffffff, 14, 1.6, 0.5, 0.1, 0.6, -1);
    });
  }

  // Snap everything to a game state (used for undo, restart and after each move).
  setState(st, quiet = false) {
    const L = this.level;
    this.cubePos = st.pos;
    this.visFaces = st.faces;
    this.cube.quaternion.identity();
    this.cube.scale.setScalar(1);
    this.cube.visible = true;
    this.cube.position.set(this.cellX(st.pos), HALF, this.cellZ(st.pos));
    this._paintCube();
    for (const l of this.lanterns) l.lit = !!((st.lit >> l.index) & 1);
    for (const t of this.tiles) {
      if (!t || t.type !== T_FRAG) continue;
      const broken = !!((st.broken >> L.idx[t.pos]) & 1);
      if (broken !== t.broken) {
        t.broken = broken;
        t.group.visible = !broken;
        if (!broken) {
          t.group.position.y = 0; t.group.rotation.set(0, 0, 0); t.group.scale.setScalar(1);
          if (!quiet) this.tween(0.25, (k) => t.group.scale.setScalar(0.6 + 0.4 * easeOutBack(k)));
        }
      }
    }
    if (!quiet) this.tween(0.18, (k) => this.cube.scale.setScalar(0.86 + 0.14 * easeOutBack(k)));
  }

  _paintCube() {
    const f = facesToArray(this.visFaces);
    for (let i = 0; i < 6; i++) {
      const c = this.panels[i].color.setHex(LIGHT_HEX[f[i]]);
      if (f[i]) c.multiplyScalar(1.9); else c.multiplyScalar(0.42);
    }
    this.downHex = f[1] ? LIGHT_HEX[f[1]] : 0;
    if (this.onFaces) this.onFaces(this.visFaces);
  }

  fx(name, arg) { if (this.onFx) this.onFx(name, arg); }

  // ---------------------------------------------------------------- animation

  tween(dur, update, delay = 0, done = null) {
    this.tweens.push({ t: -delay, dur, update, done });
  }

  clip(dur, update, end) {
    this.clips.push({ t: 0, dur, update, end, started: false });
  }

  // Animate the events of one move, then snap to the resulting state.
  playEvents(events, finalState, onDone) {
    this.busy = true;
    this.clearHint();
    for (const e of events) this._clipFor(e);
    this.clip(0, null, () => {
      this.setState(finalState, true);
      this.busy = false;
      if (onDone) onDone();
    });
  }

  _clipFor(e) {
    const cube = this.cube;
    if (e.t === 'roll') {
      const dx = DX[e.dir], dz = DY[e.dir];
      const axis = new THREE.Vector3(dz, 0, -dx);
      let x0, z0;
      this.clip(0.15, (k) => {
        if (k === 0) { x0 = this.cellX(e.from); z0 = this.cellZ(e.from); }
        const a = easeInOut(k) * Math.PI / 2;
        const h = -HALF * Math.cos(a) + HALF * Math.sin(a);
        const along = HALF + h + (1 - CUBE) * easeInOut(k);
        cube.position.set(x0 + dx * along, HALF * (Math.sin(a) + Math.cos(a)), z0 + dz * along);
        cube.quaternion.setFromAxisAngle(axis, a);
      }, () => {
        this.visFaces = rollFaces(this.visFaces, e.dir);
        this.cubePos = e.to;
        cube.quaternion.identity();
        cube.position.set(this.cellX(e.to), HALF, this.cellZ(e.to));
        this._paintCube();
        this.fx('roll');
        this.burst(cube.position.x, 0.04, cube.position.z, 0xfff2d0, 5, 1.1, 0.35, 0.07, 0.25, -0.5);
      });
    } else if (e.t === 'slide') {
      const n = Math.abs((e.to % this.level.w) - (e.from % this.level.w)) + Math.abs(((e.to / this.level.w) | 0) - ((e.from / this.level.w) | 0));
      let x0, z0, x1, z1;
      this.clip(0.07 * n + 0.06, (k) => {
        if (k === 0) { x0 = this.cellX(e.from); z0 = this.cellZ(e.from); x1 = this.cellX(e.to); z1 = this.cellZ(e.to); this.fx('slide'); }
        const s = easeOut(k);
        cube.position.set(x0 + (x1 - x0) * s, HALF, z0 + (z1 - z0) * s);
        if (Math.random() < 0.5) this.emit(cube.position.x, 0.05, cube.position.z, (Math.random() - 0.5) * 0.6, 0.5, (Math.random() - 0.5) * 0.6, 0xbfeaff, 0.4, 0.09, -0.6);
      }, () => { this.cubePos = e.to; });
    } else if (e.t === 'break') {
      this.clip(0, null, () => this._breakTile(e.pos));
    } else if (e.t === 'dip') {
      this.clip(0.06, null, () => {
        const w = this.wells.find((x) => x.pos === e.pos);
        if (w) w.flash = 1;
        this.visFaces = (this.visFaces & ~(7 << 3)) | (e.after << 3);
        this._paintCube();
        const hex = LIGHT_HEX[e.after];
        this.burst(cube.position.x, 0.1, cube.position.z, hex, 26, 2.2, 0.75, 0.15, 2.4, -4);
        this._ring(cube.position.x, cube.position.z, hex);
        this.cubeLight.color.setHex(hex);
        this.cubeLight.intensity = 9;
        this.fx('dip', { color: e.after, mixed: e.before !== 0 && e.after !== e.before });
      });
    } else if (e.t === 'light') {
      this.clip(0.1, null, () => {
        const l = this.lanterns.find((x) => x.pos === e.pos);
        if (l) l.lit = true;
        this.visFaces = this.visFaces & ~(7 << 3);
        this._paintCube();
        const hex = LIGHT_HEX[e.color];
        this.burst(cube.position.x, 0.2, cube.position.z, hex, 46, 2.6, 1.1, 0.17, 4.2, -4.5);
        for (let i = 0; i < 18; i++) this.emit(cube.position.x + (Math.random() - 0.5) * 0.4, 0.2, cube.position.z + (Math.random() - 0.5) * 0.4, 0, 2 + Math.random() * 4, 0, hex, 0.9, 0.12, 0);
        this._ring(cube.position.x, cube.position.z, hex, 2.6);
        this.cubeLight.color.setHex(hex);
        this.cubeLight.intensity = 16;
        this.fx('light', { color: e.color, index: e.index });
      });
    } else if (e.t === 'mismatch') {
      this.clip(0, null, () => {
        const l = this.lanterns.find((x) => x.pos === e.pos);
        if (l) l.shake = 1;
        this.fx('mismatch');
      });
    } else if (e.t === 'absorb') {
      this.clip(0.08, null, () => {
        this.visFaces = this.visFaces & ~(7 << 3);
        this._paintCube();
        const hex = LIGHT_HEX[e.color];
        for (let i = 0; i < 22; i++) {
          const a = Math.random() * Math.PI * 2, r = 0.9 + Math.random() * 0.4;
          this.emit(cube.position.x + Math.cos(a) * r, 0.5 + Math.random() * 0.5, cube.position.z + Math.sin(a) * r, -Math.cos(a) * 2.2, -1.2, -Math.sin(a) * 2.2, hex, 0.45, 0.12, 0);
        }
        this._ring(cube.position.x, cube.position.z, 0x8a3dff);
        this.fx('absorb');
      });
    } else if (e.t === 'spin') {
      const tile = this.tiles[e.pos];
      let r0 = 0;
      this.clip(0.24, (k) => {
        if (k === 0) { r0 = tile.arrows ? tile.arrows.rotation.y : 0; this.fx('spin'); }
        const a = -easeInOut(k) * Math.PI / 2;
        cube.rotation.set(0, a, 0);
        cube.position.y = HALF + Math.sin(k * Math.PI) * 0.12;
        if (tile.arrows) tile.arrows.rotation.y = r0 + a;
      }, () => {
        this.visFaces = spinFaces(this.visFaces);
        cube.quaternion.identity();
        cube.position.y = HALF;
        this._paintCube();
      });
    } else if (e.t === 'tele') {
      const hex = this.tiles[e.from].hex || 0x9b6bff;
      this.clip(0.15, (k) => {
        if (k === 0) { this.fx('tele'); this.burst(cube.position.x, 0.4, cube.position.z, hex, 24, 1.8, 0.6, 0.13, 1.5, 0); }
        cube.scale.setScalar(1 - easeInOut(k));
        cube.rotation.y = k * 3;
      }, () => {
        this.cubePos = e.to;
        cube.position.set(this.cellX(e.to), HALF, this.cellZ(e.to));
        this.burst(cube.position.x, 0.4, cube.position.z, hex, 24, 1.8, 0.6, 0.13, 1.5, 0);
        this._ring(cube.position.x, cube.position.z, hex);
      });
      this.clip(0.16, (k) => {
        cube.scale.setScalar(easeOutBack(k));
        cube.rotation.y = (1 - k) * 3;
      }, () => { cube.scale.setScalar(1); cube.quaternion.identity(); });
    }
  }

  _ring(x, z, hex, grow = 1.9) {
    const ring = this._decal(this.tex.ring, hex, { size: 0.6 });
    ring.position.set(x, 0.02, z);
    this.scene.add(ring);
    this.tween(0.5, (k) => { ring.scale.setScalar(0.6 + grow * easeOut(k)); ring.material.opacity = 1 - k; }, 0, () => { this.scene.remove(ring); ring.material.dispose(); });
  }

  _breakTile(pos) {
    const t = this.tiles[pos];
    if (!t || t.broken) return;
    t.broken = true;
    this.fx('break');
    const x = t.group.position.x, z = t.group.position.z;
    for (let i = 0; i < 16; i++) this.emit(x + (Math.random() - 0.5) * 0.8, -0.05, z + (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 1.6, 0.6 + Math.random() * 1.6, (Math.random() - 0.5) * 1.6, 0xcfefff, 0.7, 0.12, -6);
    const rx = (Math.random() - 0.5) * 1.6, rz = (Math.random() - 0.5) * 1.6;
    this.tween(0.5, (k) => {
      t.group.position.y = -5 * k * k;
      t.group.rotation.set(rx * k, 0, rz * k);
      t.group.scale.setScalar(1 - 0.5 * k);
    }, 0.02, () => { if (t.broken) t.group.visible = false; });
  }

  // Blocked move: lean into the edge and back.
  bump(dir) {
    if (this.busy) return;
    const cube = this.cube, dx = DX[dir], dz = DY[dir];
    const axis = new THREE.Vector3(dz, 0, -dx);
    const x0 = this.cellX(this.cubePos), z0 = this.cellZ(this.cubePos);
    this.busy = true;
    this.fx('bump');
    this.clip(0.16, (k) => {
      const a = Math.sin(k * Math.PI) * 0.2;
      const h = -HALF * Math.cos(a) + HALF * Math.sin(a);
      cube.position.set(x0 + dx * (HALF + h), HALF * (Math.sin(a) + Math.cos(a)), z0 + dz * (HALF + h));
      cube.quaternion.setFromAxisAngle(axis, a);
    }, () => { cube.quaternion.identity(); cube.position.set(x0, HALF, z0); this.busy = false; });
  }

  showHint(dir) {
    this.hintDir = dir;
    this.hintArrow.visible = true;
    this.hintArrow.rotation.y = [0, -Math.PI / 2, Math.PI, Math.PI / 2][dir];
  }

  clearHint() {
    this.hintDir = -1;
    if (this.hintArrow) this.hintArrow.visible = false;
  }

  celebrate() {
    this.celebrating = true;
    this.celebrateT = 0;
  }

  // ---------------------------------------------------------------- camera

  rotateView(step) {
    this.viewQuarter = (this.viewQuarter + step + 4) % 4;
    this.goal.yaw += (step * Math.PI) / 2;
    this._fit(this.goal, false);
  }

  // Swipe on screen (dx right, dy down) -> board direction 0..3
  screenToDir(sx, sy) {
    const yaw = this.goal.yaw;
    const wx = sx * Math.cos(yaw) + sy * Math.sin(yaw);
    const wz = -sx * Math.sin(yaw) + sy * Math.cos(yaw);
    if (Math.abs(wx) > Math.abs(wz)) return wx > 0 ? 1 : 3;
    return wz > 0 ? 2 : 0;
  }

  _placeCamera(view, cam) {
    const cp = Math.cos(view.pitch);
    cam.position.set(Math.sin(view.yaw) * cp * view.dist, Math.sin(view.pitch) * view.dist, Math.cos(view.yaw) * cp * view.dist);
    cam.lookAt(0, 0.2, 0);
    cam.updateMatrixWorld();
  }

  // Choose the distance (and vertical lens shift) that frames the whole board
  // between the top HUD and the bottom buttons.
  _fit(target, snap) {
    if (!this.level) return;
    const L = this.level, cam = this.camera;
    const hw = L.w / 2 + 0.15, hh = L.h / 2 + 0.15;
    const top = Math.min(this.safeTop, this.h * 0.35), bottom = Math.min(this.safeBottom, this.h * 0.35);
    const yMax = 1 - (2 * top) / this.h, yMin = -1 + (2 * bottom) / this.h;
    const halfY = (yMax - yMin) / 2, halfX = 0.93;
    const pts = [];
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) for (const y of [-0.5, 1.75]) pts.push(new THREE.Vector3(sx * hw, y, sz * hh));
    cam.aspect = this.w / this.h;
    cam.updateProjectionMatrix();
    const test = { yaw: target.yaw, pitch: target.pitch, dist: 0 };
    const v = new THREE.Vector3();
    let lo = 3, hi = 80, mid = 0;
    for (let i = 0; i < 22; i++) {
      test.dist = (lo + hi) / 2;
      this._placeCamera(test, cam);
      cam.matrixWorldInverse.copy(cam.matrixWorld).invert();
      let ok = true, y0 = 9, y1 = -9;
      for (const p of pts) {
        v.copy(p).project(cam);
        if (Math.abs(v.x) > halfX) ok = false;
        y0 = Math.min(y0, v.y); y1 = Math.max(y1, v.y);
      }
      if (y1 - y0 > 2 * halfY) ok = false;
      mid = (y0 + y1) / 2;
      if (ok) hi = test.dist; else lo = test.dist;
    }
    target.dist = hi;
    test.dist = hi;
    this._placeCamera(test, cam);
    cam.matrixWorldInverse.copy(cam.matrixWorld).invert();
    let y0 = 9, y1 = -9;
    for (const p of pts) { v.copy(p).project(cam); y0 = Math.min(y0, v.y); y1 = Math.max(y1, v.y); }
    target.shift = (yMax + yMin) / 2 - (y0 + y1) / 2;
    if (snap) { this.view.dist = target.dist; this.view.shift = target.shift; }
  }

  // ---------------------------------------------------------------- frame

  _frame(now) {
    requestAnimationFrame(this._raf);
    const raw = (now - this._last) / 1000;
    this._last = now;
    if (document.hidden) return;
    const dt = Math.min(raw, 0.05);
    this.time += dt;
    this._adaptQuality(raw);
    this._update(dt);
    if (this.composer) this.composer.render(dt); else this.renderer.render(this.scene, this.camera);
  }

  // Step down a quality level if the device cannot hold a smooth frame rate.
  _adaptQuality(raw) {
    if (!this.autoQuality || this.time < 2.5 || raw > 0.25) return;
    this.frameMs += (raw * 1000 - this.frameMs) * 0.05;
    if (this.frameMs > 27) this.slowFrames++; else this.slowFrames = Math.max(0, this.slowFrames - 2);
    if (this.slowFrames > 150) {
      const next = this.qualityName === 'high' ? 'medium' : this.qualityName === 'medium' ? 'low' : null;
      this.slowFrames = 0;
      this.frameMs = 16;
      if (next) { this.setQuality(next, true); if (this.onQualityChange) this.onQualityChange(next); }
    }
  }

  _update(dt) {
    const t = this.time;

    // sequential clips (cube motion)
    let budget = dt;
    while (this.clips.length && budget >= 0) {
      const c = this.clips[0];
      if (!c.started) { c.started = true; if (c.update) c.update(0); }
      c.t += budget;
      if (c.t >= c.dur) {
        budget = c.t - c.dur;
        if (c.update && c.dur > 0) c.update(1);
        this.clips.shift();
        if (c.end) c.end();
      } else {
        if (c.update) c.update(c.t / c.dur);
        break;
      }
    }

    // parallel tweens
    for (let i = this.tweens.length - 1; i >= 0; i--) {
      const w = this.tweens[i];
      w.t += dt;
      if (w.t < 0) continue;
      const k = Math.min(1, w.t / w.dur);
      w.update(k);
      if (k >= 1) { this.tweens.splice(i, 1); if (w.done) w.done(); }
    }

    // ambient life
    for (const s of this.spinners) s.mesh.rotation.y += s.speed * dt;
    for (const w of this.wells) {
      w.flash = Math.max(0, w.flash - dt * 2.2);
      const pulse = 0.85 + 0.15 * Math.sin(t * 2.4 + w.x * 1.7 + w.z);
      w.disc.color.setHex(w.hex).multiplyScalar(1.35 * pulse + w.flash * 2.5);
      w.beam.uniforms.strength.value = 0.42 * pulse + w.flash * 1.4;
      w.beam.uniforms.time.value = t;
      w.tick += dt * 5;
      if (w.tick > 1) {
        w.tick = 0;
        const a = Math.random() * Math.PI * 2, r = Math.random() * 0.3;
        this.emit(w.x + Math.cos(a) * r, 0.05, w.z + Math.sin(a) * r, 0, 0.5 + Math.random() * 0.5, 0, w.hex, 1.5, 0.09, 0);
      }
    }
    for (const l of this.lanterns) {
      l.k += ((l.lit ? 1 : 0) - l.k) * Math.min(1, dt * 7);
      l.shake = Math.max(0, l.shake - dt * 2.5);
      const idle = 0.46 + 0.1 * Math.sin(t * 2 + l.phase);
      const boost = this.celebrating ? 0.6 + 0.4 * Math.sin(t * 6 + l.phase) : 0;
      l.plate.color.copy(l.color).multiplyScalar(idle + l.k * (1.9 + boost) + l.shake * Math.abs(Math.sin(t * 40)) * 1.5);
      l.beam.uniforms.strength.value = l.k * (1.1 + boost);
      l.beam.uniforms.time.value = t;
      l.gem.rotation.y = t * (0.6 + l.k * 1.6) + l.phase;
      l.gem.position.y = 1.62 + Math.sin(t * 1.6 + l.phase) * 0.06;
      l.gem.position.x = l.shake * Math.sin(t * 55) * 0.06;
      l.gem.material.color.copy(l.color).multiplyScalar(0.2 + l.k * 2.2);
      l.gem.scale.setScalar(0.8 + l.k * 0.45);
      l.halo.opacity = l.k * 0.85;
      if (l.lit && Math.random() < dt * 5) this.emit(l.x + (Math.random() - 0.5) * 0.3, 0.1, l.z + (Math.random() - 0.5) * 0.3, 0, 1.2 + Math.random(), 0, l.hex, 1.6, 0.08, 0);
    }

    // cube: showcase float, glow under it, travelling light
    const cube = this.cube;
    if (this.showcase) {
      cube.visible = true;
      cube.position.set(0, 1.55 + Math.sin(t * 1.3) * 0.12, 0);
      cube.rotation.set(t * 0.5, t * 0.8, 0.5);
      cube.scale.setScalar(1.25);
    }
    const ug = this.underGlow;
    ug.position.x = cube.position.x; ug.position.z = cube.position.z;
    const wantGlow = this.downHex && !this.showcase ? 0.9 : 0;
    ug.material.opacity += (wantGlow - ug.material.opacity) * Math.min(1, dt * 10);
    if (this.downHex) ug.material.color.setHex(this.downHex);
    this.cubeLight.position.set(cube.position.x, cube.position.y + 0.9, cube.position.z);
    this.cubeLight.intensity += (0 - this.cubeLight.intensity) * Math.min(1, dt * 3);

    if (this.hintArrow.visible && this.hintDir >= 0) {
      const d = this.hintDir, wob = 0.5 + 0.12 * Math.sin(t * 7);
      this.hintArrow.position.x = this.cellX(this.cubePos) + DX[d] * (0.5 + wob);
      this.hintArrow.position.z = this.cellZ(this.cubePos) + DY[d] * (0.5 + wob);
      this.hintArrow.material.color.setHex(0xffd76a).multiplyScalar(1.3 + 0.5 * Math.sin(t * 7));
    }

    if (this.celebrating && this.level) {
      this.celebrateT += dt;
      if (Math.random() < dt * 26) {
        const L = this.level;
        const x = (Math.random() - 0.5) * (L.w + 1.5), z = (Math.random() - 0.5) * (L.h + 1.5);
        const hex = LIGHT_HEX[1 + Math.floor(Math.random() * 7)];
        this.burst(x, 1.4 + Math.random() * 2.4, z, hex, 12, 1.9, 1.0, 0.14, 0.8, -2.2);
      }
    }

    // drifting motes
    if (this.level && Math.random() < dt * 7) {
      const L = this.level;
      this.emit((Math.random() - 0.5) * (L.w + 5), -1 + Math.random() * 4, (Math.random() - 0.5) * (L.h + 5), (Math.random() - 0.5) * 0.15, 0.12 + Math.random() * 0.2, (Math.random() - 0.5) * 0.15, this.theme.glow, 4 + Math.random() * 3, 0.07, 0);
    }

    this._updateParticles(dt);

    // camera
    const v = this.view, g = this.goal;
    if (this.showcase || this.celebrating) g.yaw += dt * (this.showcase ? 0.16 : 0.22);
    const s = Math.min(1, dt * 5);
    v.yaw += (g.yaw - v.yaw) * s;
    v.pitch += (g.pitch - v.pitch) * s;
    v.dist += (g.dist - v.dist) * s;
    v.shift += (g.shift - v.shift) * s;
    const cam = this.camera;
    cam.aspect = this.w / this.h;
    cam.updateProjectionMatrix();
    cam.projectionMatrix.elements[9] = -v.shift; // lens shift: moves the picture up/down without tilting it
    cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert();
    this._placeCamera(v, cam);
    this.sky.position.copy(cam.position);
    this.skyMat.uniforms.time.value = t;
  }

  _updateParticles(dt) {
    const p = this.p;
    for (let i = 0; i < p.n; i++) {
      if (p.life[i] <= 0) { if (p.col[i * 4 + 3] !== 0) p.col[i * 4 + 3] = 0; continue; }
      p.life[i] -= dt;
      const j = i * 3;
      p.vel[j + 1] += p.grav[i] * dt;
      p.pos[j] += p.vel[j] * dt; p.pos[j + 1] += p.vel[j + 1] * dt; p.pos[j + 2] += p.vel[j + 2] * dt;
      const k = Math.max(0, p.life[i] / p.max[i]);
      const fade = Math.min(1, k * 3) * Math.min(1, (1 - k) * 8 + 0.2);
      p.col[i * 4] = p.base[i * 4]; p.col[i * 4 + 1] = p.base[i * 4 + 1]; p.col[i * 4 + 2] = p.base[i * 4 + 2];
      p.col[i * 4 + 3] = fade;
    }
    const g = this.points.geometry;
    g.attributes.position.needsUpdate = true;
    g.attributes.pcolor.needsUpdate = true;
    g.attributes.psize.needsUpdate = true;
  }
}
