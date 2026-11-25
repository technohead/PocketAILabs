/* Pocket AI Labs — Kartoonify interactive layer */

// Spotlight
(function () {
  var spot = document.getElementById("spotlight");
  if (!spot) return;
  var raf = null, x = innerWidth / 2, y = 200;
  function place() { spot.style.transform = "translate(" + x + "px, " + y + "px) translate(-50%, -50%)"; raf = null; }
  window.addEventListener("pointermove", function (e) { x = e.clientX; y = e.clientY; spot.classList.add("on"); if (raf == null) raf = requestAnimationFrame(place); }, { passive: true });
  window.addEventListener("pointerleave", function () { spot.classList.remove("on"); });
  window.addEventListener("blur", function () { spot.classList.remove("on"); });
  if (matchMedia("(pointer: coarse)").matches) spot.style.display = "none";
})();

// Count-up
(function () {
  var els = document.querySelectorAll("[data-count]");
  if (!els.length) return;
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function animate(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var prefix = el.getAttribute("data-prefix") || "";
    if (reduce || isNaN(target)) { el.textContent = prefix + target + suffix; return; }
    var dur = 1400, start = null;
    function tick(now) {
      if (!start) start = now;
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var io = new IntersectionObserver(function (entries) { entries.forEach(function (en) { if (en.isIntersecting) { animate(en.target); io.unobserve(en.target); } }); }, { threshold: 0.4 });
  els.forEach(function (el) { io.observe(el); });
})();

// Nav
const navToggle = document.getElementById("navToggle");
const mainNav = document.querySelector(".main-nav");
if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => { const open = mainNav.classList.toggle("open"); navToggle.setAttribute("aria-expanded", String(open)); });
  mainNav.addEventListener("click", (e) => { if (e.target.tagName === "A") { mainNav.classList.remove("open"); navToggle.setAttribute("aria-expanded", "false"); } });
}

// Footer year
var yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Scroll reveal
const revealTargets = document.querySelectorAll(
  ".section-head, .feature-card, .step, .companion-copy, .hero-visual, .shot, .hero-cta, .hero-points, .shot-frame, .gallery, .session"
);
revealTargets.forEach((el) => el.classList.add("reveal"));
const io = IntersectionObserver || class { constructor(cb){ this.cb = cb; } observe(el){ setTimeout(() => el.classList.add("in"), 200); } unobserve(){} };
const observer = new io((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("in"); observer.unobserve(entry.target); } }); }, { threshold: 0.12 });
revealTargets.forEach((el) => observer.observe(el));
