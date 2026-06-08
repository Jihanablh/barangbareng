# Dokumentasi Sistem Checkout BarangBareng sampai GoPay Merchant QRIS

Dokumen ini menjelaskan rancangan proses bisnis dan teknis flow checkout produk BarangBareng dari pemilihan barang, pembayaran DP, persetujuan pemilik, pelunasan, sampai QR/barcode serah terima. Target implementasi:

- Frontend: React / Next.js
- Backend: Spring Boot
- Database: MySQL
- Payment Gateway: GoPay Merchant QRIS
- Pola pembayaran: DP terlebih dahulu, lalu pelunasan sebelum barang diserahkan

Dokumen ini tidak menggunakan istilah escrow. Istilah yang dipakai di UI dan backend adalah Pembayaran Aman, DP, pelunasan, dan serah terima.

## 1. Overview Flow Checkout BarangBareng

Flow utama:

1. Penyewa membuka detail produk.
2. Penyewa memilih tanggal mulai dan tanggal pengembalian.
3. Frontend menampilkan estimasi durasi, total biaya, DP, dan sisa pembayaran.
4. Penyewa klik checkout.
5. Backend memvalidasi produk, tanggal, user, dan menghitung ulang biaya.
6. Backend membuat order penyewaan.
7. Backend membuat invoice DP.
8. Backend meminta QRIS DP ke GoPay Merchant.
9. Penyewa membayar DP melalui QRIS.
10. Backend menerima webhook GoPay dan memvalidasi pembayaran.
11. Status order menjadi `DP_PAID`, lalu `WAITING_OWNER_APPROVAL`.
12. Pemilik menerima atau menolak pesanan.
13. Jika diterima, sistem membuat invoice pelunasan.
14. Penyewa membayar pelunasan melalui QRIS.
15. Backend menerima webhook pelunasan dan mengubah status menjadi `FULLY_PAID`.
16. Sistem membuat QR/barcode serah terima.
17. Pemilik menampilkan kode serah terima.
18. Penyewa scan kode menggunakan kamera.
19. Backend memvalidasi token.
20. Status menjadi `ITEM_RECEIVED`, lalu `RENTAL_ACTIVE`.
21. Setelah masa sewa selesai, barang dikembalikan dan transaksi ditutup.

Prinsip utama:

- Harga final dihitung di backend.
- API rahasia GoPay hanya dipanggil backend.
- Webhook harus idempotent.
- Token QR/barcode serah terima tidak boleh berisi data sensitif.
- QR/barcode hanya valid untuk order terkait dan hanya bisa dipakai sekali.

## 2. Aktor yang Terlibat

### Penyewa

Penyewa adalah user yang menyewa atau meminjam barang.

Aksi:

- Melihat produk.
- Memilih tanggal sewa.
- Checkout.
- Membayar DP.
- Menunggu persetujuan pemilik.
- Melunasi sisa pembayaran.
- Scan QR/barcode serah terima.
- Menggunakan barang.
- Mengembalikan barang.

### Pemilik Barang

Pemilik Barang adalah user yang menyewakan atau meminjamkan barang.

Aksi:

- Melihat request pesanan.
- Menerima atau menolak pesanan.
- Menyiapkan barang.
- Menampilkan QR/barcode serah terima.
- Mengonfirmasi barang dikembalikan.

### Sistem BarangBareng

Sistem terdiri dari frontend, backend, database, scheduler, dan webhook handler.

Tugas:

- Menampilkan detail produk dan ringkasan biaya.
- Memvalidasi produk, tanggal, dan user.
- Menghitung biaya di backend.
- Membuat order dan invoice.
- Request QRIS ke GoPay Merchant.
- Menerima webhook pembayaran.
- Mengubah status transaksi.
- Membuat dan memvalidasi QR/barcode serah terima.
- Mencatat log status.

### GoPay Merchant

GoPay Merchant adalah payment gateway untuk QRIS.

Tugas:

- Menerima request pembayaran dari backend.
- Menghasilkan QRIS.
- Memproses pembayaran user.
- Mengirim webhook status pembayaran ke backend BarangBareng.

## 3. Status Transaksi

