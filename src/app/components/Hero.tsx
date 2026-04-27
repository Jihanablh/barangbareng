"use client";

import { ArrowRight, Package } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-br from-white via-background to-primary/5 pt-28 pb-16 sm:pt-36 sm:pb-24"
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-[360px] w-[360px] rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — copy */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-6 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Platform Rental #1 untuk Mahasiswa
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.4rem] font-bold leading-tight text-text-dark animate-fade-in-up">
              Sewa Barang Kampus{" "}
              <span className="text-primary">Lebih Mudah</span>,{" "}
              <span className="text-secondary">Murah</span> &{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Aman
              </span>
              .
            </h1>

            <p className="mt-5 text-base sm:text-lg text-text-muted leading-relaxed max-w-lg mx-auto lg:mx-0 animate-fade-in-up animation-delay-200">
              Platform P2P rental antar mahasiswa dengan keamanan{" "}
              <strong className="text-text-dark">E-KYC</strong>,{" "}
              <strong className="text-text-dark">Escrow</strong>, dan kemudahan
              COD via{" "}
              <strong className="text-text-dark">QR Code</strong>.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-fade-in-up animation-delay-400">
              <a
                href="#featured"
                id="cta-cari-barang"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-95"
              >
                Cari Barang
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
              <a
                href="#"
                id="cta-sewakan-barang"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-secondary px-7 py-3.5 text-sm font-semibold text-secondary transition-all hover:bg-secondary hover:text-white hover:shadow-lg hover:shadow-secondary/25 hover:-translate-y-0.5 active:scale-95"
              >
                <Package size={16} />
                Sewakan Barang
              </a>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex items-center gap-4 justify-center lg:justify-start animate-fade-in-up animation-delay-600">
              {/* Stacked avatars */}
              <div className="flex -space-x-2">
                {["bg-primary", "bg-secondary", "bg-amber-400", "bg-rose-400"].map(
                  (bg, i) => (
                    <div
                      key={i}
                      className={`h-8 w-8 rounded-full ${bg} ring-2 ring-white flex items-center justify-center text-white text-[10px] font-bold`}
                    >
                      {["A", "R", "D", "S"][i]}
                    </div>
                  )
                )}
              </div>
              <p className="text-sm text-text-muted">
                <span className="font-bold text-text-dark">2,500+</span>{" "}
                mahasiswa sudah bergabung
              </p>
            </div>
          </div>

          {/* Right — illustration */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative animate-float">
              {/* Main card */}
              <div className="w-80 h-80 rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/5 backdrop-blur-sm border border-white/60 shadow-2xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                    <Package size={40} className="text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-text-dark">
                      Sewa & Sewakan
                    </p>
                    <p className="text-sm text-text-muted">
                      Dari sesama mahasiswa
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating mini-cards */}
              <div className="absolute -top-6 -right-6 rounded-2xl bg-white p-3 shadow-xl shadow-primary/10 animate-pulse-soft">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-dark">
                      E-KYC Verified
                    </p>
                    <p className="text-[10px] text-text-muted">Aman & Terpercaya</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-8 rounded-2xl bg-white p-3 shadow-xl shadow-secondary/10 animate-pulse-soft animation-delay-300">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <span className="text-secondary text-sm">💰</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-dark">
                      Escrow Aktif
                    </p>
                    <p className="text-[10px] text-text-muted">Dana terlindungi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
