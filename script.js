const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.project-card, .service-card, .step-card, .testimonial-card, .contact-box').forEach((el) => {
  el.classList.add('reveal');
  observer.observe(el);
});
