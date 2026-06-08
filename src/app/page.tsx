"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  BookOpen,
  Camera,
  Check,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Filter,
  Flame,
  Heart,
  Home,
  Laptop,
  Menu,
  Mic,
  Package,
  Search,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  Sparkles,
  Star,
  Tent,
  UploadCloud,
  Wallet,
  X,
} from "lucide-react";

type View = "home" | "browse" | "detail" | "renter" | "owner" | "checkout" | "profile";
type ProductStatus = "available" | "low" | "unavailable";
type ProductType = "sewa" | "both";
type OwnerLevel = "bronze" | "silver" | "gold";

type Product = {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  buyPrice: number;
  type: ProductType;
  minDays: number;
  maxDays: number;
  rating: number;
  reviewCount: number;
  rentedCount: number;
  condition: number;
  location: string;
  owner: {
    name: string;
    initials: string;
    level: OwnerLevel;
    rating: number;
    txCount: number;
  };
  status: ProductStatus;
  badges: string[];
  color: string;
  description: string;
  includes: string[];
  notes: string;
  reviews: { name: string; initials: string; rating: number; date: string; text: string }[];
};

type Filters = {
  query: string;
  category: string;
  priceMax: number;
  location: string;
  rating: number;
  type: "all" | "sewa" | "gratis";
  level: "all" | OwnerLevel;
};

const categories = [
  { name: "Elektronik", icon: Laptop, color: "from-blue-500 to-blue-700", count: 847 },
  { name: "Event & Kamera", icon: Camera, color: "from-teal-500 to-cyan-600", count: 312 },
  { name: "Pakaian Formal", icon: Shirt, color: "from-violet-500 to-purple-700", count: 256 },
  { name: "Alat Akademik", icon: BookOpen, color: "from-amber-500 to-orange-600", count: 189 },
  { name: "Hobi & Outdoor", icon: Tent, color: "from-green-500 to-emerald-700", count: 423 },
  { name: "Peralatan Rumah", icon: Home, color: "from-orange-500 to-red-500", count: 167 },
  { name: "Beauty & Aksesori", icon: Sparkles, color: "from-pink-500 to-rose-600", count: 134 },
];

