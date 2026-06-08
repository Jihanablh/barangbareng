(function () {
  const CART_KEY = "barangbareng_cart";
  const WISHLIST_KEY = "barangbareng_wishlist";

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      return false;
    }
    return true;
  }

  function normalizeWishlist(items) {
    return (Array.isArray(items) ? items : [])
      .map(item => Number(item?.productId ?? item))
      .filter(Number.isFinite);
  }

  function normalizeCart(items) {
    return (Array.isArray(items) ? items : [])
      .map(item => {
        const productId = Number(item?.productId ?? item);
        if (!Number.isFinite(productId)) return null;
        return {
          productId,
          startDate: item?.startDate || null,
          endDate: item?.endDate || null,
          duration: Number(item?.duration || 0),
          note: item?.note || "",
          selected: item?.selected !== false,
          addedAt: item?.addedAt || new Date().toISOString()
        };
      })
      .filter(Boolean);
  }

  const initialWishlist = normalizeWishlist(readJson(WISHLIST_KEY, []));
  const initialCart = normalizeCart(readJson(CART_KEY, []));

  window.state = {
    currentUser: { name: "Difa Surya", initials: "DS", level: "silver", campus: "Universitas Indonesia" },
    wishlist: initialWishlist,
    cart: initialCart,
    coinBalance: 45,
    recentlyViewed: [],
    activeBooking: null,
    notifications: ["DP berhasil diterima", "Pesanan kamu menunggu konfirmasi pemilik", "Jadwal COD sudah ditentukan"],
    appliedVoucher: null,
    selectedProductId: 8,
    bookingDays: 2,
    checkoutStep: 1,
    paymentMethod: "coins",
    topupStep: 1,
    topupAmount: 50000,
    registerStep: 1,
    verification: {
      ktpUploaded: false,
      studentCardUploaded: false,
      selfieDone: false,
      otp: "",
      ocrName: "Difa Surya",
      ocrCampus: "Universitas Indonesia"
    },
    editProductDraft: {},
    productStats: {
      selectedRange: "30 hari",
      calendarMonth: "Juni 2026"
    },
    filters: {
      query: "",
      category: "all",
      priceMin: 0,
      priceMax: 500000,
      location: "all",
      campus: "all",
      rating: 0,
      type: "all",
      level: "all",
      availability: "all",
      quickFilter: null,
      campuses: [],
      areas: [],
      codLocations: [],
      categories: [],
      ownerLevels: [],
      availabilityList: [],
      listingTypes: []
    },
    sortBy: "relevant",
    viewMode: "grid",
    browsePage: 1,
    browseLoading: false,
    set(key, value) { this[key] = value; },
    persistWishlist() {
      writeJson(WISHLIST_KEY, this.wishlist.map(productId => ({ productId, likedAt: new Date().toISOString() })));
      this.refreshNavbar();
    },
    persistCart() {
      writeJson(CART_KEY, this.cart);
      this.refreshNavbar();
    },
    refreshNavbar() {
      window.components?.refreshNavBadges?.();
    },
    isWishlisted(id) {
      return this.wishlist.includes(Number(id));
    },
    toggleWishlist(id) {
      const productId = Number(id);
      const index = this.wishlist.indexOf(productId);
      const liked = index === -1;
      if (liked) this.wishlist.push(productId);
      else this.wishlist.splice(index, 1);
      this.persistWishlist();
      return liked;
    },
    isInCart(id) {
      return this.cart.some(item => item.productId === Number(id));
    },
    addCart(productId, details = {}) {
      const id = Number(productId);
      if (this.isInCart(id)) return false;
      this.cart.push({
        productId: id,
        startDate: details.startDate || null,
        endDate: details.endDate || null,
        duration: Number(details.duration || 0),
        note: details.note || "",
        selected: true,
        addedAt: new Date().toISOString()
      });
      this.persistCart();
      return true;
    },
    updateCartItem(productId, patch) {
      const item = this.cart.find(cartItem => cartItem.productId === Number(productId));
      if (!item) return;
      Object.assign(item, patch);
      this.persistCart();
    },
    removeCart(productId) {
      this.cart = this.cart.filter(item => item.productId !== Number(productId));
      this.persistCart();
    },
    moveCartToWishlist(productId) {
      const id = Number(productId);
      if (!this.isWishlisted(id)) this.wishlist.push(id);
      this.removeCart(id);
      this.persistWishlist();
    },
    wishlistCount() {
      return this.wishlist.length;
    },
    cartCount() {
      return this.cart.length;
    },
    rememberProduct(id) {
      this.selectedProductId = Number(id);
      this.recentlyViewed = [Number(id), ...this.recentlyViewed.filter(item => item !== Number(id))].slice(0, 8);
    }
  };
})();
