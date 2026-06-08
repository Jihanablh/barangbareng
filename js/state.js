(function () {
  window.state = {
    currentUser: { name: "Difa Surya", initials: "DS", level: "silver", campus: "Universitas Indonesia" },
    wishlist: [],
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
    toggleWishlist(id) {
      const index = this.wishlist.indexOf(id);
      if (index === -1) this.wishlist.push(id);
      else this.wishlist.splice(index, 1);
    },
    rememberProduct(id) {
      this.selectedProductId = id;
      this.recentlyViewed = [id, ...this.recentlyViewed.filter(item => item !== id)].slice(0, 8);
    }
  };
})();