const products: Product[] = [
  {
    id: 1,
    name: "Laptop ASUS VivoBook 14 Ryzen 5",
    category: "Elektronik",
    subcategory: "Laptop",
    price: 25000,
    buyPrice: 8500000,
    type: "sewa",
    minDays: 1,
    maxDays: 14,
    rating: 4.8,
    reviewCount: 47,
    rentedCount: 47,
    condition: 92,
    location: "Margonda, Depok",
    owner: { name: "Rizky Aulia", initials: "RA", level: "gold", rating: 4.9, txCount: 128 },
    status: "available",
    badges: ["Populer"],
    color: "#2563EB",
    description:
      "Laptop ringan untuk tugas, presentasi, editing ringan, dan kelas online. Sudah terinstal Office, browser, dan aplikasi meeting.",
    includes: ["Laptop", "Charger original", "Mouse wireless", "Sleeve bag"],
    notes: "COD sekitar Margonda atau UI. Wajib menunjukkan KTM/KTP saat serah terima.",
    reviews: [
      { name: "Difa S.", initials: "DS", rating: 5, date: "2 hari lalu", text: "Laptop cepat dan bersih, sangat bantu buat presentasi." },
      { name: "Layla N.", initials: "LN", rating: 4, date: "2 minggu lalu", text: "Bagus, charger agak longgar tapi overall memuaskan." },
    ],
  },
  {
    id: 2,
    name: "Kamera Mirrorless Sony A6000 + Kit Lens",
    category: "Event & Kamera",
    subcategory: "Kamera",
    price: 50000,
    buyPrice: 7800000,
    type: "sewa",
    minDays: 2,
    maxDays: 7,
    rating: 4.9,
    reviewCount: 83,
    rentedCount: 83,
    condition: 90,
    location: "Kuningan, Jakarta Selatan",
    owner: { name: "Anisa Dewi", initials: "AD", level: "gold", rating: 4.9, txCount: 201 },
    status: "available",
    badges: ["Top Rated"],
    color: "#0891B2",
    description: "Kamera mirrorless kondisi prima untuk foto tugas, event kampus, dan konten media sosial.",
    includes: ["Body Camera", "Kit Lens 16-50mm", "Baterai x2", "Charger", "Tas Kamera", "Memory Card 64GB"],
    notes: "Wajib menaruh uang jaminan. Mohon jaga dari benturan.",
    reviews: [{ name: "Kevin P.", initials: "KP", rating: 5, date: "3 hari lalu", text: "Kamera impecable, hasil foto tajam." }],
  },
  {
    id: 3,
    name: "Proyektor Mini Xiaomi Mi",
    category: "Elektronik",
    subcategory: "Proyektor",
    price: 35000,
    buyPrice: 4200000,
    type: "sewa",
    minDays: 1,
    maxDays: 3,
    rating: 4.7,
    reviewCount: 29,
    rentedCount: 29,
    condition: 88,
    location: "Grogol, Jakarta Barat",
    owner: { name: "Fajar Maulana", initials: "FM", level: "silver", rating: 4.8, txCount: 67 },
    status: "available",
    badges: ["Baru"],
    color: "#7C3AED",
    description: "Proyektor mini portabel resolusi 1080p, HDMI dan wireless. Cocok untuk presentasi atau nonton bareng.",
    includes: ["Unit Proyektor", "Power Adapter", "Kabel HDMI", "Remote"],
    notes: "Bawa sendiri screen atau pakai dinding putih.",
    reviews: [{ name: "Budi S.", initials: "BS", rating: 5, date: "5 hari lalu", text: "Nonton bareng jadi seru, gambar jernih." }],
  },
  {
    id: 4,
    name: "Tenda Camping Coleman 4 Person",
    category: "Hobi & Outdoor",
    subcategory: "Camping",
    price: 45000,
    buyPrice: 1800000,
    type: "sewa",
    minDays: 2,
    maxDays: 7,
    rating: 4.6,
    reviewCount: 18,
    rentedCount: 18,
    condition: 85,
    location: "Cilandak, Jakarta Selatan",
    owner: { name: "Dinda Rahayu", initials: "DR", level: "silver", rating: 4.7, txCount: 45 },
    status: "low",
    badges: ["Hampir Habis"],
    color: "#16A34A",
    description: "Tenda dome 4 orang, waterproof, setup mudah dan bersih.",
    includes: ["Tenda + Cover", "Tiang Fiberglass", "Pasak 10 pcs", "Tas Penyimpanan"],
    notes: "Kembalikan dalam kondisi bersih dan kering.",
    reviews: [{ name: "Alif R.", initials: "AR", rating: 5, date: "1 minggu lalu", text: "Kokoh dan waterproof beneran." }],
  },
  {
    id: 5,
    name: "Jas Pria + Kemeja Formal (M/L/XL)",
    category: "Pakaian Formal",
    subcategory: "Jas",
    price: 20000,
    buyPrice: 950000,
    type: "both",
    minDays: 1,
    maxDays: 3,
    rating: 4.8,
    reviewCount: 61,
    rentedCount: 61,
    condition: 92,
    location: "Semanggi, Jakarta",
    owner: { name: "Haris Wibowo", initials: "HW", level: "gold", rating: 4.9, txCount: 134 },
    status: "available",
    badges: ["Pinjam Gratis"],
    color: "#1E40AF",
    description: "Jas hitam formal + kemeja putih untuk sidang, wisuda, wawancara kerja, atau acara formal.",
    includes: ["Jas Hitam", "Kemeja Putih", "Dasi Polos", "Hanger"],
    notes: "Konfirmasi ukuran saat booking.",
    reviews: [{ name: "Nadia F.", initials: "NF", rating: 5, date: "4 hari lalu", text: "Cocok untuk sidang skripsi. Pinjam gratis lagi!" }],
  },
  {
    id: 6,
    name: "Drone DJI Mini 2 + ND Filter Set",
    category: "Event & Kamera",
    subcategory: "Drone",
    price: 80000,
    buyPrice: 9200000,
    type: "sewa",
    minDays: 1,
    maxDays: 3,
    rating: 4.9,
    reviewCount: 35,
    rentedCount: 35,
    condition: 95,
    location: "Pancoran, Jakarta Selatan",
    owner: { name: "Kevin Pratama", initials: "KP", level: "gold", rating: 4.95, txCount: 178 },
    status: "available",
    badges: ["Premium"],
    color: "#DC2626",
    description: "Drone DJI Mini 2 untuk aerial photography. Ringan, mudah dikontrol, kamera 4K.",
    includes: ["Drone", "Controller", "Baterai x3", "ND Filter Set", "Tas Hardcase"],
    notes: "Wajib KTM dan jaminan. Tidak untuk hujan.",
    reviews: [{ name: "Tommy K.", initials: "TK", rating: 5, date: "2 hari lalu", text: "Konten dokumenter jadi level up." }],
  },
  {
    id: 7,
    name: "Speaker Bluetooth JBL Charge 5",
    category: "Elektronik",
    subcategory: "Speaker",
    price: 15000,
    buyPrice: 2400000,
    type: "sewa",
    minDays: 1,
    maxDays: 7,
    rating: 4.5,
    reviewCount: 52,
    rentedCount: 52,
    condition: 88,
    location: "Beji, Depok",
    owner: { name: "Sari Nurul", initials: "SN", level: "bronze", rating: 4.6, txCount: 23 },
    status: "available",
    badges: [],
    color: "#0891B2",
    description: "Speaker waterproof, suara jernih, baterai 20 jam untuk acara outdoor.",
    includes: ["Speaker", "Kabel USB-C", "Tali Pengait"],
    notes: "Mohon kembalikan penuh baterai.",
    reviews: [{ name: "Rizky A.", initials: "RA", rating: 4, date: "1 minggu lalu", text: "Suara oke untuk acara kecil." }],
  },
  {
    id: 8,
    name: "Kebaya Modern Set Lengkap (S/M/L)",
    category: "Pakaian Formal",
    subcategory: "Kebaya",
    price: 35000,
    buyPrice: 1200000,
    type: "sewa",
    minDays: 1,
    maxDays: 2,
    rating: 4.9,
    reviewCount: 94,
    rentedCount: 94,
    condition: 93,
    location: "Fatmawati, Jakarta Selatan",
    owner: { name: "Dewi Lestari", initials: "DL", level: "gold", rating: 4.95, txCount: 312 },
    status: "available",
    badges: ["Favorit"],
    color: "#9333EA",
    description: "Kebaya modern katun, lengkap dengan rok batik untuk wisuda dan acara formal.",
    includes: ["Atasan Kebaya", "Rok Batik", "Inner", "Selendang"],
    notes: "Cuci kering sebelum dikembalikan.",
    reviews: [{ name: "Anisa D.", initials: "AD", rating: 5, date: "3 hari lalu", text: "Cantik banget untuk wisuda." }],
  },
  {
    id: 9,
    name: "Matras + Sleeping Bag Outdoor",
    category: "Hobi & Outdoor",
    subcategory: "Camping",
    price: 10000,
    buyPrice: 700000,
    type: "both",
    minDays: 2,
    maxDays: 7,
    rating: 4.6,
    reviewCount: 23,
    rentedCount: 23,
    condition: 85,
    location: "Lenteng Agung, Jakarta Selatan",
    owner: { name: "Budi Santoso", initials: "BS", level: "silver", rating: 4.7, txCount: 56 },
    status: "available",
    badges: ["Pinjam Gratis"],
    color: "#65A30D",
    description: "Set matras self-inflating + sleeping bag kapasitas -5C untuk hiking atau camping.",
    includes: ["Matras Self-inflating", "Sleeping Bag", "Compression Bag"],
    notes: "Kembalikan dalam kondisi kering.",
    reviews: [],
  },
  {
    id: 10,
    name: "Microphone Podcast Rode NT-USB",
    category: "Event & Kamera",
    subcategory: "Audio",
    price: 30000,
    buyPrice: 2900000,
    type: "sewa",
    minDays: 1,
    maxDays: 7,
    rating: 4.7,
    reviewCount: 41,
    rentedCount: 41,
    condition: 91,
    location: "Pasar Minggu, Jakarta Selatan",
    owner: { name: "Alif Ramadhan", initials: "AR", level: "silver", rating: 4.8, txCount: 89 },
    status: "available",
    badges: ["Baru"],
    color: "#B45309",
    description: "Mic USB kondenser kualitas studio untuk podcast, vokal, atau voiceover.",
    includes: ["Mic NT-USB", "Kabel USB", "Pop Filter", "Stand Meja", "Pouch"],
    notes: "Handle dengan hati-hati.",
    reviews: [],
  },
  {
    id: 11,
    name: "Paket Kostum Wisuda + Toga Lengkap",
    category: "Pakaian Formal",
    subcategory: "Wisuda",
    price: 40000,
    buyPrice: 850000,
    type: "sewa",
    minDays: 1,
    maxDays: 1,
    rating: 4.8,
    reviewCount: 77,
    rentedCount: 77,
    condition: 90,
    location: "Beji, Depok",
    owner: { name: "Nadia Fauziah", initials: "NF", level: "gold", rating: 4.9, txCount: 245 },
    status: "available",
    badges: ["Paling Sering Disewa"],
    color: "#6D28D9",
    description: "Set lengkap toga wisuda: jubah, topi, kalung, selempang.",
    includes: ["Jubah Toga", "Topi Toga", "Kalung Wisuda", "Selempang Univ."],
    notes: "Cek ukuran sebelum booking.",
    reviews: [{ name: "Dewi L.", initials: "DL", rating: 5, date: "5 hari lalu", text: "Toga bersih dan rapi." }],
  },
  {
    id: 12,
    name: "Action Camera GoPro Hero 11 Black",
    category: "Event & Kamera",
    subcategory: "Kamera",
    price: 55000,
    buyPrice: 7600000,
    type: "sewa",
    minDays: 1,
    maxDays: 7,
    rating: 4.8,
    reviewCount: 29,
    rentedCount: 29,
    condition: 94,
    location: "Mampang, Jakarta Selatan",
    owner: { name: "Tommy Kusuma", initials: "TK", level: "silver", rating: 4.8, txCount: 78 },
    status: "available",
    badges: ["Premium"],
    color: "#1D4ED8",
    description: "GoPro Hero 11 Black, waterproof, video 5.3K, stabilisasi HyperSmooth.",
    includes: ["GoPro Hero 11", "Baterai x2", "Charger", "Housing Waterproof", "Mount Set", "MicroSD 128GB"],
    notes: "Kembalikan bersih.",
    reviews: [{ name: "Fajar M.", initials: "FM", rating: 5, date: "4 hari lalu", text: "Footage hiking luar biasa." }],
  },
];

const rupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const defaultFilters: Filters = {
  query: "",
  category: "all",
  priceMax: 200000,
  location: "all",
  rating: 0,
  type: "all",
  level: "all",
};

function StatusBadge({ status }: { status: ProductStatus }) {
  const config = {
    available: "bg-green-100 text-green-700",
    low: "bg-amber-100 text-amber-700",
    unavailable: "bg-red-100 text-red-700",
  };
  const label = status === "available" ? "Tersedia" : status === "low" ? "Hampir Habis" : "Tidak Tersedia";
  return <span className={`rounded-full px-3 py-1 text-[11px] font-black ${config[status]}`}>{label}</span>;
}

function LevelBadge({ level }: { level: OwnerLevel }) {
  if (level === "gold") return <span className="badge-gold rounded-full px-2.5 py-1 text-[10px] font-black text-amber-950">Gold</span>;
  if (level === "silver") return <span className="rounded-full bg-slate-200 px-2.5 py-1 text-[10px] font-black text-slate-700">Silver</span>;
  return <span className="rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-black text-orange-700">Bronze</span>;
}

