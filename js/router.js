(function () {
  const fallbackPages = {
    home: '<section id="home-view" data-view="home"></section>',
    browse: '<section id="browse-view" data-view="browse"></section>',
    "product-detail": '<section id="detail-view" data-view="product-detail"></section>',
    keranjang: '<section id="cart-view" data-view="keranjang"></section>',
    wishlist: '<section id="wishlist-view" data-view="wishlist"></section>',
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
    "payment-verification": '<section id="payment-verification-view" data-view="payment-verification"></section>',
    "payment-final": '<section id="payment-final-view" data-view="payment-final"></section>',
    "transaction-success": '<section id="transaction-success-view" data-view="transaction-success"></section>',
    "order-detail": '<section id="order-detail-view" data-view="order-detail"></section>',
    "dashboard-buyer": '<section id="buyer-view" data-view="dashboard-buyer"></section>',
    "dashboard-seller": '<section id="seller-view" data-view="dashboard-seller"></section>',
    profile: '<section id="profile-view" data-view="profile"></section>'
  };

  window.router = {
    currentView: "home",
    params: {},
    views: {
      home: "partials/home.html",
      browse: "partials/browse.html",
      "product-detail": "partials/product-detail.html",
      keranjang: "partials/keranjang.html",
      wishlist: "partials/wishlist.html",
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
      "payment-verification": "partials/payment-verification.html",
      "payment-final": "partials/payment-final.html",
      "transaction-success": "partials/transaction-success.html",
      "order-detail": "partials/order-detail.html",
      "dashboard-buyer": "partials/dashboard-buyer.html",
      "dashboard-seller": "partials/dashboard-seller.html",
      profile: "partials/profile.html"
    },
    async navigate(viewName, params = {}) {
      const path = this.views[viewName];
      if (!path) return;
      this.params = params;
      if (params.productId) state.rememberProduct(Number(params.productId));
      const hashParam = params.productId ? `/${params.productId}` : "";
      const nextHash = `#/${viewName}${hashParam}`;
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
      const [viewName, id] = clean.split("/");
      if (!this.views[viewName]) return;
      this.navigate(viewName, id ? { productId: id } : {});
    }
  };
  window.addEventListener("popstate", () => window.router.hydrateFromHash());
})();
