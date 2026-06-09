# Rating & Review Backend Contract

Dokumen ini menjadi kontrak implementasi Spring Boot dan MySQL untuk fitur Rating & Review BarangBareng.

## MySQL Schema

```sql
CREATE TABLE reviews (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  transaction_id BIGINT NOT NULL,
  item_id BIGINT NOT NULL,
  owner_id BIGINT NOT NULL,
  reviewer_id BIGINT NOT NULL,
  item_rating DECIMAL(2,1) NOT NULL,
  owner_rating DECIMAL(2,1) NOT NULL,
  item_condition_rating TINYINT NOT NULL,
  item_description_match_rating TINYINT NOT NULL,
  item_overall_rating TINYINT NOT NULL,
  owner_responsiveness_rating TINYINT NOT NULL,
  owner_punctuality_rating TINYINT NOT NULL,
  owner_friendliness_rating TINYINT NOT NULL,
  title VARCHAR(100) NOT NULL,
  comment VARCHAR(500) NOT NULL,
  images JSON NULL,
  is_item_match_description BOOLEAN DEFAULT FALSE,
  will_rent_again BOOLEAN DEFAULT FALSE,
  like_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_review_transaction FOREIGN KEY (transaction_id) REFERENCES rental_orders(id),
  CONSTRAINT fk_review_item FOREIGN KEY (item_id) REFERENCES products(id),
  CONSTRAINT fk_review_owner FOREIGN KEY (owner_id) REFERENCES users(id),
  CONSTRAINT fk_review_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id),
  CONSTRAINT uq_review_transaction UNIQUE (transaction_id)
);

CREATE TABLE review_images (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  review_id BIGINT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_review_image_review FOREIGN KEY (review_id) REFERENCES reviews(id)
);

CREATE TABLE item_rating_summary (
  item_id BIGINT PRIMARY KEY,
  average_rating DECIMAL(2,1) DEFAULT 0.0,
  total_reviews INT DEFAULT 0,
  rating_5_count INT DEFAULT 0,
  rating_4_count INT DEFAULT 0,
  rating_3_count INT DEFAULT 0,
  rating_2_count INT DEFAULT 0,
  rating_1_count INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_item_rating_summary_item FOREIGN KEY (item_id) REFERENCES products(id)
);

CREATE TABLE owner_rating_summary (
  owner_id BIGINT PRIMARY KEY,
  average_rating DECIMAL(2,1) DEFAULT 0.0,
  total_reviews INT DEFAULT 0,
  completed_transactions INT DEFAULT 0,
  success_transaction_percentage DECIMAL(5,2) DEFAULT 0.00,
  response_rate DECIMAL(5,2) DEFAULT 0.00,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_owner_rating_summary_owner FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE review_likes (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  review_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_review_like_review FOREIGN KEY (review_id) REFERENCES reviews(id),
  CONSTRAINT fk_review_like_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT uq_review_like UNIQUE (review_id, user_id)
);

CREATE INDEX idx_reviews_item_created ON reviews(item_id, created_at);
CREATE INDEX idx_reviews_owner_created ON reviews(owner_id, created_at);
CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id);
```

## API Endpoints

- `POST /api/reviews`: membuat review, menghitung `item_rating` dan `owner_rating`, update summary dalam database transaction.
- `GET /api/items/{itemId}/reviews?sort=latest&rating=5&withPhoto=true&page=1&limit=10`: mengambil summary dan daftar review barang.
- `GET /api/owners/{ownerId}/reviews`: mengambil reputasi dan review pemilik.
- `GET /api/transactions/{transactionId}/review-eligibility`: mengecek apakah penyewa boleh memberi review.
- `POST /api/reviews/{reviewId}/like`: like review.
- `DELETE /api/reviews/{reviewId}/like`: unlike review.
- `POST /api/reviews/images`: upload foto review memakai multipart/form-data.

## Backend Validation

- User harus login dan merupakan penyewa pada transaksi tersebut.
- Transaksi harus berstatus `COMPLETED`.
- Transaksi tidak boleh `CANCELLED`, refund, atau komplain aktif.
- `transaction_id` hanya boleh memiliki satu review.
- Rating wajib integer dari 1 sampai 5.
- Judul wajib 5-100 karakter.
- Isi review wajib dan maksimal 500 karakter.
- Foto maksimal 5, format JPG/PNG/WebP, ukuran maksimal 2 MB per foto.
- Gunakan transaction saat menyimpan review, update summary barang, dan update summary pemilik.