function ProductIcon({ product, className = "h-16 w-16" }: { product: Product; className?: string }) {
  const Icon =
    product.subcategory === "Laptop"
      ? Laptop
      : product.subcategory === "Kamera"
        ? Camera
        : product.subcategory === "Camping"
          ? Tent
          : product.subcategory === "Jas" || product.subcategory === "Kebaya" || product.subcategory === "Wisuda"
            ? Shirt
            : product.subcategory === "Audio" || product.subcategory === "Speaker"
              ? Mic
              : Package;
  return <Icon className={className} />;
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<View>("home");
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sortBy, setSortBy] = useState("relevant");
  const [gridMode, setGridMode] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(12);
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [modal, setModal] = useState<"login" | "register" | "topup" | "upload" | "handover" | null>(null);
  const [currentUser, setCurrentUser] = useState(false);
  const [coinBalance, setCoinBalance] = useState(45);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [bookingDays, setBookingDays] = useState(3);
  const [savingProductId, setSavingProductId] = useState(products[0].id);
  const [savingDays, setSavingDays] = useState(5);
  const [homeTab, setHomeTab] = useState("Semua");
  const [flow, setFlow] = useState<"rent" | "lend">("rent");
  const [ownerRequests, setOwnerRequests] = useState([
    { id: 1, renter: "Difa Surya", item: "Laptop ASUS VivoBook 14", days: 3, total: 81375, rating: 4.9, status: "pending" },
    { id: 2, renter: "Maya Putri", item: "Kamera Mirrorless Sony A6000", days: 2, total: 107500, rating: 4.8, status: "pending" },
    { id: 3, renter: "Raka Pradipta", item: "Jas Pria + Kemeja Formal", days: 1, total: 23500, rating: 4.6, status: "pending" },
  ]);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const navigate = (nextView: View, product?: Product) => {
    if (product) {
      setSelectedProduct(product);
      setBookingDays(product.minDays);
    }
    setView(nextView);
    setMobileOpen(false);
    setFilterOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2400);
  };

  const toggleWishlist = (productId: number) => {
    setWishlist((items) => {
      const liked = items.includes(productId);
      return liked ? items.filter((id) => id !== productId) : [...items, productId];
    });
    showToast(wishlist.includes(productId) ? "Dihapus dari wishlist" : "Ditambahkan ke wishlist!");
  };

  const filteredProducts = useMemo(() => {
    const query = filters.query.toLowerCase();
    const result = products.filter((product) => {
      const queryMatch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.subcategory.toLowerCase().includes(query);
      const categoryMatch = filters.category === "all" || product.category === filters.category;
      const locationMatch = filters.location === "all" || product.location.includes(filters.location);
      const ratingMatch = product.rating >= filters.rating;
      const typeMatch =
        filters.type === "all" ||
        (filters.type === "gratis" ? product.type === "both" : product.type === "sewa" || product.type === "both");
      const levelMatch = filters.level === "all" || product.owner.level === filters.level;
      return queryMatch && categoryMatch && locationMatch && ratingMatch && typeMatch && levelMatch && product.price <= filters.priceMax;
    });

    if (sortBy === "low") result.sort((a, b) => a.price - b.price);
    if (sortBy === "high") result.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    if (sortBy === "newest") result.sort((a, b) => b.id - a.id);
    return result;
  }, [filters, sortBy]);

  const featuredProducts = homeTab === "Semua" ? products : products.filter((product) => product.category === homeTab);
  const savingProduct = products.find((product) => product.id === savingProductId) ?? products[0];
  const savingRental = savingProduct.price * savingDays;
  const savingAmount = savingProduct.buyPrice - savingRental;
  const savingPercent = Math.max(0, (savingAmount / savingProduct.buyPrice) * 100);

  const total = selectedProduct.price * bookingDays + selectedProduct.price * bookingDays * 0.05 + 2500;
  const dp = total / 2;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-bb-light-blue text-bb-dark">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-bb-blue to-bb-teal text-white shadow-soft">
                <ShoppingBag className="h-6 w-6" />
              </span>
              <span className="bg-gradient-to-r from-bb-blue to-bb-teal bg-clip-text text-2xl font-black text-transparent">
                BarangBareng
              </span>
            </div>
            <h1 className="text-[clamp(2.25rem,6vw,4rem)] font-black leading-[1.04]">
              Sewa Bareng,
              <br />
              Hemat Bareng.
            </h1>
            <p className="mt-5 text-lg font-semibold text-bb-muted">
              Menyiapkan marketplace sewa dan pinjam barang mahasiswa.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const ProductCard = ({ product }: { product: Product }) => {
    const liked = wishlist.includes(product.id);
    return (
      <article
        className={`product-card rounded-[1.7rem] bg-white p-3 shadow-card ${gridMode === "list" ? "grid gap-4 sm:grid-cols-[220px_1fr]" : ""}`}
        onClick={() => navigate("detail", product)}
      >
        <div
          className={`relative overflow-hidden rounded-[1.4rem] ${gridMode === "list" ? "h-44 sm:h-full" : "h-44"}`}
          style={{ background: `linear-gradient(135deg, ${product.color}22, ${product.color})` }}
        >
          <div className="absolute inset-0 grid place-items-center text-white/90">
            <ProductIcon product={product} />
          </div>
          <div className="absolute right-3 top-3">
            <StatusBadge status={product.status} />
          </div>
          {product.badges[0] && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-black text-bb-blue">
              {product.badges[0]}
            </span>
          )}
        </div>
        <div className="p-2">
          <h3 className="line-clamp-2 min-h-[48px] text-base font-black">{product.name}</h3>
          <div className="mt-2 flex items-center gap-2 text-sm font-bold text-bb-muted">
            <Star className="h-4 w-4 fill-bb-gold text-bb-gold" />
            {product.rating}
            <span>({product.reviewCount} ulasan)</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-bb-muted">{product.location}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-r from-bb-blue to-bb-teal text-xs font-black text-white">
              {product.owner.initials}
            </span>
            <span className="text-sm font-black">{product.owner.name}</span>
            <LevelBadge level={product.owner.level} />
          </div>
          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-lg font-black text-bb-blue">
                {rupiah(product.price)} <span className="text-xs text-bb-muted">/hari</span>
              </p>
              <p className="text-xs font-bold text-bb-muted">Min. {product.minDays} hari</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-2xl bg-gradient-to-r from-bb-blue to-bb-teal px-4 py-2 text-sm font-black text-white"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedProduct(product);
                  setBookingDays(product.minDays);
                  setCheckoutStep(1);
                  navigate("checkout", product);
                }}
              >
                Sewa
              </button>
              <button
                type="button"
                className={`heart-btn grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 ${liked ? "liked" : ""}`}
                onClick={(event) => {
                  event.stopPropagation();
                  toggleWishlist(product.id);
                }}
                aria-label="Wishlist"
              >
                <Heart className={`h-4 w-4 ${liked ? "fill-bb-danger text-bb-danger" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-bb-dark">
      {toast && <div className="toast show fixed bottom-5 right-5 z-[90] rounded-2xl bg-bb-teal px-5 py-3 text-sm font-black text-white shadow-2xl">{toast}</div>}

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button className="flex items-center gap-3" onClick={() => navigate("home")}>
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-bb-blue to-bb-teal text-white shadow-soft">
              <ShoppingBag className="h-5 w-5" />
            </span>
            <span className="bg-gradient-to-r from-bb-blue to-bb-teal bg-clip-text text-xl font-black text-transparent">BarangBareng</span>
          </button>
          <nav className="hidden items-center gap-2 lg:flex">
            {[
              ["home", "Beranda"],
              ["browse", "Jelajah"],
              ["renter", "Dashboard"],
              ["owner", "Pemilik"],
              ["profile", "Profil"],
            ].map(([key, label]) => (
              <button
                key={key}
                className={`rounded-full px-4 py-2 text-sm font-bold ${view === key ? "bg-bb-light-blue text-bb-blue" : "text-slate-700 hover:bg-white"}`}
                onClick={() => navigate(key as View)}
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            {currentUser ? (
              <button className="flex items-center gap-3 rounded-full bg-white px-4 py-2 font-black shadow-card" onClick={() => navigate("profile")}>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-r from-bb-blue to-bb-teal text-xs text-white">DS</span>
                Difa
              </button>
            ) : (
              <>
                <button className="rounded-full border border-bb-border bg-white px-5 py-2.5 text-sm font-black text-bb-blue" onClick={() => setModal("login")}>
                  Masuk
                </button>
                <button className="rounded-full bg-gradient-to-r from-bb-blue to-bb-teal px-5 py-2.5 text-sm font-black text-white shadow-soft" onClick={() => setModal("register")}>
                  Daftar
                </button>
              </>
            )}
          </div>
          <button className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-bb-blue shadow-card lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Buka menu">
            <Menu />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[70] bg-slate-950/50 lg:hidden" onClick={() => setMobileOpen(false)}>
          <aside className="h-full w-[280px] bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-8 flex items-center justify-between">
              <strong>BarangBareng</strong>
              <button onClick={() => setMobileOpen(false)} aria-label="Tutup menu">
                <X />
              </button>
            </div>
            <div className="grid gap-2">
              {["home", "browse", "renter", "owner", "profile"].map((item) => (
                <button key={item} className="rounded-2xl px-4 py-3 text-left font-bold hover:bg-bb-light-blue" onClick={() => navigate(item as View)}>
                  {item === "home" ? "Beranda" : item === "browse" ? "Jelajah" : item === "renter" ? "Dashboard Penyewa" : item === "owner" ? "Dashboard Pemilik" : "Profil"}
                </button>
              ))}
            </div>
          </aside>
        </div>
      )}

      <main className="pt-20">
        {view === "home" && (
          <>
            <section className="gradient-animated relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#fff 1px,transparent 1px)", backgroundSize: "26px 26px" }} />
              <div className="relative mx-auto grid min-h-[720px] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-black text-white ring-1 ring-white/20">
                    <Flame className="h-4 w-4" /> #1 Platform Sewa Barang Mahasiswa
                  </span>
                  <h1 className="mt-7 max-w-3xl text-[clamp(2.25rem,6vw,4.2rem)] font-black leading-[1.02] text-white">
                    Sewa Apapun,
                    <br />
                    Kapanpun,
                    <br />
                    Dari Sesama Mahasiswa.
                  </h1>
                  <p className="mt-5 max-w-2xl text-lg font-medium text-white/85">
                    Tidak perlu beli baru. Sewa dari teman kampus, bayar aman dan tercatat, serah terima COD. Mulai dari Rp5.000/hari.
                  </p>
                  <div className="mt-8 rounded-[2rem] bg-white p-3 shadow-2xl">
                    <div className="grid gap-3 lg:grid-cols-[1fr_170px_120px]">
                      <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                        <Search className="h-5 w-5 text-bb-blue" />
                        <input
                          className="w-full bg-transparent text-sm font-semibold outline-none"
                          placeholder="Cari barang yang ingin kamu sewa..."
                          value={filters.query}
                          onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
                        />
                      </label>
                      <select
                        className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold outline-none"
                        value={filters.category}
                        onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}
                      >
                        <option value="all">Semua</option>
                        {categories.map((category) => (
                          <option key={category.name}>{category.name}</option>
                        ))}
                      </select>
                      <button className="rounded-2xl bg-gradient-to-r from-bb-blue to-bb-teal px-5 py-3 text-sm font-black text-white" onClick={() => navigate("browse")}>
                        Cari
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {["Laptop", "Kamera", "Tenda", "Baju Wisuda", "Proyektor"].map((chip) => (
                        <button key={chip} className="rounded-full bg-bb-light-blue px-3 py-1.5 text-xs font-black text-bb-blue" onClick={() => setFilters((current) => ({ ...current, query: chip }))}>
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-7 grid gap-3 sm:grid-cols-3">
                    {["2.400+ Barang", "8.500+ Pengguna", "4.9/5 Rating"].map((stat) => (
                      <div key={stat} className="rounded-3xl bg-white/15 p-4 text-white ring-1 ring-white/15">
                        <strong className="block text-2xl">{stat.split(" ")[0]}</strong>
                        <span className="text-sm text-white/80">{stat.replace(stat.split(" ")[0], "")}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative min-h-[420px]">
                  {products.slice(0, 3).map((product, index) => (
                    <div
                      key={product.id}
                      className={`absolute w-72 rounded-[2rem] bg-white p-5 shadow-2xl ${index === 0 ? "left-2 top-10 float-card-1 rotate-[-5deg]" : index === 1 ? "right-0 top-28 float-card-2 rotate-[5deg]" : "bottom-8 left-16 float-card-3"}`}
                    >
                      <div className="grid h-36 place-items-center rounded-3xl text-white" style={{ background: `linear-gradient(135deg, ${product.color}44, ${product.color})` }}>
                        <ProductIcon product={product} />
                      </div>
                      <h3 className="mt-4 font-black">{product.subcategory}</h3>
                      <p className="text-sm text-bb-muted">
                        {rupiah(product.price)}/hari · {product.rating}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <p className="font-black text-bb-blue">Kategori Quick Access</p>
                  <h2 className="text-3xl font-black">Temukan Berdasarkan Kategori</h2>
                </div>
                <button className="hidden rounded-full bg-white px-5 py-3 text-sm font-black text-bb-blue shadow-card sm:inline-flex" onClick={() => navigate("browse")}>
                  Lihat Semua
                </button>
              </div>
              <div className="flex snap-x gap-4 overflow-x-auto pb-3 lg:grid lg:grid-cols-7 lg:overflow-visible">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    className={`min-w-[180px] snap-start rounded-[1.7rem] bg-gradient-to-br ${category.color} p-5 text-left text-white shadow-card transition hover:-translate-y-1`}
                    onClick={() => {
                      setFilters((current) => ({ ...current, category: category.name }));
                      navigate("browse");
                    }}
                  >
                    <category.icon className="h-8 w-8" />
                    <h3 className="mt-6 font-black">{category.name}</h3>
                    <p className="text-sm text-white/80">{category.count} item</p>
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-white py-16">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                  <div>
                    <p className="font-black text-bb-blue">Lagi Banyak Dicari</p>
                    <h2 className="text-3xl font-black">Produk Unggulan</h2>
                  </div>
                  <div className="flex gap-2 overflow-x-auto">
                    {["Semua", "Elektronik", "Event & Kamera", "Hobi & Outdoor", "Pakaian Formal", "Alat Akademik"].map((tab) => (
                      <button
                        key={tab}
                        className={`rounded-full px-4 py-2 text-sm font-black ${homeTab === tab ? "bg-gradient-to-r from-bb-blue to-bb-teal text-white" : "bg-slate-100 text-bb-muted"}`}
                        onClick={() => setHomeTab(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {featuredProducts.slice(0, 12).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-bb-teal to-emerald-600 py-16 text-white">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 max-w-2xl">
                  <p className="font-black">Spotlight Teal</p>
                  <h2 className="text-3xl font-black">Butuh Barang Sementara? Pinjam GRATIS!</h2>
                  <p className="mt-3 text-white/80">Beberapa pemilik mengizinkan pinjam tanpa biaya sewa. Kamu hanya bayar biaya listing Rp5.000.</p>
                </div>
                <div className="grid gap-5 md:grid-cols-3">
                  {products
                    .filter((product) => product.type === "both")
                    .slice(0, 3)
                    .map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                <button
                  className="mt-8 rounded-full bg-white px-6 py-3 font-black text-bb-teal"
                  onClick={() => {
                    setFilters((current) => ({ ...current, type: "gratis", category: "all" }));
                    navigate("browse");
                  }}
                >
                  Lihat Semua Barang Gratis
                </button>
              </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="mx-auto mb-10 max-w-2xl text-center">
                <p className="font-black text-bb-blue">Cara Kerja</p>
                <h2 className="text-3xl font-black">Alur cepat, transparan, dan aman</h2>
              </div>
              <div className="mx-auto mb-8 flex w-fit rounded-full bg-white p-1 shadow-card">
                <button className={`rounded-full px-5 py-2.5 text-sm font-black ${flow === "rent" ? "bg-gradient-to-r from-bb-blue to-bb-teal text-white" : ""}`} onClick={() => setFlow("rent")}>
                  Saya Mau Sewa
                </button>
                <button className={`rounded-full px-5 py-2.5 text-sm font-black ${flow === "lend" ? "bg-gradient-to-r from-bb-blue to-bb-teal text-white" : ""}`} onClick={() => setFlow("lend")}>
                  Saya Mau Sewakan
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-4">
                {(flow === "rent"
                  ? [
                      ["CARI", Search, "Temukan barang dekat kampus"],
                      ["BAYAR DP", CreditCard, "DP 50% tercatat aman"],
                      ["COD", BadgeCheck, "Ketemu dan scan QR"],
                      ["SELESAI", Star, "Rating dan review"],
                    ]
                  : [
                      ["LISTING", Camera, "Upload barangmu"],
                      ["KONFIRMASI", CheckCircle2, "Terima booking"],
                      ["COD", BadgeCheck, "Serah terima aman"],
                      ["CUAN", Wallet, "Saldo bertambah"],
                    ]
                ).map(([label, Icon, description], index) => {
                  const StepIcon = Icon as typeof Search;
                  return (
                    <article key={label as string} className="rounded-[2rem] bg-white p-6 text-center shadow-card">
                      <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-r from-bb-blue to-bb-teal text-white">
                        <StepIcon />
                      </span>
                      <p className="mt-4 text-sm font-black text-bb-blue">0{index + 1}</p>
                      <h3 className="text-xl font-black">{label as string}</h3>
                      <p className="mt-2 text-sm text-bb-muted">{description as string}</p>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="bg-bb-light-blue py-16">
              <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
                <div>
                  <p className="font-black text-bb-blue">Kalkulator Hemat</p>
                  <h2 className="text-3xl font-black">Bandingkan sewa vs beli baru</h2>
                  <p className="mt-3 text-bb-muted">Hitung berapa banyak uang yang bisa kamu hemat untuk kebutuhan jangka pendek.</p>
                </div>
                <div className="rounded-[2rem] bg-white p-6 shadow-card">
                  <label className="font-black">Pilih barang</label>
                  <select className="mt-2 w-full rounded-2xl border border-bb-border px-4 py-3 font-bold" value={savingProductId} onChange={(event) => setSavingProductId(Number(event.target.value))}>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.subcategory} - {product.name}
                      </option>
                    ))}
                  </select>
                  <label className="mt-5 block font-black">Durasi: {savingDays} hari</label>
                  <input type="range" min={1} max={30} value={savingDays} onChange={(event) => setSavingDays(Number(event.target.value))} className="mt-3 w-full accent-bb-blue" />
                  <div className="mt-5 rounded-3xl bg-slate-50 p-5">
                    <div className="grid gap-2 text-sm font-bold">
                      <div className="flex justify-between">
                        <span>Harga beli baru</span>
                        <strong>{rupiah(savingProduct.buyPrice)}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Harga sewa {savingDays} hari</span>
                        <strong>{rupiah(savingRental)}</strong>
                      </div>
                      <div className="flex justify-between text-bb-teal">
                        <span>Kamu hemat</span>
                        <strong>
                          {rupiah(savingAmount)} ({savingPercent.toFixed(1)}%)
                        </strong>
                      </div>
                    </div>
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-red-100">
                      <div className="h-full rounded-full bg-bb-teal" style={{ width: `${savingPercent}%` }} />
                    </div>
                  </div>
                  <button
                    className="mt-5 w-full rounded-2xl bg-gradient-to-r from-bb-blue to-bb-teal px-5 py-3 font-black text-white"
                    onClick={() => {
                      setFilters((current) => ({ ...current, query: savingProduct.subcategory }));
                      navigate("browse");
                    }}
                  >
                    Cari Barang Ini Sekarang
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {view === "browse" && (
          <section className="bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="mb-6 flex flex-col gap-4 rounded-[2rem] bg-white p-5 shadow-card lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-black text-bb-blue">Jelajah Barang</p>
                  <h1 className="text-3xl font-black">Temukan barang terbaik di sekitar kampus</h1>
                  <p className="mt-1 text-sm font-semibold text-bb-muted">
                    Menampilkan {Math.min(visibleCount, filteredProducts.length)} dari {filteredProducts.length} barang cocok
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="rounded-2xl border border-bb-border px-4 py-3 font-black text-bb-blue lg:hidden" onClick={() => setFilterOpen(true)}>
                    <Filter className="inline h-4 w-4" /> Filter
                  </button>
                  <select className="rounded-2xl border border-bb-border px-4 py-3 font-black" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                    <option value="relevant">Paling Relevan</option>
                    <option value="newest">Terbaru</option>
                    <option value="low">Harga Terendah</option>
                    <option value="high">Harga Tertinggi</option>
                    <option value="rating">Rating Tertinggi</option>
                  </select>
                  <button className={`rounded-2xl px-4 py-3 font-black ${gridMode === "grid" ? "bg-bb-blue text-white" : "bg-white text-bb-blue ring-1 ring-bb-border"}`} onClick={() => setGridMode("grid")}>
                    Grid
                  </button>
                  <button className={`rounded-2xl px-4 py-3 font-black ${gridMode === "list" ? "bg-bb-blue text-white" : "bg-white text-bb-blue ring-1 ring-bb-border"}`} onClick={() => setGridMode("list")}>
                    List
                  </button>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                <FilterPanel filters={filters} setFilters={setFilters} open={filterOpen} onClose={() => setFilterOpen(false)} />
                <div>
                  <div className="mb-5 rounded-[2rem] bg-white p-3 shadow-card">
                    <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                      <Search className="text-bb-blue" />
                      <input
                        className="w-full bg-transparent font-semibold outline-none"
                        placeholder="Cari laptop, kamera, tenda..."
                        value={filters.query}
                        onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
                      />
                    </label>
                  </div>
                  {filteredProducts.length === 0 ? (
                    <div className="rounded-[2rem] bg-white p-10 text-center shadow-card">
                      <Search className="mx-auto h-14 w-14 text-bb-muted" />
                      <h3 className="mt-4 text-xl font-black">Belum ada barang yang cocok</h3>
                      <p className="mt-2 text-bb-muted">Coba ubah kata kunci, kategori, atau batas harga.</p>
                    </div>
                  ) : (
                    <div className={gridMode === "grid" ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3" : "grid gap-4"}>
                      {filteredProducts.slice(0, visibleCount).map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                  {visibleCount < filteredProducts.length && (
                    <button className="mx-auto mt-8 block rounded-full bg-gradient-to-r from-bb-blue to-bb-teal px-7 py-3 font-black text-white" onClick={() => setVisibleCount((count) => count + 12)}>
                      Muat Lebih Banyak
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {view === "detail" && <DetailView product={selectedProduct} bookingDays={bookingDays} setBookingDays={setBookingDays} onBack={() => navigate("browse")} onCheckout={() => { setCheckoutStep(1); navigate("checkout"); }} onWishlist={() => toggleWishlist(selectedProduct.id)} />}

        {view === "checkout" && (
          <CheckoutView
            product={selectedProduct}
            bookingDays={bookingDays}
            checkoutStep={checkoutStep}
            setCheckoutStep={setCheckoutStep}
            total={total}
            dp={dp}
            coinBalance={coinBalance}
            setCoinBalance={setCoinBalance}
            showToast={showToast}
          />
        )}

        {view === "renter" && <RenterDashboard wishlistCount={wishlist.length} coinBalance={coinBalance} openTopup={() => setModal("topup")} navigate={navigate} />}

        {view === "owner" && (
          <OwnerDashboard
            requests={ownerRequests}
            onRequestAction={(id, status) => {
              setOwnerRequests((items) => items.map((request) => (request.id === id ? { ...request, status } : request)));
              showToast(status === "accepted" ? "Request diterima" : "Request ditolak");
            }}
            openUpload={() => setModal("upload")}
          />
        )}

        {view === "profile" && <ProfileView />}
      </main>

      <footer className="bg-slate-950 py-12 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-[1.5fr_3fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-bb-blue to-bb-teal">
                <ShoppingBag />
              </span>
              <strong className="text-xl">BarangBareng</strong>
            </div>
            <p className="mt-4 text-white/60">Sewa Bareng, Hemat Bareng. Marketplace sewa dan pinjam barang untuk mahasiswa Indonesia.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {["Platform", "Dukungan", "Perusahaan"].map((title) => (
              <div key={title}>
                <h3 className="font-black">{title}</h3>
                <p className="mt-3 text-white/60">Jelajah</p>
                <p className="text-white/60">Dashboard</p>
                <p className="text-white/60">Kontak</p>
              </div>
            ))}
          </div>
        </div>
      </footer>

      {modal && (
        <Modal title={modal === "login" ? "Masuk" : modal === "register" ? "Daftar BarangBareng" : modal === "topup" ? "Top-Up QRIS" : modal === "upload" ? "Upload Barang 4-Step" : "QR Serah Terima"} onClose={() => setModal(null)}>
          {modal === "login" && (
            <form
              className="grid gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                setCurrentUser(true);
                setModal(null);
                showToast("Login berhasil");
              }}
            >
              <input className="rounded-2xl border border-bb-border px-4 py-3 font-bold" placeholder="Email/HP" required />
              <input className="rounded-2xl border border-bb-border px-4 py-3 font-bold" placeholder="Password" type="password" required />
              <button className="rounded-2xl bg-gradient-to-r from-bb-blue to-bb-teal px-5 py-3 font-black text-white">Masuk</button>
            </form>
          )}
          {modal === "register" && (
            <form
              className="grid gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                setCurrentUser(true);
                setModal(null);
                showToast("Akun berhasil dibuat");
              }}
            >
              <input className="rounded-2xl border border-bb-border px-4 py-3 font-bold" placeholder="Nama lengkap" required />
              <input className="rounded-2xl border border-bb-border px-4 py-3 font-bold" placeholder="Email" type="email" required />
              <input className="rounded-2xl border border-bb-border px-4 py-3 font-bold" placeholder="No. HP" required />
              <input className="rounded-2xl border border-bb-border px-4 py-3 font-bold" placeholder="Password" type="password" required />
              <select className="rounded-2xl border border-bb-border px-4 py-3 font-bold">
                <option>Penyewa</option>
                <option>Pemilik</option>
                <option>Keduanya</option>
              </select>
              <button className="rounded-2xl bg-gradient-to-r from-bb-blue to-bb-teal px-5 py-3 font-black text-white">Lanjut E-KYC</button>
            </form>
          )}
          {modal === "topup" && (
            <div className="grid gap-4">
              <input className="rounded-2xl border border-bb-border px-4 py-3 font-bold" defaultValue="50000" />
              <QrMock label="BarangBareng Top Up QRIS" />
              <button
                className="rounded-2xl bg-gradient-to-r from-bb-blue to-bb-teal px-5 py-3 font-black text-white"
                onClick={() => {
                  setCoinBalance((balance) => balance + 50);
                  setModal(null);
                  showToast("Top up berhasil");
                }}
              >
                Verifikasi Pembayaran
              </button>
            </div>
          )}
          {modal === "handover" && <QrMock label="QR Serah Terima BarangBareng" />}
          {modal === "upload" && (
            <div className="grid gap-4">
              <div className="rounded-3xl border-2 border-dashed border-bb-border p-8 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-bb-blue" />
                <p className="mt-3 font-black">Drag & drop foto barang</p>
              </div>
              <input className="rounded-2xl border border-bb-border px-4 py-3 font-bold" placeholder="Nama barang" />
              <textarea className="rounded-2xl border border-bb-border px-4 py-3 font-bold" placeholder="Deskripsi" />
              <button
                className="rounded-2xl bg-gradient-to-r from-bb-blue to-bb-teal px-5 py-3 font-black text-white"
                onClick={() => {
                  setModal(null);
                  showToast("Barang berhasil dipublikasikan");
                }}
              >
                Publikasikan
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

function FilterPanel({
  filters,
  setFilters,
  open,
  onClose,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <aside
      className={`fixed inset-x-0 bottom-0 z-[65] max-h-[85dvh] overflow-auto rounded-t-[2rem] bg-white p-5 shadow-2xl transition-transform lg:sticky lg:top-24 lg:z-auto lg:max-h-[calc(100vh-120px)] lg:translate-y-0 lg:rounded-[2rem] lg:shadow-card ${
        open ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-slate-300 lg:hidden" />
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-black">Filter Pencarian</h2>
        <button className="lg:hidden" onClick={onClose} aria-label="Tutup filter">
          <X />
        </button>
      </div>
      <div className="grid gap-6">
        <div>
          <h3 className="mb-3 font-black">Kategori</h3>
          <div className="grid gap-2">
            {["all", ...categories.map((category) => category.name)].map((category) => (
              <label key={category} className="flex items-center gap-2 text-sm font-bold">
                <input type="radio" name="cat" checked={filters.category === category} onChange={() => setFilters((current) => ({ ...current, category }))} />
                {category === "all" ? "Semua" : category}
              </label>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-black">Harga sewa/hari</h3>
          <input type="range" min={0} max={200000} step={5000} value={filters.priceMax} onChange={(event) => setFilters((current) => ({ ...current, priceMax: Number(event.target.value) }))} className="w-full accent-bb-blue" />
          <p className="mt-2 text-sm font-bold text-bb-muted">Maks: {rupiah(filters.priceMax)}</p>
        </div>
        <SelectFilter label="Lokasi" value={filters.location} onChange={(value) => setFilters((current) => ({ ...current, location: value }))} options={["all", "Jakarta Selatan", "Depok", "Jakarta Barat"]} />
        <SelectFilter label="Rating Minimum" value={String(filters.rating)} onChange={(value) => setFilters((current) => ({ ...current, rating: Number(value) }))} options={["0", "3", "4", "5"]} />
        <SelectFilter label="Tipe Listing" value={filters.type} onChange={(value) => setFilters((current) => ({ ...current, type: value as Filters["type"] }))} options={["all", "sewa", "gratis"]} />
        <SelectFilter label="Level Pemilik" value={filters.level} onChange={(value) => setFilters((current) => ({ ...current, level: value as Filters["level"] }))} options={["all", "gold", "silver", "bronze"]} />
      </div>
      <button className="mt-6 w-full rounded-2xl bg-slate-100 px-4 py-3 font-black" onClick={() => setFilters(defaultFilters)}>
        Reset Semua
      </button>
    </aside>
  );
}

function SelectFilter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <div>
      <h3 className="mb-3 font-black">{label}</h3>
      <select className="w-full rounded-2xl border border-bb-border px-4 py-3 font-bold" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "all" || option === "0" ? "Semua" : option}
          </option>
        ))}
      </select>
    </div>
  );
}

