(function () {
  function toast(message) {
    const mount = document.querySelector("#toast-mount");
    if (!mount) return;
    const el = document.createElement("div");
    el.className = "toast rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg";
    el.textContent = message;
    mount.appendChild(el);
    requestAnimationFrame(() => el.classList.add("visible"));
    setTimeout(() => {
      el.classList.add("hiding");
      setTimeout(() => el.remove(), 260);
    }, 2600);
  }

  window.ui = { toast };
})();
