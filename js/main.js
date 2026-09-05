// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const mainNav = document.querySelector(".main-nav");

navToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

// Close nav when a link is tapped (mobile)
mainNav.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    mainNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Live latency counter (purely decorative demo)
const metric = document.getElementById("metricLat");
if (metric) {
  setInterval(() => {
    metric.textContent = 9 + Math.floor(Math.random() * 9);
  }, 1400);
}

// Scroll reveal
const revealTargets = document.querySelectorAll(
  ".card, .step, .app-card, .section-head, .hero-cta, .hero-stats, .phone, .floating-chip"
);
revealTargets.forEach((el) => el.classList.add("reveal"));

const io =
  IntersectionObserver ||
  class {
    constructor(cb) {
      this.cb = cb;
      this.els = [];
    }
    observe(el) {
      this.els.push(el);
      // fallback: reveal after a short delay
      setTimeout(() => el.classList.add("in"), 200);
    }
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

// Contact form client-side validation (no backend; shows confirmation)
const form = document.getElementById("contactForm");
const email = document.getElementById("email");
const emailError = document.getElementById("emailError");
const formStatus = document.getElementById("formStatus");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  emailError.textContent = "";
  formStatus.textContent = "";

  const value = email.value.trim();
  if (!value) {
    emailError.textContent = "Please enter your email.";
    email.focus();
    return;
  }
  if (!EMAIL_RE.test(value)) {
    emailError.textContent = "That email looks off — try again.";
    email.focus();
    return;
  }

  formStatus.textContent = `Thanks! We'll reach out to ${value} shortly.`;
  form.reset();
});

// --- Cartoonify: "Notify me" coming-soon form (client-side validation) ---
(function () {
  var form = document.getElementById("notifyForm");
  var email = document.getElementById("notifyEmail");
  var error = document.getElementById("notifyError");
  var status = document.getElementById("notifyStatus");
  if (!form || !email) return;
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (error) error.textContent = "";
    if (status) status.textContent = "";

    var value = email.value.trim();
    if (!value) {
      if (error) error.textContent = "Please enter your email.";
      email.focus();
      return;
    }
    if (!EMAIL_RE.test(value)) {
      if (error) error.textContent = "That email looks off &mdash; try again.";
      email.focus();
      return;
    }
    if (status) status.textContent = "Thanks &mdash; we'll ping " + value + " when Kartoonify launches!";
    form.reset();
  });
})();

// --- SmartReceipts: "Notify me" coming-soon form (client-side validation) ---
(function () {
  var form = document.getElementById("notifyForm");
  var email = document.getElementById("notifyEmail");
  var error = document.getElementById("notifyError");
  var status = document.getElementById("notifyStatus");
  if (!form || !email) return;
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (error) error.textContent = "";
    if (status) status.textContent = "";

    var value = email.value.trim();
    if (!value) {
      if (error) error.textContent = "Please enter your email.";
      email.focus();
      return;
    }
    if (!EMAIL_RE.test(value)) {
      if (error) error.textContent = "That email looks off &mdash; try again.";
      email.focus();
      return;
    }
    if (status) status.textContent = "Thanks &mdash; we'll ping " + value + " when SmartReceipts launches!";
    form.reset();
  });
})();