function DetailView({
  product,
  bookingDays,
  setBookingDays,
  onBack,
  onCheckout,
  onWishlist,
}: {
  product: Product;
  bookingDays: number;
  setBookingDays: (days: number) => void;
  onBack: () => void;
  onCheckout: () => void;
  onWishlist: () => void;
}) {
  const subtotal = product.price * bookingDays;
  const fee = subtotal * 0.05;
  const total = subtotal + fee + 2500;
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <button className="mb-5 rounded-full bg-white px-5 py-3 font-black text-bb-blue shadow-card" onClick={onBack}>
        Kembali ke Jelajah
      </button>
      <div className="grid gap-8 lg:grid-cols-[1.25fr_.75fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] bg-white p-4 shadow-card">
            <div className="relative grid h-[360px] place-items-center rounded-[1.5rem]" style={{ background: `linear-gradient(135deg,${product.color}22,${product.color})` }}>
              <ProductIcon product={product} className="h-24 w-24 text-white" />
              <div className="absolute right-5 top-5">
                <StatusBadge status={product.status} />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-20 rounded-2xl" style={{ background: `${product.color}33` }} />
              ))}
            </div>
          </div>
          <article className="rounded-[2rem] bg-white p-6 shadow-card">
            <h1 className="text-3xl font-black">{product.name}</h1>
            <p className="mt-2 font-bold text-bb-muted">★ {product.rating} · {product.reviewCount} ulasan · {product.rentedCount} kali disewa</p>
            <span className="mt-4 inline-flex rounded-full bg-bb-light-blue px-3 py-1 text-sm font-black text-bb-blue">{product.category}</span>
            <p className="mt-5 text-bb-muted">{product.description}</p>
            <div className="mt-6">
              <div className="flex justify-between text-sm font-black">
                <span>Kondisi</span>
                <span>{product.condition}%</span>
              </div>
              <div className="mt-2 h-3 rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-gradient-to-r from-bb-blue to-bb-teal" style={{ width: `${product.condition}%` }} />
              </div>
            </div>
            <h3 className="mt-6 font-black">Kelengkapan</h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {product.includes.map((item) => (
                <span key={item} className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm font-bold">
                  <Check className="h-4 w-4 text-bb-teal" />
                  {item}
                </span>
              ))}
            </div>
            <h3 className="mt-6 font-black">Syarat Pemilik</h3>
            <p className="mt-2 text-bb-muted">{product.notes}</p>
          </article>
        </div>
        <aside className="h-fit rounded-[2rem] bg-white p-6 shadow-card lg:sticky lg:top-28">
          <p className="text-3xl font-black text-bb-blue">
            {rupiah(product.price)} <span className="text-sm text-bb-muted">/hari</span>
          </p>
          {product.type === "both" && <p className="mt-1 font-black text-bb-teal">atau Pinjam Gratis</p>}
          <label className="mt-5 block text-sm font-black">Durasi: {bookingDays} hari</label>
          <input type="range" min={product.minDays} max={product.maxDays} value={bookingDays} onChange={(event) => setBookingDays(Number(event.target.value))} className="mt-3 w-full accent-bb-blue" />
          <div className="mt-5 rounded-3xl bg-slate-50 p-4 text-sm font-bold">
            <div className="flex justify-between">
              <span>{rupiah(product.price)} x {bookingDays} hari</span>
              <strong>{rupiah(subtotal)}</strong>
            </div>
            <div className="mt-2 flex justify-between">
              <span>Komisi 5%</span>
              <strong>{rupiah(fee)}</strong>
            </div>
            <div className="mt-2 flex justify-between">
              <span>Biaya transaksi</span>
              <strong>{rupiah(2500)}</strong>
            </div>
            <div className="my-3 border-t" />
            <div className="flex justify-between">
              <span>Total</span>
              <strong>{rupiah(total)}</strong>
            </div>
            <div className="mt-2 flex justify-between text-bb-blue">
              <span>DP sekarang 50%</span>
              <strong>{rupiah(total / 2)}</strong>
            </div>
          </div>
          <button className="mt-5 w-full rounded-2xl bg-gradient-to-r from-bb-blue to-bb-teal px-5 py-3 font-black text-white" onClick={onCheckout}>
            Sewa Sekarang
          </button>
          <button className="mt-3 w-full rounded-2xl bg-slate-100 px-5 py-3 font-black" onClick={onWishlist}>
            Simpan ke Wishlist
          </button>
          <div className="mt-5 rounded-3xl bg-bb-light-teal p-4">
            <p className="font-black text-bb-teal">Pembayaran Aman</p>
            <p className="mt-1 text-sm text-bb-muted">DP masuk sistem, bukan langsung ke pemilik.</p>
          </div>
          <div className="mt-5 border-t pt-5">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-r from-bb-blue to-bb-teal font-black text-white">{product.owner.initials}</span>
              <div>
                <strong>{product.owner.name}</strong>
                <p className="text-sm text-bb-muted">★ {product.owner.rating} · {product.owner.txCount} transaksi</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-bb-muted">{product.location} · Respons &lt; 1 jam · E-KYC</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function CheckoutView({
  product,
  bookingDays,
  checkoutStep,
  setCheckoutStep,
  total,
  dp,
  coinBalance,
  setCoinBalance,
  showToast,
}: {
  product: Product;
  bookingDays: number;
  checkoutStep: number;
  setCheckoutStep: (step: number) => void;
  total: number;
  dp: number;
  coinBalance: number;
  setCoinBalance: React.Dispatch<React.SetStateAction<number>>;
  showToast: (message: string) => void;
}) {
  const steps = ["Detail", "Bayar DP", "Konfirmasi", "QR COD"];
  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] bg-white p-6 shadow-card">
        <div className="mb-8 grid grid-cols-4 gap-2">
          {steps.map((step, index) => (
            <div key={step} className={`rounded-2xl px-3 py-3 text-center text-sm font-black ${index + 1 <= checkoutStep ? "bg-gradient-to-r from-bb-blue to-bb-teal text-white" : "bg-slate-100 text-bb-muted"}`}>
              Step {index + 1}
              <br />
              {step}
            </div>
          ))}
        </div>
        {checkoutStep === 1 && (
          <div>
            <h1 className="text-2xl font-black">Konfirmasi Detail</h1>
            <p className="mt-2 text-bb-muted">{product.name} · {bookingDays} hari</p>
            <div className="mt-5 rounded-3xl bg-slate-50 p-5 font-bold">
              <div className="flex justify-between">
                <span>Total</span>
                <strong>{rupiah(total)}</strong>
              </div>
              <div className="mt-2 flex justify-between text-bb-blue">
                <span>DP 50%</span>
                <strong>{rupiah(dp)}</strong>
              </div>
            </div>
            <button className="mt-6 rounded-2xl bg-gradient-to-r from-bb-blue to-bb-teal px-6 py-3 font-black text-white" onClick={() => setCheckoutStep(2)}>
              Lanjut ke Pembayaran
            </button>
          </div>
        )}
        {checkoutStep === 2 && (
          <div>
            <h1 className="text-2xl font-black">Bayar DP</h1>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <button className="rounded-2xl bg-bb-light-blue p-5 font-black text-bb-blue">Koin Saldo</button>
              <button className="rounded-2xl bg-bb-light-teal p-5 font-black text-bb-teal">QRIS Baru</button>
            </div>
            <p className="mt-4 font-bold text-bb-muted">Saldo: {coinBalance} koin. DP: {Math.ceil(dp / 1000)} koin.</p>
            <button
              className="mt-6 rounded-2xl bg-gradient-to-r from-bb-blue to-bb-teal px-6 py-3 font-black text-white"
              onClick={() => {
                setCoinBalance((balance) => Math.max(0, balance - Math.ceil(dp / 1000)));
                showToast("Pembayaran berhasil");
                setCheckoutStep(3);
              }}
            >
              Bayar DP Sekarang
            </button>
          </div>
        )}
        {checkoutStep === 3 && (
          <div className="text-center">
            <ShieldCheck className="mx-auto h-16 w-16 text-bb-teal" />
            <h1 className="mt-4 text-2xl font-black">DP berhasil diterima</h1>
            <p className="mt-2 text-bb-muted">Menunggu pemilik mengonfirmasi pesanan kamu.</p>
            <button className="mt-6 rounded-2xl bg-gradient-to-r from-bb-blue to-bb-teal px-6 py-3 font-black text-white" onClick={() => setCheckoutStep(4)}>
              Simulasi Pemilik Konfirmasi
            </button>
          </div>
        )}
        {checkoutStep === 4 && (
          <div className="text-center">
            <h1 className="text-2xl font-black">Terkonfirmasi + QR Serah Terima</h1>
            <p className="mt-2 text-bb-muted">COD di {product.location}. QR berlaku 10 menit.</p>
            <QrMock label="BarangBareng COD QR" />
            <p className="mt-4 font-black text-bb-blue">10:00</p>
          </div>
        )}
      </div>
    </section>
  );
}

