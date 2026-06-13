// USER ACCOUNT FEATURE START
(function () {
  const USERS_KEY = "barangBarengUsers";
  const CURRENT_USER_KEY = "barangBarengCurrentUser";
  const SESSION_KEY = "barangBarengSession";
  const SEEDED_ACCOUNT_EMAIL = "naura@barangbareng.com";

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
      return true;
    } catch {
      return false;
    }
  }

  function initials(name) {
    return String(name || "BB")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase())
      .join("") || "BB";
  }

  function calculateUserLevel(successfulTransactions = 0, rating = 0) {
    const transactions = Number(successfulTransactions || 0);
    const score = Number(rating || 0);
    if (transactions > 20 && score >= 4.5) {
      return {
        level: "Gold",
        listingPriority: 3,
        progressPercent: 100,
        progressText: "Level tertinggi telah tercapai.",
        nextLevel: null
      };
    }
    if (transactions > 20) {
      return {
        level: "Silver",
        listingPriority: 2,
        progressPercent: Math.min(96, Math.round(score / 4.5 * 100)),
        progressText: "Jumlah transaksi sudah memenuhi syarat. Tingkatkan rating menjadi minimal 4,5 untuk mencapai Gold.",
        nextLevel: "Gold"
      };
    }
    if (transactions >= 6) {
      return {
        level: "Silver",
        listingPriority: 2,
        progressPercent: Math.min(95, Math.round(transactions / 21 * 100)),
        progressText: `${transactions} dari 21 transaksi menuju Gold.`,
        nextLevel: "Gold"
      };
    }
    return {
      level: "Bronze",
      listingPriority: 1,
      progressPercent: Math.min(95, Math.round(transactions / 6 * 100)),
      progressText: `${transactions} dari 6 transaksi menuju Silver.`,
      nextLevel: "Silver"
    };
  }

  function calculateAdminFee(baseAdminFee = 0, userLevel = "Bronze") {
    const base = Number(baseAdminFee || 0);
    return String(userLevel).toLowerCase() === "gold" ? Math.round(base * 0.7) : base;
  }

  function ownerPriority(owner = {}) {
    const level = String(owner.level || "").toLowerCase();
    if (level === "gold") return 3;
    if (level === "silver") return 2;
    return 1;
  }

  function sortListingsByUserPriority(listings = [], users = getUsers()) {
    const userMap = new Map(users.map(user => [String(user.fullName || user.name || "").toLowerCase(), normalizeUser(user)]));
    return [...listings].sort((a, b) => {
      const userA = userMap.get(String(a.owner?.name || "").toLowerCase());
      const userB = userMap.get(String(b.owner?.name || "").toLowerCase());
      const priorityA = userA?.listingPriority || ownerPriority(a.owner);
      const priorityB = userB?.listingPriority || ownerPriority(b.owner);
      if (priorityA !== priorityB) return priorityB - priorityA;
      const ratingA = Number(userA?.rating ?? a.owner?.rating ?? a.rating ?? 0);
      const ratingB = Number(userB?.rating ?? b.owner?.rating ?? b.rating ?? 0);
      if (ratingA !== ratingB) return ratingB - ratingA;
      return Number(b.id || 0) - Number(a.id || 0);
    });
  }

  function normalizeUser(user) {
    const computed = calculateUserLevel(user.successfulTransactions, user.rating);
    return {
      ...user,
      fullName: user.fullName || user.name || "",
      phone: user.phone || "",
      campus: user.campus || "",
      successfulTransactions: Number(user.successfulTransactions || 0),
      rating: Number(user.rating || 0),
      level: computed.level,
      listingPriority: computed.listingPriority,
      progressPercent: computed.progressPercent,
      progressText: computed.progressText,
      nextLevel: computed.nextLevel
    };
  }

  function seedUsers() {
    const users = readJson(USERS_KEY, []);
    if (users.some(user => String(user.email).toLowerCase() === SEEDED_ACCOUNT_EMAIL)) return users.map(normalizeUser);
    const seeded = [
      ...users,
      {
        id: "user-001",
        fullName: "Naura Latifa",
        email: SEEDED_ACCOUNT_EMAIL,
        // Prototype only: password is stored in localStorage for local testing. Production must use a backend, hash passwords, and never store raw passwords in the browser.
        password: "Naura12345",
        phone: "081377788899",
        campus: "Universitas Negeri Yogyakarta",
        successfulTransactions: 3,
        rating: 4.2,
        createdAt: "2026-06-13T00:00:00.000Z"
      }
    ].map(normalizeUser);
    writeJson(USERS_KEY, seeded);
    return seeded;
  }

  function getUsers() {
    return seedUsers().map(normalizeUser);
  }

  function setUsers(users) {
    const normalized = users.map(normalizeUser);
    writeJson(USERS_KEY, normalized);
    return normalized;
  }

  function getSessionUser() {
    const session = readJson(SESSION_KEY, null);
    if (!session?.email) return null;
    return getUsers().find(user => user.email.toLowerCase() === String(session.email).toLowerCase()) || null;
  }

  function syncStateUser() {
    const user = getSessionUser();
    if (!user || !window.state) return null;
    state.currentUser = {
      ...state.currentUser,
      name: user.fullName,
      fullName: user.fullName,
      initials: initials(user.fullName),
      email: user.email,
      phone: user.phone,
      campus: user.campus,
      rating: user.rating,
      successfulTransactions: user.successfulTransactions,
      level: user.level.toLowerCase(),
      listingPriority: user.listingPriority
    };
    return user;
  }

  function fieldError(errors, key) {
    return errors?.[key] ? `<p class="bb-auth-error mt-1 text-xs font-bold text-red-600">${errors[key]}</p>` : "";
  }

  function validateRegister(data) {
    const errors = {};
    if (!data.fullName) errors.fullName = "Nama lengkap wajib diisi.";
    if (!data.email) errors.email = "Email wajib diisi.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Format email belum benar.";
    if (!data.phone) errors.phone = "Nomor telepon wajib diisi.";
    else if (!/^[+\d]+$/.test(data.phone)) errors.phone = "Nomor telepon hanya boleh angka dan simbol +.";
    if (!data.campus) errors.campus = "Asal kampus wajib diisi.";
    if (!data.password) errors.password = "Password wajib diisi.";
    else if (data.password.length < 8) errors.password = "Password minimal 8 karakter.";
    if (data.confirmPassword !== data.password) errors.confirmPassword = "Konfirmasi password harus sama.";
    if (getUsers().some(user => user.email.toLowerCase() === data.email.toLowerCase())) errors.email = "Email ini sudah terdaftar.";
    return errors;
  }

  function register(data) {
    const cleaned = {
      fullName: String(data.fullName || "").trim(),
      email: String(data.email || "").trim().toLowerCase(),
      phone: String(data.phone || "").trim(),
      campus: String(data.campus || "").trim(),
      password: String(data.password || ""),
      confirmPassword: String(data.confirmPassword || "")
    };
    const errors = validateRegister(cleaned);
    if (Object.keys(errors).length) return { success: false, errors };
    const users = getUsers();
    const user = normalizeUser({
      id: `user-${Date.now()}`,
      fullName: cleaned.fullName,
      email: cleaned.email,
      // Prototype only: password is stored in localStorage for local testing. Production must use a backend, hash passwords, and never store raw passwords in the browser.
      password: cleaned.password,
      phone: cleaned.phone,
      campus: cleaned.campus,
      successfulTransactions: 0,
      rating: 0,
      createdAt: new Date().toISOString()
    });
    setUsers([...users, user]);
    return { success: true, user };
  }

  function login(email, password) {
    const user = getUsers().find(item => item.email.toLowerCase() === String(email || "").trim().toLowerCase());
    if (!user || user.password !== String(password || "")) return { success: false, message: "Email atau password belum sesuai." };
    writeJson(SESSION_KEY, { email: user.email, loggedInAt: new Date().toISOString() });
    writeJson(CURRENT_USER_KEY, { email: user.email });
    syncStateUser();
    return { success: true, user: normalizeUser(user) };
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    state.currentUser = { name: "Difa Surya", initials: "DS", level: "silver", campus: "Universitas Indonesia" };
    renderAuthUi();
  }

  function updateProfile(data) {
    const user = getSessionUser();
    if (!user) return { success: false, message: "Silakan masuk terlebih dahulu." };
    const errors = {};
    if (!data.fullName.trim()) errors.fullName = "Nama lengkap wajib diisi.";
    if (!/^[+\d]+$/.test(data.phone.trim())) errors.phone = "Nomor telepon hanya boleh angka dan simbol +.";
    if (!data.campus.trim()) errors.campus = "Asal kampus wajib diisi.";
    if (Object.keys(errors).length) return { success: false, errors };
    const users = getUsers().map(item => item.email === user.email ? normalizeUser({ ...item, fullName: data.fullName.trim(), phone: data.phone.trim(), campus: data.campus.trim() }) : item);
    setUsers(users);
    syncStateUser();
    renderAuthUi();
    return { success: true };
  }

  function levelBadge(user) {
    const style = user.level === "Gold" ? "border-amber-300 bg-amber-50 text-amber-700" : user.level === "Silver" ? "border-slate-300 bg-slate-50 text-slate-700" : "border-orange-200 bg-orange-50 text-orange-700";
    return `<span class="bb-user-level-badge rounded-full border px-2 py-0.5 text-[10px] font-extrabold ${style}">${user.level}</span>`;
  }

  function userButton(user) {
    return `<button type="button" class="bb-user-menu-button relative grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-sm font-extrabold text-brand-blue shadow-card ring-2 ${user.level === "Gold" ? "ring-amber-300" : user.level === "Silver" ? "ring-slate-200" : "ring-orange-200"}" aria-label="Buka profil pengguna" aria-expanded="false" data-bb-user-toggle>${initials(user.fullName)}</button>`;
  }

  function dropdown(user) {
    const gold = user.level === "Gold" ? `<div class="mt-4 rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-800"><span class="badge bg-white text-amber-700">Gold Benefit</span><h3 class="mt-3 font-extrabold">Keuntungan Gold</h3><ul class="mt-2 grid gap-1"><li>Diskon biaya admin sebesar 30%.</li><li>Prioritas dalam sistem pencarian.</li><li>Boost listing.</li><li>Barang milik pengguna Gold lebih sering muncul.</li></ul></div>` : "";
    return `<div class="bb-user-dropdown absolute right-0 top-12 z-[120] hidden w-[min(360px,calc(100vw-2rem))] rounded-[28px] border border-slate-100 bg-white p-5 text-left shadow-xl" data-bb-user-dropdown>
      <div class="flex items-start gap-3"><span class="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-brand font-extrabold text-white">${initials(user.fullName)}</span><div class="min-w-0"><h3 class="truncate font-extrabold text-slate-950">${user.fullName}</h3><p class="truncate text-sm font-semibold text-slate-500">${user.email}</p><p class="mt-1 text-xs font-semibold text-slate-500">${user.phone} · ${user.campus}</p></div></div>
      <div class="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-bold text-slate-500">
        <div class="rounded-2xl bg-slate-50 p-3">${levelBadge(user)}<span class="mt-1 block">Level</span></div>
        <div class="rounded-2xl bg-slate-50 p-3"><b class="block text-slate-950">${user.successfulTransactions}</b><span>Transaksi</span></div>
        <div class="rounded-2xl bg-slate-50 p-3"><b class="block text-slate-950">${Number(user.rating).toFixed(1)}</b><span>Rating</span></div>
      </div>
      <div class="mt-4 rounded-2xl bg-slate-50 p-4"><div class="flex items-center justify-between gap-3 text-xs font-bold text-slate-500"><span>Progress level</span><span>${Math.round(user.progressPercent)}%</span></div><div class="mt-2 h-2 rounded-full bg-white"><div class="h-full rounded-full bg-gradient-brand" style="width:${Math.max(4, user.progressPercent)}%"></div></div><p class="mt-2 text-xs font-semibold leading-5 text-slate-600">${user.progressText}</p></div>
      ${gold}
      <div class="mt-4 grid gap-2"><button type="button" class="btn-secondary rounded-2xl px-4 py-3 text-sm" data-bb-account-settings>Pengaturan Akun</button><button type="button" class="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100" data-bb-logout>Logout</button></div>
    </div>`;
  }

  function renderAuthUi() {
    const user = syncStateUser();
    document.querySelectorAll("[data-bb-auth-guest]").forEach(el => el.classList.toggle("hidden", Boolean(user)));
    document.querySelectorAll("[data-bb-auth-user]").forEach(el => {
      el.classList.toggle("hidden", !user);
      el.innerHTML = user ? `${userButton(user)}${dropdown(user)}` : "";
    });
    bindAuthUi();
    window.components?.refreshNavBadges?.();
    if (window.lucide) lucide.createIcons();
  }

  function closeDropdown() {
    document.querySelectorAll("[data-bb-user-dropdown]").forEach(dropdownEl => dropdownEl.classList.add("hidden"));
    document.querySelectorAll("[data-bb-user-toggle]").forEach(button => button.setAttribute("aria-expanded", "false"));
  }

  function bindAuthUi() {
    document.querySelectorAll("[data-bb-user-toggle]").forEach(button => button.addEventListener("click", event => {
      event.stopPropagation();
      const menu = button.parentElement?.querySelector("[data-bb-user-dropdown]");
      const isOpen = menu && !menu.classList.contains("hidden");
      closeDropdown();
      if (!isOpen) {
        menu?.classList.remove("hidden");
        button.setAttribute("aria-expanded", "true");
      }
    }));
    document.querySelectorAll("[data-bb-logout]").forEach(button => button.addEventListener("click", () => {
      logout();
      ui.toast("Pengguna berhasil logout");
    }));
    document.querySelectorAll("[data-bb-account-settings]").forEach(button => button.addEventListener("click", () => {
      closeDropdown();
      openSettings();
    }));
  }

  function openSettings(errors = {}) {
    const user = getSessionUser();
    if (!user) return;
    document.querySelector("#bb-user-settings-modal")?.remove();
    document.body.insertAdjacentHTML("beforeend", `<div id="bb-user-settings-modal" class="fixed inset-0 z-[140] grid place-items-center overflow-y-auto bg-slate-950/45 px-4 py-8" role="dialog" aria-modal="true" aria-label="Pengaturan Akun">
      <form class="w-full max-w-lg rounded-[28px] border border-slate-100 bg-white p-6 shadow-xl" data-bb-settings-form>
        <div class="flex items-start justify-between gap-4"><div><h2 class="text-xl font-extrabold text-slate-950">Pengaturan Akun</h2><p class="mt-1 text-sm text-slate-500">Perbarui informasi profil akun kamu.</p></div><button type="button" class="grid h-10 w-10 place-items-center rounded-full bg-slate-100" aria-label="Tutup pengaturan" data-bb-settings-close>X</button></div>
        <label class="mt-5 block text-sm font-bold text-slate-700">Nama lengkap<input class="field mt-2" name="fullName" value="${user.fullName}">${fieldError(errors, "fullName")}</label>
        <label class="mt-4 block text-sm font-bold text-slate-700">Email<input class="field mt-2 bg-slate-50" name="email" value="${user.email}" readonly></label>
        <label class="mt-4 block text-sm font-bold text-slate-700">Nomor telepon<input class="field mt-2" name="phone" value="${user.phone}">${fieldError(errors, "phone")}</label>
        <label class="mt-4 block text-sm font-bold text-slate-700">Asal kampus<input class="field mt-2" name="campus" value="${user.campus}">${fieldError(errors, "campus")}</label>
        <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" class="btn-secondary rounded-2xl px-5 py-3" data-bb-settings-close>Batal</button><button class="btn-primary rounded-2xl px-5 py-3">Simpan Perubahan</button></div>
      </form>
    </div>`);
    document.querySelector("[data-bb-settings-close]")?.focus();
    document.querySelectorAll("[data-bb-settings-close]").forEach(button => button.addEventListener("click", closeSettings));
    document.querySelector("#bb-user-settings-modal")?.addEventListener("click", event => {
      if (event.target.id === "bb-user-settings-modal") closeSettings();
    });
    document.querySelector("[data-bb-settings-form]")?.addEventListener("submit", event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const result = updateProfile({
        fullName: String(form.get("fullName") || ""),
        phone: String(form.get("phone") || ""),
        campus: String(form.get("campus") || "")
      });
      if (!result.success) return openSettings(result.errors || {});
      closeSettings();
      ui.toast("Data profil berhasil diperbarui");
    });
  }

  function closeSettings() {
    document.querySelector("#bb-user-settings-modal")?.remove();
  }

  document.addEventListener("click", event => {
    if (!event.target.closest("[data-bb-user-dropdown]") && !event.target.closest("[data-bb-user-toggle]")) closeDropdown();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeDropdown();
      closeSettings();
    }
  });

  seedUsers();
  syncStateUser();

  window.calculateUserLevel = calculateUserLevel;
  window.calculateAdminFee = calculateAdminFee;
  window.sortListingsByUserPriority = sortListingsByUserPriority;
  window.bbUserAccount = {
    calculateUserLevel,
    calculateAdminFee,
    sortListingsByUserPriority,
    getUsers,
    getSessionUser,
    syncStateUser,
    register,
    login,
    logout,
    updateProfile,
    openSettings,
    renderAuthUi,
    fieldError,
    initials,
    levelBadge
  };
})();
// USER ACCOUNT FEATURE END
