"use client";

import { ArrowRight, PackagePlus, TrendingUp, Users, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24"
      style={{
        background:
          "linear-gradient(135deg, #FFFFFF 0%, #F3F4F6 30%, rgba(59,130,246,0.07) 60%, rgba(20,184,166,0.06) 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/[0.06] blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[420px] w-[420px] rounded-full bg-secondary/[0.06] blur-[100px]" />
      {/* Extra decorative dots */}
      <div className="pointer-events-none absolute top-32 right-[15%] h-3 w-3 rounded-full bg-primary/20 animate-pulse-soft" />
      <div className="pointer-events-none absolute top-48 right-[25%] h-2 w-2 rounded-full bg-secondary/25 animate-pulse-soft animation-delay-300" />
      <div className="pointer-events-none absolute bottom-24 left-[10%] h-4 w-4 rounded-full bg-secondary/15 animate-pulse-soft animation-delay-500" />
      <div className="pointer-events-none absolute bottom-40 left-[20%] h-2 w-2 rounded-full bg-primary/20 animate-pulse-soft animation-delay-200" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — copy */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-semibold text-primary mb-6 animate-fade-in border border-primary/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Platform Sewa-Menyewa #1 di Indonesia
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.4rem] font-bold leading-[1.13] text-text-dark animate-fade-in-up">
              Akses Barang Impianmu{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Tanpa Harus Membeli.
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-text-muted leading-relaxed max-w-xl mx-auto lg:mx-0 animate-fade-in-up animation-delay-200">
              Platform sewa-menyewa antar pengguna yang aman, terjangkau, dan
              praktis. Dilengkapi verifikasi{" "}
              <strong className="text-text-dark">E-KYC</strong> dan sistem
              pembayaran{" "}
              <strong className="text-text-dark">Escrow</strong>.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-fade-in-up animation-delay-400">
              <a
                href="#catalog"
                id="cta-cari-item"
                className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-primary to-primary-dark px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-[0.97]"
              >
                Cari Barang
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </a>
              <a
                href="#"
                id="cta-sewakan"
                className="group inline-flex items-center justify-center gap-2.5 rounded-2xl border-2 border-secondary text-secondary px-7 py-3.5 text-sm font-semibold transition-all duration-300 hover:bg-secondary hover:text-white hover:shadow-lg hover:shadow-secondary/20 hover:-translate-y-0.5 active:scale-[0.97]"
              >
                <PackagePlus size={16} />
                Sewakan Barangmu
              </a>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex items-center gap-4 justify-center lg:justify-start animate-fade-in-up animation-delay-600">
              <div className="flex -space-x-2.5">
                {["bg-primary", "bg-secondary", "bg-amber-400", "bg-rose-400", "bg-violet-400"].map(
                  (bg, i) => (
                    <div
                      key={i}
                      className={`h-8 w-8 rounded-full ${bg} ring-2 ring-white flex items-center justify-center text-white text-[10px] font-bold`}
                    >
                      {["A", "R", "D", "S", "M"][i]}
                    </div>
                  )
                )}
              </div>
              <p className="text-sm text-text-muted">
                <span className="font-bold text-text-dark">5,000+</span>{" "}
                pengguna telah bergabung
              </p>
            </div>
          </div>

          {/* Right — illustration */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative animate-float">
              {/* Main glass card */}
              <div className="w-[340px] h-[340px] rounded-3xl glass border border-white/50 shadow-2xl shadow-primary/[0.06] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                    <PackagePlus size={38} className="text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-text-dark">Sewa & Sewakan</p>
                    <p className="text-sm text-text-muted">Antar pengguna, aman & praktis</p>
                  </div>
                </div>
              </div>

              {/* Floating mini-cards */}
              <div className="absolute -top-5 -right-5 glass rounded-2xl p-3 shadow-xl shadow-primary/10 border border-white/50 animate-pulse-soft">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-green-50 flex items-center justify-center">
                    <span className="text-green-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-dark">E-KYC Verified</p>
                    <p className="text-[10px] text-text-muted">Identitas terjamin</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-6 glass rounded-2xl p-3 shadow-xl shadow-secondary/10 border border-white/50 animate-pulse-soft animation-delay-300">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <span className="text-secondary text-sm">🛡️</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-dark">Escrow Aktif</p>
                    <p className="text-[10px] text-text-muted">Dana dilindungi sistem</p>
                  </div>
                </div>
              </div>
              {/* Extra floating card — rating */}
              <div className="absolute top-1/2 -right-16 glass rounded-2xl p-2.5 shadow-lg shadow-amber-500/10 border border-white/50 animate-pulse-soft animation-delay-500">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center text-sm">⭐</div>
                  <div>
                    <p className="text-[10px] font-bold text-text-dark">4.9/5.0</p>
                    <p className="text-[9px] text-text-muted">Kepuasan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ——— Stats Bar (extra embellishment) ——— */}
        <div className="mt-14 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 animate-fade-in-up animation-delay-600">
          {[
            { icon: Users, value: "5,000+", label: "Pengguna Aktif", color: "text-primary" },
            { icon: PackagePlus, value: "12,000+", label: "Barang Tersedia", color: "text-secondary" },
            { icon: ShieldCheck, value: "100%", label: "Transaksi Aman", color: "text-green-600" },
            { icon: TrendingUp, value: "98%", label: "Tingkat Kepuasan", color: "text-amber-500" },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-2xl border border-white/50 p-4 text-center group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <stat.icon size={20} className={`mx-auto mb-2 ${stat.color} transition-transform group-hover:scale-110`} />
              <p className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[11px] text-text-muted font-medium mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