| Status | Arti |
| --- | --- |
| `DRAFT` | Penyewa baru memilih barang dan tanggal. Order belum dibuat final. |
| `WAITING_DP_PAYMENT` | Order sudah dibuat dan menunggu invoice DP aktif. |
| `DP_PAYMENT_PENDING` | QRIS DP sudah dibuat dan menunggu pembayaran. |
| `DP_PAID` | DP berhasil dibayar dan invoice DP sudah `PAID`. |
| `WAITING_OWNER_APPROVAL` | Order menunggu pemilik menerima atau menolak pesanan. |
| `OWNER_ACCEPTED` | Pemilik menerima pesanan. |
| `OWNER_REJECTED` | Pemilik menolak pesanan. |
| `PREPARING_ITEM` | Pemilik sedang menyiapkan barang. |
| `WAITING_FULL_PAYMENT` | Penyewa wajib melunasi sisa pembayaran. |
| `FULL_PAYMENT_PENDING` | QRIS pelunasan sudah dibuat dan menunggu pembayaran. |
| `FULLY_PAID` | Pembayaran sudah lunas. |
| `READY_FOR_HANDOVER` | Barang siap diserahkan. |
| `WAITING_HANDOVER_SCAN` | Sistem menunggu penyewa scan QR/barcode serah terima. |
| `ITEM_RECEIVED` | Barang sudah diterima penyewa. |
| `RENTAL_ACTIVE` | Masa sewa sedang berjalan. |
| `WAITING_RETURN` | Menunggu barang dikembalikan. |
| `ITEM_RETURNED` | Barang sudah dikembalikan. |
| `COMPLETED` | Transaksi selesai. |
| `CANCELLED` | Order dibatalkan. |
| `EXPIRED` | Order atau invoice sudah kadaluarsa. |
| `PAYMENT_FAILED` | Pembayaran gagal atau tidak valid. |
| `REFUND_REQUESTED` | Refund sedang diajukan. |
| `REFUNDED` | Dana sudah dikembalikan sesuai ketentuan. |

## 4. Flow Checkout dari Pemilihan Barang sampai Pembayaran DP

### Step 1 - Penyewa memilih produk

Frontend menampilkan halaman detail produk.

Data yang ditampilkan:

- Nama produk.
- Harga sewa per hari.
- Status ketersediaan.
- Lokasi COD.
- Kampus terdekat.
- Rating dan jumlah penilaian.
- Kalender ketersediaan.
- Syarat pemilik.

Validasi backend saat checkout:

- Produk aktif.
- Produk tersedia.
- Produk bukan milik penyewa sendiri.
- Produk tidak sedang disewa pada tanggal yang dipilih.

### Step 2 - Penyewa memilih tanggal

Input:

- `startDate`
- `endDate`

Rumus:

```text
duration_days = end_date - start_date + 1
total_rental_price = price_per_day * duration_days
grand_total = total_rental_price + service_fee
dp_amount = grand_total * dp_percentage
remaining_amount = grand_total - dp_amount
```

Validasi:

- Tanggal mulai tidak boleh sebelum hari ini.
- Tanggal akhir tidak boleh sebelum tanggal mulai.
- Durasi harus sesuai `min_days` dan `max_days`.
- Tanggal tidak boleh bentrok dengan booking lain.
- Perhitungan harga final harus dilakukan backend.

### Step 3 - Penyewa klik checkout

Contoh request frontend ke backend:

```json
{
  "productId": 12,
  "startDate": "2026-06-20",
  "endDate": "2026-06-22",
  "paymentType": "DP",
  "dpPercentage": 50
}
```

Backend melakukan:

- Validasi user.
- Validasi produk.
- Validasi tanggal.
- Hitung ulang biaya.
- Buat order.
- Buat invoice DP.
- Simpan ke database.
- Request QRIS ke GoPay Merchant.

## 5. Flow Komunikasi Frontend, Backend, Database, dan GoPay Merchant

Urutan komunikasi:

1. Frontend mengirim `POST /api/orders/checkout`.
2. Backend membuka transaction database.
3. Backend lock produk atau availability untuk mencegah double booking.
4. Backend menghitung biaya final.
5. Backend menyimpan `rental_orders`.
6. Backend menyimpan `invoices` tipe `DP`.
7. Backend commit data awal.
8. Backend request QRIS ke GoPay Merchant.
9. GoPay mengembalikan QRIS.
10. Backend menyimpan `payments` dan update invoice/order menjadi pending.
11. Frontend menampilkan QRIS DP.
12. GoPay mengirim webhook saat pembayaran diproses.
13. Backend memvalidasi webhook dan update status.

