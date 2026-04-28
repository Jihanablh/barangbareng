"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Star,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Calendar,
  MapPin,
} from "lucide-react";
import { type Product, badgeConfig } from "../data/products";

interface Props {
  product: Product;
  onClose: () => void;
}

export default function ProductDetail({ product, onClose }: Props) {
  const badge = badgeConfig[product.badge];
  const overlayRef = useRef<HTMLDivElement>(null);

  /* close on Escape */
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

  /* close when clicking backdrop */
  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-[100] overlay-backdrop flex justify-end animate-fade-in"
    >
      {/* Sliding Drawer */}
      <div className="relative w-full max-w-4xl h-full bg-white shadow-2xl animate-slide-in-right drawer-scroll overflow-y-auto">
        {/* Close button */}
        <button
          id="btn-close-detail"
          onClick={onClose}
          className="sticky top-4 float-right mr-4 mt-4 z-20 h-10 w-10 rounded-full glass-strong border border-border/40 flex items-center justify-center text-text-muted hover:text-text-dark hover:bg-white transition-all duration-200 shadow-sm"
          aria-label="Tutup detail"
        >
          <X size={18} />
        </button>

        {/* Content — Two-column on desktop */}
        <div className="grid lg:grid-cols-2 min-h-full">
          {/* Left — Image Gallery */}
          <div className="relative bg-gradient-to-br from-background via-white to-secondary/[0.04] lg:sticky lg:top-0 lg:h-screen flex flex-col">
            {/* Main Image */}
            <div className="relative flex-1 min-h-[320px] lg:min-h-0 flex items-center justify-center p-8 sm:p-12">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-8 sm:p-14 animate-scale-in"
              />
            </div>

            {/* Gallery dots */}
            <div className="flex items-center justify-center gap-2 pb-6">
              {[0, 1, 2, 3].map((d) => (
                <div
                  key={d}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    d === 0
                      ? "w-8 bg-gradient-to-r from-primary to-secondary"
                      : "w-2 bg-text-light/30 hover:bg-text-light/50"
                  }`}
                />
              ))}
            </div>

            {/* Tagline pill */}
            <div className="absolute top-6 left-6 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-bold text-text-dark shadow-md">
              <ShieldCheck size={12} className="text-secondary" />
              {product.tagline}
            </div>
          </div>

          {/* Right — Details */}
          <div className="p-6 sm:p-8 lg:p-10 flex flex-col gap-6 lg:overflow-y-auto">
            {/* Title */}
            <div className="animate-fade-in-up">
              <h2 className="text-xl sm:text-2xl lg:text-[1.7rem] font-bold text-text-dark leading-snug">
                {product.name}
              </h2>
              {/* Rating + verified */}
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, s) => (
                    <Star
                      key={s}
                      size={14}
                      className={
                        s < Math.floor(product.rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-text-light"
                      }
                    />
                  ))}
                  <span className="ml-1 text-sm font-semibold text-text-dark">
                    {product.rating}
                  </span>
                </div>
                <span className="text-xs text-text-muted">
                  {product.reviews} ulasan
                </span>
                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-bold text-green-700">
                  ✅ Listing Terverifikasi
                </span>
              </div>
            </div>

            {/* Price highlight */}
            <div className="rounded-2xl bg-gradient-to-r from-secondary/[0.06] to-primary/[0.04] border border-secondary/15 p-5 animate-fade-in-up animation-delay-100">
              <p className="text-xs text-text-muted mb-1">Harga sewa per hari</p>
              <p className="text-3xl font-bold text-secondary">
                {product.price}
                <span className="text-sm font-normal text-text-muted"> /hari</span>
              </p>
            </div>

            {/* Description */}
            <div className="animate-fade-in-up animation-delay-200">
              <h3 className="text-sm font-bold text-text-dark mb-2">Deskripsi</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specs Grid */}
            <div className="animate-fade-in-up animation-delay-300">
              <h3 className="text-sm font-bold text-text-dark mb-3">Spesifikasi</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.specs.map((spec, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-2xl bg-background/80 px-3.5 py-2.5 text-xs font-medium text-text-dark"
                  >
                    <CheckCircle2 size={14} className="text-secondary shrink-0" />
                    {spec}
                  </div>
                ))}
              </div>
            </div>

            {/* Condition */}
            <div className="flex items-center gap-2 text-sm animate-fade-in-up animation-delay-300">
              <ShieldCheck size={16} className="text-primary" />
              <span className="font-semibold text-text-dark">Kondisi:</span>
              <span className="text-text-muted">{product.condition}</span>
            </div>

            {/* Owner trust card */}
            <div className="rounded-2xl border border-border/60 bg-gradient-to-r from-background/60 to-white p-4 flex items-center gap-4 animate-fade-in-up animation-delay-400">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-md">
                {product.ownerInitial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text-dark">{product.owner}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-semibold ${badge.text}`}
                  >
                    {badge.icon} {badge.label}
                  </span>
                  <span className="text-[10px] text-text-light">•</span>
                  <span className="text-xs text-text-muted flex items-center gap-0.5">
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    {product.rating} ({product.reviews})
                  </span>
                </div>
              </div>
              <ChevronRight size={18} className="text-text-light shrink-0" />
            </div>

            {/* Booking summary */}
            <div className="rounded-2xl border border-primary/15 bg-primary/[0.03] p-5 space-y-3 animate-fade-in-up animation-delay-500">
              <h3 className="text-sm font-bold text-text-dark">Ringkasan Pemesanan</h3>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted flex items-center gap-1.5">
                  <Calendar size={14} />
                  Durasi sewa
                </span>
                <span className="font-semibold text-text-dark">1 hari</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted flex items-center gap-1.5">
                  <MapPin size={14} />
                  Metode serah terima
                </span>
                <span className="font-semibold text-text-dark">COD + QR Code</span>
              </div>
              <div className="border-t border-border/40 pt-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-text-dark">Total estimasi</span>
                <span className="text-xl font-bold text-secondary">{product.price}</span>
              </div>
            </div>

            {/* CTA */}
            <div className="sticky bottom-0 bg-white pt-2 pb-4 animate-fade-in-up animation-delay-600">
              <button
                id="btn-sewa-sekarang"
                className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-primary via-blue-500 to-secondary px-8 py-4 text-base font-bold text-white shadow-xl shadow-primary/25 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/35 hover:-translate-y-0.5 active:scale-[0.97]"
              >
                Sewa Sekarang
              </button>
              <p className="text-center text-[10px] text-text-light mt-2">
                Dilindungi sistem Escrow BarangBareng
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
