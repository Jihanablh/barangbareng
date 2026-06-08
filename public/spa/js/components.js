(function () {
  const fallbackImage = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='900' height='650'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop stop-color='#2563EB'/><stop offset='1' stop-color='#14B8A6'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><text x='50%' y='50%' fill='white' font-size='42' font-family='Arial' font-weight='700' text-anchor='middle'>BarangBareng</text></svg>`);
  const rupiah = value => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
  const icon = (name, cls = "h-5 w-5") => `<i data-lucide="${name}" class="${cls}"></i>`;

  function imgTag(product, cls) {
    return `<img src="${product.image}" alt="${product.name}" class="${cls}" onerror="this.src='${fallbackImage}'">`;
  }

  function levelBadge(level) {
    if (level === "gold") return `<span class="badge bg-amber-100 text-amber-700"><span class="badge-gold">Gold</span></span>`;
    if (level === "silver") return `<span class="badge bg-slate-100 text-slate-700">Silver</span>`;
    return `<span class="badge bg-amber-100 text-amber-700">Bronze</span>`;
  }

  function productBadges(product) {
    const status = product.status === "low" ? `<span class="badge status-low badge-low">Hampir Habis</span>` : `<span class="badge status-available">Tersedia</span>`;
    const type = product.type === "pinjam" ? `<span class="badge type-free">Pinjam Gratis</span>` : `<span class="badge type-rent">Sewa Harian</span>`;
    return status + type;
  }

  function price(product) {
    if (product.type === "pinjam" || product.price === 0) return `<span class="text-teal-600">Gratis</span> <span class="text-xs text-slate-500">layanan Rp5.000</span>`;
    return `${rupiah(product.price)} <span class="text-xs text-slate-500">/hari</span>`;
  }

  function productCard(product, list = false) {
    const liked = state.wishlist.includes(product.id);
    return `<article class="product-card card overflow-hidden ${list ? "grid gap-4 p-4 md:grid-cols-[190px_1fr_180px]" : ""}">
      <div class="relative ${list ? "h-40 rounded-2xl" : "h-52 rounded-t-3xl"} overflow-hidden bg-slate-100">
        ${imgTag(product, "h-full w-full object-cover")}
        <div class="absolute left-3 top-3 flex flex-wrap gap-2">${productBadges(product)}</div>
        <button class="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-slate-500 shadow-card ${liked ? "heart-liked text-red-500" : ""}" data-wishlist="${product.id}" aria-label="Wishlist">${icon("heart")}</button>
      </div>
      <div class="${list ? "p-0" : "p-5"}">
        <div class="mb-2 flex flex-wrap gap-2">${product.badges.map(badge => `<span class="badge bg-slate-100 text-slate-600">${badge}</span>`).join("")}</div>
        <button class="text-left" data-product="${product.id}"><h3 class="line-clamp-2 text-lg font-extrabold text-slate-950">${product.name}</h3></button>
        <p class="mt-1 text-sm font-semibold text-slate-500">${product.category}</p>
        <p class="mt-3 text-sm font-semibold text-slate-600">Rating ${product.rating} · ${product.reviewCount} ulasan · ${product.rentedCount}x disewa</p>
        <p class="mt-2 flex items-center gap-2 text-sm text-slate-500">${icon("map-pin", "h-4 w-4 text-brand-blue")} ${product.campus} · ${product.location}</p>
        <div class="mt-4 flex items-center gap-3">
          <span class="grid h-9 w-9 place-items-center rounded-full bg-gradient-brand text-xs font-extrabold text-white">${product.owner.initials}</span>
          <div><p class="text-sm font-bold">${product.owner.name}</p><p class="text-xs text-slate-500">${levelBadge(product.owner.level)} Terverifikasi</p></div>
        </div>
      </div>
      <div class="${list ? "flex flex-col justify-center" : "px-5 pb-5"}">
        <p class="text-xl font-extrabold text-brand-blue">${price(product)}</p>
        <button class="btn-primary btn-ripple mt-4 w-full rounded-2xl px-5 py-3" data-book="${product.id}">Sewa Sekarang</button>
      </div>
    </article>`;
  }

  function categoryCard(category) {
    return `<button class="product-card card p-5 text-left" data-category="${category.name}">
      <span class="mb-5 block h-28 overflow-hidden rounded-2xl bg-slate-100">${imgTag({ image: category.image, name: category.name }, "h-full w-full object-cover")}</span>
      <strong class="text-slate-950">${category.name}</strong>
      <p class="mt-1 text-sm font-semibold text-slate-500">${category.count} barang</p>
      <p class="mt-3 text-xs font-semibold text-slate-400">${category.examples}</p>
    </button>`;
  }

  function renderHome() {
    const mount = document.querySelector("#home-view");
    if (!mount) return;
    const featured = BBData.products.slice(0, 8);
    mount.innerHTML = `<section class="gradient-animated hero-pattern relative overflow-hidden pt-[72px] text-white">
      <div class="hero-blob left-[-80px] top-24 h-80 w-80 bg-white"></div>
      <div class="hero-blob bottom-10 right-10 h-96 w-96 bg-teal-200"></div>
      <div class="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:py-24">
        <div class="relative z-10">
          <span class="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold">Platform Sewa Barang #1 untuk Mahasiswa</span>
          <h1 class="mt-6 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">Sewa Barang Harian Mahasiswa, Hemat & Praktis.</h1>
          <p class="mt-5 max-w-2xl text-lg leading-8 text-white/90">Temukan laptop, kamera, alat masak, perlengkapan kos, outfit formal, sampai kebutuhan event kampus dari sesama mahasiswa di sekitarmu.</p>
          <div class="mt-8 rounded-[28px] bg-white p-4 text-slate-900 shadow-lg">
            <div class="grid gap-3 lg:grid-cols-[1fr_180px_190px_auto]">
              <label class="field flex items-center gap-3">${icon("search", "h-5 w-5 text-brand-blue")}<input id="hero-search" class="w-full outline-none" placeholder="Cari barang yang kamu butuhkan..."></label>
              <select id="hero-category" class="field">${optionList(["all", ...BBData.categories.map(c => c.name)], "all", "Semua Kategori")}</select>
              <select id="hero-campus" class="field">${optionList(["all", ...BBData.campuses], "all", "Lokasi / Kampus")}</select>
              <button id="hero-search-btn" class="btn-primary btn-ripple rounded-2xl px-6 py-3">Cari Barang</button>
            </div>
            <div class="mt-4 flex gap-2 overflow-x-auto pb-1">${["Laptop", "Kamera Canon", "Rice Cooker", "Jas Sidang", "Tenda", "Proyektor", "Setrika", "Tripod"].map(chip => `<button class="badge shrink-0 bg-blue-50 text-brand-blue" data-chip="${chip}">${chip}</button>`).join("")}</div>
          </div>
          <div class="mt-6 flex flex-wrap gap-3 text-sm font-bold text-white/95"><span>Pembayaran Aman</span><span>QRIS BarangBareng</span><span>Terverifikasi</span><span>COD Kampus</span></div>
          <div class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">${[[2400, "+", "Barang"], [8500, "+", "Pengguna"], [120, "+", "Kampus"], [49, "/5", "Rating"]].map(item => `<div class="rounded-3xl bg-white/14 p-4"><strong class="text-2xl" data-counter="${item[0]}" data-suffix="${item[1]}">0</strong><p class="text-sm text-white/80">${item[2]}</p></div>`).join("")}</div>
        </div>
        <div class="relative z-10 min-h-[540px]">
          <div class="absolute inset-0 rounded-[2.5rem] bg-white/15 p-5 backdrop-blur-xl">
            <div class="mb-5 flex items-center justify-between rounded-3xl bg-white p-4 text-slate-900">
              <div class="flex gap-2"><span class="h-3 w-3 rounded-full bg-red-400"></span><span class="h-3 w-3 rounded-full bg-amber-400"></span><span class="h-3 w-3 rounded-full bg-green-400"></span></div>
              <strong>Marketplace Preview</strong>
            </div>
            ${heroPreviewCard(BBData.products[0], "float-1 -rotate-2")}
            ${heroPreviewCard(BBData.products[7], "float-2 ml-auto rotate-1")}
            ${heroPreviewCard(BBData.products[21], "float-3 -rotate-1")}
            <div class="absolute bottom-6 left-6 rounded-full bg-white px-4 py-2 text-sm font-bold text-brand-blue shadow-card">Pembayaran Aman</div>
            <div class="absolute bottom-20 right-6 rounded-full bg-white px-4 py-2 text-sm font-bold text-teal-600 shadow-card">COD Kampus</div>
          </div>
        </div>
      </div>
    </section>
    <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="mb-8 text-center reveal"><p class="font-bold text-brand-blue">Kategori Quick Access</p><h2 class="mt-2 text-3xl font-extrabold text-slate-950">Apa yang Kamu Butuhkan Hari Ini?</h2><p class="mt-3 text-slate-500">12 kategori barang untuk semua kebutuhan mahasiswa.</p></div>
      <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">${BBData.categories.map(categoryCard).join("")}</div>
    </section>
    <section id="how-it-works" class="bg-white py-16"><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><h2 class="text-3xl font-extrabold text-slate-950">Cara Kerja</h2><div class="mt-6 grid gap-4 md:grid-cols-4">${["Cari barang", "Bayar DP aman", "COD pakai QR", "Kembalikan barang"].map((step, index) => `<article class="card p-5"><span class="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-brand font-extrabold text-white">0${index + 1}</span><h3 class="mt-4 font-bold">${step}</h3><p class="mt-2 text-sm text-slate-500">Alur dibuat singkat, jelas, dan cocok untuk transaksi sekitar kampus.</p></article>`).join("")}</div></div></section>
    <section id="coin-pricing" class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div class="card grid gap-6 p-8 lg:grid-cols-[1fr_auto] lg:items-center"><div><p class="font-bold text-brand-blue">Harga & Koin</p><h2 class="mt-2 text-3xl font-extrabold">1 Koin = Rp1.000</h2><p class="mt-3 text-slate-500">Top up hanya via QRIS BarangBareng. Min. top up pertama 20 Koin.</p></div><button class="btn-primary rounded-2xl px-6 py-3" data-nav="topup">Top Up Koin</button></div></section>
    <section class="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8"><div class="mb-6 flex items-end justify-between"><div><p class="font-bold text-brand-blue">Lagi Banyak Dicari</p><h2 class="text-3xl font-extrabold text-slate-950">Produk Populer</h2></div><button class="btn-secondary rounded-2xl px-5 py-3" data-nav="browse">Lihat Semua</button></div><div class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">${featured.map(p => productCard(p)).join("")}</div></section>`;
    bindCommonEvents();
    document.querySelector("#hero-search-btn").addEventListener("click", () => {
      state.filters.query = document.querySelector("#hero-search").value;
      state.filters.category = document.querySelector("#hero-category").value;
      state.filters.campus = document.querySelector("#hero-campus").value;
      router.navigate("browse");
    });
  }

  function heroPreviewCard(product, cls) {
    return `<article class="${cls} mb-4 w-[min(320px,90%)] rounded-3xl bg-white p-3 text-slate-900 shadow-lg">
      <div class="grid grid-cols-[96px_1fr] gap-3">${imgTag(product, "h-24 w-full rounded-2xl object-cover")}<div><span class="badge status-available">Tersedia</span><h3 class="mt-2 line-clamp-1 font-extrabold">${product.name}</h3><p class="text-sm font-bold text-brand-blue">${price(product)}</p></div></div>
    </article>`;
  }

  function renderBrowse() {
    const mount = document.querySelector("#browse-view");
    if (!mount) return;
    const list = filters.getProducts();
    mount.innerHTML = `<div class="pb-16 pt-[72px]">
      <section class="sticky top-[72px] z-40 border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur-xl">
        <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div class="grid gap-3 lg:grid-cols-[1fr_220px_220px_180px_auto]">
          <label class="field flex items-center gap-3">${icon("search", "h-5 w-5 text-brand-blue")}<input id="browse-query" value="${state.filters.query}" class="w-full outline-none" placeholder="Cari produk, kategori, kampus..."></label>
          <select id="browse-category" class="field">${optionList(["all", ...BBData.categories.map(c => c.name)], state.filters.category, "Kategori")}</select>
          <select id="browse-campus" class="field">${optionList(["all", ...BBData.campuses], state.filters.campus, "Kampus")}</select>
          <select id="browse-sort" class="field">${sortOptions()}</select>
          <div class="flex gap-2"><button class="btn-secondary rounded-2xl px-3" data-view-mode="grid">${icon("grid-2x2")}</button><button class="btn-secondary rounded-2xl px-3" data-view-mode="list">${icon("list")}</button></div>
        </div>
        <div class="mt-3 flex gap-2 overflow-x-auto pb-1">${quickFilters().map(item => `<button class="badge shrink-0 ${state.filters.quickFilter === item.key ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-600"}" data-quick="${item.key}">${item.label}</button>`).join("")}</div>
        </div>
      </section>
      <div class="mx-auto mt-6 grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[270px_1fr] lg:px-8">
        <aside class="sidebar-filter hidden h-fit rounded-[24px] bg-white p-5 shadow-card lg:block">
          <h2 class="font-extrabold">Filter Detail</h2>
          <label class="mt-4 block text-sm font-bold">Lokasi COD</label><select class="field mt-2">${BBData.codLocations.map(item => `<option>${item}</option>`).join("")}</select>
          <label class="mt-4 block text-sm font-bold">Level Pemilik</label><select id="filter-level" class="field mt-2">${optionList(["all", "gold", "silver", "bronze"], state.filters.level, "Semua Level")}</select>
          <label class="mt-4 block text-sm font-bold">Rating Minimal</label><input id="filter-rating" class="mt-3 w-full accent-blue-600" type="range" min="0" max="5" step=".1" value="${state.filters.rating}"><p class="mt-1 text-sm text-slate-500">${state.filters.rating}+ bintang</p>
          <button class="btn-secondary mt-5 w-full rounded-2xl px-4 py-3" data-reset-filter>Reset Filter</button>
        </aside>
        <section><div class="mb-4 flex items-center justify-between"><h1 class="text-2xl font-extrabold text-slate-950">${list.length} barang ditemukan</h1><button class="btn-secondary rounded-2xl px-4 py-3 lg:hidden">Filter</button></div>
        ${list.length ? `<div class="${state.viewMode === "list" ? "grid gap-4" : "grid gap-5 md:grid-cols-2 xl:grid-cols-3"}">${list.map(product => productCard(product, state.viewMode === "list")).join("")}</div>` : emptyState()}</section>
      </div>
    </div>`;
    bindBrowseEvents();
    bindCommonEvents();
  }

  function renderDetail() {
    const mount = document.querySelector("#detail-view");
    if (!mount) return;
    const product = selectedProduct();
    const total = checkout.calculate(product, state.bookingDays);
    const similar = BBData.products.filter(item => item.category === product.category && item.id !== product.id).slice(0, 4);
    mount.innerHTML = `<div class="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <button class="btn-secondary mb-5 rounded-2xl px-4 py-2" data-nav="browse">Kembali</button>
      <p class="mb-5 text-sm font-semibold text-slate-500">Beranda / ${product.category} / ${product.name}</p>
      <div class="grid gap-8 lg:grid-cols-[1fr_380px]">
        <section class="card p-5">
          ${imgTag(product, "h-[420px] w-full rounded-3xl object-cover")}
          <div class="mt-3 grid grid-cols-4 gap-3">${product.gallery.map(src => `<img src="${src}" alt="Galeri ${product.name}" class="h-24 w-full rounded-2xl object-cover" onerror="this.src='${fallbackImage}'">`).join("")}</div>
          <div class="mt-7 flex flex-wrap gap-2">${productBadges(product)}<span class="badge bg-blue-100 text-brand-blue">Mahasiswa Terverifikasi</span></div>
          <div class="mt-5 flex flex-col justify-between gap-4 sm:flex-row"><div><h1 class="text-3xl font-extrabold text-slate-950">${product.name}</h1><p class="mt-2 font-semibold text-slate-600">Rating ${product.rating} · ${product.reviewCount} ulasan · ${product.location}</p></div><div class="flex gap-2"><button class="btn-secondary rounded-2xl px-4">${icon("share-2")}</button><button class="btn-secondary rounded-2xl px-4" data-wishlist="${product.id}">${icon("heart")}</button></div></div>
          <p class="mt-5 leading-7 text-slate-600">${product.description}</p>
          <div class="mt-7 grid gap-4 md:grid-cols-3"><article class="rounded-3xl bg-slate-50 p-5"><h3 class="font-bold">Spesifikasi</h3><ul class="mt-3 grid gap-2 text-sm text-slate-600"><li>Kategori: ${product.category}</li><li>Subkategori: ${product.subcategory}</li><li>Minimal sewa: ${product.minDays} hari</li><li>Maksimal sewa: ${product.maxDays} hari</li></ul></article><article class="rounded-3xl bg-slate-50 p-5"><h3 class="font-bold">Kelengkapan</h3><ul class="mt-3 grid gap-2 text-sm text-slate-600">${product.includes.map(item => `<li>${item}</li>`).join("")}</ul></article><article class="rounded-3xl bg-slate-50 p-5"><h3 class="font-bold">Kondisi Barang</h3><div class="mt-4 h-3 rounded-full bg-slate-200"><div class="progress-animated h-full rounded-full bg-gradient-brand" style="width:${product.condition}%"></div></div><p class="mt-2 text-sm text-slate-500">${product.condition}% sangat layak pakai</p></article></div>
          <div class="mt-5 grid gap-4 md:grid-cols-2"><article class="rounded-3xl bg-blue-50 p-5"><h3 class="font-bold text-brand-blue">Syarat Pemilik</h3><p class="mt-2 text-sm text-blue-700">${product.notes}</p></article><article class="rounded-3xl bg-teal-50 p-5"><h3 class="font-bold text-teal-700">Pembayaran Aman</h3><p class="mt-2 text-sm text-teal-700">Pembayaran aman dan tercatat. QR serah terima dipakai saat COD.</p></article></div>
          <h2 class="mt-8 text-2xl font-extrabold">Kalender Ketersediaan</h2><div class="mt-4 grid grid-cols-7 gap-2">${Array.from({ length: 14 }, (_, i) => `<span class="rounded-2xl ${i % 5 === 0 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"} py-3 text-center text-sm font-bold">${i + 1}</span>`).join("")}</div>
          <h2 class="mt-8 text-2xl font-extrabold">Ulasan</h2>${product.reviews.map(review => `<article class="mt-4 rounded-3xl bg-slate-50 p-5"><strong>${review.name}</strong><p class="text-sm text-slate-500">Rating ${review.rating} · ${review.date}</p><p class="mt-2">${review.text}</p></article>`).join("")}
          <h2 class="mt-8 text-2xl font-extrabold">Produk Serupa</h2><div class="mt-4 grid gap-4 md:grid-cols-2">${similar.map(item => productCard(item)).join("")}</div>
        </section>
        <aside class="booking-card-sticky card p-6">
          <p class="text-3xl font-extrabold text-brand-blue">${price(product)}</p><p class="mt-2 text-sm text-slate-500">${product.campus} · estimasi dekat area COD</p>
          <label class="mt-5 block text-sm font-bold">Pilih tanggal</label><input class="field mt-2" type="date">
          <label class="mt-5 block text-sm font-bold">Durasi: ${state.bookingDays} hari</label><input id="booking-days" class="mt-3 w-full accent-blue-600" type="range" min="${product.minDays}" max="${product.maxDays}" value="${state.bookingDays}">
          <div class="mt-5 rounded-3xl bg-slate-50 p-4 text-sm font-semibold">${feeRows(total)}</div>
          <button class="btn-primary mt-5 w-full rounded-2xl px-5 py-3" data-book="${product.id}">Sewa Sekarang</button><button class="btn-secondary mt-3 w-full rounded-2xl px-5 py-3" data-nav="chat">Chat Pemilik</button><p class="mt-4 rounded-3xl bg-teal-50 p-4 text-sm font-semibold text-teal-700">Pembayaran aman dan tercatat.</p>
        </aside>
      </div>
    </div>`;
    bindCommonEvents();
    document.querySelector("#booking-days")?.addEventListener("input", event => { state.bookingDays = Number(event.target.value); renderDetail(); });
  }

  function renderCheckout() {
    const mount = document.querySelector("#checkout-view");
    if (!mount) return;
    mount.innerHTML = checkout.render();
    bindCommonEvents();
    checkout.bind();
  }

  function renderBuyer() {
    const mount = document.querySelector("#buyer-view");
    if (!mount) return;
    mount.innerHTML = dashboardShell("Dashboard Penyewa", [
      ["Saldo Koin", `${state.coinBalance} Koin`], ["Pesanan Aktif", "2"], ["Wishlist", state.wishlist.length], ["Total Hemat", "Rp3,4jt"], ["Level Pengguna", "Silver"], ["Voucher Aktif", "3"]
    ], `<div class="grid gap-6 lg:grid-cols-2"><section class="card p-6"><h2 class="text-xl font-bold">Pesanan Aktif</h2><div class="mt-4 grid gap-3">${state.notifications.map(text => `<p class="rounded-3xl bg-blue-50 p-4 text-sm font-semibold text-blue-700">${text}</p>`).join("")}</div></section><section class="card p-6"><h2 class="text-xl font-bold">Top Up Koin</h2><p class="mt-2 text-slate-500">QRIS BarangBareng, cepat dan tercatat.</p><button class="btn-primary mt-5 rounded-2xl px-5 py-3" data-nav="topup">Top Up Sekarang</button></section></div><h2 class="mt-8 text-2xl font-extrabold">Rekomendasi Terdekat</h2><div class="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-4">${BBData.products.slice(0, 4).map(p => productCard(p)).join("")}</div>`);
    bindCommonEvents();
  }

  function renderSeller() {
    const mount = document.querySelector("#seller-view");
    if (!mount) return;
    const listings = BBData.products.slice(0, 5).map(product => `<div class="mt-4 grid gap-4 rounded-3xl bg-slate-50 p-4 md:grid-cols-[110px_1fr_auto] md:items-center">
      ${imgTag(product, "h-24 w-full rounded-2xl object-cover")}
      <div><b>${product.name}</b><p class="text-sm text-slate-500">Aktif - Tersedia - ${product.rentedCount} disewa - ${20 + product.id} wishlist</p></div>
      <div class="flex gap-2"><button class="btn-secondary rounded-xl px-3 py-2 text-sm" data-edit-product="${product.id}">Edit</button><button class="btn-secondary rounded-xl px-3 py-2 text-sm" data-product-statistics="${product.id}">Statistik</button></div>
    </div>`).join("");
    const requests = ["Difa Surya", "Maya Putri", "Raka Pradipta"].map((name, index) => `<div class="mt-4 rounded-3xl bg-slate-50 p-4"><b>${name}</b><p class="text-sm text-slate-500">Silver - Rating 4.${9 - index} - ${12 + index * 4} transaksi</p><p class="mt-2 text-sm">COD: Perpustakaan, besok 14.00</p><button class="mt-3 rounded-xl bg-teal-500 px-3 py-2 text-sm font-bold text-white">Terima</button><button class="ml-2 rounded-xl bg-red-100 px-3 py-2 text-sm font-bold text-red-700">Tolak</button></div>`).join("");
    const chart = [45, 60, 52, 80, 70, 96].map((height, index) => `<div class="flex flex-1 flex-col items-center gap-2"><div class="w-full rounded-t-2xl bg-gradient-brand" style="height:${height}%"></div><span class="text-xs font-bold text-slate-400">B${index + 1}</span></div>`).join("");
    mount.innerHTML = dashboardShell("Dashboard Pemilik", [
      ["Pendapatan", "Rp1,8jt"], ["Barang Aktif", "12"], ["Sedang Disewa", "4"], ["Request Masuk", "3"], ["Rating", "4.9"], ["Produk Laris", "Jas Formal"]
    ], `<div class="grid gap-6 lg:grid-cols-[1.2fr_.8fr]"><section class="card p-6"><div class="flex items-center justify-between"><h2 class="text-xl font-bold">Listing Barang</h2><button class="btn-primary rounded-2xl px-4 py-2" data-nav="upload-product">Upload Barang</button></div>${listings}</section><section class="card p-6"><h2 class="text-xl font-bold">Request Masuk</h2>${requests}</section></div><section class="card mt-6 p-6"><h2 class="text-xl font-bold">Grafik Pendapatan</h2><div class="mt-5 flex h-48 items-end gap-3">${chart}</div><p class="mt-5 rounded-3xl bg-amber-50 p-4 text-sm font-semibold text-amber-700">Tips: foto real yang terang dan deskripsi kelengkapan meningkatkan peluang disewa.</p></section>`);
    bindCommonEvents();
  }
  function renderProfile() {
    const mount = document.querySelector("#profile-view");
    if (!mount) return;
    mount.innerHTML = `<div class="mx-auto max-w-5xl px-4 pb-16 pt-28 sm:px-6 lg:px-8"><section class="card p-8"><div class="flex flex-col gap-5 md:flex-row md:items-center"><span class="grid h-24 w-24 place-items-center rounded-[2rem] bg-gradient-brand text-3xl font-extrabold text-white">DS</span><div><h1 class="text-3xl font-extrabold text-slate-950">Difa Surya</h1><p class="text-slate-500">difa@kampus.ac.id · Universitas Indonesia</p><p class="mt-2">${levelBadge("silver")} Mahasiswa Terverifikasi · 23 transaksi</p></div></div><div class="mt-7 h-4 rounded-full bg-slate-100"><div class="h-full w-[76%] rounded-full bg-gradient-brand"></div></div><p class="mt-2 text-sm font-semibold text-slate-500">Progress ke Gold: 23/30</p><div class="mt-6 grid gap-4 md:grid-cols-4">${["Email", "HP", "KTP", "Wajah"].map(item => `<div class="rounded-3xl bg-teal-50 p-4 font-bold text-teal-700">${item} verified</div>`).join("")}</div></section></div>`;
  }

  function dashboardShell(title, stats, body) {
    return `<div class="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8"><h1 class="text-3xl font-extrabold text-slate-950">${title}</h1><div class="mt-6 grid gap-4 md:grid-cols-3 xl:grid-cols-6">${stats.map(stat => `<article class="card p-5"><p class="text-sm font-semibold text-slate-500">${stat[0]}</p><strong class="mt-2 block text-2xl text-slate-950">${stat[1]}</strong></article>`).join("")}</div><div class="mt-6">${body}</div></div>`;
  }

  function emptyState() {
    return `<div class="card p-10 text-center">${icon("search-x", "mx-auto h-16 w-16 text-slate-300")}<h2 class="mt-5 text-2xl font-extrabold text-slate-950">Barang belum ketemu</h2><p class="mt-2 text-slate-500">Coba ubah kata kunci, kampus, kategori, atau filter cepat.</p><button class="btn-primary mt-6 rounded-2xl px-6 py-3" data-reset-filter>Reset Filter</button></div>`;
  }

  function feeRows(total) {
    return `<div class="flex justify-between"><span>Subtotal</span><b>${rupiah(total.subtotal)}</b></div><div class="mt-2 flex justify-between"><span>Biaya layanan</span><b>${rupiah(total.service)}</b></div><div class="mt-2 flex justify-between"><span>Biaya transaksi</span><b>${rupiah(total.transaction)}</b></div><hr class="my-3"><div class="flex justify-between"><span>Total</span><b>${rupiah(total.total)}</b></div><div class="mt-2 flex justify-between text-brand-blue"><span>DP 50%</span><b>${rupiah(total.dp)}</b></div><div class="mt-2 flex justify-between text-teal-600"><span>Sisa bayar saat COD</span><b>${rupiah(total.remaining)}</b></div>`;
  }

  function optionList(items, selected, allLabel) {
    return items.map(item => `<option value="${item}" ${item === selected ? "selected" : ""}>${item === "all" ? allLabel : item}</option>`).join("");
  }

  function sortOptions() {
    const options = [["relevant", "Paling Relevan"], ["nearby", "Terdekat"], ["price-low", "Harga Terendah"], ["price-high", "Harga Tertinggi"], ["rating", "Rating Tertinggi"], ["rented", "Paling Sering Disewa"], ["newest", "Terbaru"]];
    return options.map(option => `<option value="${option[0]}" ${state.sortBy === option[0] ? "selected" : ""}>${option[1]}</option>`).join("");
  }

  function quickFilters() {
    return [{ key: "nearby", label: "Terdekat" }, { key: "today", label: "Tersedia Hari Ini" }, { key: "free", label: "Pinjam Gratis" }, { key: "rating", label: "Rating 4.8+" }, { key: "cheap", label: "Harga < Rp25.000" }, { key: "kos", label: "Cocok untuk Anak Kos" }, { key: "event", label: "Cocok untuk Event" }];
  }

  function selectedProduct() {
    return BBData.products.find(product => product.id === state.selectedProductId) || BBData.products[0];
  }

  function bindBrowseEvents() {
    document.querySelector("#browse-query")?.addEventListener("input", debounce(event => filters.set("query", event.target.value), 300));
    document.querySelector("#browse-category")?.addEventListener("change", event => filters.set("category", event.target.value));
    document.querySelector("#browse-campus")?.addEventListener("change", event => filters.set("campus", event.target.value));
    document.querySelector("#browse-sort")?.addEventListener("change", event => { state.sortBy = event.target.value; renderBrowse(); });
    document.querySelector("#filter-level")?.addEventListener("change", event => filters.set("level", event.target.value));
    document.querySelector("#filter-rating")?.addEventListener("input", event => filters.set("rating", event.target.value));
    document.querySelectorAll("[data-quick]").forEach(button => button.addEventListener("click", () => { state.filters.quickFilter = state.filters.quickFilter === button.dataset.quick ? null : button.dataset.quick; renderBrowse(); }));
    document.querySelectorAll("[data-view-mode]").forEach(button => button.addEventListener("click", () => { state.viewMode = button.dataset.viewMode; renderBrowse(); }));
  }

  function bindCommonEvents() {
    document.querySelectorAll("[data-product]").forEach(button => button.addEventListener("click", () => router.navigate("product-detail", { productId: button.dataset.product })));
    document.querySelectorAll("[data-book]").forEach(button => button.addEventListener("click", () => { state.rememberProduct(Number(button.dataset.book)); state.checkoutStep = 1; router.navigate("checkout"); }));
    document.querySelectorAll("[data-wishlist]").forEach(button => button.addEventListener("click", event => { event.stopPropagation(); state.toggleWishlist(Number(button.dataset.wishlist)); ui.toast(state.wishlist.includes(Number(button.dataset.wishlist)) ? "Ditambahkan ke wishlist" : "Dihapus dari wishlist"); viewInit[router.currentView]?.(); }));
    document.querySelectorAll("[data-category]").forEach(button => button.addEventListener("click", () => { state.filters.category = button.dataset.category; router.navigate("browse"); }));
    document.querySelectorAll("[data-chip]").forEach(button => button.addEventListener("click", () => { state.filters.query = button.dataset.chip; router.navigate("browse"); }));
    document.querySelectorAll("[data-reset-filter]").forEach(button => button.addEventListener("click", filters.reset));
    bindNavEvents();
    if (window.lucide) lucide.createIcons();
  }

  function bindNavEvents() {
    document.querySelectorAll("[data-nav]").forEach(button => button.addEventListener("click", () => router.navigate(button.dataset.nav)));
  }

  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  window.components = { renderHome, renderBrowse, renderDetail, renderCheckout, renderBuyer, renderSeller, renderProfile, bindNavEvents, rupiah, selectedProduct, feeRows, optionList, productCard, icon };
})();
