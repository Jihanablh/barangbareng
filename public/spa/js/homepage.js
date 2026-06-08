(function () {
  const byName = name => BBData.products.find(product => product.name === name) || BBData.products[0];
  const rupiah = value => components.rupiah(value);
  const icon = (name, cls = "h-5 w-5") => components.icon(name, cls);

  const featuredNames = [
    "Laptop ASUS VivoBook",
    "Kamera Canon EOS M50",
    "Rice Cooker Mini",
    "Jas Pria Formal",
    "Setrika Philips",
    "Tenda Camping",
    "Speaker JBL",
    "Proyektor Mini"
  ];

  const categories = [
    ["Elektronik & Produktivitas", "Laptop, iPad, proyektor", "847 barang", "Laptop ASUS VivoBook"],
    ["Kamera, Konten & Media Sosial", "Kamera, ring light, tripod", "312 barang", "Kamera Canon EOS M50"],
    ["Kamar Kos & Daily Living", "Meja lipat, kipas, rak susun", "320 barang", "Meja Lipat Anak Kos"],
    ["Masak & Makan Anak Kos", "Rice cooker, teflon, blender", "265 barang", "Rice Cooker Mini"],
    ["Kebersihan & Laundry", "Setrika, steamer, vacuum", "184 barang", "Setrika Philips"],
    ["Fashion Formal & Acara Kampus", "Jas, kebaya, toga", "226 barang", "Jas Pria Formal"],
    ["Event & Organisasi", "HT, speaker, mic", "198 barang", "Speaker JBL"],
    ["Outdoor & Travel", "Tenda, sleeping bag", "142 barang", "Tenda Camping"],
    ["Kesehatan & Darurat", "Termometer, P3K, payung", "95 barang", "Payung Kampus"],
    ["Beauty & Self-Care", "Hair dryer, mirror, styling kit", "118 barang", "Cermin Full Body"],
    ["Pinjam Gratis", "Payung, charger, buku", "73 barang", "Payung Kampus"]
  ];

  const useCases = [
    ["Baru Pindah Kos?", "Sewa meja lipat, kipas, rak susun, jemuran, dan perlengkapan kamar tanpa harus langsung beli semuanya.", "home"],
    ["Mau Sidang atau Interview?", "Cari jas, blazer, kemeja, sepatu formal, kebaya, atau toga untuk kebutuhan acara penting.", "briefcase"],
    ["Ada Event Kampus?", "Sewa HT, speaker, mic, proyektor, kabel roll, dan perlengkapan kepanitiaan dengan mudah.", "calendar-days"],
    ["Bikin Konten atau Dokumentasi?", "Temukan kamera, tripod, ring light, microphone, dan lighting untuk tugas atau media sosial.", "video"]
  ];

  const bundles = [
    ["Paket Anak Kos Baru", "Meja lipat, kipas, rak susun, jemuran", "Mulai Rp28.000/hari"],
    ["Paket Sidang", "Jas, kemeja, sepatu formal, tripod", "Mulai Rp35.000/hari"],
    ["Paket Presentasi", "Laptop, proyektor, pointer, HDMI", "Mulai Rp45.000/hari"],
    ["Paket Konten", "Kamera, tripod, ring light, mic", "Mulai Rp60.000/hari"],
    ["Paket Camping", "Tenda, matras, sleeping bag, lampu", "Mulai Rp50.000/hari"],
    ["Paket Event Kampus", "Speaker, HT, mic, kabel roll", "Mulai Rp75.000/hari"],
    ["Paket Masak Hemat", "Rice cooker, kompor listrik, teflon", "Mulai Rp24.000/hari"],
    ["Paket Laundry Kos", "Setrika, steamer, jemuran lipat", "Mulai Rp18.000/hari"]
  ];

  const campuses = [
    ["Universitas Bakrie", "Kuningan, Jakarta Selatan", "128 barang tersedia"],
    ["Universitas Indonesia", "Depok dan Salemba", "342 barang tersedia"],
    ["BINUS University", "Kemanggisan dan Alam Sutera", "215 barang tersedia"],
    ["Universitas Trisakti", "Grogol, Jakarta Barat", "164 barang tersedia"],
    ["Universitas Gunadarma", "Depok dan Kalimalang", "196 barang tersedia"],
    ["Universitas Negeri Jakarta", "Rawamangun", "121 barang tersedia"],
    ["UPN Veteran Jakarta", "Pondok Labu", "103 barang tersedia"],
    ["Universitas Pancasila", "Lenteng Agung", "87 barang tersedia"]
  ];

  const freeItems = [
    ["Payung", BBData.images.umbrella], ["Kabel HDMI", BBData.images.hdmi], ["Kalkulator", BBData.images.calculator], ["Buku Referensi", BBData.images.tablet],
    ["Charger HP", BBData.images.powerbank], ["Lunch Box", BBData.images.cooker], ["Jas Cadangan", BBData.images.suit], ["Tripod", BBData.images.tripod]
  ];

  const faq = [
    ["BarangBareng itu untuk siapa?", "BarangBareng dibuat untuk mahasiswa yang butuh barang sementara atau ingin menyewakan barang yang jarang dipakai."],
    ["Apakah harus mahasiswa?", "Ya, alur utama dirancang untuk pengguna mahasiswa dengan verifikasi identitas dan kampus."],
    ["Bagaimana cara bayar DP?", "DP dibayar memakai Koin Saldo atau QRIS BarangBareng dan tercatat di sistem."],
    ["Apakah bisa pakai QRIS?", "Bisa. Top up dan pembayaran DP mendukung QRIS BarangBareng."],
    ["Bagaimana proses COD?", "Penyewa dan pemilik bertemu di lokasi kampus atau area kos, lalu memakai QR serah terima."],
    ["Apakah bisa pinjam gratis?", "Bisa. Beberapa barang tersedia sebagai Pinjam Gratis dengan biaya layanan kecil."],
    ["Bagaimana cara menyewakan barang?", "Daftar akun, upload barang, atur harga dan lokasi COD, lalu tanggapi request penyewa."]
  ];

  function productMini(product, tilt = "") {
    return `<article class="${tilt} rounded-[28px] bg-white p-3 text-slate-900 shadow-card-hover">
      <div class="grid grid-cols-[96px_1fr] gap-3">
        <img src="${product.image}" alt="${product.name}" class="h-24 w-full rounded-2xl object-cover">
        <div>
          <span class="badge bg-teal-50 text-teal-700">Tersedia</span>
          <h3 class="mt-2 line-clamp-1 font-extrabold">${product.name}</h3>
          <p class="text-sm font-bold text-brand-blue">${product.type === "pinjam" ? "Gratis" : rupiah(product.price) + "/hari"}</p>
        </div>
      </div>
    </article>`;
  }

  function statCard(iconName, value, label, suffix = "") {
    const display = Number(value).toLocaleString("id-ID") + suffix;
    return `<article class="card p-5">
      <span class="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-brand-blue">${icon(iconName)}</span>
      <strong class="text-3xl font-extrabold text-slate-950" data-counter="${value}" data-suffix="${suffix}">${display}</strong>
      <p class="mt-1 text-sm font-semibold text-slate-500">${label}</p>
    </article>`;
  }

  function renderHome() {
    const mount = document.querySelector("#home-view");
    if (!mount) return;
    const featured = featuredNames.map(byName);
    const preview = [byName("Kamera Canon EOS M50"), byName("Rice Cooker Mini"), byName("Jas Pria Formal")];
    mount.innerHTML = `
      <section class="relative overflow-hidden pt-[72px]">
        <div class="absolute left-[-120px] top-24 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl"></div>
        <div class="absolute right-[-120px] top-40 h-80 w-80 rounded-full bg-teal-300/30 blur-3xl"></div>
        <div class="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.04fr_.96fr] lg:px-8 lg:py-20">
          <div>
            <span class="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-brand-blue">Platform Sewa Barang Harian untuk Mahasiswa</span>
            <h1 class="mt-6 max-w-3xl text-4xl font-extrabold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">Sewa Barang Harian Mahasiswa, Lebih Hemat dan Praktis.</h1>
            <p class="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Temukan laptop, kamera, alat kos, outfit sidang, perlengkapan event, sampai kebutuhan harian dari sesama mahasiswa di sekitarmu.</p>
            <div class="mt-7 flex flex-col gap-3 sm:flex-row"><button class="btn-primary rounded-2xl px-6 py-3" data-nav="browse">Jelajah Barang</button><button class="btn-secondary rounded-2xl px-6 py-3" data-nav="upload-product">Sewakan Barang</button></div>
            <div class="mt-8 rounded-[32px] bg-white p-4 shadow-card-hover">
              <div class="grid gap-3 lg:grid-cols-[1fr_190px_190px_auto]">
                <label class="field flex items-center gap-3">${icon("search", "h-5 w-5 text-brand-blue")}<input id="home-search" class="w-full outline-none" placeholder="Cari produk, kategori, kampus..."></label>
                <select id="home-category" class="field">${components.optionList(["all", ...BBData.categories.map(c => c.name)], "all", "Kategori")}</select>
                <select id="home-campus" class="field">${components.optionList(["all", ...BBData.campuses], "all", "Kampus/Lokasi")}</select>
                <button class="btn-primary rounded-2xl px-6 py-3" id="home-search-btn">Cari Barang</button>
              </div>
              <div class="mt-4 flex gap-2 overflow-x-auto pb-1">${["Laptop", "Kamera Canon", "Rice Cooker", "Jas Sidang", "Tenda Camping", "Proyektor", "Setrika", "Tripod"].map(chip => `<button class="badge shrink-0 bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-brand-blue" data-chip="${chip}">${chip}</button>`).join("")}</div>
            </div>
          </div>
          <div class="relative min-h-[520px]">
            <div class="absolute inset-0 rounded-[40px] bg-gradient-to-br from-blue-600 to-teal-500 p-5 shadow-blue"></div>
            <div class="relative z-10 grid gap-4 p-6">
              <div class="rounded-[28px] bg-white/90 p-5 backdrop-blur-xl"><p class="text-sm font-bold text-slate-500">Marketplace aktif</p><h2 class="mt-1 text-2xl font-extrabold text-slate-950">Barang kampus siap disewa hari ini</h2></div>
              ${productMini(preview[0], "-rotate-2")}
              ${productMini(preview[1], "ml-auto w-[92%] rotate-1")}
              ${productMini(preview[2], "-rotate-1")}
              <div class="grid grid-cols-2 gap-3 text-sm font-bold">${["Pembayaran Aman", "QR Serah Terima", "Mahasiswa Terverifikasi", "Top Up QRIS"].map(text => `<span class="rounded-full bg-white/90 px-4 py-3 text-center text-slate-700">${text}</span>`).join("")}</div>
            </div>
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          ${statCard("package-check", 2400, "Barang tersedia", "+")}
          ${statCard("users", 8500, "Pengguna mahasiswa", "+")}
          ${statCard("building-2", 120, "Kampus terhubung", "+")}
          ${statCard("star", 4.9, "Rating pengguna", "/5")}
        </div>
      </section>

      ${sectionHeader("Temukan Barang Sesuai Kebutuhanmu", "Pilih kategori yang paling sesuai dengan kebutuhan kuliah, kos, event, atau aktivitas harianmu.")}
      <section class="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8"><div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">${categories.map(category => {
        const item = byName(category[3]);
        return `<button class="product-card card overflow-hidden text-left" data-home-category="${category[0]}"><img src="${item.image}" alt="${category[0]}" class="h-32 w-full object-cover"><div class="p-5"><strong class="text-slate-950">${category[0]}</strong><p class="mt-2 text-sm text-slate-500">${category[1]}</p><p class="mt-3 text-xs font-bold text-brand-blue">${category[2]}</p></div></button>`;
      }).join("")}</div></section>

      ${sectionHeader("Lagi Banyak Dicari", "Barang populer yang sering disewa mahasiswa minggu ini.")}
      <section class="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div class="mb-5 flex gap-2 overflow-x-auto pb-1">${["Semua", "Elektronik", "Anak Kos", "Formal", "Event", "Pinjam Gratis"].map((tab, index) => `<button class="badge shrink-0 ${index === 0 ? "bg-brand-blue text-white" : "bg-white text-slate-600"}" data-featured-tab="${tab}">${tab}</button>`).join("")}</div>
        <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">${featured.map(item => components.productCard(item)).join("")}</div>
      </section>

      <section class="bg-white py-16">${sectionInner("Solusi Praktis untuk Kebutuhan Anak Rantau", "Dari kebutuhan kos, sidang, event kampus, sampai konten media sosial, semua bisa dicari di BarangBareng.", `<div class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">${useCases.map(card => `<article class="product-card rounded-[28px] bg-gradient-to-br from-blue-50 to-teal-50 p-6"><span class="grid h-14 w-14 place-items-center rounded-2xl bg-white text-brand-blue shadow-card">${icon(card[2])}</span><h3 class="mt-5 text-xl font-extrabold text-slate-950">${card[0]}</h3><p class="mt-3 text-sm leading-6 text-slate-600">${card[1]}</p><button class="mt-5 text-sm font-extrabold text-brand-blue" data-nav="browse">Lihat Barang</button></article>`).join("")}</div>`)}</section>

      ${sectionHeader("Paket Hemat untuk Kebutuhan Mahasiswa", "Pilih paket sesuai kebutuhan agar lebih praktis dan hemat.")}
      <section class="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8"><div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">${bundles.map(bundle => `<article class="card p-5"><span class="badge bg-amber-50 text-amber-700">Hemat</span><h3 class="mt-4 text-lg font-extrabold text-slate-950">${bundle[0]}</h3><p class="mt-2 text-sm leading-6 text-slate-500">${bundle[1]}</p><p class="mt-4 font-extrabold text-brand-blue">${bundle[2]}</p><button class="btn-secondary mt-5 w-full rounded-2xl px-4 py-3" data-nav="browse">Lihat Paket</button></article>`).join("")}</div></section>

      <section id="how-it-works" class="bg-white py-16">${sectionInner("Cara Pakai BarangBareng", "Pilih alur sesuai kebutuhanmu.", `<div class="mb-6 flex gap-2"><button class="badge bg-brand-blue text-white" data-work-tab="rent">Mau Sewa</button><button class="badge bg-slate-100 text-slate-600" data-work-tab="lend">Mau Sewakan</button></div><div id="work-steps" class="grid gap-4 md:grid-cols-5">${stepsHtml("rent")}</div>`)}</section>

      ${sectionHeader("Kenapa Harus BarangBareng?", "Platform dibuat untuk ritme mahasiswa: cepat, dekat, dan jelas.")}
      <section class="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8"><div class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">${[["Lebih Hemat untuk Mahasiswa", "Tidak perlu membeli barang mahal untuk kebutuhan sementara.", "piggy-bank"], ["Dekat dengan Kampus", "Cari barang berdasarkan kampus, area kos, dan lokasi COD terdekat.", "map-pin"], ["Pembayaran Aman", "DP dan transaksi tercatat dengan jelas di sistem BarangBareng.", "shield-check"], ["QR Serah Terima", "Proses COD lebih rapi karena serah terima barang dicatat melalui QR.", "qr-code"]].map(item => `<article class="card p-6"><span class="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-brand-blue">${icon(item[2])}</span><h3 class="mt-5 text-lg font-extrabold">${item[0]}</h3><p class="mt-2 text-sm leading-6 text-slate-500">${item[1]}</p></article>`).join("")}</div></section>

      <section class="bg-white py-16">${sectionInner("Cari Barang di Sekitar Kampusmu", "Temukan barang dari mahasiswa di kampus dan area kos terdekat.", `<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">${campuses.map(campus => `<article class="card p-5"><h3 class="font-extrabold text-slate-950">${campus[0]}</h3><p class="mt-2 text-sm text-slate-500">${campus[1]}</p><p class="mt-4 font-bold text-brand-blue">${campus[2]}</p><button class="btn-secondary mt-5 rounded-2xl px-4 py-3" data-campus="${campus[0]}">Lihat Barang</button></article>`).join("")}</div>`)}</section>

      <section id="pinjam-gratis" class="bg-teal-50 py-16">${sectionInner("Butuh Barang Sementara? Cek Pinjam Gratis", "Beberapa barang bisa dipinjam tanpa biaya sewa, hanya dikenakan biaya layanan.", `<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">${freeItems.map(item => `<article class="overflow-hidden rounded-[24px] bg-white shadow-card"><img src="${item[1]}" alt="${item[0]}" class="h-36 w-full object-cover"><div class="p-5"><h3 class="font-extrabold">${item[0]}</h3><p class="mt-2 text-sm text-slate-500">Gratis - biaya layanan Rp5.000</p><span class="badge mt-4 bg-teal-50 text-teal-700">Pinjam Gratis</span></div></article>`).join("")}</div><button class="btn-primary mt-8 rounded-2xl px-6 py-3" data-free-browse>Lihat Semua Pinjam Gratis</button>`)}</section>

      <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div class="overflow-hidden rounded-[36px] bg-gradient-to-br from-blue-600 to-teal-500 p-8 text-white shadow-blue lg:p-10"><div class="grid gap-8 lg:grid-cols-[1fr_.9fr] lg:items-center"><div><span class="badge bg-white/15 text-white">Untuk pemilik barang</span><h2 class="mt-4 text-3xl font-extrabold lg:text-5xl">Barangmu Nganggur? Jadikan Penghasilan.</h2><p class="mt-4 max-w-2xl text-white/85">Laptop, kamera, jas, rice cooker, atau alat event yang jarang dipakai bisa jadi sumber penghasilan tambahan.</p><div class="mt-7 flex flex-col gap-3 sm:flex-row"><button class="rounded-2xl bg-white px-6 py-3 font-extrabold text-brand-blue" data-nav="upload-product">Mulai Sewakan Barang</button><button class="rounded-2xl border border-white/40 px-6 py-3 font-extrabold text-white" data-scroll-target="how-it-works">Lihat Cara Kerja</button></div></div><div class="grid gap-3 sm:grid-cols-2">${[["Laptop", "Rp300rb-700rb/bulan"], ["Kamera", "Rp500rb-1jt/bulan"], ["Jas formal", "Rp150rb-400rb/bulan"], ["Speaker", "Rp200rb-600rb/bulan"]].map(item => `<div class="rounded-3xl bg-white/15 p-5 backdrop-blur"><p class="text-sm text-white/75">${item[0]}</p><strong class="mt-1 block text-xl">${item[1]}</strong></div>`).join("")}</div></div></div></section>

      <section id="faq" class="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">${sectionTitle("FAQ Singkat", "Pertanyaan yang paling sering muncul dari pengguna baru.")}<div class="mt-8 grid gap-3">${faq.map((item, index) => `<article class="card overflow-hidden"><button class="flex w-full items-center justify-between gap-4 p-5 text-left font-extrabold text-slate-950" data-faq="${index}">${item[0]}${icon("chevron-down", "h-5 w-5 text-slate-400")}</button><div class="hidden px-5 pb-5 text-sm leading-6 text-slate-600" data-faq-panel="${index}">${item[1]}</div></article>`).join("")}</div></section>
    `;
    bindHomepage();
    if (window.lucide) lucide.createIcons();
    animations.refresh();
  }

  function sectionTitle(title, subtitle) {
    return `<div class="mx-auto mb-8 max-w-3xl text-center"><p class="font-bold text-brand-blue">BarangBareng</p><h2 class="mt-2 text-3xl font-extrabold text-slate-950 lg:text-4xl">${title}</h2><p class="mt-3 text-slate-500">${subtitle}</p></div>`;
  }

  function sectionHeader(title, subtitle) {
    return `<section class="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">${sectionTitle(title, subtitle)}</section>`;
  }

  function sectionInner(title, subtitle, body) {
    return `<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">${sectionTitle(title, subtitle)}${body}</div>`;
  }

  function stepsHtml(type) {
    const steps = type === "lend" ? ["Upload barang", "Terima request", "Atur jadwal COD", "Serah terima barang", "Dapat penghasilan"] : ["Cari barang", "Pilih tanggal", "Bayar DP", "COD dan gunakan barang", "Kembalikan barang"];
    return steps.map((step, index) => `<article class="card p-5"><span class="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-brand font-extrabold text-white">0${index + 1}</span><h3 class="mt-4 font-extrabold">${step}</h3><p class="mt-2 text-sm text-slate-500">Alur singkat, jelas, dan tetap di tab yang sama.</p></article>`).join("");
  }

  function bindHomepage() {
    components.bindNavEvents();
    document.querySelector("#home-search-btn")?.addEventListener("click", () => {
      state.filters.query = document.querySelector("#home-search")?.value || "";
      state.filters.category = document.querySelector("#home-category")?.value || "all";
      state.filters.campus = document.querySelector("#home-campus")?.value || "all";
      router.navigate("browse");
    });
    document.querySelectorAll("[data-home-category]").forEach(button => button.addEventListener("click", () => {
      state.filters.category = button.dataset.homeCategory.replace("Kamera, Konten & Media Sosial", "Kamera, Konten & Media").replace("Fashion Formal & Acara Kampus", "Fashion Formal & Acara");
      router.navigate("browse");
    }));
    document.querySelectorAll("[data-campus]").forEach(button => button.addEventListener("click", () => {
      state.filters.campus = button.dataset.campus;
      router.navigate("browse");
    }));
    document.querySelector("[data-free-browse]")?.addEventListener("click", () => {
      state.filters.category = "Pinjam Gratis";
      state.filters.quickFilter = "free";
      router.navigate("browse");
    });
    document.querySelectorAll("[data-work-tab]").forEach(button => button.addEventListener("click", () => {
      document.querySelectorAll("[data-work-tab]").forEach(tab => tab.className = "badge bg-slate-100 text-slate-600");
      button.className = "badge bg-brand-blue text-white";
      document.querySelector("#work-steps").innerHTML = stepsHtml(button.dataset.workTab);
      if (window.lucide) lucide.createIcons();
    }));
    document.querySelectorAll("[data-faq]").forEach(button => button.addEventListener("click", () => {
      const panel = document.querySelector(`[data-faq-panel="${button.dataset.faq}"]`);
      panel?.classList.toggle("hidden");
    }));
    document.querySelectorAll("[data-scroll-target]").forEach(button => button.addEventListener("click", () => {
      document.getElementById(button.dataset.scrollTarget)?.scrollIntoView({ behavior: "smooth" });
    }));
  }

  components.renderHome = renderHome;
})();
