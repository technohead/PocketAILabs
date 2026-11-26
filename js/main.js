/* Pocket AI Labs — interactive layer
   spotlight · count-up · nav · reveal · forms */

// --- Spotlight (mouse-follow glow) ---
(function () {
  var spot = document.getElementById("spotlight");
  if (!spot) return;
  var raf = null;
  var x = innerWidth / 2, y = 200;

  function place() {
    spot.style.transform = "translate(" + x + "px, " + y + "px) translate(-50%, -50%)";
    raf = null;
  }
  window.addEventListener("pointermove", function (e) {
    x = e.clientX; y = e.clientY;
    spot.classList.add("on");
    if (raf == null) raf = requestAnimationFrame(place);
  }, { passive: true });
  window.addEventListener("pointerleave", function () { spot.classList.remove("on"); });
  window.addEventListener("blur", function () { spot.classList.remove("on"); });
  // Disable on coarse pointers (touch)
  if (matchMedia("(pointer: coarse)").matches) { spot.style.display = "none"; }
})();

// --- Count-up stats ---
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
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { animate(entry.target); io.unobserve(entry.target); }
    });
  }, { threshold: 0.4 });
  els.forEach(function (el) { io.observe(el); });
})();

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const mainNav = document.querySelector(".main-nav");

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  mainNav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      mainNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// Footer year
var yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Live latency counter (purely decorative demo)
const metric = document.getElementById("metricLat");
if (metric) {
  setInterval(() => { metric.textContent = 9 + Math.floor(Math.random() * 9); }, 1400);
}

// Scroll reveal
const revealTargets = document.querySelectorAll(
  ".card, .step, .app-card, .section-head, .hero-cta, .hero-stats, .phone, .floating-chip, .ticker, .feature, .edition-card, .shot-frame, .gallery-session, .session"
);
revealTargets.forEach((el) => el.classList.add("reveal"));

const io =
  IntersectionObserver ||
  class {
    constructor(cb) { this.cb = cb; this.els = []; }
    observe(el) { this.els.push(el); setTimeout(() => el.classList.add("in"), 200); }
    unobserve() {}
  };

const observer = new io(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealTargets.forEach((el) => observer.observe(el));

// --- Contact form client-side validation (no backend; shows confirmation) ---
const form = document.getElementById("contactForm");
const email = document.getElementById("email");
const emailError = document.getElementById("emailError");
const formStatus = document.getElementById("formStatus");

if (form && email && emailError && formStatus) {
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    emailError.textContent = "";
    formStatus.textContent = "";
    const value = email.value.trim();
    if (!value) { emailError.textContent = "Please enter your email."; email.focus(); return; }
    if (!EMAIL_RE.test(value)) { emailError.textContent = "That email looks off — try again."; email.focus(); return; }
    formStatus.textContent = `Thanks! We'll reach out to ${value} shortly.`;
    form.reset();
  });
}

// --- Notify-me coming-soon form (shared) ---
function bindNotifyForm(formId, emailId, errorId, statusId, appName) {
  var f = document.getElementById(formId);
  var em = document.getElementById(emailId);
  var err = document.getElementById(errorId);
  var st = document.getElementById(statusId);
  if (!f || !em) return;
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    if (err) err.textContent = "";
    if (st) st.textContent = "";
    var value = em.value.trim();
    if (!value) { if (err) err.textContent = "Please enter your email."; em.focus(); return; }
    if (!EMAIL_RE.test(value)) { if (err) err.textContent = "That email looks off — try again."; em.focus(); return; }
    if (st) st.textContent = "Thanks — we'll ping " + value + " when " + appName + " launches!";
    f.reset();
  });
}

bindNotifyForm("notifyForm", "notifyEmail", "notifyError", "notifyStatus", "Kartoonify");
bindNotifyForm("notifyForm", "notifyEmail", "notifyError", "notifyStatus", "SmartReceipts");