## 6. Flow Pembuatan Order

Order dibuat setelah checkout valid.

Status awal order:

```text
WAITING_DP_PAYMENT
```

Data order:

- `order_id`
- `order_code`
- `renter_id`
- `owner_id`
- `product_id`
- `start_date`
- `end_date`
- `duration_days`
- `total_amount`
- `dp_percentage`
- `dp_amount`
- `remaining_amount`
- `status`
- `created_at`
- `expired_at`

Catatan:

- `expired_at` bisa digunakan untuk batas pembayaran DP.
- Setiap perubahan status harus masuk ke `order_status_logs`.

## 7. Flow Pembuatan Invoice DP

Invoice DP dibuat setelah order berhasil dibuat.

Status awal invoice:

```text
UNPAID
```

Data invoice:

- `invoice_id`
- `invoice_code`
- `order_id`
- `invoice_type = DP`
- `amount = dp_amount`
- `payment_method = GOPAY_QRIS`
- `payment_status = UNPAID`
- `expired_at`
- `created_at`

Setelah QRIS dibuat, status order dapat berubah menjadi:

```text
DP_PAYMENT_PENDING
```

## 8. Flow Generate QRIS GoPay Merchant

Backend mengirim request ke GoPay Merchant.

Data request:

- `merchant_id`
- `order_id`
- `invoice_id`
- `amount`
- `currency = IDR`
- `item_details`
- `customer_details`
- `callback_url`
- `expired_time`

Contoh request internal backend ke payment adapter:

```json
{
  "merchantId": "BB-GOPAY-001",
  "orderId": "ORD-20260620-0001",
  "invoiceId": "INV-DP-20260620-0001",
  "amount": 56250,
  "currency": "IDR",
  "customer": {
    "name": "Difa Surya",
    "email": "difa@kampus.ac.id",
    "phone": "081234567890"
  },
  "items": [
    {
      "name": "Kamera Canon EOS M50 - DP",
      "quantity": 1,
      "price": 56250
    }
  ],
  "callbackUrl": "https://api.barangbareng.id/api/payments/gopay/webhook",
  "expiredTime": "2026-06-20T14:15:00+07:00"
}
```

Contoh response:

```json
{
  "paymentId": "GPY-QRIS-123456",
  "gatewayReference": "GOPAY-20260620-ABC",
  "qrisUrl": "https://merchant.gopay.co.id/qris/abc",
  "qrString": "0002010102122667...",
  "expiredAt": "2026-06-20T14:15:00+07:00",
  "transactionStatus": "PENDING"
}
```

Backend menyimpan:

- `gateway_reference`
- `qris_url`
- `qr_string`
- `expired_at`
- `status = PENDING`

## 9. Flow Callback/Webhook DP Berhasil

Urutan:

1. Penyewa scan QRIS DP.
2. Penyewa membayar melalui e-wallet atau mobile banking.
3. GoPay memproses pembayaran.
4. GoPay mengirim webhook ke backend.
5. Backend menerima webhook.
6. Backend validasi signature.
7. Backend cek `invoice_id` dan `order_id`.
8. Backend cek nominal pembayaran.
9. Backend cek invoice belum pernah diproses.
10. Backend update invoice DP menjadi `PAID`.
11. Backend update payment menjadi `PAID`.
12. Backend update order menjadi `DP_PAID`.
13. Backend update order menjadi `WAITING_OWNER_APPROVAL`.
14. Sistem mengirim notifikasi ke pemilik.
15. Frontend menampilkan pesan:

```text
DP berhasil dibayar.
Pesanan kamu sedang menunggu konfirmasi pemilik barang.
```

Webhook harus idempotent. Jika webhook yang sama masuk dua kali, backend tidak boleh menambah pembayaran ganda.

## 10. Flow Persetujuan Pemilik Barang

Setelah DP dibayar:

1. Pemilik melihat request pesanan.
2. Pemilik menerima atau menolak.

Jika diterima:

- Status menjadi `OWNER_ACCEPTED`.
- Status berikutnya menjadi `PREPARING_ITEM`.
- Sistem menyiapkan invoice pelunasan.
- Penyewa mendapat notifikasi:

```text
Pesanan kamu diterima pemilik.
Silakan lakukan pelunasan sebelum proses serah terima barang.
```

