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

// Scroll reveal
const revealTargets = document.querySelectorAll(
  ".feature-card, .step, .section-head, .hero-cta, .companion-copy, .hero-visual"
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

// --- Nova Diary: "Notify me" coming-soon form (client-side validation) ---
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
    if (status) status.textContent = "Thanks &mdash; we'll ping " + value + " when Nova Diary launches!";
    form.reset();
  });
})();
