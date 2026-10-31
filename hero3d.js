/* ═══════════════════════════════════════════════════════════
   HERO 3D STAGE — three.js
   你的 sym-mark 六瓣星标挤出成 3D 印刷体（riso 红面 + 蓝色
   印刷错版侧面），悬浮在一片起伏的半调墨点地形上。
   交互：鼠标划过 = 墨点涟漪 + 星标倾斜；拖拽 = 环绕（惯性）；
   空闲 = 缓慢漂移。prefers-reduced-motion 时渲染单帧静置。
   零 CDN：three 从 vendor/ 本地加载。
   ═══════════════════════════════════════════════════════════ */

import * as THREE from "./vendor/three.module.min.js";

const stage = document.getElementById("heroStage");
const canvas = document.getElementById("heroCanvas");
if (stage && canvas) {
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* riso 墨色 */
  const INK = {
    paper: 0xf2ede3,
    red: 0xe8492a,
    redDeep: 0xc03a1e,
    blue: 0x2b45c9,
    yellow: 0xf2b32b,
    dotQuiet: 0xd9d1bf,
    dotMid: 0xc4bcab,
  };

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) {
    stage.style.display = "none";
    throw e;
  }
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 80);
  const CAM = new THREE.Vector3(0, 2.4, 13.5);
  camera.position.copy(CAM);
  camera.lookAt(0, 1.0, 0);

  /* 拖拽/漂移都作用在 rig 上 */
  const rig = new THREE.Group();
  scene.add(rig);

  /* ── 1. 星标：sym-mark 的花瓣贝塞尔原样挤出（每瓣绕中心旋转 60°） ── */
  function petalShape() {
    // index.html #sym-mark：M50 3 C59 24 59 39 50 50 C41 39 41 24 50 3 Z（100 视框）
    const s = new THREE.Shape();
    s.moveTo(0, -47);
    s.bezierCurveTo(9, -26, 9, -11, 0, 0);
    s.bezierCurveTo(-9, -11, -9, -26, 0, -47);
    return s;
  }
  const petal = petalShape();
  const origin = new THREE.Vector2(0, 0);
  const petalShapes = [];
  for (let i = 0; i < 6; i++) {
    const pts = petal.getPoints(24).map((p) => p.clone().rotateAround(origin, (i * Math.PI) / 3));
    petalShapes.push(new THREE.Shape(pts));
  }
  const starGeo = new THREE.ExtrudeGeometry(petalShapes, {
    depth: 13,
    bevelEnabled: true,
    bevelThickness: 1.4,
    bevelSize: 1.4,
    bevelSegments: 2,
  });
  const starMats = [
    new THREE.MeshBasicMaterial({ color: INK.red }), // 正/背面：riso 红
    new THREE.MeshBasicMaterial({ color: INK.blue }), // 侧面：蓝——两版套印的错位感
  ];
  const star = new THREE.Mesh(starGeo, starMats);
  star.scale.setScalar(0.082);

  /* 中心纸色圆盘（logo 的纸色花芯） */
  const discGeo = new THREE.CircleGeometry(7.6, 40);
  const discMat = new THREE.MeshBasicMaterial({ color: INK.paper });
  const discFront = new THREE.Mesh(discGeo, discMat);
  discFront.position.z = 13 + 1.4 + 0.25;
  const discBack = new THREE.Mesh(discGeo, discMat);
  discBack.position.z = -(1.4 + 0.25);
  discBack.rotation.y = Math.PI;

  const starGroup = new THREE.Group();
  starGroup.add(star, discFront, discBack);
  starGroup.scale.setScalar(0.064);
  star.scale.setScalar(1);
  const STAR_BASE = { x: 0, y: 2.5, z: 0 };
  starGroup.position.set(STAR_BASE.x, STAR_BASE.y, STAR_BASE.z);
  starGroup.rotation.x = -0.3;
  rig.add(starGroup);

  /* ── 2. 墨点地形：InstancedMesh 半调点阵 ── */
  const COLS = 36;
  const ROWS = 22;
  const SPAN_X = 17;
  const SPAN_Z = 11;
  const dotGeo = new THREE.SphereGeometry(0.085, 10, 8);
  const dotMat = new THREE.MeshBasicMaterial();
  const dots = new THREE.InstancedMesh(dotGeo, dotMat, COLS * ROWS);
  dots.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

  const PALETTE = [
    { c: new THREE.Color(INK.dotQuiet), w: 0.66 },
    { c: new THREE.Color(INK.dotMid), w: 0.18 },
    { c: new THREE.Color(INK.red), w: 0.09 },
    { c: new THREE.Color(INK.blue), w: 0.05 },
    { c: new THREE.Color(INK.yellow), w: 0.02 },
  ];
  const baseColors = [];
  {
    const m = new THREE.Matrix4();
    let idx = 0;
    const pick = () => {
      let r = Math.random(), acc = 0;
      for (const p of PALETTE) { acc += p.w; if (r <= acc) return p.c; }
      return PALETTE[0].c;
    };
    for (let j = 0; j < ROWS; j++) {
      for (let i = 0; i < COLS; i++) {
        const x = (i / (COLS - 1) - 0.5) * SPAN_X;
        const z = (j / (ROWS - 1) - 0.5) * SPAN_Z;
        m.makeTranslation(x, 0, z);
        dots.setMatrixAt(idx, m);
        baseColors.push(pick());
        dots.setColorAt(idx, baseColors[idx]);
        idx++;
      }
    }
  }
  rig.add(dots);
  const TERRAIN_Y = -0.9;
  dots.position.y = TERRAIN_Y;

  /* ── 3. 交互状态 ── */
  const pointerNDC = new THREE.Vector2(10, 10); // 屏外=无涟漪
  const raycaster = new THREE.Raycaster();
  const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -TERRAIN_Y);
  const hitPoint = new THREE.Vector3();
  const localHit = new THREE.Vector3();
  let hasPointer = false;
  let rippleT = 0;

  let dragging = false;
  let lastX = 0, lastY = 0;
  let yaw = 0, pitch = 0;
  let yawVel = 0;
  const PITCH_MIN = -0.34, PITCH_MAX = 0.1;
  const PITCH_BASE = -0.1;

  const starTilt = { x: -0.28, y: 0 };

  function onPointerMove(e) {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    pointerNDC.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    hasPointer = true;
  }
  window.addEventListener("mousemove", onPointerMove, { passive: true });

  canvas.addEventListener("pointerdown", (e) => {
    dragging = true;
    lastX = e.clientX; lastY = e.clientY;
    yawVel = 0;
    stage.classList.add("dragging");
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    yawVel = dx * 0.0038;
    yaw += yawVel;
    pitch = Math.min(PITCH_MAX, Math.max(PITCH_MIN, pitch + dy * 0.0022));
  });
  const endDrag = () => { dragging = false; stage.classList.remove("dragging"); };
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
  canvas.addEventListener("pointerleave", () => { hasPointer = false; });

  /* ── 4. 渲染 ── */
  const tmpM = new THREE.Matrix4();
  const tmpC = new THREE.Color();
  const tmpV = new THREE.Vector3();
  const redInk = new THREE.Color(INK.red);
  const quiet = new THREE.Color(INK.dotQuiet);

  let running = true;
  let clockT = REDUCED ? 2.6 : 0;
  const clock = new THREE.Clock();

  function layout() {
    const w = stage.clientWidth || 1, h = stage.clientHeight || 1;
    renderer.setSize(w, h, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // 竖向舞台（移动端）时把内容居中并拉近
    const portrait = w / h < 1.05;
    rig.position.x = portrait ? 0 : 1.2;
    rig.position.z = portrait ? 1.5 : 0;
    // setSize 会清空画布：循环暂停时补渲一帧，避免 resize 后舞台空白
    if (running) return;
    if (!REDUCED && !document.hidden) { running = true; clock.getDelta(); frame(); }
    else { updateDots(clockT); renderer.render(scene, camera); }
  }
  layout();
  new ResizeObserver(layout).observe(stage);

  const waveAt = (x, z, t) =>
    Math.sin(x * 0.85 + t * 1.3) * Math.cos(z * 0.75 + t * 0.9) * 0.34 +
    Math.sin((x + z) * 0.5 + t * 0.7) * 0.14;

  function rippleAt(x, z, t) {
    if (!hasPointer) return 0;
    const dx = x - localHit.x, dz = z - localHit.z;
    const d2 = dx * dx + dz * dz;
    return Math.exp(-d2 / 1.35) * Math.sin(t * 5.2 - Math.sqrt(d2) * 2.6) * 0.85;
  }

  function updateDots(t) {
    raycaster.setFromCamera(pointerNDC, camera);
    if (hasPointer && raycaster.ray.intersectPlane(groundPlane, hitPoint)) {
      localHit.copy(hitPoint);
      rig.worldToLocal(localHit);
    }
    let idx = 0;
    for (let j = 0; j < ROWS; j++) {
      for (let i = 0; i < COLS; i++) {
        const u = i / (COLS - 1) - 0.5;
        const v = j / (ROWS - 1) - 0.5;
        const x = u * SPAN_X;
        const z = v * SPAN_Z;
        const h = waveAt(x, z, t) + rippleAt(x, z, t);
        // 屏幕空间边缘渐隐：点投影到 NDC 后按到画布边缘的距离淡出。
        // 本地坐标的渐隐会随拖拽旋转错位，导致边界生硬割切。
        // 左缘渐隐带更宽，给标题区留白。
        tmpV.set(x, h, z).applyMatrix4(dots.matrixWorld).project(camera);
        const fade = Math.min(
          1,
          Math.max(0, (tmpV.x + 1) / 0.55),
          Math.max(0, (1 - tmpV.x) / 0.22),
          Math.max(0, (1 - tmpV.y) / 0.3),
          Math.max(0, (tmpV.y + 1) / 0.45)
        );
        const s = fade * (0.9 + 0.35 * Math.max(0, h + 0.3));
        tmpM.makeScale(Math.max(0.001, s), Math.max(0.001, s), Math.max(0.001, s));
        tmpM.setPosition(x, h, z);
        dots.setMatrixAt(idx, tmpM);
        // 浪尖上墨——高度映射为向红墨过渡
        const k = Math.min(1, Math.max(0, (h + 0.42) / 1.15)) * 0.4;
        tmpC.copy(baseColors[idx]).lerp(redInk, k);
        dots.setColorAt(idx, tmpC);
        idx++;
      }
    }
    dots.instanceMatrix.needsUpdate = true;
    dots.instanceColor.needsUpdate = true;
  }

  function updateStar(t, dt) {
    if (!dragging) {
      yawVel *= 0.94;
      yaw += yawVel + 0.0022; // 空闲慢漂移
      pitch += (PITCH_BASE - pitch) * 0.02;
    }
    rig.rotation.y = yaw;
    rig.rotation.x = pitch;
    // 星标朝指针轻微倾斜 + 呼吸浮动（指针未进场时保持中立，避免加载后自翻倒）
    const px = hasPointer ? pointerNDC.x : 0;
    const py = hasPointer ? pointerNDC.y : 0;
    const tx = -0.3 + py * 0.22;
    const ty = px * 0.3;
    starTilt.x += (tx - starTilt.x) * 0.06;
    starTilt.y += (ty - starTilt.y) * 0.06;
    starGroup.rotation.x = starTilt.x;
    starGroup.rotation.y = starTilt.y;
    starGroup.position.y = STAR_BASE.y + Math.sin(t * 1.15) * 0.22;
    starGroup.rotation.z = Math.sin(t * 0.6) * 0.05;
  }

  function frame() {
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    clockT += dt;
    updateDots(clockT);
    updateStar(clockT, dt);
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  /* 离屏/切后台暂停 */
  const io = new IntersectionObserver((es) => {
    es.forEach((en) => {
      const should = en.isIntersecting && !document.hidden && !REDUCED;
      if (should && !running) { running = true; clock.getDelta(); frame(); }
      else if (!should) running = false;
    });
  }, { threshold: 0.05 });
  io.observe(stage);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) running = false;
    else if (!REDUCED) { running = true; clock.getDelta(); frame(); }
  });

  if (REDUCED) {
    // 单帧静置：一个好看的姿态
    yaw = 0.5; pitch = -0.12;
    rig.rotation.y = yaw; rig.rotation.x = pitch;
    starGroup.position.y = STAR_BASE.y;
    updateDots(clockT);
    renderer.render(scene, camera);
  } else {
    frame();
  }
}
