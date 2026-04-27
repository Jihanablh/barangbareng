import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BarangBareng — Sewa Barang Kampus Lebih Mudah, Murah & Aman",
  description:
    "Platform P2P rental antar mahasiswa dengan keamanan E-KYC, Escrow, dan kemudahan COD via QR Code. Sewa kamera, tenda, kalkulator, kebaya wisuda dan lainnya dari sesama mahasiswa.",
  keywords: [
    "sewa barang kampus",
    "rental mahasiswa",
    "P2P rental",
    "BarangBareng",
    "sewa kamera",
    "sewa tenda",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${fredoka.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-fredoka">{children}</body>
    </html>
  );
}
