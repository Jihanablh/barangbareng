"use client";

import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-text-dark py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-0.5">
            <span className="text-lg font-bold text-primary">Barang</span>
            <span className="text-lg font-bold text-secondary">Bareng</span>
          </div>
          <p className="text-sm text-gray-400 flex items-center gap-1">
            Dibuat dengan{" "}
            <Heart size={14} className="text-rose-400 fill-rose-400" /> untuk
            generasi yang lebih cerdas dalam memiliki.
          </p>
          <p className="text-xs text-gray-500">
            © 2026 BarangBareng. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
