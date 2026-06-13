(function () {
  const fallbackPages = {
    home: '<section id="home-view" data-view="home"></section>',
    browse: '<section id="browse-view" data-view="browse"></section>',
    jelajah: '<section id="browse-view" data-view="jelajah"></section>',
    "product-detail": '<section id="detail-view" data-view="product-detail"></section>',
    keranjang: '<section id="cart-view" data-view="keranjang"></section>',
    wishlist: '<section id="wishlist-view" data-view="wishlist"></section>',
    disimpan: '<section id="wishlist-view" data-view="disimpan"></section>',
    "reviews-create": '<section id="review-create-view" data-view="reviews-create"></section>',
    checkout: '<section id="checkout-view" data-view="checkout"></section>',
    login: '<section id="login-view" data-view="login"></section>',
    register: '<section id="register-view" data-view="register"></section>',
    topup: '<section id="topup-view" data-view="topup"></section>',
    "qr-handover": '<section id="qr-handover-view" data-view="qr-handover"></section>',
    chat: '<section id="chat-view" data-view="chat"></section>',
    "upload-product": '<section id="upload-product-view" data-view="upload-product"></section>',
    "edit-product": '<section id="edit-product-view" data-view="edit-product"></section>',
    "product-statistics": '<section id="product-statistics-view" data-view="product-statistics"></section>',
    "payment-qr": '<section id="payment-qr-view" data-view="payment-qr"></section>',
    "payment-dp": '<section id="payment-dp-view" data-view="payment-dp"></section>',
    "payment-verification": '<section id="payment-verification-view" data-view="payment-verification"></section>',
    "payment-final": '<section id="payment-final-view" data-view="payment-final"></section>',
    "payment-final-alias": '<section id="payment-final-alias-view" data-view="payment-final-alias"></section>',
    "transaction-success": '<section id="transaction-success-view" data-view="transaction-success"></section>',
    "order-detail": '<section id="order-detail-view" data-view="order-detail"></section>',
    orders: '<section id="orders-view" data-view="orders"></section>',
    "serah-terima": '<section id="serah-terima-view" data-view="serah-terima"></section>',
    "dashboard-buyer": '<section id="buyer-view" data-view="dashboard-buyer"></section>',
    "dashboard-seller": '<section id="seller-view" data-view="dashboard-seller"></section>',
    profile: '<section id="profile-view" data-view="profile"></section>',
    "pengaturan-akun": '<section id="account-settings-view" data-view="pengaturan-akun"></section>'
  };

  window.router = {
    currentView: "home",
    params: {},
    views: {
      home: "partials/home.html",
      browse: "partials/browse.html",
      jelajah: "partials/browse.html",
      "product-detail": "partials/product-detail.html",
      keranjang: "partials/keranjang.html",
      wishlist: "partials/wishlist.html",
      disimpan: "partials/wishlist.html",
      "reviews-create": "partials/reviews-create.html",
      checkout: "partials/checkout.html",
      login: "partials/login.html",
      register: "partials/register.html",
      topup: "partials/topup.html",
      "qr-handover": "partials/qr-handover.html",
      chat: "partials/chat.html",
      "upload-product": "partials/upload-product.html",
      "edit-product": "partials/edit-product.html",
      "product-statistics": "partials/product-statistics.html",
      "payment-qr": "partials/payment-qr.html",
      "payment-dp": "partials/payment-qr.html",
      "payment-verification": "partials/payment-verification.html",
      "payment-final": "partials/payment-final.html",
      "payment-final-alias": "partials/payment-final.html",
      "transaction-success": "partials/transaction-success.html",
      "order-detail": "partials/order-detail.html",
      orders: "partials/order-detail.html",
      "serah-terima": "partials/qr-handover.html",
      "dashboard-buyer": "partials/dashboard-buyer.html",
      "dashboard-seller": "partials/dashboard-seller.html",
      profile: "partials/profile.html",
      "pengaturan-akun": "partials/pengaturan-akun.html"
    },
    async navigate(viewName, params = {}) {
      const path = this.views[viewName];
      if (!path) return;
      this.params = params;
      if (params.productId && Number.isFinite(Number(params.productId))) state.rememberProduct(Number(params.productId));
      const hashParam = params.productId ? `/${params.productId}` : "";
      const queryParam = params.query ? `?q=${encodeURIComponent(params.query)}` : "";
      const nextHash = `#/${viewName}${hashParam}${queryParam}`;
      if (window.location.hash !== nextHash) history.pushState({ viewName, params }, "", nextHash);

      const mainEl = document.querySelector("#app-main");
      if (viewName === "home" && window.staticHomeHtml) {
        mainEl.innerHTML = window.staticHomeHtml;
        mainEl.dataset.staticHome = "true";
        this.currentView = "home";
        viewInit.homeStatic?.();
        animations.refresh();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      delete mainEl.dataset.staticHome;
      mainEl.classList.add("page-exit");
      await new Promise(resolve => setTimeout(resolve, 140));
      mainEl.innerHTML = await window.loadHtml(path, fallbackPages[viewName]);
      mainEl.classList.remove("page-exit");
      mainEl.classList.add("page-enter");
      this.currentView = viewName;
      window.scrollTo({ top: 0, behavior: "smooth" });
      viewInit[viewName]?.(params);
      animations.refresh();
      setTimeout(() => mainEl.classList.remove("page-enter"), 350);
    },
    hydrateFromHash() {
      const clean = window.location.hash.replace(/^#\/?/, "");
      if (!clean) return;
      const [pathPart, queryPart = ""] = clean.split("?");
      const parts = pathPart.split("/").filter(Boolean);
      let [viewName, id] = parts;
      if (parts[0] === "payment" && parts[1] === "dp") {
        viewName = "payment-dp";
        id = parts[2];
      } else if (parts[0] === "payment" && parts[1] === "final") {
        viewName = "payment-final-alias";
        id = parts[2];
      } else if (parts[0] === "orders") {
        viewName = "orders";
        id = parts[1];
      } else if (parts[0] === "serah-terima") {
        viewName = "serah-terima";
        id = parts[1];
      } else if (parts[0] === "reviews" && parts[1] === "create") {
        viewName = "reviews-create";
        id = parts[2];
      }
      if (!this.views[viewName]) return;
      const params = id ? { productId: id, orderId: id } : {};
      const query = new URLSearchParams(queryPart).get("q");
      if (query) {
        state.filters.query = query;
        params.query = query;
      }
      this.navigate(viewName, params);
    }
  };
  window.addEventListener("popstate", () => window.router.hydrateFromHash());
})();
