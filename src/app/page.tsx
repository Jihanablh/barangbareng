"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  Heart,
  LogIn,
  Menu,
  Search,
  ShoppingBag,
  ShoppingBasket,
  UserRound,
  X,
} from "lucide-react";

type SpaRoute =
  | "home"
  | "browse"
  | "login"
  | "register"
  | "upload-product"
  | "topup"
  | "dashboard-buyer";

const navItems: { label: string; route: SpaRoute }[] = [
  { label: "Beranda", route: "home" },
  { label: "Jelajah", route: "browse" },
  { label: "Cara Kerja", route: "home" },
  { label: "Pinjam Gratis", route: "home" },
  { label: "Sewakan Barang", route: "upload-product" },
];

export default function HomePage() {
  const [route, setRoute] = useState<SpaRoute>("home");
  const [activeNav, setActiveNav] = useState("Beranda");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");

  const iframeSrc = useMemo(() => {
    const hash = route === "home" ? "#/home" : `#/${route}`;
    return `/spa/index.html${hash}`;
  }, [route]);

  function navigate(nextRoute: SpaRoute, label?: string) {
    setRoute(nextRoute);
    if (label) setActiveNav(label);
    if (nextRoute === "login") setActiveNav("");
    if (nextRoute === "register") setActiveNav("");
    if (nextRoute === "dashboard-buyer") setActiveNav("");
    setDrawerOpen(false);
  }

  function runSearch() {
    navigate("browse", "Jelajah");
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-800">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/60 bg-white/88 shadow-sm shadow-slate-900/[0.04] backdrop-blur-2xl">
        <nav className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <button className="flex shrink-0 items-center gap-3 rounded-2xl outline-none transition focus-visible:ring-4 focus-visible:ring-bb-blue/15" onClick={() => navigate("home", "Beranda")} aria-label="BarangBareng beranda">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-bb-blue to-bb-teal text-white shadow-lg shadow-bb-blue/20">
              <ShoppingBag className="h-5 w-5" />
            </span>
            <span className="text-[1.28rem] font-extrabold tracking-tight">
              <span className="text-bb-blue">Barang</span>
              <span className="text-bb-teal">Bareng</span>
            </span>
          </button>

          <div className="hidden flex-1 items-center justify-center gap-1.5 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.label}
                className={`relative rounded-2xl px-3 py-2 text-[0.92rem] font-extrabold leading-tight outline-none transition focus-visible:ring-4 focus-visible:ring-bb-blue/15 xl:px-4 ${
                  activeNav === item.label
                    ? "bg-bb-light-blue text-bb-blue after:absolute after:inset-x-4 after:-bottom-1 after:h-1 after:rounded-full after:bg-gradient-to-r after:from-bb-blue after:to-bb-teal"
                    : "text-slate-600 hover:bg-bb-light-blue/70 hover:text-bb-blue"
                }`}
                onClick={() => navigate(item.route, item.label)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden w-[300px] shrink-0 items-center gap-2 2xl:flex">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-bb-border bg-white/90 px-3 py-2.5 shadow-sm">
              <Search className="h-4 w-4 text-bb-blue" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") runSearch();
                }}
                className="w-full min-w-0 bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
                placeholder="Cari barang..."
              />
            </label>
            <button className="rounded-2xl bg-gradient-to-r from-bb-blue to-bb-teal px-4 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-bb-blue/15 outline-none transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-bb-blue/20" onClick={runSearch}>
              Cari
            </button>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <button className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-slate-600 shadow-sm outline-none transition hover:text-bb-blue focus-visible:ring-4 focus-visible:ring-bb-blue/15" aria-label="Notifikasi">
              <Bell className="h-5 w-5" />
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-slate-600 shadow-sm outline-none transition hover:text-bb-blue focus-visible:ring-4 focus-visible:ring-bb-blue/15" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-slate-600 shadow-sm outline-none transition hover:text-bb-blue focus-visible:ring-4 focus-visible:ring-bb-blue/15" aria-label="Booking">
              <ShoppingBasket className="h-5 w-5" />
            </button>
            <button className="rounded-full px-3 py-2 text-sm font-extrabold text-slate-600 outline-none transition hover:bg-bb-light-blue hover:text-bb-blue focus-visible:ring-4 focus-visible:ring-bb-blue/15 xl:px-4" onClick={() => navigate("login")}>
              Masuk
            </button>
            <button className="rounded-full bg-gradient-to-r from-bb-blue to-bb-teal px-4 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-bb-blue/15 outline-none transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-bb-blue/20 xl:px-5" onClick={() => navigate("register")}>
              Daftar
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-2xl bg-bb-light-blue text-bb-blue outline-none transition focus-visible:ring-4 focus-visible:ring-bb-blue/15" onClick={() => navigate("dashboard-buyer")} aria-label="Profil">
              <UserRound className="h-5 w-5" />
            </button>
          </div>

          <button className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-sm outline-none focus-visible:ring-4 focus-visible:ring-bb-blue/15 md:hidden" onClick={() => setDrawerOpen((open) => !open)} aria-label="Menu">
            {drawerOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        <div className={`overflow-hidden border-t border-bb-border bg-white transition-all md:hidden ${drawerOpen ? "max-h-[460px]" : "max-h-0"}`}>
          <div className="mx-auto grid max-w-7xl gap-2 px-4 py-4 sm:px-6">
            <label className="mb-2 flex items-center gap-2 rounded-2xl border border-bb-border bg-white px-3 py-3">
              <Search className="h-4 w-4 text-bb-blue" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full bg-transparent text-sm font-semibold outline-none"
                placeholder="Cari barang..."
              />
            </label>
            {navItems.map((item) => (
              <button key={item.label} className="rounded-2xl px-4 py-3 text-left font-bold text-slate-700 hover:bg-bb-light-blue" onClick={() => navigate(item.route, item.label)}>
                {item.label}
              </button>
            ))}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button className="rounded-2xl border border-bb-border px-4 py-3 font-bold text-slate-700" onClick={() => navigate("login")}>
                <LogIn className="mr-2 inline h-4 w-4" />
                Masuk
              </button>
              <button className="rounded-2xl bg-gradient-to-r from-bb-blue to-bb-teal px-4 py-3 font-extrabold text-white" onClick={() => navigate("register")}>
                Daftar
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="pt-[72px]">
        <iframe
          key={iframeSrc}
          title="BarangBareng Marketplace"
          src={iframeSrc}
          className="block h-[calc(100vh-72px)] w-full border-0 bg-[#F8FAFC]"
        />
      </section>
    </main>
  );
}
