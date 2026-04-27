"use client";

import { useState, useEffect } from "react";
import { Search, Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-lg shadow-lg shadow-primary/5"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
          {/* Logo */}
          <a href="#" className="flex items-center gap-1 shrink-0 group">
            <span className="text-xl sm:text-2xl font-bold text-primary transition-transform group-hover:scale-105">
              Barang
            </span>
            <span className="text-xl sm:text-2xl font-bold text-secondary transition-transform group-hover:scale-105">
              Bareng
            </span>
          </a>

          {/* Search Bar — desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full group">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors"
                size={18}
              />
              <input
                id="search-bar"
                type="text"
                placeholder="Cari Kamera, Tenda, Buku..."
                className="w-full rounded-xl border border-border bg-white pl-10 pr-4 py-2.5 text-sm text-text-dark placeholder:text-text-light outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* CTA Buttons — desktop */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <a
              href="#"
              id="btn-list-item"
              className="rounded-xl border-2 border-secondary px-5 py-2 text-sm font-semibold text-secondary transition-all hover:bg-secondary hover:text-white hover:shadow-lg hover:shadow-secondary/25 active:scale-95"
            >
              Mulai Sewakan
            </a>
            <a
              href="#"
              id="btn-login"
              className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25 active:scale-95"
            >
              Login / Daftar
            </a>
          </div>

          {/* Hamburger — mobile */}
          <button
            id="btn-mobile-menu"
            className="md:hidden p-2 rounded-xl text-text-dark hover:bg-background transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen ? "max-h-72 pb-4" : "max-h-0"
          }`}
        >
          <div className="relative mb-3">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari Kamera, Tenda, Buku..."
              className="w-full rounded-xl border border-border bg-white pl-10 pr-4 py-2.5 text-sm text-text-dark placeholder:text-text-light outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex flex-col gap-2">
            <a
              href="#"
              className="rounded-xl border-2 border-secondary px-5 py-2.5 text-sm font-semibold text-secondary text-center transition-colors hover:bg-secondary hover:text-white"
            >
              Mulai Sewakan
            </a>
            <a
              href="#"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white text-center transition-colors hover:bg-primary-dark"
            >
              Login / Daftar
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
