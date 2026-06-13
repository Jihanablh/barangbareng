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

  function renderLogin(errors = {}, values = {}) {
    const error = typeof errors === "string" ? { general: errors } : errors;
    document.querySelector("#login-view").innerHTML = shell("Masuk Akun", "Masuk untuk lanjut menyewa, mengelola pesanan, dan memantau verifikasi mahasiswa.", `<section class="grid gap-6 lg:grid-cols-[1fr_.82fr]">
      <!-- USER ACCOUNT FEATURE START -->
      <form class="card grid gap-4 p-6" data-bb-login-form novalidate>
        <div class="rounded-3xl bg-gradient-to-r from-blue-50 to-teal-50 p-5">
          <p class="text-sm font-extrabold text-brand-blue">Sign In BarangBareng</p>
          <h2 class="mt-2 text-2xl font-extrabold text-slate-950">Lanjutkan akun kampusmu</h2>
          <p class="mt-2 text-sm font-semibold leading-6 text-slate-500">Akun yang belum terverifikasi akan diarahkan ke e-KYC mahasiswa.</p>
        </div>
        <label class="text-sm font-bold text-slate-700">Email atau nomor telepon
          <input class="field mt-2" name="identifier" value="${values.identifier || ""}" autocomplete="username" placeholder="email@kampus.ac.id atau 08...">
          ${bbUserAccount.fieldError(error, "identifier")}
        </label>
        <label class="text-sm font-bold text-slate-700">Password
          <span class="mt-2 flex rounded-2xl border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-blue-100">
            <input class="min-h-[52px] flex-1 rounded-2xl px-4 outline-none" name="password" type="password" autocomplete="current-password" placeholder="Masukkan password" data-bb-password-input>
            <button type="button" class="px-4 text-sm font-extrabold text-brand-blue" data-bb-password-toggle aria-label="Tampilkan atau sembunyikan password">Lihat</button>
          </span>
          ${bbUserAccount.fieldError(error, "password")}
        </label>
        <div class="flex flex-col gap-3 text-sm font-bold text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <label class="inline-flex items-center gap-2"><input type="checkbox" name="remember" class="h-4 w-4 rounded border-slate-300"> Ingat saya</label>
          <button type="button" class="text-left font-extrabold text-brand-blue" data-nav="lupa-password">Lupa password?</button>
        </div>
        ${error.general ? `<p class="rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">${error.general}</p>` : ""}
        <button class="btn-primary rounded-2xl px-5 py-3">Masuk</button>
        <button type="button" class="btn-secondary rounded-2xl px-5 py-3" data-nav="register">Belum punya akun? Daftar</button>
      </form>
      <aside class="card h-fit p-6">
        <h2 class="text-2xl font-extrabold text-slate-950">Akses aman untuk mahasiswa</h2>
        <div class="mt-5 grid gap-3 text-sm font-bold text-slate-600">
          <p class="rounded-2xl bg-slate-50 p-4">Masuk memakai email kampus atau nomor telepon terdaftar.</p>
          <p class="rounded-2xl bg-slate-50 p-4">Status verifikasi menentukan akses sewa, upload barang, dan transaksi.</p>
          <p class="rounded-2xl bg-blue-50 p-4 text-brand-blue">Lanjutkan e-KYC jika status akun belum terverifikasi.</p>
        </div>
      </aside>
      <!-- USER ACCOUNT FEATURE END -->
    </section>`);
    bindBase();
    document.querySelector("[data-bb-password-toggle]")?.addEventListener("click", event => {
      const input = document.querySelector("[data-bb-password-input]");
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
      event.currentTarget.textContent = input.type === "password" ? "Lihat" : "Sembunyi";
    });
    document.querySelector("[data-bb-login-form]")?.addEventListener("submit", event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const payload = { identifier: form.get("identifier"), remember: Boolean(form.get("remember")) };
      const result = bbUserAccount.loginUser(payload.identifier, form.get("password"), payload.remember);
      if (!result.success) return renderLogin(result.errors || { general: result.message }, payload);
      bbUserAccount.renderAuthUi();
      ui.toast("Masuk berhasil");
      router.navigate(bbUserAccount.canAccessRentalFeature(result.user) ? "dashboard-buyer" : "ekyc");
    });
  }

  function renderRegister(errors = {}, values = {}) {
    const campusNames = Object.keys(bbUserAccount.campusEmailDomains);
    const campuses = ["", ...campusNames];
    document.querySelector("#register-view").innerHTML = shell("Bergabung dengan BarangBareng", "Buat akun mahasiswa dan lanjutkan verifikasi identitas agar fitur sewa aktif.", `<section class="grid gap-6 lg:grid-cols-[.82fr_1fr]">
      <aside class="card h-fit overflow-hidden p-0">
        <div class="bg-gradient-to-br from-blue-600 to-teal-500 p-7 text-white">
          <p class="text-sm font-extrabold uppercase tracking-wide text-white/80">Sign Up Mahasiswa</p>
          <h2 class="mt-3 text-3xl font-extrabold">Sewa barang kampus lebih aman.</h2>
          <p class="mt-3 text-sm font-semibold leading-6 text-white/85">Gunakan email kampus, lengkapi e-KYC, lalu akses checkout, upload barang, dan transaksi penuh.</p>
        </div>
        <div class="grid gap-3 p-6 text-sm font-bold text-slate-600">
          <p class="rounded-2xl bg-slate-50 p-4">Validasi email kampus sesuai universitas.</p>
          <p class="rounded-2xl bg-slate-50 p-4">Status akun tersimpan dan tidak hilang setelah refresh.</p>
          <p class="rounded-2xl bg-slate-50 p-4">Profil, level, dan badge mengikuti akun yang sedang login.</p>
        </div>
      </aside>
      <section class="card p-6">
      <!-- USER ACCOUNT FEATURE START -->
      <form class="grid gap-4 md:grid-cols-2" data-bb-register-form novalidate>
        <label class="text-sm font-bold text-slate-700">Nama lengkap<input class="field mt-2" name="fullName" value="${values.fullName || ""}" autocomplete="name">${bbUserAccount.fieldError(errors, "fullName")}</label>
        <label class="text-sm font-bold text-slate-700">NIM<input class="field mt-2" name="nim" value="${values.nim || ""}" inputmode="numeric" autocomplete="off">${bbUserAccount.fieldError(errors, "nim")}</label>
        <label class="text-sm font-bold text-slate-700">Email kampus<input class="field mt-2" name="email" type="email" value="${values.email || ""}" autocomplete="email" placeholder="nama@domainkampus.ac.id">${bbUserAccount.fieldError(errors, "email")}</label>
        <label class="text-sm font-bold text-slate-700">Nomor telepon<input class="field mt-2" name="phone" value="${values.phone || ""}" autocomplete="tel">${bbUserAccount.fieldError(errors, "phone")}</label>
        <label class="text-sm font-bold text-slate-700">Asal kampus<select class="field mt-2" name="campus">${campuses.map(campus => `<option value="${campus}" ${campus === values.campus ? "selected" : ""}>${campus || "Pilih kampus"}</option>`).join("")}</select>${bbUserAccount.fieldError(errors, "campus")}</label>
        <label class="text-sm font-bold text-slate-700">Password<input class="field mt-2" name="password" type="password" autocomplete="new-password">${bbUserAccount.fieldError(errors, "password")}</label>
        <label class="text-sm font-bold text-slate-700">Konfirmasi password<input class="field mt-2" name="confirmPassword" type="password" autocomplete="new-password">${bbUserAccount.fieldError(errors, "confirmPassword")}</label>
        <label class="md:col-span-2 flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600"><input type="checkbox" name="terms" class="mt-1 h-4 w-4 rounded border-slate-300" ${values.terms ? "checked" : ""}> Saya menyetujui ketentuan layanan dan data verifikasi dipakai untuk keamanan transaksi.</label>
        <div class="-mt-2 md:col-span-2">${bbUserAccount.fieldError(errors, "terms")}</div>
        <div class="md:col-span-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" class="btn-secondary rounded-2xl px-5 py-3" data-nav="login">Sudah punya akun? Masuk</button><button class="btn-primary rounded-2xl px-5 py-3">Daftar Sekarang</button></div>
      </form>
      <!-- USER ACCOUNT FEATURE END -->
      </section>
    </section>`);
    bindBase();
    document.querySelector("[data-bb-register-form]")?.addEventListener("submit", event => {
      event.preventDefault();
      const form = Object.fromEntries(new FormData(event.currentTarget).entries());
      form.terms = event.currentTarget.querySelector('[name="terms"]')?.checked;
      const result = bbUserAccount.registerStudent(form);
      if (!result.success) return renderRegister(result.errors, form);
      bbUserAccount.renderAuthUi();
      ui.toast("Registrasi berhasil. Lanjutkan verifikasi identitas.");
      router.navigate("ekyc");
    });
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
    if (!window.bbUserAccount?.canAccessRentalFeature?.()) {
      document.querySelector("#upload-product-view").innerHTML = shell("Verifikasi diperlukan", "Lengkapi e-KYC mahasiswa untuk mulai menyewakan barang.", `<section class="card p-8 text-center">${icon("shield-check", "mx-auto h-14 w-14 text-brand-blue")}<h2 class="mt-4 text-2xl font-extrabold text-slate-950">Akun perlu diverifikasi</h2><p class="mx-auto mt-3 max-w-xl text-sm font-semibold leading-6 text-slate-500">Upload barang hanya tersedia untuk akun mahasiswa yang sudah lolos verifikasi identitas.</p><div class="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><button class="btn-primary rounded-2xl px-5 py-3" data-nav="ekyc">Lengkapi e-KYC</button><button class="btn-secondary rounded-2xl px-5 py-3" data-nav="dashboard-buyer">Kembali Dashboard</button></div></section>`);
      bindBase();
      return;
    }
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
    const statCards = [["Total Dilihat", "1.284"], ["Total Disimpan", 20 + item.id], ["Total Booking", item.rentedCount], ["Booking Selesai", Math.max(1, item.rentedCount - 7)], ["Pendapatan", rupiah(item.price * Math.max(item.rentedCount, 1))], ["Conversion Rate", "8.6%"]];
    document.querySelector("#product-statistics-view").innerHTML = shell("Statistik Barang", `Analitik performa untuk ${item.name}.`, `<section class="grid gap-6 lg:grid-cols-[320px_1fr]"><aside class="card p-5"><div class="h-52">${img(item)}</div><h2 class="mt-4 text-xl font-extrabold">${item.name}</h2><p class="mt-2 text-slate-500">${item.status === "low" ? "Hampir Habis" : "Tersedia"} - ${item.category}</p><p class="mt-3 text-2xl font-extrabold text-brand-blue">${item.type === "pinjam" ? "Gratis" : rupiah(item.price)} <span class="text-xs text-slate-500">/hari</span></p><div class="mt-4 grid gap-2 text-sm font-semibold text-slate-600"><span>Rating ${item.rating}</span><span>${item.reviewCount} ulasan</span><span>${item.rentedCount} disewa</span><span>${20 + item.id} disimpan</span><span>1.284 dilihat</span></div><button class="btn-primary mt-5 w-full rounded-2xl px-5 py-3" data-edit-product="${item.id}">Edit Barang</button><button class="btn-secondary mt-3 w-full rounded-2xl px-5 py-3" data-product="${item.id}">Lihat Halaman Produk</button></aside><div><div class="grid gap-4 md:grid-cols-3">${statCards.map(stat => `<article class="card p-5"><p class="text-sm font-semibold text-slate-500">${stat[0]}</p><strong class="mt-2 block text-2xl text-slate-950">${stat[1]}</strong></article>`).join("")}</div><section class="card mt-6 p-6"><h2 class="text-xl font-bold">Grafik Performa 30 Hari</h2><div class="mt-5 flex h-56 items-end gap-2">${[42, 64, 36, 80, 70, 96, 58, 74, 88, 60, 92, 78].map((height, index) => `<div class="flex flex-1 flex-col items-center gap-2"><div class="w-full rounded-t-xl bg-gradient-brand" style="height:${height}%"></div><span class="text-[10px] font-bold text-slate-400">${index + 1}</span></div>`).join("")}</div></section><section class="mt-6 grid gap-6 md:grid-cols-2"><div class="card p-6"><h2 class="text-xl font-bold">Kalender Booking</h2><div class="mt-4 grid grid-cols-7 gap-2">${Array.from({ length: 28 }, (_, i) => `<span class="rounded-xl ${i % 6 === 0 ? "bg-amber-100 text-amber-700" : "bg-teal-50 text-teal-700"} py-2 text-center text-xs font-bold">${i + 1}</span>`).join("")}</div></div><div class="card p-6"><h2 class="text-xl font-bold">Ulasan Terbaru</h2>${item.reviews.map(review => `<p class="mt-3 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600"><b>${review.name}</b> - ${review.text}</p>`).join("")}</div></section><section class="card mt-6 p-6"><h2 class="text-xl font-bold">Rekomendasi Optimasi Listing</h2><p class="mt-3 rounded-3xl bg-blue-50 p-4 text-sm font-semibold text-blue-700">Tambahkan foto real detail kelengkapan, jelaskan titik COD, dan aktifkan badge yang paling relevan.</p><div class="mt-5 flex flex-wrap gap-3"><button class="btn-primary rounded-2xl px-5 py-3" data-edit-product="${item.id}">Edit Barang</button><button class="btn-secondary rounded-2xl px-5 py-3" data-disable-listing>Nonaktifkan Listing</button><button class="btn-secondary rounded-2xl px-5 py-3" data-product="${item.id}">Lihat Halaman Produk</button></div></section></div></section>`, "max-w-7xl");
    bindBase();
    document.querySelectorAll("[data-product]").forEach(button => button.addEventListener("click", () => router.navigate("product-detail", { productId: button.dataset.product })));
    document.querySelector("[data-disable-listing]")?.addEventListener("click", () => ui.toast("Listing dinonaktifkan"));
  }

  const statusInfo = {
    WAITING_DP_PAYMENT: { label: "Menunggu Pembayaran DP", text: "Selesaikan DP agar pesanan kamu diproses.", tone: "bg-amber-50 text-amber-700" },
    DP_PAID: { label: "DP Berhasil Dibayar", text: "Pemilik sedang memeriksa dan menyiapkan barang.", tone: "bg-teal-50 text-teal-700" },
    PREPARING_ITEM: { label: "Pemilik Menyiapkan Barang", text: "Barang akan segera siap untuk jadwal sewa kamu.", tone: "bg-blue-50 text-brand-blue" },
    WAITING_FINAL_PAYMENT: { label: "Menunggu Pelunasan", text: "Selesaikan pembayaran sebelum serah terima barang.", tone: "bg-amber-50 text-amber-700" },
    FULLY_PAID: { label: "Pembayaran Lunas", text: "Barang siap untuk proses serah terima.", tone: "bg-teal-50 text-teal-700" },
    READY_FOR_PICKUP: { label: "Barang Siap Diambil", text: "Tunjukkan atau scan kode serah terima saat bertemu pemilik.", tone: "bg-blue-50 text-brand-blue" },
    RENTED: { label: "Barang Sedang Disewa", text: "Gunakan barang sesuai kesepakatan dan kembalikan tepat waktu.", tone: "bg-blue-50 text-brand-blue" },
    RETURNED: { label: "Barang Sudah Dikembalikan", text: "Menunggu pemilik mengonfirmasi kondisi barang.", tone: "bg-slate-100 text-slate-700" },
    COMPLETED: { label: "Transaksi Selesai", text: "Terima kasih sudah menggunakan BarangBareng.", tone: "bg-teal-50 text-teal-700" },
    REVIEWED: { label: "Ulasan Terkirim", text: "Terima kasih sudah membantu pengguna lain memilih barang.", tone: "bg-teal-50 text-teal-700" },
    CANCELLED: { label: "Transaksi Dibatalkan", text: "Transaksi ini sudah dibatalkan.", tone: "bg-red-50 text-red-700" },
    PAYMENT_EXPIRED: { label: "Waktu Pembayaran Habis", text: "Silakan buat pembayaran baru untuk melanjutkan.", tone: "bg-red-50 text-red-700" }
  };

  const timelineSteps = [
    ["WAITING_DP_PAYMENT", "Checkout Dibuat"],
    ["DP_PAID", "DP Dibayar"],
    ["PREPARING_ITEM", "Pemilik Menyiapkan Barang"],
    ["WAITING_FINAL_PAYMENT", "Pelunasan"],
    ["READY_FOR_PICKUP", "Barang Siap Diambil"],
    ["RENTED", "Sedang Disewa"],
    ["COMPLETED", "Selesai"]
  ];

  function paymentMount(type) {
    return document.querySelector(type === "final" ? "#payment-final-view, #payment-final-alias-view" : "#payment-qr-view, #payment-dp-view");
  }

  function renderPaymentQr() {
    const item = product();
    checkout.ensureCheckoutState(item);
    const total = checkout.calculate(item, checkout.durationFromDates());
    paymentMount("dp").innerHTML = paymentShell({
      title: "Pembayaran DP",
      subtitle: "Scan QRIS untuk mengamankan pesanan kamu.",
      type: "dp",
      amount: total.dp,
      total,
      statusText: state.paymentStatus === "EXPIRED" ? "Waktu Pembayaran Habis" : "Menunggu Pembayaran",
      actionText: "Cek Status Pembayaran"
    });
    bindBase();
    qris.createQr("payment-page-qr", `GOPAY-MERCHANT-DP-${state.orderCode}-${total.dp}`);
    qris.startTimer("payment-page-timer", 900);
    bindPaymentActions("dp");
  }

  function renderPaymentVerification() {
    document.querySelector("#payment-verification-view").innerHTML = shell("Mengecek Status Pembayaran", "Menunggu pembayaran kamu diproses.", `<section class="rounded-[28px] border border-slate-100 bg-white p-8 text-center shadow-sm"><i data-lucide="scan-line" class="mx-auto h-16 w-16 text-brand-blue"></i><h2 class="mt-4 text-2xl font-extrabold">Pembayaran sedang diproses</h2><p class="mt-2 text-slate-500">Pembayaran kamu akan tercatat otomatis setelah berhasil diproses.</p><div class="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><button class="btn-primary rounded-2xl px-5 py-3" data-payment-paid="dp">Cek Status Pembayaran</button><button class="btn-secondary rounded-2xl px-5 py-3" data-nav="order-detail">Kembali ke Detail Transaksi</button></div></section>`);
    bindBase();
    bindPaymentActions("dp");
  }

  function renderTransactionSuccess() {
    const item = product();
    const total = checkout.calculate(item, checkout.durationFromDates());
    document.querySelector("#transaction-success-view").innerHTML = `<main class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div class="mx-auto max-w-4xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <section class="rounded-[28px] border border-slate-100 bg-white p-8 text-center shadow-sm">
          <span class="mx-auto grid h-20 w-20 place-items-center rounded-full bg-teal-50 text-teal-600">${icon("check-circle-2", "h-12 w-12")}</span>
          <h1 class="mt-5 text-3xl font-extrabold text-slate-950">DP Berhasil Dibayar</h1>
          <p class="mx-auto mt-3 max-w-2xl text-slate-500">Pesanan kamu sudah tercatat. Pemilik akan menyiapkan barang sesuai jadwal.</p>
          <div class="mx-auto mt-8 grid max-w-2xl gap-3 text-left sm:grid-cols-2">
            ${successMetric("Nomor Transaksi", state.orderCode)}
            ${successMetric("Status", statusInfo[state.orderStatus || "DP_PAID"].label)}
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
    paymentMount("final").innerHTML = paymentShell({
      title: "Pelunasan Pembayaran",
      subtitle: "Selesaikan sisa pembayaran sebelum barang diserahkan.",
      type: "final",
      amount: total.remaining,
      total,
      statusText: "Menunggu Pelunasan",
      actionText: "Cek Status Pelunasan"
    });
    bindBase();
    qris.createQr("payment-page-qr", `GOPAY-MERCHANT-FINAL-${state.orderCode}-${total.remaining}`);
    qris.startTimer("payment-page-timer", 900);
    bindPaymentActions("final");
  }

  function renderOrderDetail() {
    const mount = document.querySelector("#order-detail-view, #orders-view");
    const item = product();
    checkout.ensureCheckoutState(item);
    const total = checkout.calculate(item, checkout.durationFromDates());
    const status = state.orderStatus || "WAITING_DP_PAYMENT";
    const transactionId = state.orderCode || `ORD-20260609-${String(item.id).padStart(4, "0")}`;
    const current = statusInfo[status] || statusInfo.WAITING_DP_PAYMENT;
    const reviewed = state.reviewedTransaction?.(transactionId);
    mount.innerHTML = shell("Detail Transaksi", "Pantau status sewa barang kamu dari pembayaran sampai selesai.", `<section class="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div class="grid gap-6">
        <article class="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div><p class="text-sm font-bold text-slate-500">Nomor pesanan</p><h2 class="mt-1 text-xl font-extrabold text-slate-950">${transactionId}</h2></div>
            <span class="badge ${current.tone}">${current.label}</span>
          </div>
          <p class="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-600">${current.text}</p>
          ${timeline(status)}
        </article>

        <article class="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
          <h2 class="text-xl font-extrabold text-slate-950">Informasi Barang</h2>
          <div class="mt-5 flex flex-col gap-4 sm:flex-row">
            <img src="${item.image}" alt="${item.name}" class="h-36 w-full rounded-3xl object-cover sm:w-40">
            <div class="min-w-0 flex-1">
              <h3 class="text-xl font-extrabold text-slate-950">${item.name}</h3>
              <p class="mt-2 text-sm font-semibold text-slate-500">${item.owner.name} · ${item.campus}</p>
              <p class="mt-2 text-sm text-slate-500">${state.bookingStart} sampai ${state.bookingEnd} · ${state.bookingDays} hari</p>
              <p class="mt-3 rounded-2xl bg-blue-50 p-3 text-sm font-bold text-brand-blue">${state.codLocation || item.location}</p>
            </div>
          </div>
        </article>

        ${status === "COMPLETED" ? completedCard(item, total, transactionId, reviewed) : ""}
      </div>
      <aside class="h-fit rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm lg:sticky lg:top-28">
        <h3 class="text-xl font-extrabold">Ringkasan Pembayaran</h3>
        <div class="mt-5 grid gap-3 text-sm font-semibold text-slate-600">
          ${checkout.summaryRow("Total sewa", rupiah(total.total))}
          ${checkout.summaryRow("Status DP", status === "WAITING_DP_PAYMENT" ? "Belum dibayar" : "Dibayar", status === "WAITING_DP_PAYMENT" ? "text-amber-600" : "text-teal-600")}
          ${checkout.summaryRow("DP 30%", rupiah(total.dp), "text-brand-blue")}
          ${checkout.summaryRow("Status pelunasan", ["FULLY_PAID", "READY_FOR_PICKUP", "RENTED", "RETURNED", "COMPLETED", "REVIEWED"].includes(status) ? "Lunas" : "Belum lunas", ["FULLY_PAID", "READY_FOR_PICKUP", "RENTED", "RETURNED", "COMPLETED", "REVIEWED"].includes(status) ? "text-teal-600" : "text-amber-600")}
          ${checkout.summaryRow("Sisa pelunasan", rupiah(total.remaining), "text-teal-600")}
        </div>
        <div class="my-5 border-t border-dashed border-slate-200"></div>
        <h3 class="font-extrabold">Aksi Berikutnya</h3>
        <p class="mt-2 text-sm leading-6 text-slate-500">${current.text}</p>
        ${orderActions(status, item, transactionId, reviewed)}
      </aside>
    </section>`, "max-w-7xl");
    bindBase();
    bindOrderActions();
  }

  function paymentShell({ title, subtitle, type, amount, total, statusText, actionText }) {
    const item = product();
    const isFinal = type === "final";
    const invoice = isFinal ? state.finalInvoiceNumber : state.invoiceNumber;
    return `<main class="min-h-screen bg-slate-50"><div class="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div class="mb-6"><p class="text-sm font-semibold text-slate-500">Checkout &gt; ${title}</p><h1 class="mt-2 text-2xl font-extrabold text-slate-950 lg:text-3xl">${title}</h1><p class="mt-2 text-slate-500">${subtitle}</p></div>
      <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <section class="grid gap-5">
          <article class="rounded-[28px] border border-slate-100 bg-white p-6 text-center shadow-sm">
            <span class="badge bg-amber-50 text-amber-700">${statusText}</span>
            <h2 class="mt-5 text-xl font-extrabold text-slate-950">QRIS GoPay Merchant</h2>
            <p class="mt-2 text-sm text-slate-500">${isFinal ? "Pelunasan dilakukan sebelum barang diserahkan kepada penyewa." : "Scan QRIS untuk membayar DP pesanan kamu."}</p>
            <div class="mx-auto mt-6 max-w-sm rounded-[28px] bg-slate-50 p-5">
              <p class="text-sm font-bold text-slate-500">${isFinal ? "Sisa pelunasan" : "DP yang harus dibayar"}</p>
              <p class="mt-2 text-3xl font-extrabold text-brand-blue">${rupiah(amount)}</p>
              <p class="mt-4 text-sm font-bold text-amber-600">Selesaikan pembayaran dalam</p>
              <p id="payment-page-timer" class="mt-1 text-2xl font-extrabold text-amber-600">15:00</p>
              <div id="payment-page-qr" data-size="220" class="qr-container mx-auto mt-5 w-[240px] max-w-full"></div>
            </div>
            <div class="mt-6 rounded-2xl bg-blue-50 p-4 text-left text-sm font-semibold leading-6 text-blue-800">
              <b>Cara membayar:</b>
              <ol class="mt-2 list-decimal space-y-1 pl-5">
                <li>Buka aplikasi e-wallet atau mobile banking.</li>
                <li>Pilih menu Scan QRIS.</li>
                <li>Scan kode QR di halaman ini.</li>
                <li>Pastikan nominal pembayaran sesuai.</li>
                <li>Setelah membayar, klik ${actionText}.</li>
              </ol>
            </div>
            <div class="mt-5 grid gap-3 sm:grid-cols-2"><button class="btn-secondary rounded-2xl px-5 py-3" data-refresh-payment-qr>Buat QRIS Baru</button><button class="btn-secondary rounded-2xl px-5 py-3" data-nav="order-detail">Kembali ke Detail Transaksi</button></div>
            <button class="btn-primary mt-3 w-full rounded-2xl px-5 py-3" data-payment-paid="${type}">${actionText}</button>
          </article>
        </section>
        <aside class="h-fit rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm lg:sticky lg:top-28">
          <h2 class="text-xl font-extrabold">Detail Invoice</h2>
          <div class="mt-5 grid gap-3 text-sm font-semibold text-slate-600">
            ${checkout.summaryRow("Nomor invoice", invoice)}
            ${checkout.summaryRow("Nama barang", item.name)}
            ${checkout.summaryRow("Total sewa", rupiah(total.total))}
            ${checkout.summaryRow("DP dibayar", isFinal ? rupiah(total.dp) : rupiah(amount), isFinal ? "text-teal-600" : "text-brand-blue")}
            ${checkout.summaryRow("Sisa pelunasan", rupiah(total.remaining), "text-teal-600")}
            ${checkout.summaryRow("Deadline", isFinal ? `${state.bookingStart}, 12.00 WIB` : "15 menit")}
            ${checkout.summaryRow("Status transaksi", statusInfo[state.orderStatus || "WAITING_DP_PAYMENT"].label)}
          </div>
          <div class="mt-5 rounded-2xl bg-teal-50 p-4 text-sm font-semibold leading-6 text-teal-800"><b class="block">Pembayaran Aman</b>Pembayaran kamu akan tercatat otomatis setelah berhasil diproses.</div>
        </aside>
      </div>
    </div></main>`;
  }

  function successMetric(label, value) {
    return `<div class="rounded-2xl bg-slate-50 p-4"><p class="text-xs font-bold text-slate-500">${label}</p><b class="mt-1 block text-slate-950">${value}</b></div>`;
  }

  function statusProgress(status) {
    const map = {
      WAITING_DP_PAYMENT: 0,
      DP_PAID: 1,
      PREPARING_ITEM: 2,
      WAITING_FINAL_PAYMENT: 3,
      FULLY_PAID: 3,
      READY_FOR_PICKUP: 4,
      RENTED: 5,
      RETURNED: 5,
      COMPLETED: 6,
      REVIEWED: 6
    };
    return map[status] ?? 0;
  }

  function timeline(status) {
    const current = statusProgress(status);
    return `<div class="mt-6 overflow-x-auto pb-2">
      <div class="grid min-w-[760px] grid-cols-7 gap-3">
        ${timelineSteps.map((step, index) => {
          const done = index < current;
          const active = index === current;
          const tone = done ? "bg-teal-50 text-teal-700 ring-teal-100" : active ? "bg-amber-50 text-amber-700 ring-amber-100" : "bg-slate-50 text-slate-400 ring-slate-100";
          const iconName = done ? "check" : active ? "clock-3" : "circle";
          return `<div class="rounded-2xl p-3 text-center text-xs font-bold ring-1 ${tone}">
            <span class="mx-auto mb-2 grid h-8 w-8 place-items-center rounded-full bg-white">${icon(iconName, "h-4 w-4")}</span>
            ${step[1]}
          </div>`;
        }).join("")}
      </div>
    </div>`;
  }

  function completedCard(item, total, transactionId, reviewed) {
    return `<article class="rounded-[28px] border border-teal-100 bg-teal-50 p-6 shadow-sm">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 class="text-2xl font-extrabold text-teal-800">Transaksi Selesai</h2><p class="mt-2 text-sm font-semibold leading-6 text-teal-700">Barang sudah dikembalikan dan transaksi berhasil diselesaikan.</p></div>
        <span class="badge bg-white text-teal-700">${reviewed ? "Ulasan Terkirim" : "Menunggu Penilaian"}</span>
      </div>
      <div class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        ${successMetric("Barang", item.name)}
        ${successMetric("Tanggal sewa", state.bookingStart)}
        ${successMetric("Tanggal kembali", state.bookingEnd)}
        ${successMetric("Total pembayaran", rupiah(total.total))}
      </div>
      <button class="${reviewed ? "btn-secondary" : "btn-primary"} mt-5 rounded-2xl px-5 py-3" ${reviewed ? `data-product="${item.id}"` : `data-review-transaction="${transactionId}"`}>${reviewed ? "Lihat Ulasan" : "Beri Penilaian"}</button>
    </article>`;
  }

  function orderActions(status, item, transactionId, reviewed) {
    if (status === "WAITING_DP_PAYMENT") return `<button class="btn-primary mt-5 w-full rounded-2xl px-5 py-3" data-nav="payment-qr">Bayar DP Sekarang</button>`;
    if (status === "DP_PAID") return `<button class="btn-secondary mt-5 w-full rounded-2xl px-5 py-3" data-nav="chat">Chat Pemilik</button><button class="btn-secondary mt-3 w-full rounded-2xl px-5 py-3" data-product="${item.id}">Lihat Detail Barang</button><button class="btn-primary mt-3 w-full rounded-2xl px-5 py-3" data-next-status="PREPARING_ITEM">Lanjut Pantau Persiapan</button>`;
    if (status === "PREPARING_ITEM") return `<button class="btn-secondary mt-5 w-full rounded-2xl px-5 py-3" data-nav="chat">Chat Pemilik</button><button class="btn-primary mt-3 w-full rounded-2xl px-5 py-3" data-next-status="WAITING_FINAL_PAYMENT">Barang Siap Diproses</button>`;
    if (status === "WAITING_FINAL_PAYMENT") return `<button class="btn-primary mt-5 w-full rounded-2xl px-5 py-3" data-nav="payment-final">Bayar Sisa Pelunasan</button>`;
    if (status === "FULLY_PAID") return `<button class="btn-primary mt-5 w-full rounded-2xl px-5 py-3" data-nav="qr-handover">Lihat Kode Serah Terima</button>`;
    if (status === "READY_FOR_PICKUP") return `<button class="btn-primary mt-5 w-full rounded-2xl px-5 py-3" data-nav="qr-handover">Tampilkan Kode Serah Terima</button>`;
    if (status === "RENTED") return `<button class="btn-primary mt-5 w-full rounded-2xl px-5 py-3" data-mark-returned>Lihat Detail Pengembalian</button><button class="btn-secondary mt-3 w-full rounded-2xl px-5 py-3" data-nav="chat">Chat Pemilik</button>`;
    if (status === "RETURNED") return `<button class="btn-secondary mt-5 w-full rounded-2xl px-5 py-3" disabled>Menunggu Konfirmasi Pemilik</button><button class="btn-primary mt-3 w-full rounded-2xl px-5 py-3" data-complete-order>Konfirmasi Transaksi Selesai</button>`;
    if (status === "COMPLETED" && !reviewed) return `<button class="btn-primary mt-5 w-full rounded-2xl px-5 py-3" data-review-transaction="${transactionId}">Beri Penilaian</button>`;
    if (status === "COMPLETED" && reviewed) return `<button class="btn-secondary mt-5 w-full rounded-2xl px-5 py-3" data-product="${item.id}">Ulasan Terkirim</button>`;
    return `<button class="btn-secondary mt-5 w-full rounded-2xl px-5 py-3" data-nav="browse">Kembali ke Jelajah Barang</button>`;
  }

  function bindOrderActions() {
    document.querySelectorAll("[data-next-status]").forEach(button => button.addEventListener("click", () => {
      state.orderStatus = button.dataset.nextStatus;
      ui.toast(statusInfo[state.orderStatus]?.label || "Status transaksi diperbarui");
      renderOrderDetail();
    }));
    document.querySelector("[data-complete-order]")?.addEventListener("click", () => {
      state.orderStatus = "COMPLETED";
      state.notifications = ["Transaksi selesai. Kamu bisa memberi penilaian sekarang.", ...state.notifications.filter(item => !item.includes("Transaksi selesai"))];
      ui.toast("Transaksi selesai");
      renderOrderDetail();
    });
    document.querySelector("[data-mark-returned]")?.addEventListener("click", () => {
      state.orderStatus = "RETURNED";
      ui.toast("Pengembalian barang tercatat");
      renderOrderDetail();
    });
    document.querySelector("[data-review-transaction]")?.addEventListener("click", event => router.navigate("reviews-create", { productId: event.currentTarget.dataset.reviewTransaction }));
  }

  function bindPaymentActions(type) {
    document.querySelector("[data-refresh-payment-qr]")?.addEventListener("click", () => {
      qris.createQr("payment-page-qr", `GOPAY-MERCHANT-${type.toUpperCase()}-${state.orderCode}-${Date.now()}`);
      qris.startTimer("payment-page-timer", 900);
      ui.toast("QRIS berhasil diperbarui");
    });
    document.querySelectorAll("[data-payment-paid]").forEach(button => button.addEventListener("click", () => {
      if (button.dataset.paymentPaid === "final") {
        state.paymentStatus = "PAID";
        state.orderStatus = "FULLY_PAID";
        ui.toast("Pembayaran lunas");
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
    if (state.orderStatus === "FULLY_PAID") state.orderStatus = "READY_FOR_PICKUP";
    const isReady = ["FULLY_PAID", "READY_FOR_PICKUP", "RENTED"].includes(state.orderStatus);
    const item = product();
    const code = state.handoverCode || "482913";
    state.handoverCode = code;
    document.querySelector("#qr-handover-view, #serah-terima-view").innerHTML = shell("Serah Terima Barang", "Tunjukkan kode ini kepada pemilik saat serah terima barang.", `<section class="grid gap-6 lg:grid-cols-[1fr_360px]">
      <article class="rounded-[28px] border border-slate-100 bg-white p-6 text-center shadow-sm">
        <span class="badge ${isReady ? "bg-blue-50 text-brand-blue" : "bg-amber-50 text-amber-700"}">${isReady ? "Kode Serah Terima Aktif" : "Menunggu Pembayaran Lunas"}</span>
        <div id="handover-page-qr" class="qr-container mx-auto mt-6 w-[240px] max-w-full"></div>
        <p class="mt-4 text-sm font-bold text-slate-500">Kode manual</p>
        <p class="mt-2 tracking-[0.45em] text-3xl font-extrabold text-slate-950">${code}</p>
        <p class="mt-4 font-bold text-brand-blue">Berlaku <span id="handover-page-timer">10:00</span></p>
        <p class="mx-auto mt-4 max-w-xl text-sm font-semibold leading-6 ${isReady ? "text-slate-600" : "text-amber-600"}">${isReady ? "Kode hanya berlaku untuk transaksi ini dan tidak boleh dibagikan kepada orang lain." : "Selesaikan pelunasan dulu sebelum serah terima."}</p>
        <div class="mt-6 grid gap-3 sm:grid-cols-2">
          <button class="btn-primary rounded-2xl px-5 py-3" data-start-scan ${isReady ? "" : "disabled"}>Saya Sudah Bertemu Pemilik</button>
          <button class="btn-secondary rounded-2xl px-5 py-3" data-nav="chat">Chat Pemilik</button>
          <button class="btn-secondary rounded-2xl px-5 py-3 sm:col-span-2" data-nav="order-detail">Kembali ke Detail Transaksi</button>
        </div>
        <p id="scan-result" class="mt-5 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">${isReady ? "Menunggu konfirmasi serah terima." : "Pelunasan belum selesai."}</p>
      </article>
      <aside class="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
        <h2 class="text-xl font-extrabold text-slate-950">Detail Serah Terima</h2>
        <div class="mt-5 grid gap-3 text-sm font-semibold text-slate-600">
          ${checkout.summaryRow("Barang", item.name)}
          ${checkout.summaryRow("Penyewa", state.currentUser.name)}
          ${checkout.summaryRow("Pemilik", item.owner.name)}
          ${checkout.summaryRow("Lokasi COD", state.codLocation || item.location)}
          ${checkout.summaryRow("Jadwal", `${state.bookingStart}, 12.00 WIB`)}
        </div>
      </aside>
    </section>`, "max-w-6xl");
    bindBase();
    qris.createQr("handover-page-qr", `BB-COD-${state.selectedProductId}-${Date.now()}`);
    qris.startTimer("handover-page-timer", 600);
    document.querySelector("[data-refresh-handover-page]")?.addEventListener("click", renderQrHandover);
    document.querySelector("[data-start-scan]")?.addEventListener("click", async () => {
      const result = document.querySelector("#scan-result");
      if (!["FULLY_PAID", "READY_FOR_PICKUP", "RENTED"].includes(state.orderStatus)) {
        result.textContent = "QR belum bisa dipakai karena pelunasan belum selesai.";
        ui.toast("Selesaikan pelunasan sebelum serah terima");
        return;
      }
      try {
        await navigator.mediaDevices?.getUserMedia?.({ video: true });
      } catch {
        result.textContent = "Kamera tidak aktif. Masukkan kode serah terima secara manual.";
      }
      state.orderStatus = state.orderStatus === "RENTED" ? "RETURNED" : "RENTED";
      const message = state.orderStatus === "RENTED" ? "Scan valid. Barang diterima penyewa." : "Scan valid. Barang dikembalikan ke pemilik.";
      state.notifications = [message, ...state.notifications.filter(item => item !== message)];
      result.textContent = message;
      ui.toast(message);
    });
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
