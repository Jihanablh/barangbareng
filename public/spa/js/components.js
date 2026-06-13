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
    const liked = state.isWishlisted(product.id);
    const goldSeller = product.owner.level === "gold" ? `<span class="badge bg-amber-50 text-amber-700">Gold Seller</span>` : "";
    return `<article class="product-card card overflow-hidden ${list ? "grid gap-4 p-4 md:grid-cols-[190px_1fr_180px]" : ""}">
      <div class="relative ${list ? "h-40 rounded-2xl" : "h-52 rounded-t-3xl"} overflow-hidden bg-slate-100">
        ${imgTag(product, "h-full w-full object-cover")}
        <div class="absolute left-3 top-3 flex flex-wrap gap-2">${productBadges(product)}</div>
        <button class="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-slate-500 shadow-card ${liked ? "heart-liked text-red-500" : ""}" data-wishlist="${product.id}" aria-label="Disimpan">${icon("heart", liked ? "h-5 w-5 fill-current" : "h-5 w-5")}</button>
      </div>
      <div class="${list ? "p-0" : "p-5"}">
        <div class="mb-2 flex flex-wrap gap-2">${product.badges.map(badge => `<span class="badge bg-slate-100 text-slate-600">${badge}</span>`).join("")}</div>
        <button class="text-left" data-product="${product.id}"><h3 class="line-clamp-2 text-lg font-extrabold text-slate-950">${product.name}</h3></button>
        <p class="mt-1 text-sm font-semibold text-slate-500">${product.category}</p>
        <p class="mt-3 text-sm font-semibold text-slate-600">Rating ${product.rating} · ${product.reviewCount} ulasan · ${product.rentedCount}x disewa</p>
        <p class="mt-2 flex items-center gap-2 text-sm text-slate-500">${icon("map-pin", "h-4 w-4 text-brand-blue")} ${product.campus} · ${product.location}</p>
        <div class="mt-4 flex items-center gap-3">
          <span class="grid h-9 w-9 place-items-center rounded-full bg-gradient-brand text-xs font-extrabold text-white">${product.owner.initials}</span>
          <div><p class="text-sm font-bold">${product.owner.name}</p><p class="text-xs text-slate-500">${levelBadge(product.owner.level)} Terverifikasi</p>${goldSeller ? `<p class="mt-1">${goldSeller}</p>` : ""}</div>
        </div>
      </div>
      <div class="${list ? "flex flex-col justify-center" : "px-5 pb-5"}">
        <p class="text-xl font-extrabold text-brand-blue">${price(product)}</p>
        <div class="mt-4 grid gap-2">
          <button class="btn-primary btn-ripple w-full rounded-2xl px-5 py-3" data-book="${product.id}">Sewa Sekarang</button>
          <button class="btn-secondary w-full rounded-2xl px-5 py-3 text-sm" data-card-cart="${product.id}">Masukkan ke Keranjang</button>
        </div>
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
    ensureDetailState(product);
    const gallery = [product.image, ...(product.gallery || [])].filter((src, index, list) => src && list.indexOf(src) === index).slice(0, 5);
    const activeImage = gallery[state.detailGallery?.[product.id] || 0] || product.image;
    const days = detailDuration();
    const total = detailFee(product, days);
    const similar = similarProducts(product);
    const liked = state.isWishlisted(product.id);
    const inCart = state.isInCart(product.id);
    const reviewStats = reviewSummary(product);
    mount.innerHTML = `<main class="min-h-screen bg-slate-50 pt-24">
      <div class="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div class="mb-5 flex flex-col gap-3 text-sm font-semibold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p class="min-w-0 truncate">Beranda / Jelajah Barang / ${product.category} / ${product.name}</p>
          <button class="inline-flex w-fit items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-brand-blue" data-nav="browse">${icon("arrow-left", "h-4 w-4")} Kembali ke Jelajah Barang</button>
        </div>

        <section class="rounded-[32px] border border-slate-100 bg-white p-5 shadow-sm lg:p-8">
          <div class="grid gap-8 lg:grid-cols-2 lg:items-start">
          <article>
            <div class="relative overflow-hidden rounded-[28px] bg-slate-100">
              <img src="${activeImage}" alt="${product.name}" class="aspect-[4/3] w-full object-cover transition duration-300 hover:scale-[1.03]" onerror="this.src='${fallbackImage}'">
              <div class="absolute left-4 top-4 flex max-w-[80%] flex-wrap gap-2">${productBadges(product)}<span class="badge bg-white/95 text-slate-700">${product.subcategory}</span></div>
            </div>
            <div class="mt-4 grid grid-cols-4 gap-3">${gallery.slice(0, 4).map((src, index) => `<button class="overflow-hidden rounded-2xl border-2 ${src === activeImage ? "border-brand-blue" : "border-slate-100"} bg-slate-100 transition hover:border-blue-300" data-gallery-index="${index}"><img src="${src}" alt="Galeri ${index + 1} ${product.name}" class="aspect-square w-full object-cover" onerror="this.src='${fallbackImage}'"></button>`).join("")}</div>
          </article>

          <article class="min-w-0">
            <div class="flex flex-wrap gap-2"><span class="badge bg-blue-50 text-brand-blue">${product.category}</span><span class="badge status-available">${product.status === "low" ? "Hampir Habis" : "Tersedia"}</span><span class="badge bg-amber-50 text-amber-700">Top Rated</span></div>
            <h1 class="mt-4 text-2xl font-bold leading-tight text-slate-900 lg:text-3xl">${product.name}</h1>
            <p class="mt-3 text-sm font-semibold leading-6 text-slate-500"><span class="text-amber-400">★</span> ${reviewStats.average} · ${reviewStats.total} ulasan · ${product.rentedCount}x disewa</p>
            <p class="mt-5 text-3xl font-extrabold text-blue-600">${price(product)}</p>
            <div class="mt-5 grid gap-3 rounded-2xl border border-slate-100 bg-white p-4 text-sm font-semibold text-slate-600 sm:grid-cols-2">
              <p class="flex items-center gap-2">${icon("map-pin", "h-4 w-4 text-brand-blue")} ${product.location}</p>
              <p class="flex items-center gap-2">${icon("school", "h-4 w-4 text-brand-blue")} ${product.campus}</p>
            </div>
            <div class="mt-5 flex flex-wrap gap-3">
              <button class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-semibold transition ${liked ? "border-red-100 bg-red-50 text-red-600" : "border-slate-200 text-slate-700 hover:bg-slate-50"}" data-wishlist="${product.id}">${icon("heart", liked ? "h-4 w-4 fill-current" : "h-4 w-4")} ${liked ? "Tersimpan" : "Simpan"}</button>
              <button class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50" data-share-product>${icon("share-2", "h-4 w-4")} Bagikan</button>
            </div>

            <div class="mt-5 rounded-[24px] bg-slate-50 p-5">
              <p class="text-sm font-extrabold text-slate-900">Ringkasan Sewa</p>
              <div class="mt-4 grid gap-3 sm:grid-cols-2">
                <label class="text-sm font-bold text-slate-700">Tanggal Mulai<input id="booking-start" class="field mt-2" type="date" value="${state.bookingStart}"></label>
                <label class="text-sm font-bold text-slate-700">Tanggal Selesai<input id="booking-end" class="field mt-2" type="date" value="${state.bookingEnd}"></label>
              </div>
              <p class="mt-3 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-bold text-brand-blue">Durasi: ${days} hari</p>
              <div class="mt-4 rounded-3xl bg-white p-4 text-sm font-semibold text-slate-700">${detailFeeRows(product, total, days)}</div>
            </div>

            <div class="mt-5 grid gap-3">
              <button class="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 px-5 py-3.5 text-sm font-bold text-white shadow-md transition hover:scale-[1.01] hover:shadow-lg active:scale-[0.98]" data-book="${product.id}">Sewa Sekarang</button>
              <div class="grid gap-3 sm:grid-cols-2">
                <button class="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-center text-sm font-bold transition ${inCart ? "border-teal-100 bg-teal-50 text-teal-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}" data-add-cart="${product.id}">${icon(inCart ? "check" : "plus", "h-4 w-4 shrink-0")} <span>${inCart ? "Sudah di Keranjang" : "Masukkan ke Keranjang"}</span></button>
                <button class="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-50" data-nav="chat">${icon("message-circle", "h-4 w-4 shrink-0")} <span>Chat Pemilik</span></button>
              </div>
              <p class="rounded-2xl bg-teal-50 px-4 py-3 text-sm font-medium leading-6 text-teal-700">Pembayaran Aman dan transaksi tercatat di sistem.</p>
            </div>
          </article>
          </div>
        </section>

        <div class="mt-8">${ownerProfile(product)}</div>
        <div class="mt-8">${detailInfoSections(product)}</div>
        <div class="mt-10">${ratingSection(product)}</div>
        <div class="mt-10">${similarSection(similar)}</div>
      </div>
    </main>`;
    bindCommonEvents();
    bindDetailEvents(product);
  }

  function ensureDetailState(product) {
    state.detailGallery = state.detailGallery || {};
    state.cart = state.cart || [];
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + Math.max(2, state.bookingDays || product.minDays || 1));
    state.bookingStart = state.bookingStart || formatDate(start);
    state.bookingEnd = state.bookingEnd || formatDate(end);
    if (state.detailGallery[product.id] === undefined) state.detailGallery[product.id] = 0;
  }

  function formatDate(date) {
    return date.toISOString().slice(0, 10);
  }

  function detailDuration() {
    const start = new Date(state.bookingStart);
    const end = new Date(state.bookingEnd);
    const diff = Math.round((end - start) / 86400000) + 1;
    state.bookingDays = Math.max(1, Number.isFinite(diff) ? diff : 1);
    return state.bookingDays;
  }

  function detailFee(product, days) {
    const subtotal = product.type === "pinjam" ? 0 : product.price * days;
    const service = product.type === "pinjam" ? 5000 : Math.max(2500, Math.round(subtotal * 0.025));
    const total = subtotal + service;
    const dp = Math.ceil(total * 0.3);
    return { subtotal, service, total, dp, remaining: total - dp };
  }

  function detailFeeRows(product, total, days) {
    const base = product.type === "pinjam" ? "Gratis" : `${rupiah(product.price)} x ${days} hari`;
    return `<div class="flex justify-between gap-4"><span>${base}</span><b>${rupiah(total.subtotal)}</b></div>
      <div class="mt-2 flex justify-between gap-4"><span>Biaya layanan</span><b>${rupiah(total.service)}</b></div>
      <hr class="my-3">
      <div class="flex justify-between gap-4 text-slate-950"><span>Total</span><b>${rupiah(total.total)}</b></div>
      <div class="mt-2 flex justify-between gap-4 text-brand-blue"><span>DP 30%</span><b>${rupiah(total.dp)}</b></div>
      <div class="mt-2 flex justify-between gap-4 text-teal-600"><span>Sisa pembayaran</span><b>${rupiah(total.remaining)}</b></div>`;
  }

  function usageHint(product) {
    if (product.category.includes("Kamera")) return "tugas fotografi, dokumentasi event, dan konten";
    if (product.category.includes("Fashion")) return "sidang, wisuda, interview, dan acara kampus";
    if (product.category.includes("Outdoor")) return "camping, kegiatan alam, dan acara komunitas";
    if (product.category.includes("Masak")) return "kebutuhan kos, masak hemat, dan acara kecil";
    return "kuliah, kegiatan kampus, kos, dan kebutuhan harian";
  }

  function ownerProfile(product) {
    const ownerReviews = state.reviewsForOwner(product.owner.initials);
    const ownerAverage = average(ownerReviews.map(review => review.ownerRating), product.owner.rating);
    const completed = product.owner.txCount;
    const responseRate = 94 + product.id % 5;
    const reputationBadges = [
      ownerAverage >= 4.5 ? "Pemilik Terpercaya" : null,
      completed >= 50 ? "Top Lender" : null,
      responseRate >= 90 ? "Sangat Responsif" : null
    ].filter(Boolean);
    const ownerStats = [
      ["Penilaian", ownerAverage.toFixed(1)],
      ["Produk", `${8 + product.id % 7}`],
      ["Chat Dibalas", `${responseRate}%`],
      ["Waktu Balas", "< 1 jam"],
      ["Bergabung", "Mar 2025"],
      ["Transaksi Selesai", `${completed}`]
    ];
    return `<section class="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      <div class="grid gap-6 lg:grid-cols-[1.1fr_1.6fr] lg:items-center">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <span class="grid h-16 w-16 shrink-0 place-items-center rounded-[22px] bg-gradient-brand text-xl font-extrabold text-white">${product.owner.initials}</span>
          <div class="min-w-0">
            <p class="text-sm font-bold text-brand-blue">Pemilik Barang</p>
            <h2 class="text-2xl font-extrabold text-slate-950">${product.owner.name}</h2>
            <p class="mt-1 text-sm font-semibold text-slate-500">Aktif 5 menit lalu</p>
            <p class="mt-2 flex flex-wrap gap-2">${levelBadge(product.owner.level)}<span class="badge bg-teal-50 text-teal-700">Mahasiswa Terverifikasi</span>${reputationBadges.map(badge => `<span class="badge bg-amber-50 text-amber-700">${badge}</span>`).join("")}</p>
            <div class="mt-4 grid gap-2 sm:flex sm:flex-wrap"><button class="btn-primary rounded-2xl px-4 py-2.5 text-sm" data-nav="chat">${icon("message-circle", "h-4 w-4")} Chat Sekarang</button><button class="btn-secondary rounded-2xl px-4 py-2.5 text-sm" data-nav="profile">Lihat Profil</button></div>
          </div>
        </div>
        <div>
          <h3 class="mb-3 text-sm font-extrabold text-slate-950">Reputasi Pemilik</h3>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">${ownerStats.map(stat => `<div class="rounded-2xl bg-slate-50 p-4"><p class="text-xs font-bold text-slate-500">${stat[0]}</p><b class="mt-1 block text-slate-950">${stat[1]}</b></div>`).join("")}</div>
        </div>
      </div>
    </section>`;
  }

  function detailInfoSections(product) {
    const specs = [
      ["Merek", product.name.split(" ")[0]],
      ["Model", product.subcategory],
      ["Kategori", product.category],
      ["Warna", product.id % 2 ? "Hitam" : "Putih"],
      ["Kondisi", `${product.condition}%`],
      ["Lokasi COD", product.location],
      ["Kampus", product.campus],
      ["Tipe", product.type === "pinjam" ? "Pinjam Gratis" : "Sewa Harian"]
    ];
    const rules = [
      `Minimal sewa ${product.minDays} hari`,
      `Maksimal sewa ${product.maxDays} hari`,
      "COD di sekitar kampus atau titik yang disepakati",
      "Jam serah terima mengikuti kesepakatan pemilik",
      "Harap menjaga barang dengan baik",
      "Keterlambatan pengembalian dikenakan biaya tambahan"
    ];
    return `<section class="grid gap-5 lg:grid-cols-2">
      <article class="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"><h2 class="text-xl font-extrabold text-slate-950">Spesifikasi Produk</h2><div class="mt-4 divide-y divide-slate-100">${specs.map(item => `<div class="flex justify-between gap-4 py-3 text-sm"><span class="font-semibold text-slate-500">${item[0]}</span><b class="text-right text-slate-900">${item[1]}</b></div>`).join("")}</div></article>
      <article class="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"><h2 class="text-xl font-extrabold text-slate-950">Deskripsi Produk</h2><p class="mt-4 max-w-3xl leading-7 text-slate-600">${product.description} Foto real, kondisi dicek sebelum serah terima, dan cocok untuk ${usageHint(product)}.</p><p class="mt-5 rounded-2xl bg-blue-50 p-4 text-sm font-semibold text-blue-700">Cocok untuk: ${usageHint(product)}.</p></article>
      <div class="grid gap-5 lg:col-span-2 lg:grid-cols-2">
        <article class="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"><h2 class="text-xl font-extrabold text-slate-950">Kelengkapan</h2><div class="mt-4 grid gap-2 sm:grid-cols-2">${product.includes.concat(["Aksesori tambahan sesuai stok", "Bukti kondisi awal"]).map(item => `<p class="flex items-center gap-2 rounded-2xl bg-teal-50 p-3 text-sm font-semibold text-teal-700">${icon("check", "h-4 w-4 shrink-0")} ${item}</p>`).join("")}</div></article>
        <article class="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"><h2 class="text-xl font-extrabold text-slate-950">Kondisi Barang</h2><div class="mt-4 flex items-end gap-2"><p class="text-4xl font-extrabold text-brand-blue">${product.condition}%</p><span class="pb-1 text-sm font-bold text-slate-500">layak pakai</span></div><div class="mt-4 h-3 rounded-full bg-slate-100"><div class="h-full rounded-full bg-gradient-brand" style="width:${product.condition}%"></div></div><p class="mt-4 text-sm leading-6 text-slate-600">Kondisi fisik terawat dengan pemakaian wajar. Semua fungsi utama sudah dicek oleh pemilik sebelum disewakan.</p></article>
      </div>
      <div class="grid gap-5 lg:col-span-2 lg:grid-cols-[1fr_1.15fr]">
        <article class="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"><h2 class="text-xl font-extrabold text-slate-950">Syarat Pemilik</h2><div class="mt-4 grid gap-2">${rules.map(item => `<p class="rounded-2xl bg-slate-50 p-3 text-sm font-semibold text-slate-600">${item}</p>`).join("")}</div></article>
        <article class="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"><h2 class="text-xl font-extrabold text-slate-950">Kalender Ketersediaan</h2>${availabilityCalendar()}</article>
      </div>
    </section>`;
  }

  function availabilityCalendar() {
    const labels = ["S", "S", "R", "K", "J", "S", "M"];
    const cells = Array.from({ length: 28 }, (_, index) => {
      const day = index + 1;
      const style = index === 8 ? "bg-brand-blue text-white" : index % 9 === 0 ? "bg-rose-50 text-rose-600" : index % 7 === 0 ? "bg-slate-100 text-slate-500" : "bg-teal-50 text-teal-700";
      return `<span class="rounded-xl ${style} py-2 text-center text-xs font-bold">${day}</span>`;
    }).join("");
    return `<div class="mt-4 grid grid-cols-7 gap-2">${labels.map(label => `<b class="text-center text-xs text-slate-400">${label}</b>`).join("")}${cells}</div>
      <div class="mt-4 flex flex-wrap gap-2 text-xs font-bold"><span class="badge bg-teal-50 text-teal-700">Tersedia</span><span class="badge bg-rose-50 text-rose-600">Sudah dibooking</span><span class="badge bg-slate-100 text-slate-500">Tidak tersedia</span><span class="badge bg-blue-50 text-brand-blue">Dipilih</span></div>`;
  }

  function average(values, fallback = 0) {
    const nums = values.map(Number).filter(Number.isFinite);
    if (!nums.length) return Number(fallback || 0);
    return Number((nums.reduce((sum, value) => sum + value, 0) / nums.length).toFixed(1));
  }

  function reviewBucket(rating) {
    if (rating >= 4.5) return 5;
    if (rating >= 3.5) return 4;
    if (rating >= 2.5) return 3;
    if (rating >= 1.5) return 2;
    return 1;
  }

  function reviewSummary(product) {
    const reviews = state.reviewsForItem(product.id);
    const total = reviews.length || product.reviewCount || 0;
    const averageRating = reviews.length ? average(reviews.map(review => review.itemRating), product.rating) : Number(product.rating || 0);
    const distribution = [5, 4, 3, 2, 1].map(star => ({
      star,
      count: reviews.length ? reviews.filter(review => reviewBucket(Number(review.itemRating)) === star).length : Math.max(0, star === 5 ? product.reviewCount - 16 : star === 4 ? 11 : star === 3 ? 4 : star === 2 ? 1 : 0)
    }));
    return { reviews, total, average: averageRating.toFixed(1), distribution };
  }

  function ratingSection(product) {
    const summary = reviewSummary(product);
    const filtered = sortedReviews(filteredReviews(summary.reviews));
    return `<section class="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><p class="font-bold text-brand-blue">Rating & Ulasan</p><h2 class="mt-1 text-xl font-extrabold text-slate-950">Pengalaman Penyewa Terverifikasi</h2></div>
        <select id="review-sort" class="field w-full sm:w-52"><option value="latest" ${state.reviewSort === "latest" ? "selected" : ""}>Terbaru</option><option value="highest" ${state.reviewSort === "highest" ? "selected" : ""}>Rating Tertinggi</option><option value="lowest" ${state.reviewSort === "lowest" ? "selected" : ""}>Rating Terendah</option></select>
      </div>
      ${summary.reviews.length ? `<div class="mt-5 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside class="rounded-3xl bg-slate-50 p-5">
          <p class="text-5xl font-extrabold text-brand-blue">${summary.average}</p>
          <p class="mt-1 text-sm font-bold text-slate-500">dari 5 | ${summary.total} ulasan</p>
          <div class="mt-5 grid gap-3">${summary.distribution.map(item => `<div class="grid grid-cols-[54px_1fr_34px] items-center gap-2 text-xs font-bold text-slate-500"><span>${item.star} bintang</span><span class="h-2 rounded-full bg-slate-200"><span class="block h-full rounded-full bg-gradient-brand" style="width:${Math.min(100, item.count / Math.max(1, summary.total) * 100)}%"></span></span><span>${item.count}</span></div>`).join("")}</div>
        </aside>
        <div class="min-w-0">
          <div class="flex flex-wrap gap-2">${reviewFilters().map(item => `<button class="badge ${state.reviewFilter === item.key ? "bg-brand-blue text-white" : "border border-slate-200 bg-white text-slate-600"}" data-review-filter="${item.key}">${item.label}</button>`).join("")}</div>
          <div class="mt-5 grid gap-3">${filtered.length ? filtered.slice(0, 5).map(reviewCard).join("") : reviewFilterEmpty()}</div>
        </div>
      </div>` : reviewEmptyState()}
    </section>`;
  }

  function reviewFilters() {
    return [
      { key: "all", label: "Semua" },
      { key: "photo", label: "Dengan Foto" },
      { key: "rating5", label: "Rating 5" },
      { key: "rating4", label: "Rating 4" },
      { key: "rating3", label: "Rating 3 ke bawah" },
      { key: "rentAgain", label: "Akan menyewa lagi" }
    ];
  }

  function filteredReviews(reviews) {
    if (state.reviewFilter === "photo") return reviews.filter(review => review.images?.length);
    if (state.reviewFilter === "rating5") return reviews.filter(review => reviewBucket(Number(review.itemRating)) === 5);
    if (state.reviewFilter === "rating4") return reviews.filter(review => reviewBucket(Number(review.itemRating)) === 4);
    if (state.reviewFilter === "rating3") return reviews.filter(review => reviewBucket(Number(review.itemRating)) <= 3);
    if (state.reviewFilter === "rentAgain") return reviews.filter(review => review.willRentAgain);
    return reviews;
  }

  function sortedReviews(reviews) {
    return [...reviews].sort((a, b) => {
      if (state.reviewSort === "highest") return Number(b.itemRating) - Number(a.itemRating);
      if (state.reviewSort === "lowest") return Number(a.itemRating) - Number(b.itemRating);
      return String(b.id).localeCompare(String(a.id));
    });
  }

  function reviewCard(review) {
    const liked = state.reviewLikes.includes(String(review.id));
    return `<article class="rounded-3xl border border-slate-100 bg-white p-4">
      <div class="flex gap-3">
        <span class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-brand text-sm font-extrabold text-white">${review.reviewerInitials}</span>
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2"><b>${review.reviewerName}</b><span class="badge bg-teal-50 text-teal-700">Terverifikasi</span><span class="text-xs font-bold text-slate-400">${review.createdAt}</span></div>
          <p class="mt-2 text-sm font-bold text-amber-500">${stars(review.itemRating)} <span class="text-slate-600">${Number(review.itemRating).toFixed(1)} barang | ${Number(review.ownerRating).toFixed(1)} pemilik</span></p>
          <h3 class="mt-3 font-extrabold text-slate-950">${review.title}</h3>
          <p class="mt-2 text-sm leading-6 text-slate-600">${review.comment}</p>
          <div class="mt-3 flex flex-wrap gap-2 text-xs font-bold">${review.isItemMatchDescription ? `<span class="badge bg-teal-50 text-teal-700">Barang sesuai deskripsi</span>` : ""}${review.willRentAgain ? `<span class="badge bg-blue-50 text-brand-blue">Akan menyewa lagi</span>` : ""}</div>
          ${review.images?.length ? `<div class="mt-3 flex gap-2 overflow-x-auto pb-1">${review.images.map(src => `<img src="${src}" alt="Foto review" class="h-20 w-20 shrink-0 rounded-2xl object-cover" loading="lazy" onerror="this.src='${fallbackImage}'">`).join("")}</div>` : ""}
          <button class="mt-3 inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-xs font-bold ${liked ? "bg-blue-50 text-brand-blue" : "text-slate-600"}" data-review-like="${review.id}">${icon("thumbs-up", "h-4 w-4")} ${review.likeCount || 0}</button>
        </div>
      </div>
    </article>`;
  }

  function stars(rating) {
    return Array.from({ length: 5 }, (_, index) => index < Math.round(Number(rating || 0)) ? "★" : "☆").join("");
  }

  function reviewEmptyState() {
    return `<div class="rounded-3xl bg-slate-50 p-8 text-center">${icon("star", "mx-auto h-12 w-12 text-slate-300")}<h3 class="mt-4 text-xl font-extrabold text-slate-950">Belum ada ulasan untuk barang ini.</h3><p class="mt-2 text-slate-500">Jadilah penyewa pertama yang memberikan ulasan setelah transaksi selesai.</p><button class="btn-secondary mt-5 rounded-2xl px-5 py-3" data-nav="browse">Jelajah Barang Lain</button></div>`;
  }

  function reviewFilterEmpty() {
    return `<div class="rounded-3xl bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500">Belum ada ulasan yang sesuai dengan filter.</div>`;
  }

  function similarProducts(product) {
    return BBData.products.filter(item => item.id !== product.id && (item.category === product.category || item.campus === product.campus)).sort((a, b) => b.rating - a.rating).slice(0, 8);
  }

  function similarSection(products) {
    return `<section class="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"><h2 class="text-xl font-extrabold text-slate-950">Produk Serupa yang Mungkin Kamu Suka</h2><div class="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">${products.map(item => `<article class="overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"><img src="${item.image}" alt="${item.name}" class="h-36 w-full object-cover" onerror="this.src='${fallbackImage}'"><div class="p-4"><h3 class="line-clamp-2 min-h-[2.4rem] text-sm font-extrabold text-slate-950">${item.name}</h3><p class="mt-2 text-sm font-bold text-brand-blue">${price(item)}</p><p class="mt-1 text-xs font-semibold text-slate-500">Rating ${item.rating} | ${item.location}</p><button class="btn-secondary mt-3 w-full rounded-xl px-3 py-2 text-xs" data-product="${item.id}">Lihat Detail</button></div></article>`).join("")}</div></section>`;
  }

  function bindDetailEvents(product) {
    document.querySelectorAll("[data-gallery-index]").forEach(button => button.addEventListener("click", () => {
      state.detailGallery[product.id] = Number(button.dataset.galleryIndex);
      renderDetail();
    }));
    document.querySelector("[data-share-product]")?.addEventListener("click", async () => {
      const link = `${location.origin}${location.pathname}#/product-detail/${product.id}`;
      try {
        await navigator.clipboard?.writeText(link);
        ui.toast("Link produk berhasil disalin");
      } catch {
        ui.toast("Link produk siap dibagikan");
      }
    });
    document.querySelectorAll("#booking-start,#booking-end").forEach(input => input.addEventListener("change", event => {
      if (event.target.id === "booking-start") state.bookingStart = event.target.value;
      if (event.target.id === "booking-end") state.bookingEnd = event.target.value;
      renderDetail();
    }));
    document.querySelector("[data-add-cart]")?.addEventListener("click", () => {
      const added = state.addCart(product.id, { startDate: state.bookingStart, endDate: state.bookingEnd, duration: state.bookingDays });
      ui.toast(added ? "Produk berhasil dimasukkan ke keranjang" : "Produk sudah ada di keranjang");
      renderDetail();
    });
    document.querySelector("#review-sort")?.addEventListener("change", event => {
      state.reviewSort = event.target.value;
      renderDetail();
    });
    document.querySelectorAll("[data-review-filter]").forEach(button => button.addEventListener("click", () => {
      state.reviewFilter = button.dataset.reviewFilter;
      renderDetail();
    }));
    document.querySelectorAll("[data-review-like]").forEach(button => button.addEventListener("click", () => {
      state.toggleReviewLike(button.dataset.reviewLike);
      renderDetail();
    }));
  }

  function productById(id) {
    return BBData.products.find(product => product.id === Number(id));
  }

  function cartDuration(item) {
    if (!item.startDate || !item.endDate) return 0;
    const diff = Math.round((new Date(item.endDate) - new Date(item.startDate)) / 86400000) + 1;
    return Math.max(0, Number.isFinite(diff) ? diff : 0);
  }

  function cartLineTotal(product, item) {
    const days = cartDuration(item);
    if (!days) return 0;
    return product.type === "pinjam" ? 5000 : product.price * days;
  }

  function renderCart() {
    const mount = document.querySelector("#cart-view");
    if (!mount) return;
    const items = state.cart.map(item => ({ item, product: productById(item.productId) })).filter(entry => entry.product);
    const selected = items.filter(entry => entry.item.selected);
    const rentTotal = selected.reduce((sum, entry) => sum + cartLineTotal(entry.product, entry.item), 0);
    const dp = Math.ceil(rentTotal * 0.3);
    const remaining = rentTotal - dp;
    mount.innerHTML = `<main class="min-h-screen bg-slate-50">
      <div class="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div class="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><p class="text-sm font-bold text-brand-blue">Keranjang Sewa</p><h1 class="mt-2 text-3xl font-extrabold text-slate-950">Keranjang Sewa</h1><p class="mt-2 text-slate-500">Kelola barang yang ingin kamu sewa sebelum melanjutkan checkout.</p></div>
          <button class="btn-secondary w-fit rounded-2xl px-5 py-3" data-nav="browse">Jelajah Barang Lagi</button>
        </div>
        ${items.length ? `<section class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div class="grid gap-4">${items.map(({ item, product }) => cartItemCard(item, product)).join("")}</div>
          <aside class="h-fit rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm lg:sticky lg:top-28">
            <h2 class="text-xl font-extrabold text-slate-950">Ringkasan Keranjang</h2>
            <div class="mt-5 grid gap-3 text-sm font-semibold text-slate-600">
              ${summaryLine("Total item dipilih", selected.length)}
              ${summaryLine("Total biaya sewa", rupiah(rentTotal))}
              ${summaryLine("Estimasi DP 30%", rupiah(dp), "text-brand-blue")}
              ${summaryLine("Sisa pembayaran", rupiah(remaining), "text-teal-600")}
            </div>
            <button class="btn-primary mt-6 w-full rounded-2xl px-5 py-4" data-cart-checkout>Lanjut Checkout</button>
            <button class="btn-secondary mt-3 w-full rounded-2xl px-5 py-3" data-nav="browse">Jelajah Barang Lagi</button>
            <p class="mt-4 rounded-2xl bg-teal-50 p-4 text-sm font-semibold text-teal-700">Pembayaran Aman dan transaksi tercatat di sistem.</p>
          </aside>
        </section>` : emptyCartState()}
      </div>
    </main>`;
    bindCommonEvents();
    bindCartEvents();
  }

  function cartItemCard(item, product) {
    const duration = cartDuration(item);
    const total = cartLineTotal(product, item);
    const warning = product.status === "low" ? `<p class="rounded-2xl bg-amber-50 p-3 text-sm font-semibold text-amber-700">Stok hampir habis, konfirmasi ke pemilik sebelum checkout.</p>` : "";
    return `<article class="rounded-[24px] border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
      <div class="grid gap-4 lg:grid-cols-[auto_140px_1fr_auto] lg:items-start">
        <input class="mt-2 h-5 w-5 accent-blue-600" type="checkbox" ${item.selected ? "checked" : ""} data-cart-select="${product.id}" aria-label="Pilih ${product.name}">
        <img src="${product.image}" alt="${product.name}" class="h-36 w-full rounded-2xl object-cover lg:h-32" onerror="this.src='${fallbackImage}'">
        <div class="min-w-0">
          <h2 class="text-lg font-extrabold text-slate-950">${product.name}</h2>
          <p class="mt-1 text-sm font-semibold text-slate-500">${product.category}</p>
          <p class="mt-2 text-sm text-slate-500">${product.campus} | ${product.location}</p>
          <p class="mt-3 text-lg font-extrabold text-brand-blue">${price(product)}</p>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <label class="text-xs font-bold text-slate-500">Tanggal mulai<input class="field mt-1" type="date" value="${item.startDate || ""}" data-cart-start="${product.id}"></label>
            <label class="text-xs font-bold text-slate-500">Tanggal selesai<input class="field mt-1" type="date" value="${item.endDate || ""}" data-cart-end="${product.id}"></label>
          </div>
          <p class="mt-3 text-sm font-bold text-slate-600">Durasi: ${duration ? `${duration} hari` : "Lengkapi tanggal"} | Total: ${rupiah(total)}</p>
          <div class="mt-3">${warning}</div>
        </div>
        <div class="grid gap-2 lg:w-44">
          <button class="btn-secondary rounded-2xl px-4 py-2.5 text-sm" data-remove-cart="${product.id}">Hapus</button>
          <button class="btn-secondary rounded-2xl px-4 py-2.5 text-sm" data-cart-to-wishlist="${product.id}">Pindahkan ke Disimpan</button>
        </div>
      </div>
    </article>`;
  }

  function emptyCartState() {
    return `<section class="rounded-[28px] border border-slate-100 bg-white p-10 text-center shadow-sm">
      ${icon("shopping-basket", "mx-auto h-16 w-16 text-slate-300")}
      <h2 class="mt-5 text-2xl font-extrabold text-slate-950">Keranjang kamu masih kosong</h2>
      <p class="mx-auto mt-2 max-w-md text-slate-500">Cari barang yang kamu butuhkan dan tambahkan ke keranjang.</p>
      <button class="btn-primary mt-6 rounded-2xl px-6 py-3" data-nav="browse">Jelajah Barang</button>
    </section>`;
  }

  function renderWishlist() {
    const mount = document.querySelector("#wishlist-view");
    if (!mount) return;
    const products = state.wishlist.map(productById).filter(Boolean);
    mount.innerHTML = `<main class="min-h-screen bg-slate-50">
      <div class="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div class="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><p class="text-sm font-bold text-brand-blue">Disimpan</p><h1 class="mt-2 text-3xl font-extrabold text-slate-950">Barang Disimpan</h1><p class="mt-2 text-slate-500">Barang yang kamu sukai dan bisa kamu sewa nanti.</p></div>
          <button class="btn-secondary w-fit rounded-2xl px-5 py-3" data-nav="browse">Jelajah Barang</button>
        </div>
        ${products.length ? `<section class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">${products.map(wishlistCard).join("")}</section>` : emptyWishlistState()}
      </div>
    </main>`;
    bindCommonEvents();
    bindWishlistEvents();
  }

  function wishlistCard(product) {
    return `<article class="overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <button class="block w-full text-left" data-product="${product.id}"><img src="${product.image}" alt="${product.name}" class="h-44 w-full object-cover" onerror="this.src='${fallbackImage}'"></button>
      <div class="p-4">
        <div class="flex flex-wrap gap-2">${productBadges(product)}</div>
        <button class="mt-3 text-left" data-product="${product.id}"><h2 class="line-clamp-2 text-lg font-extrabold text-slate-950">${product.name}</h2></button>
        <p class="mt-2 text-sm font-semibold text-slate-500">Rating ${product.rating} | ${product.location}</p>
        <p class="mt-1 text-sm text-slate-500">${product.campus}</p>
        <p class="mt-3 text-xl font-extrabold text-brand-blue">${price(product)}</p>
        <div class="mt-4 grid gap-2">
          <button class="btn-primary rounded-2xl px-4 py-2.5 text-sm" data-book="${product.id}">Sewa Sekarang</button>
          <button class="btn-secondary rounded-2xl px-4 py-2.5 text-sm" data-add-cart-from-list="${product.id}">Masukkan ke Keranjang</button>
          <button class="btn-secondary rounded-2xl px-4 py-2.5 text-sm text-red-500" data-remove-wishlist="${product.id}">Hapus dari Disimpan</button>
        </div>
      </div>
    </article>`;
  }

  function emptyWishlistState() {
    return `<section class="rounded-[28px] border border-slate-100 bg-white p-10 text-center shadow-sm">
      ${icon("heart", "mx-auto h-16 w-16 text-slate-300")}
      <h2 class="mt-5 text-2xl font-extrabold text-slate-950">Belum ada barang yang kamu sukai</h2>
      <p class="mx-auto mt-2 max-w-md text-slate-500">Klik icon hati pada produk untuk menyimpannya di sini.</p>
      <button class="btn-primary mt-6 rounded-2xl px-6 py-3" data-nav="browse">Jelajah Barang</button>
    </section>`;
  }

  function summaryLine(label, value, cls = "") {
    return `<div class="flex justify-between gap-4"><span>${label}</span><b class="text-right ${cls}">${value}</b></div>`;
  }

  function bindCartEvents() {
    document.querySelectorAll("[data-cart-select]").forEach(input => input.addEventListener("change", event => {
      state.updateCartItem(event.target.dataset.cartSelect, { selected: event.target.checked });
      renderCart();
    }));
    document.querySelectorAll("[data-cart-start]").forEach(input => input.addEventListener("change", event => {
      state.updateCartItem(event.target.dataset.cartStart, { startDate: event.target.value });
      renderCart();
    }));
    document.querySelectorAll("[data-cart-end]").forEach(input => input.addEventListener("change", event => {
      state.updateCartItem(event.target.dataset.cartEnd, { endDate: event.target.value });
      renderCart();
    }));
    document.querySelectorAll("[data-remove-cart]").forEach(button => button.addEventListener("click", () => {
      state.removeCart(button.dataset.removeCart);
      ui.toast("Produk dihapus dari keranjang");
      renderCart();
    }));
    document.querySelectorAll("[data-cart-to-wishlist]").forEach(button => button.addEventListener("click", () => {
      state.moveCartToWishlist(button.dataset.cartToWishlist);
      ui.toast("Produk dipindahkan ke halaman Disimpan");
      renderCart();
    }));
    document.querySelector("[data-cart-checkout]")?.addEventListener("click", () => {
      const selected = state.cart.filter(item => item.selected);
      if (!selected.length) return ui.toast("Pilih minimal satu barang untuk checkout");
      const invalid = selected.find(item => !item.startDate || !item.endDate || cartDuration(item) < 1);
      if (invalid) return ui.toast("Lengkapi tanggal sewa sebelum checkout");
      const item = selected[0];
      state.rememberProduct(item.productId);
      state.bookingStart = item.startDate;
      state.bookingEnd = item.endDate;
      state.bookingDays = cartDuration(item);
      router.navigate("checkout");
    });
  }

  function bindWishlistEvents() {
    document.querySelectorAll("[data-remove-wishlist]").forEach(button => button.addEventListener("click", () => {
      if (state.isWishlisted(button.dataset.removeWishlist)) state.toggleWishlist(button.dataset.removeWishlist);
      ui.toast("Produk dihapus dari halaman Disimpan");
      renderWishlist();
    }));
    document.querySelectorAll("[data-add-cart-from-list]").forEach(button => button.addEventListener("click", () => {
      const added = state.addCart(button.dataset.addCartFromList);
      ui.toast(added ? "Produk berhasil dimasukkan ke keranjang" : "Produk sudah ada di keranjang");
      renderWishlist();
    }));
  }

  function renderReviewCreate(params = {}) {
    const mount = document.querySelector("#review-create-view");
    if (!mount) return;
    const transactionId = params.productId || state.orderCode || "ORD-20260609-0008";
    const product = selectedProduct();
    const eligibility = state.canReview(transactionId);
    const draft = state.reviewDraft;
    mount.innerHTML = `<main class="min-h-screen bg-slate-50 pt-24">
      <div class="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        <div class="mb-6"><p class="text-sm font-semibold text-slate-500">Beranda / Detail Transaksi / Beri Ulasan</p><h1 class="mt-2 text-3xl font-extrabold text-slate-950">Beri Ulasan</h1><p class="mt-2 text-slate-500">Bagikan pengalaman kamu agar pengguna lain bisa menyewa dengan lebih percaya diri.</p></div>
        <section class="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
          <div class="flex flex-col gap-4 sm:flex-row"><img src="${product.image}" alt="${product.name}" class="h-32 w-full rounded-2xl object-cover sm:w-32" onerror="this.src='${fallbackImage}'"><div><span class="badge bg-teal-50 text-teal-700">Status: Selesai</span><h2 class="mt-3 text-xl font-extrabold text-slate-950">${product.name}</h2><p class="mt-2 text-sm font-semibold text-slate-500">Disewa dari: ${product.owner.name}</p><p class="mt-1 text-sm text-slate-500">Tanggal sewa: ${state.bookingStart || "20 Juni 2026"} - ${state.bookingEnd || "22 Juni 2026"}</p><p class="mt-1 text-sm text-slate-500">Nomor transaksi: ${transactionId}</p></div></div>
        </section>
        ${eligibility.canReview ? `<form id="review-form" class="mt-6 grid gap-5">
          ${ratingInputCard("Rating Barang", [["itemConditionRating", "Kondisi barang"], ["itemDescriptionMatchRating", "Kesesuaian dengan deskripsi"], ["itemOverallRating", "Kepuasan keseluruhan"]], draft)}
          ${ratingInputCard("Rating Pemilik", [["ownerResponsivenessRating", "Responsivitas"], ["ownerPunctualityRating", "Ketepatan waktu"], ["ownerFriendlinessRating", "Keramahan"]], draft)}
          <section class="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
            <h2 class="text-xl font-extrabold text-slate-950">Tulis Review</h2>
            <label class="mt-4 block text-sm font-bold text-slate-700">Judul Review<input id="review-title" class="field mt-2" maxlength="100" value="${draft.title}" placeholder="Contoh: Barang sesuai deskripsi dan pemilik sangat responsif"></label>
            <label class="mt-4 block text-sm font-bold text-slate-700">Isi Review<textarea id="review-comment" class="field mt-2 min-h-36" maxlength="500" placeholder="Ceritakan pengalaman kamu saat menyewa barang ini...">${draft.comment}</textarea></label>
            <p class="mt-2 text-right text-xs font-bold text-slate-400"><span id="review-counter">${draft.comment.length}</span>/500</p>
            <div class="mt-4 grid gap-3 sm:grid-cols-2">
              <label class="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600"><input id="review-match" type="checkbox" ${draft.isItemMatchDescription ? "checked" : ""}> Barang sesuai deskripsi</label>
              <label class="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600"><input id="review-rent-again" type="checkbox" ${draft.willRentAgain ? "checked" : ""}> Akan menyewa lagi</label>
            </div>
          </section>
          <section class="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 class="text-xl font-extrabold text-slate-950">Upload Foto</h2><p class="mt-1 text-sm text-slate-500">Maksimal 5 foto. Format JPG, PNG, atau WebP.</p></div><label class="btn-secondary w-fit cursor-pointer rounded-2xl px-5 py-3">Upload Foto<input id="review-upload" class="hidden" type="file" accept="image/jpeg,image/png,image/webp" multiple></label></div>
            <div id="review-preview" class="mt-4 flex flex-wrap gap-3">${state.reviewUploads.map((file, index) => reviewImagePreview(file, index)).join("")}</div>
          </section>
          <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" class="btn-secondary rounded-2xl px-5 py-3" data-nav="order-detail">Batal</button><button id="review-submit" class="rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 px-5 py-3 font-bold text-white shadow-md transition hover:scale-[1.01]">Kirim Ulasan</button></div>
        </form>` : `<section class="mt-6 rounded-[24px] border border-amber-100 bg-amber-50 p-6 text-amber-800 shadow-sm"><h2 class="text-xl font-extrabold">Belum bisa memberi ulasan</h2><p class="mt-2 font-semibold">${eligibility.reason}</p><button class="btn-secondary mt-5 rounded-2xl px-5 py-3" data-nav="order-detail">Kembali ke Detail Transaksi</button></section>`}
      </div>
    </main>`;
    bindCommonEvents();
    bindReviewForm(transactionId, product);
  }

  function ratingInputCard(title, fields, draft) {
    return `<section class="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm"><h2 class="text-xl font-extrabold text-slate-950">${title}</h2><div class="mt-5 grid gap-4">${fields.map(([key, label]) => `<div class="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p class="font-bold text-slate-800">${label}</p><p class="text-sm font-semibold text-slate-500">${ratingLabel(draft[key])}</p></div><div class="flex gap-1">${[1, 2, 3, 4, 5].map(value => `<button type="button" class="text-2xl transition hover:scale-110 ${value <= draft[key] ? "text-amber-400" : "text-slate-300"}" data-rating-field="${key}" data-rating-value="${value}">★</button>`).join("")}</div></div>`).join("")}</div></section>`;
  }

  function ratingLabel(value) {
    return ["Buruk", "Kurang", "Cukup", "Baik", "Sangat Baik"][Math.max(1, Number(value || 1)) - 1];
  }

  function reviewImagePreview(file, index) {
    return `<div class="relative"><img src="${file.preview}" alt="${file.name}" class="h-24 w-24 rounded-2xl object-cover"><button type="button" class="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-white text-red-500 shadow-card" data-remove-review-image="${index}">${icon("x", "h-4 w-4")}</button></div>`;
  }

  function bindReviewForm(transactionId, product) {
    document.querySelectorAll("[data-rating-field]").forEach(button => button.addEventListener("click", () => {
      state.reviewDraft[button.dataset.ratingField] = Number(button.dataset.ratingValue);
      renderReviewCreate({ productId: transactionId });
    }));
    document.querySelector("#review-title")?.addEventListener("input", event => { state.reviewDraft.title = event.target.value; });
    document.querySelector("#review-comment")?.addEventListener("input", event => {
      state.reviewDraft.comment = event.target.value.slice(0, 500);
      document.querySelector("#review-counter").textContent = state.reviewDraft.comment.length;
    });
    document.querySelector("#review-match")?.addEventListener("change", event => { state.reviewDraft.isItemMatchDescription = event.target.checked; });
    document.querySelector("#review-rent-again")?.addEventListener("change", event => { state.reviewDraft.willRentAgain = event.target.checked; });
    document.querySelector("#review-upload")?.addEventListener("change", event => {
      const files = Array.from(event.target.files || []);
      for (const file of files) {
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { ui.toast("Format foto harus JPG, PNG, atau WebP"); continue; }
        if (file.size > 2 * 1024 * 1024) { ui.toast("Ukuran foto maksimal 2 MB"); continue; }
        if (state.reviewUploads.length >= 5) { ui.toast("Upload foto maksimal 5"); break; }
        state.reviewUploads.push({ name: file.name, preview: URL.createObjectURL(file) });
      }
      renderReviewCreate({ productId: transactionId });
    });
    document.querySelectorAll("[data-remove-review-image]").forEach(button => button.addEventListener("click", () => {
      state.reviewUploads.splice(Number(button.dataset.removeReviewImage), 1);
      renderReviewCreate({ productId: transactionId });
    }));
    document.querySelector("#review-form")?.addEventListener("submit", event => {
      event.preventDefault();
      const button = document.querySelector("#review-submit");
      button.disabled = true;
      button.textContent = "Mengirim...";
      const result = state.submitReview(transactionId, product);
      if (!result.success) {
        ui.toast(result.message || "Review gagal dikirim. Silakan coba lagi.");
        button.disabled = false;
        button.textContent = "Kirim Ulasan";
        return;
      }
      ui.toast("Ulasan terkirim. Terima kasih sudah membantu pengguna lain.");
      router.navigate("order-detail");
    });
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
    const item = selectedProduct();
    const transactionId = state.orderCode || `ORD-20260609-${String(item.id).padStart(4, "0")}`;
    const canReview = state.orderStatus === "COMPLETED" && !state.reviewedTransaction(transactionId);
    const reviewed = state.reviewedTransaction(transactionId);
    const readableStatus = {
      WAITING_DP_PAYMENT: "Menunggu Pembayaran DP",
      DP_PAID: "DP Berhasil Dibayar",
      PREPARING_ITEM: "Pemilik Menyiapkan Barang",
      WAITING_FINAL_PAYMENT: "Menunggu Pelunasan",
      FULLY_PAID: "Pembayaran Lunas",
      READY_FOR_PICKUP: "Barang Siap Diambil",
      RENTED: "Barang Sedang Disewa",
      RETURNED: "Barang Sudah Dikembalikan",
      COMPLETED: "Transaksi Selesai"
    }[state.orderStatus] || "Menunggu Pembayaran DP";
    mount.innerHTML = dashboardShell("Dashboard Penyewa", [
      ["Saldo Koin", `${state.coinBalance} Koin`], ["Pesanan Aktif", "2"], ["Disimpan", state.wishlist.length], ["Total Hemat", "Rp3,4jt"], ["Level Pengguna", "Silver"], ["Voucher Aktif", "3"]
    ], `<div class="grid gap-6 lg:grid-cols-2"><section class="card p-6"><h2 class="text-xl font-bold">Pesanan Aktif</h2><div class="mt-4 grid gap-3">${state.notifications.map(text => `<p class="rounded-3xl bg-blue-50 p-4 text-sm font-semibold text-blue-700">${text}</p>`).join("")}</div><article class="mt-4 rounded-3xl border border-slate-100 bg-white p-4"><div class="flex gap-3"><img src="${item.image}" alt="${item.name}" class="h-20 w-20 rounded-2xl object-cover"><div><b>${item.name}</b><p class="text-sm font-semibold text-slate-500">Status: ${readableStatus}</p><p class="text-sm text-slate-500">${state.bookingStart || "20 Juni 2026"} - ${state.bookingEnd || "22 Juni 2026"}</p></div></div>${canReview ? `<button class="btn-primary mt-4 rounded-2xl px-5 py-3" data-review-transaction="${transactionId}">Beri Ulasan</button>` : reviewed ? `<button class="btn-secondary mt-4 rounded-2xl px-5 py-3" data-product="${item.id}">Lihat Ulasan</button>` : `<button class="btn-secondary mt-4 rounded-2xl px-5 py-3" data-nav="order-detail">Detail Transaksi</button>`}</article></section><section class="card p-6"><h2 class="text-xl font-bold">Top Up Koin</h2><p class="mt-2 text-slate-500">QRIS BarangBareng, cepat dan tercatat.</p><button class="btn-primary mt-5 rounded-2xl px-5 py-3" data-nav="topup">Top Up Sekarang</button></section></div><h2 class="mt-8 text-2xl font-extrabold">Rekomendasi Terdekat</h2><div class="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-4">${BBData.products.slice(0, 4).map(p => productCard(p)).join("")}</div>`);
    bindCommonEvents();
    document.querySelector("[data-review-transaction]")?.addEventListener("click", event => router.navigate("reviews-create", { productId: event.currentTarget.dataset.reviewTransaction }));
  }

  function renderSeller() {
    const mount = document.querySelector("#seller-view");
    if (!mount) return;
    const listings = BBData.products.slice(0, 5).map(product => `<div class="mt-4 grid gap-4 rounded-3xl bg-slate-50 p-4 md:grid-cols-[110px_1fr_auto] md:items-center">
      ${imgTag(product, "h-24 w-full rounded-2xl object-cover")}
      <div><b>${product.name}</b><p class="text-sm text-slate-500">Aktif - Tersedia - ${product.rentedCount} disewa - ${20 + product.id} disimpan</p></div>
      <div class="flex gap-2"><button class="btn-secondary rounded-xl px-3 py-2 text-sm" data-edit-product="${product.id}">Edit</button><button class="btn-secondary rounded-xl px-3 py-2 text-sm" data-product-statistics="${product.id}">Statistik</button></div>
    </div>`).join("");
    const requests = ["Difa Surya", "Maya Putri", "Raka Pradipta"].map((name, index) => `<div class="mt-4 rounded-3xl bg-slate-50 p-4"><b>${name}</b><p class="text-sm text-slate-500">Silver - Rating 4.${9 - index} - ${12 + index * 4} transaksi</p><p class="mt-2 text-sm">COD: Perpustakaan, besok 14.00</p><div class="mt-3 grid grid-cols-2 gap-2"><button class="rounded-xl bg-teal-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-teal-600 active:scale-[0.98]" data-accept-request="${name}">Terima</button><button class="rounded-xl bg-red-100 px-3 py-2 text-sm font-bold text-red-700 transition hover:bg-red-200 active:scale-[0.98]" data-reject-request="${name}">Tolak</button></div></div>`).join("");
    const chart = [45, 60, 52, 80, 70, 96].map((height, index) => `<div class="flex flex-1 flex-col items-center gap-2"><div class="w-full rounded-t-2xl bg-gradient-brand" style="height:${height}%"></div><span class="text-xs font-bold text-slate-400">B${index + 1}</span></div>`).join("");
    mount.innerHTML = dashboardShell("Dashboard Pemilik", [
      ["Pendapatan", "Rp1,8jt"], ["Barang Aktif", "12"], ["Sedang Disewa", "4"], ["Request Masuk", "3"], ["Rating", "4.9"], ["Produk Laris", "Jas Formal"]
    ], `<div class="grid gap-6 lg:grid-cols-[1.2fr_.8fr]"><section class="card p-6"><div class="flex items-center justify-between"><h2 class="text-xl font-bold">Listing Barang</h2><button class="btn-primary rounded-2xl px-4 py-2" data-nav="upload-product">Upload Barang</button></div>${listings}</section><section class="card p-6"><h2 class="text-xl font-bold">Request Masuk</h2>${requests}</section></div><section class="card mt-6 p-6"><h2 class="text-xl font-bold">Grafik Pendapatan</h2><div class="mt-5 flex h-48 items-end gap-3">${chart}</div><p class="mt-5 rounded-3xl bg-amber-50 p-4 text-sm font-semibold text-amber-700">Tips: foto real yang terang dan deskripsi kelengkapan meningkatkan peluang disewa.</p></section>`);
    bindCommonEvents();
    document.querySelectorAll("[data-accept-request]").forEach(button => button.addEventListener("click", () => {
      ui.toast(`Request ${button.dataset.acceptRequest} diterima`);
      button.closest(".rounded-3xl")?.classList.add("ring-2", "ring-teal-200");
    }));
    document.querySelectorAll("[data-reject-request]").forEach(button => button.addEventListener("click", () => {
      ui.toast(`Request ${button.dataset.rejectRequest} ditolak`);
      button.closest(".rounded-3xl")?.classList.add("opacity-60");
    }));
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
    return `<div class="flex justify-between"><span>Subtotal</span><b>${rupiah(total.subtotal)}</b></div><div class="mt-2 flex justify-between"><span>Biaya layanan</span><b>${rupiah(total.service)}</b></div><div class="mt-2 flex justify-between"><span>Biaya transaksi</span><b>${rupiah(total.transaction)}</b></div><hr class="my-3"><div class="flex justify-between"><span>Total</span><b>${rupiah(total.total)}</b></div><div class="mt-2 flex justify-between text-brand-blue"><span>DP 30%</span><b>${rupiah(total.dp)}</b></div><div class="mt-2 flex justify-between text-teal-600"><span>Sisa pembayaran</span><b>${rupiah(total.remaining)}</b></div>`;
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
    document.querySelectorAll("[data-card-cart]").forEach(button => button.addEventListener("click", event => {
      event.stopPropagation();
      const added = state.addCart(button.dataset.cardCart);
      ui.toast(added ? "Produk berhasil dimasukkan ke keranjang" : "Produk sudah ada di keranjang");
      viewInit[router.currentView]?.();
    }));
    document.querySelectorAll("[data-wishlist]").forEach(button => button.addEventListener("click", event => {
      event.stopPropagation();
      const liked = state.toggleWishlist(Number(button.dataset.wishlist));
      ui.toast(liked ? "Produk ditambahkan ke halaman Disimpan" : "Produk dihapus dari halaman Disimpan");
      viewInit[router.currentView]?.();
    }));
    document.querySelectorAll("[data-category]").forEach(button => button.addEventListener("click", () => { state.filters.category = button.dataset.category; router.navigate("browse"); }));
    document.querySelectorAll("[data-chip]").forEach(button => button.addEventListener("click", () => { state.filters.query = button.dataset.chip; router.navigate("browse", { query: button.dataset.chip }); }));
    document.querySelectorAll("[data-reset-filter]").forEach(button => button.addEventListener("click", filters.reset));
    bindNavEvents();
    if (window.lucide) lucide.createIcons();
  }

  function bindNavEvents() {
    document.querySelectorAll("[data-nav]").forEach(button => button.addEventListener("click", () => router.navigate(button.dataset.nav)));
    refreshNavBadges();
  }

  function refreshNavBadges() {
    updateBadge("wishlist", state.wishlistCount?.() || state.wishlist.length || 0);
    updateBadge("cart", state.cartCount?.() || state.cart?.length || 0);
  }

  function updateBadge(name, count) {
    document.querySelectorAll(`[data-nav-badge="${name}"]`).forEach(badge => {
      badge.textContent = count;
      badge.classList.toggle("hidden", count < 1);
      badge.classList.add("scale-110");
      setTimeout(() => badge.classList.remove("scale-110"), 180);
    });
  }

  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  // USER ACCOUNT FEATURE START
  function renderProfileAccount() {
    const mount = document.querySelector("#profile-view");
    if (!mount) return;
    const user = window.bbUserAccount?.getSessionUser?.();
    if (!user) {
      mount.innerHTML = `<div class="mx-auto max-w-5xl px-4 pb-16 pt-28 sm:px-6 lg:px-8"><section class="card p-8 text-center"><h1 class="text-3xl font-extrabold text-slate-950">Profil Pengguna</h1><p class="mx-auto mt-3 max-w-xl text-slate-500">Masuk terlebih dahulu untuk melihat profil, level, dan progress akun kamu.</p><div class="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><button class="btn-primary rounded-2xl px-5 py-3" data-nav="login">Masuk</button><button class="btn-secondary rounded-2xl px-5 py-3" data-nav="register">Daftar</button></div></section></div>`;
      bindCommonEvents();
      return;
    }
    const goldBenefit = user.level === "Gold" ? `<section class="mt-6 rounded-3xl bg-amber-50 p-5 text-amber-800"><span class="badge bg-white text-amber-700">Gold Benefit</span><h2 class="mt-3 text-xl font-extrabold">Keuntungan Gold</h2><div class="mt-4 grid gap-3 md:grid-cols-2">${["Diskon biaya admin sebesar 30%.", "Prioritas dalam sistem pencarian.", "Boost listing.", "Barang milik pengguna Gold lebih sering muncul."].map(text => `<p class="rounded-2xl bg-white p-4 text-sm font-bold">${text}</p>`).join("")}</div></section>` : "";
    mount.innerHTML = `<div class="mx-auto max-w-5xl px-4 pb-16 pt-28 sm:px-6 lg:px-8"><section class="card p-8">
      <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div class="flex flex-col gap-5 md:flex-row md:items-center"><span class="grid h-24 w-24 place-items-center rounded-[2rem] bg-gradient-brand text-3xl font-extrabold text-white">${bbUserAccount.initials(user.fullName)}</span><div><h1 class="text-3xl font-extrabold text-slate-950">${user.fullName}</h1><p class="text-slate-500">${user.email} - ${user.campus}</p><p class="mt-2">${bbUserAccount.levelBadge(user)} Mahasiswa Terverifikasi - ${user.successfulTransactions} transaksi - Rating ${Number(user.rating).toFixed(1)}</p></div></div>
        <button class="btn-secondary rounded-2xl px-5 py-3" data-bb-profile-settings>Pengaturan Akun</button>
      </div>
      <div class="mt-7 h-4 rounded-full bg-slate-100"><div class="h-full rounded-full bg-gradient-brand" style="width:${Math.max(4, user.progressPercent)}%"></div></div>
      <p class="mt-2 text-sm font-semibold text-slate-500">${user.progressText}</p>
      <div class="mt-6 grid gap-4 md:grid-cols-4">${[["Level", user.level], ["Transaksi", user.successfulTransactions], ["Rating", Number(user.rating).toFixed(1)], ["Listing Priority", user.listingPriority]].map(item => `<div class="rounded-3xl bg-teal-50 p-4 font-bold text-teal-700"><span class="block text-xs text-teal-600">${item[0]}</span>${item[1]}</div>`).join("")}</div>
      ${goldBenefit}
    </section></div>`;
    bindCommonEvents();
    document.querySelector("[data-bb-profile-settings]")?.addEventListener("click", () => {
      bbUserAccount.openSettings?.();
    });
  }
  renderProfile = renderProfileAccount;
  // USER ACCOUNT FEATURE END

  window.components = { renderHome, renderBrowse, renderDetail, renderCart, renderWishlist, renderReviewCreate, renderCheckout, renderBuyer, renderSeller, renderProfile, bindNavEvents, refreshNavBadges, rupiah, selectedProduct, feeRows, optionList, productCard, icon };
})();
