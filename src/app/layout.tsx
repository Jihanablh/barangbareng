import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BarangBareng - Sewa Bareng, Hemat Bareng",
  description:
    "Platform sewa dan pinjam barang mahasiswa Indonesia dengan pembayaran aman, verifikasi pengguna, dan QR serah terima.",
  keywords: [
    "sewa barang",
    "pinjam barang",
    "P2P rental",
    "BarangBareng",
    "marketplace mahasiswa",
    "pembayaran aman",
    "QR COD",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-jakarta bg-background">
        {children}
      </body>
    </html>
  );
}
