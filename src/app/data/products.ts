export type BadgeType = "Gold" | "Silver" | "Bronze";
export type Category =
  | "Semua"
  | "Kamera & Lensa"
  | "Konsol Game"
  | "Perlengkapan Outdoor"
  | "Pakaian Formal";

export interface Product {
  id: number;
  name: string;
  image: string;
  price: string;
  priceNum: number;
  owner: string;
  ownerInitial: string;
  badge: BadgeType;
  rating: number;
  reviews: number;
  category: Category[];
  tagline: string;
  description: string;
  specs: string[];
  condition: string;
}

export const badgeConfig: Record<BadgeType, { label: string; text: string; icon: string; bg: string }> = {
  Gold:   { label: "Penyewa Gold",   text: "text-amber-700",  icon: "🥇", bg: "bg-amber-50" },
  Silver: { label: "Penyewa Silver", text: "text-gray-600",   icon: "🥈", bg: "bg-gray-50" },
  Bronze: { label: "Penyewa Bronze", text: "text-orange-700", icon: "🥉", bg: "bg-orange-50" },
};

export const categories: Category[] = [
  "Semua",
  "Kamera & Lensa",
  "Konsol Game",
  "Perlengkapan Outdoor",
  "Pakaian Formal",
];

export const categoryEmoji: Record<Category, string> = {
  "Semua": "🔥",
  "Kamera & Lensa": "📸",
  "Konsol Game": "🎮",
  "Perlengkapan Outdoor": "🏕️",
  "Pakaian Formal": "👗",
};

