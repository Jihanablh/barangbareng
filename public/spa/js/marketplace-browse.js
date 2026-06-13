(function () {
  const icon = (name, cls = "h-5 w-5") => components.icon(name, cls);
  const rupiah = value => components.rupiah(value);
  const PAGE_SIZE = 20;

  const campusOptions = BBData.campuses;
  const areaOptions = ["Kuningan", "Depok", "Kemanggisan", "Grogol", "Rawamangun", "Lenteng Agung", "Jakarta Selatan", "Jakarta Timur", "Jakarta Barat", "Bekasi", "Tangerang"];
  const codOptions = ["Gerbang kampus", "Perpustakaan", "Kantin", "Lobby gedung", "Stasiun terdekat", "Kos area sekitar kampus", "Bisa atur lokasi dengan pemilik"];
  const categoryOptions = ["Anak Kos & Perantau", "Sidang & Wisuda", "Event Kampus", "Organisasi Mahasiswa", "Akademik & Presentasi", "Dokumentasi & Konten", "Outdoor Mahasiswa"];
  const quickPrice = [
    ["under-10", "Di bawah Rp10.000", 0, 10000],
    ["10-25", "Rp10.000-Rp25.000", 10000, 25000],
    ["25-50", "Rp25.000-Rp50.000", 25000, 50000],
    ["50-100", "Rp50.000-Rp100.000", 50000, 100000],
    ["above-100", "Di atas Rp100.000", 100000, 200000]
  ];
  const sortItems = [
    ["relevant", "Terkait"],
    ["newest", "Terbaru"],
    ["rented", "Terlaris"],
    ["price-low", "Harga"],
    ["rating", "Rating"],
    ["nearby", "Terdekat"]
  ];
  function ensureBrowseState() {
    state.browsePage = state.browsePage || 1;
    state.browseLoading = state.browseLoading || false;
    state.filters.campuses = state.filters.campuses || [];
    state.filters.areas = state.filters.areas || [];
    state.filters.codLocations = state.filters.codLocations || [];
    state.filters.categories = state.filters.categories || [];
    state.filters.ownerLevels = state.filters.ownerLevels || [];
    state.filters.availabilityList = state.filters.availabilityList || [];
    state.filters.listingTypes = state.filters.listingTypes || [];
    if (state.filters.priceMax > 200000) state.filters.priceMax = 200000;
  }

  function normalizeCategory(value) {
    const aliases = {
      "Anak Kos": "Anak Kos & Perantau",
      Organisasi: "Organisasi Mahasiswa",
      Dokumentasi: "Dokumentasi & Konten",
      Akademik: "Akademik & Presentasi",
      Outdoor: "Outdoor Mahasiswa"
    };
    return aliases[value] || value;
  }

  function productText(product) {
    return [
      product?.name,
      product?.category,
      product?.subcategory,
      product?.location,
      product?.campus,
      ...(Array.isArray(product?.badges) ? product.badges : []),
      product?.owner?.level,
      product?.owner?.name,
      product?.owner?.initials,
      product?.description,
      product?.searchText,
      ...(Array.isArray(product?.tags) ? product.tags : [])
    ].filter(Boolean).join(" ").toLowerCase();
  }

  function applyProductChip(chip) {
    const map = {
      "Tersedia Hari Ini": "today",
      "Pinjam Gratis": "free",
      "Dekat Kampus": "nearby",
      "Cocok Anak Kos": "kos",
      "Sidang & Wisuda": "wisuda",
      "Event Kampus": "event",
      Organisasi: "organisasi",
      "Top Rated": "rating",
      "Harga < Rp25.000": "cheap"
    };
    if (map[chip]) {
      state.filters.query = "";
      state.filters.quickFilter = state.filters.quickFilter === map[chip] ? null : map[chip];
    } else {
      state.filters.query = chip;
    }
    requestBrowseUpdate();
  }

  function syncBrowseUrl() {
    if (!["browse", "jelajah"].includes(router.currentView)) return;
    const query = String(state.filters.query || "").trim();
    const nextHash = query ? `#/jelajah?q=${encodeURIComponent(query)}` : "#/jelajah";
    if (window.location.hash !== nextHash) history.replaceState({ viewName: "jelajah", params: query ? { query } : {} }, "", nextHash);
  }

  function areaMatch(product, area) {
    if (product.location.toLowerCase().includes(area.toLowerCase())) return true;
    if (area === "Kuningan" && product.campus === "Universitas Bakrie") return true;
    if (area === "Depok" && ["Universitas Indonesia", "Universitas Gunadarma"].includes(product.campus)) return true;
    if (area === "Grogol" && product.campus === "Universitas Trisakti") return true;
    if (area === "Rawamangun" && product.campus === "Universitas Negeri Jakarta") return true;
    if (area === "Lenteng Agung" && product.campus === "Universitas Pancasila") return true;
    return product.location.toLowerCase().includes(area.split(" ")[1]?.toLowerCase() || area.toLowerCase());
  }

  function matches(product) {
    const filters = state.filters;
    const text = productText(product);
    const queryOk = !filters.query || text.includes(filters.query.toLowerCase());
    const campusOk = !filters.campuses.length || filters.campuses.includes(product.campus) || (filters.campuses.includes("Lainnya") && !campusOptions.includes(product.campus));
    const areaOk = !filters.areas.length || filters.areas.some(area => areaMatch(product, area));
    const codOk = !filters.codLocations.length || filters.codLocations.some(cod => text.includes(cod.toLowerCase().split(" ")[0]) || cod === "Bisa atur lokasi dengan pemilik");
    const selectedCategories = filters.categories.length ? filters.categories : filters.category !== "all" ? [filters.category] : [];
    const categoryOk = !selectedCategories.length || selectedCategories.some(category => product.category === normalizeCategory(category));
    const priceOk = product.price >= Number(filters.priceMin || 0) && product.price <= Number(filters.priceMax || 200000);
    const typeOk = !filters.listingTypes.length || filters.listingTypes.includes("Keduanya") || (filters.listingTypes.includes("Sewa Berbayar") && product.type === "sewa") || (filters.listingTypes.includes("Pinjam Gratis") && product.type === "pinjam");
    const availabilityOk = !filters.availabilityList.length || filters.availabilityList.some(item => item === "Tersedia Hari Ini" ? product.status === "available" : item === "Sedang Banyak Dicari" ? product.rentedCount > 35 : true);
    const ratingOk = product.rating >= Number(filters.rating || 0);
    const levelOk = !filters.ownerLevels.length || filters.ownerLevels.includes(product.owner.level) || filters.ownerLevels.includes("Mahasiswa Terverifikasi");
    const quick = filters.quickFilter;
    const quickOk = !quick ||
      (quick === "nearby" && product.campus === state.currentUser.campus) ||
      (quick === "today" && product.status === "available") ||
      (quick === "free" && product.type === "pinjam") ||
      (quick === "rating" && product.rating >= 4.8) ||
      (quick === "cheap" && product.price < 25000) ||
      (quick === "kos" && (product.category.includes("Kos") || product.badges.includes("Cocok Anak Kos") || product.tags?.includes("anak kos"))) ||
      (quick === "event" && (product.category.includes("Event") || product.badges.includes("Event Ready") || product.tags?.includes("event"))) ||
      (quick === "wisuda" && (product.category.includes("Wisuda") || product.tags?.includes("wisuda") || product.tags?.includes("sidang"))) ||
      (quick === "organisasi" && (product.category.includes("Organisasi") || product.badges.includes("Organisasi") || product.tags?.includes("organisasi")));
    return queryOk && campusOk && areaOk && codOk && categoryOk && priceOk && typeOk && availabilityOk && ratingOk && levelOk && quickOk;
  }

  function sortedProducts() {
    const list = BBData.products.filter(matches);
    const sort = state.sortBy;
    const query = String(state.filters.query || "").trim().toLowerCase();
    if (query && sort === "relevant") {
      return list.sort((a, b) => relevanceScore(b, query) - relevanceScore(a, query));
    }
    if (sort === "price-low") return list.sort((a, b) => a.price - b.price);
    if (sort === "price-high") return list.sort((a, b) => b.price - a.price);
    if (sort === "rating") return list.sort((a, b) => b.rating - a.rating);
    if (sort === "rented") return list.sort((a, b) => b.rentedCount - a.rentedCount);
    if (sort === "newest") return list.sort((a, b) => b.id - a.id);
    if (sort === "nearby") return list.sort((a, b) => (a.campus === state.currentUser.campus ? -1 : 1) - (b.campus === state.currentUser.campus ? -1 : 1));
    // USER ACCOUNT FEATURE START
    if (window.sortListingsByUserPriority) return window.sortListingsByUserPriority(list, window.bbUserAccount?.getUsers?.());
    // USER ACCOUNT FEATURE END
    return list.sort((a, b) => b.rating + b.rentedCount / 100 - (a.rating + a.rentedCount / 100));
  }

  function relevanceScore(product, query) {
    const tags = (product.tags || []).join(" ").toLowerCase();
    const badges = (product.badges || []).join(" ").toLowerCase();
    return [
      product.name?.toLowerCase().includes(query) ? 70 : 0,
      product.category?.toLowerCase().includes(query) ? 60 : 0,
      tags.includes(query) ? 55 : 0,
      product.subcategory?.toLowerCase().includes(query) ? 40 : 0,
      badges.includes(query) ? 30 : 0,
      product.description?.toLowerCase().includes(query) ? 10 : 0,
      product.rating || 0
    ].reduce((sum, value) => sum + value, 0);
  }

  function requestBrowseUpdate(loading = true) {
    state.browsePage = 1;
    syncBrowseUrl();
    if (!loading) return renderBrowse();
    state.browseLoading = true;
    renderBrowse();
    clearTimeout(state.browseTimer);
    state.browseTimer = setTimeout(() => {
      state.browseLoading = false;
      renderBrowse();
    }, 900);
  }

  function productCard(product) {
    const liked = state.isWishlisted(product.id);
    const status = product.status === "low" ? "Hampir Habis" : "Tersedia";
    const extra = product.type === "pinjam" ? "Pinjam Gratis" : product.rating >= 4.8 ? "Top Rated" : product.rentedCount > 40 ? "Terdekat" : product.badges[0] || "Event Ready";
    const goldSeller = product.owner.level === "gold" ? `<span class="badge bg-amber-50 text-amber-700">Gold Seller</span>` : "";
    return `<article class="group min-w-0 cursor-pointer overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue" data-product="${product.id}" role="button" tabindex="0" aria-label="Buka detail ${product.name}">
      <div class="relative overflow-hidden bg-slate-100">
        <img src="${product.image}" alt="${product.name}" class="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105" onerror="this.src='${product.gallery?.[0] || product.image}'">
        <div class="absolute left-1.5 top-1.5 flex max-w-[calc(100%-3.25rem)] flex-wrap gap-1 sm:left-2 sm:top-2"><span class="rounded-full px-2 py-1 text-[0.62rem] font-extrabold leading-none ${product.status === "low" ? "bg-amber-100 text-amber-700" : "bg-teal-100 text-teal-700"}">${status}</span><span class="hidden rounded-full bg-blue-50 px-2 py-1 text-[0.62rem] font-extrabold leading-none text-brand-blue sm:inline-flex">${extra}</span></div>
        <button class="absolute right-1.5 top-1.5 grid h-9 w-9 place-items-center rounded-full bg-white/95 text-slate-500 shadow-card sm:right-2 sm:top-2 ${liked ? "heart-liked text-red-500" : ""}" data-wishlist="${product.id}" aria-label="Disimpan">${icon("heart", liked ? "h-4 w-4 fill-current" : "h-4 w-4")}</button>
      </div>
      <div class="p-2.5 sm:p-3">
        <h3 class="line-clamp-2 min-h-[2.25rem] break-words text-xs font-extrabold leading-snug text-slate-950 sm:text-sm">${product.name}</h3>
        <p class="mt-1 line-clamp-1 text-[0.66rem] font-extrabold text-brand-blue sm:text-[0.75rem]">${product.category}</p>
        <p class="mt-1 line-clamp-1 text-[0.68rem] font-semibold text-slate-600 sm:text-[0.78rem]">Rating ${product.rating} | ${product.reviewCount} ulasan</p>
        <p class="mt-1.5 text-sm font-extrabold leading-tight text-brand-blue sm:text-base">${product.type === "pinjam" ? `Gratis <span class="block text-[0.62rem] text-slate-500 sm:inline sm:text-[0.7rem]">layanan Rp5.000</span>` : `${rupiah(product.price)} <span class="text-[0.65rem] text-slate-500 sm:text-[0.7rem]">/hari</span>`}</p>
        <p class="mt-1 line-clamp-1 text-[0.68rem] font-semibold text-slate-500 sm:text-[0.78rem]">${product.location}</p>
        <p class="line-clamp-1 text-[0.68rem] text-slate-500 sm:text-[0.78rem]">${product.campus}</p>
        <div class="mt-2 flex items-center justify-between gap-1.5">
          <span class="truncate rounded-full px-2 py-1 text-[0.62rem] font-extrabold ${product.owner.level === "gold" ? "bg-amber-100 text-amber-700" : product.owner.level === "silver" ? "bg-slate-100 text-slate-700" : "bg-lime-100 text-lime-700"}">${product.owner.level[0].toUpperCase() + product.owner.level.slice(1)}</span>
          <span class="shrink-0 text-[0.65rem] font-bold text-slate-400">${product.owner.initials}</span>
        </div>
        ${goldSeller ? `<div class="mt-2">${goldSeller}</div>` : ""}
      </div>
    </article>`;
  }

  function checkboxGroup(title, key, items, iconName) {
    const selected = state.filters[key] || [];
    return `<section class="border-b border-slate-100 py-4">
      <h3 class="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900">${icon(iconName, "h-4 w-4 text-brand-blue")} ${title}</h3>
      <div class="grid gap-2">${items.map(item => `<label class="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-600"><input class="rounded border-slate-300 accent-blue-600" type="checkbox" data-check-filter="${key}" value="${item}" ${selected.includes(item) ? "checked" : ""}>${item}</label>`).join("")}</div>
    </section>`;
  }

  function filterPanel(mobile = false) {
    return `<aside class="${mobile ? "fixed bottom-2 z-[90] hidden max-h-[86vh] overflow-y-auto rounded-t-[28px] border border-slate-100 bg-white p-5 shadow-xl" : "sticky hidden h-fit w-[260px] shrink-0 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm lg:block"}" style="${mobile ? "" : "top: var(--browse-panel-top, 184px)"}" id="${mobile ? "mobile-filter-sheet" : "desktop-filter"}">
      <div class="mb-3 flex items-center justify-between"><h2 class="flex items-center gap-2 text-lg font-extrabold text-slate-950">${icon("sliders-horizontal")} FILTER</h2>${mobile ? `<button class="grid h-10 w-10 place-items-center rounded-full bg-slate-100" data-close-filter>${icon("x")}</button>` : ""}</div>
      ${checkboxGroup("Kampus", "campuses", [...campusOptions, "Lainnya"], "building-2")}
      ${checkboxGroup("Area Sekitar Kampus", "areas", areaOptions, "map-pin")}
      ${checkboxGroup("Titik COD Kampus", "codLocations", codOptions, "scan-line")}
      ${checkboxGroup("Kategori", "categories", categoryOptions, "layout-grid")}
      <section class="border-b border-slate-100 py-4">
        <h3 class="mb-3 text-sm font-extrabold text-slate-900">Harga Sewa / Hari</h3>
        <input class="w-full accent-blue-600" type="range" min="0" max="200000" step="5000" value="${state.filters.priceMax}" data-price-range>
        <div class="mt-3 grid grid-cols-2 gap-2"><input class="field text-sm" value="${state.filters.priceMin}" placeholder="Min" data-price-min><input class="field text-sm" value="${state.filters.priceMax}" placeholder="Max" data-price-max></div>
        <div class="mt-3 flex flex-wrap gap-2">${quickPrice.map(item => `<button class="badge bg-slate-100 text-slate-600" data-price-preset="${item[0]}">${item[1]}</button>`).join("")}</div>
      </section>
      ${checkboxGroup("Tipe Listing", "listingTypes", ["Sewa Berbayar", "Pinjam Gratis", "Keduanya"], "tag")}
      ${checkboxGroup("Ketersediaan", "availabilityList", ["Tersedia Hari Ini", "Tersedia Minggu Ini", "Bisa Booking Nanti", "Sedang Banyak Dicari"], "calendar-check")}
      <section class="border-b border-slate-100 py-4">
        <h3 class="mb-3 text-sm font-extrabold text-slate-900">Rating</h3>
        ${[["0", "Semua"], ["4.8", "4.8 ke atas"], ["4.5", "4.5 ke atas"], ["4.0", "4.0 ke atas"]].map(item => `<label class="mb-2 flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-600"><input class="accent-blue-600" type="radio" name="${mobile ? "rating-mobile" : "rating"}" data-rating-filter value="${item[0]}" ${Number(state.filters.rating || 0) === Number(item[0]) ? "checked" : ""}>${item[1]}</label>`).join("")}
      </section>
      ${checkboxGroup("Level Pemilik", "ownerLevels", ["gold", "silver", "bronze", "Mahasiswa Terverifikasi"], "badge-check")}
      <div class="sticky bottom-0 mt-5 grid gap-3 bg-white pt-3"><button class="btn-primary rounded-2xl px-5 py-3" data-apply-filter>Terapkan Filter</button><button class="btn-secondary rounded-2xl px-5 py-3" data-reset-filter>Reset Semua</button></div>
    </aside>`;
  }

  function sortBar(totalPages) {
    const productChips = ["Tersedia Hari Ini", "Pinjam Gratis", "Dekat Kampus", "Cocok Anak Kos", "Sidang & Wisuda", "Event Kampus", "Organisasi", "Top Rated", "Harga < Rp25.000"];
    return `<section class="sticky z-30 border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur-xl" style="top: var(--browse-sticky-top, 72px)">
      <div class="mx-auto max-w-[1480px] px-4 py-3 sm:px-6 lg:px-8">
        <div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div class="flex items-center gap-2 overflow-x-auto pb-1"><span class="shrink-0 text-sm font-extrabold text-slate-500">Urutkan</span>${sortItems.map(item => `<button class="shrink-0 rounded-2xl px-4 py-2 text-sm font-bold ${state.sortBy === item[0] ? "bg-gradient-brand text-white" : "border border-slate-200 bg-white text-slate-600"}" data-sort="${item[0]}">${item[1]}${item[0] === "price-low" ? " v" : ""}</button>`).join("")}<select class="field w-44 shrink-0 text-sm" data-price-sort><option value="price-low" ${state.sortBy === "price-low" ? "selected" : ""}>Harga Terendah</option><option value="price-high" ${state.sortBy === "price-high" ? "selected" : ""}>Harga Tertinggi</option></select></div>
          <div class="hidden items-center gap-2 text-sm font-bold text-slate-500 lg:flex"><span>${state.browsePage}/${Math.max(1, totalPages)}</span><button class="rounded-xl border border-slate-200 px-3 py-2" data-page-prev>${icon("chevron-left", "h-4 w-4")}</button><button class="rounded-xl border border-slate-200 px-3 py-2" data-page-next>${icon("chevron-right", "h-4 w-4")}</button></div>
        </div>
        <div class="mt-3 flex gap-2 overflow-x-auto pb-1">${productChips.map(chip => `<button class="badge shrink-0 border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-brand-blue" data-chip="${chip}">${chip}</button>`).join("")}</div>
      </div>
    </section>`;
  }

  function skeletonGrid() {
    return `<div class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:gap-5 2xl:grid-cols-5">${Array.from({ length: 10 }, () => `<article class="rounded-2xl border border-slate-100 bg-white p-2.5 shadow-sm sm:p-3"><div class="skeleton aspect-[4/3] w-full"></div><div class="skeleton mt-3 h-4 w-4/5"></div><div class="skeleton mt-2 h-3 w-2/3"></div><div class="skeleton mt-4 h-9 w-full"></div></article>`).join("")}</div>`;
  }

  function emptyState() {
    return `<div class="rounded-[32px] border border-slate-100 bg-white p-10 text-center shadow-sm">${icon("search-x", "mx-auto h-16 w-16 text-slate-300")}<h2 class="mt-5 text-2xl font-extrabold text-slate-950">Tidak ada barang yang cocok dengan pencarian kamu.</h2><p class="mt-2 text-slate-500">Coba gunakan kata kunci lain atau hapus beberapa filter.</p><div class="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><button class="btn-secondary rounded-2xl px-6 py-3" data-reset-search>Reset Pencarian</button><button class="btn-primary rounded-2xl px-6 py-3" data-reset-filter>Jelajah Semua Barang</button></div></div>`;
  }

  function resultHeader(total) {
    const query = String(state.filters.query || "").trim();
    return `<div class="mb-5 rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm">
      <p class="text-sm font-bold text-brand-blue">BarangBareng</p>
      <h1 class="mt-1 text-2xl font-extrabold text-slate-950">${query ? `Hasil pencarian untuk "${query}"` : "Jelajah Semua Barang"}</h1>
      <p class="mt-2 text-sm font-semibold text-slate-500">Menampilkan ${total} barang yang sesuai dengan pencarian dan filter aktif.</p>
    </div>`;
  }

  function renderBrowse() {
    ensureBrowseState();
    syncBrowseUrl();
    const navbarSearch = document.querySelector("#navbar-search");
    if (navbarSearch) navbarSearch.value = state.filters.query || "";
    const mount = document.querySelector("#browse-view");
    if (!mount) return;
    const all = sortedProducts();
    const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
    state.browsePage = Math.min(state.browsePage, totalPages);
    const visible = all.slice((state.browsePage - 1) * PAGE_SIZE, state.browsePage * PAGE_SIZE);
    mount.innerHTML = `<div class="min-h-screen bg-[#F8FAFC] pb-16" style="padding-top: var(--browse-page-top, 72px)">
      ${sortBar(totalPages)}
      <div class="mx-auto flex max-w-[1480px] gap-4 px-3 py-5 sm:px-6 lg:gap-5 lg:px-8">
        ${filterPanel(false)}
        ${filterPanel(true)}
        <main class="min-w-0 flex-1">
          <div class="mb-4 flex justify-end lg:hidden"><button class="btn-secondary shrink-0 rounded-2xl px-4 py-3" data-open-filter>${icon("sliders-horizontal", "h-4 w-4")} Filter</button></div>
          ${resultHeader(all.length)}
          <section class="scroll-mt-48" aria-label="Product grid">${state.browseLoading ? skeletonGrid() : visible.length ? `<div class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:gap-5 2xl:grid-cols-5">${visible.map(productCard).join("")}</div>` : emptyState()}</section>
          <div class="mt-8 flex items-center justify-center gap-3 lg:hidden"><button class="btn-secondary rounded-2xl px-4 py-3" data-page-prev>Sebelumnya</button><span class="font-bold text-slate-500">${state.browsePage}/${totalPages}</span><button class="btn-primary rounded-2xl px-4 py-3" data-page-next>Berikutnya</button></div>
          <div class="mt-8 flex justify-center"><button class="btn-secondary rounded-2xl px-6 py-3" data-load-more>Muat Lebih Banyak</button></div>
        </main>
      </div>
    </div>`;
    bindBrowseEvents();
    bindSharedEvents();
    if (window.lucide) lucide.createIcons();
  }

  function bindBrowseEvents() {
    document.querySelectorAll("[data-check-filter]").forEach(input => input.addEventListener("change", event => {
      const key = event.target.dataset.checkFilter;
      const list = state.filters[key] || [];
      state.filters[key] = event.target.checked ? [...new Set([...list, event.target.value])] : list.filter(item => item !== event.target.value);
      if (key === "campuses" && event.target.checked && campusOptions.includes(event.target.value)) state.filters.campus = event.target.value;
    }));
    document.querySelectorAll("[data-rating-filter]").forEach(input => input.addEventListener("change", event => { state.filters.rating = Number(event.target.value); }));
    document.querySelector("[data-price-range]")?.addEventListener("input", event => { state.filters.priceMax = Number(event.target.value); });
    document.querySelector("[data-price-min]")?.addEventListener("change", event => { state.filters.priceMin = Number(event.target.value || 0); });
    document.querySelector("[data-price-max]")?.addEventListener("change", event => { state.filters.priceMax = Number(event.target.value || 200000); });
    document.querySelectorAll("[data-price-preset]").forEach(button => button.addEventListener("click", () => {
      const item = quickPrice.find(price => price[0] === button.dataset.pricePreset);
      state.filters.priceMin = item[2];
      state.filters.priceMax = item[3];
      requestBrowseUpdate();
    }));
    document.querySelectorAll("[data-sort]").forEach(button => button.addEventListener("click", () => { state.sortBy = button.dataset.sort; requestBrowseUpdate(); }));
    document.querySelector("[data-price-sort]")?.addEventListener("change", event => { state.sortBy = event.target.value; requestBrowseUpdate(); });
    document.querySelectorAll("[data-quick]").forEach(button => button.addEventListener("click", () => { state.filters.quickFilter = state.filters.quickFilter === button.dataset.quick ? null : button.dataset.quick; requestBrowseUpdate(); }));
    document.querySelectorAll("[data-apply-filter]").forEach(button => button.addEventListener("click", () => { closeMobileFilter(); requestBrowseUpdate(); }));
    document.querySelectorAll("[data-open-filter]").forEach(button => button.addEventListener("click", () => document.querySelector("#mobile-filter-sheet")?.classList.remove("hidden")));
    document.querySelectorAll("[data-close-filter]").forEach(button => button.addEventListener("click", closeMobileFilter));
    document.querySelectorAll("[data-page-prev]").forEach(button => button.addEventListener("click", () => { if (state.browsePage > 1) { state.browsePage -= 1; requestBrowseUpdate(); } }));
    document.querySelectorAll("[data-page-next]").forEach(button => button.addEventListener("click", () => { state.browsePage += 1; requestBrowseUpdate(); }));
    document.querySelector("[data-load-more]")?.addEventListener("click", () => { state.browsePage += 1; requestBrowseUpdate(); });
    document.querySelector("[data-popular-browse]")?.addEventListener("click", () => { state.filters.query = ""; state.sortBy = "rented"; requestBrowseUpdate(); });
  }

  function bindSharedEvents() {
    document.querySelectorAll("[data-product]").forEach(card => {
      const openProduct = () => router.navigate("product-detail", { productId: card.dataset.product });
      card.addEventListener("click", openProduct);
      card.addEventListener("keydown", event => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        openProduct();
      });
    });
    document.querySelectorAll("[data-wishlist]").forEach(button => button.addEventListener("click", event => {
      event.stopPropagation();
      const liked = state.toggleWishlist(Number(button.dataset.wishlist));
      ui.toast(liked ? "Produk ditambahkan ke halaman Disimpan" : "Produk dihapus dari halaman Disimpan");
      renderBrowse();
    }));
    document.querySelectorAll("[data-chip]").forEach(button => button.addEventListener("click", () => applyProductChip(button.dataset.chip)));
    document.querySelectorAll("[data-reset-filter]").forEach(button => button.addEventListener("click", () => {
      state.filters = { query: "", category: "all", priceMin: 0, priceMax: 200000, location: "all", campus: "all", rating: 0, type: "all", level: "all", availability: "all", quickFilter: null, campuses: [], areas: [], codLocations: [], categories: [], ownerLevels: [], availabilityList: [], listingTypes: [] };
      state.sortBy = "relevant";
      closeMobileFilter();
      requestBrowseUpdate(false);
    }));
    document.querySelectorAll("[data-reset-search]").forEach(button => button.addEventListener("click", () => {
      state.filters.query = "";
      closeMobileFilter();
      requestBrowseUpdate(false);
    }));
    components.bindNavEvents();
  }

  function closeMobileFilter() {
    document.querySelector("#mobile-filter-sheet")?.classList.add("hidden");
  }

  components.renderBrowse = renderBrowse;
})();