Jika ditolak:

- Status menjadi `OWNER_REJECTED`.
- Sistem membuat proses refund sesuai aturan platform.
- Penyewa mendapat notifikasi:

```text
Pesanan kamu ditolak pemilik.
DP akan diproses sesuai ketentuan pengembalian dana.
```

## 11. Flow Pembuatan QR/Barcode Serah Terima

QR/barcode serah terima hanya dibuat setelah:

- DP sudah dibayar.
- Pemilik menerima pesanan.
- Order memenuhi aturan sistem.

Token:

- Berisi token unik, bukan data sensitif.
- Disimpan sebagai hash di database.
- Memiliki masa berlaku, misalnya 10 menit.
- Bisa di-refresh.
- Hanya dapat dipakai sekali.

Catatan penting: meskipun token dapat dibuat setelah `OWNER_ACCEPTED`, proses scan tetap harus menolak serah terima jika order belum `FULLY_PAID`.

## 12. Flow Pelunasan setelah DP Dibayar

Invoice pelunasan dibuat setelah:

- Invoice DP berstatus `PAID`.
- Order diterima pemilik.

Order berubah menjadi:

```text
WAITING_FULL_PAYMENT
```

Invoice:

- `invoice_type = FINAL_PAYMENT`
- `amount = remaining_amount`
- `payment_method = GOPAY_QRIS`
- `payment_status = UNPAID`

Frontend menampilkan:

- Total sewa.
- DP sudah dibayar.
- Sisa pembayaran.
- QRIS pelunasan.
- Countdown expired QRIS.

## 13. Flow Generate QRIS Pelunasan

Backend request QRIS pelunasan ke GoPay Merchant menggunakan invoice berbeda dari DP.

Contoh request:

```json
{
  "orderId": "ORD-20260620-0001",
  "invoiceId": "INV-FINAL-20260620-0001",
  "invoiceType": "FINAL_PAYMENT",
  "amount": 56250,
  "paymentMethod": "GOPAY_QRIS"
}
```

Backend menyimpan payment baru:

- `gateway_name = GOPAY`
- `gateway_reference`
- `qris_url`
- `qr_string`
- `status = PENDING`

Order berubah menjadi:

```text
FULL_PAYMENT_PENDING
```

## 14. Flow Callback/Webhook Pelunasan

Backend menerima webhook pelunasan dan melakukan:

- Validasi signature webhook.
- Validasi invoice type `FINAL_PAYMENT`.
- Validasi amount.
- Validasi currency.
- Validasi invoice belum dibayar.
- Validasi idempotency.
- Update invoice menjadi `PAID`.
- Update payment menjadi `PAID`.
- Update order menjadi `FULLY_PAID`.
- Update order menjadi `READY_FOR_HANDOVER`.
- Buat atau aktifkan QR/barcode serah terima.

Frontend menampilkan:

```text
Pembayaran sudah lunas.
Barang siap diserahkan kepada penyewa.
```

## 15. Flow Scan QR/Barcode Serah Terima Menggunakan Kamera Penyewa

Urutan:

1. Pemilik membuka halaman pesanan.
2. Pemilik menampilkan QR/barcode serah terima.
3. Penyewa membuka halaman pesanan.
4. Penyewa klik `Scan Kode Serah Terima`.
5. Browser meminta izin kamera.
6. Penyewa scan kode dari layar pemilik.
7. Frontend mengirim token ke backend.
8. Backend memvalidasi token.
9. Jika valid, status menjadi `ITEM_RECEIVED`.
10. Sistem mencatat `handover_at`.
11. Status menjadi `RENTAL_ACTIVE`.

Validasi:

- Token sesuai order.
- Token belum expired.
- Token belum digunakan.
- User yang scan adalah penyewa order tersebut.
- Order sudah `FULLY_PAID`.
- Order sudah `READY_FOR_HANDOVER`.

Pesan sukses:

```text
Barang berhasil diterima.
Masa sewa kamu sudah aktif.
```

Pesan gagal:

```text
Kode tidak valid atau sudah kadaluarsa.
Silakan minta pemilik menampilkan kode baru.
```

## 16. Flow Perubahan Status Transaksi

Flow DP berhasil:

```text
WAITING_DP_PAYMENT -> DP_PAYMENT_PENDING -> DP_PAID -> WAITING_OWNER_APPROVAL
```

