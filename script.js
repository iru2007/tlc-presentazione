const slides = Array.from(document.querySelectorAll(".slide"));
const track = document.getElementById("slidesTrack");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");
const slideCounter = document.getElementById("slideCounter");
const dotsContainer = document.getElementById("slideDots");
const presentation = document.querySelector(".presentation");
const presentBtn = document.getElementById("presentBtn");
const presentBtnLabel = document.getElementById("presentBtnLabel");

let currentSlide = 0;

function formatNumber(value) {
  return String(value).padStart(2, "0");
}

function goToSlide(index) {
  currentSlide = Math.max(0, Math.min(index, slides.length - 1));

  track.style.transform = `translateX(-${currentSlide * 100}%)`;

  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === currentSlide;
    slide.classList.toggle("active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });

  const progress = ((currentSlide + 1) / slides.length) * 100;
  progressBar.style.width = `${progress}%`;
  slideCounter.textContent = `${formatNumber(currentSlide + 1)} / ${formatNumber(slides.length)}`;

  prevBtn.disabled = currentSlide === 0;
  nextBtn.disabled = currentSlide === slides.length - 1;

  Array.from(dotsContainer.children).forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === currentSlide);
    dot.setAttribute("aria-current", dotIndex === currentSlide ? "step" : "false");
  });
}

function createDots() {
  slides.forEach((slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Vai alla slide ${index + 1}`);
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });
}

prevBtn.addEventListener("click", () => goToSlide(currentSlide - 1));
nextBtn.addEventListener("click", () => goToSlide(currentSlide + 1));

function getFullscreenElement() {
  return document.fullscreenElement || document.webkitFullscreenElement;
}

function updatePresentButton() {
  const isPresenting = Boolean(getFullscreenElement());
  presentBtnLabel.textContent = isPresenting ? "Esci" : "Presenta";
  presentBtn.setAttribute(
    "aria-label",
    isPresenting ? "Esci dalla presentazione a schermo intero" : "Avvia presentazione a schermo intero"
  );
}

async function togglePresentationMode() {
  try {
    if (getFullscreenElement()) {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    } else if (presentation.requestFullscreen) {
      await presentation.requestFullscreen();
      presentation.focus();
    } else if (presentation.webkitRequestFullscreen) {
      presentation.webkitRequestFullscreen();
      presentation.focus();
    }
  } catch (error) {
    presentBtnLabel.textContent = "Non disponibile";
    window.setTimeout(updatePresentButton, 1500);
  }
}

presentBtn.addEventListener("click", togglePresentationMode);

document.addEventListener("fullscreenchange", updatePresentButton);
document.addEventListener("webkitfullscreenchange", updatePresentButton);

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    event.preventDefault();
    goToSlide(currentSlide + 1);
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    goToSlide(currentSlide - 1);
  }

  if (event.key === "Home") {
    event.preventDefault();
    goToSlide(0);
  }

  if (event.key === "End") {
    event.preventDefault();
    goToSlide(slides.length - 1);
  }
});

let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener("touchend", (event) => {
  touchEndX = event.changedTouches[0].screenX;
  const distance = touchStartX - touchEndX;

  if (Math.abs(distance) > 55) {
    goToSlide(distance > 0 ? currentSlide + 1 : currentSlide - 1);
  }
}, { passive: true });

createDots();
goToSlide(0);
