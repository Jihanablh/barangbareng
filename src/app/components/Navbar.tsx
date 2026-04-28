"use client";

import { useState, useEffect } from "react";
import { Search, Menu, X, LogIn } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-strong shadow-lg shadow-black/[0.04] border-b border-white/40"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-[72px] items-center justify-between gap-4">
          {/* Logo */}
          <a href="#" className="flex items-center gap-0.5 shrink-0 group" id="logo">
            <span className="text-xl sm:text-2xl font-bold text-primary transition-all duration-200 group-hover:tracking-wide">
              Barang
            </span>
            <span className="text-xl sm:text-2xl font-bold text-secondary transition-all duration-200 group-hover:tracking-wide">
              Bareng
            </span>
          </a>

          {/* Search — desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light group-focus-within:text-primary transition-colors duration-200"
                size={17}
              />
              <input
                id="search-bar"
                type="text"
                placeholder="Cari barang: Kamera, Tenda, PS5..."
                className="w-full rounded-2xl border border-border/80 bg-white/70 pl-11 pr-4 py-2.5 text-sm text-text-dark placeholder:text-text-light outline-none transition-all duration-300 focus:border-primary focus:ring-[3px] focus:ring-primary/10 focus:bg-white"
              />
            </div>
          </div>

          {/* CTA — desktop */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <a
              href="#"
              id="btn-mulai-sewakan"
              className="rounded-2xl bg-gradient-to-r from-secondary to-secondary-dark px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-secondary/20 transition-all duration-300 hover:shadow-xl hover:shadow-secondary/25 hover:-translate-y-0.5 active:scale-95"
            >
              Mulai Sewakan
            </a>
            <a
              href="#"
              id="btn-masuk"
              className="flex items-center gap-2 rounded-2xl border-2 border-border/80 px-5 py-2.5 text-sm font-semibold text-text-dark transition-all duration-300 hover:border-primary hover:text-primary hover:bg-primary/5 active:scale-95"
            >
              <LogIn size={15} />
              Masuk
            </a>
          </div>

          {/* Hamburger — mobile */}
          <button
            id="btn-mobile-menu"
            className="md:hidden p-2 rounded-2xl text-text-dark hover:bg-white/60 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? "max-h-80 pb-5" : "max-h-0"
          }`}
        >
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={17} />
            <input
              type="text"
              placeholder="Cari barang: Kamera, Tenda, PS5..."
              className="w-full rounded-2xl border border-border bg-white pl-11 pr-4 py-2.5 text-sm text-text-dark placeholder:text-text-light outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10"
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <a href="#" className="rounded-2xl bg-gradient-to-r from-secondary to-secondary-dark px-5 py-3 text-sm font-semibold text-white text-center">
              Mulai Sewakan
            </a>
            <a href="#" className="flex items-center justify-center gap-2 rounded-2xl border-2 border-border px-5 py-3 text-sm font-semibold text-text-dark">
              <LogIn size={15} /> Masuk
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
