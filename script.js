// ===== DOM Elements =====
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section");
const statNumbers = document.querySelectorAll(".stat-number");

// ===== Navbar Scroll Effect =====
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  // Add shadow on scroll
  if (currentScroll > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  lastScroll = currentScroll;
});

// ===== Mobile Menu Toggle =====
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");

  // Prevent body scroll when menu is open
  document.body.style.overflow = navMenu.classList.contains("active")
    ? "hidden"
    : "";
});

// ===== Smooth Scrolling for Navigation Links =====
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const navHeight = navbar.offsetHeight;
      const targetPosition = targetSection.offsetTop - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });

      // Close mobile menu if open
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
});

// ===== Active Navigation Link Based on Scroll =====
const observerOptions = {
  threshold: 0.3,
  rootMargin: "-80px 0px -80px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute("id");

      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${id}`) {
          link.classList.add("active");
        }
      });
    }
  });
}, observerOptions);

sections.forEach((section) => {
  observer.observe(section);
});

// ===== Counter Animation for Stats =====
const animateCounter = (element) => {
  const target = parseInt(element.getAttribute("data-target"));
  const duration = 2000; // 2 seconds
  const increment = target / (duration / 16); // 60fps
  let current = 0;

  const updateCounter = () => {
    current += increment;

    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };

  updateCounter();
};

// Observe stats section for counter animation
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        statNumbers.forEach((stat) => {
          if (stat.textContent === "0") {
            animateCounter(stat);
          }
        });
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

const statsSection = document.querySelector(".stats");
if (statsSection) {
  statsObserver.observe(statsSection);
}

// ===== Scroll Animations for Elements =====
const animateOnScroll = () => {
  const elements = document.querySelectorAll(
    ".service-card, .team-card, .info-item"
  );

  const scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, index * 100);
          scrollObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  elements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    scrollObserver.observe(element);
  });
};

// Initialize scroll animations (will be replaced by GSAP)
// animateOnScroll();

// ===== Add loading animation =====
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// ===== Performance: Debounce scroll events =====
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// ===== GSAP Animations =====
if (typeof gsap !== "undefined") {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Hero animations
  const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

  heroTimeline
    .from(".hero-badge", {
      opacity: 0,
      y: 30,
      duration: 0.8,
    })
    .from(
      ".title-line",
      {
        opacity: 0,
        y: 80,
        duration: 1,
        stagger: 0.2,
      },
      "-=0.5"
    )
    .from(
      ".hero-subtitle",
      {
        opacity: 0,
        y: 30,
        duration: 0.8,
      },
      "-=0.6"
    )
    .from(
      ".hero-buttons",
      {
        opacity: 0,
        y: 30,
        duration: 0.8,
      },
      "-=0.6"
    )
    .from(
      ".hero-stats",
      {
        opacity: 0,
        y: 40,
        duration: 0.8,
      },
      "-=0.6"
    )
    .from(
      ".scroll-indicator",
      {
        opacity: 0,
        y: 20,
        duration: 0.6,
      },
      "-=0.4"
    );

  // Section animations - fade up on scroll
  gsap.utils.toArray(".section-header").forEach((header) => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: "top 85%",
        end: "top 60%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 60,
      duration: 1,
      ease: "power3.out",
    });
  });

  // Service cards animation
  gsap.utils.toArray(".service-card").forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        end: "top 65%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 80,
      duration: 0.8,
      delay: index * 0.1,
      ease: "power3.out",
    });
  });

  // Team cards animation
  gsap.utils.toArray(".team-card").forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        end: "top 65%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 80,
      scale: 0.9,
      duration: 0.8,
      delay: index * 0.15,
      ease: "back.out(1.7)",
    });
  });

  // About section animation
  gsap.from(".about-text", {
    scrollTrigger: {
      trigger: ".about-text",
      start: "top 80%",
      end: "top 55%",
      toggleActions: "play none none reverse",
    },
    opacity: 0,
    x: -80,
    duration: 1,
    ease: "power3.out",
  });

  gsap.from(".about-image", {
    scrollTrigger: {
      trigger: ".about-image",
      start: "top 80%",
      end: "top 55%",
      toggleActions: "play none none reverse",
    },
    opacity: 0,
    x: 80,
    duration: 1,
    ease: "power3.out",
  });

  // Stat items animation
  gsap.utils.toArray(".stat-item").forEach((stat, index) => {
    gsap.from(stat, {
      scrollTrigger: {
        trigger: stat,
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 40,
      duration: 0.6,
      delay: index * 0.1,
      ease: "power2.out",
    });
  });

  // Footer animation
  gsap.from(".footer-section", {
    scrollTrigger: {
      trigger: ".footer",
      start: "top 90%",
      toggleActions: "play none none reverse",
    },
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out",
  });

  // Parallax effect for hero content
  gsap.to(".hero-content", {
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1,
    },
    y: 200,
    opacity: 0.3,
    ease: "none",
  });

  // Parallax effect for gradient orbs
  gsap.to(".orb-1", {
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1.5,
    },
    y: 150,
    x: -50,
    ease: "none",
  });

  gsap.to(".orb-2", {
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 2,
    },
    y: 100,
    x: 50,
    ease: "none",
  });

  gsap.to(".orb-3", {
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1,
    },
    y: 200,
    ease: "none",
  });
}

// ===== Create Floating Particles =====
const createParticles = () => {
  const particlesContainer = document.getElementById("particles");
  if (!particlesContainer) return;

  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";

    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const animationDuration = Math.random() * 20 + 15;
    const delay = Math.random() * 5;
    const opacity = Math.random() * 0.5 + 0.2;

    particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: white;
            border-radius: 50%;
            left: ${left}%;
            top: 100%;
            opacity: ${opacity};
            animation: float-up ${animationDuration}s ${delay}s infinite ease-in;
            box-shadow: 0 0 ${size * 2}px rgba(255, 255, 255, 0.5);
        `;

    particlesContainer.appendChild(particle);
  }

  // Add particle animation
  const style = document.createElement("style");
  style.textContent = `
        @keyframes float-up {
            0% {
                transform: translateY(0) translateX(0);
                opacity: 0;
            }
            10% {
                opacity: 0.7;
            }
            90% {
                opacity: 0.7;
            }
            100% {
                transform: translateY(-100vh) translateX(${
                  Math.random() * 100 - 50
                }px);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(style);
};

// Initialize particles
createParticles();

// ===== Portfolio Filter =====
const filterButtons = document.querySelectorAll(".filter-btn");
const portfolioItems = document.querySelectorAll(".portfolio-item");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    // Add active class to clicked button
    button.classList.add("active");

    const filterValue = button.getAttribute("data-filter");

    portfolioItems.forEach((item) => {
      if (
        filterValue === "all" ||
        item.getAttribute("data-category") === filterValue
      ) {
        item.style.display = "block";
        // Animate in
        setTimeout(() => {
          item.style.opacity = "1";
          item.style.transform = "scale(1)";
        }, 10);
      } else {
        // Animate out
        item.style.opacity = "0";
        item.style.transform = "scale(0.8)";
        setTimeout(() => {
          item.style.display = "none";
        }, 300);
      }
    });
  });
});

// Initialize portfolio items
portfolioItems.forEach((item) => {
  item.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  item.style.opacity = "1";
  item.style.transform = "scale(1)";
});

// ===== FAQ Accordion =====
const initFAQ = () => {
  const faqItems = document.querySelectorAll(".faq-item");

  if (faqItems.length > 0) {
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");

      if (question) {
        question.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();

          const isActive = item.classList.contains("active");

          // Close all FAQ items
          faqItems.forEach((faqItem) => {
            faqItem.classList.remove("active");
          });

          // Open clicked item if it wasn't active
          if (!isActive) {
            item.classList.add("active");
          }
        });
      }
    });
  }
};

// Initialize FAQ when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFAQ);
} else {
  initFAQ();
}

// ===== GSAP Animations for New Sections =====
if (typeof gsap !== "undefined") {
  // Portfolio items animation
  gsap.utils.toArray(".portfolio-item").forEach((item, index) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 90%",
        end: "top 65%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 60,
      scale: 0.9,
      duration: 0.6,
      delay: index * 0.1,
      ease: "power3.out",
    });
  });

  // Portfolio filter buttons animation
  gsap.from(".filter-btn", {
    scrollTrigger: {
      trigger: ".portfolio-filters",
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
    opacity: 0,
    y: 30,
    duration: 0.6,
    stagger: 0.1,
    ease: "power3.out",
  });

  // Partners animation
  const partnerLogos = document.querySelectorAll(".partner-logo");
  if (partnerLogos.length > 0) {
    gsap.from(".partner-logo", {
      scrollTrigger: {
        trigger: ".partners",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 0.7,
      scale: 0.9,
      duration: 0.5,
      stagger: 0.1,
      ease: "back.out(1.7)",
    });
  }

  // Pricing cards animation
  gsap.utils.toArray(".pricing-card").forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        end: "top 60%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 80,
      scale: 0.9,
      duration: 0.8,
      delay: index * 0.15,
      ease: "back.out(1.7)",
    });
  });

  // Testimonial cards animation
  gsap.utils.toArray(".testimonial-card").forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        end: "top 65%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      x: index % 2 === 0 ? -60 : 60,
      duration: 0.8,
      delay: index * 0.1,
      ease: "power3.out",
    });
  });

  // FAQ items animation
  gsap.utils.toArray(".faq-item").forEach((item, index) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      x: -40,
      duration: 0.6,
      delay: index * 0.1,
      ease: "power2.out",
    });
  });
}

// ===== Smooth Scroll for All Navigation Links =====
const allNavLinks = document.querySelectorAll('a[href^="#"]');

allNavLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");

    if (targetId === "#") return;

    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetPosition = targetSection.offsetTop - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });

      // Close mobile menu if open
      if (navMenu.classList.contains("active")) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        document.body.style.overflow = "";
      }
    }
  });
});

// ===== Initialize =====
console.log("Sample Corp - Initialized with GSAP");
console.log("Built with HTML, CSS, JavaScript, and GSAP");
console.log("New sections: Portfolio, Partners, Pricing, Testimonials, FAQ");
