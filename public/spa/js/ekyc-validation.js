(function () {
  // EKYC VALIDATION UTILITY START
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
  const MIN_IMAGE_WIDTH = 500;
  const MIN_IMAGE_HEIGHT = 500;
  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
  const MAX_BIRTH_DATE = "2010-12-31";

  function imageError(message) {
    return { isValid: false, errors: [message], meta: {} };
  }

  function formatBytes(bytes) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("File gambar rusak atau tidak dapat dibaca."));
      reader.readAsDataURL(file);
    });
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("File gambar rusak atau tidak dapat dibaca."));
      image.src = src;
    });
  }

  function sampleCanvas(image) {
    const sampleWidth = 180;
    const ratio = image.naturalWidth / image.naturalHeight || 1;
    const width = sampleWidth;
    const height = Math.max(1, Math.round(sampleWidth / ratio));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(image, 0, 0, width, height);
    return { canvas, ctx, width, height };
  }

  function analyzeCanvas(image) {
    const { ctx, width, height } = sampleCanvas(image);
    const data = ctx.getImageData(0, 0, width, height).data;
    let sum = 0;
    let sumSq = 0;
    let edge = 0;
    let edgeCount = 0;
    const gray = new Float32Array(width * height);

    for (let index = 0; index < data.length; index += 4) {
      const value = (data[index] * 0.299) + (data[index + 1] * 0.587) + (data[index + 2] * 0.114);
      const pixel = index / 4;
      gray[pixel] = value;
      sum += value;
      sumSq += value * value;
    }

    for (let y = 1; y < height - 1; y += 1) {
      for (let x = 1; x < width - 1; x += 1) {
        const pixel = y * width + x;
        edge += Math.abs(gray[pixel] - gray[pixel - 1]) + Math.abs(gray[pixel] - gray[pixel - width]);
        edgeCount += 2;
      }
    }

    const center = {
      x1: Math.floor(width * 0.22),
      x2: Math.ceil(width * 0.78),
      y1: Math.floor(height * 0.22),
      y2: Math.ceil(height * 0.78)
    };
    let centerSum = 0;
    let centerSumSq = 0;
    let centerCount = 0;
    for (let y = center.y1; y < center.y2; y += 1) {
      for (let x = center.x1; x < center.x2; x += 1) {
        const value = gray[y * width + x];
        centerSum += value;
        centerSumSq += value * value;
        centerCount += 1;
      }
    }

    const brightness = sum / gray.length;
    const contrast = Math.sqrt(Math.max(0, (sumSq / gray.length) - (brightness * brightness)));
    const centerBrightness = centerSum / Math.max(1, centerCount);
    const centerContrast = Math.sqrt(Math.max(0, (centerSumSq / Math.max(1, centerCount)) - (centerBrightness * centerBrightness)));
    return {
      width: image.naturalWidth,
      height: image.naturalHeight,
      brightness: Math.round(brightness),
      contrast: Math.round(contrast),
      blurScore: Math.round(edge / Math.max(1, edgeCount)),
      centerBrightness: Math.round(centerBrightness),
      centerContrast: Math.round(centerContrast),
      aspectRatio: Number((image.naturalWidth / image.naturalHeight).toFixed(2))
    };
  }

  async function validateImageFile(file) {
    if (!file) return imageError("File wajib dipilih.");
    if (file.size === 0) return imageError("File gambar rusak atau tidak dapat dibaca.");
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return imageError("Format file harus JPG, JPEG, atau PNG.");
    if (file.size > MAX_IMAGE_SIZE) return imageError(`Ukuran file maksimal 5 MB. Ukuran file saat ini ${formatBytes(file.size)}.`);

    try {
      const preview = await readFileAsDataUrl(file);
      const image = await loadImage(preview);
      if (!image.naturalWidth || !image.naturalHeight) return imageError("File gambar rusak atau tidak dapat dibaca.");
      const meta = analyzeCanvas(image);
      const errors = [];
      if (meta.width < MIN_IMAGE_WIDTH || meta.height < MIN_IMAGE_HEIGHT) errors.push("Resolusi foto minimal 500 x 500 px.");
      if (meta.brightness < 45) errors.push("Foto terlalu gelap. Gunakan pencahayaan yang cukup.");
      if (meta.brightness > 235) errors.push("Foto terlalu terang. Hindari pantulan cahaya berlebihan.");
      if (meta.blurScore < 7 || meta.contrast < 18) errors.push("Foto terlalu blur. Ambil ulang foto dengan lebih jelas.");
      return { isValid: errors.length === 0, errors, meta, preview };
    } catch {
      return imageError("File gambar rusak atau tidak dapat dibaca.");
    }
  }

  async function validateKtpImage(file) {
    const result = await validateImageFile(file);
    if (!result.isValid && !result.preview) return result;
    const errors = [...result.errors];
    const meta = result.meta || {};
    const looksLikeCard = meta.aspectRatio >= 0.65 && meta.aspectRatio <= 2.35;
    const centerReadable = meta.centerContrast >= 14 && meta.centerBrightness >= 50 && meta.centerBrightness <= 230;
    if (!looksLikeCard || !centerReadable) {
      errors.push("Foto KTP tidak terbaca. Pastikan seluruh bagian KTP masuk ke dalam frame.");
    }
    return { ...result, isValid: errors.length === 0, errors };
  }

  async function validateSelfieImage(file) {
    const result = await validateImageFile(file);
    if (!result.isValid && !result.preview) return result;
    const errors = [...result.errors];
    const meta = result.meta || {};
    const isPortraitOrSquare = meta.aspectRatio >= 0.55 && meta.aspectRatio <= 1.45;
    const faceAreaVisible = meta.centerBrightness >= 50 && meta.centerBrightness <= 225 && meta.centerContrast >= 12;
    if (!isPortraitOrSquare || !faceAreaVisible) {
      errors.push("Wajah belum terlihat jelas. Pastikan wajah berada di tengah foto.");
    }
    return { ...result, isValid: errors.length === 0, errors };
  }

  function validateBirthDate(dateValue) {
    const value = String(dateValue || "").trim();
    if (!value) return { isValid: false, error: "Field ini wajib diisi." };
    if (Number.isNaN(Date.parse(value))) return { isValid: false, error: "Tanggal lahir tidak valid." };
    if (value > MAX_BIRTH_DATE) {
      return { isValid: false, error: "Pengguna harus lahir pada tahun 2010 atau sebelumnya untuk menggunakan platform ini." };
    }
    return { isValid: true, error: "" };
  }

  function formatValidationError(result, fallback) {
    if (!result?.errors?.length) return fallback || "";
    return result.errors.join(" ");
  }

  function dataUrlToFile(dataUrl, filename = "selfie-camera.png") {
    const [header, base64] = dataUrl.split(",");
    const mime = header.match(/:(.*?);/)?.[1] || "image/png";
    const binary = atob(base64);
    const buffer = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) buffer[index] = binary.charCodeAt(index);
    return new File([buffer], filename, { type: mime });
  }

  window.bbEkycValidation = {
    validateImageFile,
    validateKtpImage,
    validateSelfieImage,
    validateBirthDate,
    formatValidationError,
    dataUrlToFile,
    maxBirthDate: MAX_BIRTH_DATE
  };
  // EKYC VALIDATION UTILITY END
})();
