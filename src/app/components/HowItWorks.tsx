"use client";

import { ScanFace, ShieldCheck, QrCode } from "lucide-react";

const steps = [
  {
    icon: ScanFace,
    title: "E-KYC Terverifikasi",
    description:
      "Setiap pengguna wajib verifikasi identitas melalui scan KTP & wajah. Keamanan terjamin dari awal.",
    gradient: "from-primary to-blue-400",
    bgLight: "bg-primary/10",
    delay: "animation-delay-100",
  },
  {
    icon: ShieldCheck,
    title: "Aman dengan Escrow",
    description:
      "Pembayaran disimpan aman di escrow. Sistem DP 50% melindungi penyewa & pemilik barang.",
    gradient: "from-secondary to-teal-300",
    bgLight: "bg-secondary/10",
    delay: "animation-delay-300",
  },
  {
    icon: QrCode,
    title: "Serah Terima via QR Code",
    description:
      "Proses COD lebih mudah dan transparan. Scan QR saat serah terima sebagai bukti sah.",
    gradient: "from-violet-500 to-purple-400",
    bgLight: "bg-violet-100",
    delay: "animation-delay-500",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-semibold text-secondary mb-4">
            Trust & Safety
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-dark">
            Cara Kerja{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              BarangBareng
            </span>
          </h2>
          <p className="mt-3 text-text-muted leading-relaxed">
            Kami menjamin keamanan transaksi dengan 3 pilar perlindungan
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`group relative rounded-2xl bg-background/60 border border-border/60 p-8 text-center transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 animate-fade-in-up ${step.delay}`}
            >
              {/* Icon */}
              <div
                className={`mx-auto mb-5 h-16 w-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}
              >
                <step.icon size={30} className="text-white" />
              </div>
              {/* Number */}
              <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-background flex items-center justify-center text-xs font-bold text-text-light border border-border">
                {i + 1}
              </div>
              <h3 className="text-lg font-bold text-text-dark mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
