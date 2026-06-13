(function () {
  const img = query => `https://source.unsplash.com/900x650/?${encodeURIComponent(query)}`;
  const images = {
    laptop: img("student laptop desk"), mac: img("macbook student"), ipad: img("ipad tablet study"), printer: img("portable printer"), projector: img("projector classroom"), screen: img("projector screen"), speaker: img("portable speaker event"), mic: img("wireless microphone"), hdmi: img("hdmi cable"), pointer: img("presentation pointer"), calculator: img("scientific calculator"), webcam: img("webcam laptop"), scanner: img("portable scanner"), hdd: img("external hard drive"), canon: img("canon mirrorless camera"), sony: img("sony camera"), gopro: img("gopro action camera"), tripod: img("camera tripod"), ring: img("ring light"), softbox: img("softbox lighting"), gimbal: img("camera gimbal"), clipmic: img("clip on microphone"), greenscreen: img("green screen studio"), backdrop: img("photo backdrop"), cooker: img("mini rice cooker"), iron: img("portable iron"), fan: img("portable fan"), desk: img("folding study table"), mattress: img("folding mattress"), drying: img("folding drying rack"), stove: img("electric portable stove"), pan: img("electric cooking pot"), lamp: img("study lamp"), cable: img("extension cord"), vacuum: img("mini vacuum cleaner"), shoeRack: img("portable shoe rack"), suit: img("formal suit"), blazer: img("women formal blazer"), kebaya: img("graduation kebaya"), shirt: img("white shirt formal"), skirt: img("black formal skirt"), pants: img("black formal pants"), pantofel: img("formal shoes"), heels: img("formal heels"), toga: img("graduation gown"), sash: img("graduation sash"), bouquet: img("graduation bouquet"), steamer: img("garment steamer"), walkie: img("walkie talkie"), tentEvent: img("event tent canopy"), megaphone: img("megaphone"), rollBanner: img("roll up banner stand"), whiteboard: img("portable whiteboard"), tablet: img("tablet attendance"), qrscanner: img("qr barcode scanner"), clipboard: img("clipboard event"), lanyard: img("lanyard event"), tent: img("camping tent"), sleeping: img("sleeping bag"), matras: img("camping mat"), carrier: img("carrier backpack"), headlamp: img("headlamp camping"), cooler: img("cooler box"), chair: img("folding camping chair"), flysheet: img("camping tarp")
  };

  const categories = [
    { id: 1, name: "Anak Kos & Perantau", image: images.cooker, count: 520, color: "from-emerald-500 to-teal-600", examples: "Rice cooker, setrika, meja lipat" },
    { id: 2, name: "Sidang & Wisuda", image: images.toga, count: 310, color: "from-blue-600 to-indigo-500", examples: "Jas, kebaya, toga" },
    { id: 3, name: "Event Kampus", image: images.projector, count: 420, color: "from-cyan-500 to-blue-600", examples: "Proyektor, speaker, mic" },
    { id: 4, name: "Organisasi Mahasiswa", image: images.walkie, count: 280, color: "from-violet-500 to-blue-600", examples: "HT, banner, megaphone" },
    { id: 5, name: "Akademik & Presentasi", image: images.laptop, count: 460, color: "from-amber-500 to-yellow-500", examples: "Laptop, tablet, kalkulator" },
    { id: 6, name: "Dokumentasi & Konten", image: images.canon, count: 360, color: "from-teal-500 to-cyan-600", examples: "Kamera, tripod, lighting" },
    { id: 7, name: "Outdoor Mahasiswa", image: images.tent, count: 190, color: "from-green-600 to-emerald-700", examples: "Tenda, sleeping bag, carrier" }
  ];

  const campuses = ["Universitas Bakrie", "Universitas Indonesia", "BINUS University", "Universitas Trisakti", "Universitas Gunadarma", "Universitas Negeri Jakarta", "UPN Veteran Jakarta", "Universitas Pancasila"];
  const codLocations = ["Gerbang kampus utama", "Perpustakaan pusat", "Kantin lantai 1", "Lobby gedung", "Stasiun terdekat", "Kos area sekitar kampus", "Aula kampus", "Sekretariat organisasi"];
  const bundles = ["Paket Anak Kos Baru", "Paket Sidang", "Paket Wisuda", "Paket Presentasi", "Paket Dokumentasi Event", "Paket Kepanitiaan", "Paket Camping Makrab", "Paket Konten Kampus"];
  const vouchers = [
    { code: "HEMATMAHASISWA", discount: 5000, type: "flat", label: "Potongan Rp5.000", minOrder: 20000 },
    { code: "KOSHEMAT", discount: 2500, type: "flat", label: "Gratis biaya transaksi", minOrder: 15000 },
    { code: "SIDANGREADY", discount: 10, type: "percent", label: "Diskon 10% sewa formal", minOrder: 30000 },
    { code: "EVENTKAMPUS", discount: 7500, type: "flat", label: "Potongan event kampus", minOrder: 50000 }
  ];

  const owners = [
    ["Difa Surya", "DS", "gold"], ["Naura Latifa", "NL", "bronze"], ["Rizky Aulia", "RA", "gold"], ["Maya Putri", "MP", "silver"], ["Bagas Putra", "BP", "gold"], ["Anisa Dewi", "AD", "gold"], ["Nabila Sari", "NS", "silver"], ["Farhan Maulana", "FM", "silver"]
  ];
  const places = [
    ["Kuningan, Jakarta Selatan", "Universitas Bakrie"], ["Margonda, Depok", "Universitas Indonesia"], ["Kemanggisan, Jakarta Barat", "BINUS University"], ["Grogol, Jakarta Barat", "Universitas Trisakti"], ["Pondok Cina, Depok", "Universitas Gunadarma"], ["Rawamangun, Jakarta Timur", "Universitas Negeri Jakarta"], ["Pondok Labu, Jakarta Selatan", "UPN Veteran Jakarta"], ["Lenteng Agung, Jakarta Selatan", "Universitas Pancasila"]
  ];

  const productSeeds = [
    ["Rice Cooker Mini", "Anak Kos & Perantau", "Alat Masak Kos", 14000, "sewa", images.cooker, ["Cocok Anak Kos", "Tersedia"], "Cocok untuk anak kos yang butuh alat masak praktis selama tinggal di perantauan.", ["anak kos", "perantau", "masak", "rice cooker"]],
    ["Setrika Portable", "Anak Kos & Perantau", "Laundry Kos", 10000, "sewa", images.iron, ["Cocok Anak Kos"], "Cocok untuk merapikan kemeja kuliah, outfit sidang, dan pakaian harian anak kos.", ["anak kos", "laundry", "sidang"]],
    ["Kipas Angin Portable", "Anak Kos & Perantau", "Kamar Kos", 12000, "sewa", images.fan, ["Cocok Anak Kos"], "Cocok untuk kamar kos yang panas atau kebutuhan sementara saat pindah kos.", ["anak kos", "perantau", "kamar kos"]],
    ["Meja Lipat Belajar", "Anak Kos & Perantau", "Meja Belajar", 15000, "sewa", images.desk, ["Cocok Anak Kos"], "Cocok untuk belajar, mengerjakan tugas, dan setup laptop di kamar kos kecil.", ["anak kos", "belajar", "akademik"]],
    ["Kasur Lipat", "Anak Kos & Perantau", "Kamar Kos", 22000, "sewa", images.mattress, ["Cocok Anak Kos"], "Cocok untuk mahasiswa perantau, tamu kos, atau kebutuhan tidur sementara saat pindahan.", ["anak kos", "perantau", "kasur"]],
    ["Jemuran Lipat", "Anak Kos & Perantau", "Laundry Kos", 9000, "sewa", images.drying, ["Cocok Anak Kos"], "Cocok untuk menjemur pakaian di kos dengan ruang terbatas.", ["anak kos", "laundry", "jemuran"]],
    ["Kompor Listrik Portable", "Anak Kos & Perantau", "Alat Masak Kos", 18000, "sewa", images.stove, ["Cocok Anak Kos"], "Cocok untuk masak hemat di kos tanpa perlu membeli kompor baru.", ["anak kos", "masak", "perantau"]],
    ["Panci Listrik Mini", "Anak Kos & Perantau", "Alat Masak Kos", 13000, "sewa", images.pan, ["Cocok Anak Kos"], "Cocok untuk merebus mi, memasak lauk sederhana, dan kebutuhan makan anak kos.", ["anak kos", "masak", "panci"]],
    ["Lampu Belajar", "Anak Kos & Perantau", "Belajar", 8000, "pinjam", images.lamp, ["Pinjam Gratis", "Cocok Anak Kos"], "Cocok untuk belajar malam, mengerjakan tugas, atau persiapan ujian di kos.", ["anak kos", "belajar", "ujian"]],
    ["Kabel Roll", "Anak Kos & Perantau", "Kelistrikan", 10000, "sewa", images.cable, ["Cocok Anak Kos", "Event Ready"], "Cocok untuk kamar kos, presentasi kelompok, dan kebutuhan colokan tambahan saat event kecil.", ["anak kos", "event", "kabel"]],
    ["Vacuum Cleaner Mini", "Anak Kos & Perantau", "Kebersihan Kos", 17000, "sewa", images.vacuum, ["Cocok Anak Kos"], "Cocok untuk membersihkan kamar kos sebelum pindahan, tamu, atau inspeksi kamar.", ["anak kos", "kebersihan"]],
    ["Rak Sepatu Portable", "Anak Kos & Perantau", "Kamar Kos", 9000, "sewa", images.shoeRack, ["Cocok Anak Kos"], "Cocok untuk menata sepatu di kos sementara tanpa membeli rak baru.", ["anak kos", "rak", "perantau"]],

    ["Jas Formal Pria", "Sidang & Wisuda", "Pakaian Formal", 35000, "sewa", images.suit, ["Cocok Wisuda", "Cocok Sidang"], "Cocok untuk sidang akhir, seminar proposal, wawancara magang, dan acara formal kampus.", ["sidang", "wisuda", "formal", "jas"]],
    ["Blazer Formal Wanita", "Sidang & Wisuda", "Pakaian Formal", 32000, "sewa", images.blazer, ["Cocok Sidang"], "Cocok untuk sidang, presentasi akhir, interview magang, dan acara resmi kampus.", ["sidang", "formal", "blazer"]],
    ["Kebaya Wisuda", "Sidang & Wisuda", "Pakaian Wisuda", 45000, "sewa", images.kebaya, ["Cocok Wisuda", "Top Rated"], "Cocok untuk wisuda, yudisium, foto keluarga, dan acara kelulusan kampus.", ["wisuda", "kebaya", "yudisium"]],
    ["Kemeja Putih", "Sidang & Wisuda", "Pakaian Formal", 18000, "sewa", images.shirt, ["Cocok Sidang"], "Cocok untuk sidang, seminar proposal, praktikum formal, dan acara organisasi resmi.", ["sidang", "kemeja", "formal"]],
    ["Rok Hitam Formal", "Sidang & Wisuda", "Pakaian Formal", 18000, "sewa", images.skirt, ["Cocok Sidang"], "Cocok untuk sidang, wawancara, dan acara kampus yang membutuhkan dress code formal.", ["sidang", "formal", "rok"]],
    ["Celana Bahan Hitam", "Sidang & Wisuda", "Pakaian Formal", 18000, "sewa", images.pants, ["Cocok Sidang"], "Cocok untuk sidang akhir, seminar proposal, dan presentasi resmi di kampus.", ["sidang", "formal", "celana"]],
    ["Sepatu Pantofel", "Sidang & Wisuda", "Sepatu Formal", 25000, "sewa", images.pantofel, ["Cocok Wisuda"], "Cocok untuk sidang, wisuda, interview magang, dan acara formal organisasi.", ["sidang", "wisuda", "sepatu"]],
    ["Heels Formal", "Sidang & Wisuda", "Sepatu Formal", 25000, "sewa", images.heels, ["Cocok Wisuda"], "Cocok untuk wisuda, yudisium, sidang, dan foto formal kampus.", ["wisuda", "sidang", "heels"]],
    ["Toga Wisuda", "Sidang & Wisuda", "Perlengkapan Wisuda", 30000, "sewa", images.toga, ["Cocok Wisuda"], "Cocok untuk wisuda, foto studio, yudisium, dan dokumentasi kelulusan.", ["wisuda", "toga", "kelulusan"]],
    ["Selempang Wisuda", "Sidang & Wisuda", "Aksesori Wisuda", 12000, "sewa", images.sash, ["Cocok Wisuda"], "Cocok untuk foto wisuda, selebrasi kelulusan, dan hadiah teman kampus.", ["wisuda", "selempang"]],
    ["Buket Wisuda", "Sidang & Wisuda", "Aksesori Wisuda", 15000, "sewa", images.bouquet, ["Cocok Wisuda"], "Cocok untuk properti foto wisuda, yudisium, dan surprise kelulusan.", ["wisuda", "buket"]],
    ["Steamer Baju Portable", "Sidang & Wisuda", "Perawatan Pakaian", 18000, "sewa", images.steamer, ["Cocok Sidang", "Cocok Wisuda"], "Cocok untuk merapikan jas, kebaya, dan kemeja sebelum sidang atau wisuda.", ["sidang", "wisuda", "steamer"]],

    ["Proyektor", "Event Kampus", "Presentasi Event", 40000, "sewa", images.projector, ["Event Ready", "Top Rated"], "Cocok untuk seminar, workshop, kelas besar, lomba, dan presentasi organisasi kampus.", ["event", "proyektor", "seminar", "presentasi"]],
    ["Screen Proyektor", "Event Kampus", "Presentasi Event", 25000, "sewa", images.screen, ["Event Ready"], "Cocok untuk seminar, nobar kampus, workshop, dan presentasi acara organisasi.", ["event", "proyektor", "screen"]],
    ["Speaker Portable", "Event Kampus", "Audio Event", 38000, "sewa", images.speaker, ["Event Ready", "Top Rated"], "Cocok untuk seminar kecil, bazar, latihan UKM, dan gathering mahasiswa.", ["event", "speaker", "organisasi"]],
    ["Microphone Wireless", "Event Kampus", "Audio Event", 25000, "sewa", images.mic, ["Event Ready"], "Cocok untuk moderator seminar, MC lomba, workshop, dan acara organisasi.", ["event", "microphone", "mc"]],
    ["Tripod Kamera", "Event Kampus", "Dokumentasi Event", 15000, "sewa", images.tripod, ["Event Ready"], "Cocok untuk dokumentasi seminar, foto kepanitiaan, dan konten kegiatan kampus.", ["event", "dokumentasi", "tripod"]],
    ["Ring Light", "Event Kampus", "Lighting Event", 18000, "sewa", images.ring, ["Konten Ready"], "Cocok untuk booth dokumentasi, live streaming, tugas konten, dan video organisasi.", ["event", "konten", "lighting"]],
    ["Lighting Studio Mini", "Event Kampus", "Lighting Event", 30000, "sewa", images.softbox, ["Event Ready"], "Cocok untuk dokumentasi indoor, photoshoot UKM, dan video kampanye organisasi.", ["event", "konten", "lighting"]],
    ["Kamera DSLR", "Event Kampus", "Dokumentasi Event", 50000, "sewa", images.canon, ["Event Ready", "Top Rated"], "Cocok untuk dokumentasi seminar, lomba, kepanitiaan, dan acara kampus.", ["event", "kamera", "dokumentasi"]],
    ["HT / Walkie Talkie", "Event Kampus", "Koordinasi Event", 22000, "sewa", images.walkie, ["Event Ready", "Organisasi"], "Cocok untuk koordinasi panitia event kampus, makrab, lomba, dan kegiatan organisasi.", ["event", "organisasi", "ht", "walkie talkie"]],
    ["Tenda Lipat Event", "Event Kampus", "Perlengkapan Event", 70000, "sewa", images.tentEvent, ["Event Ready"], "Cocok untuk bazar kampus, booth UKM, pendaftaran acara, dan kegiatan outdoor kampus.", ["event", "tenda", "booth"]],

    ["Megaphone", "Organisasi Mahasiswa", "Koordinasi Panitia", 20000, "sewa", images.megaphone, ["Organisasi", "Event Ready"], "Cocok untuk briefing panitia, lomba kampus, aksi sosial, dan kegiatan lapangan organisasi.", ["organisasi", "event", "megaphone"]],
    ["Printer Portable", "Organisasi Mahasiswa", "Administrasi Event", 22000, "sewa", images.printer, ["Organisasi"], "Cocok untuk cetak rundown, surat panitia, label peserta, dan kebutuhan sekretariat event.", ["organisasi", "printer", "panitia"]],
    ["Roll Banner Stand", "Organisasi Mahasiswa", "Branding Event", 18000, "sewa", images.rollBanner, ["Organisasi", "Event Ready"], "Cocok untuk seminar, bazar, open recruitment, dan booth organisasi mahasiswa.", ["organisasi", "event", "banner"]],
    ["Papan Tulis Portable", "Organisasi Mahasiswa", "Meeting", 20000, "sewa", images.whiteboard, ["Organisasi"], "Cocok untuk rapat divisi, kelas tambahan, workshop, dan brainstorming kepanitiaan.", ["organisasi", "meeting", "whiteboard"]],
    ["Tablet Absensi", "Organisasi Mahasiswa", "Check-in Event", 30000, "sewa", images.tablet, ["Organisasi", "Event Ready"], "Cocok untuk absensi peserta, check-in seminar, dan registrasi event kampus.", ["organisasi", "absensi", "event"]],
    ["QR Scanner Event", "Organisasi Mahasiswa", "Check-in Event", 20000, "sewa", images.qrscanner, ["Organisasi", "Event Ready"], "Cocok untuk scan tiket, absensi QR, dan validasi peserta acara kampus.", ["organisasi", "qr", "event"]],
    ["Clipboard Panitia", "Organisasi Mahasiswa", "Administrasi Event", 5000, "pinjam", images.clipboard, ["Pinjam Gratis", "Organisasi"], "Cocok untuk panitia registrasi, lomba, survei lapangan, dan checklist acara.", ["organisasi", "panitia", "clipboard"]],
    ["Lanyard Event", "Organisasi Mahasiswa", "Atribut Panitia", 5000, "pinjam", images.lanyard, ["Pinjam Gratis", "Organisasi"], "Cocok untuk identitas panitia seminar, lomba, open recruitment, dan gathering UKM.", ["organisasi", "lanyard", "event"]],
    ["Laptop Presentasi", "Organisasi Mahasiswa", "Presentasi Event", 30000, "sewa", images.laptop, ["Organisasi", "Event Ready"], "Cocok untuk operator seminar, presentasi sponsor, dan kebutuhan kepanitiaan acara.", ["organisasi", "laptop", "presentasi"]],
    ["Kabel HDMI", "Organisasi Mahasiswa", "Kabel Presentasi", 8000, "pinjam", images.hdmi, ["Pinjam Gratis", "Event Ready"], "Cocok untuk sambungan proyektor saat presentasi kelas, seminar, dan rapat organisasi.", ["organisasi", "event", "hdmi", "presentasi"]],

    ["Laptop ASUS VivoBook", "Akademik & Presentasi", "Laptop", 25000, "sewa", images.laptop, ["Top Rated", "Budget Friendly"], "Cocok untuk tugas kuliah, presentasi, ujian online, dan kerja kelompok.", ["akademik", "presentasi", "laptop"]],
    ["MacBook Air M1", "Akademik & Presentasi", "Laptop", 65000, "sewa", images.mac, ["Top Rated"], "Cocok untuk editing tugas multimedia, presentasi final, dan produksi portofolio kampus.", ["akademik", "presentasi", "editing"]],
    ["iPad 9th Gen", "Akademik & Presentasi", "Tablet", 35000, "sewa", images.ipad, ["Akademik"], "Cocok untuk catatan digital, membaca jurnal, desain ringan, dan presentasi kelas.", ["akademik", "tablet", "presentasi"]],
    ["Stylus Pen", "Akademik & Presentasi", "Aksesori Tablet", 12000, "sewa", images.pointer, ["Akademik"], "Cocok untuk mencatat materi kuliah, membuat sketsa tugas, dan anotasi slide.", ["akademik", "stylus", "catatan"]],
    ["Calculator Scientific", "Akademik & Presentasi", "Kalkulator", 8000, "pinjam", images.calculator, ["Pinjam Gratis", "Akademik"], "Cocok untuk ujian, praktikum, statistik, akuntansi, dan tugas hitungan kampus.", ["akademik", "kalkulator", "ujian"]],
    ["Printer", "Akademik & Presentasi", "Printer", 22000, "sewa", images.printer, ["Akademik"], "Cocok untuk cetak tugas, proposal, berkas sidang, dan dokumen organisasi.", ["akademik", "printer", "sidang"]],
    ["Scanner Portable", "Akademik & Presentasi", "Scanner", 18000, "sewa", images.scanner, ["Akademik"], "Cocok untuk scan berkas beasiswa, dokumen sidang, dan arsip organisasi.", ["akademik", "scanner", "dokumen"]],
    ["Webcam", "Akademik & Presentasi", "Kelas Online", 16000, "sewa", images.webcam, ["Akademik"], "Cocok untuk kelas online, wawancara magang, webinar, dan sidang daring.", ["akademik", "webcam", "online"]],
    ["Pointer Presentasi", "Akademik & Presentasi", "Presenter", 10000, "sewa", images.pointer, ["Akademik", "Cocok Sidang"], "Cocok untuk presentasi kelas, seminar proposal, sidang, dan pitching organisasi.", ["akademik", "presentasi", "sidang"]],
    ["Hard Disk External", "Akademik & Presentasi", "Storage", 20000, "sewa", images.hdd, ["Akademik"], "Cocok untuk backup video tugas, file skripsi, dokumentasi event, dan portofolio.", ["akademik", "storage", "backup"]],

    ["Kamera Canon EOS M50", "Dokumentasi & Konten", "Kamera Mirrorless", 55000, "sewa", images.canon, ["Top Rated", "Konten Ready"], "Cocok untuk dokumentasi event kampus, sidang, wisuda, konten organisasi, dan tugas multimedia.", ["kamera", "konten", "event", "wisuda"]],
    ["Sony A6000", "Dokumentasi & Konten", "Kamera Mirrorless", 50000, "sewa", images.sony, ["Top Rated", "Konten Ready"], "Cocok untuk foto produk bazar, dokumentasi UKM, portofolio, dan konten kampus.", ["kamera", "konten", "dokumentasi"]],
    ["GoPro Hero", "Dokumentasi & Konten", "Action Cam", 45000, "sewa", images.gopro, ["Outdoor Ready"], "Cocok untuk dokumentasi makrab, kegiatan outdoor, vlog kampus, dan liputan UKM.", ["kamera", "outdoor", "konten"]],
    ["Stabilizer / Gimbal", "Dokumentasi & Konten", "Video Gear", 35000, "sewa", images.gimbal, ["Konten Ready"], "Cocok untuk video aftermovie event, konten organisasi, dan dokumentasi kegiatan kampus.", ["konten", "video", "event"]],
    ["Microphone Clip-on", "Dokumentasi & Konten", "Audio Konten", 22000, "sewa", images.clipmic, ["Konten Ready"], "Cocok untuk wawancara tugas, podcast kampus, video organisasi, dan liputan event.", ["konten", "audio", "podcast"]],
    ["Softbox Lighting", "Dokumentasi & Konten", "Lighting", 28000, "sewa", images.softbox, ["Konten Ready"], "Cocok untuk video tugas, photoshoot organisasi, konten produk bazar, dan studio kecil.", ["konten", "lighting", "foto"]],
    ["Green Screen Portable", "Dokumentasi & Konten", "Studio Portable", 25000, "sewa", images.greenscreen, ["Konten Ready"], "Cocok untuk video kreatif, presentasi multimedia, dan produksi konten kampus.", ["konten", "video", "green screen"]],
    ["Backdrop Foto", "Dokumentasi & Konten", "Foto Studio", 22000, "sewa", images.backdrop, ["Konten Ready"], "Cocok untuk foto wisuda, foto kepanitiaan, katalog bazar, dan konten organisasi.", ["konten", "foto", "wisuda"]],

    ["Tenda Camping", "Outdoor Mahasiswa", "Camping", 50000, "sewa", images.tent, ["Outdoor Ready"], "Cocok untuk makrab, camping UKM, kegiatan alam, dan healing bareng teman kampus.", ["outdoor", "camping", "makrab"]],
    ["Sleeping Bag", "Outdoor Mahasiswa", "Camping", 18000, "sewa", images.sleeping, ["Outdoor Ready"], "Cocok untuk camping, makrab, kegiatan alam, dan perjalanan organisasi kampus.", ["outdoor", "camping", "makrab"]],
    ["Matras Camping", "Outdoor Mahasiswa", "Camping", 12000, "sewa", images.matras, ["Outdoor Ready"], "Cocok untuk alas tidur saat camping, makrab, dan kegiatan outdoor mahasiswa.", ["outdoor", "camping", "matras"]],
    ["Carrier Bag", "Outdoor Mahasiswa", "Tas Outdoor", 30000, "sewa", images.carrier, ["Outdoor Ready"], "Cocok untuk perjalanan makrab, naik gunung, dan kegiatan lapangan organisasi.", ["outdoor", "carrier", "travel"]],
    ["Headlamp", "Outdoor Mahasiswa", "Penerangan Outdoor", 10000, "pinjam", images.headlamp, ["Pinjam Gratis", "Outdoor Ready"], "Cocok untuk camping, kegiatan malam, dan acara outdoor kampus.", ["outdoor", "headlamp", "camping"]],
    ["Cooler Box", "Outdoor Mahasiswa", "Perlengkapan Outdoor", 25000, "sewa", images.cooler, ["Outdoor Ready"], "Cocok untuk bazar makanan, piknik organisasi, makrab, dan kegiatan outdoor kampus.", ["outdoor", "event", "cooler"]]
  ];

  const products = productSeeds.map((seed, index) => {
    const owner = owners[index % owners.length];
    const place = places[index % places.length];
    const name = seed[0];
    const category = seed[1];
    const tags = seed[8];
    const rating = Number((4.5 + (index % 5) / 10).toFixed(1));
    return {
      id: index + 1,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      name,
      category,
      subcategory: seed[2],
      price: seed[3],
      pricePerDay: seed[3],
      buyPrice: Math.max(150000, seed[3] * 220),
      type: seed[4],
      minDays: 1,
      maxDays: category === "Outdoor Mahasiswa" ? 10 : 7,
      rating,
      reviewCount: 28 + index * 2,
      rentedCount: 52 + index * 3,
      condition: 88 + (index % 10),
      location: place[0],
      campus: place[1],
      image: seed[5],
      gallery: [seed[5], images.laptop, images.canon, images.cooker].filter(Boolean),
      owner: { name: owner[0], initials: owner[1], level: owner[2], rating: Number((4.6 + (index % 4) / 10).toFixed(1)), txCount: 35 + index * 4, verified: true },
      status: index % 17 === 0 ? "low" : "available",
      badges: seed[6],
      description: seed[7],
      tags,
      searchText: [name, category, seed[2], seed[7], ...tags, ...seed[6], place[0], place[1]].join(" ").toLowerCase(),
      includes: includedItems(seed[2], name),
      specifications: specifications(seed[2], name),
      notes: "Gunakan dengan hati-hati. COD disepakati bersama di area kampus, kos, atau titik temu yang aman.",
      rules: ["Gunakan sesuai kesepakatan", "Kembalikan tepat waktu", "Cek kondisi barang bersama saat serah terima"],
      reviews: [
        { name: "Difa S.", initials: "DS", rating: 5, date: "2 hari lalu", text: "Barang sesuai kebutuhan kampus dan proses COD rapi." },
        { name: "Maya P.", initials: "MP", rating: 4.8, date: "1 minggu lalu", text: "Pemilik responsif, cocok untuk kebutuhan mahasiswa." }
      ]
    };
  });

  function includedItems(subcategory, name) {
    if (/kamera|dslr|mirrorless/i.test(subcategory + name)) return ["Kamera", "Lensa", "Baterai", "Charger", "Tas kamera"];
    if (/proyektor/i.test(name)) return ["Proyektor", "Kabel HDMI", "Remote", "Tas penyimpanan"];
    if (/pakaian|formal|wisuda|sepatu/i.test(subcategory + name)) return ["Item utama", "Hanger", "Cover pakaian", "Bukti kondisi awal"];
    if (/camping|outdoor|tenda|sleeping|carrier/i.test(subcategory + name)) return ["Unit utama", "Tas penyimpanan", "Panduan lipat", "Bukti kondisi awal"];
    if (/audio|speaker|microphone|ht|walkie/i.test(subcategory + name)) return ["Unit utama", "Charger/baterai", "Kabel pendukung", "Panduan singkat"];
    return ["Unit utama", "Tas atau box penyimpanan", "Panduan singkat", "Bukti kondisi awal"];
  }

  function specifications(subcategory, name) {
    if (/laptop|macbook/i.test(name)) return ["Siap presentasi", "Baterai normal", "Charger tersedia", "Aplikasi dasar tersedia"];
    if (/kamera|dslr|mirrorless/i.test(subcategory + name)) return ["Foto dan video", "Lensa kit", "Baterai cadangan", "Memory card opsional"];
    if (/proyektor/i.test(name)) return ["HDMI input", "Cocok ruang kelas", "Remote tersedia", "Brightness event kampus"];
    if (/rice|kompor|panci/i.test(name)) return ["Ukuran anak kos", "Hemat tempat", "Mudah dibersihkan", "Siap pakai harian"];
    return ["Kondisi terawat", "Cocok kebutuhan kampus", "Mudah dibawa", "Siap COD sekitar kampus"];
  }

  window.BBData = { images, products, categories, campuses, codLocations, bundles, vouchers };
})();
