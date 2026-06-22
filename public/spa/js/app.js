(function () {
  const assetVersion = "20260622-3";
  const componentFallbacks = {
    "#toast-mount": "",
    "#footer-mount": `<footer class="bg-[#0F172A] text-white"><div class="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-400 sm:px-6 lg:px-8"><strong class="text-lg text-white">BarangBareng</strong><p class="mt-2">Marketplace sewa dan pinjam barang mahasiswa.</p></div></footer>`,
    "#navbar-mount": `<nav id="site-navbar" class="fixed inset-x-0 top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-xl"><div class="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8"><button class="gradient-text text-xl font-extrabold" data-nav="home">BarangBareng</button><div class="hidden items-center gap-6 xl:flex"><button class="nav-link" data-nav="home">Beranda</button><button class="nav-link" data-nav="jelajah">Jelajah</button><button class="nav-link" data-nav="upload-product">Sewakan Barang</button></div><div class="ml-auto flex gap-2 xl:hidden"><button class="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-card" data-nav="jelajah" aria-label="Cari barang"><i data-lucide="search" class="h-5 w-5"></i></button><button class="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-card" data-nav="keranjang" aria-label="Keranjang"><i data-lucide="shopping-basket" class="h-5 w-5"></i></button><button id="mobile-menu-btn" class="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-card"><i data-lucide="menu" class="h-5 w-5"></i></button></div></div></nav><aside id="mobile-drawer" class="drawer fixed inset-y-0 left-0 z-[70] bg-white p-5 shadow-lg xl:hidden"><button id="drawer-close" class="mb-4 rounded-full bg-slate-100 px-4 py-2 font-bold">Tutup</button><div class="grid gap-2"><button class="drawer-link" data-nav="home">Beranda</button><button class="drawer-link" data-nav="jelajah">Jelajah</button><button class="drawer-link" data-nav="upload-product">Mulai Sewakan</button></div></aside>`
  };

  window.loadHtml = async function loadHtml(path, fallback = "") {
    try {
      const versionedPath = path.includes("?") ? `${path}&v=${assetVersion}` : `${path}?v=${assetVersion}`;
      const response = await fetch(versionedPath, { cache: "no-store" });
      if (!response.ok) throw new Error(`Failed to load ${path}`);
      return await response.text();
    } catch {
      return fallback;
    }
  };

  async function loadComponent(selector, path) {
    const html = await window.loadHtml(path, componentFallbacks[selector] || "");
    const target = document.querySelector(selector);
    if (target) target.innerHTML = html;
  }

  function bindGlobalNav() {
    components.bindNavEvents();
    function submitNavbarSearch() {
      const query = document.querySelector("#navbar-search")?.value.trim() || "";
      state.filters.query = query;
      router.navigate("jelajah", query ? { query } : {});
    }
    document.querySelectorAll("[data-scroll-target]").forEach(button => {
      button.addEventListener("click", () => {
        if (router.currentView !== "home") {
          router.navigate("home").then(() => document.getElementById(button.dataset.scrollTarget)?.scrollIntoView({ behavior: "smooth" }));
        } else {
          document.getElementById(button.dataset.scrollTarget)?.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
    document.querySelector("[data-navbar-search]")?.addEventListener("click", () => {
      submitNavbarSearch();
    });
    document.querySelector("#navbar-search")?.addEventListener("keydown", event => {
      if (event.key !== "Enter") return;
      submitNavbarSearch();
    });
    document.querySelector("[data-notification-center]")?.addEventListener("click", () => {
      ui.toast(state.notifications?.[0] || "Belum ada notifikasi baru");
      router.navigate("dashboard-buyer");
    });
    const drawer = document.getElementById("mobile-drawer");
    const overlay = document.getElementById("overlay");
    document.getElementById("mobile-menu-btn")?.addEventListener("click", () => {
      drawer?.classList.add("open");
      overlay?.classList.remove("hidden");
    });
    document.getElementById("drawer-close")?.addEventListener("click", closeDrawer);
    overlay?.addEventListener("click", closeDrawer);
    function closeDrawer() {
      drawer?.classList.remove("open");
      overlay?.classList.add("hidden");
    }
    window.addEventListener("scroll", () => {
      document.getElementById("site-navbar")?.classList.add("navbar-glass");
    }, { passive: true });
  }

  window.viewInit = {
    homeStatic: () => {
      components.renderHome();
    },
    home: components.renderHome,
    browse: components.renderBrowse,
    jelajah: components.renderBrowse,
    "product-detail": components.renderDetail,
    keranjang: components.renderCart,
    wishlist: components.renderWishlist,
    disimpan: components.renderWishlist,
    "reviews-create": components.renderReviewCreate,
    checkout: components.renderCheckout,
    login: components.renderLogin,
    register: components.renderRegister,
    "lupa-password": components.renderForgotPassword,
    ekyc: components.renderEkycStart,
    "ekyc-data-diri": components.renderEkycData,
    "ekyc-upload-identitas": components.renderEkycUpload,
    "ekyc-selfie": components.renderEkycSelfie,
    "ekyc-review": components.renderEkycReview,
    "ekyc-success": components.renderEkycSuccess,
    topup: components.renderTopupPage,
    tracking: components.renderTrackingFlow,
    "transaksi-flow": components.renderTransactionFlow,
    "qr-handover": components.renderQrHandover,
    chat: components.renderChatPage,
    "upload-product": components.renderUploadProduct,
    "edit-product": components.renderEditProduct,
    "product-statistics": components.renderProductStatistics,
    "payment-qr": components.renderPaymentQr,
    "payment-dp": components.renderPaymentQr,
    "payment-verification": components.renderPaymentVerification,
    "payment-final": components.renderPaymentFinal,
    "payment-final-alias": components.renderPaymentFinal,
    "transaction-success": components.renderTransactionSuccess,
    "order-detail": components.renderOrderDetail,
    orders: components.renderOrderDetail,
    "serah-terima": components.renderQrHandover,
    "dashboard-buyer": components.renderBuyer,
    "dashboard-seller": components.renderSeller,
    profile: components.renderProfile,
    "pengaturan-akun": components.renderAccountSettings
  };

  async function initApp() {
    await loadComponent("#navbar-mount", "components/navbar.html");
    await loadComponent("#footer-mount", "components/footer.html");
    await loadComponent("#toast-mount", "components/toast.html");
    if (document.querySelector("#home-view")) components.renderHome();
    window.staticHomeHtml = document.querySelector("#app-main")?.innerHTML || "";
    bindGlobalNav();
    window.bbUserAccount?.renderAuthUi?.();
    router.currentView = "home";
    components.bindNavEvents();
    window.bbUserAccount?.renderAuthUi?.();
    if (window.location.hash && window.location.hash !== "#/home") router.hydrateFromHash();
    animations.refresh();
  }

  document.addEventListener("DOMContentLoaded", initApp);
})();