export const products: Product[] = [
  {
    id: 1,
    name: "Sony A6400 Mirrorless Camera",
    image: "/dslr_camera.png",
    price: "Rp 85.000",
    priceNum: 85000,
    owner: "Andi Pratama",
    ownerInitial: "A",
    badge: "Gold",
    rating: 4.9,
    reviews: 128,
    category: ["Semua", "Kamera & Lensa"],
    tagline: "Kamera Mirrorless Andalan",
    description:
      "Abadikan momen terbaik dengan kamera mirrorless Sony A6400. Dilengkapi sensor 24.2MP, perekaman video 4K, dan layar flip yang ideal untuk vlog serta content creation. Kondisi sangat terawat dan siap pakai untuk berbagai acara. Pemilik telah terverifikasi sebagai Penyewa Gold dengan rating tertinggi.",
    specs: ["24.2MP APS-C Sensor", "4K Video Recording", "Real-time Eye AF", "Flip Screen Vlog-ready"],
    condition: "Seperti Baru — 9.5/10",
  },
  {
    id: 2,
    name: "PlayStation 5 + 2 Controller",
    image: "/ps5_console.png",
    price: "Rp 120.000",
    priceNum: 120000,
    owner: "Rizky Aditya",
    ownerInitial: "R",
    badge: "Gold",
    rating: 4.8,
    reviews: 95,
    category: ["Semua", "Konsol Game"],
    tagline: "Konsol Gaming Terkini",
    description:
      "Nikmati pengalaman gaming terbaik dengan PlayStation 5. Paket sudah termasuk 2 controller DualSense untuk bermain bersama teman. Performa ultra-cepat dengan SSD 825GB dan output visual 4K@120Hz. Cocok untuk acara kumpul akhir pekan atau sesi gaming marathon. Pemilik terverifikasi Gold Tier.",
    specs: ["825GB SSD", "4K@120Hz Output", "2x DualSense Controller", "Backward Compatible PS4"],
    condition: "Sangat Baik — 9/10",
  },
  {
    id: 3,
    name: "DJI Mini 3 Pro Drone",
    image: "/drone_camera.png",
    price: "Rp 150.000",
    priceNum: 150000,
    owner: "Doni Kurniawan",
    ownerInitial: "D",
    badge: "Silver",
    rating: 4.7,
    reviews: 42,
    category: ["Kamera & Lensa", "Perlengkapan Outdoor"],
    tagline: "Drone Ringan untuk Aerial Shot",
    description:
      "Hasilkan foto dan video udara berkualitas profesional dengan DJI Mini 3 Pro. Drone ultralight dengan berat hanya 249g ini mudah diterbangkan dan menghasilkan rekaman 4K/60fps yang memukau. Dilengkapi obstacle avoidance untuk keamanan terbang. Ideal untuk dokumentasi perjalanan, acara outdoor, atau proyek kreatif.",
    specs: ["4K/60fps Camera", "34 menit Flight Time", "249g Ultralight", "Obstacle Avoidance"],
    condition: "Baik — 8.5/10",
  },
  {
    id: 4,
    name: "Tenda Camping Ultralight 4 Orang",
    image: "/camping_tent.png",
    price: "Rp 55.000",
    priceNum: 55000,
    owner: "Sari Wulandari",
    ownerInitial: "S",
    badge: "Silver",
    rating: 4.6,
    reviews: 67,
    category: ["Semua", "Perlengkapan Outdoor"],
    tagline: "Tenda Ringan Anti Bocor",
    description:
      "Tenda ultralight berkapasitas 4 orang yang dirancang untuk kenyamanan di alam terbuka. Material waterproof 3000mm menjamin perlindungan dari hujan. Berat hanya 2.5kg sehingga mudah dibawa hiking. Proses pemasangan cepat dalam 5 menit. Sempurna untuk camping akhir pekan tanpa perlu investasi peralatan sendiri.",
    specs: ["Kapasitas 4 Orang", "Waterproof 3000mm", "Ultralight 2.5kg", "Setup Cepat 5 Menit"],
    condition: "Baik — 8/10",
  },
  {
    id: 5,
    name: "Ring Light 18\" Profesional + Tripod",
    image: "/ring_light.png",
    price: "Rp 35.000",
    priceNum: 35000,
    owner: "Maya Putri",
    ownerInitial: "M",
    badge: "Bronze",
    rating: 4.5,
    reviews: 89,
    category: ["Semua", "Kamera & Lensa"],
    tagline: "Pencahayaan Konten Kreator",
    description:
      "Tingkatkan kualitas pencahayaan konten Anda dengan ring light profesional berdiameter 18 inci. Dilengkapi 3 mode warna yang dapat disesuaikan dan tripod adjustable hingga 2 meter. Cocok untuk live streaming, pembuatan konten video, atau foto produk. Tersedia mount untuk smartphone dan kamera.",
    specs: ["Diameter 18 Inci", "3 Mode Warna", "Tripod Adjustable 2m", "Mount HP + Kamera"],
    condition: "Baik — 8/10",
  },
  {
    id: 6,
    name: "Kebaya Wisuda Premium Set",
    image: "/graduation_kebaya.png",
    price: "Rp 45.000",
    priceNum: 45000,
    owner: "Nisa Aulia",
    ownerInitial: "N",
    badge: "Gold",
    rating: 4.9,
    reviews: 156,
    category: ["Semua", "Pakaian Formal"],
    tagline: "Set Kebaya Wisuda Elegan",
    description:
      "Tampil memukau di hari wisuda dengan set kebaya premium yang terdiri dari kebaya brokat, kain, dan aksesoris pelengkap. Tersedia ukuran S hingga L dengan material brokat berkualitas tinggi. Pemilik Gold Tier menjamin kebersihan dan kondisi prima setiap peminjaman. Solusi cerdas untuk tampil elegan tanpa biaya besar.",
    specs: ["Set Lengkap (Kebaya + Kain)", "Ukuran S-L Tersedia", "Material Brokat Premium", "Aksesoris Termasuk"],
    condition: "Seperti Baru — 9.5/10",
  },
  {
    id: 7,
    name: "Vintage Denim Jacket",
    image: "/vintage_jacket.png",
    price: "Rp 25.000",
    priceNum: 25000,
    owner: "Kiki Rahmawati",
    ownerInitial: "K",
    badge: "Bronze",
    rating: 4.4,
    reviews: 34,
    category: ["Semua", "Pakaian Formal"],
    tagline: "Jaket Denim Gaya Retro",
    description:
      "Tampilkan gaya retro yang timeless dengan jaket denim vintage ini. Potongan unisex ukuran M-L dengan material denim 100% dan finishing light wash yang khas. Sempurna untuk sesi foto, acara santai, atau melengkapi penampilan sehari-hari. Sewa untuk keperluan sesaat tanpa harus membeli koleksi baru.",
    specs: ["Unisex Fit M-L", "100% Denim", "Gaya Vintage 90s", "Light Wash Finish"],
    condition: "Vintage Baik — 7.5/10",
  },
  {
    id: 8,
    name: "Kalkulator Scientific Casio FX-991",
    image: "/scientific_calculator.png",
    price: "Rp 10.000",
    priceNum: 10000,
    owner: "Budi Santoso",
    ownerInitial: "B",
    badge: "Silver",
    rating: 4.7,
    reviews: 203,
    category: ["Semua"],
    tagline: "Kalkulator Standar Akademis",
    description:
      "Kalkulator scientific Casio FX-991 dengan 417 fungsi lengkap untuk kebutuhan akademis. Tampilan Natural Display memudahkan pembacaan rumus matematika. Daya ganda solar dan baterai memastikan penggunaan tanpa gangguan. Ideal untuk persiapan ujian atau tugas kuliah tanpa perlu membeli perangkat baru.",
    specs: ["417 Fungsi", "Natural Display", "Solar + Baterai", "Statistik & Kalkulus"],
    condition: "Sangat Baik — 9/10",
  },
];
