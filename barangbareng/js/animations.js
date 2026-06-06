(function () {
  function refresh() {
    if (window.lucide) lucide.createIcons();
    document.documentElement.classList.add("js-reveal");
    document.querySelectorAll(".reveal").forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("visible");
      }
      observer.observe(el);
    });
    document.querySelectorAll("[data-counter]").forEach(counter => animateCounter(counter));
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  function animateCounter(el) {
    if (el.dataset.done) return;
    el.dataset.done = "true";
    const target = Number(el.dataset.counter);
    const suffix = el.dataset.suffix || "";
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 32));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      el.textContent = current.toLocaleString("id-ID") + suffix;
    }, 24);
  }

  function confetti() {
    for (let i = 0; i < 34; i += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.top = "-20px";
      piece.style.width = `${6 + Math.random() * 8}px`;
      piece.style.height = `${8 + Math.random() * 12}px`;
      piece.style.background = ["#2563EB", "#14B8A6", "#F59E0B", "#8B5CF6"][i % 4];
      piece.style.setProperty("--duration", `${1.1 + Math.random() * 1.1}s`);
      piece.style.setProperty("--delay", `${Math.random() * .35}s`);
      piece.style.setProperty("--rot", `${360 + Math.random() * 540}deg`);
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 2400);
    }
  }

  window.animations = { refresh, confetti };
})();
