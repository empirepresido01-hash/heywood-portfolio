const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const themeToggle = document.querySelector(".theme-toggle");
const year = document.querySelector("#year");
const galleryTrack = document.querySelector("#galleryTrack");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxClose = document.querySelector(".lightbox-close");
const gallerySlider = document.querySelector(".gallery-slider");
const galleryViewport = document.querySelector(".gallery-viewport");
const galleryPrevious = document.querySelector("#galleryPrevious");
const galleryNext = document.querySelector("#galleryNext");

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
  let faceDetector;
  const fullPhotoSlides = new Set(["slide13.webp", "slide16.webp"]);
  const slides = [
    "/public/picture slide/slide1.jpg",
    "/public/picture slide/slide2.webp",
    "/public/picture slide/slide3.webp",
    "/public/picture slide/slide4.webp",
    "/public/picture slide/slide5.webp",
    "/public/picture slide/slide6.webp",
    "/public/picture slide/slide7.png",
    "/public/picture slide/slide8.webp",
    "/public/picture slide/slide9.webp",
    "/public/picture slide/slide10.webp",
    "/public/picture slide/slide11.png",
    "/public/picture slide/slide12.webp",
    "/public/picture slide/slide13.webp",
    "/public/picture slide/slide14.png",
    "/public/picture slide/slide15.webp",
    "/public/picture slide/slide16.webp",
    "/public/picture slide/slide17.webp",
    "/public/picture slide/slide18.webp",
    "/public/picture slide/slide19.webp",
    "/public/picture slide/slide20.png"
  ];

  const buildCards = (items) =>
    items.map((src, index) => {
      const figure = document.createElement("figure");
      figure.className = `gallery-card${index === 0 ? " featured-frame" : ""}`;
      const filename = src.split("/").pop();
      if (fullPhotoSlides.has(filename)) {
        figure.classList.add("gallery-card--full-photo");
        figure.style.setProperty("--gallery-backdrop", `url("${src}")`);
      }
      figure.setAttribute("role", "group");
      figure.setAttribute("aria-roledescription", "slide");
      figure.setAttribute("aria-label", `${index + 1} of ${items.length}`);
      figure.setAttribute("aria-hidden", String(index !== 0));

      const image = document.createElement("img");
      image.alt = `Gallery image ${String(index + 1).padStart(2, "0")}`;
      image.width = 640;
      image.height = 960;
      if (fullPhotoSlides.has(filename)) {
        image.dataset.framing = "contain";
      }
      image.loading = "lazy";
      image.decoding = "async";
      image.onerror = () => {
        figure.style.display = "none";
      };
      image.addEventListener("load", () => applyFaceAwareCrop(image));
      image.src = src;
      figure.appendChild(image);
      return figure;
    });

  const cards = buildCards(slides);
  cards.forEach((card) => galleryTrack.appendChild(card));
  const loopCards = cards.slice(0, 3).map((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.querySelector("img").loading = "eager";
    galleryTrack.appendChild(clone);
    return clone;
  });

  const images = cards.map((card) => card.querySelector("img"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let currentSlide = 0;
  let visibleSlides = 1;
  let slideWidth = 0;
  let slideGap = 0;

  const layoutGallery = () => {
    const viewportWidth = galleryViewport.clientWidth;
    visibleSlides = viewportWidth >= 900 ? 3 : viewportWidth >= 560 ? 2 : 1;
    slideGap = parseFloat(getComputedStyle(galleryTrack).columnGap) || 0;
    slideWidth = (viewportWidth - slideGap * (visibleSlides - 1)) / visibleSlides;
    galleryTrack.style.width = `${(cards.length + loopCards.length) * (slideWidth + slideGap) - slideGap}px`;
    [...cards, ...loopCards].forEach((card) => {
      card.style.flexBasis = `${slideWidth}px`;
    });
    updateGallery();
  };

  const updateGallery = () => {
    galleryTrack.style.transform = `translateX(-${currentSlide * (slideWidth + slideGap)}px)`;
    cards.forEach((card, index) => {
      const distance = (index - currentSlide + images.length) % images.length;
      card.setAttribute("aria-hidden", String(distance >= visibleSlides));
    });
  };

  galleryTrack.addEventListener("transitionend", (event) => {
    if (event.propertyName !== "transform" || currentSlide !== images.length) return;
    currentSlide = 0;
    galleryTrack.style.transition = "none";
    updateGallery();
    requestAnimationFrame(() => galleryTrack.style.removeProperty("transition"));
  });

  const moveGallery = (direction) => {
    const lastStart = images.length - visibleSlides;
    if (direction > 0) {
      if (currentSlide >= images.length) return;
      currentSlide += 1;
    } else {
      currentSlide = currentSlide === 0 ? lastStart : currentSlide - 1;
    }
    updateGallery();
  };

  galleryPrevious.addEventListener("click", () => moveGallery(-1));
  galleryNext.addEventListener("click", () => moveGallery(1));
  gallerySlider.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      moveGallery(event.key === "ArrowRight" ? 1 : -1);
    }
  });
  layoutGallery();
  const galleryResizeObserver = new ResizeObserver(layoutGallery);
  galleryResizeObserver.observe(galleryViewport);

  if (!reducedMotion) {
    window.setInterval(() => {
      if (!document.hidden && !gallerySlider.matches(":hover") && !gallerySlider.contains(document.activeElement)) {
        moveGallery(1);
      }
    }, 5000);
  }

  const applyFaceAwareCrop = (image) => {
    if (!faceDetector || !image.complete || !image.naturalWidth) return;
    if (image.dataset.framing === "contain") return;

    try {
      const detections = faceDetector.detect(image).detections || [];
      const boxes = detections.map((item) => item.boundingBox).filter(Boolean);
      if (!boxes.length) return;

      const frameAspect = image.clientWidth / image.clientHeight;
      const cropWidth = Math.min(image.naturalWidth, image.naturalHeight * frameAspect);
      const cropHeight = cropWidth / frameAspect;
      const minX = Math.min(...boxes.map((box) => box.originX));
      const minY = Math.min(...boxes.map((box) => box.originY));
      const maxX = Math.max(...boxes.map((box) => box.originX + box.width));
      const maxY = Math.max(...boxes.map((box) => box.originY + box.height));

      const cropX = Math.max(0, Math.min(image.naturalWidth - cropWidth, (minX + maxX - cropWidth) / 2));
      const cropY = Math.max(0, Math.min(image.naturalHeight - cropHeight, (minY + maxY - cropHeight) / 2));
      const positionX = image.naturalWidth === cropWidth ? 50 : cropX / (image.naturalWidth - cropWidth) * 100;
      const positionY = image.naturalHeight === cropHeight ? 50 : cropY / (image.naturalHeight - cropHeight) * 100;

      image.style.objectFit = "cover";
      image.style.objectPosition = `${positionX}% ${positionY}%`;
    } catch (error) {
      console.warn("Could not adjust gallery crop for detected faces.", error);
    }
  };

  import("/public/vendor/mediapipe/vision_bundle.mjs")
    .then(async ({ FaceDetector, FilesetResolver }) => {
      const vision = await FilesetResolver.forVisionTasks("/public/vendor/mediapipe/wasm");
      faceDetector = await FaceDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "/public/models/blaze_face_short_range.tflite",
          delegate: "CPU"
        },
        runningMode: "IMAGE",
        minDetectionConfidence: 0.4
      });
      images.forEach(applyFaceAwareCrop);
    })
    .catch((error) => {
      console.warn("On-device face detection is unavailable; gallery images use centered crops.", error);
    });
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
