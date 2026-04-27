"use client";

import Image from "next/image";
import { Star, ShoppingBag } from "lucide-react";

const badgeConfig = {
  Gold: { text: "text-amber-700", icon: "🥇" },
  Silver: { text: "text-gray-600", icon: "🥈" },
  Bronze: { text: "text-orange-700", icon: "🥉" },
};

type BadgeType = keyof typeof badgeConfig;

const products = [
  { name: "Kamera DSLR Canon EOS 200D", image: "/dslr_camera.png", price: "Rp 75.000", owner: "Andi Pratama", ownerInitial: "A", badge: "Gold" as BadgeType, rating: 4.9 },
  { name: "Kalkulator Ilmiah Casio FX-991", image: "/scientific_calculator.png", price: "Rp 10.000", owner: "Rina Sari", ownerInitial: "R", badge: "Silver" as BadgeType, rating: 4.7 },
  { name: "Tenda Camping 4 Orang", image: "/camping_tent.png", price: "Rp 50.000", owner: "Doni Kurniawan", ownerInitial: "D", badge: "Gold" as BadgeType, rating: 4.8 },
  { name: "Kebaya Wisuda Elegant", image: "/graduation_kebaya.png", price: "Rp 25.000", owner: "Siti Nurhaliza", ownerInitial: "S", badge: "Bronze" as BadgeType, rating: 4.6 },
];

const delays = ["animation-delay-100", "animation-delay-200", "animation-delay-300", "animation-delay-400"];

export default function FeaturedItems() {
  return (
    <section id="featured" className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-4">Populer Minggu Ini</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-dark">Barang <span className="text-primary">Unggulan</span></h2>
          <p className="mt-3 text-text-muted leading-relaxed">Pilihan barang paling diminati mahasiswa minggu ini</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => {
            const badge = badgeConfig[product.badge];
            return (
              <div key={i} className={`group relative flex flex-col rounded-2xl bg-white border border-border/60 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/8 hover:-translate-y-1 animate-fade-in-up ${delays[i]}`}>
                <div className="relative aspect-[4/3] bg-gradient-to-br from-background to-white overflow-hidden">
                  <Image src={product.image} alt={product.name} fill className="object-contain p-4 transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-3 left-3 flex items-center gap-1 rounded-lg bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-semibold shadow-sm">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-text-dark">{product.rating}</span>
                  </div>
                </div>
                <div className="flex flex-col flex-1 p-4">
                  <h3 className="text-sm font-bold text-text-dark leading-snug line-clamp-2 mb-2">{product.name}</h3>
                  <p className="text-base font-bold text-secondary mb-3">{product.price} <span className="text-xs font-normal text-text-muted">/ hari</span></p>
                  <div className="flex items-center gap-2 mb-4 mt-auto">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-[10px] font-bold shrink-0">{product.ownerInitial}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-text-dark truncate">{product.owner}</p>
                      <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${badge.text}`}>{badge.icon} {product.badge} Member</span>
                    </div>
                  </div>
                  <button id={`btn-sewa-${i}`} className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark hover:shadow-md hover:shadow-primary/20 active:scale-[0.97]">
                    <ShoppingBag size={14} />
                    Sewa Sekarang
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <a href="#" id="btn-view-all" className="inline-flex items-center gap-2 rounded-2xl border-2 border-primary px-6 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20 active:scale-95">
            Lihat Semua Barang <span className="text-lg">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
