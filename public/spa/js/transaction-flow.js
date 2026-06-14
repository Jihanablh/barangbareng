(function () {
  // TRANSACTION FLOW FEATURE START
  const STORE_KEY = "barangBarengTransactionFlows";
  const icon = (name, cls = "h-5 w-5") => components.icon(name, cls);
  const fallbackImage = BBData.fallbackProductImage || "/images/products/product-placeholder.svg";
  const timers = { confirm: null, gps: null, countdown: null, returnApproval: null, returnGps: null, scan: null, popup: null };

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

  function clearFlowTimers() {
    Object.keys(timers).forEach(key => {
      clearTimeout(timers[key]);
      clearInterval(timers[key]);
      timers[key] = null;
    });
  }

  function productImage() {
    const product = BBData.products.find(item => /rice cooker|magic com/i.test(item.name)) || BBData.products[0];
    return BBData.getProductImage?.(product) || product?.image || fallbackImage;
  }

  const transactionData = {
    id: "TRX-BB-001",
    itemName: "Magic Com",
    ownerName: "Rizky Aulia",
    renterName: "Jihan Nabilah Rahman",
    location: "Binus University, Kemanggisan, Jakarta Barat",
    estimatedArrival: "14:20 WIB",
    loanDurationHours: 48,
    rewardCoins: 2
  };

  function defaultFlow(id) {
    return {
      transactionId: id || transactionData.id,
      currentStep: "tracking",
      lastTransactionStatus: "tracking",
      nodeStatus: { confirmation: "loading", ownerMoving: "waiting", ownerArrived: "waiting" },
      ownerArrived: false,
      gpsCompleted: false,
      chatMessages: [
        { from: "system", text: "Pemilik Barang Sudah Tiba di Lokasi, segera ambil barangmu." },
        { from: "owner", text: "Hai, aku Rizky Aulia, aku udah di lobby deket admission yaa buat ambil barangnya, langsung scan kode serah terima, okee?" }
      ],
      chatDraft: "",
      photoVerification: { status: "idle", type: null, detectedObject: null, message: "" },
      qrActive: false,
      qrScanned: false,
      loanStarted: false,
      loanStartedAt: "",
      loanEndsAt: "",
      returnRequested: false,
      returnApproved: false,
      returnGpsCompleted: false,
      returnQrScanned: false,
      returnCode: "123456",
      rating: 0,
      reviewText: "",
      reviewSubmitted: false,
      coinsClaimed: false,
      feedbackMood: null,
      finalPopupOpen: false
    };
  }

  function getFlows() {
    state.transactionFlows = state.transactionFlows || readJson(STORE_KEY, {});
    return state.transactionFlows;
  }

  function getFlow(transactionId) {
    const flows = getFlows();
    const id = transactionId || transactionData.id;
    if (!flows[id]) flows[id] = defaultFlow(id);
    return flows[id];
  }

  function saveFlow(flow) {
    const flows = getFlows();
    flows[flow.transactionId] = flow;
    writeJson(STORE_KEY, flows);
  }

  function setStep(flow, step) {
    flow.currentStep = step;
    if (step !== "chat") flow.lastTransactionStatus = step;
    saveFlow(flow);
    renderTransactionFlow({ orderId: flow.transactionId });
  }

  function shell(flow, content) {
    return `<main class="min-h-screen overflow-x-hidden bg-[#071B33] pt-24 text-white">
      <div class="pointer-events-none fixed inset-0 opacity-60">
        <div class="absolute -left-28 top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"></div>
        <div class="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl"></div>
      </div>
      <div class="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        ${components.pageTopBar({ backLabel: "Kembali ke Beranda", backTo: "home", breadcrumb: ["Transaksi", "Flow Transaksi"], theme: "dark" })}
        <header class="mb-5 flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-sm font-extrabold uppercase tracking-wide text-cyan-200">Flow Transaksi</p>
            <h1 class="mt-1 text-2xl font-extrabold leading-tight sm:text-3xl">${transactionData.itemName}</h1>
            <p class="mt-2 text-sm font-semibold text-white/70">${transactionData.ownerName} - ${transactionData.location}</p>
          </div>
        </header>
        ${progress(flow)}
        <section class="tf-step-enter mt-5">${content}</section>
      </div>
    </main>`;
  }

  function progress(flow) {
    const steps = [["tracking", "Tracking"], ["photo", "Foto"], ["loan", "Masa Pinjam"], ["return-tracking", "Pengembalian"], ["review", "Review"]];
    const current = flow.currentStep === "chat" ? flow.lastTransactionStatus : flow.currentStep;
    const index = steps.findIndex(item => item[0] === current || (current.startsWith("return") && item[0] === "return-tracking"));
    return `<nav class="grid gap-2 sm:grid-cols-5" aria-label="Progress flow transaksi">
      ${steps.map((item, stepIndex) => `<span class="rounded-2xl border px-3 py-2 text-center text-xs font-extrabold ${stepIndex < index ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-200" : stepIndex === index ? "border-cyan-300 bg-cyan-400 text-[#071B33]" : "border-white/10 bg-white/5 text-white/45"}">${item[1]}</span>`).join("")}
    </nav>`;
  }

  function card(content, extra = "") {
    return `<article class="rounded-[28px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl ${extra}">${content}</article>`;
  }

  function nodeRow(label, status) {
    const styles = {
      loading: ["loader", "border-cyan-300/40 bg-cyan-400/10 text-cyan-100", "Memproses"],
      active: ["navigation", "border-cyan-300/40 bg-cyan-400/10 text-cyan-100", "Aktif"],
      done: ["check", "border-emerald-300/40 bg-emerald-400/10 text-emerald-100", "Selesai"],
      waiting: ["circle", "border-white/10 bg-white/5 text-white/55", "Menunggu"]
    };
    const [iconName, style, text] = styles[status] || styles.waiting;
    return `<div class="flex items-center gap-3 rounded-2xl border p-4 ${style}">
      <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10">${icon(iconName, status === "loading" ? "h-5 w-5 tf-spin" : "h-5 w-5")}</span>
      <div><p class="font-extrabold">${label}</p><p class="text-xs font-bold opacity-80">${text}</p></div>
    </div>`;
  }

  function mockGpsMap(done, returnMode = false) {
    const marker = done ? "tf-gps-marker-done" : "tf-gps-marker-moving";
    const title = returnMode ? "Tracking Pengembalian" : "GPS Binus Kemanggisan";
    return card(`<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div><h2 class="text-xl font-extrabold">${title}</h2><p class="mt-1 text-sm font-semibold text-white/65">${transactionData.location}</p></div>
      <span class="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-sm font-extrabold text-cyan-100">${done ? "Pemilik Sampai" : "Pemilik Bergerak"}</span>
    </div>
    <div class="tf-map mt-5 min-h-[280px] rounded-[28px] border border-white/10 bg-[#0B2545]">
      <div class="tf-map-grid"></div>
      <div class="tf-route-line"></div>
      <div class="tf-map-label tf-owner-label">Pemilik</div>
      <div class="tf-map-label tf-destination-label">Binus University</div>
      <div class="tf-map-pin tf-owner-pin">${icon(returnMode ? "truck" : "bike", "h-5 w-5")}</div>
      <div class="tf-map-pin tf-destination-pin">${icon("map-pin", "h-5 w-5")}</div>
      <div class="tf-gps-marker ${marker}">${icon("navigation", "h-5 w-5")}</div>
    </div>`);
  }

  function infoPanel(flow) {
    return card(`<div class="flex gap-4">
      <img src="${productImage()}" alt="${transactionData.itemName}" class="h-24 w-24 shrink-0 rounded-3xl object-cover" onerror="this.onerror=null;this.src='${fallbackImage}'">
      <div class="min-w-0">
        <p class="text-xs font-extrabold text-cyan-200">${flow.transactionId}</p>
        <h2 class="mt-1 text-xl font-extrabold">${transactionData.itemName}</h2>
        <p class="mt-1 text-sm font-semibold text-white/65">Penyewa: ${transactionData.renterName}</p>
        <p class="mt-2 rounded-2xl bg-cyan-400/10 px-3 py-2 text-xs font-bold text-cyan-100">${transactionData.estimatedArrival}</p>
      </div>
    </div>`);
  }

  function renderTracking(flow) {
    scheduleTracking(flow);
    const canProceed = flow.nodeStatus.ownerArrived === "done";
    return shell(flow, `<div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div class="grid gap-5">
        ${card(`<h2 class="text-xl font-extrabold">Status Serah Terima</h2><div class="mt-4 grid gap-3">${nodeRow("Menunggu Konfirmasi", flow.nodeStatus.confirmation)}${nodeRow("Pemilik Menuju Lokasi", flow.nodeStatus.ownerMoving)}${nodeRow("Pemilik Sampai", flow.nodeStatus.ownerArrived)}</div>`)}
        ${mockGpsMap(flow.gpsCompleted)}
      </div>
      <aside class="grid h-fit gap-5">
        ${infoPanel(flow)}
        ${card(`<h2 class="font-extrabold">Aksi Transaksi</h2>
          ${canProceed ? `<p class="mt-3 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm font-bold text-emerald-200">Pemilik sudah sampai di lokasi COD.</p>` : `<p class="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-bold text-white/65">Tunggu GPS selesai atau cek status pemilik.</p>`}
          <button class="mt-4 w-full rounded-2xl border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/15" data-owner-arrived>${icon("map-pin-check", "mr-2 inline h-4 w-4")}Cek Status Pemilik</button>
          <button class="mt-3 w-full rounded-2xl border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/15" data-open-flow-chat>${icon("message-circle", "mr-2 inline h-4 w-4")}Chat <span class="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">2</span></button>
          <button class="mt-3 w-full rounded-2xl bg-cyan-400 px-5 py-3 font-bold text-[#071B33] shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300 active:scale-[0.98]" data-next-photo ${canProceed ? "" : "disabled"}>Lanjut Validasi Foto</button>`) }
      </aside>
    </div>`);
  }

  function scheduleTracking(flow) {
    if (flow.nodeStatus.confirmation === "loading") {
      timers.confirm = setTimeout(() => {
        flow.nodeStatus.confirmation = "done";
        flow.nodeStatus.ownerMoving = "active";
        saveFlow(flow);
        renderTransactionFlow({ orderId: flow.transactionId });
      }, 2000);
      return;
    }
    if (flow.nodeStatus.ownerMoving === "active" && !flow.gpsCompleted) {
      timers.gps = setTimeout(() => handleOwnerArrived(flow), 10000);
    }
  }

  function handleOwnerArrived(flow) {
    flow.ownerArrived = true;
    flow.gpsCompleted = true;
    flow.nodeStatus.ownerMoving = "done";
    flow.nodeStatus.ownerArrived = "done";
    saveFlow(flow);
    renderTransactionFlow({ orderId: flow.transactionId });
  }

  function renderChat(flow) {
    return shell(flow, `<div class="mx-auto max-w-4xl">
      ${card(`<button type="button" class="inline-flex w-fit items-center gap-2 text-sm font-bold text-white/90 transition hover:-translate-x-0.5 hover:text-cyan-300 sm:text-base" data-back-from-chat>${icon("arrow-left", "h-5 w-5")} <span>Kembali</span></button>
      <div class="mt-5 flex items-center gap-4 border-b border-white/10 pb-5">
        <span class="grid h-14 w-14 place-items-center rounded-2xl bg-cyan-400 font-extrabold text-[#071B33]">RA</span>
        <div><h2 class="text-xl font-extrabold">${transactionData.ownerName}</h2><p class="text-sm font-bold text-emerald-200">Online</p></div>
      </div>
      <div id="tf-chat-list" class="mt-5 grid max-h-[52vh] gap-3 overflow-y-auto pr-1">
        ${flow.chatMessages.map(message => chatBubble(message)).join("")}
      </div>
      <label class="mt-5 block text-sm font-bold text-white" for="tf-chat-input">Tulis pesan</label>
      <div class="mt-2 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input id="tf-chat-input" class="min-h-[52px] rounded-2xl border border-white/10 bg-white/10 px-4 text-white outline-none placeholder:text-white/40 focus:border-cyan-300" value="${flow.chatDraft || ""}" placeholder="Ketik pesan untuk Rizky...">
        <button class="rounded-2xl bg-cyan-400 px-5 py-3 font-bold text-[#071B33] shadow-lg shadow-cyan-500/20" data-send-flow-chat>Kirim</button>
      </div>`) }
    </div>`);
  }

  function chatBubble(message) {
    const isOwner = message.from === "owner";
    const isSystem = message.from === "system";
    if (isSystem) return `<p class="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4 text-sm font-bold text-cyan-100">Sistem:<br>${message.text}</p>`;
    return `<div class="max-w-[86%] rounded-3xl p-4 text-sm font-semibold ${isOwner ? "mr-auto rounded-bl-md bg-white/10 text-white" : "ml-auto rounded-br-md bg-cyan-400 text-[#071B33]"}">${isOwner ? `${transactionData.ownerName}:<br>` : ""}${message.text}</div>`;
  }

  function renderPhoto(flow) {
    const status = flow.photoVerification.status;
    const scanning = status === "scanning";
    const success = status === "success";
    const error = status === "error";
    return shell(flow, `<div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      ${card(`<h2 class="text-2xl font-extrabold">Validasi Foto Serah Terima</h2>
      <p class="mt-2 text-sm font-semibold leading-6 text-white/70">Upload foto saat serah terima. Foto harus menampilkan pemilik dan Magic Com yang dipinjam.</p>
      <div class="relative mt-5 min-h-[300px] overflow-hidden rounded-[28px] border border-white/10 bg-[#0B2545]">
        ${flow.photoVerification.type ? `<img src="${photoPreview(flow.photoVerification.type)}" alt="Preview validasi foto" class="h-full min-h-[300px] w-full object-cover opacity-80">` : `<div class="grid min-h-[300px] place-items-center text-center text-white/55"><div>${icon("image-plus", "mx-auto h-12 w-12")}<p class="mt-3 font-bold">Pilih foto untuk diverifikasi</p></div></div>`}
        ${scanning ? `<div class="tf-laser-overlay"><div class="tf-laser-line"></div><span>Memindai objek...</span></div>` : ""}
      </div>
      ${error ? `<p class="mt-4 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm font-extrabold text-red-200">Ditolak: Objek bukan Magic Com!</p>` : ""}
      ${success ? `<p class="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm font-extrabold text-emerald-200">Verifikasi Berhasil: Magic Com Terdeteksi</p>` : ""}
      <div class="mt-5 grid gap-3 sm:grid-cols-2">
        <button class="rounded-2xl border border-red-400/30 bg-red-400/10 px-5 py-3 font-bold text-red-100 transition hover:bg-red-400/20" data-photo-wrong>Upload Foto Salah</button>
        <button class="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 font-bold text-emerald-100 transition hover:bg-emerald-400/20" data-photo-correct>Upload Foto Benar</button>
      </div>
      ${success ? activeQr() : ""}`)}
      <aside class="grid h-fit gap-5">${infoPanel(flow)}${card(`<button class="w-full rounded-2xl border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white" data-open-flow-chat>Chat dengan Pemilik</button>`)}</aside>
    </div>`);
  }

  function photoPreview(type) {
    if (type === "correct") return productImage();
    return "https://loremflickr.com/900/650/backpack,student?lock=92371";
  }

  function activeQr() {
    return `<section class="mt-5 rounded-[28px] border border-cyan-300/20 bg-cyan-400/10 p-5 text-center">
      <h3 class="text-xl font-extrabold text-cyan-100">Kode QR Serah Terima Aktif</h3>
      <div id="tf-handover-qr" data-size="180" class="qr-container mx-auto mt-4 rounded-3xl bg-white p-4"></div>
      <button class="mt-5 rounded-2xl bg-cyan-400 px-5 py-3 font-bold text-[#071B33] shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300" data-scan-handover-qr>Scan QR Serah Terima</button>
    </section>`;
  }

  function runPhotoScan(flow, type) {
    flow.photoVerification = { status: "scanning", type, detectedObject: null, message: "Memindai objek..." };
    flow.qrActive = false;
    saveFlow(flow);
    renderTransactionFlow({ orderId: flow.transactionId });
    timers.scan = setTimeout(() => {
      const success = type === "correct";
      flow.photoVerification = {
        status: success ? "success" : "error",
        type,
        detectedObject: success ? "Magic Com" : "Tas",
        message: success ? "Verifikasi Berhasil: Magic Com Terdeteksi" : "Ditolak: Objek bukan Magic Com!"
      };
      flow.qrActive = success;
      saveFlow(flow);
      renderTransactionFlow({ orderId: flow.transactionId });
    }, 1700);
  }

  function renderLoan(flow) {
    if (!flow.loanStarted) {
      flow.loanStarted = true;
      flow.loanStartedAt = new Date().toISOString();
      flow.loanEndsAt = String(Date.now() + transactionData.loanDurationHours * 60 * 60 * 1000);
      saveFlow(flow);
    }
    timers.countdown = setInterval(() => updateCountdown(flow), 1000);
    setTimeout(() => updateCountdown(flow), 0);
    return shell(flow, `<div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      ${card(`<span class="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-extrabold text-emerald-200">Peminjaman aktif</span>
      <h2 class="mt-5 text-2xl font-extrabold">Peminjaman Magic Com Berhasil</h2>
      <p class="mt-2 text-sm font-semibold text-white/70">Magic Com sudah berhasil diterima dan masa peminjaman telah dimulai.</p>
      <div class="mt-6 grid grid-cols-3 gap-3 text-center">
        ${countCard("Jam", "tf-hours")}${countCard("Menit", "tf-minutes")}${countCard("Detik", "tf-seconds")}
      </div>
      <div class="mt-6 grid gap-3 sm:grid-cols-2">
        <button class="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/15" data-open-flow-chat>Chat dengan Pemilik</button>
        <button class="rounded-2xl bg-cyan-400 px-5 py-3 font-bold text-[#071B33] shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300" data-request-return>Kembalikan Barang</button>
      </div>`)}
      ${infoPanel(flow)}
    </div>`);
  }

  function countCard(label, id) {
    return `<div class="rounded-[24px] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-xl tf-pulse"><strong id="${id}" class="block text-3xl font-extrabold text-cyan-200 sm:text-4xl">00</strong><span class="text-xs font-bold text-white/55">${label}</span></div>`;
  }

  function updateCountdown(flow) {
    const remaining = Math.max(0, Number(flow.loanEndsAt || 0) - Date.now());
    const hours = Math.floor(remaining / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    const values = { "tf-hours": hours, "tf-minutes": minutes, "tf-seconds": seconds };
    Object.entries(values).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(value).padStart(2, "0");
    });
  }

  function renderReturnWaiting(flow) {
    if (!flow.returnRequested) {
      flow.returnRequested = true;
      flow.chatMessages.push({ from: "system", text: "Permintaan pengembalian dikirim. Chat pengembalian dengan pemilik sudah aktif." });
      saveFlow(flow);
    }
    if (!flow.returnApproved) {
      timers.returnApproval = setTimeout(() => {
        flow.returnApproved = true;
        saveFlow(flow);
        renderTransactionFlow({ orderId: flow.transactionId });
        timers.returnApproval = setTimeout(() => setStep(flow, "return-tracking"), 1200);
      }, 3000);
    }
    return shell(flow, `<div class="mx-auto max-w-4xl">
      ${card(`<div class="text-center">
        <span class="mx-auto grid h-16 w-16 place-items-center rounded-full ${flow.returnApproved ? "bg-emerald-400/10 text-emerald-200" : "bg-cyan-400/10 text-cyan-200"}">${icon(flow.returnApproved ? "check" : "loader", flow.returnApproved ? "h-8 w-8" : "h-8 w-8 tf-spin")}</span>
        <h2 class="mt-5 text-2xl font-extrabold">${flow.returnApproved ? "Pemilik Menyetujui" : "Menunggu Konfirmasi"}</h2>
        <p class="mx-auto mt-3 max-w-xl text-sm font-semibold leading-6 text-white/65">${flow.returnApproved ? "Pemilik menyetujui pengembalian dan akan menuju lokasi pengembalian." : "Permintaan pengembalian barang sedang dikirim ke pemilik."}</p>
        <button class="mt-5 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/15" data-open-flow-chat>Chat dengan Pemilik</button>
      </div>`) }
    </div>`);
  }

  function renderReturnTracking(flow) {
    scheduleReturnTracking(flow);
    const done = flow.returnGpsCompleted;
    return shell(flow, `<div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div class="grid gap-5">
        ${card(`<h2 class="text-xl font-extrabold">Status Pengembalian</h2><div class="mt-4 grid gap-3">${nodeRow("Permintaan Pengembalian Dikirim", "done")}${nodeRow("Pemilik Menuju Lokasi Pengembalian", done ? "done" : "active")}${nodeRow("Pemilik Sampai di Lokasi Pengembalian", done ? "done" : "waiting")}</div>`)}
        ${mockGpsMap(done, true)}
      </div>
      <aside class="grid h-fit gap-5">${infoPanel(flow)}${card(`<button class="w-full rounded-2xl border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white" data-return-owner-arrived>Cek Status Pemilik</button><button class="mt-3 w-full rounded-2xl bg-cyan-400 px-5 py-3 font-bold text-[#071B33] shadow-lg shadow-cyan-500/20" data-go-return-scan ${done ? "" : "disabled"}>Scan Pengembalian</button>`)}</aside>
    </div>`);
  }

  function scheduleReturnTracking(flow) {
    if (!flow.returnGpsCompleted) {
      timers.returnGps = setTimeout(() => {
        flow.returnGpsCompleted = true;
        saveFlow(flow);
        renderTransactionFlow({ orderId: flow.transactionId });
      }, 10000);
    }
  }

  function renderReturnScan(flow) {
    return shell(flow, `<div class="mx-auto max-w-4xl">
      ${card(`<h2 class="text-2xl font-extrabold">Scan Kode Pengembalian</h2>
      <p class="mt-2 text-sm font-semibold text-white/65">Masukkan kode pengembalian dari pemilik untuk menyelesaikan transaksi.</p>
      <label class="mt-5 block text-sm font-bold text-white" for="tf-return-code">Kode Pengembalian</label>
      <input id="tf-return-code" class="mt-2 min-h-[56px] w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-center font-mono text-2xl tracking-[0.3em] text-white outline-none focus:border-cyan-300" maxlength="6" inputmode="numeric" value="${flow.returnCode || ""}">
      <p id="tf-return-error" class="mt-3 hidden rounded-2xl border border-red-400/30 bg-red-400/10 p-3 text-sm font-bold text-red-200"></p>
      <button class="mt-5 w-full rounded-2xl bg-cyan-400 px-5 py-3 font-bold text-[#071B33] shadow-lg shadow-cyan-500/20" data-scan-return-code>Scan Pengembalian</button>`) }
    </div>`);
  }

  function renderReview(flow) {
    if (!flow.finalPopupOpen) {
      flow.finalPopupOpen = true;
      saveFlow(flow);
    }
    return shell(flow, `<div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      ${card(`${flow.finalPopupOpen ? `<div class="tf-popup mb-5 rounded-2xl border border-cyan-300/30 bg-cyan-400/10 p-4 text-sm font-extrabold text-cyan-100">Terima kasih atas ulasanmu! Yuk, jelajahi barang lagi dan kumpulkan poin.</div>` : ""}
      <h2 class="text-2xl font-extrabold">Review, Reward, dan Feedback</h2>
      <label class="mt-5 block text-sm font-bold text-white">Beri rating untuk ${transactionData.ownerName}</label>
      <div class="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Rating untuk Rizky Aulia">
        ${[1, 2, 3, 4, 5].map(value => `<button type="button" class="grid h-11 w-11 place-items-center rounded-2xl border ${flow.rating >= value ? "border-amber-300 bg-amber-300/20 text-amber-200" : "border-white/10 bg-white/5 text-white/35"}" data-flow-rating="${value}" aria-label="${value} bintang">${icon("star", flow.rating >= value ? "h-5 w-5 fill-current" : "h-5 w-5")}</button>`).join("")}
      </div>
      <label class="mt-5 block text-sm font-bold text-white" for="tf-review-text">Tulis ulasan singkat</label>
      <textarea id="tf-review-text" class="mt-2 min-h-32 w-full rounded-2xl border border-white/10 bg-white/10 p-4 text-white outline-none placeholder:text-white/40 focus:border-cyan-300" maxlength="500" placeholder="Bagikan pengalamanmu saat meminjam Magic Com dari Rizky Aulia...">${flow.reviewText || ""}</textarea>
      <p class="mt-2 text-right text-xs font-bold text-white/50"><span id="tf-review-count">${(flow.reviewText || "").length}</span>/500</p>
      <p id="tf-review-error" class="mt-3 hidden rounded-2xl border border-red-400/30 bg-red-400/10 p-3 text-sm font-bold text-red-200"></p>
      <button class="mt-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/15" data-submit-flow-review>${flow.reviewSubmitted ? "Ulasan Terkirim" : "Kirim Ulasan"}</button>
      <section class="mt-5 rounded-[24px] border border-cyan-300/20 bg-cyan-400/10 p-5">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h3 class="font-extrabold text-cyan-100">Claim 2 Koin</h3><p class="mt-1 text-sm font-semibold text-white/65">${flow.coinsClaimed ? "2 koin berhasil ditambahkan ke akunmu." : "Reward tersedia setelah transaksi selesai."}</p></div><button class="rounded-2xl bg-cyan-400 px-5 py-3 font-bold text-[#071B33] disabled:opacity-60 ${flow.coinsClaimed ? "tf-reward-pop" : ""}" data-claim-flow-coins ${flow.coinsClaimed ? "disabled" : ""}>${flow.coinsClaimed ? "Sudah Diklaim" : "Claim 2 Koin"}</button></div>
      </section>
      ${emojiSurvey(flow)}
      <button class="mt-6 w-full rounded-2xl bg-cyan-400 px-5 py-3 font-bold text-[#071B33] shadow-lg shadow-cyan-500/20" data-nav="home">Sewa atau Pinjam Lagi</button>`) }
      ${infoPanel(flow)}
    </div>`);
  }

  function emojiSurvey(flow) {
    const items = [["senang", "😍", "Senang"], ["perlu", "🙂", "Perlu Ditingkatkan"], ["suka", "😆", "Suka Banget"]];
    return `<section class="mt-5"><h3 class="font-extrabold">Bagaimana pengalamanmu menggunakan BarengBareng?</h3><div class="mt-3 grid gap-3 sm:grid-cols-3">${items.map(([key, emoji, label]) => `<button type="button" class="rounded-2xl border p-4 text-center transition ${flow.feedbackMood === key ? "scale-[1.03] border-cyan-300 bg-cyan-400/10 text-cyan-100" : "border-white/10 bg-white/5 text-white/70"}" data-flow-feedback="${key}"><span class="block text-3xl" aria-hidden="true">${emoji}</span><span class="mt-2 block text-sm font-extrabold">${label}</span></button>`).join("")}</div></section>`;
  }

  function bindEvents(flow) {
    components.bindNavEvents();
    document.querySelector("[data-owner-arrived]")?.addEventListener("click", () => handleOwnerArrived(flow));
    document.querySelector("[data-next-photo]")?.addEventListener("click", () => setStep(flow, "photo"));
    document.querySelectorAll("[data-open-flow-chat]").forEach(button => button.addEventListener("click", () => {
      flow.lastTransactionStatus = flow.currentStep;
      flow.currentStep = "chat";
      saveFlow(flow);
      renderTransactionFlow({ orderId: flow.transactionId });
    }));
    document.querySelector("[data-back-from-chat]")?.addEventListener("click", () => setStep(flow, flow.lastTransactionStatus || "tracking"));
    document.querySelector("#tf-chat-input")?.addEventListener("input", event => {
      flow.chatDraft = event.target.value.slice(0, 240);
      saveFlow(flow);
    });
    document.querySelector("[data-send-flow-chat]")?.addEventListener("click", () => {
      const text = String(document.querySelector("#tf-chat-input")?.value || "").trim();
      if (!text) return;
      flow.chatMessages.push({ from: "renter", text });
      flow.chatDraft = "";
      saveFlow(flow);
      renderTransactionFlow({ orderId: flow.transactionId });
    });
    document.querySelector("[data-photo-wrong]")?.addEventListener("click", () => runPhotoScan(flow, "wrong"));
    document.querySelector("[data-photo-correct]")?.addEventListener("click", () => runPhotoScan(flow, "correct"));
    document.querySelector("[data-scan-handover-qr]")?.addEventListener("click", () => {
      if (!flow.qrActive) return;
      flow.qrScanned = true;
      saveFlow(flow);
      setStep(flow, "loan");
    });
    document.querySelector("[data-request-return]")?.addEventListener("click", () => setStep(flow, "return-wait"));
    document.querySelector("[data-return-owner-arrived]")?.addEventListener("click", () => {
      flow.returnGpsCompleted = true;
      saveFlow(flow);
      renderTransactionFlow({ orderId: flow.transactionId });
    });
    document.querySelector("[data-go-return-scan]")?.addEventListener("click", () => setStep(flow, "return-scan"));
    document.querySelector("[data-scan-return-code]")?.addEventListener("click", () => {
      const code = String(document.querySelector("#tf-return-code")?.value || "").trim();
      const error = document.querySelector("#tf-return-error");
      if (!code) {
        if (error) {
          error.textContent = "Kode pengembalian wajib diisi.";
          error.classList.remove("hidden");
        }
        return;
      }
      flow.returnCode = code;
      flow.returnQrScanned = true;
      saveFlow(flow);
      setStep(flow, "review");
    });
    document.querySelectorAll("[data-flow-rating]").forEach(button => button.addEventListener("click", () => {
      flow.rating = Number(button.dataset.flowRating);
      saveFlow(flow);
      renderTransactionFlow({ orderId: flow.transactionId });
    }));
    document.querySelector("#tf-review-text")?.addEventListener("input", event => {
      flow.reviewText = event.target.value.slice(0, 500);
      saveFlow(flow);
      const count = document.querySelector("#tf-review-count");
      if (count) count.textContent = String(flow.reviewText.length);
    });
    document.querySelector("[data-submit-flow-review]")?.addEventListener("click", () => {
      const error = document.querySelector("#tf-review-error");
      if (!flow.rating) {
        if (error) {
          error.textContent = "Rating wajib dipilih.";
          error.classList.remove("hidden");
        }
        return;
      }
      if (flow.reviewText.trim().length < 5) {
        if (error) {
          error.textContent = "Review minimal 5 karakter.";
          error.classList.remove("hidden");
        }
        return;
      }
      flow.reviewSubmitted = true;
      saveFlow(flow);
      ui.toast("Ulasan berhasil dikirim");
      renderTransactionFlow({ orderId: flow.transactionId });
    });
    document.querySelector("[data-claim-flow-coins]")?.addEventListener("click", () => {
      if (flow.coinsClaimed) return;
      flow.coinsClaimed = true;
      state.coinBalance = Number(state.coinBalance || 0) + transactionData.rewardCoins;
      saveFlow(flow);
      ui.toast("2 koin berhasil ditambahkan ke akunmu.");
      renderTransactionFlow({ orderId: flow.transactionId });
    });
    document.querySelectorAll("[data-flow-feedback]").forEach(button => button.addEventListener("click", () => {
      flow.feedbackMood = button.dataset.flowFeedback;
      saveFlow(flow);
      renderTransactionFlow({ orderId: flow.transactionId });
    }));
    if (flow.qrActive) qris.createQr?.("tf-handover-qr", `BB-HANDOVER-${flow.transactionId}-${transactionData.itemName}`);
    if (window.lucide) lucide.createIcons();
  }

  function renderTransactionFlow(params = {}) {
    const mount = document.querySelector("#transaction-flow-view");
    if (!mount) return;
    clearFlowTimers();
    const flow = getFlow(params.orderId || params.productId || transactionData.id);
    const views = {
      tracking: renderTracking,
      chat: renderChat,
      photo: renderPhoto,
      loan: renderLoan,
      "return-wait": renderReturnWaiting,
      "return-tracking": renderReturnTracking,
      "return-scan": renderReturnScan,
      review: renderReview
    };
    mount.innerHTML = (views[flow.currentStep] || renderTracking)(flow);
    bindEvents(flow);
    animations.refresh?.();
  }

  Object.assign(components, { renderTransactionFlow });
  // TRANSACTION FLOW FEATURE END
})();
