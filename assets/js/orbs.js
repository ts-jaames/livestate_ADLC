/* ─────────────────────────────────────────────────────────────
   orbs.js — vanilla mount for vendored thinking-orbs engine.
   MIT © Jakub Antalik. No React, no build.
   ───────────────────────────────────────────────────────────── */

import { resolvePreset, MODE_DRAWS } from "../vendor/thinking-orbs/engine.es.js";

function reducedMotion() {
  return typeof matchMedia !== "undefined" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function mount(canvas) {
  var state = canvas.getAttribute("data-orb") || "working";
  var requested = Number(canvas.getAttribute("data-orb-size")) || 20;
  var size = requested === 64 ? 64 : 20;
  var when = canvas.getAttribute("data-orb-when") || "";
  var dark = true;
  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var dpr = Math.min(2, (typeof devicePixelRatio !== "undefined" && devicePixelRatio) || 1);
  canvas.width = Math.round(size * dpr);
  canvas.height = Math.round(size * dpr);
  canvas.style.width = size + "px";
  canvas.style.height = size + "px";

  var preset = resolvePreset(state, size);
  var draw = MODE_DRAWS[preset.mode];
  var speed = preset.speed || 1;
  if (typeof draw !== "function") return;

  function frame(tSec) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    draw(ctx, size, tSec, dark, preset.opts);
  }

  if (reducedMotion()) {
    frame(0.6);
    return;
  }

  var raf = 0;
  var running = false;
  var paused = true;
  var offscreen = false;

  function loop() {
    frame((performance.now() / 1000) * speed);
    if (running) raf = requestAnimationFrame(loop);
  }
  function start() {
    if (running || paused || offscreen) return;
    running = true;
    raf = requestAnimationFrame(loop);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  function shouldRun() {
    if (when.indexOf("conf-") === 0) {
      return (document.body.getAttribute("data-conf") || "") === when.slice(5);
    }
    return true;
  }

  function sync() {
    var on = shouldRun();
    paused = !on;
    if (on) start();
    else {
      stop();
      frame(0.6);
    }
  }

  if (typeof IntersectionObserver !== "undefined") {
    new IntersectionObserver(function (entries) {
      offscreen = !(entries[0] && entries[0].isIntersecting);
      if (offscreen) stop();
      else sync();
    }).observe(canvas);
  }

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") stop();
    else sync();
  });

  var mo = new MutationObserver(sync);
  mo.observe(document.body, { attributes: true, attributeFilter: ["data-run", "data-conf"] });

  frame(0.6);
  sync();
  canvas.setAttribute("data-mounted", "1");
}

document.querySelectorAll("canvas[data-orb]").forEach(mount);
