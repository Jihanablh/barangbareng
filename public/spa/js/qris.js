(function () {
  let timers = {};

  function createQr(id, text) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = "";
    const size = Number(el.dataset.size || 220);
    if (window.QRCode) {
      new QRCode(el, { text, width: size, height: size });
    } else {
      el.innerHTML = `<div class="grid place-items-center rounded-2xl bg-slate-100 text-sm font-bold text-slate-500" style="height:${size}px;width:${size}px">${text}</div>`;
    }
    const logo = document.createElement("span");
    logo.className = "qr-logo-overlay";
    logo.textContent = "BB";
    el.appendChild(logo);
  }

  function startTimer(id, seconds = 900) {
    clearInterval(timers[id]);
    const el = document.getElementById(id);
    if (!el) return;
    let left = seconds;
    const tick = () => {
      const min = String(Math.floor(left / 60)).padStart(2, "0");
      const sec = String(left % 60).padStart(2, "0");
      el.textContent = `${min}:${sec}`;
      el.classList.toggle("timer-urgent", left < 120);
      if (left <= 0) {
        clearInterval(timers[id]);
        el.textContent = "Kadaluarsa";
      }
      left -= 1;
    };
    tick();
    timers[id] = setInterval(tick, 1000);
  }

  window.qris = { createQr, startTimer };
})();
