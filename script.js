const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const themeToggle = document.querySelector(".theme-toggle");
const year = document.querySelector("#year");
const galleryTrack = document.querySelector("#galleryTrack");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxClose = document.querySelector(".lightbox-close");

const setTheme = (theme) => {
  const nextTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem("portfolio-theme", nextTheme);
  if (themeToggle) {
    themeToggle.setAttribute("aria-label", `Switch to ${nextTheme === "dark" ? "light" : "dark"} mode`);
  }
};

const toggleMenu = () => {
  if (!navLinks || !navToggle) return;
  const isOpen = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
};

if (year) {
  year.textContent = new Date().getFullYear();
}

const savedTheme = localStorage.getItem("portfolio-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (savedTheme) {
  setTheme(savedTheme);
} else if (prefersDark) {
  setTheme("dark");
}

if (navToggle) {
  navToggle.addEventListener("click", toggleMenu);
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.dataset.theme === "dark";
    setTheme(isDark ? "light" : "dark");
  });
}

if (navLinks) {
  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navLinks.classList.remove("is-open");
      if (navToggle) {
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
      }
    }
  });
}

if (galleryTrack) {
  const slides = [
    "/public/picture slide/slide1.jpg",
    "/public/picture slide/slide2.jpg",
    "/public/picture slide/slide3.jpg",
    "/public/picture slide/slide4.jpg",
    "/public/picture slide/slide5.jpg",
    "/public/picture slide/slide6.jpg",
    "/public/picture slide/slide7.png",
    "/public/picture slide/slide8.jpg",
    "/public/picture slide/slide9.jpg",
    "/public/picture slide/slide10.jpg",
    "/public/picture slide/slide11.png",
    "/public/picture slide/slide12.jpg",
    "/public/picture slide/slide13.jpg",
    "/public/picture slide/slide14.png",
    "/public/picture slide/slide15.jpg",
    "/public/picture slide/slide16.png",
    "/public/picture slide/slide17.jpg",
    "/public/picture slide/slide18.png",
    "/public/picture slide/slide19.jpg",
    "/public/picture slide/slide20.png"
  ];

  const buildCards = (items, duplicate = false) =>
    items.map((src, index) => {
      const figure = document.createElement("figure");
      figure.className = `gallery-card${duplicate ? "" : index === 0 ? " featured-frame" : ""}`;
      if (duplicate) {
        figure.setAttribute("aria-hidden", "true");
      }

      const image = document.createElement("img");
      image.src = src;
      image.alt = duplicate ? "" : `Gallery image ${String(index + 1).padStart(2, "0")}`;
      image.width = 640;
      image.height = 960;
      image.loading = "lazy";
      image.decoding = "async";
      figure.appendChild(image);
      return figure;
    });

  const cards = [...buildCards(slides), ...buildCards(slides, true)];
  cards.forEach((card) => galleryTrack.appendChild(card));
}

const galleryCards = Array.from(document.querySelectorAll(".gallery-card img"));

if (galleryCards.length && lightbox && lightboxImage) {
  const openLightbox = (src, alt) => {
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  galleryCards.forEach((card) => {
    card.addEventListener("click", () => {
      if (card.getAttribute("src")) {
        openLightbox(card.getAttribute("src"), card.getAttribute("alt"));
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });
}