function RenterDashboard({ wishlistCount, coinBalance, openTopup, navigate }: { wishlistCount: number; coinBalance: number; openTopup: () => void; navigate: (view: View) => void }) {
  const menu = [
    [Home, "Beranda"],
    [Search, "Cari"],
    [ClipboardList, "Pesanan"],
    [Heart, "Wishlist"],
    [Wallet, "Dompet"],
  ];
  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
      <aside className="hidden rounded-[2rem] bg-white p-4 shadow-card lg:block">
        {menu.map(([Icon, label]) => {
          const MenuIcon = Icon as typeof Home;
          return (
            <button key={label as string} className="mb-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-black hover:bg-bb-light-blue">
              <MenuIcon />
              {label as string}
            </button>
          );
        })}
      </aside>
      <div>
        <div className="rounded-[2rem] bg-white p-6 shadow-card">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-black">Halo, Difa!</h1>
              <p className="mt-1 font-bold text-bb-muted">Silver · 23 transaksi · ★ 4.9</p>
            </div>
            <button className="rounded-2xl bg-gradient-to-r from-bb-blue to-bb-teal px-5 py-3 font-black text-white" onClick={openTopup}>
              + Top Up Koin
            </button>
          </div>
          <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-[76%] rounded-full bg-gradient-to-r from-bb-blue to-bb-teal" />
          </div>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-4">
          {[
            ["Saldo Koin", coinBalance],
            ["Pesanan Aktif", 2],
            ["Total Selesai", 23],
            ["Wishlist", wishlistCount],
          ].map(([label, value]) => (
            <article key={label as string} className="rounded-[2rem] bg-white p-5 shadow-card">
              <p className="text-sm font-bold text-bb-muted">{label as string}</p>
              <strong className="mt-2 block text-3xl font-black">{value}</strong>
            </article>
          ))}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <article className="rounded-[2rem] bg-white p-6 shadow-card">
            <h2 className="text-xl font-black">Pesanan Aktif</h2>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl bg-bb-light-blue p-4">
                <strong>Laptop ASUS VivoBook</strong>
                <p className="text-sm text-bb-muted">Sudah diterima · Sisa 2 hari</p>
                <button className="mt-3 rounded-xl bg-bb-blue px-4 py-2 text-sm font-black text-white">Scan QR Kembali</button>
              </div>
              <div className="rounded-2xl bg-bb-light-teal p-4">
                <strong>Kamera Sony A6000</strong>
                <p className="text-sm text-bb-muted">Menunggu serah terima</p>
                <button className="mt-3 rounded-xl bg-bb-teal px-4 py-2 text-sm font-black text-white">Lihat QR Code</button>
              </div>
            </div>
          </article>
          <article className="rounded-[2rem] bg-white p-6 shadow-card">
            <h2 className="text-xl font-black">Dompet Koin</h2>
            <p className="mt-3 text-4xl font-black text-bb-blue">{coinBalance} Koin</p>
            <p className="text-bb-muted">= {rupiah(coinBalance * 1000)} tersedia</p>
            <button className="mt-5 rounded-2xl bg-bb-light-blue px-4 py-3 font-black text-bb-blue" onClick={() => navigate("browse")}>
              Cari barang lagi
            </button>
          </article>
        </div>
      </div>
    </section>
  );
}

