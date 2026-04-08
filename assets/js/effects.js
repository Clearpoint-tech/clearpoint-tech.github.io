// Scroll fade-ins
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('article.post > *').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});
