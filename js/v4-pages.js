(function () {
  const rupiah = value => components.rupiah(Number(value || 0));
  const icon = (name, cls = "h-5 w-5") => components.icon(name, cls);
  const product = () => components.selectedProduct();
  const img = item => `<img src="${item.image}" alt="${item.name}" class="h-full w-full rounded-3xl object-cover" onerror="this.src='${item.image}'">`;

  function shell(title, subtitle, body, width = "max-w-5xl") {
    return `<div class="mx-auto ${width} px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <button class="btn-secondary mb-5 rounded-2xl px-4 py-2" data-nav="home">${icon("arrow-left", "h-4 w-4")} Beranda</button>
      <div class="mb-6"><p class="font-bold text-brand-blue">BarangBareng</p><h1 class="mt-2 text-3xl font-extrabold text-slate-950">${title}</h1><p class="mt-2 text-slate-500">${subtitle}</p></div>
      ${body}
    </div>`;
  }

  function bindBase() {
    components.bindNavEvents();
    document.querySelectorAll("[data-topup-amount]").forEach(button => button.addEventListener("click", () => {
      state.topupAmount = Number(button.dataset.topupAmount);
      viewInit[router.currentView]?.();
    }));
    if (window.lucide) lucide.createIcons();
  }

  function renderLogin() {
    document.querySelector("#login-view").innerHTML = shell("Masuk Akun", "Lanjutkan transaksi sewa, top up, dan dashboard lewat halaman penuh.", `<section class="card grid gap-6 p-6 lg:grid-cols-[1fr_.8fr]">
      <form class="grid gap-4"><input class="field" placeholder="Email kampus atau no. HP"><input class="field" type="password" placeholder="Password"><button class="btn-primary rounded-2xl px-5 py-3" data-login-success>Masuk</button><button type="button" class="btn-secondary rounded-2xl px-5 py-3" data-nav="register">Belum punya akun? Daftar</button></form>
      <aside class="rounded-3xl bg-blue-50 p-5 text-blue-800"><h2 class="font-extrabold">Akun demo proposal</h2><p class="mt-2 text-sm font-semibold">Semua proses ditampilkan sebagai halaman SPA di tab yang sama.</p></aside>
    </section>`);
    bindBase();
    document.querySelector("[data-login-success]")?.addEventListener("click", event => { event.preventDefault(); ui.toast("Masuk berhasil"); router.navigate("dashboard-buyer"); });
  }

  function renderRegister() {
    const step = state.registerStep;
    const stepBar = `<div class="grid grid-cols-4 gap-2">${["Akun", "Verifikasi", "Top Up", "Selesai"].map((label, index) => `<button class="rounded-2xl p-3 text-sm font-bold ${step === index + 1 ? "bg-brand-blue text-white" : step > index + 1 ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-500"}" data-register-step="${index + 1}">${index + 1}. ${label}</button>`).join("")}</div>`;
    const content = step === 1 ? registerAccountStep() : step === 2 ? registerVerificationStep() : step === 3 ? registerTopupStep() : registerWelcomeStep();
    document.querySelector("#register-view").innerHTML = shell("Daftar Mahasiswa", "Registrasi empat langkah lengkap di halaman yang sama.", `<section class="card p-6">${stepBar}<div class="mt-6">${content}</div><div class="mt-6 flex justify-between"><button class="btn-secondary rounded-2xl px-5 py-3" data-register-prev>Kembali</button><button class="btn-primary rounded-2xl px-5 py-3" data-register-next>${step === 4 ? "Selesai" : "Lanjut"}</button></div></section>`);
    bindBase();
    document.querySelectorAll("[data-register-step]").forEach(button => button.addEventListener("click", () => { state.registerStep = Number(button.dataset.registerStep); renderRegister(); }));
    document.querySelector("[data-register-prev]")?.addEventListener("click", () => { state.registerStep = Math.max(1, state.registerStep - 1); renderRegister(); });
    document.querySelector("[data-register-next]")?.addEventListener("click", () => { if (state.registerStep === 4) return router.navigate("browse"); state.registerStep += 1; renderRegister(); });
    document.querySelector("[data-register-paid]")?.addEventListener("click", () => ui.toast("Top up pertama terdeteksi"));
    if (step === 3) qris.createQr("register-qr", `BB-FIRST-TOPUP-${state.topupAmount}`);
  }

  function registerAccountStep() {
    return `<div class="grid gap-4 md:grid-cols-2">
      <input class="field" placeholder="Nama lengkap">
      <input class="field" placeholder="Email">
      <input class="field" placeholder="Nomor HP">
      <input class="field" type="password" placeholder="Password">
      <input class="field" type="password" placeholder="Konfirmasi password">
      <select class="field"><option>Penyewa</option><option>Pemilik Barang</option><option>Keduanya</option></select>
      <label class="flex gap-3 rounded-3xl bg-slate-50 p-4 text-sm font-semibold text-slate-600 md:col-span-2"><input type="checkbox" checked> Saya menyetujui syarat dan ketentuan BarangBareng.</label>
      <label class="flex gap-3 rounded-3xl bg-slate-50 p-4 text-sm font-semibold text-slate-600 md:col-span-2"><input type="checkbox" checked> Saya menyetujui kebijakan privasi.</label>
    </div>`;
  }

  function registerVerificationStep() {
    return `<div class="grid gap-5 lg:grid-cols-[1fr_.9fr]">
      <section class="grid gap-4">
        <article class="rounded-3xl bg-slate-50 p-5"><div class="flex items-center justify-between"><h3 class="font-extrabold">Upload KTP atau Kartu Mahasiswa</h3><span class="badge bg-teal-50 text-teal-700">Dokumen terverifikasi</span></div><div class="mt-4 grid h-40 place-items-center rounded-3xl border border-dashed border-slate-300 bg-white text-sm font-bold text-slate-400">Preview dokumen</div><p class="mt-3 text-sm font-semibold text-slate-500">OCR dummy: ${state.verification.ocrName} - ${state.verification.ocrCampus}</p></article>
        <article class="rounded-3xl bg-slate-50 p-5"><div class="flex items-center justify-between"><h3 class="font-extrabold">Verifikasi Selfie</h3><span class="badge bg-teal-50 text-teal-700">Wajah terverifikasi</span></div><div class="mt-4 grid h-40 place-items-center rounded-[28px] bg-slate-900 text-center text-white"><div><p class="text-4xl font-extrabold">3..2..1</p><p class="mt-2 text-sm text-white/70">Frame kamera dummy</p></div></div></article>
      </section>
      <aside class="rounded-3xl bg-blue-50 p-5 text-blue-800"><h3 class="font-extrabold">Verifikasi OTP 6 Digit</h3><p class="mt-2 text-sm font-semibold">OTP dummy: 123456.</p><div class="mt-4 grid grid-cols-6 gap-2">${"123456".split("").map(num => `<input class="field h-12 text-center font-extrabold" value="${num}" maxlength="1">`).join("")}</div><div class="mt-4 rounded-2xl bg-white p-4 text-sm font-bold text-teal-700">Nomor HP aktif dan terverifikasi.</div></aside>
    </div>`;
  }

  function registerTopupStep() {
    return `<div class="grid gap-6 lg:grid-cols-[1fr_300px]"><div><p class="font-semibold text-slate-600">1 Koin = Rp1.000. Top up pertama wajib QRIS BarangBareng, minimum 20 Koin.</p><div class="mt-4 grid grid-cols-2 gap-3">${[20000, 50000, 100000, 200000].map(value => `<button class="rounded-2xl ${state.topupAmount === value ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-700"} p-4 font-bold" data-topup-amount="${value}">${rupiah(value)}</button>`).join("")}</div><input class="field mt-3" placeholder="Custom nominal"><button class="btn-primary mt-4 rounded-2xl px-5 py-3" data-register-paid>Saya Sudah Bayar</button></div><div><div id="register-qr" class="qr-container"></div><p class="mt-3 text-center text-sm font-bold text-amber-600">QRIS BarangBareng</p></div></div>`;
  }

  function registerWelcomeStep() {
    return `<div class="text-center"><i data-lucide="party-popper" class="mx-auto h-16 w-16 text-teal-500"></i><h2 class="mt-4 text-2xl font-extrabold">Akun berhasil dibuat</h2><div class="mx-auto mt-5 grid max-w-2xl gap-3 text-left md:grid-cols-2">${["Dokumen terverifikasi", "Selfie terverifikasi", "Nomor HP aktif", "Koin berhasil ditambahkan"].map(text => `<div class="rounded-3xl bg-teal-50 p-4 font-bold text-teal-700">${text}</div>`).join("")}</div><div class="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><button class="btn-primary rounded-2xl px-5 py-3" data-nav="browse">Jelajah Barang</button><button class="btn-secondary rounded-2xl px-5 py-3" data-nav="upload-product">Sewakan Barang Pertama</button><button class="btn-secondary rounded-2xl px-5 py-3" data-nav="profile">Lengkapi Profil</button></div></div>`;
  }

  function renderTopupPage() {
    document.querySelector("#topup-view").innerHTML = shell("Top Up Koin QRIS", "1 Koin = Rp1.000. Pembayaran hanya via QRIS BarangBareng.", `<section class="card grid gap-6 p-6 lg:grid-cols-[1fr_280px]"><div><div class="grid grid-cols-2 gap-3">${[20000, 50000, 100000, 200000].map(value => `<button class="rounded-2xl ${state.topupAmount === value ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-700"} p-4 font-bold" data-topup-amount="${value}">${rupiah(value)}</button>`).join("")}</div><input class="field mt-3" placeholder="Custom nominal"><div class="mt-5 rounded-3xl bg-blue-50 p-4 font-semibold text-blue-700">Saldo setelah berhasil: ${state.coinBalance + state.topupAmount / 1000} Koin</div><button class="btn-primary mt-5 rounded-2xl px-5 py-3" data-topup-paid-page>Saya Sudah Bayar</button></div><div><div id="topup-page-qr" class="qr-container"></div><p class="mt-3 text-center text-sm font-bold text-amber-600">Berlaku <span id="topup-page-timer">15:00</span></p></div></section>`);
    bindBase();
    document.querySelector("[data-topup-paid-page]")?.addEventListener("click", () => { state.coinBalance += state.topupAmount / 1000; animations.confetti(); router.navigate("transaction-success"); });
    qris.createQr("topup-page-qr", `BB-TOPUP-${state.topupAmount}-${Date.now()}`);
    qris.startTimer("topup-page-timer", 900);
  }

  function renderChatPage() {
    const item = product();
    document.querySelector("#chat-view").innerHTML = shell("Chat Pemilik", `Diskusi langsung untuk ${item.name}.`, `<section class="card p-6"><div class="rounded-3xl bg-slate-50 p-4"><div class="chat-bubble-left">Halo, barangnya tersedia. COD bisa di ${item.location}.</div><div id="chat-stream" class="mt-3 flex flex-col gap-2"></div></div><div class="mt-4 grid gap-2 md:grid-cols-4">${["Tanya ketersediaan", "Tanya kondisi", "Tanya lokasi COD", "Tanya kelengkapan"].map(text => `<button class="btn-secondary rounded-2xl px-4 py-3 text-left" data-chat="${text}">${text}</button>`).join("")}</div><textarea class="field mt-4 min-h-28" placeholder="Tulis pesan..."></textarea><button class="btn-primary mt-4 rounded-2xl px-5 py-3" data-send-chat>Kirim</button></section>`);
    bindBase();
    document.querySelectorAll("[data-chat]").forEach(button => button.addEventListener("click", () => document.querySelector("#chat-stream")?.insertAdjacentHTML("beforeend", `<div class="chat-bubble-right">${button.dataset.chat}</div>`)));
    document.querySelector("[data-send-chat]")?.addEventListener("click", () => ui.toast("Pesan terkirim"));
  }

  function productForm(item, buttonText, attr) {
    const fallback = BBData.products[0];
    const viewItem = item.image ? item : { ...fallback, ...item, name: item.name || "Preview Listing Baru", price: item.price || 0, image: fallback.image };
    return `<section class="grid gap-6 lg:grid-cols-[1fr_340px]">
      <form class="card grid gap-4 p-6">
        <div class="grid gap-3 md:grid-cols-2"><div class="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5"><p class="font-bold">Upload foto utama</p><div class="mt-3 h-36">${img(viewItem)}</div></div><div class="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5"><p class="font-bold">Upload gallery</p><div class="mt-3 grid grid-cols-3 gap-2">${viewItem.gallery.slice(0, 3).map(src => `<img src="${src}" alt="Gallery" class="h-20 rounded-2xl object-cover">`).join("")}</div></div></div>
        <input class="field" value="${item.name || ""}" placeholder="Nama barang">
        <div class="grid gap-3 md:grid-cols-2"><select class="field">${BBData.categories.map(category => `<option ${category.name === item.category ? "selected" : ""}>${category.name}</option>`).join("")}</select><input class="field" value="${item.subcategory || ""}" placeholder="Subkategori"></div>
        <textarea class="field min-h-32" placeholder="Deskripsi">${item.description || ""}</textarea>
        <div class="grid gap-3 md:grid-cols-3"><input class="field" value="${item.condition || ""}" placeholder="Kondisi barang (%)"><select class="field"><option>Status tersedia</option><option>Hampir habis</option><option>Nonaktif</option></select><input class="field" value="${item.badges?.[0] || ""}" placeholder="Badge"></div>
        <div class="grid gap-3 md:grid-cols-4"><select class="field"><option ${item.type === "sewa" ? "selected" : ""}>Sewa Berbayar</option><option ${item.type === "pinjam" ? "selected" : ""}>Pinjam Gratis</option></select><input class="field" value="${item.price || ""}" placeholder="Harga per hari"><input class="field" value="${item.minDays || ""}" placeholder="Minimal hari"><input class="field" value="${item.maxDays || ""}" placeholder="Maksimal hari"></div>
        <input class="field" placeholder="Biaya layanan jika pinjam gratis" value="${item.type === "pinjam" ? "5000" : ""}">
        <textarea class="field min-h-24" placeholder="Aturan penggunaan">${item.notes || ""}</textarea>
        <textarea class="field min-h-24" placeholder="Catatan pemilik">${item.notes || ""}</textarea>
        <div class="grid gap-3 md:grid-cols-2"><select class="field">${BBData.campuses.map(campus => `<option ${campus === item.campus ? "selected" : ""}>${campus}</option>`).join("")}</select><input class="field" value="${item.location || ""}" placeholder="Area lokasi"></div>
        <div class="grid gap-3 md:grid-cols-2"><select class="field">${BBData.codLocations.map(loc => `<option>${loc}</option>`).join("")}</select><input class="field" placeholder="Detail alamat COD" value="${item.location || ""}"></div>
        <textarea class="field min-h-24" placeholder="Kelengkapan barang">${(item.includes || []).join(", ")}</textarea>
        <button class="btn-primary rounded-2xl px-5 py-3" ${attr}>${buttonText}</button>
      </form>
      <aside class="booking-card-sticky card h-fit p-5"><p class="font-bold text-slate-500">Preview listing</p><div class="mt-3 h-52">${img(viewItem)}</div><h2 class="mt-4 text-xl font-extrabold">${viewItem.name}</h2><p class="mt-2 text-sm text-slate-500">${viewItem.category} - ${viewItem.campus}</p><p class="mt-3 text-2xl font-extrabold text-brand-blue">${viewItem.type === "pinjam" ? "Gratis" : rupiah(viewItem.price)} <span class="text-xs text-slate-500">/hari</span></p><p class="mt-4 text-sm font-semibold text-slate-600">Foto real, kelengkapan, aturan COD, dan catatan pemilik tampil di preview sebelum disimpan.</p></aside>
    </section>`;
  }

  function renderUploadProduct() {
    document.querySelector("#upload-product-view").innerHTML = shell("Upload Barang", "Tambahkan listing baru lewat halaman penuh.", productForm({}, "Simpan Draft Listing", "data-save-upload"), "max-w-6xl");
    bindBase();
    document.querySelector("[data-save-upload]")?.addEventListener("click", event => { event.preventDefault(); ui.toast("Draft listing tersimpan"); router.navigate("dashboard-seller"); });
  }

  function renderEditProduct() {
    const item = product();
    document.querySelector("#edit-product-view").innerHTML = shell("Edit Barang", `Perbarui listing ${item.name}.`, productForm(item, "Simpan Perubahan", "data-save-edit"), "max-w-6xl");
    bindBase();
    document.querySelector("[data-save-edit]")?.addEventListener("click", event => {
      event.preventDefault();
      const button = event.currentTarget;
      button.textContent = "Menyimpan...";
      button.disabled = true;
      setTimeout(() => {
        state.editProductDraft[item.id] = { savedAt: Date.now() };
        ui.toast("Perubahan listing berhasil disimpan");
        router.navigate("dashboard-seller");
      }, 1500);
    });
  }

  function renderProductStatistics() {
    const item = product();
    const statCards = [["Total Dilihat", "1.284"], ["Total Wishlist", 20 + item.id], ["Total Booking", item.rentedCount], ["Booking Selesai", Math.max(1, item.rentedCount - 7)], ["Pendapatan", rupiah(item.price * Math.max(item.rentedCount, 1))], ["Conversion Rate", "8.6%"]];
    document.querySelector("#product-statistics-view").innerHTML = shell("Statistik Barang", `Analitik performa untuk ${item.name}.`, `<section class="grid gap-6 lg:grid-cols-[320px_1fr]"><aside class="card p-5"><div class="h-52">${img(item)}</div><h2 class="mt-4 text-xl font-extrabold">${item.name}</h2><p class="mt-2 text-slate-500">${item.status === "low" ? "Hampir Habis" : "Tersedia"} - ${item.category}</p><p class="mt-3 text-2xl font-extrabold text-brand-blue">${item.type === "pinjam" ? "Gratis" : rupiah(item.price)} <span class="text-xs text-slate-500">/hari</span></p><div class="mt-4 grid gap-2 text-sm font-semibold text-slate-600"><span>Rating ${item.rating}</span><span>${item.reviewCount} ulasan</span><span>${item.rentedCount} disewa</span><span>${20 + item.id} wishlist</span><span>1.284 dilihat</span></div><button class="btn-primary mt-5 w-full rounded-2xl px-5 py-3" data-edit-product="${item.id}">Edit Barang</button><button class="btn-secondary mt-3 w-full rounded-2xl px-5 py-3" data-product="${item.id}">Lihat Halaman Produk</button></aside><div><div class="grid gap-4 md:grid-cols-3">${statCards.map(stat => `<article class="card p-5"><p class="text-sm font-semibold text-slate-500">${stat[0]}</p><strong class="mt-2 block text-2xl text-slate-950">${stat[1]}</strong></article>`).join("")}</div><section class="card mt-6 p-6"><h2 class="text-xl font-bold">Grafik Performa 30 Hari</h2><div class="mt-5 flex h-56 items-end gap-2">${[42, 64, 36, 80, 70, 96, 58, 74, 88, 60, 92, 78].map((height, index) => `<div class="flex flex-1 flex-col items-center gap-2"><div class="w-full rounded-t-xl bg-gradient-brand" style="height:${height}%"></div><span class="text-[10px] font-bold text-slate-400">${index + 1}</span></div>`).join("")}</div></section><section class="mt-6 grid gap-6 md:grid-cols-2"><div class="card p-6"><h2 class="text-xl font-bold">Kalender Booking</h2><div class="mt-4 grid grid-cols-7 gap-2">${Array.from({ length: 28 }, (_, i) => `<span class="rounded-xl ${i % 6 === 0 ? "bg-amber-100 text-amber-700" : "bg-teal-50 text-teal-700"} py-2 text-center text-xs font-bold">${i + 1}</span>`).join("")}</div></div><div class="card p-6"><h2 class="text-xl font-bold">Ulasan Terbaru</h2>${item.reviews.map(review => `<p class="mt-3 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600"><b>${review.name}</b> - ${review.text}</p>`).join("")}</div></section><section class="card mt-6 p-6"><h2 class="text-xl font-bold">Rekomendasi Optimasi Listing</h2><p class="mt-3 rounded-3xl bg-blue-50 p-4 text-sm font-semibold text-blue-700">Tambahkan foto real detail kelengkapan, jelaskan titik COD, dan aktifkan badge yang paling relevan.</p><div class="mt-5 flex flex-wrap gap-3"><button class="btn-primary rounded-2xl px-5 py-3" data-edit-product="${item.id}">Edit Barang</button><button class="btn-secondary rounded-2xl px-5 py-3" data-disable-listing>Nonaktifkan Listing</button><button class="btn-secondary rounded-2xl px-5 py-3" data-product="${item.id}">Lihat Halaman Produk</button></div></section></div></section>`, "max-w-7xl");
    bindBase();
    document.querySelectorAll("[data-product]").forEach(button => button.addEventListener("click", () => router.navigate("product-detail", { productId: button.dataset.product })));
    document.querySelector("[data-disable-listing]")?.addEventListener("click", () => ui.toast("Listing dinonaktifkan untuk simulasi"));
  }

  function renderPaymentQr() {
    const item = product();
    checkout.ensureCheckoutState(item);
    const total = checkout.calculate(item, checkout.durationFromDates());
    document.querySelector("#payment-qr-view").innerHTML = paymentShell("Pembayaran DP", "Selesaikan pembayaran DP agar pesanan kamu dapat diproses oleh pemilik barang.", "DP", total.dp, total, `<button class="btn-primary mt-5 w-full rounded-2xl px-5 py-3" data-payment-paid="dp">Cek Status Pembayaran</button>`);
    bindBase();
    qris.createQr("payment-page-qr", `GOPAY-MERCHANT-DP-${state.orderCode}-${total.dp}`);
    qris.startTimer("payment-page-timer", 900);
    bindPaymentActions("dp");
  }

  function renderPaymentVerification() {
    document.querySelector("#payment-verification-view").innerHTML = shell("Mengecek Status Pembayaran", "Simulasi polling status pembayaran GoPay Merchant QRIS.", `<section class="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm"><i data-lucide="scan-line" class="mx-auto h-16 w-16 text-brand-blue"></i><h2 class="mt-4 text-2xl font-extrabold">Pembayaran sedang diproses</h2><p class="mt-2 text-slate-500">Status akan diperbarui otomatis setelah sistem menerima konfirmasi.</p><button class="btn-primary mt-6 rounded-2xl px-5 py-3" data-payment-paid="dp">Simulasikan Webhook Berhasil</button></section>`);
    bindBase();
    bindPaymentActions("dp");
  }

  function renderTransactionSuccess() {
    const item = product();
    const total = checkout.calculate(item, checkout.durationFromDates());
    document.querySelector("#transaction-success-view").innerHTML = `<main class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div class="mx-auto max-w-4xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <section class="rounded-[24px] border border-slate-100 bg-white p-8 text-center shadow-sm">
          <span class="mx-auto grid h-20 w-20 place-items-center rounded-full bg-teal-50 text-teal-600">${icon("check-circle-2", "h-12 w-12")}</span>
          <h1 class="mt-5 text-3xl font-extrabold text-slate-950">Pembayaran DP berhasil diterima</h1>
          <p class="mx-auto mt-3 max-w-2xl text-slate-500">Pesanan kamu sedang diproses. Silakan pantau status transaksi di halaman detail transaksi.</p>
          <div class="mx-auto mt-8 grid max-w-2xl gap-3 text-left sm:grid-cols-2">
            ${successMetric("Nomor Transaksi", state.orderCode)}
            ${successMetric("Status", state.orderStatus || "DP_PAID")}
            ${successMetric("Total Sewa", rupiah(total.total))}
            ${successMetric("DP yang Dibayar", rupiah(total.dp))}
            ${successMetric("Sisa Pelunasan", rupiah(total.remaining))}
            ${successMetric("Jadwal Pelunasan", `Sebelum ${state.bookingStart}, pukul 12.00 WIB`)}
          </div>
          <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><button class="btn-primary rounded-2xl px-5 py-3" data-nav="order-detail">Lihat Detail Transaksi</button><button class="btn-secondary rounded-2xl px-5 py-3" data-nav="home">Kembali ke Beranda</button></div>
        </section>
      </div>
    </main>`;
    bindBase();
  }

  function renderPaymentFinal() {
    const item = product();
    checkout.ensureCheckoutState(item);
    const total = checkout.calculate(item, checkout.durationFromDates());
    document.querySelector("#payment-final-view").innerHTML = paymentShell("Pembayaran Pelunasan", "Selesaikan pelunasan agar barang bisa diserahkan kepada kamu.", "Pelunasan", total.remaining, total, `<button class="btn-primary mt-5 w-full rounded-2xl px-5 py-3" data-payment-paid="final">Cek Status Pembayaran</button>`);
    bindBase();
    qris.createQr("payment-page-qr", `GOPAY-MERCHANT-FINAL-${state.orderCode}-${total.remaining}`);
    qris.startTimer("payment-page-timer", 900);
    bindPaymentActions("final");
  }

  function renderOrderDetail() {
    const item = product();
    const total = checkout.calculate(item, checkout.durationFromDates());
    const status = state.orderStatus || "DP_PAID";
    const transactionId = state.orderCode || `ORD-20260609-${String(item.id).padStart(4, "0")}`;
    const reviewed = state.reviewedTransaction?.(transactionId);
    const reviewAction = status === "COMPLETED"
      ? reviewed
        ? `<button class="btn-secondary mt-3 w-full rounded-2xl px-5 py-3" data-product="${item.id}">Ulasan Terkirim</button>`
        : `<button class="btn-primary mt-3 w-full rounded-2xl px-5 py-3" data-review-transaction="${transactionId}">Beri Ulasan</button>`
      : `<button class="btn-secondary mt-3 w-full rounded-2xl px-5 py-3" data-complete-order>Simulasikan Transaksi Selesai</button>`;
    document.querySelector("#order-detail-view").innerHTML = shell("Detail Transaksi", "Pantau pembayaran, persetujuan pemilik, dan proses serah terima barang.", `<section class="grid gap-6 lg:grid-cols-[1fr_340px]">
      <article class="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm">
        <div class="flex flex-col gap-4 sm:flex-row"><img src="${item.image}" alt="${item.name}" class="h-32 w-full rounded-2xl object-cover sm:w-32"><div><p class="badge bg-blue-50 text-brand-blue">${status}</p><h2 class="mt-3 text-xl font-extrabold">${item.name}</h2><p class="mt-2 text-sm font-semibold text-slate-500">${state.bookingStart} sampai ${state.bookingEnd} | ${state.bookingDays} hari</p><p class="mt-2 text-sm text-slate-500">${item.location} | ${item.campus}</p></div></div>
        <div class="mt-6 grid gap-3 sm:grid-cols-2">${successMetric("Order", state.orderCode)}${successMetric("Total", rupiah(total.total))}${successMetric("DP Dibayar", status === "WAITING_DP_PAYMENT" ? "Belum dibayar" : rupiah(total.dp))}${successMetric("Sisa Pelunasan", rupiah(total.remaining))}</div>
      </article>
      <aside class="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm"><h3 class="font-extrabold">Aksi Transaksi</h3><p class="mt-2 text-sm leading-6 text-slate-500">Review hanya bisa diberikan setelah transaksi selesai dan hanya satu kali per transaksi.</p><button class="btn-primary mt-5 w-full rounded-2xl px-5 py-3" data-nav="payment-final">Bayar Sisa Pelunasan</button>${reviewAction}<button class="btn-secondary mt-3 w-full rounded-2xl px-5 py-3" data-nav="chat">Chat Pemilik</button><button class="btn-secondary mt-3 w-full rounded-2xl px-5 py-3" data-nav="browse">Kembali ke Jelajah Barang</button></aside>
    </section>`, "max-w-7xl");
    bindBase();
    document.querySelector("[data-complete-order]")?.addEventListener("click", () => {
      state.orderStatus = "COMPLETED";
      state.notifications = ["Transaksi selesai. Berikan ulasan untuk membantu pengguna lain.", ...state.notifications.filter(item => !item.includes("Transaksi selesai"))];
      ui.toast("Transaksi ditandai selesai");
      renderOrderDetail();
    });
    document.querySelector("[data-review-transaction]")?.addEventListener("click", event => router.navigate("reviews-create", { productId: event.currentTarget.dataset.reviewTransaction }));
  }

  function paymentShell(title, subtitle, invoiceType, amount, total, actionHtml) {
    const item = product();
    return `<main class="min-h-screen bg-slate-50"><div class="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div class="mb-6"><p class="text-sm font-semibold text-slate-500">Beranda &gt; Checkout &gt; ${title}</p><h1 class="mt-2 text-2xl font-extrabold text-slate-950 lg:text-3xl">${title}</h1><p class="mt-2 text-slate-500">${subtitle}</p></div>
      <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <section class="grid gap-5">
          <article class="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
            <div class="grid gap-4 sm:grid-cols-2">${successMetric("Invoice Number", invoiceType === "DP" ? state.invoiceNumber : `INV-FINAL-20260609-${String(item.id).padStart(4, "0")}`)}${successMetric("Nama Barang", item.name)}${successMetric("Total Tagihan", rupiah(total.total))}${successMetric(`Nominal ${invoiceType}`, rupiah(amount))}</div>
            <span class="badge mt-5 bg-amber-50 text-amber-700">Menunggu Pembayaran</span>
          </article>
          <article class="rounded-[24px] border border-slate-100 bg-white p-6 text-center shadow-sm">
            <h2 class="text-xl font-extrabold text-slate-950">Scan QRIS GoPay Merchant</h2>
            <p class="mt-2 text-sm text-slate-500">Scan QRIS untuk membayar ${invoiceType === "DP" ? "DP" : "pelunasan"}.</p>
            <div id="payment-page-qr" data-size="220" class="qr-container mx-auto mt-5 w-[260px]"></div>
            <p class="mt-4 font-bold text-amber-600">Berlaku dalam <span id="payment-page-timer">15:00</span></p>
            <div class="mt-5 grid gap-3 sm:grid-cols-2"><button class="btn-secondary rounded-2xl px-5 py-3" data-refresh-payment-qr>Refresh QR</button><button class="btn-secondary rounded-2xl px-5 py-3" data-nav="payment-verification">Cek Status</button></div>
            ${actionHtml}
          </article>
        </section>
        <aside class="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm lg:sticky lg:top-24"><h2 class="text-xl font-extrabold">Ringkasan Order</h2><div class="mt-5 grid gap-3 text-sm font-semibold text-slate-600">${checkout.summaryRow("Order", state.orderCode)}${checkout.summaryRow("Durasi", `${state.bookingDays} hari`)}${checkout.summaryRow("DP", rupiah(total.dp), "text-brand-blue")}${checkout.summaryRow("Sisa", rupiah(total.remaining), "text-teal-600")}</div><p class="mt-5 rounded-2xl bg-teal-50 p-4 text-sm font-semibold text-teal-700">Pembayaran Aman dan transaksi tercatat di sistem.</p></aside>
      </div>
    </div></main>`;
  }

  function successMetric(label, value) {
    return `<div class="rounded-2xl bg-slate-50 p-4"><p class="text-xs font-bold text-slate-500">${label}</p><b class="mt-1 block text-slate-950">${value}</b></div>`;
  }

  function bindPaymentActions(type) {
    document.querySelector("[data-refresh-payment-qr]")?.addEventListener("click", () => {
      qris.createQr("payment-page-qr", `GOPAY-MERCHANT-${type.toUpperCase()}-${state.orderCode}-${Date.now()}`);
      qris.startTimer("payment-page-timer", 900);
      ui.toast("QRIS berhasil diperbarui");
    });
    document.querySelectorAll("[data-payment-paid]").forEach(button => button.addEventListener("click", () => {
      if (button.dataset.paymentPaid === "final") {
        state.orderStatus = "READY_FOR_PICKUP";
        ui.toast("Pelunasan berhasil diterima");
        router.navigate("order-detail");
        return;
      }
      state.paymentStatus = "PAID";
      state.orderStatus = "DP_PAID";
      ui.toast("Pembayaran DP berhasil diterima");
      animations.confetti();
      router.navigate("transaction-success");
    }));
  }

  function renderQrHandover() {
    document.querySelector("#qr-handover-view").innerHTML = shell("QR Serah Terima", "QR dipakai untuk mencatat barang diterima atau dikembalikan saat COD.", `<section class="card p-6 text-center"><div id="handover-page-qr" class="qr-container mx-auto w-[240px]"></div><p class="mt-4 font-bold text-brand-blue">Berlaku <span id="handover-page-timer">10:00</span></p><button class="btn-secondary mt-5 rounded-2xl px-5 py-3" data-refresh-handover-page>Refresh QR</button><button class="btn-primary ml-2 mt-5 rounded-2xl px-5 py-3" data-nav="dashboard-buyer">Dashboard Penyewa</button></section>`);
    bindBase();
    qris.createQr("handover-page-qr", `BB-COD-${state.selectedProductId}-${Date.now()}`);
    qris.startTimer("handover-page-timer", 600);
    document.querySelector("[data-refresh-handover-page]")?.addEventListener("click", renderQrHandover);
  }

  document.addEventListener("click", event => {
    const edit = event.target.closest("[data-edit-product]");
    if (edit) {
      state.rememberProduct(Number(edit.dataset.editProduct));
      router.navigate("edit-product", { productId: edit.dataset.editProduct });
    }
    const stats = event.target.closest("[data-product-statistics]");
    if (stats) {
      state.rememberProduct(Number(stats.dataset.productStatistics));
      router.navigate("product-statistics", { productId: stats.dataset.productStatistics });
    }
  });

  Object.assign(components, {
    renderLogin,
    renderRegister,
    renderTopupPage,
    renderChatPage,
    renderUploadProduct,
    renderEditProduct,
    renderProductStatistics,
    renderPaymentQr,
    renderPaymentVerification,
    renderTransactionSuccess,
    renderPaymentFinal,
    renderOrderDetail,
    renderQrHandover
  });
})();
