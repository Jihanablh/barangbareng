(function () {
  const modalRouteMap = {
    login: "login",
    register: "register",
    topup: "topup",
    chat: "chat",
    upload: "upload-product",
    checkout: "checkout",
    "qr-handover": "qr-handover",
    "payment-qr": "payment-qr",
    "payment-verification": "payment-verification",
    "transaction-success": "transaction-success"
  };

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

  function openModal(type) {
    const route = modalRouteMap[type];
    if (!route) return;
    router.navigate(route);
  }

  function closeModals() {
    document.querySelectorAll("[id^='modal-'][id$='-mount']").forEach(mount => {
      mount.innerHTML = "";
    });
  }

  window.ui = { toast, openModal, closeModals };
})();
