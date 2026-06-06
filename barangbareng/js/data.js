(function () {
  const images = {
    laptop: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
    mac: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    ipad: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80",
    printer: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=900&q=80",
    projector: "https://images.unsplash.com/photo-1601944179066-29786cb9d32a?auto=format&fit=crop&w=900&q=80",
    powerbank: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=80",
    hdmi: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
    canon: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=80",
    sony: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
    gopro: "https://images.unsplash.com/photo-1523395243481-163f8f6155eb?auto=format&fit=crop&w=900&q=80",
    tripod: "https://images.unsplash.com/photo-1500634245200-e5245c7574ef?auto=format&fit=crop&w=900&q=80",
    ring: "https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?auto=format&fit=crop&w=900&q=80",
    mic: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=80",
    calculator: "https://images.unsplash.com/photo-1564473185935-58113cba1e80?auto=format&fit=crop&w=900&q=80",
    tablet: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=900&q=80",
    pointer: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80",
    hdd: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=900&q=80",
    desk: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80",
    fan: "https://images.unsplash.com/photo-1624969862644-791f3dc98927?auto=format&fit=crop&w=900&q=80",
    rack: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=900&q=80",
    mirror: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80",
    cooker: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?auto=format&fit=crop&w=900&q=80",
    stove: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80",
    pan: "https://images.unsplash.com/photo-1592156328697-079f6ee0cfa5?auto=format&fit=crop&w=900&q=80",
    blender: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=900&q=80",
    iron: "https://images.unsplash.com/photo-1603816245457-fe9c80b740ff?auto=format&fit=crop&w=900&q=80",
    steamer: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?auto=format&fit=crop&w=900&q=80",
    vacuum: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
    hanger: "https://images.unsplash.com/photo-1562158070-622a77941113?auto=format&fit=crop&w=900&q=80",
    suit: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80",
    blazer: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=900&q=80",
    kebaya: "https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=900&q=80",
    toga: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80",
    walkie: "https://images.unsplash.com/photo-1574482620826-40685ca5ebd2?auto=format&fit=crop&w=900&q=80",
    speaker: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80",
    tent: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80",
    sleeping: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=900&q=80",
    umbrella: "https://images.unsplash.com/photo-1524901548305-08eeddc35080?auto=format&fit=crop&w=900&q=80"
  };

  const categories = [
    { id: 1, name: "Elektronik & Produktivitas", icon: "laptop", count: 847, color: "from-blue-600 to-cyan-500", examples: "Laptop, iPad, Proyektor" },
    { id: 2, name: "Kamera, Konten & Media", icon: "camera", count: 312, color: "from-cyan-500 to-teal-500", examples: "Kamera, Ring Light, Tripod" },
    { id: 3, name: "Peralatan Kuliah & Akademik", icon: "book-open", count: 189, color: "from-amber-500 to-orange-500", examples: "Kalkulator, Drawing Tablet" },
    { id: 4, name: "Kamar Kos & Daily Living", icon: "home", count: 423, color: "from-green-500 to-emerald-600", examples: "Meja Lipat, Kipas Angin" },
    { id: 5, name: "Masak & Makan Anak Kos", icon: "utensils", count: 234, color: "from-orange-500 to-rose-500", examples: "Rice Cooker, Kompor Listrik" },
    { id: 6, name: "Kebersihan & Laundry", icon: "sparkles", count: 167, color: "from-teal-500 to-blue-500", examples: "Setrika, Steamer, Vacuum" },
    { id: 7, name: "Fashion Formal & Acara", icon: "shirt", count: 256, color: "from-purple-500 to-violet-600", examples: "Jas, Blazer, Toga" },
    { id: 8, name: "Event, Organisasi & Kepanitiaan", icon: "calendar", count: 134, color: "from-pink-500 to-rose-600", examples: "Speaker, HT, Mic Wireless" },
    { id: 9, name: "Outdoor, Travel & Healing", icon: "tent", count: 198, color: "from-emerald-500 to-green-700", examples: "Tenda, Sleeping Bag" },
    { id: 10, name: "Kesehatan & Darurat", icon: "heart-pulse", count: 89, color: "from-red-500 to-amber-500", examples: "Termometer, P3K" },
    { id: 11, name: "Beauty & Self-Care", icon: "smile", count: 112, color: "from-rose-500 to-fuchsia-600", examples: "Hair Dryer, Catokan" },
    { id: 12, name: "Pinjam Gratis", icon: "gift", count: 156, color: "from-teal-500 to-emerald-600", examples: "Mukena, Payung, Charger" }
  ];

  const campuses = ["Universitas Indonesia", "Universitas Bakrie", "BINUS University", "Trisakti", "Gunadarma", "Universitas Pancasila", "UPN Veteran Jakarta", "Universitas Negeri Jakarta"];
  const codLocations = ["Gerbang kampus utama", "Perpustakaan pusat", "Kantin lantai 1", "Lobby gedung", "Stasiun terdekat", "Kos area sekitar kampus", "Plaza Festival", "Stasiun Manggarai"];
  const bundles = ["Paket Anak Kos Baru", "Paket Sidang", "Paket Presentasi", "Paket Konten", "Paket Camping", "Paket Event Kampus", "Paket Masak Hemat", "Paket Laundry Kos"];
  const vouchers = [
    { code: "HEMATMAHASISWA", discount: 5000, type: "flat", label: "Potongan Rp5.000", minOrder: 20000 },
    { code: "KOSHEMAT", discount: 2500, type: "flat", label: "Gratis biaya transaksi", minOrder: 15000 },
    { code: "SIDANGREADY", discount: 10, type: "percent", label: "Diskon 10% sewa formal", minOrder: 30000 },
    { code: "BARANGPERTAMA", discount: 7500, type: "flat", label: "Potongan pertama Rp7.500", minOrder: 25000 }
  ];

  const seeds = [
    ["Laptop ASUS VivoBook", "Elektronik & Produktivitas", "Laptop", 25000, "sewa", "Margonda, Depok", "Universitas Indonesia", images.laptop, "Rizky Aulia", "RA", "gold", ["Banyak Dicari", "Budget Friendly"]],
    ["MacBook Air M1", "Elektronik & Produktivitas", "Laptop Premium", 65000, "sewa", "Kemanggisan, Jakarta Barat", "BINUS University", images.mac, "Nabila Sari", "NS", "gold", ["Premium", "Top Rated"]],
    ["iPad 9th Gen", "Elektronik & Produktivitas", "Tablet", 35000, "sewa", "Rawamangun, Jakarta Timur", "Universitas Negeri Jakarta", images.ipad, "Farhan Maulana", "FM", "silver", ["Terdekat"]],
    ["Printer Canon Pixma", "Elektronik & Produktivitas", "Printer", 22000, "sewa", "Lenteng Agung", "Universitas Pancasila", images.printer, "Dewi Lestari", "DL", "silver", ["Cocok untuk Sidang"]],
    ["Proyektor Mini", "Elektronik & Produktivitas", "Proyektor", 40000, "sewa", "Kuningan, Jakarta Selatan", "Universitas Bakrie", images.projector, "Arga Tama", "AT", "gold", ["Event Ready"]],
    ["Powerbank 20.000 mAh", "Elektronik & Produktivitas", "Powerbank", 12000, "sewa", "Grogol, Jakarta Barat", "Trisakti", images.powerbank, "Kevin Putra", "KP", "bronze", ["Budget Friendly"]],
    ["Kabel HDMI / Converter Type-C", "Elektronik & Produktivitas", "Kabel & Converter", 8000, "sewa", "Pondok Cina", "Gunadarma", images.hdmi, "Tasya Nabila", "TN", "silver", ["Budget Friendly"]],
    ["Kamera Canon EOS M50", "Kamera, Konten & Media", "Kamera Mirrorless", 55000, "sewa", "Kuningan, Jakarta Selatan", "Universitas Bakrie", images.canon, "Anisa Dewi", "AD", "gold", ["Top Rated", "Konten Ready"]],
    ["Sony A6000", "Kamera, Konten & Media", "Kamera Mirrorless", 50000, "sewa", "Depok Town Square", "Universitas Indonesia", images.sony, "Maya Putri", "MP", "gold", ["Banyak Dicari"]],
    ["GoPro Hero 11", "Kamera, Konten & Media", "Action Cam", 45000, "sewa", "Kalimalang, Bekasi", "Gunadarma", images.gopro, "Rio Aditya", "RA", "silver", ["Outdoor Ready"]],
    ["Tripod Kamera", "Kamera, Konten & Media", "Tripod", 15000, "sewa", "Sudirman, Jakarta", "Universitas Bakrie", images.tripod, "Salma Rahma", "SR", "silver", ["Event Ready"]],
    ["Ring Light", "Kamera, Konten & Media", "Lighting", 18000, "sewa", "Cawang, Jakarta Timur", "UPN Veteran Jakarta", images.ring, "Laras Ayu", "LA", "silver", ["Konten Ready"]],
    ["Mic Clip-on Wireless", "Kamera, Konten & Media", "Microphone", 22000, "sewa", "Rawamangun, Jakarta Timur", "Universitas Negeri Jakarta", images.mic, "Bima Arya", "BA", "gold", ["Konten Ready"]],
    ["Kalkulator Scientific Casio", "Peralatan Kuliah & Akademik", "Kalkulator", 8000, "sewa", "Margonda, Depok", "Universitas Indonesia", images.calculator, "Fina Zahra", "FZ", "silver", ["Budget Friendly"]],
    ["Drawing Tablet Wacom", "Peralatan Kuliah & Akademik", "Drawing Tablet", 30000, "sewa", "Kemanggisan", "BINUS University", images.tablet, "Hana Pratiwi", "HP", "silver", ["Design Ready"]],
    ["Pointer Presentasi", "Peralatan Kuliah & Akademik", "Presenter", 10000, "sewa", "Grogol", "Trisakti", images.pointer, "Reno Satria", "RS", "bronze", ["Cocok untuk Sidang"]],
    ["Hard Disk Eksternal", "Peralatan Kuliah & Akademik", "Storage", 20000, "sewa", "Pondok Cina", "Gunadarma", images.hdd, "Tasya Nabila", "TN", "silver", ["Terdekat"]],
    ["Meja Lipat Anak Kos", "Kamar Kos & Daily Living", "Meja", 15000, "sewa", "Kukusan, Depok", "Universitas Indonesia", images.desk, "Dimas Prakoso", "DP", "silver", ["Cocok untuk Anak Kos"]],
    ["Kipas Angin Portable", "Kamar Kos & Daily Living", "Kipas", 12000, "sewa", "Cawang", "UPN Veteran Jakarta", images.fan, "Nia Amalia", "NA", "silver", ["Cocok untuk Anak Kos"]],
    ["Rak Susun Portable", "Kamar Kos & Daily Living", "Rak", 13000, "sewa", "Rawamangun", "Universitas Negeri Jakarta", images.rack, "Raka Wijaya", "RW", "bronze", ["Cocok untuk Anak Kos"]],
    ["Cermin Full Body", "Kamar Kos & Daily Living", "Cermin", 16000, "sewa", "Kemanggisan", "BINUS University", images.mirror, "Mira Kartika", "MK", "silver", ["Terdekat"]],
    ["Rice Cooker Mini", "Masak & Makan Anak Kos", "Rice Cooker", 14000, "sewa", "Kukusan, Depok", "Universitas Indonesia", images.cooker, "Alya Putri", "AP", "gold", ["Cocok untuk Anak Kos"]],
    ["Kompor Listrik", "Masak & Makan Anak Kos", "Kompor", 18000, "sewa", "Lenteng Agung", "Universitas Pancasila", images.stove, "Galih Ramadhan", "GR", "silver", ["KOSHEMAT"]],
    ["Teflon Mini", "Masak & Makan Anak Kos", "Teflon", 8000, "sewa", "Grogol", "Trisakti", images.pan, "Vina Septi", "VS", "bronze", ["Budget Friendly"]],
    ["Blender Mini", "Masak & Makan Anak Kos", "Blender", 15000, "sewa", "Kalimalang", "Gunadarma", images.blender, "Tio Nugraha", "TN", "silver", ["Cocok untuk Anak Kos"]],
    ["Setrika Philips", "Kebersihan & Laundry", "Setrika", 10000, "sewa", "Rawamangun", "Universitas Negeri Jakarta", images.iron, "Salsa Fitri", "SF", "silver", ["Budget Friendly"]],
    ["Steamer Baju", "Kebersihan & Laundry", "Steamer", 18000, "sewa", "Kuningan", "Universitas Bakrie", images.steamer, "Yudha Pratama", "YP", "silver", ["Cocok untuk Sidang"]],
    ["Vacuum Cleaner Mini", "Kebersihan & Laundry", "Vacuum", 17000, "sewa", "Depok", "Universitas Indonesia", images.vacuum, "Reza Fahmi", "RF", "bronze", ["Cocok untuk Anak Kos"]],
    ["Jemuran Lipat", "Kebersihan & Laundry", "Jemuran", 9000, "sewa", "Cawang", "UPN Veteran Jakarta", images.hanger, "Icha Laras", "IL", "bronze", ["Budget Friendly"]],
    ["Jas Pria Formal", "Fashion Formal & Acara", "Jas", 35000, "sewa", "Margonda, Depok", "Universitas Indonesia", images.suit, "Bagas Putra", "BP", "gold", ["Cocok untuk Sidang"]],
    ["Blazer Wanita", "Fashion Formal & Acara", "Blazer", 32000, "sewa", "Kuningan", "Universitas Bakrie", images.blazer, "Aurel Kirana", "AK", "gold", ["Cocok untuk Sidang"]],
    ["Kebaya Modern", "Fashion Formal & Acara", "Kebaya", 45000, "sewa", "Rawamangun", "Universitas Negeri Jakarta", images.kebaya, "Citra Maharani", "CM", "gold", ["Premium"]],
    ["Toga Wisuda", "Fashion Formal & Acara", "Toga", 30000, "sewa", "Depok", "Universitas Indonesia", images.toga, "Fajar Nugroho", "FN", "silver", ["Cocok untuk Sidang"]],
    ["HT Walkie Talkie", "Event, Organisasi & Kepanitiaan", "HT", 22000, "sewa", "Kuningan", "Universitas Bakrie", images.walkie, "Nando Pratama", "NP", "silver", ["Event Ready"]],
    ["Speaker JBL", "Event, Organisasi & Kepanitiaan", "Speaker", 38000, "sewa", "Kemanggisan", "BINUS University", images.speaker, "Dara Lestari", "DL", "gold", ["Event Ready"]],
    ["Tenda Camping", "Outdoor, Travel & Healing", "Tenda", 50000, "sewa", "Depok", "Gunadarma", images.tent, "Yoga Saputra", "YS", "gold", ["Outdoor Ready"]],
    ["Sleeping Bag", "Outdoor, Travel & Healing", "Sleeping Bag", 18000, "sewa", "Lenteng Agung", "Universitas Pancasila", images.sleeping, "Rani Olivia", "RO", "silver", ["Budget Friendly"]],
    ["Payung Kampus", "Pinjam Gratis", "Payung", 0, "pinjam", "Gerbang UI", "Universitas Indonesia", images.umbrella, "Komunitas BB", "BB", "gold", ["Pinjam Gratis"]]
  ];

  const products = seeds.map((seed, index) => ({
    id: index + 1,
    name: seed[0],
    category: seed[1],
    subcategory: seed[2],
    price: seed[3],
    buyPrice: seed[3] * 220,
    type: seed[4],
    minDays: 1,
    maxDays: index % 3 === 0 ? 14 : 7,
    rating: Number((4.5 + (index % 5) / 10).toFixed(1)),
    reviewCount: 18 + index * 2,
    rentedCount: 45 + index * 4,
    condition: 88 + (index % 10),
    location: seed[5],
    campus: seed[6],
    image: seed[7],
    gallery: [seed[7], images.laptop, images.canon, images.desk],
    owner: { name: seed[8], initials: seed[9], level: seed[10], rating: 4.7 + (index % 3) / 10, txCount: 40 + index * 5, verified: true },
    status: index % 13 === 0 ? "low" : "available",
    badges: seed[11],
    description: `${seed[0]} siap dipakai untuk kebutuhan kuliah, kos, event kampus, dan aktivitas harian. Kondisi dicek sebelum serah terima.`,
    includes: ["Unit utama", "Tas atau box penyimpanan", "Panduan singkat", "Bukti kondisi awal"],
    notes: "Gunakan dengan hati-hati. COD disepakati bersama di area kampus atau kos terdekat.",
    reviews: [
      { name: "Difa S.", initials: "DS", rating: 5, date: "2 hari lalu", text: "Barang bersih, pemilik responsif, proses COD gampang." },
      { name: "Maya P.", initials: "MP", rating: 4.8, date: "1 minggu lalu", text: "Sesuai foto dan deskripsi. Recommended untuk mahasiswa." }
    ]
  }));

  window.BBData = { images, products, categories, campuses, codLocations, bundles, vouchers };
})();