Flow pemilik menerima:

```text
WAITING_OWNER_APPROVAL -> OWNER_ACCEPTED -> PREPARING_ITEM -> WAITING_FULL_PAYMENT
```

Flow pelunasan berhasil:

```text
WAITING_FULL_PAYMENT -> FULL_PAYMENT_PENDING -> FULLY_PAID -> READY_FOR_HANDOVER
```

Flow serah terima:

```text
READY_FOR_HANDOVER -> WAITING_HANDOVER_SCAN -> ITEM_RECEIVED -> RENTAL_ACTIVE
```

Flow selesai:

```text
RENTAL_ACTIVE -> WAITING_RETURN -> ITEM_RETURNED -> COMPLETED
```

## 17. Skenario Pembayaran Berhasil

DP berhasil:

- QRIS dibayar sesuai nominal.
- Webhook diterima.
- Signature valid.
- Invoice DP menjadi `PAID`.
- Order menjadi `DP_PAID`.
- Order menjadi `WAITING_OWNER_APPROVAL`.

Pelunasan berhasil:

- QRIS pelunasan dibayar sesuai nominal.
- Webhook diterima.
- Signature valid.
- Invoice pelunasan menjadi `PAID`.
- Order menjadi `FULLY_PAID`.
- Order menjadi `READY_FOR_HANDOVER`.

## 18. Skenario Pembayaran Gagal

Kondisi:

- Penyewa menutup halaman sebelum membayar.
- Pembayaran ditolak.
- Nominal tidak sesuai.
- Webhook invalid.
- Signature tidak valid.
- Invoice expired.
- Invoice sudah dibayar sebelumnya.
- Order dibatalkan.

Status:

```text
PAYMENT_FAILED
```

Pesan frontend:

```text
Pembayaran gagal. Silakan coba lagi atau buat QRIS baru.
```

## 19. Skenario QRIS Kadaluarsa

Jika QRIS DP expired:

- Invoice DP menjadi `EXPIRED`.
- Order bisa tetap `WAITING_DP_PAYMENT` atau menjadi `EXPIRED` sesuai aturan bisnis.
- Penyewa dapat generate QRIS baru jika barang masih tersedia.
- Backend harus cek ulang availability sebelum membuat QRIS baru.

Jika QRIS pelunasan expired:

- Invoice pelunasan menjadi `EXPIRED`.
- Order tetap `WAITING_FULL_PAYMENT`.
- Penyewa dapat generate QRIS pelunasan baru.
- Backend tetap memastikan order sudah diterima pemilik.

Pesan:

```text
QRIS sudah kadaluarsa. Silakan generate ulang kode pembayaran.
```

## 20. Skenario Pemilik Menolak Pesanan

Flow:

1. Order berada di `WAITING_OWNER_APPROVAL`.
2. Pemilik klik tolak.
3. Backend validasi pemilik benar.
4. Order menjadi `OWNER_REJECTED`.
5. Sistem memulai proses refund sesuai ketentuan.
6. Notifikasi dikirim ke penyewa.

Status refund:

```text
REFUND_REQUESTED -> REFUNDED
```

## 21. Skenario Penyewa Belum Melunasi Pembayaran

Jika penyewa belum melunasi:

- Order tidak boleh masuk `READY_FOR_HANDOVER`.
- Scan QR/barcode harus ditolak.
- Sistem menampilkan instruksi pelunasan.

Pesan:

```text
Sisa pembayaran belum lunas.
Silakan lakukan pelunasan sebelum proses serah terima barang.
```

## 22. Validasi Sistem pada Setiap Langkah

### Validasi Produk

- Produk aktif.
- Produk tersedia.
- Produk bukan milik penyewa sendiri.
- Produk tidak sedang dibooking di tanggal yang sama.

### Validasi Tanggal

- Tanggal mulai valid.
- Tanggal akhir valid.
- Durasi sesuai minimal dan maksimal sewa.
- Tidak bentrok dengan booking lain.

### Validasi Biaya

- Biaya dihitung ulang di backend.
- DP dihitung di backend.
- Sisa pembayaran dihitung di backend.
- Frontend hanya menampilkan estimasi dan hasil dari backend.

### Validasi Payment Gateway

