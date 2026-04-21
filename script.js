const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#primary-nav");
const whatsappLeadButton = document.querySelector("[data-lead-track='whatsapp']");
const heroSlides = Array.from(document.querySelectorAll(".hero-slide"));
const heroDots = Array.from(document.querySelectorAll(".hero-dots button"));

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

if (whatsappLeadButton) {
  whatsappLeadButton.addEventListener("click", () => {
    const payload = JSON.stringify({
      channel: "whatsapp",
      product: "Kanolina Farm",
      page: window.location.href,
      timestamp: new Date().toISOString(),
    });

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("whatsapp-lead.php", blob);
      return;
    }

    fetch("whatsapp-lead.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  });
}

if (heroSlides.length > 1) {
  let activeHeroSlide = 0;
  let heroTimer = null;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function showHeroSlide(index) {
    activeHeroSlide = (index + heroSlides.length) % heroSlides.length;

    heroSlides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeHeroSlide;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    heroDots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeHeroSlide;
      dot.classList.toggle("is-active", isActive);
      if (isActive) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
  }

  function startHeroSlider() {
    if (reduceMotion) {
      return;
    }

    window.clearInterval(heroTimer);
    heroTimer = window.setInterval(() => {
      showHeroSlide(activeHeroSlide + 1);
    }, 6000);
  }

  heroDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showHeroSlide(index);
      startHeroSlider();
    });
  });

  startHeroSlider();
}
