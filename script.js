// Handle current year in footer
(function setCurrentYear() {
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear().toString();
  }
})();

// Smooth scroll and active link management
(function initNavigation() {
  const navLinks = document.querySelectorAll(".nav__link");
  const sections = Array.from(document.querySelectorAll("section[id]"));
  const navToggle = document.querySelector(".nav__toggle");
  const navMenu = document.querySelector(".nav__menu");

  // Close mobile menu
  function closeMenu() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove("nav__menu--open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  // Toggle mobile menu
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      const isOpen = navMenu.classList.toggle("nav__menu--open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  const roles = [
    "Computer Science Student",
    "Aspiring Software Developer",
    "Web Developer",
    "UI/UX Enthusiast",
  ];

  let index = 0;
  const roleElement = document.querySelector(".fade-role");

  function changeRole() {
    // Fade out
    roleElement.style.opacity = 0;

    setTimeout(() => {
      // Change text
      roleElement.textContent = roles[index];

      // Fade in
      roleElement.style.opacity = 1;

      // Next index
      index = (index + 1) % roles.length;
    }, 500);
  }

  // Change every 2 seconds
  setInterval(changeRole, 2000);

  // Initial call
  changeRole();

  // Smooth scroll with offset
  function handleNavClick(event) {
    const link = event.currentTarget;
    const href = link.getAttribute("href");

    if (!href || !href.startsWith("#")) return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    const navHeight = document.querySelector(".site-header")?.offsetHeight || 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    const offsetTop = targetTop - navHeight + 2;

    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });

    closeMenu();
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", handleNavClick);
  });

  // Update active link based on scroll position
  function updateActiveLink() {
    const scrollPos = window.scrollY;
    const viewportHeight = window.innerHeight;

    let currentSectionId = "home";

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const offsetTop = scrollPos + rect.top;

      if (scrollPos + viewportHeight / 3 >= offsetTop) {
        currentSectionId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      const id = href.replace("#", "");
      if (id === currentSectionId) {
        link.classList.add("nav__link--active");
      } else {
        link.classList.remove("nav__link--active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  window.addEventListener("load", updateActiveLink);
})();

// Reveal-on-scroll animations using Intersection Observer
(function initRevealOnScroll() {
  const revealElements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    // Fallback: show all elements
    revealElements.forEach((el) => el.classList.add("reveal--visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal--visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -40px 0px" },
  );

  revealElements.forEach((el, index) => {
    // Small stagger via transition delay
    el.style.transitionDelay = `${Math.min(index * 0.06, 0.4)}s`;
    observer.observe(el);
  });
})();

// Contact form handling (no backend – show toast)
(function initContactForm() {
  const form = document.querySelector(".contact__form");
  const toast = document.querySelector(".toast");
  let toastTimeoutId;

  if (!form || !toast) return;

  function showToast(message) {
    const messageElement = toast.querySelector(".toast__message");
    if (messageElement && typeof message === "string") {
      messageElement.textContent = message;
    }

    toast.classList.add("toast--visible");
    clearTimeout(toastTimeoutId);
    toastTimeoutId = window.setTimeout(() => {
      toast.classList.remove("toast--visible");
    }, 2800);
  }

  function validateField(field) {
    const isValid = field.checkValidity();
    field.setAttribute("aria-invalid", isValid ? "false" : "true");
    return isValid;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameField = form.querySelector("#name");
    const emailField = form.querySelector("#email");
    const messageField = form.querySelector("#message");

    const fields = [nameField, emailField, messageField].filter(Boolean);
    let allValid = true;

    fields.forEach((field) => {
      if (!validateField(field)) {
        allValid = false;
      }
    });

    if (!allValid) {
      showToast("Please fill in all required fields correctly.");
      return;
    }

    form.reset();
    fields.forEach((field) => field.setAttribute("aria-invalid", "false"));
    showToast("Thank you! Your message has been recorded.");
  });

  form.addEventListener(
    "blur",
    function (event) {
      const target = event.target;
      if (
        !target ||
        !(
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement
        )
      )
        return;
      if (target.required) {
        validateField(target);
      }
    },
    true,
  );
})();
