(function () {
  const CART_KEY = "barangbareng_cart";
  const WISHLIST_KEY = "barangbareng_wishlist";
  const REVIEWS_KEY = "barangbareng_reviews";
  const REVIEW_LIKES_KEY = "barangbareng_review_likes";

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
  const seededReviews = (window.BBData?.products || []).flatMap(product => (product.reviews || []).map((review, index) => ({
    id: `seed-${product.id}-${index}`,
    transactionId: `SEED-${product.id}-${index}`,
    itemId: product.id,
    ownerId: product.owner.initials,
    reviewerId: review.initials,
    reviewerName: review.name,
    reviewerInitials: review.initials,
    itemRating: Number(review.rating || product.rating || 5),
    ownerRating: Number(product.owner.rating || 4.8),
    itemConditionRating: Math.round(review.rating || 5),
    itemDescriptionMatchRating: Math.round(review.rating || 5),
    itemOverallRating: Math.round(review.rating || 5),
    ownerResponsivenessRating: Math.round(product.owner.rating || 5),
    ownerPunctualityRating: Math.round(product.owner.rating || 5),
    ownerFriendlinessRating: Math.round(product.owner.rating || 5),
    title: index === 0 ? "Barang sesuai deskripsi" : "Pengalaman sewa menyenangkan",
    comment: review.text,
    images: index === 0 ? [product.gallery?.[0] || product.image] : [],
    isItemMatchDescription: true,
    willRentAgain: index !== 1,
    likeCount: 8 + product.id + index,
    createdAt: review.date || "2 hari lalu",
    verified: true
  })));
  const initialReviews = readJson(REVIEWS_KEY, seededReviews);
  const initialReviewLikes = readJson(REVIEW_LIKES_KEY, []);

  window.state = {
    currentUser: { name: "Difa Surya", initials: "DS", level: "silver", campus: "Universitas Indonesia" },
    wishlist: initialWishlist,
    cart: initialCart,
    reviews: Array.isArray(initialReviews) ? initialReviews : seededReviews,
    reviewLikes: Array.isArray(initialReviewLikes) ? initialReviewLikes : [],
    reviewSort: "latest",
    reviewFilter: "all",
    reviewUploads: [],
    reviewDraft: {
      itemConditionRating: 5,
      itemDescriptionMatchRating: 5,
      itemOverallRating: 5,
      ownerResponsivenessRating: 5,
      ownerPunctualityRating: 5,
      ownerFriendlinessRating: 5,
      title: "",
      comment: "",
      isItemMatchDescription: true,
      willRentAgain: true
    },
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
    persistReviews() {
      writeJson(REVIEWS_KEY, this.reviews);
    },
    persistReviewLikes() {
      writeJson(REVIEW_LIKES_KEY, this.reviewLikes);
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
    reviewsForItem(productId) {
      return this.reviews.filter(review => Number(review.itemId) === Number(productId));
    },
    reviewsForOwner(ownerId) {
      return this.reviews.filter(review => String(review.ownerId) === String(ownerId));
    },
    reviewedTransaction(transactionId) {
      return this.reviews.some(review => String(review.transactionId) === String(transactionId));
    },
    canReview(transactionId) {
      if ((this.orderStatus || "DP_PAID") !== "COMPLETED") return { canReview: false, reason: "Transaksi belum selesai, jadi kamu belum bisa memberikan ulasan." };
      if (this.reviewedTransaction(transactionId)) return { canReview: false, reason: "Kamu sudah memberikan ulasan untuk transaksi ini." };
      return { canReview: true, reason: null };
    },
    resetReviewDraft() {
      this.reviewUploads = [];
      this.reviewDraft = {
        itemConditionRating: 5,
        itemDescriptionMatchRating: 5,
        itemOverallRating: 5,
        ownerResponsivenessRating: 5,
        ownerPunctualityRating: 5,
        ownerFriendlinessRating: 5,
        title: "",
        comment: "",
        isItemMatchDescription: true,
        willRentAgain: true
      };
    },
    submitReview(transactionId, product) {
      const eligibility = this.canReview(transactionId);
      if (!eligibility.canReview) return { success: false, message: eligibility.reason };
      const draft = this.reviewDraft;
      const title = String(draft.title || "").trim();
      const comment = String(draft.comment || "").trim();
      if (title.length < 5 || title.length > 100) return { success: false, message: "Judul review wajib 5-100 karakter." };
      if (!comment || comment.length > 500) return { success: false, message: "Isi review wajib diisi dan maksimal 500 karakter." };
      const itemRating = Number(((Number(draft.itemConditionRating) + Number(draft.itemDescriptionMatchRating) + Number(draft.itemOverallRating)) / 3).toFixed(1));
      const ownerRating = Number(((Number(draft.ownerResponsivenessRating) + Number(draft.ownerPunctualityRating) + Number(draft.ownerFriendlinessRating)) / 3).toFixed(1));
      const review = {
        id: `rv-${Date.now()}`,
        transactionId,
        itemId: product.id,
        ownerId: product.owner.initials,
        reviewerId: this.currentUser.initials,
        reviewerName: this.currentUser.name,
        reviewerInitials: this.currentUser.initials,
        itemRating,
        ownerRating,
        itemConditionRating: Number(draft.itemConditionRating),
        itemDescriptionMatchRating: Number(draft.itemDescriptionMatchRating),
        itemOverallRating: Number(draft.itemOverallRating),
        ownerResponsivenessRating: Number(draft.ownerResponsivenessRating),
        ownerPunctualityRating: Number(draft.ownerPunctualityRating),
        ownerFriendlinessRating: Number(draft.ownerFriendlinessRating),
        title,
        comment,
        images: this.reviewUploads.map(file => file.preview),
        isItemMatchDescription: Boolean(draft.isItemMatchDescription),
        willRentAgain: Boolean(draft.willRentAgain),
        likeCount: 0,
        createdAt: "Baru saja",
        verified: true
      };
      this.reviews.unshift(review);
      this.orderReviewed = true;
      this.reviewedAt = new Date().toISOString();
      this.persistReviews();
      this.resetReviewDraft();
      return { success: true, review };
    },
    toggleReviewLike(reviewId) {
      const id = String(reviewId);
      const index = this.reviewLikes.indexOf(id);
      const liked = index === -1;
      if (liked) this.reviewLikes.push(id);
      else this.reviewLikes.splice(index, 1);
      const review = this.reviews.find(item => String(item.id) === id);
      if (review) review.likeCount = Math.max(0, Number(review.likeCount || 0) + (liked ? 1 : -1));
      this.persistReviewLikes();
      this.persistReviews();
      return liked;
    },
    rememberProduct(id) {
      this.selectedProductId = Number(id);
      this.recentlyViewed = [Number(id), ...this.recentlyViewed.filter(item => item !== Number(id))].slice(0, 8);
    }
  };
})();
