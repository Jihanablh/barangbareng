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
    return `<div class="bb-user-dropdown absolute right-0 top-12 z-[120] hidden w-[min(240px,calc(100vw-2rem))] rounded-[22px] border border-slate-100 bg-white p-3 text-left shadow-xl" data-bb-user-dropdown>
      <div class="mb-2 border-b border-slate-100 px-2 pb-3"><p class="truncate text-sm font-extrabold text-slate-950">${user.fullName}</p><p class="truncate text-xs font-semibold text-slate-500">${user.email}</p></div>
      <button type="button" class="w-full rounded-2xl px-3 py-3 text-left text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-brand-blue" data-bb-nav="profile">Profil</button>
      <button type="button" class="w-full rounded-2xl px-3 py-3 text-left text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-brand-blue" data-bb-nav="dashboard-buyer">Dashboard</button>
      <button type="button" class="w-full rounded-2xl px-3 py-3 text-left text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-brand-blue" data-bb-account-settings>Pengaturan Akun</button>
      <button type="button" class="mt-1 w-full rounded-2xl bg-red-50 px-3 py-3 text-left text-sm font-bold text-red-700 transition hover:bg-red-100" data-bb-logout>Logout</button>
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
    document.querySelectorAll("[data-bb-nav]").forEach(button => button.addEventListener("click", () => {
      closeDropdown();
      router.navigate(button.dataset.bbNav);
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

  function openSettings() {
    const user = getSessionUser();
    router.navigate(user ? "pengaturan-akun" : "login");
  }

  function closeSettings() {
    return null;
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
