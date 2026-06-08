(function () {
  const fallbackPages = {
    home: '<section id="home-view" data-view="home"></section>',
    browse: '<section id="browse-view" data-view="browse"></section>',
    "product-detail": '<section id="detail-view" data-view="product-detail"></section>',
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
    "transaction-success": '<section id="transaction-success-view" data-view="transaction-success"></section>',
    "dashboard-buyer": '<section id="buyer-view" data-view="dashboard-buyer"></section>',
    "dashboard-seller": '<section id="seller-view" data-view="dashboard-seller"></section>',
    profile: '<section id="profile-view" data-view="profile"></section>'
  };

  window.router = {
    currentView: "home",
    params: {},
    views: {
      home: "pages/home.html",
      browse: "pages/browse.html",
      "product-detail": "pages/product-detail.html",
      checkout: "pages/checkout.html",
      login: "pages/login.html",
      register: "pages/register.html",
      topup: "pages/topup.html",
      "qr-handover": "pages/qr-handover.html",
      chat: "pages/chat.html",
      "upload-product": "pages/upload-product.html",
      "edit-product": "pages/edit-product.html",
      "product-statistics": "pages/product-statistics.html",
      "payment-qr": "pages/payment-qr.html",
      "payment-verification": "pages/payment-verification.html",
      "transaction-success": "pages/transaction-success.html",
      "dashboard-buyer": "pages/dashboard-buyer.html",
      "dashboard-seller": "pages/dashboard-seller.html",
      profile: "pages/profile.html"
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
