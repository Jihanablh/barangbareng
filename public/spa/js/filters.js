(function () {
  function productMatches(product) {
    const filters = state.filters;
    const text = [product.name, product.category, product.subcategory, product.location, product.campus, product.badges.join(" ")].join(" ").toLowerCase();
    const queryOk = !filters.query || text.includes(filters.query.toLowerCase());
    const categoryOk = filters.category === "all" || product.category === filters.category;
    const campusOk = filters.campus === "all" || product.campus === filters.campus;
    const typeOk = filters.type === "all" || product.type === filters.type;
    const levelOk = filters.level === "all" || product.owner.level === filters.level;
    const ratingOk = product.rating >= Number(filters.rating || 0);
    const priceOk = product.price >= filters.priceMin && product.price <= filters.priceMax;
    const quick = filters.quickFilter;
    const quickOk =
      !quick ||
      (quick === "nearby" && product.campus === state.currentUser.campus) ||
      (quick === "today" && product.status === "available") ||
      (quick === "free" && product.type === "pinjam") ||
      (quick === "rating" && product.rating >= 4.8) ||
      (quick === "cheap" && product.price < 25000) ||
      (quick === "kos" && product.badges.includes("Cocok untuk Anak Kos")) ||
      (quick === "event" && product.badges.includes("Event Ready"));
    return queryOk && categoryOk && campusOk && typeOk && levelOk && ratingOk && priceOk && quickOk;
  }

  function sortProducts(list) {
    // USER ACCOUNT FEATURE START
    const sorted = window.sortListingsByUserPriority ? window.sortListingsByUserPriority(list, window.bbUserAccount?.getUsers?.()) : [...list];
    // USER ACCOUNT FEATURE END
    const sort = state.sortBy;
    if (sort === "price-low") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-high") sorted.sort((a, b) => b.price - a.price);
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    if (sort === "rented") sorted.sort((a, b) => b.rentedCount - a.rentedCount);
    if (sort === "newest") sorted.sort((a, b) => b.id - a.id);
    return sorted;
  }

  window.filters = {
    getProducts() {
      return sortProducts(BBData.products.filter(productMatches));
    },
    set(key, value) {
      state.filters[key] = value;
      components.renderBrowse();
    },
    reset() {
      state.filters = { query: "", category: "all", priceMin: 0, priceMax: 200000, location: "all", campus: "all", rating: 0, type: "all", level: "all", availability: "all", quickFilter: null, campuses: [], areas: [], codLocations: [], categories: [], ownerLevels: [], availabilityList: [], listingTypes: [] };
      state.sortBy = "relevant";
      state.browsePage = 1;
      components.renderBrowse();
    }
  };
})();