- Request ke GoPay Merchant menggunakan server-side API.
- Secret key tidak pernah dikirim ke frontend.
- Simpan reference ID dari GoPay.
- Validasi signature webhook.
- Validasi amount.
- Validasi currency.
- Validasi invoice status.
- Cegah duplicate webhook dengan idempotency key.

### Validasi QR/Barcode

- Token unik.
- Token expired.
- Token hanya untuk order terkait.
- Token hanya bisa dipakai sekali.
- Penyewa yang scan harus sesuai order.
- Order harus lunas sebelum barang diserahkan.

## 23. Struktur Database MySQL yang Disarankan

### `users`

Menyimpan data user.

Kolom:

- `id`
- `name`
- `email`
- `phone`
- `role`
- `verification_status`
- `created_at`

### `products`

Menyimpan data barang.

Kolom:

- `id`
- `owner_id`
- `name`
- `category`
- `price_per_day`
- `status`
- `location`
- `campus`
- `description`
- `created_at`

### `product_availability`

Menyimpan kalender ketersediaan barang.

Kolom:

- `id`
- `product_id`
- `date`
- `status`

### `rental_orders`

Menyimpan order penyewaan.

Kolom:

- `id`
- `order_code`
- `renter_id`
- `owner_id`
- `product_id`
- `start_date`
- `end_date`
- `duration_days`
- `total_amount`
- `dp_percentage`
- `dp_amount`
- `remaining_amount`
- `status`
- `created_at`
- `expired_at`

### `invoices`

Menyimpan invoice DP dan pelunasan.

Kolom:

- `id`
- `invoice_code`
- `order_id`
- `invoice_type`
- `amount`
- `payment_method`
- `payment_status`
- `expired_at`
- `paid_at`
- `created_at`

### `payments`

Menyimpan detail request dan response payment gateway.

Kolom:

- `id`
- `invoice_id`
- `order_id`
- `gateway_name`
- `gateway_reference`
- `qris_url`
- `qr_string`
- `amount`
- `status`
- `webhook_payload`
- `created_at`
- `paid_at`

### `handover_tokens`

Menyimpan token QR/barcode serah terima.

Kolom:

- `id`
- `order_id`
- `token_hash`
- `expired_at`
- `used_at`
- `created_at`
- `status`

### `order_status_logs`

Audit trail perubahan status.

Kolom:

- `id`
- `order_id`
- `old_status`
- `new_status`
- `changed_by`
- `note`
- `created_at`

### `notifications`

Menyimpan notifikasi user.

Kolom:

- `id`
- `user_id`
- `order_id`
- `title`
- `message`
- `is_read`
- `created_at`

## 24. Endpoint API yang Disarankan

### Checkout

| Endpoint | Fungsi |
| --- | --- |
| `POST /api/orders/checkout` | Membuat order, invoice DP, dan QRIS DP. |
| `GET /api/orders/{orderId}` | Mengambil detail order. |
| `GET /api/orders/{orderId}/summary` | Mengambil ringkasan biaya dan status order. |

### Invoice dan Payment

| Endpoint | Fungsi |
| --- | --- |
| `POST /api/orders/{orderId}/dp-invoice` | Generate ulang invoice DP jika valid. |
| `POST /api/orders/{orderId}/final-invoice` | Membuat invoice pelunasan. |
| `GET /api/invoices/{invoiceId}` | Mengambil status invoice dan QRIS. |
| `POST /api/payments/gopay/qris` | Internal endpoint atau service call untuk membuat QRIS. |
| `POST /api/payments/gopay/webhook` | Menerima webhook pembayaran GoPay. |

### Owner Approval

| Endpoint | Fungsi |
| --- | --- |
| `POST /api/orders/{orderId}/accept` | Pemilik menerima pesanan. |
| `POST /api/orders/{orderId}/reject` | Pemilik menolak pesanan. |

### Handover QR/Barcode

| Endpoint | Fungsi |
| --- | --- |
| `POST /api/orders/{orderId}/handover-token` | Membuat atau refresh token serah terima. |
| `GET /api/orders/{orderId}/handover-token` | Mengambil token/QR aktif untuk pemilik. |
| `POST /api/orders/{orderId}/handover-scan` | Memvalidasi token hasil scan penyewa. |

### Frontend Routes

