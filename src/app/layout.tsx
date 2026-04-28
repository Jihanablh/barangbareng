import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BarangBareng — Akses Barang Impianmu Tanpa Harus Membeli",
  description:
    "Platform sewa-menyewa antar pengguna yang aman, terjangkau, dan praktis. Dilengkapi verifikasi E-KYC, sistem pembayaran Escrow, dan serah terima via QR Code.",
  keywords: [
    "sewa barang",
    "P2P rental",
    "BarangBareng",
    "sewa kamera",
    "sewa PS5",
    "sewa perlengkapan outdoor",
    "rental aman",
    "escrow rental",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${fredoka.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-fredoka bg-background">
        {children}
      </body>
    </html>
  );
}
