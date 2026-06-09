(function () {
  const DP_PERCENTAGE = 30;

  function todayOffset(days = 0) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  }

  function ensureCheckoutState(product) {
    state.bookingStart = state.bookingStart || todayOffset(1);
    state.bookingEnd = state.bookingEnd || todayOffset(Math.max(2, state.bookingDays || product.minDays || 1));
    state.renterNote = state.renterNote || "";
    state.orderStatus = state.orderStatus || "PENDING";
    state.paymentStatus = state.paymentStatus || "PENDING";
    state.orderCode = state.orderCode || `ORD-20260609-${String(product.id).padStart(4, "0")}`;
    state.invoiceNumber = state.invoiceNumber || `INV-DP-20260609-${String(product.id).padStart(4, "0")}`;
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
    const service = product.type === "pinjam" ? 5000 : Math.max(2500, Math.round(subtotal * 0.025));
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
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-500">Beranda &gt; Detail Produk &gt; Checkout</p>
            <h1 class="mt-2 text-2xl font-extrabold text-slate-950 lg:text-3xl">Checkout Penyewaan</h1>
            <p class="mt-2 text-slate-500">Lengkapi detail penyewaan sebelum melanjutkan pembayaran DP.</p>
          </div>
          <button class="w-fit text-sm font-bold text-brand-blue hover:text-teal-600" data-product="${product.id}">${components.icon("arrow-left", "h-4 w-4")} Kembali ke Detail Produk</button>
        </div>

        <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <section class="grid min-w-0 gap-5">
            <article class="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm">
              <div class="flex flex-col gap-4 sm:flex-row">
                <img src="${product.image}" alt="${product.name}" class="h-32 w-full rounded-2xl object-cover sm:w-32" onerror="this.src='${product.image}'">
                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap gap-2"><span class="badge bg-blue-50 text-brand-blue">${product.category}</span><span class="badge bg-teal-50 text-teal-700">${product.status === "low" ? "Hampir Habis" : "Tersedia"}</span></div>
                  <h2 class="mt-3 text-xl font-extrabold text-slate-950">${product.name}</h2>
                  <p class="mt-2 text-sm font-semibold text-slate-500">${product.location} | ${product.campus}</p>
                  <p class="mt-2 text-sm font-semibold text-slate-500">Rating ${product.rating} | ${product.reviewCount} penilaian</p>
                  <p class="mt-3 text-2xl font-extrabold text-brand-blue">${product.type === "pinjam" ? "Gratis" : components.rupiah(product.price)} <span class="text-xs text-slate-500">/hari</span></p>
                </div>
              </div>
            </article>

            <article class="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm">
              <h2 class="text-xl font-extrabold text-slate-950">Detail Penyewaan</h2>
              <div class="mt-5 grid gap-4 sm:grid-cols-2">
                <label class="text-sm font-bold text-slate-700">Tanggal Mulai Sewa<input id="checkout-start" class="field mt-2" type="date" value="${state.bookingStart}"></label>
                <label class="text-sm font-bold text-slate-700">Tanggal Selesai Sewa<input id="checkout-end" class="field mt-2" type="date" value="${state.bookingEnd}"></label>
              </div>
              <div class="mt-4 rounded-2xl bg-blue-50 p-4 text-sm font-bold text-brand-blue">Durasi sewa: ${days} hari</div>
              <label class="mt-4 block text-sm font-bold text-slate-700">Catatan untuk pemilik barang
                <textarea id="renter-note" maxlength="300" class="field mt-2 min-h-28" placeholder="Contoh: Saya ingin COD di lobby kampus pukul 13.00.">${state.renterNote || ""}</textarea>
              </label>
              <p class="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-600">Pastikan tanggal sewa sudah sesuai. Perubahan jadwal setelah pembayaran perlu dikonfirmasi oleh pemilik barang.</p>
            </article>
          </section>

          <aside class="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 class="text-xl font-extrabold text-slate-950">Ringkasan Pembayaran</h2>
            <div class="mt-5 grid gap-3 text-sm font-semibold text-slate-600">
              ${summaryRow("Harga sewa", `${product.type === "pinjam" ? "Gratis" : components.rupiah(product.price)} / hari`)}
              ${summaryRow("Lama sewa", `${days} hari`)}
              ${summaryRow("Total biaya sewa", components.rupiah(total.subtotal))}
              ${summaryRow("Biaya layanan", components.rupiah(total.service))}
              ${summaryRow("Biaya transaksi", components.rupiah(total.transaction))}
              ${summaryRow(`DP ${DP_PERCENTAGE}%`, components.rupiah(total.dp), "text-brand-blue")}
              ${summaryRow("Sisa pembayaran", components.rupiah(total.remaining), "text-teal-600")}
              ${summaryRow("Estimasi deposit", total.depositEstimate ? components.rupiah(total.depositEstimate) : "Tidak ada")}
            </div>
            <p class="mt-4 rounded-2xl bg-slate-50 p-3 text-xs font-semibold leading-5 text-slate-500">Deposit bersifat opsional dan dapat disesuaikan berdasarkan kebijakan pemilik barang.</p>
            <div class="my-5 border-t border-dashed border-slate-200"></div>
            <div class="flex justify-between gap-4 text-lg font-extrabold text-slate-950"><span>Bayar sekarang</span><span class="text-brand-blue">${components.rupiah(total.dp)}</span></div>
            <button class="mt-5 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 px-5 py-4 text-base font-bold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]" data-create-dp-payment>Lanjut Pembayaran DP</button>
            <p class="mt-4 text-center text-xs font-semibold leading-5 text-slate-500">Dengan melanjutkan, kamu menyetujui detail penyewaan dan nominal DP yang harus dibayar.</p>
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
      button.textContent = "Membuat pembayaran...";
      state.orderStatus = "WAITING_DP_PAYMENT";
      state.paymentStatus = "PENDING";
      ui.toast("Checkout berhasil dibuat");
      setTimeout(() => ui.toast("QRIS pembayaran DP berhasil dibuat"), 350);
      setTimeout(() => router.navigate("payment-qr"), 500);
    });
    components.bindNavEvents();
    if (window.lucide) lucide.createIcons();
  }

  window.checkout = { calculate, render, bind, durationFromDates, ensureCheckoutState, summaryRow };
})();