| Route | Fungsi |
| --- | --- |
| `GET /checkout/:productId` | Halaman checkout produk. |
| `GET /orders/:orderId/payment-dp` | Halaman pembayaran DP. |
| `GET /orders/:orderId/payment-final` | Halaman pelunasan. |
| `GET /orders/:orderId/handover` | Halaman QR/barcode serah terima. |
| `GET /orders/:orderId/scan` | Halaman scan kamera penyewa. |

## 25. Best Practice Implementasi

### React / Next.js

- Gunakan halaman checkout tersendiri.
- Gunakan state management untuk cart dan order summary.
- Jangan menjadikan perhitungan frontend sebagai sumber kebenaran.
- Gunakan loading state saat membuat order dan QRIS.
- Gunakan polling ringan atau websocket untuk status pembayaran.
- Gunakan camera permission API untuk scan QR/barcode.
- Tampilkan fallback jika kamera tidak diizinkan.
- Gunakan responsive UI untuk mobile.
- Tampilkan countdown expired QRIS.

### Spring Boot

- Gunakan service layer untuk order, invoice, payment, dan handover.
- Gunakan transaction management saat checkout.
- Gunakan enum untuk status order, invoice, payment, dan handover token.
- Gunakan idempotency untuk webhook.
- Simpan log setiap perubahan status.
- Jangan menyimpan secret key di frontend.
- Validasi semua request frontend.
- Gunakan optimistic atau pessimistic locking untuk mencegah double booking.
- Pisahkan `PaymentGatewayClient` dari business service agar mudah diganti.

### MySQL

- Gunakan foreign key antar tabel.
- Buat index pada `order_id`, `product_id`, `invoice_code`, dan `gateway_reference`.
- Gunakan transaction untuk checkout.
- Simpan audit trail status.
- Hindari update status tanpa log.
- Simpan webhook payload untuk audit dan debugging.

### GoPay Merchant

- Semua request dibuat dari backend.
- Validasi signature webhook.
- Jangan percaya status pembayaran dari frontend.
- Gunakan expired time untuk QRIS.
- Simpan gateway reference ID.
- Buat invoice berbeda untuk DP dan pelunasan.
- Pastikan amount sesuai invoice.

## 26. Catatan Keamanan dan Idempotency

Keamanan:

- Secret GoPay disimpan di environment variable backend.
- Webhook harus memakai signature verification.
- QR/barcode token disimpan dalam bentuk hash.
- Token serah terima tidak berisi user ID, order ID mentah, nomor HP, atau nominal pembayaran.
- Endpoint scan hanya boleh dipakai penyewa order terkait.
- Pemilik hanya boleh menerima/menolak order miliknya.

Idempotency:

- Webhook GoPay bisa masuk lebih dari sekali.
- Backend harus menyimpan `gateway_reference` dan `webhook_event_id`.
- Jika invoice sudah `PAID`, webhook berikutnya cukup dibalas sukses tanpa update ulang.
- Perubahan status harus dicek dari status saat ini.
- Request checkout berulang dari user harus dicegah dengan idempotency key dari frontend.

Risiko dan penanganan:

- Double booking: gunakan locking dan cek availability dalam transaction.
- QRIS expired: buat endpoint regenerate dengan validasi ulang.
- Webhook terlambat: frontend polling status invoice.
- Kamera ditolak: tampilkan input kode manual sebagai fallback jika bisnis mengizinkan.
- Token serah terima bocor: token pendek masa berlaku dan sekali pakai.

## 27. Kesimpulan Flow Akhir

Flow akhir yang direkomendasikan:

```text
Pilih Produk
-> Pilih Tanggal
-> Checkout
-> Order Dibuat
-> Invoice DP Dibuat
-> QRIS DP GoPay Dibuat
-> DP Dibayar
-> Webhook DP Valid
-> Menunggu Persetujuan Pemilik
-> Pemilik Menerima
-> Invoice Pelunasan Dibuat
-> QRIS Pelunasan GoPay Dibuat
-> Pelunasan Dibayar
-> Webhook Pelunasan Valid
-> QR/Barcode Serah Terima Dibuat
-> Penyewa Scan Kode
-> Barang Diterima
-> Rental Aktif
-> Barang Dikembalikan
-> Transaksi Selesai
```

Dengan flow ini, BarangBareng memiliki checkout yang jelas untuk penyewa, kontrol persetujuan untuk pemilik barang, integrasi pembayaran yang aman melalui GoPay Merchant QRIS, serta validasi serah terima barang yang tercatat di sistem.
