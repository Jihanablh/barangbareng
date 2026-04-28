"use client";

import Image from "next/image";
import { Star, ShoppingBag, BadgeCheck } from "lucide-react";
import { products, categories, categoryEmoji, badgeConfig, type Product, type Category } from "../data/products";

interface CatalogProps {
  activeCategory: Category;
  onCategoryChange: (cat: Category) => void;
  onSelectProduct: (product: Product) => void;
}

export default function Catalog({ activeCategory, onCategoryChange, onSelectProduct }: CatalogProps) {
  const filtered =
    activeCategory === "Semua"
      ? products.filter((p) => p.category.includes("Semua"))
      : products.filter((p) => p.category.includes(activeCategory));

  return (
    <section id="catalog" className="py-16 sm:py-24 bg-gradient-to-b from-background via-background to-secondary/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-4">
            🔥 Katalog P2P
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-dark">
            Jelajahi{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Barang Tersedia
            </span>
          </h2>
          <p className="mt-3 text-text-muted leading-relaxed">
            Pilih kategori, temukan barang yang Anda butuhkan, dan langsung sewa dengan mudah.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`tab-${cat.toLowerCase().replace(/\s|&/g, "-")}`}
              onClick={() => onCategoryChange(cat)}
              className={`rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 active:scale-95 ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-primary to-blue-500 text-white shadow-lg shadow-primary/25 scale-105"
                  : "bg-white text-text-muted border border-border hover:border-primary/40 hover:text-primary hover:shadow-md"
              }`}
            >
              {categoryEmoji[cat]} {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((product, i) => {
            const badge = badgeConfig[product.badge];
            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group relative flex flex-col rounded-3xl bg-white border border-border/50 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Tagline Tag */}
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-text-dark shadow-sm">
                  <BadgeCheck size={10} className="text-secondary" />
                  {product.tagline}
                </div>

                {/* Image */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-background to-white overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-5 transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Rating */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-xl bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-semibold shadow-sm">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-text-dark">{product.rating}</span>
                    <span className="text-text-light">({product.reviews})</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-4">
                  <h3 className="text-sm font-bold text-text-dark leading-snug line-clamp-2 mb-1.5 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-xs text-secondary font-semibold mb-3">
                    Pemilik Terverifikasi ✅
                  </p>

                  <p className="text-lg font-bold text-secondary mb-3">
                    {product.price}
                    <span className="text-xs font-normal text-text-muted"> /hari</span>
                  </p>

                  {/* Owner */}
                  <div className="flex items-center gap-2 mb-4 mt-auto">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                      {product.ownerInitial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-text-dark truncate">{product.owner}</p>
                      <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${badge.text}`}>
                        {badge.icon} {badge.label}
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    id={`btn-detail-${product.id}`}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.97]"
                  >
                    <ShoppingBag size={14} />
                    Lihat Detail
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