function OwnerDashboard({
  requests,
  onRequestAction,
  openUpload,
}: {
  requests: { id: number; renter: string; item: string; days: number; total: number; rating: number; status: string }[];
  onRequestAction: (id: number, status: string) => void;
  openUpload: () => void;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col justify-between gap-4 rounded-[2rem] bg-white p-6 shadow-card md:flex-row md:items-center">
        <div>
          <p className="font-black text-bb-blue">Dashboard Pemilik</p>
          <h1 className="text-3xl font-black">Kelola barang dan request sewa</h1>
        </div>
        <button className="rounded-2xl bg-gradient-to-r from-bb-blue to-bb-teal px-5 py-3 font-black text-white" onClick={openUpload}>
          + Upload Barang Baru
        </button>
      </div>
      <div className="grid gap-5 md:grid-cols-5">
        {[
          ["Pendapatan Bulan Ini", "Rp1,2jt"],
          ["Barang Aktif", 8],
          ["Request Masuk", requests.filter((request) => request.status === "pending").length],
          ["Selesai Bulan Ini", 18],
          ["Rating", "4.9"],
        ].map(([label, value]) => (
          <article key={label as string} className="rounded-[2rem] bg-white p-5 shadow-card">
            <p className="text-sm font-bold text-bb-muted">{label as string}</p>
            <strong className="mt-2 block text-2xl font-black">{value}</strong>
          </article>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <article className="rounded-[2rem] bg-white p-6 shadow-card">
          <h2 className="text-xl font-black">Listing Barang Saya</h2>
          <div className="mt-4 grid gap-4">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="grid gap-4 rounded-2xl bg-slate-50 p-4 sm:grid-cols-[90px_1fr_auto] sm:items-center">
                <div className="h-20 rounded-2xl" style={{ background: `${product.color}55` }} />
                <div>
                  <strong>{product.name}</strong>
                  <p className="text-sm text-bb-muted">{rupiah(product.price)}/hari · {product.rentedCount} kali disewa · ★ {product.rating}</p>
                  <p className="text-sm font-bold text-bb-teal">Status: Tersedia</p>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-xl bg-white px-3 py-2 text-sm font-black">Edit</button>
                  <button className="rounded-xl bg-white px-3 py-2 text-sm font-black">Statistik</button>
                </div>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-[2rem] bg-white p-6 shadow-card">
          <h2 className="text-xl font-black">Request Masuk</h2>
          <div className="mt-4 grid gap-3">
            {requests.map((request) => (
              <div key={request.id} className="rounded-2xl bg-slate-50 p-4">
                <strong>{request.renter}</strong>
                <p className="text-sm text-bb-muted">minta sewa {request.item}</p>
                <p className="mt-1 text-sm font-bold">{request.days} hari · {rupiah(request.total)} · ★ {request.rating}</p>
                <div className="mt-3 flex gap-2">
                  {request.status === "pending" ? (
                    <>
                      <button className="rounded-xl bg-bb-teal px-3 py-2 text-sm font-black text-white" onClick={() => onRequestAction(request.id, "accepted")}>
                        Terima
                      </button>
                      <button className="rounded-xl bg-red-100 px-3 py-2 text-sm font-black text-red-700" onClick={() => onRequestAction(request.id, "rejected")}>
                        Tolak
                      </button>
                    </>
                  ) : (
                    <span className="font-black text-bb-muted">{request.status}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
      <div className="mt-6 rounded-[2rem] bg-white p-6 shadow-card">
        <h2 className="text-xl font-black">Grafik Pendapatan</h2>
        <div className="mt-6 flex h-56 items-end gap-4">
          {[35, 50, 42, 75, 68, 92].map((height, index) => (
            <div key={index} className="flex flex-1 flex-col items-center gap-2">
              <div className="w-full rounded-t-2xl bg-gradient-to-t from-bb-blue to-bb-teal" style={{ height: `${height}%` }} />
              <span className="text-xs font-black text-bb-muted">B{index + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProfileView() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <article className="rounded-[2rem] bg-white p-6 shadow-card">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <span className="grid h-24 w-24 place-items-center rounded-[2rem] bg-gradient-to-r from-bb-blue to-bb-teal text-3xl font-black text-white">DS</span>
          <div>
            <h1 className="text-3xl font-black">Difa Surya</h1>
            <p className="font-bold text-bb-muted">difa@kampus.ac.id · 0812-0000-0000</p>
            <p className="mt-2">
              <LevelBadge level="silver" /> · 23 transaksi · ★ 4.9
            </p>
          </div>
        </div>
        <div className="mt-6 h-4 rounded-full bg-slate-100">
          <div className="h-full w-[76%] rounded-full bg-gradient-to-r from-bb-blue to-bb-teal" />
        </div>
        <p className="mt-2 text-sm font-bold text-bb-muted">Progress ke Gold: 23/30</p>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {["Email", "HP", "KTP", "Wajah"].map((item) => (
            <div key={item} className="rounded-2xl bg-bb-light-teal p-4 font-black text-bb-teal">✓ {item}</div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {["Silver", "Penyewa Aktif", "Rating Sempurna", "Terverifikasi"].map((item) => (
            <span key={item} className="rounded-full bg-bb-light-blue px-4 py-2 font-black text-bb-blue">{item}</span>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <button className="rounded-2xl bg-bb-blue px-5 py-3 font-black text-white">Edit Profil</button>
          <button className="rounded-2xl bg-slate-100 px-5 py-3 font-black">Ganti Password</button>
          <button className="rounded-2xl bg-slate-100 px-5 py-3 font-black">Notifikasi</button>
        </div>
      </article>
    </section>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="modal open fixed inset-0 z-[80] grid place-items-center bg-slate-950/60 p-4">
      <div className="dialog-panel max-h-[92vh] w-full max-w-xl overflow-auto rounded-[2rem] bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-black">{title}</h2>
          <button className="grid h-10 w-10 place-items-center rounded-full bg-slate-100" onClick={onClose} aria-label="Tutup modal">
            <X />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function QrMock({ label }: { label: string }) {
  return (
    <div className="mx-auto mt-6 w-fit text-center">
      <div
        className="mx-auto h-48 w-48 rounded-3xl border-[14px] border-white bg-white shadow-card"
        style={{
          backgroundImage:
            "linear-gradient(90deg,#1E293B 10px,transparent 10px),linear-gradient(#1E293B 10px,transparent 10px),radial-gradient(circle,#1E293B 35%,transparent 37%)",
          backgroundSize: "24px 24px,24px 24px,42px 42px",
          backgroundPosition: "0 0,0 0,8px 8px",
        }}
      />
      <p className="mt-4 font-bold text-bb-muted">{label}</p>
    </div>
  );
}
