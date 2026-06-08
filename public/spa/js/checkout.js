(function () {
  function calculate(product, days) {
    const subtotal = product.type === "pinjam" ? 0 : product.price * days;
    const service = product.type === "pinjam" ? 5000 : Math.round(subtotal * 0.05);
    const transaction = 2500;
    const total = subtotal + service + transaction;
    return { subtotal, service, transaction, total, dp: Math.ceil(total / 2), remaining: Math.floor(total / 2) };
  }

  function render() {
    const product = components.selectedProduct();
    const total = calculate(product, state.bookingDays);
    const coinNeed = Math.ceil(total.dp / 1000);
    const after = state.coinBalance - coinNeed;
    const step = state.checkoutStep;
    return `<div class="mx-auto max-w-5xl px-4 pb-16 pt-28 sm:px-6 lg:px-8"><div class="card p-6">
      <div class="grid grid-cols-4 gap-2">${["Detail", "Bayar DP", "Konfirmasi", "QR COD"].map((label, index) => `<div class="rounded-2xl p-3 text-center text-sm font-bold ${step > index ? "bg-gradient-brand text-white" : "bg-slate-100 text-slate-500"}">${index + 1}. ${label}</div>`).join("")}</div>
      ${step === 1 ? `<section class="mt-7"><h1 class="text-2xl font-extrabold text-slate-950">Konfirmasi Detail</h1><div class="mt-5 grid gap-5 md:grid-cols-[180px_1fr]"><img src="${product.image}" alt="${product.name}" class="h-40 w-full rounded-3xl object-cover"><div><h2 class="text-xl font-bold">${product.name}</h2><p class="mt-2 text-slate-500">${state.bookingDays} hari · ${product.location}</p><p class="mt-2 text-slate-500">COD: Gerbang kampus utama</p><label class="mt-4 block text-sm font-bold">Voucher</label><select id="checkout-voucher" class="field mt-2">${components.optionList(["all", ...BBData.vouchers.map(v => v.code)], state.appliedVoucher || "all", "Tanpa Voucher")}</select></div></div><div class="mt-5 rounded-3xl bg-slate-50 p-5 font-semibold">${components.feeRows(total)}</div><button class="btn-primary mt-6 rounded-2xl px-6 py-3" data-next-step="2">Lanjut Pembayaran</button></section>` : ""}
      ${step === 2 ? `<section class="mt-7"><h1 class="text-2xl font-extrabold text-slate-950">Bayar DP</h1><div class="mt-5 grid gap-3 sm:grid-cols-2"><button class="rounded-3xl p-5 font-bold ${state.paymentMethod === "coins" ? "bg-brand-blue text-white" : "bg-slate-100"}" data-payment="coins">Koin Saldo</button><button class="rounded-3xl p-5 font-bold ${state.paymentMethod === "qris" ? "bg-brand-blue text-white" : "bg-slate-100"}" data-payment="qris">QRIS BarangBareng</button></div>${state.paymentMethod === "coins" ? coinPaymentCard(coinNeed, after) : `<div class="mt-5 rounded-3xl bg-slate-50 p-6 text-center"><h3 class="font-extrabold">QRIS BarangBareng</h3><p class="mt-2 font-bold text-brand-blue">${components.rupiah(total.dp)}</p><div id="pay-qr" class="qr-container mx-auto mt-5 w-[220px]"></div><p class="mt-4 text-sm text-slate-600">Scan QRIS menggunakan aplikasi e-wallet atau mobile banking.</p><p class="mt-2 font-bold text-amber-600">Berlaku <span id="pay-timer">15:00</span></p><button class="btn-primary mt-5 rounded-2xl px-5 py-3" data-qris-paid>Saya Sudah Bayar</button><button class="btn-secondary ml-2 mt-5 rounded-2xl px-5 py-3" data-payment="coins">Ganti Metode</button><button class="btn-secondary ml-2 mt-5 rounded-2xl px-5 py-3" data-nav="payment-qr">Lihat Halaman QR</button></div>`}</section>` : ""}
      ${step === 3 ? `<section class="mt-10 text-center"><i data-lucide="check-circle-2" class="mx-auto h-16 w-16 text-teal-500"></i><h1 class="mt-4 text-2xl font-extrabold text-slate-950">DP berhasil diterima</h1><p class="mt-2 text-slate-500">Menunggu pemilik mengonfirmasi pesanan kamu.</p><button class="btn-primary mt-6 rounded-2xl px-6 py-3" data-next-step="4">Simulasi Dikonfirmasi</button></section>` : ""}
      ${step === 4 ? `<section class="mt-10 text-center"><h1 class="text-2xl font-extrabold text-slate-950">Terkonfirmasi + QR Serah Terima</h1><p class="mt-2 text-slate-500">Lokasi COD: ${product.location}</p><div id="handover-qr" class="qr-container mx-auto mt-5 w-[220px]"></div><p class="mt-4 font-bold text-brand-blue">Berlaku <span id="handover-timer">10:00</span></p><button class="btn-secondary mt-4 rounded-2xl px-5 py-3" data-refresh-qr>Refresh QR</button><button class="btn-primary ml-2 mt-4 rounded-2xl px-5 py-3" data-share-location>Bagikan Lokasi</button></section>` : ""}
    </div></div>`;
  }

  function coinPaymentCard(coinNeed, after) {
    const insufficient = after < 0;
    return `<div class="mt-5 overflow-hidden rounded-[28px] border border-blue-100 bg-white shadow-card">
      <div class="flex items-center gap-4 bg-gradient-brand p-5 text-white">
        <span class="grid h-14 w-14 place-items-center rounded-2xl bg-white/18">${components.icon("wallet", "h-7 w-7")}</span>
        <div><p class="text-sm font-bold text-white/80">Pembayaran DP dengan Koin</p><h2 class="text-2xl font-extrabold">Ringkasan Saldo</h2></div>
      </div>
      <div class="grid gap-3 p-5 md:grid-cols-3">
        <div class="rounded-3xl bg-blue-50 p-4"><p class="text-sm font-bold text-blue-700">Saldo awal</p><strong class="mt-2 block text-2xl text-blue-700">${state.coinBalance} Koin</strong></div>
        <div class="rounded-3xl bg-amber-50 p-4"><p class="text-sm font-bold text-amber-700">DP dibayar</p><strong class="mt-2 block text-2xl text-amber-700">-${coinNeed} Koin</strong></div>
        <div class="rounded-3xl bg-teal-50 p-4"><p class="text-sm font-bold text-teal-700">Saldo akhir</p><strong class="mt-2 block text-2xl text-teal-700">${after} Koin</strong></div>
      </div>
      ${insufficient ? `<div class="mx-5 mb-5 rounded-3xl bg-red-50 p-4 font-semibold text-red-700">Saldo belum cukup. Tambah minimal ${Math.abs(after)} Koin untuk melanjutkan.</div><button class="btn-primary mx-5 mb-5 rounded-2xl px-5 py-3" data-nav="topup">Top Up Koin</button>` : `<button class="btn-primary mx-5 mb-5 rounded-2xl px-5 py-3" data-pay-coins>Bayar dengan Koin</button>`}
    </div>`;
  }

  function bind() {
    document.querySelectorAll("[data-next-step]").forEach(button => button.addEventListener("click", () => { state.checkoutStep = Number(button.dataset.nextStep); components.renderCheckout(); }));
    document.querySelectorAll("[data-payment]").forEach(button => button.addEventListener("click", () => { state.paymentMethod = button.dataset.payment; components.renderCheckout(); }));
    document.querySelector("[data-pay-coins]")?.addEventListener("click", () => {
      const total = calculate(components.selectedProduct(), state.bookingDays);
      state.coinBalance -= Math.ceil(total.dp / 1000);
      state.checkoutStep = 3;
      ui.toast("DP berhasil diterima");
      animations.confetti();
      components.renderCheckout();
    });
    document.querySelector("[data-qris-paid]")?.addEventListener("click", () => {
      state.checkoutStep = 3;
      ui.toast("DP berhasil diterima");
      animations.confetti();
      components.renderCheckout();
    });
    document.querySelector("[data-refresh-qr]")?.addEventListener("click", () => {
      qris.createQr("handover-qr", `BB-COD-${Date.now()}`);
      qris.startTimer("handover-timer", 600);
      ui.toast("QR diperbarui");
    });
    document.querySelector("[data-share-location]")?.addEventListener("click", () => ui.toast("Lokasi COD dibagikan"));
    document.querySelector("#checkout-voucher")?.addEventListener("change", event => {
      state.appliedVoucher = event.target.value === "all" ? null : event.target.value;
      ui.toast(state.appliedVoucher ? `Voucher ${state.appliedVoucher} diterapkan` : "Voucher dihapus");
    });
    if (state.paymentMethod === "qris" && state.checkoutStep === 2) {
      qris.createQr("pay-qr", `BB-DP-${state.selectedProductId}-${Date.now()}`);
      qris.startTimer("pay-timer", 900);
    }
    if (state.checkoutStep === 4) {
      qris.createQr("handover-qr", `BB-COD-${state.selectedProductId}-${Date.now()}`);
      qris.startTimer("handover-timer", 600);
    }
  }

  window.checkout = { calculate, render, bind };
})();
