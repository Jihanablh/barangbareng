(function () {
  const DP_PERCENTAGE = 30;
  const fallbackImage = BBData.fallbackProductImage || "/images/products/product-placeholder.svg";
  const getProductImage = product => BBData.getProductImage?.(product) || fallbackImage;

  function todayOffset(days = 0) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  }

  function ensureCheckoutState(product) {
    state.bookingStart = state.bookingStart || todayOffset(1);
    state.bookingEnd = state.bookingEnd || todayOffset(Math.max(2, state.bookingDays || product.minDays || 1));
    state.renterNote = state.renterNote || "";
    state.orderStatus = state.orderStatus || "WAITING_DP_PAYMENT";
    state.paymentStatus = state.paymentStatus || "PENDING";
    state.orderCode = state.orderCode || `ORD-20260609-${String(product.id).padStart(4, "0")}`;
    state.invoiceNumber = state.invoiceNumber || `INV-DP-20260609-${String(product.id).padStart(4, "0")}`;
    state.finalInvoiceNumber = state.finalInvoiceNumber || `INV-FINAL-20260609-${String(product.id).padStart(4, "0")}`;
    state.codLocation = state.codLocation || product.codLocations?.[0] || `${product.location}, ${product.campus}`;
  }

  function durationFromDates() {
    const start = new Date(state.bookingStart);
    const end = new Date(state.bookingEnd);
    const diff = Math.round((end - start) / 86400000) + 1;
    state.bookingDays = Math.max(1, Number.isFinite(diff) ? diff : 1);
    return state.bookingDays;
  }

  function calculate(product, days) {
    const subtotal = product.type === "pinjam" ? 0 : product.price * days;
    const baseService = product.type === "pinjam" ? 5000 : Math.max(2500, Math.round(subtotal * 0.025));
    // USER ACCOUNT FEATURE START
    const user = window.bbUserAccount?.getSessionUser?.();
    const service = window.calculateAdminFee ? window.calculateAdminFee(baseService, user?.level || state.currentUser?.level) : baseService;
    // USER ACCOUNT FEATURE END
    const transaction = 2500;
    const total = subtotal + service + transaction;
    const dp = Math.ceil(total * DP_PERCENTAGE / 100);
    return {
      subtotal,
      service,
      transaction,
      total,
      dp,
      remaining: total - dp,
      dpPercentage: DP_PERCENTAGE,
      depositEstimate: product.type === "pinjam" ? 0 : 100000
    };
  }

  function summaryRow(label, value, cls = "") {
    return `<div class="flex justify-between gap-4"><span>${label}</span><b class="text-right ${cls}">${value}</b></div>`;
  }

  function render() {
    const product = components.selectedProduct();
    ensureCheckoutState(product);
    const days = durationFromDates();
    const total = calculate(product, days);
    return `<main class="min-h-screen bg-slate-50">
      <div class="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        ${components.pageTopBar({ backLabel: "Kembali ke Detail Produk", backTo: "product-detail", breadcrumb: ["Detail Produk", "Checkout"] })}
        <div class="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 class="mt-2 text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl lg:text-4xl">Checkout Sewa Barang</h1>
            <p class="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">Periksa kembali detail sewa sebelum melanjutkan pembayaran DP.</p>
          </div>
          <div class="flex gap-2 overflow-x-auto rounded-[24px] border border-slate-100 bg-white p-2 text-xs font-bold text-slate-500 shadow-sm">
            ${["Checkout", "Bayar DP", "Pelunasan", "Selesai"].map((label, index) => `<span class="shrink-0 rounded-2xl px-3 py-2 ${index === 0 ? "bg-blue-50 text-brand-blue" : "bg-slate-50"}">${index + 1}. ${label}</span>`).join("")}
          </div>
        </div>

        <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <section class="grid min-w-0 gap-5">
            <article class="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
              <div class="flex flex-col gap-4 sm:flex-row">
                <img src="${getProductImage(product)}" alt="${product.name}" class="h-32 w-full rounded-2xl object-cover sm:w-32" loading="lazy" onerror="this.onerror=null;this.src='${fallbackImage}'">
                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap gap-2"><span class="badge bg-blue-50 text-brand-blue">${product.category}</span><span class="badge bg-teal-50 text-teal-700">${product.status === "low" ? "Hampir Habis" : "Tersedia"}</span></div>
                  <h2 class="mt-3 text-xl font-bold text-slate-900 sm:text-2xl">${product.name}</h2>
                  <p class="mt-2 text-sm font-semibold text-slate-500">${product.owner.name}</p>
                  <p class="mt-1 text-sm font-semibold text-slate-500">${product.campus} · ${product.location}</p>
                  <p class="mt-3 text-2xl font-extrabold text-brand-blue">${product.type === "pinjam" ? "Gratis" : components.rupiah(product.price)} <span class="text-xs text-slate-500">/hari</span></p>
                </div>
              </div>
            </article>

            <article class="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
              <h2 class="text-xl font-bold text-slate-900 sm:text-2xl">Detail Penyewaan</h2>
              <div class="mt-5 grid gap-4 sm:grid-cols-2">
                <label class="text-sm font-bold text-slate-700">Tanggal Mulai<input id="checkout-start" class="field mt-2" type="date" value="${state.bookingStart}"></label>
                <label class="text-sm font-bold text-slate-700">Tanggal Selesai<input id="checkout-end" class="field mt-2" type="date" value="${state.bookingEnd}"></label>
              </div>
              <div class="mt-4 rounded-2xl bg-blue-50 p-4 text-sm font-bold text-brand-blue">Durasi Sewa: ${days} hari</div>
              <label class="mt-4 block text-sm font-bold text-slate-700">Lokasi COD
                <select id="checkout-cod" class="field mt-2">${(product.codLocations || BBData.codLocations).map(location => `<option ${location === state.codLocation ? "selected" : ""}>${location}</option>`).join("")}</select>
              </label>
              <label class="mt-4 block text-sm font-bold text-slate-700">Catatan untuk pemilik barang
                <textarea id="renter-note" maxlength="300" class="field mt-2 min-h-28" placeholder="Contoh: Saya ingin COD di lobby kampus pukul 13.00.">${state.renterNote || ""}</textarea>
              </label>
            </article>

            <article class="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
              <h2 class="text-xl font-bold text-slate-900 sm:text-2xl">Aturan Sewa</h2>
              <div class="mt-4 grid gap-3 text-sm font-semibold leading-6 text-slate-600">
                ${(product.rules || ["Gunakan barang sesuai kesepakatan.", "Pengembalian dilakukan tepat waktu.", "Kondisi barang dicek bersama saat serah terima."]).map(rule => `<p class="rounded-2xl bg-slate-50 p-4">${rule}</p>`).join("")}
              </div>
            </article>
          </section>

          <aside class="h-fit rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm lg:sticky lg:top-28">
            <h2 class="text-xl font-bold text-slate-900 sm:text-2xl">Ringkasan Pembayaran</h2>
            <div class="mt-5 grid gap-3 text-sm font-semibold text-slate-600">
              ${summaryRow("Harga sewa", `${product.type === "pinjam" ? "Gratis" : `${components.rupiah(product.price)} x ${days} hari`}`)}
              ${summaryRow("Subtotal", components.rupiah(total.subtotal))}
              ${summaryRow("Biaya layanan", components.rupiah(total.service))}
              ${summaryRow("Biaya transaksi", components.rupiah(total.transaction))}
              <div class="border-t border-dashed border-slate-200 pt-3">${summaryRow("Total", components.rupiah(total.total), "text-slate-950")}</div>
              ${summaryRow(`DP ${DP_PERCENTAGE}%`, components.rupiah(total.dp), "text-brand-blue")}
              ${summaryRow("Sisa pelunasan", components.rupiah(total.remaining), "text-teal-600")}
            </div>
            <div class="mt-5 rounded-2xl bg-teal-50 p-4 text-sm font-semibold leading-6 text-teal-800">
              <b class="block text-teal-700">Pembayaran Aman</b>
              DP akan tercatat di sistem BarangBareng. Pelunasan dilakukan sebelum serah terima barang.
            </div>
            <div class="my-5 border-t border-dashed border-slate-200"></div>
            <div class="flex justify-between gap-4 text-lg font-extrabold text-slate-950"><span>Bayar sekarang</span><span class="text-brand-blue">${components.rupiah(total.dp)}</span></div>
            <button class="mt-5 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 px-5 py-3.5 font-bold text-white shadow-md transition hover:scale-[1.01] hover:shadow-lg active:scale-[0.98]" data-create-dp-payment>Lanjut Bayar DP</button>
          </aside>
        </div>
      </div>
    </main>`;
  }

  function bind() {
    document.querySelectorAll("#checkout-start,#checkout-end").forEach(input => input.addEventListener("change", event => {
      if (event.target.id === "checkout-start") state.bookingStart = event.target.value;
      if (event.target.id === "checkout-end") state.bookingEnd = event.target.value;
      components.renderCheckout();
    }));
    document.querySelector("#renter-note")?.addEventListener("input", event => { state.renterNote = event.target.value.slice(0, 300); });
    document.querySelector("#checkout-cod")?.addEventListener("change", event => { state.codLocation = event.target.value; });
    document.querySelector("[data-create-dp-payment]")?.addEventListener("click", () => {
      const product = components.selectedProduct();
      if (product.owner.name === state.currentUser.name || product.owner.initials === state.currentUser.initials) {
        ui.toast("Kamu tidak bisa checkout barang milik sendiri");
        return;
      }
      if (!state.bookingStart || !state.bookingEnd || new Date(state.bookingEnd) < new Date(state.bookingStart)) {
        ui.toast("Tanggal sewa belum valid");
        return;
      }
      const button = document.querySelector("[data-create-dp-payment]");
      button.disabled = true;
      button.textContent = "Menyiapkan pembayaran...";
      state.orderStatus = "WAITING_DP_PAYMENT";
      state.paymentStatus = "PENDING";
      ui.toast("Checkout berhasil dibuat");
      setTimeout(() => ui.toast("QRIS pembayaran DP berhasil dibuat"), 350);
      setTimeout(() => router.navigate("payment-dp", { productId: state.orderCode }), 500);
    });
    components.bindNavEvents();
    if (window.lucide) lucide.createIcons();
  }

  window.checkout = { calculate, render, bind, durationFromDates, ensureCheckoutState, summaryRow };
})();
