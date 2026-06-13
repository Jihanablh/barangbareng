(function () {
  function productMatches(product) {
    const filters = state.filters;
    const text = [product.name, product.category, product.subcategory, product.location, product.campus, product.description, product.searchText, product.badges.join(" "), ...(product.tags || [])].join(" ").toLowerCase();
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
      (quick === "kos" && (product.category.includes("Kos") || product.badges.includes("Cocok Anak Kos") || product.tags?.includes("anak kos"))) ||
      (quick === "event" && (product.category.includes("Event") || product.badges.includes("Event Ready") || product.tags?.includes("event"))) ||
      (quick === "wisuda" && (product.category.includes("Wisuda") || product.tags?.includes("wisuda") || product.tags?.includes("sidang"))) ||
      (quick === "organisasi" && (product.category.includes("Organisasi") || product.badges.includes("Organisasi") || product.tags?.includes("organisasi")));
    return queryOk && categoryOk && campusOk && typeOk && levelOk && ratingOk && priceOk && quickOk;
  }

  function sortProducts(list) {
    // USER ACCOUNT FEATURE START
    const sorted = window.sortListingsByUserPriority ? window.sortListingsByUserPriority(list, window.bbUserAccount?.getUsers?.()) : [...list];
    // USER ACCOUNT FEATURE END
    const sort = state.sortBy;
    const query = String(state.filters.query || "").trim().toLowerCase();
    if (query && sort === "relevant") sorted.sort((a, b) => relevanceScore(b, query) - relevanceScore(a, query));
    if (sort === "price-low") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-high") sorted.sort((a, b) => b.price - a.price);
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    if (sort === "rented") sorted.sort((a, b) => b.rentedCount - a.rentedCount);
    if (sort === "newest") sorted.sort((a, b) => b.id - a.id);
    return sorted;
  }

  function relevanceScore(product, query) {
    const tags = (product.tags || []).join(" ").toLowerCase();
    const badges = (product.badges || []).join(" ").toLowerCase();
    return [
      product.name?.toLowerCase().includes(query) ? 70 : 0,
      product.category?.toLowerCase().includes(query) ? 60 : 0,
      tags.includes(query) ? 55 : 0,
      product.subcategory?.toLowerCase().includes(query) ? 40 : 0,
      badges.includes(query) ? 30 : 0,
      product.description?.toLowerCase().includes(query) ? 10 : 0,
      product.rating || 0
    ].reduce((sum, value) => sum + value, 0);
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
