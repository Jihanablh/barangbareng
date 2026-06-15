(function () {
  // CHECKOUT PAYMENT FLOW SERVICE START
  const STORE_KEY = "barangBarengTransactions";
  const CURRENT_KEY = "barangBarengCurrentTransaction";
  const PAYMENT_WINDOW_MS = 15 * 60 * 1000;

  const TRANSACTION_STATUS = {
    PENDING: "PENDING",
    WAITING_OWNER_APPROVAL: "WAITING_OWNER_APPROVAL",
    REJECTED: "REJECTED",
    WAITING_DP_PAYMENT: "WAITING_DP_PAYMENT",
    DP_PAID: "DP_PAID",
    PREPARING_ITEM: "PREPARING_ITEM",
    WAITING_FINAL_PAYMENT: "WAITING_FINAL_PAYMENT",
    FULLY_PAID: "FULLY_PAID",
    READY_FOR_HANDOVER: "READY_FOR_HANDOVER",
    RENTED: "RENTED",
    RETURNED: "RETURNED",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED",
    PAYMENT_EXPIRED: "PAYMENT_EXPIRED"
  };

  const STATUS_LABEL = {
    PENDING: "Menunggu Diproses",
    WAITING_OWNER_APPROVAL: "Menunggu Persetujuan Penyedia",
    REJECTED: "Permintaan Ditolak",
    WAITING_DP_PAYMENT: "Menunggu Pembayaran DP",
    DP_PAID: "DP Sudah Dibayar",
    PREPARING_ITEM: "Barang Sedang Disiapkan",
    WAITING_FINAL_PAYMENT: "Menunggu Pelunasan",
    FULLY_PAID: "Pembayaran Lunas",
    READY_FOR_HANDOVER: "Siap Serah Terima",
    RENTED: "Sedang Disewa",
    RETURNED: "Barang Dikembalikan",
    COMPLETED: "Transaksi Selesai",
    CANCELLED: "Transaksi Dibatalkan",
    PAYMENT_EXPIRED: "Pembayaran Kedaluwarsa"
  };

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

  function all() {
    const value = readJson(STORE_KEY, []);
    return Array.isArray(value) ? value : [];
  }

  function saveAll(transactions) {
    writeJson(STORE_KEY, transactions);
  }

  function currentId() {
    return localStorage.getItem(CURRENT_KEY) || state.orderCode || "";
  }

  function setCurrent(id) {
    if (!id) return;
    localStorage.setItem(CURRENT_KEY, id);
    state.orderCode = id;
  }

  function normalizeStatus(status) {
    if (status === "READY_FOR_PICKUP") return TRANSACTION_STATUS.READY_FOR_HANDOVER;
    return status || TRANSACTION_STATUS.WAITING_OWNER_APPROVAL;
  }

  function syncState(transaction) {
    if (!transaction) return null;
    state.orderCode = transaction.id;
    state.orderStatus = normalizeStatus(transaction.status);
    state.bookingStart = transaction.startDate;
    state.bookingEnd = transaction.endDate;
    state.bookingDays = transaction.durationDays;
    state.codLocation = transaction.codLocation;
    state.renterNote = transaction.renterNote || "";
    state.selectedProductId = Number(transaction.productId) || state.selectedProductId;
    return transaction;
  }

  function find(id = currentId()) {
    const transaction = all().find(item => item.id === id);
    return transaction ? syncState(transaction) : null;
  }

  function upsert(transaction) {
    const transactions = all();
    const index = transactions.findIndex(item => item.id === transaction.id);
    const next = { ...transaction, status: normalizeStatus(transaction.status), updatedAt: new Date().toISOString() };
    if (index >= 0) transactions[index] = next;
    else transactions.unshift(next);
    saveAll(transactions);
    setCurrent(next.id);
    syncState(next);
    return next;
  }

  function durationDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.round((end - start) / 86400000) + 1;
    return Math.max(1, Number.isFinite(diff) ? diff : 1);
  }

  function createTransaction({ product, totals, renterNote = "", codLocation = "" }) {
    const id = `TRX-${Date.now().toString().slice(-6)}`;
    const renter = window.bbUserAccount?.getSessionUser?.();
    const transaction = {
      id,
      productId: product.id,
      productName: product.name,
      productImage: window.BBData?.getProductImage?.(product) || product.image || "",
      renterId: renter?.id || "user-renter-001",
      renterName: renter?.fullName || state.currentUser?.name || "Penyewa BarangBareng",
      ownerId: product.owner?.initials || "owner-001",
      ownerName: product.owner?.name || "Penyedia Barang",
      startDate: state.bookingStart,
      endDate: state.bookingEnd,
      durationDays: durationDays(state.bookingStart, state.bookingEnd),
      pricePerDay: Number(product.price || 0),
      totalAmount: totals.total,
      dpAmount: totals.dp,
      remainingAmount: totals.remaining,
      codLocation,
      renterNote,
      status: TRANSACTION_STATUS.WAITING_OWNER_APPROVAL,
      dpInvoice: null,
      finalInvoice: null,
      handoverQr: null,
      returnQr: null,
      returnChecklist: { itemMatch: false, complete: false, noDamage: false, received: false },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return upsert(transaction);
  }

  function updateStatus(id, status, patch = {}) {
    const transaction = find(id);
    if (!transaction) return null;
    return upsert({ ...transaction, ...patch, status: normalizeStatus(status) });
  }

  function createInvoice(transaction, type) {
    const isFinal = type === "FINAL_PAYMENT";
    const amount = isFinal ? transaction.remainingAmount : transaction.dpAmount;
    const shortType = isFinal ? "FINAL" : "DP";
    return {
      id: `INV-${shortType}-${transaction.id}`,
      transactionId: transaction.id,
      type,
      amount,
      method: "QRIS",
      provider: "QRIS",
      qrContent: `BB-PAY-${shortType}-${transaction.id}-${amount}`,
      status: "WAITING_PAYMENT",
      expiredAt: Date.now() + PAYMENT_WINDOW_MS,
      paidAt: null,
      createdAt: new Date().toISOString()
    };
  }

  function ensureInvoice(type, forceNew = false) {
    const transaction = find();
    if (!transaction) return null;
    const key = type === "FINAL_PAYMENT" ? "finalInvoice" : "dpInvoice";
    const invoice = transaction[key];
    if (!forceNew && invoice?.status === "WAITING_PAYMENT" && invoice.expiredAt > Date.now()) return invoice;
    const nextInvoice = createInvoice(transaction, type);
    upsert({ ...transaction, [key]: nextInvoice, status: type === "FINAL_PAYMENT" ? transaction.status : TRANSACTION_STATUS.WAITING_DP_PAYMENT });
    return nextInvoice;
  }

  function expirePaymentIfNeeded(transaction, invoiceKey) {
    const invoice = transaction?.[invoiceKey];
    if (!invoice || invoice.status !== "WAITING_PAYMENT" || invoice.expiredAt > Date.now()) return transaction;
    const nextInvoice = { ...invoice, status: "EXPIRED" };
    return upsert({ ...transaction, [invoiceKey]: nextInvoice, status: TRANSACTION_STATUS.PAYMENT_EXPIRED });
  }

  function markPaymentChecking(type) {
    const transaction = find();
    if (!transaction) return null;
    const key = type === "final" ? "finalInvoice" : "dpInvoice";
    const invoice = transaction[key] || createInvoice(transaction, type === "final" ? "FINAL_PAYMENT" : "DP_PAYMENT");
    return upsert({ ...transaction, [key]: { ...invoice, status: "CHECKING_PAYMENT" } });
  }

  function markPaymentPaid(type) {
    const transaction = find();
    if (!transaction) return null;
    const key = type === "final" ? "finalInvoice" : "dpInvoice";
    const invoice = transaction[key] || createInvoice(transaction, type === "final" ? "FINAL_PAYMENT" : "DP_PAYMENT");
    const nextStatus = type === "final" ? TRANSACTION_STATUS.FULLY_PAID : TRANSACTION_STATUS.DP_PAID;
    return upsert({ ...transaction, [key]: { ...invoice, status: "PAID", paidAt: new Date().toISOString() }, status: nextStatus });
  }

  function generateHandoverQr(id = currentId()) {
    const transaction = find(id);
    if (!transaction) return null;
    return upsert({ ...transaction, handoverQr: { content: `BB-HANDOVER-${transaction.id}`, usedAt: null }, status: TRANSACTION_STATUS.READY_FOR_HANDOVER });
  }

  function scanHandoverQr(id = currentId()) {
    const transaction = find(id);
    if (!transaction || ![TRANSACTION_STATUS.FULLY_PAID, TRANSACTION_STATUS.READY_FOR_HANDOVER].includes(normalizeStatus(transaction.status))) return null;
    return upsert({ ...transaction, handoverQr: { ...(transaction.handoverQr || {}), content: transaction.handoverQr?.content || `BB-HANDOVER-${transaction.id}`, usedAt: new Date().toISOString() }, status: TRANSACTION_STATUS.RENTED });
  }

  function generateReturnQr(id = currentId()) {
    const transaction = find(id);
    if (!transaction) return null;
    return upsert({ ...transaction, returnQr: { content: `BB-RETURN-${transaction.id}`, usedAt: null } });
  }

  function scanReturnQr(id = currentId()) {
    const transaction = find(id);
    if (!transaction || normalizeStatus(transaction.status) !== TRANSACTION_STATUS.RENTED) return null;
    return upsert({ ...transaction, returnQr: { ...(transaction.returnQr || {}), content: transaction.returnQr?.content || `BB-RETURN-${transaction.id}`, usedAt: new Date().toISOString() }, status: TRANSACTION_STATUS.RETURNED });
  }

  function saveReturnChecklist(id, checklist) {
    const transaction = find(id);
    if (!transaction) return null;
    const complete = Object.values(checklist || {}).every(Boolean);
    return upsert({ ...transaction, returnChecklist: checklist, status: complete ? TRANSACTION_STATUS.RETURNED : transaction.status });
  }

  function complete(id = currentId()) {
    return updateStatus(id, TRANSACTION_STATUS.COMPLETED);
  }

  window.bbTransactions = {
    TRANSACTION_STATUS,
    STATUS_LABEL,
    all,
    find,
    current: () => find(),
    createTransaction,
    updateStatus,
    ensureInvoice,
    expirePaymentIfNeeded,
    markPaymentChecking,
    markPaymentPaid,
    generateHandoverQr,
    scanHandoverQr,
    generateReturnQr,
    scanReturnQr,
    saveReturnChecklist,
    complete,
    syncState,
    setCurrent,
    label: status => STATUS_LABEL[normalizeStatus(status)] || STATUS_LABEL.WAITING_OWNER_APPROVAL,
    normalizeStatus
  };
  // CHECKOUT PAYMENT FLOW SERVICE END
})();
