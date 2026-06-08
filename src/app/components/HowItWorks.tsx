"use client";

import { ScanFace, ShieldCheck, QrCode, Sparkles, Award, Clock, Zap } from "lucide-react";

export default function TrustPillars() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-r from-primary/[0.03] to-secondary/[0.03] blur-[80px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-semibold text-secondary mb-4">
            🔒 Keamanan & Kepercayaan
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-dark">
            Kenapa{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              BarangBareng
            </span>{" "}
            Aman?
          </h2>
          <p className="mt-3 text-text-muted leading-relaxed">
            Tiga pilar keamanan yang menjamin setiap transaksi sewa-menyewa berjalan lancar dan terpercaya.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-5 lg:gap-6">
          {/* Card 1: E-KYC — spans 3 cols, tall */}
          <div className="group md:col-span-3 relative rounded-3xl border border-border/50 bg-gradient-to-br from-white via-white to-primary/[0.04] p-8 lg:p-10 transition-all duration-400 hover:shadow-2xl hover:shadow-primary/8 hover:-translate-y-1 animate-fade-in-up overflow-hidden">
            <div className="bento-shimmer absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="mb-6 h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <ScanFace size={30} className="text-white" />
              </div>
              <div className="absolute top-0 right-0 h-8 w-8 rounded-full bg-background flex items-center justify-center text-xs font-bold text-text-light border border-border/60">
                1
              </div>
              <h3 className="text-xl font-bold text-text-dark mb-2">Verifikasi E-KYC</h3>
              <p className="text-xs font-semibold text-primary mb-3">Identitas Asli, Terjamin Aman</p>
              <p className="text-sm text-text-muted leading-relaxed max-w-md">
                Setiap pengguna wajib melakukan verifikasi identitas melalui pemindaian KTP dan pengenalan wajah.
                Sistem liveness detection memastikan tidak ada pemalsuan identitas.
              </p>
              {/* Mini stats */}
              <div className="flex items-center gap-4 mt-6 pt-5 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-dark">99.8%</p>
                    <p className="text-[10px] text-text-muted">Akurasi</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-border/40" />
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <Award size={14} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-dark">5,000+</p>
                    <p className="text-[10px] text-text-muted">Terverifikasi</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-border/40" />
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
                    <Clock size={14} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-dark">&lt;2 min</p>
                    <p className="text-[10px] text-text-muted">Proses</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column — 2 stacked cards */}
          <div className="md:col-span-3 flex flex-col gap-5 lg:gap-6">
            {/* Card 2: Pembayaran Aman */}
            <div className="group relative flex-1 rounded-3xl border border-border/50 bg-gradient-to-br from-white via-white to-secondary/[0.04] p-7 lg:p-8 transition-all duration-400 hover:shadow-2xl hover:shadow-secondary/8 hover:-translate-y-1 animate-fade-in-up animation-delay-200 overflow-hidden">
              <div className="bento-shimmer absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex gap-5 items-start">
                <div className="shrink-0 h-14 w-14 rounded-2xl bg-gradient-to-br from-secondary to-teal-300 flex items-center justify-center shadow-lg shadow-secondary/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <ShieldCheck size={26} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-lg font-bold text-text-dark">Pembayaran Aman</h3>
                    <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">DP 50%</span>
                    <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Tercatat</span>
                  </div>
                  <p className="text-xs font-semibold text-secondary mb-2">Dana Ditahan Hingga Serah Terima</p>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Dana pembayaran disimpan dengan aman di sistem BarangBareng.
                    Uang baru diteruskan ke pemilik setelah serah terima berhasil dikonfirmasi.
                  </p>
                </div>
              </div>
              <div className="absolute top-4 right-4 h-7 w-7 rounded-full bg-background flex items-center justify-center text-[10px] font-bold text-text-light border border-border/60">
                2
              </div>
            </div>

            {/* Card 3: QR Code */}
            <div className="group relative flex-1 rounded-3xl border border-border/50 bg-gradient-to-br from-white via-white to-violet-500/[0.04] p-7 lg:p-8 transition-all duration-400 hover:shadow-2xl hover:shadow-violet-500/8 hover:-translate-y-1 animate-fade-in-up animation-delay-400 overflow-hidden">
              <div className="bento-shimmer absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex gap-5 items-start">
                <div className="shrink-0 h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center shadow-lg shadow-violet-500/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <QrCode size={26} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-lg font-bold text-text-dark">Serah Terima via QR Code</h3>
                    <span className="text-[10px] font-bold text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full">📱 Instant</span>
                  </div>
                  <p className="text-xs font-semibold text-violet-600 mb-2">Validasi COD yang Praktis & Aman</p>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Cukup pindai QR Code saat bertemu langsung.
                    Bukti serah terima tercatat otomatis di sistem, menghilangkan potensi perselisihan.
                  </p>
                </div>
              </div>
              <div className="absolute top-4 right-4 h-7 w-7 rounded-full bg-background flex items-center justify-center text-[10px] font-bold text-text-light border border-border/60">
                3
              </div>
            </div>
          </div>

          {/* Bottom banner — full width accent */}
          <div className="md:col-span-6 rounded-3xl bg-gradient-to-r from-primary/[0.06] via-secondary/[0.04] to-primary/[0.06] border border-border/30 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in-up animation-delay-500">
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-secondary shrink-0" />
              <p className="text-sm text-text-dark font-medium">
                Semua transaksi dilindungi oleh <strong className="text-primary">BarangBareng Guarantee</strong> — jaminan keamanan penuh dari awal hingga akhir.
              </p>
            </div>
            <a
              href="#catalog"
              className="shrink-0 rounded-2xl bg-gradient-to-r from-primary to-primary-dark px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
            >
              Mulai Sewa Sekarang
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
