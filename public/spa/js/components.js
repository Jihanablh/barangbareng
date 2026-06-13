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
    mount.innerHTML = `<section class="gradient-animated hero-pattern relative pt-[72px] text-white">
      <div class="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] lg:px-8 lg:py-24">
        <div class="relative z-10 min-w-0 max-w-full">
          <span class="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold">Platform Sewa Barang #1 untuk Mahasiswa</span>
          <h1 class="mt-6 max-w-full break-words text-3xl font-extrabold leading-tight sm:text-4xl lg:max-w-3xl lg:text-6xl">Sewa Barang Harian Mahasiswa, Hemat & Praktis.</h1>
          <p class="mt-5 max-w-full text-base leading-7 text-white/90 sm:max-w-2xl sm:text-lg sm:leading-8 lg:text-xl">Temukan laptop, kamera, alat masak, perlengkapan kos, outfit formal, sampai kebutuhan event kampus dari sesama mahasiswa di sekitarmu.</p>
          <div class="mt-8 w-full max-w-4xl rounded-[28px] bg-white p-4 text-slate-900 shadow-lg">
            <div class="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-12">
              <label class="field flex min-w-0 items-center gap-3 lg:col-span-5">${icon("search", "h-5 w-5 shrink-0 text-brand-blue")}<input id="hero-search" class="min-w-0 flex-1 outline-none" placeholder="Cari barang yang kamu butuhkan..."></label>
              <select id="hero-category" class="field min-w-0 lg:col-span-2">${optionList(["all", ...BBData.categories.map(c => c.name)], "all", "Semua Kategori")}</select>
              <select id="hero-campus" class="field min-w-0 lg:col-span-3">${optionList(["all", ...BBData.campuses], "all", "Lokasi / Kampus")}</select>
              <button id="hero-search-btn" class="btn-primary btn-ripple w-full rounded-2xl px-5 py-3 lg:col-span-2">Cari Barang</button>
            </div>
            <div class="mt-4 flex gap-2 overflow-x-auto pb-1">${["Laptop", "Kamera Canon", "Rice Cooker", "Jas Sidang", "Tenda", "Proyektor", "Setrika", "Tripod"].map(chip => `<button class="badge shrink-0 bg-blue-50 text-brand-blue" data-chip="${chip}">${chip}</button>`).join("")}</div>
          </div>
          <div class="mt-6 flex flex-wrap gap-3 text-sm font-bold text-white/95"><span>Pembayaran Aman</span><span>QRIS BarangBareng</span><span>Terverifikasi</span><span>COD Kampus</span></div>
          <div class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">${[[2400, "+", "Barang"], [8500, "+", "Pengguna"], [120, "+", "Kampus"], [49, "/5", "Rating"]].map(item => `<div class="rounded-3xl bg-white/14 p-4"><strong class="text-2xl" data-counter="${item[0]}" data-suffix="${item[1]}">0</strong><p class="text-sm text-white/80">${item[2]}</p></div>`).join("")}</div>
        </div>
        <div class="relative z-10 hidden min-h-[540px] lg:block">
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
      if (!requireVerifiedAccess()) return;
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
    return `<div class="relative"><img src="${file.preview}" alt="${file.name}" class="h-24 w-24 rounded-2xl object-cover"><button type="button" class="absolute -right-2 -top-2 grid h-10 w-10 place-items-center rounded-full bg-white text-red-500 shadow-card" data-remove-review-image="${index}" aria-label="Hapus foto review">${icon("x", "h-4 w-4")}</button></div>`;
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
    if (!window.bbUserAccount?.canAccessRentalFeature?.()) {
      mount.innerHTML = `<div class="mx-auto max-w-4xl px-4 pb-16 pt-28 sm:px-6 lg:px-8"><section class="card p-8 text-center">${icon("shield-alert", "mx-auto h-14 w-14 text-brand-blue")}<h1 class="mt-4 text-2xl font-extrabold text-slate-950">Verifikasi diperlukan</h1><p class="mx-auto mt-3 max-w-xl text-sm font-semibold leading-6 text-slate-500">Lengkapi verifikasi identitas untuk menggunakan fitur checkout dan sewa barang.</p><div class="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><button class="btn-primary rounded-2xl px-5 py-3" data-nav="ekyc">Lengkapi e-KYC</button><button class="btn-secondary rounded-2xl px-5 py-3" data-nav="jelajah">Kembali Jelajah</button></div></section></div>`;
      bindCommonEvents();
      return;
    }
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
    document.querySelectorAll("[data-book]").forEach(button => button.addEventListener("click", () => { if (!requireVerifiedAccess()) return; state.rememberProduct(Number(button.dataset.book)); state.checkoutStep = 1; router.navigate("checkout"); }));
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

  // DASHBOARD PENYEWA UPDATE START
  function dashboardUser() {
    return window.bbUserAccount?.getSessionUser?.() || {
      fullName: state.currentUser?.name || "Pengguna BarangBareng",
      email: "Masuk untuk melihat email",
      phone: "-",
      campus: state.currentUser?.campus || "Kampus sekitar",
      successfulTransactions: 0,
      rating: 0,
      level: "Bronze",
      listingPriority: 1,
      progressText: "Mulai transaksi pertamamu untuk naik level.",
      progressPercent: 0
    };
  }

  function dashboardInitials(name) {
    return window.bbUserAccount?.initials?.(name) || String(name || "BB").split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase();
  }

  function dashboardStatus(status) {
    const map = {
      WAITING_DP_PAYMENT: { label: "Menunggu DP", text: "Selesaikan pembayaran DP agar pesanan diproses.", tone: "bg-amber-50 text-amber-700", icon: "wallet", action: "Bayar DP", nav: "payment-qr" },
      DP_PAID: { label: "DP Dibayar", text: "Pemilik sedang menyiapkan barang.", tone: "bg-teal-50 text-teal-700", icon: "check-circle-2", action: "Lihat Detail", nav: "order-detail" },
      PREPARING_ITEM: { label: "Disiapkan", text: "Barang sedang disiapkan untuk jadwal sewa.", tone: "bg-blue-50 text-brand-blue", icon: "package-check", action: "Chat Pemilik", nav: "chat" },
      WAITING_FINAL_PAYMENT: { label: "Menunggu Pelunasan", text: "Selesaikan pelunasan sebelum serah terima.", tone: "bg-amber-50 text-amber-700", icon: "credit-card", action: "Bayar Pelunasan", nav: "payment-final" },
      FULLY_PAID: { label: "Lunas", text: "Pembayaran lunas. Barang siap diproses.", tone: "bg-teal-50 text-teal-700", icon: "badge-check", action: "Kode Serah Terima", nav: "qr-handover" },
      READY_FOR_PICKUP: { label: "Siap Diambil", text: "Tunjukkan kode serah terima saat bertemu pemilik.", tone: "bg-blue-50 text-brand-blue", icon: "qr-code", action: "Tampilkan Kode", nav: "qr-handover" },
      RENTED: { label: "Sedang Disewa", text: "Barang sedang kamu gunakan.", tone: "bg-blue-50 text-brand-blue", icon: "clock-3", action: "Detail Sewa", nav: "order-detail" },
      RETURNED: { label: "Dikembalikan", text: "Menunggu konfirmasi akhir dari pemilik.", tone: "bg-slate-100 text-slate-700", icon: "rotate-ccw", action: "Lihat Detail", nav: "order-detail" },
      COMPLETED: { label: "Selesai", text: "Transaksi selesai. Kamu bisa memberi penilaian.", tone: "bg-teal-50 text-teal-700", icon: "star", action: "Beri Penilaian", nav: "reviews-create" },
      CANCELLED: { label: "Dibatalkan", text: "Transaksi ini dibatalkan.", tone: "bg-red-50 text-red-700", icon: "x-circle", action: "Cari Barang Lain", nav: "browse" },
      PAYMENT_EXPIRED: { label: "Pembayaran Habis", text: "Buat pembayaran baru untuk melanjutkan.", tone: "bg-red-50 text-red-700", icon: "timer-off", action: "Bayar Lagi", nav: "payment-qr" }
    };
    return map[status] || map.WAITING_DP_PAYMENT;
  }

  function dashboardTotals(product) {
    const days = Number(state.bookingDays || 2);
    if (window.checkout?.calculate) return checkout.calculate(product, days);
    const subtotal = product.type === "pinjam" ? 0 : Number(product.price || 0) * days;
    const service = product.type === "pinjam" ? 5000 : Math.max(2500, Math.round(subtotal * 0.025));
    const transaction = Math.round((subtotal + service) * 0.007);
    const total = subtotal + service + transaction;
    return { subtotal, service, transaction, total, dp: Math.round(total * 0.3), remaining: total - Math.round(total * 0.3) };
  }

  function dashboardOrderData() {
    const activeProduct = selectedProduct();
    const total = dashboardTotals(activeProduct);
    const currentStatus = state.orderStatus || "WAITING_DP_PAYMENT";
    const transactionId = state.orderCode || `ORD-20260609-${String(activeProduct.id).padStart(4, "0")}`;
    const active = {
      id: transactionId,
      product: activeProduct,
      status: currentStatus,
      total: total.total,
      due: state.bookingEnd || "22 Juni 2026",
      date: state.bookingStart || "20 Juni 2026",
      reviewed: state.reviewedTransaction?.(transactionId)
    };
    const history = [
      active,
      { id: "ORD-20260604-0007", product: BBData.products[3] || activeProduct, status: "COMPLETED", total: 64000, due: "08 Juni 2026", date: "06 Juni 2026", reviewed: true },
      { id: "ORD-20260529-0002", product: BBData.products[6] || activeProduct, status: "CANCELLED", total: 0, due: "30 Mei 2026", date: "29 Mei 2026", reviewed: false }
    ];
    return { active, history };
  }

  function dashboardStat(label, value, iconName, tone) {
    return `<article class="rounded-[24px] border border-slate-100 bg-white p-4 shadow-sm">
      <div class="flex items-center justify-between gap-3">
        <span class="grid h-10 w-10 place-items-center rounded-2xl ${tone}">${icon(iconName, "h-5 w-5")}</span>
        <strong class="text-xl font-extrabold text-slate-950">${value}</strong>
      </div>
      <p class="mt-3 text-xs font-bold uppercase tracking-wide text-slate-400">${label}</p>
    </article>`;
  }

  function dashboardMiniProduct(product, action = "Lihat Detail") {
    if (!product) return "";
    return `<article class="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3">
      <img src="${product.image}" alt="${product.name}" class="h-16 w-16 shrink-0 rounded-2xl object-cover" onerror="this.src='${fallbackImage}'">
      <div class="min-w-0 flex-1">
        <h3 class="truncate text-sm font-extrabold text-slate-950">${product.name}</h3>
        <p class="mt-1 truncate text-xs font-semibold text-slate-500">${product.campus}</p>
      </div>
      <button class="rounded-xl bg-blue-50 px-3 py-2 text-xs font-extrabold text-brand-blue" data-product="${product.id}">${action}</button>
    </article>`;
  }

  function dashboardOrderCard(order) {
    const meta = dashboardStatus(order.status);
    const canReview = order.status === "COMPLETED" && !order.reviewed;
    const nav = canReview ? "reviews-create" : meta.nav;
    const attr = nav === "reviews-create" ? `data-review-transaction="${order.id}"` : `data-nav="${nav}"`;
    return `<article class="rounded-[28px] border border-slate-100 bg-white p-4 shadow-sm">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div class="flex min-w-0 gap-3">
          <img src="${order.product.image}" alt="${order.product.name}" class="h-20 w-20 shrink-0 rounded-2xl object-cover" onerror="this.src='${fallbackImage}'">
          <div class="min-w-0">
            <p class="text-xs font-bold text-slate-400">${order.id}</p>
            <h3 class="mt-1 truncate text-lg font-extrabold text-slate-950">${order.product.name}</h3>
            <p class="mt-1 text-sm font-semibold text-slate-500">${order.date} - ${order.due}</p>
          </div>
        </div>
        <span class="badge ${meta.tone}">${meta.label}</span>
      </div>
      <div class="mt-4 grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <p class="text-sm font-semibold leading-6 text-slate-600">${meta.text}</p>
        <strong class="text-brand-blue">${rupiah(order.total)}</strong>
      </div>
      <div class="mt-4 flex flex-col gap-2 sm:flex-row">
        <button class="btn-primary rounded-2xl px-4 py-3 text-sm" ${attr}>${canReview ? "Beri Penilaian" : meta.action}</button>
        <button class="btn-secondary rounded-2xl px-4 py-3 text-sm" data-product="${order.product.id}">Lihat Barang</button>
      </div>
    </article>`;
  }

  function dashboardPaymentCard(order) {
    const meta = dashboardStatus(order.status);
    const isPayment = ["WAITING_DP_PAYMENT", "WAITING_FINAL_PAYMENT", "PAYMENT_EXPIRED"].includes(order.status);
    if (!isPayment) {
      return `<article class="rounded-[24px] border border-slate-100 bg-slate-50 p-5 text-sm font-semibold leading-6 text-slate-500">Tidak ada pembayaran yang perlu diselesaikan sekarang.</article>`;
    }
    return `<article class="rounded-[24px] border border-amber-100 bg-amber-50 p-5">
      <div class="flex items-start gap-3">
        <span class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-amber-600">${icon(meta.icon, "h-5 w-5")}</span>
        <div class="min-w-0">
          <h3 class="font-extrabold text-amber-800">${meta.label}</h3>
          <p class="mt-1 text-sm font-semibold leading-6 text-amber-700">${order.product.name}</p>
          <p class="mt-2 text-2xl font-extrabold text-slate-950">${rupiah(order.total)}</p>
        </div>
      </div>
      <button class="btn-primary mt-5 w-full rounded-2xl px-4 py-3" data-nav="${meta.nav}">${meta.action}</button>
    </article>`;
  }

  function dashboardHistoryRow(order) {
    const meta = dashboardStatus(order.status);
    return `<article class="grid gap-3 rounded-2xl border border-slate-100 bg-white p-4 md:grid-cols-[1fr_140px_140px_auto] md:items-center">
      <div class="min-w-0">
        <p class="truncate text-sm font-extrabold text-slate-950">${order.product.name}</p>
        <p class="mt-1 text-xs font-semibold text-slate-500">${order.id} - ${order.date}</p>
      </div>
      <span class="badge w-fit ${meta.tone}">${meta.label}</span>
      <strong class="text-sm text-brand-blue">${rupiah(order.total)}</strong>
      <button class="rounded-xl bg-slate-50 px-3 py-2 text-xs font-extrabold text-slate-600 hover:bg-blue-50 hover:text-brand-blue" data-nav="order-detail">Detail</button>
    </article>`;
  }

  function dashboardNotification(text, index) {
    const icons = ["bell", "calendar-check", "shield-check", "message-circle"];
    return `<article class="rounded-2xl border border-slate-100 bg-white p-4">
      <div class="flex gap-3">
        <span class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-brand-blue">${icon(icons[index % icons.length], "h-4 w-4")}</span>
        <div><p class="text-sm font-bold leading-5 text-slate-700">${text}</p><p class="mt-1 text-xs font-semibold text-slate-400">${index + 1} jam lalu</p></div>
      </div>
    </article>`;
  }

  function dashboardRecommendationCard(product) {
    return `<article class="overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-sm">
      <div class="relative h-36 overflow-hidden bg-slate-100">
        <img src="${product.image}" alt="${product.name}" class="h-full w-full object-cover" onerror="this.src='${fallbackImage}'">
        <button class="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-slate-500 shadow-card ${state.isWishlisted(product.id) ? "text-red-500" : ""}" data-wishlist="${product.id}" aria-label="Simpan ${product.name}">${icon("heart", state.isWishlisted(product.id) ? "h-4 w-4 fill-current" : "h-4 w-4")}</button>
      </div>
      <div class="p-4">
        <h3 class="line-clamp-1 font-extrabold text-slate-950">${product.name}</h3>
        <p class="mt-1 text-xs font-semibold text-slate-500">${product.campus}</p>
        <p class="mt-3 text-sm font-extrabold text-brand-blue">${price(product)}</p>
        <button class="btn-secondary mt-4 w-full rounded-2xl px-4 py-2 text-sm" data-product="${product.id}">Lihat Detail</button>
      </div>
    </article>`;
  }

  function bindBuyerDashboardEvents() {
    document.querySelectorAll("[data-buyer-history-filter]").forEach(button => button.addEventListener("click", () => {
      state.buyerHistoryFilter = button.dataset.buyerHistoryFilter;
      renderBuyer();
    }));
    document.querySelectorAll("[data-buyer-history-sort]").forEach(button => button.addEventListener("click", () => {
      state.buyerHistorySort = button.dataset.buyerHistorySort;
      renderBuyer();
    }));
    document.querySelectorAll("[data-dashboard-scroll]").forEach(button => button.addEventListener("click", () => {
      document.querySelector(button.dataset.dashboardScroll)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }));
    document.querySelectorAll("[data-review-transaction]").forEach(button => button.addEventListener("click", event => {
      router.navigate("reviews-create", { productId: event.currentTarget.dataset.reviewTransaction });
    }));
  }

  function renderBuyerDashboard() {
    const mount = document.querySelector("#buyer-view");
    if (!mount) return;
    const user = dashboardUser();
    const { active, history } = dashboardOrderData();
    const activeStatuses = ["WAITING_DP_PAYMENT", "DP_PAID", "PREPARING_ITEM", "WAITING_FINAL_PAYMENT", "FULLY_PAID", "READY_FOR_PICKUP", "RENTED", "RETURNED"];
    const activeOrders = activeStatuses.includes(active.status) ? [active] : [];
    const paymentCount = ["WAITING_DP_PAYMENT", "WAITING_FINAL_PAYMENT", "PAYMENT_EXPIRED"].includes(active.status) ? 1 : 0;
    const cartProducts = state.cart.slice(0, 3).map(item => BBData.products.find(product => product.id === Number(item.productId))).filter(Boolean);
    const wishlistProducts = state.wishlist.slice(0, 3).map(id => BBData.products.find(product => product.id === Number(id))).filter(Boolean);
    const recommendations = BBData.products.filter(product => product.id !== active.product.id).slice(0, 4);
    const filter = state.buyerHistoryFilter || "all";
    const sort = state.buyerHistorySort || "newest";
    const filteredHistory = history
      .filter(order => filter === "all" || (filter === "review" ? order.status === "COMPLETED" && !order.reviewed : order.status === filter))
      .sort((a, b) => sort === "highest" ? b.total - a.total : a.id < b.id ? 1 : -1);
    const reviewNeeded = history.find(order => order.status === "COMPLETED" && !order.reviewed);
    const firstName = String(user.fullName || "Pengguna").split(" ")[0];
    const levelBadgeHtml = window.bbUserAccount?.levelBadge?.(user) || `<span class="badge bg-amber-100 text-amber-700">${user.level || "Bronze"}</span>`;

    mount.innerHTML = `<main class="min-h-screen bg-slate-50 pt-24">
      <div class="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <section class="overflow-hidden rounded-[32px] bg-gradient-brand p-5 text-white shadow-blue md:p-7">
          <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div class="min-w-0">
              <p class="text-sm font-bold text-white/75">Dashboard Penyewa</p>
              <h1 class="mt-2 text-2xl font-extrabold leading-tight md:text-4xl">Halo, ${firstName}. Semua kebutuhan sewamu ada di sini.</h1>
              <p class="mt-3 max-w-2xl text-sm font-semibold leading-6 text-white/80">Pantau transaksi aktif, pembayaran, barang tersimpan, dan rekomendasi kampus tanpa pindah-pindah halaman.</p>
              <div class="mt-5 flex flex-wrap gap-2">
                <button class="rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-brand-blue shadow-sm" data-nav="browse">Jelajah Barang</button>
                <button class="rounded-2xl bg-white/15 px-4 py-3 text-sm font-extrabold text-white ring-1 ring-white/25" data-nav="keranjang">Buka Keranjang</button>
                <button class="rounded-2xl bg-white/15 px-4 py-3 text-sm font-extrabold text-white ring-1 ring-white/25" data-nav="disimpan">Barang Disimpan</button>
              </div>
            </div>
            <aside class="rounded-[28px] bg-white p-5 text-slate-800 shadow-card">
              <div class="flex items-center gap-4">
                <span class="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-gradient-brand text-xl font-extrabold text-white">${dashboardInitials(user.fullName)}</span>
                <div class="min-w-0">
                  <h2 class="truncate text-lg font-extrabold text-slate-950">${user.fullName}</h2>
                  <p class="truncate text-sm font-semibold text-slate-500">${user.campus}</p>
                  <p class="mt-2">${levelBadgeHtml}</p>
                </div>
              </div>
              <div class="mt-5 h-3 rounded-full bg-slate-100"><div class="h-full rounded-full bg-gradient-brand" style="width:${Math.max(4, Number(user.progressPercent || 0))}%"></div></div>
              <p class="mt-2 text-xs font-semibold leading-5 text-slate-500">${user.progressText || "Progress level akan tampil setelah kamu mulai transaksi."}</p>
            </aside>
          </div>
        </section>

        <section class="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          ${dashboardStat("Sewa Aktif", activeOrders.length, "package-check", "bg-blue-50 text-brand-blue")}
          ${dashboardStat("Pembayaran", paymentCount, "credit-card", "bg-amber-50 text-amber-700")}
          ${dashboardStat("Keranjang", state.cart.length, "shopping-basket", "bg-teal-50 text-teal-700")}
          ${dashboardStat("Disimpan", state.wishlist.length, "heart", "bg-rose-50 text-rose-600")}
        </section>

        <section class="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div class="grid gap-6">
            <section class="rounded-[32px] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div><p class="text-sm font-bold text-brand-blue">Transaksi</p><h2 class="text-2xl font-extrabold text-slate-950">Sewa Aktif</h2></div>
                <button class="btn-secondary rounded-2xl px-4 py-3 text-sm" data-nav="order-detail">Lihat Detail Transaksi</button>
              </div>
              <div class="mt-5 grid gap-4">${activeOrders.length ? activeOrders.map(dashboardOrderCard).join("") : `<article class="rounded-[24px] bg-slate-50 p-6 text-center"><h3 class="font-extrabold text-slate-950">Belum ada sewa aktif</h3><p class="mt-2 text-sm font-semibold text-slate-500">Mulai cari barang yang kamu butuhkan di sekitar kampus.</p><button class="btn-primary mt-5 rounded-2xl px-5 py-3" data-nav="browse">Jelajah Barang</button></article>`}</div>
            </section>

            <section id="buyer-history-section" class="rounded-[32px] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
              <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div><p class="text-sm font-bold text-brand-blue">Riwayat</p><h2 class="text-2xl font-extrabold text-slate-950">Transaksi Terakhir</h2></div>
                <div class="flex gap-2 overflow-x-auto pb-1">
                  ${[["all", "Semua"], ["COMPLETED", "Selesai"], ["CANCELLED", "Dibatalkan"], ["review", "Perlu Review"]].map(item => `<button class="shrink-0 rounded-2xl px-4 py-2 text-sm font-extrabold ${filter === item[0] ? "bg-gradient-brand text-white" : "bg-slate-50 text-slate-600"}" data-buyer-history-filter="${item[0]}">${item[1]}</button>`).join("")}
                  ${[["newest", "Terbaru"], ["highest", "Nominal"]].map(item => `<button class="shrink-0 rounded-2xl px-4 py-2 text-sm font-extrabold ${sort === item[0] ? "bg-blue-50 text-brand-blue" : "bg-slate-50 text-slate-600"}" data-buyer-history-sort="${item[0]}">${item[1]}</button>`).join("")}
                </div>
              </div>
              <div class="mt-5 grid gap-3">${filteredHistory.length ? filteredHistory.map(dashboardHistoryRow).join("") : `<p class="rounded-2xl bg-slate-50 p-5 text-sm font-semibold text-slate-500">Belum ada transaksi pada filter ini.</p>`}</div>
            </section>

            <section class="rounded-[32px] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
              <div class="flex items-center justify-between gap-3">
                <div><p class="text-sm font-bold text-brand-blue">Rekomendasi</p><h2 class="text-2xl font-extrabold text-slate-950">Cocok untuk Kamu</h2></div>
                <button class="btn-secondary rounded-2xl px-4 py-3 text-sm" data-nav="browse">Lihat Semua</button>
              </div>
              <div class="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">${recommendations.map(dashboardRecommendationCard).join("")}</div>
            </section>
          </div>

          <aside class="grid h-fit gap-6 lg:sticky lg:top-28">
            <section class="rounded-[32px] border border-slate-100 bg-white p-5 shadow-sm">
              <h2 class="text-xl font-extrabold text-slate-950">Pembayaran</h2>
              <div class="mt-4">${dashboardPaymentCard(active)}</div>
            </section>

            <section class="rounded-[32px] border border-slate-100 bg-white p-5 shadow-sm">
              <h2 class="text-xl font-extrabold text-slate-950">Aksi Cepat</h2>
              <div class="mt-4 grid grid-cols-2 gap-3">
                ${[["browse", "Jelajah", "search"], ["keranjang", "Keranjang", "shopping-basket"], ["disimpan", "Disimpan", "heart"], ["topup", "Top Up", "wallet"], ["profile", "Profil", "user"], ["chat", "Bantuan", "message-circle"]].map(item => `<button class="rounded-2xl bg-slate-50 p-4 text-left text-sm font-extrabold text-slate-700 transition hover:bg-blue-50 hover:text-brand-blue" data-nav="${item[0]}">${icon(item[2], "mb-2 h-5 w-5")} ${item[1]}</button>`).join("")}
              </div>
            </section>

            <section class="rounded-[32px] border border-slate-100 bg-white p-5 shadow-sm">
              <div class="flex items-center justify-between"><h2 class="text-xl font-extrabold text-slate-950">Keranjang</h2><button class="text-sm font-extrabold text-brand-blue" data-nav="keranjang">${state.cart.length} item</button></div>
              <div class="mt-4 grid gap-3">${cartProducts.length ? cartProducts.map(product => dashboardMiniProduct(product, "Checkout")).join("") : `<p class="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">Keranjang masih kosong.</p>`}</div>
            </section>

            <section class="rounded-[32px] border border-slate-100 bg-white p-5 shadow-sm">
              <div class="flex items-center justify-between"><h2 class="text-xl font-extrabold text-slate-950">Disimpan</h2><button class="text-sm font-extrabold text-brand-blue" data-nav="disimpan">${state.wishlist.length} item</button></div>
              <div class="mt-4 grid gap-3">${wishlistProducts.length ? wishlistProducts.map(product => dashboardMiniProduct(product)).join("") : `<p class="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">Belum ada barang disimpan.</p>`}</div>
            </section>

            <section class="rounded-[32px] border border-slate-100 bg-white p-5 shadow-sm">
              <h2 class="text-xl font-extrabold text-slate-950">Penilaian</h2>
              ${reviewNeeded ? `<p class="mt-3 text-sm font-semibold text-slate-500">${reviewNeeded.product.name} menunggu penilaian kamu.</p><button class="btn-primary mt-4 w-full rounded-2xl px-4 py-3" data-review-transaction="${reviewNeeded.id}">Beri Penilaian</button>` : `<p class="mt-3 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">Tidak ada penilaian tertunda.</p>`}
            </section>

            <section class="rounded-[32px] border border-slate-100 bg-white p-5 shadow-sm">
              <h2 class="text-xl font-extrabold text-slate-950">Notifikasi</h2>
              <div class="mt-4 grid gap-3">${(state.notifications || []).slice(0, 4).map(dashboardNotification).join("") || `<p class="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">Belum ada notifikasi.</p>`}</div>
            </section>
          </aside>
        </section>
      </div>
    </main>`;
    bindCommonEvents();
    bindBuyerDashboardEvents();
  }
  renderBuyer = renderBuyerDashboard;
  // DASHBOARD PENYEWA UPDATE END

  // STUDENT EKYC FEATURE START
  const ekycSteps = [
    ["ekyc-data-diri", "Data Diri"],
    ["ekyc-upload-identitas", "Upload Identitas"],
    ["ekyc-selfie", "Selfie"],
    ["ekyc-review", "Review"],
    ["ekyc-success", "Selesai"]
  ];

  function requireVerifiedAccess() {
    if (window.bbUserAccount?.canAccessRentalFeature?.()) return true;
    ui.toast("Lengkapi verifikasi identitas untuk menggunakan fitur ini.");
    router.navigate("ekyc");
    return false;
  }

  function renderAuthRequired(mount, title = "Masuk diperlukan") {
    mount.innerHTML = `<main class="min-h-screen bg-slate-50 pt-28"><div class="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8"><section class="card p-8 text-center"><h1 class="text-2xl font-extrabold text-slate-950">${title}</h1><p class="mx-auto mt-3 max-w-xl text-sm font-semibold leading-6 text-slate-500">Masuk atau daftar terlebih dahulu untuk melanjutkan verifikasi akun mahasiswa.</p><div class="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><button class="btn-primary rounded-2xl px-5 py-3" data-nav="login">Masuk</button><button class="btn-secondary rounded-2xl px-5 py-3" data-nav="register">Daftar</button></div></section></div></main>`;
    bindCommonEvents();
  }

  function ekycProgress(activeView) {
    const activeIndex = Math.max(0, ekycSteps.findIndex(step => step[0] === activeView));
    return `<ol class="flex gap-3 overflow-x-auto pb-2" aria-label="Tahapan e-KYC">${ekycSteps.map((step, index) => `<li class="flex min-w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-extrabold ${index <= activeIndex ? "border-blue-200 bg-blue-50 text-brand-blue" : "border-slate-200 bg-white text-slate-500"}"><span class="grid h-6 w-6 place-items-center rounded-full ${index <= activeIndex ? "bg-gradient-brand text-white" : "bg-slate-100 text-slate-500"}">${index + 1}</span>${step[1]}</li>`).join("")}</ol>`;
  }

  function ekycShell(activeView, title, subtitle, body) {
    return `<main class="min-h-screen bg-slate-50 pt-28">
      <div class="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div class="mb-5">${ekycProgress(activeView)}</div>
        <section class="card overflow-hidden">
          <div class="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-teal-50 p-6">
            <p class="text-sm font-extrabold text-brand-blue">e-KYC Mahasiswa</p>
            <h1 class="mt-2 text-2xl font-extrabold text-slate-950 md:text-3xl">${title}</h1>
            <p class="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500">${subtitle}</p>
          </div>
          <div class="p-5 md:p-6">${body}</div>
        </section>
      </div>
    </main>`;
  }

  function renderForgotPassword() {
    const mount = document.querySelector("#forgot-password-view");
    if (!mount) return;
    mount.innerHTML = `<main class="min-h-screen bg-slate-50 pt-28"><div class="mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:px-8"><section class="card p-6"><p class="font-extrabold text-brand-blue">Bantuan Akun</p><h1 class="mt-2 text-2xl font-extrabold text-slate-950">Lupa password</h1><p class="mt-2 text-sm font-semibold leading-6 text-slate-500">Masukkan email kampus kamu. Permintaan pemulihan akan dicatat sebagai notifikasi halaman.</p><form class="mt-5 grid gap-4" data-forgot-password-form><label class="text-sm font-bold text-slate-700">Email kampus<input class="field mt-2" name="email" type="email" autocomplete="email" placeholder="nama@kampus.ac.id"></label><div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" class="btn-secondary rounded-2xl px-5 py-3" data-nav="login">Kembali Masuk</button><button class="btn-primary rounded-2xl px-5 py-3">Kirim Instruksi</button></div></form></section></div></main>`;
    bindCommonEvents();
    document.querySelector("[data-forgot-password-form]")?.addEventListener("submit", event => {
      event.preventDefault();
      ui.toast("Instruksi pemulihan password sudah dicatat.");
      router.navigate("login");
    });
  }

  function renderEkycStart() {
    const mount = document.querySelector("#ekyc-view");
    if (!mount) return;
    const user = window.bbUserAccount?.getSessionUser?.();
    if (!user) return renderAuthRequired(mount, "Verifikasi akun mahasiswa");
    const meta = bbUserAccount.verificationMeta(user.verificationStatus);
    const nextRoute = user.verificationStatus === "verified" ? "dashboard-buyer" : "ekyc-data-diri";
    mount.innerHTML = ekycShell("ekyc-data-diri", "Verifikasi Mahasiswa", "Lengkapi data identitas agar akun bisa digunakan untuk checkout, upload barang, dan konfirmasi transaksi.", `<div class="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div class="grid gap-4">
        ${ekycSteps.slice(0, 4).map((step, index) => `<article class="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"><div class="flex items-start gap-4"><span class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-50 font-extrabold text-brand-blue">${index + 1}</span><div><h2 class="font-extrabold text-slate-950">${step[1]}</h2><p class="mt-1 text-sm font-semibold leading-6 text-slate-500">${["Isi data mahasiswa aktif sesuai dokumen kampus.", "Upload KTP dan KTM dalam format JPG atau PNG.", "Ambil atau upload selfie wajah yang jelas.", "Periksa kembali sebelum data dikirim."][index]}</p></div></div></article>`).join("")}
      </div>
      <aside class="h-fit rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"><h2 class="text-xl font-extrabold text-slate-950">Status akun</h2><div class="mt-3">${bbUserAccount.getVerificationBadge(user.verificationStatus)}</div><p class="mt-3 text-sm font-semibold leading-6 text-slate-500">${meta.text}</p><button class="btn-primary mt-6 w-full rounded-2xl px-5 py-3" data-nav="${nextRoute}">${user.verificationStatus === "verified" ? "Kembali ke Dashboard" : "Mulai Verifikasi"}</button></aside>
    </div>`);
    bindCommonEvents();
  }

  function renderEkycData(errors = {}) {
    const mount = document.querySelector("#ekyc-data-diri-view");
    if (!mount) return;
    const user = window.bbUserAccount?.getSessionUser?.();
    if (!user) return renderAuthRequired(mount);
    const identity = { fullName: user.fullName, nim: user.nim, email: user.email, phone: user.phone, campus: user.campus, address: "", birthDate: "", ...(user.ekyc?.identity || {}) };
    mount.innerHTML = ekycShell("ekyc-data-diri", "Data Diri Mahasiswa", "Pastikan data sesuai dengan KTP, KTM, dan data kampus kamu.", `<form class="grid gap-4 md:grid-cols-2" data-ekyc-data-form novalidate>
      ${ekycInput("Nama lengkap", "fullName", identity.fullName, errors.fullName)}
      ${ekycInput("NIM", "nim", identity.nim, errors.nim)}
      ${ekycInput("Email kampus", "email", identity.email, errors.email, "email", "bg-slate-50 text-slate-500", "readonly")}
      ${ekycInput("Nomor telepon", "phone", identity.phone, errors.phone)}
      ${ekycInput("Asal kampus", "campus", identity.campus, errors.campus)}
      ${ekycInput("Tanggal lahir", "birthDate", identity.birthDate, errors.birthDate, "date")}
      <label class="text-sm font-bold text-slate-700 md:col-span-2">Alamat domisili<textarea class="field mt-2 min-h-24" name="address" placeholder="Alamat domisili saat kuliah">${identity.address || ""}</textarea>${bbUserAccount.fieldError(errors, "address")}</label>
      <div class="md:col-span-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><button type="button" class="btn-secondary rounded-2xl px-5 py-3" data-nav="ekyc">Kembali</button><button class="btn-primary rounded-2xl px-5 py-3">Lanjut Upload Identitas</button></div>
    </form>`);
    bindCommonEvents();
    document.querySelector("[data-ekyc-data-form]")?.addEventListener("submit", event => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.currentTarget).entries());
      const nextErrors = {};
      ["fullName", "nim", "phone", "campus", "birthDate", "address"].forEach(key => { if (!String(data[key] || "").trim()) nextErrors[key] = "Field ini wajib diisi."; });
      if (!/^[+\d]+$/.test(String(data.phone || "").trim())) nextErrors.phone = "Nomor telepon hanya boleh angka dan simbol +.";
      if (Object.keys(nextErrors).length) return renderEkycData(nextErrors);
      bbUserAccount.saveEkycDraft({ identity: data });
      ui.toast("Data diri tersimpan.");
      router.navigate("ekyc-upload-identitas");
    });
  }

  function ekycInput(label, name, value = "", error = "", type = "text", extraClass = "", attrs = "") {
    return `<label class="text-sm font-bold text-slate-700">${label}<input class="field mt-2 ${extraClass}" name="${name}" type="${type}" value="${value || ""}" ${attrs}>${error ? `<p class="mt-1 text-xs font-bold text-red-600">${error}</p>` : ""}</label>`;
  }

  function renderEkycUpload(errors = {}) {
    const mount = document.querySelector("#ekyc-upload-identitas-view");
    if (!mount) return;
    const user = window.bbUserAccount?.getSessionUser?.();
    if (!user) return renderAuthRequired(mount);
    const docs = user.ekyc?.documents || {};
    mount.innerHTML = ekycShell("ekyc-upload-identitas", "Upload Identitas", "Upload KTP dan KTM mahasiswa aktif. Format JPG/PNG dengan ukuran maksimal 5MB.", `<div class="grid gap-5 md:grid-cols-2">
      ${uploadBox("ktp", "Foto KTP", docs.ktp, errors.ktp)}
      ${uploadBox("ktm", "Foto KTM", docs.ktm, errors.ktm)}
      <div class="md:col-span-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><button type="button" class="btn-secondary rounded-2xl px-5 py-3" data-nav="ekyc-data-diri">Kembali</button><button class="btn-primary rounded-2xl px-5 py-3" data-ekyc-upload-next>Lanjut Selfie</button></div>
    </div>`);
    bindCommonEvents();
    bindEkycUploads(renderEkycUpload);
    document.querySelector("[data-ekyc-upload-next]")?.addEventListener("click", () => {
      const latest = bbUserAccount.getSessionUser()?.ekyc?.documents || {};
      const nextErrors = {};
      if (!latest.ktp?.name) nextErrors.ktp = "Foto KTP wajib diupload.";
      if (!latest.ktm?.name) nextErrors.ktm = "Foto KTM wajib diupload.";
      if (Object.keys(nextErrors).length) return renderEkycUpload(nextErrors);
      router.navigate("ekyc-selfie");
    });
  }

  function uploadBox(key, title, file = {}, error = "") {
    return `<article class="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <div class="flex items-start justify-between gap-3"><div><h2 class="font-extrabold text-slate-950">${title}</h2><p class="mt-1 text-xs font-bold text-slate-500">JPG/PNG maksimal 5MB</p></div>${file?.name ? `<span class="badge bg-teal-50 text-teal-700">Tersimpan</span>` : `<span class="badge bg-amber-50 text-amber-700">Belum upload</span>`}</div>
      <div class="mt-4 grid min-h-44 place-items-center overflow-hidden rounded-3xl bg-slate-50 text-center text-sm font-bold text-slate-500">${file?.preview ? `<img src="${file.preview}" alt="${title}" class="h-44 w-full object-cover">` : `${icon("image-up", "mx-auto mb-2 h-8 w-8 text-brand-blue")}Preview ${title}`}</div>
      ${file?.name ? `<p class="mt-3 truncate text-sm font-bold text-slate-600">${file.name}</p>` : ""}
      ${error ? `<p class="mt-2 text-xs font-bold text-red-600">${error}</p>` : ""}
      <label class="btn-secondary mt-4 flex cursor-pointer justify-center rounded-2xl px-5 py-3 text-sm"><input class="sr-only" type="file" accept="image/png,image/jpeg" data-ekyc-file="${key}">${file?.name ? "Ganti File" : "Pilih File"}</label>
    </article>`;
  }

  function bindEkycUploads(renderFn) {
    document.querySelectorAll("[data-ekyc-file]").forEach(input => input.addEventListener("change", event => {
      const file = event.target.files?.[0];
      const key = event.target.dataset.ekycFile;
      if (!file) return;
      if (!["image/jpeg", "image/png"].includes(file.type) || file.size > 5 * 1024 * 1024) {
        ui.toast("File harus JPG/PNG dan maksimal 5MB.");
        return;
      }
      const preview = URL.createObjectURL(file);
      const patch = key === "selfie" ? { selfie: { name: file.name, size: file.size, type: file.type, preview } } : { documents: { [key]: { name: file.name, size: file.size, type: file.type, preview } } };
      bbUserAccount.saveEkycDraft(patch);
      ui.toast("File berhasil dipilih.");
      renderFn();
    }));
  }

  function renderEkycSelfie(errors = {}) {
    const mount = document.querySelector("#ekyc-selfie-view");
    if (!mount) return;
    const user = window.bbUserAccount?.getSessionUser?.();
    if (!user) return renderAuthRequired(mount);
    const selfie = user.ekyc?.selfie || {};
    mount.innerHTML = ekycShell("ekyc-selfie", "Selfie Verifikasi", "Ambil atau upload foto wajah yang jelas, tanpa masker, dan sesuai identitas.", `<div class="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section class="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
        <div class="grid min-h-72 place-items-center overflow-hidden rounded-3xl bg-slate-50 text-center text-sm font-bold text-slate-500" data-ekyc-camera-frame>${selfie.preview ? `<img src="${selfie.preview}" alt="Selfie verifikasi" class="h-72 w-full object-cover">` : `${icon("camera", "mx-auto mb-3 h-10 w-10 text-brand-blue")}Preview selfie`}</div>
        ${errors.selfie ? `<p class="mt-3 text-xs font-bold text-red-600">${errors.selfie}</p>` : ""}
        <div class="mt-4 flex flex-col gap-3 sm:flex-row"><button type="button" class="btn-secondary rounded-2xl px-5 py-3" data-ekyc-camera>Aktifkan Kamera</button><label class="btn-secondary flex cursor-pointer justify-center rounded-2xl px-5 py-3"><input class="sr-only" type="file" accept="image/png,image/jpeg" data-ekyc-file="selfie">Upload Selfie</label></div>
      </section>
      <aside class="h-fit rounded-3xl bg-blue-50 p-5 text-sm font-bold leading-6 text-blue-800"><h2 class="text-lg font-extrabold">Instruksi selfie</h2><p class="mt-3">Pastikan wajah terlihat penuh, pencahayaan cukup, dan foto bukan hasil edit berlebihan.</p><p class="mt-3">Gunakan upload jika kamera browser tidak aktif di perangkatmu.</p></aside>
      <div class="lg:col-span-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><button type="button" class="btn-secondary rounded-2xl px-5 py-3" data-nav="ekyc-upload-identitas">Kembali</button><button class="btn-primary rounded-2xl px-5 py-3" data-ekyc-selfie-next>Lanjut Review</button></div>
    </div>`);
    bindCommonEvents();
    bindEkycUploads(renderEkycSelfie);
    document.querySelector("[data-ekyc-camera]")?.addEventListener("click", async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const frame = document.querySelector("[data-ekyc-camera-frame]");
        frame.innerHTML = `<video class="h-72 w-full rounded-3xl object-cover" autoplay playsinline muted></video>`;
        frame.querySelector("video").srcObject = stream;
        ui.toast("Kamera aktif. Gunakan upload selfie untuk menyimpan foto.");
      } catch {
        ui.toast("Kamera tidak tersedia, gunakan upload foto selfie.");
      }
    });
    document.querySelector("[data-ekyc-selfie-next]")?.addEventListener("click", () => {
      const latest = bbUserAccount.getSessionUser()?.ekyc?.selfie || {};
      if (!latest.name) return renderEkycSelfie({ selfie: "Selfie wajib diupload." });
      router.navigate("ekyc-review");
    });
  }

  function renderEkycReview() {
    const mount = document.querySelector("#ekyc-review-view");
    if (!mount) return;
    const user = window.bbUserAccount?.getSessionUser?.();
    if (!user) return renderAuthRequired(mount);
    const identity = user.ekyc?.identity || {};
    const docs = user.ekyc?.documents || {};
    const selfie = user.ekyc?.selfie || {};
    mount.innerHTML = ekycShell("ekyc-review", "Review Data e-KYC", "Periksa kembali data sebelum dikirim untuk ditinjau tim BarangBareng.", `<div class="grid gap-5 lg:grid-cols-[1fr_360px]">
      <section class="grid gap-4">
        <article class="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"><div class="flex items-center justify-between"><h2 class="font-extrabold text-slate-950">Data diri</h2><button class="text-sm font-extrabold text-brand-blue" data-nav="ekyc-data-diri">Edit</button></div><div class="mt-4 grid gap-3 text-sm font-bold text-slate-600 sm:grid-cols-2">${["fullName", "nim", "email", "phone", "campus", "birthDate", "address"].map(key => `<p class="rounded-2xl bg-slate-50 p-3"><span class="block text-xs text-slate-400">${key}</span>${identity[key] || "-"}</p>`).join("")}</div></article>
        <article class="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"><div class="flex items-center justify-between"><h2 class="font-extrabold text-slate-950">Dokumen</h2><button class="text-sm font-extrabold text-brand-blue" data-nav="ekyc-upload-identitas">Edit</button></div><div class="mt-4 grid gap-3 sm:grid-cols-2">${["ktp", "ktm"].map(key => `<p class="rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-600"><span class="block text-xs text-slate-400">${key.toUpperCase()}</span>${docs[key]?.name || "-"}</p>`).join("")}</div></article>
      </section>
      <aside class="h-fit rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"><h2 class="font-extrabold text-slate-950">Selfie</h2><div class="mt-4 overflow-hidden rounded-3xl bg-slate-50">${selfie.preview ? `<img src="${selfie.preview}" alt="Selfie review" class="h-56 w-full object-cover">` : `<div class="grid h-56 place-items-center text-sm font-bold text-slate-500">Belum ada selfie</div>`}</div><button class="mt-4 text-sm font-extrabold text-brand-blue" data-nav="ekyc-selfie">Edit selfie</button><button class="btn-primary mt-6 w-full rounded-2xl px-5 py-3" data-ekyc-submit>Kirim Verifikasi</button></aside>
    </div>`);
    bindCommonEvents();
    document.querySelector("[data-ekyc-submit]")?.addEventListener("click", event => {
      event.currentTarget.disabled = true;
      event.currentTarget.textContent = "Mengirim...";
      bbUserAccount.submitEkyc({ identity, documents: docs, selfie });
      ui.toast("Verifikasi berhasil dikirim.");
      setTimeout(() => router.navigate("ekyc-success"), 350);
    });
  }

  function renderEkycSuccess() {
    const mount = document.querySelector("#ekyc-success-view");
    if (!mount) return;
    const user = window.bbUserAccount?.getSessionUser?.();
    if (!user) return renderAuthRequired(mount);
    mount.innerHTML = ekycShell("ekyc-success", "Verifikasi Berhasil Dikirim", "Tim BarangBareng akan meninjau data kamu dalam 1x24 jam.", `<section class="mx-auto max-w-2xl text-center"><span class="mx-auto grid h-20 w-20 place-items-center rounded-full bg-blue-50 text-brand-blue">${icon("shield-check", "h-11 w-11")}</span><h2 class="mt-5 text-2xl font-extrabold text-slate-950">Data sedang ditinjau</h2><p class="mt-3 text-sm font-semibold leading-6 text-slate-500">Kami akan memperbarui status akun setelah proses pemeriksaan selesai.</p><div class="mt-5">${bbUserAccount.getVerificationBadge("pending")}</div><button class="btn-primary mt-8 rounded-2xl px-5 py-3" data-nav="dashboard-buyer">Kembali ke Dashboard</button></section>`);
    bindCommonEvents();
  }
  // STUDENT EKYC FEATURE END

  // ACCOUNT SETTINGS PAGE START
  const accountPrefsKey = "barangBarengAccountPreferences";

  function accountPreferences() {
    try {
      return {
        transaction: true,
        promo: false,
        review: true,
        category: "Elektronik & Produktivitas",
        ...(JSON.parse(localStorage.getItem(accountPrefsKey) || "{}"))
      };
    } catch {
      return { transaction: true, promo: false, review: true, category: "Elektronik & Produktivitas" };
    }
  }

  function saveAccountPreferences(prefs) {
    try {
      localStorage.setItem(accountPrefsKey, JSON.stringify(prefs));
    } catch {
      return false;
    }
    return true;
  }

  function renderAccountSettings(errors = {}) {
    const mount = document.querySelector("#account-settings-view");
    if (!mount) return;
    const user = window.bbUserAccount?.getSessionUser?.();
    if (!user) {
      mount.innerHTML = `<main class="min-h-screen bg-slate-50 pt-24"><div class="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8"><section class="rounded-[28px] border border-slate-100 bg-white p-8 text-center shadow-sm"><h1 class="text-2xl font-extrabold text-slate-950">Pengaturan Akun</h1><p class="mx-auto mt-3 max-w-xl text-sm font-semibold leading-6 text-slate-500">Masuk terlebih dahulu untuk mengelola profil, keamanan, dan preferensi akun kamu.</p><div class="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><button class="btn-primary rounded-2xl px-5 py-3" data-nav="login">Masuk</button><button class="btn-secondary rounded-2xl px-5 py-3" data-nav="register">Daftar</button></div></section></div></main>`;
      bindCommonEvents();
      return;
    }
    const prefs = accountPreferences();
    const goldBenefit = user.level === "Gold" ? `<div class="mt-5 rounded-3xl bg-amber-50 p-5 text-amber-800"><span class="badge bg-white text-amber-700">Gold Benefit</span><div class="mt-4 grid gap-3 sm:grid-cols-2">${["Diskon biaya admin 30%", "Prioritas pencarian", "Boost listing", "Badge Gold Seller"].map(item => `<p class="rounded-2xl bg-white p-4 text-sm font-bold">${item}</p>`).join("")}</div></div>` : "";
    const categories = ["Elektronik & Produktivitas", "Kamera, Konten & Media Sosial", "Kamar Kos & Daily Living", "Masak & Makan Anak Kos", "Fashion Formal & Acara Kampus", "Event & Organisasi", "Pinjam Gratis"];
    mount.innerHTML = `<main class="min-h-screen bg-slate-50 pt-24">
      <div class="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <nav class="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
          <button class="hover:text-brand-blue" data-nav="home">Beranda</button><span>&gt;</span><button class="hover:text-brand-blue" data-nav="profile">Akun</button><span>&gt;</span><span class="text-slate-900">Pengaturan Akun</span>
        </nav>
        <header class="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div><h1 class="text-2xl font-extrabold text-slate-950 lg:text-3xl">Pengaturan Akun</h1><p class="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-500">Kelola informasi profil, keamanan akun, dan preferensi BarangBareng kamu.</p></div>
          <button class="btn-secondary w-full rounded-2xl px-5 py-3 text-sm sm:w-fit" data-nav="dashboard-buyer">${icon("arrow-left", "h-4 w-4")} Kembali ke Dashboard</button>
        </header>

        <section class="mt-6 grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside class="grid h-fit gap-6 lg:sticky lg:top-28">
            <article class="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
              <div class="flex items-start gap-4"><span class="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-gradient-brand text-xl font-extrabold text-white">${bbUserAccount.initials(user.fullName)}</span><div class="min-w-0"><h2 class="truncate text-xl font-extrabold text-slate-950">${user.fullName}</h2><p class="truncate text-sm font-semibold text-slate-500">${user.email}</p><p class="mt-1 text-sm font-semibold text-slate-500">${user.campus}</p></div></div>
              <div class="mt-5 flex flex-wrap gap-2">${bbUserAccount.levelBadge(user)}<span class="badge bg-teal-50 text-teal-700">Aktif</span>${bbUserAccount.getVerificationBadge(user.verificationStatus)}</div>
              <div class="mt-5 grid grid-cols-2 gap-3 text-sm font-bold text-slate-600"><div class="rounded-2xl bg-slate-50 p-4"><span class="block text-xs text-slate-400">Transaksi</span>${user.successfulTransactions} berhasil</div><div class="rounded-2xl bg-slate-50 p-4"><span class="block text-xs text-slate-400">Rating</span>${Number(user.rating).toFixed(1)} / 5</div></div>
            </article>

            <article class="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
              <h2 class="text-xl font-extrabold text-slate-950">Level Pengguna</h2>
              <p class="mt-3">${bbUserAccount.levelBadge(user)}</p>
              <div class="mt-5 h-3 rounded-full bg-slate-100"><div class="h-full rounded-full bg-gradient-brand" style="width:${Math.max(4, Number(user.progressPercent || 0))}%"></div></div>
              <p class="mt-2 text-sm font-semibold leading-6 text-slate-500">${user.progressText}</p>
              ${goldBenefit}
            </article>
          </aside>

          <div class="grid gap-6">
            <form class="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm" data-account-settings-form novalidate>
              <h2 class="text-xl font-extrabold text-slate-950">Form Pengaturan Profil</h2>
              <div class="mt-5 grid gap-4 md:grid-cols-2">
                <label class="text-sm font-bold text-slate-700">Nama lengkap<input class="field mt-2" name="fullName" autocomplete="name" value="${user.fullName}">${bbUserAccount.fieldError(errors, "fullName")}</label>
                <label class="text-sm font-bold text-slate-700">Email<input class="field mt-2 bg-slate-50 text-slate-500" name="email" type="email" value="${user.email}" readonly></label>
                <label class="text-sm font-bold text-slate-700">Nomor telepon<input class="field mt-2" name="phone" autocomplete="tel" value="${user.phone}">${bbUserAccount.fieldError(errors, "phone")}</label>
                <label class="text-sm font-bold text-slate-700">Asal kampus<input class="field mt-2" name="campus" value="${user.campus}">${bbUserAccount.fieldError(errors, "campus")}</label>
                <label class="text-sm font-bold text-slate-700 md:col-span-2">Bio singkat<textarea class="field mt-2 min-h-24" name="bio" maxlength="160" placeholder="Contoh: Mahasiswa aktif yang sering sewa perlengkapan kampus.">${prefs.bio || ""}</textarea></label>
                <label class="text-sm font-bold text-slate-700 md:col-span-2">Lokasi domisili umum<input class="field mt-2" name="domicile" value="${prefs.domicile || ""}" placeholder="Contoh: Kuningan, Jakarta Selatan"></label>
              </div>
              <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" class="btn-secondary rounded-2xl px-5 py-3" data-nav="profile">Batal</button><button class="btn-primary rounded-2xl px-5 py-3">Simpan Perubahan</button></div>
            </form>

            <section class="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
              <h2 class="text-xl font-extrabold text-slate-950">Keamanan Akun</h2>
              <div class="mt-5 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                <div><p class="text-sm font-bold text-slate-500">Email login</p><p class="mt-1 font-extrabold text-slate-950">${user.email}</p><p class="mt-2 text-sm font-semibold leading-6 text-slate-500">Password aktif. Perubahan password akan tersedia setelah integrasi backend.</p></div>
                <button class="btn-secondary rounded-2xl px-5 py-3 text-sm" disabled>Ubah Password</button>
              </div>
            </section>

            <section class="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
              <h2 class="text-xl font-extrabold text-slate-950">Preferensi Akun</h2>
              <div class="mt-5 grid gap-3">
                ${accountPreferenceToggle("transaction", "Notifikasi transaksi", "Info pembayaran, status sewa, dan serah terima.", prefs.transaction)}
                ${accountPreferenceToggle("promo", "Notifikasi promo", "Rekomendasi promo dan kategori populer.", prefs.promo)}
                ${accountPreferenceToggle("review", "Notifikasi review", "Pengingat untuk memberi penilaian setelah transaksi selesai.", prefs.review)}
              </div>
              <label class="mt-5 block text-sm font-bold text-slate-700">Preferensi kategori barang<select class="field mt-2" data-account-category>${categories.map(category => `<option value="${category}" ${prefs.category === category ? "selected" : ""}>${category}</option>`).join("")}</select></label>
            </section>
          </div>
        </section>
      </div>
    </main>`;
    bindCommonEvents();
    bindAccountSettingsEvents(prefs);
  }

  function accountPreferenceToggle(key, title, description, checked) {
    return `<label class="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
      <span><b class="block text-sm text-slate-900">${title}</b><span class="mt-1 block text-xs font-semibold leading-5 text-slate-500">${description}</span></span>
      <input class="h-5 w-5 shrink-0 accent-blue-600" type="checkbox" data-account-pref="${key}" ${checked ? "checked" : ""}>
    </label>`;
  }

  function bindAccountSettingsEvents(currentPrefs) {
    const prefs = { ...currentPrefs };
    document.querySelectorAll("[data-account-pref]").forEach(input => input.addEventListener("change", event => {
      prefs[event.target.dataset.accountPref] = event.target.checked;
      saveAccountPreferences(prefs);
      ui.toast("Preferensi akun diperbarui");
    }));
    document.querySelector("[data-account-category]")?.addEventListener("change", event => {
      prefs.category = event.target.value;
      saveAccountPreferences(prefs);
      ui.toast("Preferensi kategori diperbarui");
    });
    document.querySelector("[data-account-settings-form]")?.addEventListener("submit", event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      prefs.bio = String(form.get("bio") || "").trim();
      prefs.domicile = String(form.get("domicile") || "").trim();
      saveAccountPreferences(prefs);
      const result = bbUserAccount.updateProfile({
        fullName: String(form.get("fullName") || ""),
        phone: String(form.get("phone") || ""),
        campus: String(form.get("campus") || "")
      });
      if (!result.success) {
        renderAccountSettings(result.errors || {});
        return;
      }
      ui.toast("Data profil berhasil diperbarui.");
      renderAccountSettings();
    });
  }
  // ACCOUNT SETTINGS PAGE END

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
        <div class="flex flex-col gap-5 md:flex-row md:items-center"><span class="grid h-24 w-24 place-items-center rounded-[2rem] bg-gradient-brand text-3xl font-extrabold text-white">${bbUserAccount.initials(user.fullName)}</span><div><h1 class="text-3xl font-extrabold text-slate-950">${user.fullName}</h1><p class="text-slate-500">${user.email} - ${user.campus}</p><p class="mt-2 flex flex-wrap gap-2">${bbUserAccount.levelBadge(user)}${bbUserAccount.getVerificationBadge(user.verificationStatus)}<span class="badge bg-slate-50 text-slate-600">${user.successfulTransactions} transaksi</span><span class="badge bg-slate-50 text-slate-600">Rating ${Number(user.rating).toFixed(1)}</span></p></div></div>
        <button class="btn-secondary rounded-2xl px-5 py-3" data-nav="pengaturan-akun">Pengaturan Akun</button>
      </div>
      <div class="mt-7 h-4 rounded-full bg-slate-100"><div class="h-full rounded-full bg-gradient-brand" style="width:${Math.max(4, user.progressPercent)}%"></div></div>
      <p class="mt-2 text-sm font-semibold text-slate-500">${user.progressText}</p>
      <div class="mt-6 grid gap-4 md:grid-cols-4">${[["Level", user.level], ["Transaksi", user.successfulTransactions], ["Rating", Number(user.rating).toFixed(1)], ["Listing Priority", user.listingPriority]].map(item => `<div class="rounded-3xl bg-teal-50 p-4 font-bold text-teal-700"><span class="block text-xs text-teal-600">${item[0]}</span>${item[1]}</div>`).join("")}</div>
      ${goldBenefit}
    </section></div>`;
    bindCommonEvents();
  }
  renderProfile = renderProfileAccount;
  // USER ACCOUNT FEATURE END

  window.components = { renderHome, renderBrowse, renderDetail, renderCart, renderWishlist, renderReviewCreate, renderCheckout, renderBuyer, renderSeller, renderProfile, renderAccountSettings, renderForgotPassword, renderEkycStart, renderEkycData, renderEkycUpload, renderEkycSelfie, renderEkycReview, renderEkycSuccess, bindNavEvents, refreshNavBadges, rupiah, selectedProduct, feeRows, optionList, productCard, icon };
})();
