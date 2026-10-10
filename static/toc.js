const links = Array.from(document.querySelectorAll(".contents a"));
const headings = links.map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))));
let pinnedIndex = -1;

function markCurrent(currentIndex) {
  links.forEach((link, index) => {
    if (index === currentIndex) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}

function sectionAtTopOfScreen() {
  const readingLine = parseFloat(getComputedStyle(document.documentElement).fontSize) * 3;
  let currentIndex = -1;
  headings.forEach((heading, index) => {
    if (heading && heading.getBoundingClientRect().top <= readingLine) currentIndex = index;
  });
  return currentIndex;
}

function update() {
  markCurrent(pinnedIndex >= 0 ? pinnedIndex : sectionAtTopOfScreen());
}

function pinSection(hash) {
  pinnedIndex = links.findIndex((link) => link.hash === hash);
  update();
}

links.forEach((link) => link.addEventListener("click", () => pinSection(link.hash)));
window.addEventListener("hashchange", () => pinSection(location.hash));

// Smooth scrolling after a click also fires scroll events, so only direct user input releases the pin.
for (const type of ["wheel", "touchstart", "keydown", "mousedown"]) {
  window.addEventListener(type, () => (pinnedIndex = -1), { passive: true });
}

let frameRequested = false;
window.addEventListener(
  "scroll",
  () => {
    if (frameRequested) return;
    frameRequested = true;
    requestAnimationFrame(() => {
      frameRequested = false;
      update();
    });
  },
  { passive: true },
);

pinSection(location.hash);
