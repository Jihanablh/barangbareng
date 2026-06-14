(function () {
  // TRACKING FLOW FEATURE START
  const STORAGE_KEY = "barangBarengTrackingFlows";
  const icon = (name, cls = "h-5 w-5") => components.icon(name, cls);
  const rupiah = value => components.rupiah(Number(value || 0));
  const fallbackImage = BBData.fallbackProductImage || "/images/products/product-placeholder.svg";
  const readStore = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  };
  const writeStore = value => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      return false;
    }
    return true;
  };

  const timers = { owner: null, countdown: null, approval: null, returnTrip: null };

  function clearTimers() {
    Object.keys(timers).forEach(key => {
      clearTimeout(timers[key]);
      clearInterval(timers[key]);
      timers[key] = null;
    });
  }

  function orderCode(product) {
    return state.orderCode || `ORD-20260614-${String(product.id).padStart(4, "0")}`;
  }

  function currentProduct() {
    const product = components.selectedProduct?.() || BBData.products[0];
    return product || BBData.products[0];
  }

  function defaultFlow(orderId) {
    return {
      orderId,
      step: "tracking",
      ownerArrived: false,
      returnArrived: false,
      ownerEta: "14:20 WIB",
      handoverCode: state.handoverCode || "482913",
      returnCode: "729481",
      handoverPhoto: "",
      returnPhoto: "",
      handoverReceivedAt: "",
      loanEndsAt: "",
      approvalStartedAt: "",
      reviewRating: 0,
      reviewText: "",
      rewardClaimed: false,
      feedbackMood: ""
    };
  }

  function getFlow(orderId) {
    state.trackingFlows = state.trackingFlows || readStore();
    if (!state.trackingFlows[orderId]) state.trackingFlows[orderId] = defaultFlow(orderId);
    return state.trackingFlows[orderId];
  }

  function saveFlow(flow) {
    state.trackingFlows = state.trackingFlows || {};
    state.trackingFlows[flow.orderId] = flow;
    writeStore(state.trackingFlows);
  }

  function setStep(flow, step) {
    flow.step = step;
    saveFlow(flow);
    renderTrackingFlow({ orderId: flow.orderId });
  }

  function pageShell(title, subtitle, body) {
    return `<main class="min-h-screen bg-slate-50 pt-24">
      <div class="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        ${components.pageTopBar({ backLabel: "Kembali ke Detail Transaksi", backTo: "order-detail", breadcrumb: ["Transaksi", title] })}
        <header class="mb-6 rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur md:p-7">
          <p class="text-sm font-extrabold text-brand-blue">BarangBareng Tracking</p>
          <h1 class="mt-2 text-2xl font-extrabold leading-tight text-slate-950 sm:text-3xl">${title}</h1>
          <p class="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500">${subtitle}</p>
        </header>
        ${body}
      </div>
    </main>`;
  }

  function productSummary(product, flow) {
    return `<article class="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm">
      <div class="flex gap-4">
        <img src="${BBData.getProductImage?.(product) || fallbackImage}" alt="${product.name}" class="h-24 w-24 shrink-0 rounded-3xl object-cover" onerror="this.onerror=null;this.src='${fallbackImage}'">
        <div class="min-w-0">
          <p class="text-xs font-extrabold uppercase text-brand-blue">${flow.orderId}</p>
          <h2 class="mt-1 line-clamp-2 text-lg font-extrabold text-slate-950">${product.name}</h2>
          <p class="mt-1 text-sm font-semibold text-slate-500">${product.owner.name} - ${product.campus}</p>
          <p class="mt-2 inline-flex rounded-2xl bg-blue-50 px-3 py-2 text-xs font-extrabold text-brand-blue">${state.codLocation || product.location}</p>
        </div>
      </div>
    </article>`;
  }

  function stepper(active) {
    const steps = [
      ["tracking", "Tracking"],
      ["handover", "Serah Terima"],
      ["active", "Aktif"],
      ["return", "Pengembalian"],
      ["complete", "Review"]
    ];
    const activeIndex = steps.findIndex(([key]) => key === active || (active.startsWith("return") && key === "return"));
    return `<nav class="grid gap-2 sm:grid-cols-5" aria-label="Progress transaksi">
      ${steps.map((step, index) => {
        const label = step[1];
        const done = index < activeIndex;
        const current = index === activeIndex;
        return `<span class="rounded-2xl px-3 py-2 text-center text-xs font-extrabold ${done ? "bg-teal-50 text-teal-700" : current ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-blue" : "bg-white text-slate-400 ring-1 ring-slate-100"}">${done ? "Selesai" : label}</span>`;
      }).join("")}
    </nav>`;
  }

  function routeMap(arrived, returnMode = false) {
    const title = returnMode ? "Rute pengembalian" : "Rute serah terima";
    const markerClass = arrived ? "bb-tracking-marker-finish" : "bb-tracking-marker-move";
    return `<section class="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-lg font-extrabold text-slate-950">${title}</h2>
          <p class="mt-1 text-sm font-semibold text-slate-500">${returnMode ? "Pemilik menuju titik pengembalian." : "Pemilik menuju titik COD yang sudah disepakati."}</p>
        </div>
        <span class="rounded-full bg-teal-50 px-4 py-2 text-sm font-extrabold text-teal-700">${arrived ? "Sudah sampai" : "Dalam perjalanan"}</span>
      </div>
      <div class="bb-tracking-map mt-5 min-h-[260px] overflow-hidden rounded-[28px] border border-slate-100 bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div class="bb-tracking-route"></div>
        <div class="bb-tracking-pin bb-tracking-origin">${icon(returnMode ? "package-check" : "bike", "h-5 w-5")}</div>
        <div class="bb-tracking-pin bb-tracking-destination">${icon("map-pin", "h-5 w-5")}</div>
        <div class="bb-tracking-marker ${markerClass}">${icon(returnMode ? "truck" : "navigation", "h-5 w-5")}</div>
        <div class="absolute bottom-4 left-4 right-4 grid gap-2 rounded-3xl bg-white/85 p-4 text-sm font-bold text-slate-600 shadow-sm backdrop-blur sm:grid-cols-3">
          <span>${icon("map-pin", "mr-1 inline h-4 w-4 text-brand-blue")} ${returnMode ? "Titik pemilik" : "Titik pemilik"}</span>
          <span>${icon("clock-3", "mr-1 inline h-4 w-4 text-amber-500")} ETA ${arrived ? "Tiba" : "10 detik"}</span>
          <span>${icon("shield-check", "mr-1 inline h-4 w-4 text-teal-600")} Validasi aman</span>
        </div>
      </div>
    </section>`;
  }

  function statusNodes(arrived) {
    const rows = [
      ["Pesanan siap diproses", true],
      ["Pemilik menuju lokasi COD", true],
      ["Pemilik tiba di lokasi", arrived]
    ];
    return `<div class="grid gap-3">${rows.map(([label, done]) => `<div class="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 text-sm font-bold ${done ? "text-teal-700" : "text-slate-500"}">
      <span class="grid h-8 w-8 place-items-center rounded-full ${done ? "bg-teal-100" : "bg-white"}">${icon(done ? "check" : "loader", "h-4 w-4")}</span>${label}
    </div>`).join("")}</div>`;
  }

  function renderTracking(product, flow) {
    if (!flow.ownerArrived) {
      timers.owner = setTimeout(() => {
        flow.ownerArrived = true;
        saveFlow(flow);
        renderTrackingFlow({ orderId: flow.orderId });
      }, 10000);
    }
    return pageShell("Tracking Lokasi Serah Terima", "Pantau perjalanan pemilik, cek status kedatangan, lalu lanjutkan validasi kode serah terima.", `<div class="grid gap-5">
      ${stepper("tracking")}
      <div class="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div class="grid gap-5">${routeMap(flow.ownerArrived)}<article class="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm">${statusNodes(flow.ownerArrived)}</article></div>
        <aside class="grid h-fit gap-4">
          ${productSummary(product, flow)}
          <article class="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm">
            <h2 class="text-lg font-extrabold text-slate-950">Aksi Cepat</h2>
            <button class="btn-secondary mt-4 w-full rounded-2xl px-5 py-3" data-nav="chat">${icon("message-circle", "h-4 w-4")} Chat Pemilik <span class="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">2</span></button>
            <button class="btn-secondary mt-3 w-full rounded-2xl px-5 py-3" data-owner-arrived>${icon("map-pin-check", "h-4 w-4")} Cek Status Pemilik</button>
            <button class="btn-primary mt-3 w-full rounded-2xl px-5 py-3" data-go-handover ${flow.ownerArrived ? "" : "disabled"}>${icon("qr-code", "h-4 w-4")} Dapatkan Kode Serah Terima</button>
          </article>
          <article class="rounded-[28px] border border-blue-100 bg-blue-50 p-5 text-sm font-semibold leading-6 text-blue-800">
            <b class="block text-base text-blue-900">Preview chat</b>
            Pemilik: Aku sudah dekat titik COD, estimasi sampai sebentar lagi.
          </article>
        </aside>
      </div>
    </div>`);
  }

  function uploadBox(kind, photo) {
    return `<div class="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-4">
      <label class="block text-sm font-extrabold text-slate-800">${kind === "handover" ? "Foto penerimaan barang" : "Foto kondisi barang saat dikembalikan"}</label>
      <div class="mt-3 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <input id="${kind}-photo-input" class="field" type="file" accept="image/*" aria-label="Upload foto ${kind}">
        <button type="button" class="btn-secondary rounded-2xl px-4 py-3" data-camera="${kind}">${icon("camera", "h-4 w-4")} Kamera</button>
        <button type="button" class="btn-secondary rounded-2xl px-4 py-3" data-capture="${kind}">${icon("scan-line", "h-4 w-4")} Ambil Foto</button>
      </div>
      <video id="${kind}-camera" class="mt-3 hidden max-h-64 w-full rounded-3xl bg-slate-900 object-cover" playsinline></video>
      <canvas id="${kind}-canvas" class="hidden"></canvas>
      <div id="${kind}-photo-preview" class="mt-3">${photo ? `<img src="${photo}" alt="Preview foto ${kind}" class="max-h-72 w-full rounded-3xl object-cover">` : `<p class="rounded-2xl bg-white p-4 text-sm font-bold text-slate-500">Belum ada foto yang dipilih.</p>`}</div>
      <p id="${kind}-photo-error" class="mt-2 hidden rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700"></p>
    </div>`;
  }

  function renderHandover(product, flow) {
    return pageShell("Validasi Kode Serah Terima", "Ambil atau upload foto penerimaan barang, lalu validasi untuk mengaktifkan masa peminjaman.", `<div class="grid gap-5">
      ${stepper("handover")}
      <section class="grid gap-5 lg:grid-cols-[1fr_360px]">
        <article class="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p class="text-sm font-extrabold text-brand-blue">Kode Serah Terima</p><p class="mt-2 tracking-[0.35em] text-3xl font-extrabold text-slate-950">${flow.handoverCode}</p></div>
            <div id="tracking-handover-qr" class="qr-container w-[160px] max-w-full"></div>
          </div>
          <div class="mt-5">${uploadBox("handover", flow.handoverPhoto)}</div>
          <button class="btn-primary mt-5 w-full rounded-2xl px-5 py-3" data-verify-handover>${icon("badge-check", "h-4 w-4")} Validasi dan Mulai Peminjaman</button>
        </article>
        <aside class="grid h-fit gap-4">${productSummary(product, flow)}<article class="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm"><h2 class="font-extrabold text-slate-950">Catatan COD</h2><p class="mt-2 text-sm font-semibold leading-6 text-slate-500">Pastikan nama barang, kelengkapan, dan kondisi fisik sudah sesuai sebelum validasi.</p><button class="btn-secondary mt-4 w-full rounded-2xl px-5 py-3" data-nav="chat">Chat Pemilik</button></article></aside>
      </section>
    </div>`);
  }

  function countdownHtml(flow) {
    if (!flow.loanEndsAt) flow.loanEndsAt = String(Date.now() + 48 * 60 * 60 * 1000);
    saveFlow(flow);
    return `<span id="loan-countdown" class="font-mono text-4xl font-extrabold text-brand-blue sm:text-5xl">48:00:00</span>`;
  }

  function updateCountdown(flow) {
    const target = document.querySelector("#loan-countdown");
    if (!target) return;
    const remaining = Math.max(0, Number(flow.loanEndsAt) - Date.now());
    const hours = Math.floor(remaining / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    target.textContent = [hours, minutes, seconds].map(value => String(value).padStart(2, "0")).join(":");
  }

  function renderActive(product, flow) {
    timers.countdown = setInterval(() => updateCountdown(flow), 1000);
    setTimeout(() => updateCountdown(flow), 0);
    return pageShell("Peminjaman Aktif", "Barang sudah diterima. Pantau sisa waktu peminjaman dan mulai pengembalian saat barang siap dikembalikan.", `<div class="grid gap-5">
      ${stepper("active")}
      <section class="grid gap-5 lg:grid-cols-[1fr_360px]">
        <article class="rounded-[28px] border border-slate-100 bg-white p-6 text-center shadow-sm">
          <span class="rounded-full bg-teal-50 px-4 py-2 text-sm font-extrabold text-teal-700">Peminjaman berjalan</span>
          <h2 class="mt-5 text-xl font-extrabold text-slate-950">Sisa waktu peminjaman</h2>
          <p class="mt-4">${countdownHtml(flow)}</p>
          <p class="mx-auto mt-4 max-w-xl text-sm font-semibold leading-6 text-slate-500">Durasi aktif 48 jam sejak barang diterima pada ${flow.handoverReceivedAt ? new Date(flow.handoverReceivedAt).toLocaleString("id-ID") : "hari ini"}.</p>
          <button class="btn-primary mt-6 rounded-2xl px-6 py-3" data-start-return>${icon("rotate-ccw", "h-4 w-4")} Kembalikan Barang</button>
        </article>
        ${productSummary(product, flow)}
      </section>
    </div>`);
  }

  function renderReturnWaiting(product, flow) {
    if (!flow.approvalStartedAt) {
      flow.approvalStartedAt = new Date().toISOString();
      saveFlow(flow);
    }
    timers.approval = setTimeout(() => setStep(flow, "return-tracking"), 3000);
    return pageShell("Menunggu Konfirmasi Pemilik", "Permintaan pengembalian sudah dikirim. Pemilik akan mengonfirmasi titik temu pengembalian.", `<section class="grid gap-5 lg:grid-cols-[1fr_360px]">
      <article class="rounded-[28px] border border-slate-100 bg-white p-8 text-center shadow-sm">
        <span class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blue-50 text-brand-blue">${icon("loader", "h-8 w-8 bb-spin-soft")}</span>
        <h2 class="mt-5 text-2xl font-extrabold text-slate-950">Konfirmasi sedang diproses</h2>
        <p class="mx-auto mt-3 max-w-xl text-sm font-semibold leading-6 text-slate-500">Halaman akan lanjut otomatis setelah pemilik menyetujui pengembalian.</p>
      </article>
      ${productSummary(product, flow)}
    </section>`);
  }

  function renderReturnTracking(product, flow) {
    if (!flow.returnArrived) {
      timers.returnTrip = setTimeout(() => {
        flow.returnArrived = true;
        saveFlow(flow);
        renderTrackingFlow({ orderId: flow.orderId });
      }, 10000);
    }
    return pageShell("Tracking Lokasi Pengembalian", "Pemilik menuju lokasi pengembalian. Setelah tiba, validasi kode dan foto pengembalian.", `<div class="grid gap-5">
      ${stepper("return-tracking")}
      <section class="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div class="grid gap-5">${routeMap(flow.returnArrived, true)}<article class="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm">${statusNodes(flow.returnArrived)}</article></div>
        <aside class="grid h-fit gap-4">${productSummary(product, flow)}
          <article class="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm">
            <button class="btn-secondary w-full rounded-2xl px-5 py-3" data-return-arrived>${icon("map-pin-check", "h-4 w-4")} Cek Status Pemilik</button>
            <button class="btn-primary mt-3 w-full rounded-2xl px-5 py-3" data-go-return-validation ${flow.returnArrived ? "" : "disabled"}>${icon("qr-code", "h-4 w-4")} Validasi Pengembalian</button>
          </article>
        </aside>
      </section>
    </div>`);
  }

  function renderReturnValidation(product, flow) {
    return pageShell("Validasi Pengembalian Barang", "Masukkan kode 6 digit, upload foto kondisi barang, lalu selesaikan transaksi.", `<div class="grid gap-5">
      ${stepper("return-validation")}
      <section class="grid gap-5 lg:grid-cols-[1fr_360px]">
        <article class="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm">
          <label class="block text-sm font-extrabold text-slate-800" for="return-code-input">Kode pengembalian 6 digit</label>
          <div class="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
            <input id="return-code-input" class="field text-center font-mono text-2xl tracking-[0.25em]" maxlength="6" inputmode="numeric" placeholder="000000" value="">
            <button type="button" class="btn-secondary rounded-2xl px-5 py-3" data-scan-return>${icon("scan-line", "h-4 w-4")} Scan Kode</button>
          </div>
          <p id="return-code-error" class="mt-2 hidden rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700"></p>
          <div class="mt-5">${uploadBox("return", flow.returnPhoto)}</div>
          <button class="btn-primary mt-5 w-full rounded-2xl px-5 py-3" data-complete-tracking>${icon("check-circle-2", "h-4 w-4")} Selesaikan Transaksi</button>
        </article>
        ${productSummary(product, flow)}
      </section>
    </div>`);
  }

  function renderComplete(product, flow) {
    const total = checkout.calculate?.(product, checkout.durationFromDates?.() || 2) || { total: product.price * 2 };
    return pageShell("Transaksi Selesai", "Berikan ulasan, klaim reward, lalu kirim feedback pengalaman peminjaman kamu.", `<div class="grid gap-5">
      ${stepper("complete")}
      <section class="grid gap-5 lg:grid-cols-[1fr_360px]">
        <article class="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm">
          <div class="rounded-3xl bg-teal-50 p-5 text-teal-800">
            <h2 class="text-xl font-extrabold">Ringkasan transaksi</h2>
            <div class="mt-4 grid gap-3 text-sm font-bold sm:grid-cols-2">
              <p>Barang: ${product.name}</p>
              <p>Total: ${rupiah(total.total || total)}</p>
              <p>Serah terima: ${flow.handoverReceivedAt ? new Date(flow.handoverReceivedAt).toLocaleString("id-ID") : "-"}</p>
              <p>Status: Selesai</p>
            </div>
          </div>
          <div class="mt-5">
            <label class="block text-sm font-extrabold text-slate-800">Rating pengalaman</label>
            <div class="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Rating pengalaman">
              ${[1, 2, 3, 4, 5].map(value => `<button type="button" class="grid h-11 w-11 place-items-center rounded-2xl ${flow.reviewRating >= value ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-400"}" data-rating="${value}" aria-label="${value} bintang">${icon("star", flow.reviewRating >= value ? "h-5 w-5 fill-current" : "h-5 w-5")}</button>`).join("")}
            </div>
            <label class="mt-5 block text-sm font-extrabold text-slate-800" for="tracking-review">Review</label>
            <textarea id="tracking-review" class="field mt-2 min-h-32" maxlength="500" placeholder="Ceritakan pengalaman kamu...">${flow.reviewText || ""}</textarea>
            <p class="mt-2 text-right text-xs font-bold text-slate-500"><span id="review-count">${(flow.reviewText || "").length}</span>/500</p>
            <button class="btn-primary mt-3 rounded-2xl px-5 py-3" data-submit-tracking-review>Kirim Ulasan</button>
          </div>
          <div class="mt-5 rounded-[24px] border border-amber-100 bg-amber-50 p-5">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div><p class="font-extrabold text-amber-800">Reward 2 Koin</p><p class="mt-1 text-sm font-semibold text-amber-700">Klaim reward setelah transaksi selesai.</p></div>
              <button class="rounded-2xl bg-amber-500 px-5 py-3 font-extrabold text-white disabled:opacity-60" data-claim-reward ${flow.rewardClaimed ? "disabled" : ""}>${flow.rewardClaimed ? "Sudah Diklaim" : "Klaim Reward"}</button>
            </div>
          </div>
          <div class="mt-5">
            <p class="text-sm font-extrabold text-slate-800">Feedback singkat</p>
            <div class="mt-3 grid gap-2 sm:grid-cols-3">
              ${[["senang", "Sangat puas"], ["netral", "Cukup baik"], ["perlu-dibantu", "Perlu dibantu"]].map(([key, label]) => `<button type="button" class="rounded-2xl border px-4 py-3 font-extrabold ${flow.feedbackMood === key ? "border-brand-blue bg-blue-50 text-brand-blue" : "border-slate-200 text-slate-600"}" data-feedback="${key}">${label}</button>`).join("")}
            </div>
          </div>
          <button class="btn-secondary mt-6 w-full rounded-2xl px-5 py-3" data-nav="home">Kembali ke Beranda</button>
        </article>
        ${productSummary(product, flow)}
      </section>
    </div>`);
  }

  function readFileAsDataUrl(file, callback) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => callback(String(reader.result || ""));
    reader.readAsDataURL(file);
  }

  function bindPhoto(kind, flow) {
    const input = document.getElementById(`${kind}-photo-input`);
    const video = document.getElementById(`${kind}-camera`);
    const canvas = document.getElementById(`${kind}-canvas`);
    const key = kind === "handover" ? "handoverPhoto" : "returnPhoto";
    input?.addEventListener("change", event => {
      readFileAsDataUrl(event.target.files?.[0], dataUrl => {
        flow[key] = dataUrl;
        saveFlow(flow);
        renderTrackingFlow({ orderId: flow.orderId });
      });
    });
    document.querySelector(`[data-camera="${kind}"]`)?.addEventListener("click", async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.classList.remove("hidden");
        await video.play();
      } catch {
        ui.toast("Kamera belum bisa diakses. Gunakan upload foto.");
      }
    });
    document.querySelector(`[data-capture="${kind}"]`)?.addEventListener("click", () => {
      if (!video?.srcObject || !canvas) {
        ui.toast("Aktifkan kamera dulu atau upload foto.");
        return;
      }
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
      flow[key] = canvas.toDataURL("image/jpeg", 0.88);
      video.srcObject.getTracks().forEach(track => track.stop());
      saveFlow(flow);
      renderTrackingFlow({ orderId: flow.orderId });
    });
  }

  function bindEvents(product, flow) {
    components.bindNavEvents();
    document.querySelector("[data-owner-arrived]")?.addEventListener("click", () => {
      flow.ownerArrived = true;
      saveFlow(flow);
      renderTrackingFlow({ orderId: flow.orderId });
    });
    document.querySelector("[data-go-handover]")?.addEventListener("click", () => setStep(flow, "handover"));
    document.querySelector("[data-verify-handover]")?.addEventListener("click", () => {
      if (!flow.handoverPhoto) {
        const error = document.querySelector("#handover-photo-error");
        if (error) {
          error.textContent = "Upload atau ambil foto penerimaan barang terlebih dahulu.";
          error.classList.remove("hidden");
        }
        return;
      }
      flow.handoverReceivedAt = new Date().toISOString();
      flow.loanEndsAt = String(Date.now() + 48 * 60 * 60 * 1000);
      state.orderStatus = "RENTED";
      saveFlow(flow);
      ui.toast("Barang diterima. Peminjaman aktif.");
      setStep(flow, "active");
    });
    document.querySelector("[data-start-return]")?.addEventListener("click", () => setStep(flow, "return-waiting"));
    document.querySelector("[data-return-arrived]")?.addEventListener("click", () => {
      flow.returnArrived = true;
      saveFlow(flow);
      renderTrackingFlow({ orderId: flow.orderId });
    });
    document.querySelector("[data-go-return-validation]")?.addEventListener("click", () => setStep(flow, "return-validation"));
    document.querySelector("[data-scan-return]")?.addEventListener("click", () => {
      const input = document.querySelector("#return-code-input");
      if (input) input.value = flow.returnCode;
      ui.toast("Kode pengembalian terbaca");
    });
    document.querySelector("[data-complete-tracking]")?.addEventListener("click", () => {
      const code = document.querySelector("#return-code-input")?.value.trim();
      const codeError = document.querySelector("#return-code-error");
      const photoError = document.querySelector("#return-photo-error");
      if (code !== flow.returnCode) {
        if (codeError) {
          codeError.textContent = "Kode pengembalian harus 6 digit dan sesuai kode transaksi.";
          codeError.classList.remove("hidden");
        }
        return;
      }
      if (!flow.returnPhoto) {
        if (photoError) {
          photoError.textContent = "Upload atau ambil foto kondisi barang saat dikembalikan.";
          photoError.classList.remove("hidden");
        }
        return;
      }
      state.orderStatus = "COMPLETED";
      saveFlow(flow);
      ui.toast("Transaksi selesai");
      setStep(flow, "complete");
    });
    document.querySelectorAll("[data-rating]").forEach(button => button.addEventListener("click", () => {
      flow.reviewRating = Number(button.dataset.rating);
      saveFlow(flow);
      renderTrackingFlow({ orderId: flow.orderId });
    }));
    document.querySelector("#tracking-review")?.addEventListener("input", event => {
      flow.reviewText = event.target.value.slice(0, 500);
      saveFlow(flow);
      const count = document.querySelector("#review-count");
      if (count) count.textContent = String(flow.reviewText.length);
    });
    document.querySelector("[data-submit-tracking-review]")?.addEventListener("click", () => {
      if (!flow.reviewRating) {
        ui.toast("Pilih rating terlebih dahulu");
        return;
      }
      if (!flow.reviewText.trim()) {
        ui.toast("Isi review terlebih dahulu");
        return;
      }
      ui.toast("Ulasan berhasil dikirim");
    });
    document.querySelector("[data-claim-reward]")?.addEventListener("click", () => {
      if (flow.rewardClaimed) return;
      flow.rewardClaimed = true;
      state.coinBalance = Number(state.coinBalance || 0) + 2;
      saveFlow(flow);
      ui.toast("Reward 2 koin berhasil diklaim");
      renderTrackingFlow({ orderId: flow.orderId });
    });
    document.querySelectorAll("[data-feedback]").forEach(button => button.addEventListener("click", () => {
      flow.feedbackMood = button.dataset.feedback;
      saveFlow(flow);
      renderTrackingFlow({ orderId: flow.orderId });
    }));
    bindPhoto("handover", flow);
    bindPhoto("return", flow);
    if (window.lucide) lucide.createIcons();
    if (flow.step === "handover") qris.createQr?.("tracking-handover-qr", `BB-HANDOVER-${flow.orderId}-${flow.handoverCode}`);
  }

  function renderTrackingFlow(params = {}) {
    const mount = document.querySelector("#tracking-view");
    if (!mount) return;
    clearTimers();
    const product = currentProduct();
    const flow = getFlow(params.orderId || orderCode(product));
    const renderers = {
      tracking: renderTracking,
      handover: renderHandover,
      active: renderActive,
      "return-waiting": renderReturnWaiting,
      "return-tracking": renderReturnTracking,
      "return-validation": renderReturnValidation,
      complete: renderComplete
    };
    mount.innerHTML = (renderers[flow.step] || renderTracking)(product, flow);
    bindEvents(product, flow);
    animations.refresh?.();
  }

  Object.assign(components, { renderTrackingFlow });
  // TRACKING FLOW FEATURE END
})();
