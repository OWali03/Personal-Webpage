/* WebGL background — depth-layered geometric planes drifting behind the
   content. Built on OGL, loaded from the jsdelivr CDN (ogl@1.0.5 ships only
   ES modules, so this file is a module). If the CDN or WebGL is unavailable,
   the static CSS gradient on <body> carries the page. */
import {
  Renderer,
  Camera,
  Transform,
  Plane,
  Program,
  Mesh,
} from "https://cdn.jsdelivr.net/npm/ogl@1.0.5/+esm";

(function () {
  "use strict";

  var canvas = document.getElementById("gl");
  if (!canvas) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  var renderer, gl, camera, scene, mesh, program;

  try {
    renderer = new Renderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
      powerPreference: "low-power",
    });
    gl = renderer.gl;
    if (!gl) return;
  } catch (e) {
    return;
  }

  gl.clearColor(0, 0, 0, 0);

  camera = new Camera(gl, { fov: 32, near: 0.1, far: 100 });
  var CAMERA_Z = 10;
  camera.position.z = CAMERA_Z;

  scene = new Transform();

  // Half the instance count on small screens.
  var isMobile = Math.min(window.innerWidth, window.innerHeight) < 768;
  var COUNT = isMobile ? 14 : 28;

  // Per-instance attributes: position, rotation seed/speed, size, opacity, tint.
  var offsets = new Float32Array(COUNT * 3);
  var randoms = new Float32Array(COUNT * 4); // x,y: rotation phase · z: speed · w: tint
  var scales = new Float32Array(COUNT * 2);
  var alphas = new Float32Array(COUNT);

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  for (var i = 0; i < COUNT; i++) {
    var depth = rand(-7, 3); // spread across z; camera sits at z=10
    // x/y are normalized [-1,1]; the shader scales them by uSpread,
    // which tracks the camera frustum so density holds at any aspect ratio.
    offsets[i * 3 + 0] = rand(-1, 1);
    offsets[i * 3 + 1] = rand(-1, 1);
    offsets[i * 3 + 2] = depth;

    randoms[i * 4 + 0] = rand(0, Math.PI * 2);
    randoms[i * 4 + 1] = rand(0, Math.PI * 2);
    randoms[i * 4 + 2] = rand(0.02, 0.07) * (Math.random() < 0.5 ? -1 : 1);
    randoms[i * 4 + 3] = Math.random() < 0.22 ? 1 : 0; // ~1 in 5 planes carry the accent

    scales[i * 2 + 0] = rand(1.4, 3.8);
    scales[i * 2 + 1] = rand(1.0, 2.6);

    // Farther planes sit dimmer. Visible-but-recessive band: ~0.06–0.2.
    var depthFade = (depth + 7) / 10; // 0 far → 1 near
    alphas[i] = rand(0.06, 0.1) + depthFade * 0.1;
  }

  var geometry = new Plane(gl, { width: 1, height: 1 });
  geometry.addAttribute("iOffset", { instanced: 1, size: 3, data: offsets });
  geometry.addAttribute("iRandom", { instanced: 1, size: 4, data: randoms });
  geometry.addAttribute("iScale", { instanced: 1, size: 2, data: scales });
  geometry.addAttribute("iAlpha", { instanced: 1, size: 1, data: alphas });

  var vertex = [
    "attribute vec3 position;",
    "attribute vec2 uv;",
    "attribute vec3 iOffset;",
    "attribute vec4 iRandom;",
    "attribute vec2 iScale;",
    "attribute float iAlpha;",
    "uniform mat4 modelViewMatrix;",
    "uniform mat4 projectionMatrix;",
    "uniform float uTime;",
    "uniform vec2 uSpread;",
    "varying vec2 vUv;",
    "varying float vAlpha;",
    "varying float vTint;",
    "",
    "mat3 rotX(float a) {",
    "  float c = cos(a); float s = sin(a);",
    "  return mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c);",
    "}",
    "mat3 rotY(float a) {",
    "  float c = cos(a); float s = sin(a);",
    "  return mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c);",
    "}",
    "",
    "void main() {",
    "  vUv = uv;",
    "  vAlpha = iAlpha;",
    "  vTint = iRandom.w;",
    "  float t = uTime * iRandom.z;",
    "  vec3 p = position * vec3(iScale, 1.0);",
    "  p = rotY(iRandom.x + t) * rotX(iRandom.y + t * 0.7) * p;",
    "  vec3 drift = vec3(",
    "    sin(uTime * 0.04 + iRandom.x) * 0.6,",
    "    cos(uTime * 0.03 + iRandom.y) * 0.4,",
    "    0.0",
    "  );",
    "  p += vec3(iOffset.xy * uSpread, iOffset.z) + drift;",
    "  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);",
    "}",
  ].join("\n");

  var fragment = [
    "precision highp float;",
    "uniform vec3 uInk;",
    "uniform vec3 uAccent;",
    "varying vec2 vUv;",
    "varying float vAlpha;",
    "varying float vTint;",
    "",
    "void main() {",
    "  vec3 color = mix(uInk, uAccent, vTint * 0.7);",
    "  color *= 0.88 + 0.12 * vUv.y;", // faint vertical sheen
    "  float ex = smoothstep(0.44, 0.5, abs(vUv.x - 0.5));",
    "  float ey = smoothstep(0.44, 0.5, abs(vUv.y - 0.5));",
    "  float edge = max(ex, ey);", // hairline rim — reads as a glass pane edge
    "  float alpha = vAlpha + edge * 0.1;",
    "  gl_FragColor = vec4(color, alpha);",
    "}",
  ].join("\n");

  program = new Program(gl, {
    vertex: vertex,
    fragment: fragment,
    uniforms: {
      uTime: { value: 0 },
      uSpread: { value: [9, 5.5] },
      uInk: { value: [0.941, 0.933, 0.913] },
      uAccent: { value: [0.29, 0.62, 1.0] },
    },
    transparent: true,
    depthWrite: false,
    depthTest: false,
    cullFace: false,
  });

  mesh = new Mesh(gl, { geometry: geometry, program: program });
  mesh.setParent(scene);

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.perspective({ aspect: window.innerWidth / window.innerHeight });
    // Visible half-extents at z=0 (distance CAMERA_Z), plus bleed margin.
    var halfH = Math.tan((camera.fov * Math.PI) / 360) * CAMERA_Z;
    var halfW = halfH * camera.aspect;
    program.uniforms.uSpread.value = [halfW * 1.4 + 1, halfH * 1.25];
  }
  window.addEventListener("resize", resize);
  resize();

  // Scroll parallax — camera eases slightly forward as the page scrolls.
  var scrollTarget = 0;
  var scrollCurrent = 0;

  function onScroll() {
    var max = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight
    );
    scrollTarget = window.scrollY / max;
  }

  function renderFrame(time) {
    program.uniforms.uTime.value = time;
    scrollCurrent += (scrollTarget - scrollCurrent) * 0.05;
    camera.position.z = CAMERA_Z - scrollCurrent * 2.4;
    camera.position.y = -scrollCurrent * 0.8;
    renderer.render({ scene: scene, camera: camera });
  }

  // Reduced motion: draw one static, composed frame and stop.
  if (reduceMotion.matches) {
    renderFrame(40);
    return;
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var rafId = null;
  var startTime = performance.now();

  function loop(now) {
    rafId = requestAnimationFrame(loop);
    renderFrame((now - startTime) / 1000);
  }

  function start() {
    if (rafId === null) {
      startTime = performance.now() - program.uniforms.uTime.value * 1000;
      rafId = requestAnimationFrame(loop);
    }
  }

  function stop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // Pause when the tab is hidden.
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else start();
  });

  // Honor a live switch to reduced motion.
  reduceMotion.addEventListener("change", function (e) {
    if (e.matches) stop();
    else start();
  });

  start();
})();
