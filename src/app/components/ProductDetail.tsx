"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Star,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { type Product, badgeConfig } from "../data/products";

interface Props {
  product: Product;
  onClose: () => void;
}

export default function ProductDetail({ product, onClose }: Props) {
  const badge = badgeConfig[product.badge];
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-[100] overlay-backdrop flex items-center justify-center p-4 sm:p-6 animate-fade-in"
    >
      {/* Modal — fits viewport, NO scroll */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Close button */}
        <button
          id="btn-close-detail"
          suppressHydrationWarning
          onClick={onClose}
          className="absolute top-4 right-4 z-20 h-9 w-9 rounded-full glass-strong border border-border/40 flex items-center justify-center text-text-muted hover:text-text-dark hover:bg-white transition-all duration-200 shadow-sm"
          aria-label="Tutup detail"
        >
          <X size={18} />
        </button>

        {/* Two-column layout — everything visible without scrolling */}
        <div className="grid md:grid-cols-2 max-h-[85vh]">
          {/* Left — Image */}
          <div className="relative bg-gradient-to-br from-background via-white to-secondary/[0.04] flex items-center justify-center p-6 sm:p-10 min-h-[220px] md:min-h-0">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-8 sm:p-12 animate-scale-in"
            />

            {/* Gallery dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {[0, 1, 2, 3].map((d) => (
                <div
                  key={d}
                  className={`h-1.5 rounded-full transition-all ${
                    d === 0
                      ? "w-6 bg-gradient-to-r from-primary to-secondary"
                      : "w-1.5 bg-text-light/30"
                  }`}
                />
              ))}
            </div>

            {/* Tagline pill */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold text-text-dark shadow-md">
              <ShieldCheck size={11} className="text-secondary" />
              {product.tagline}
            </div>

            {/* Condition badge */}
            <div className="absolute top-4 right-12 md:right-4 flex items-center gap-1 rounded-full bg-green-100/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-green-700 shadow-sm">
              ✅ {product.condition}
            </div>
          </div>

          {/* Right — Compact Details (no overflow, everything fits) */}
          <div className="p-5 sm:p-6 md:p-7 flex flex-col justify-between gap-3">
            {/* Title + Rating */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-text-dark leading-snug pr-8">
                {product.name}
              </h2>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, s) => (
                    <Star
                      key={s}
                      size={12}
                      className={
                        s < Math.floor(product.rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-text-light"
                      }
                    />
                  ))}
                  <span className="ml-1 text-xs font-semibold text-text-dark">{product.rating}</span>
                </div>
                <span className="text-[10px] text-text-muted">{product.reviews} ulasan</span>
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-[9px] font-bold text-green-700">
                  Terverifikasi
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="rounded-2xl bg-gradient-to-r from-secondary/[0.06] to-primary/[0.04] border border-secondary/15 px-4 py-3">
              <p className="text-[10px] text-text-muted">Harga sewa per hari</p>
              <p className="text-2xl font-bold text-secondary">
                {product.price}
                <span className="text-xs font-normal text-text-muted"> /hari</span>
              </p>
            </div>

            {/* Description — truncated */}
            <p className="text-xs text-text-muted leading-relaxed line-clamp-3">
              {product.description}
            </p>

            {/* Specs — compact 2x2 grid */}
            <div className="grid grid-cols-2 gap-1.5">
              {product.specs.map((spec, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 rounded-xl bg-background/80 px-2.5 py-2 text-[11px] font-medium text-text-dark"
                >
                  <CheckCircle2 size={12} className="text-secondary shrink-0" />
                  {spec}
                </div>
              ))}
            </div>

            {/* Owner trust card */}
            <div className="rounded-2xl border border-border/60 bg-gradient-to-r from-background/60 to-white p-3 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-md">
                {product.ownerInitial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text-dark">{product.owner}</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${badge.text}`}>
                    {badge.icon} {badge.label}
                  </span>
                  <span className="text-[9px] text-text-light">•</span>
                  <span className="text-[10px] text-text-muted flex items-center gap-0.5">
                    <Star size={9} className="text-amber-400 fill-amber-400" />
                    {product.rating} ({product.reviews})
                  </span>
                </div>
              </div>
              <ChevronRight size={16} className="text-text-light shrink-0" />
            </div>

            {/* CTA */}
            <button
              id="btn-sewa-sekarang"
              suppressHydrationWarning
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-blue-500 to-secondary px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-primary/25 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/35 hover:-translate-y-0.5 active:scale-[0.97]"
            >
              Sewa Sekarang
            </button>
            <p className="text-center text-[9px] text-text-light -mt-1">
              Dilindungi sistem pembayaran aman BarangBareng
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
