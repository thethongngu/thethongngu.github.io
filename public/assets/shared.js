// Shared functionality across all pages

// Tagline hover functionality
function initTaglineHover() {
  const taglineElement = document.getElementById('tagline');
  if (!taglineElement) return;
  
  const originalTagline = "life is about maximizing (long-term) good experience";
  const hoverTagline = "by building stupid things on the internet";
  
  taglineElement.addEventListener('mouseenter', () => {
    taglineElement.style.opacity = '0';
    setTimeout(() => {
      taglineElement.textContent = hoverTagline;
      taglineElement.style.opacity = '1';
    }, 150);
  });
  
  taglineElement.addEventListener('mouseleave', () => {
    taglineElement.style.opacity = '0';
    setTimeout(() => {
      taglineElement.textContent = originalTagline;
      taglineElement.style.opacity = '1';
    }, 150);
  });
}

// Homepage navigation functionality
function initHomepageNavigation() {
  const headerTitle = document.querySelector('.header-title');
  if (!headerTitle) return;
  
  headerTitle.style.cursor = 'pointer';
  headerTitle.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}

// Initialize all shared functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initTaglineHover();
  initHomepageNavigation();
}); 