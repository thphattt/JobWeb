-- ============================================================================
-- Áp dụng schema còn thiếu cho VPS (an toàn chạy nhiều lần — idempotent).
-- Gồm 2 migration: page_text (global "Chữ các trang & mục") + gallery_images (Thư viện).
-- KHÔNG dùng `payload migrate` trên VPS (sẽ đòi chạy lại migration gốc, trùng bảng đã có).
--
-- Cách chạy trên VPS:
--   cd /var/www/jobweb
--   DBURI=$(grep -E '^DATABASE_URI=' .env | cut -d= -f2- | tr -d "\"'")
--   psql "$DBURI" -f scripts/migrate-vps.sql
-- ============================================================================

-- ── 1) page_text (global "Chữ các trang & mục") ─────────────────────────────
CREATE TABLE IF NOT EXISTS "page_text" (
  "id" serial PRIMARY KEY NOT NULL,
  "updated_at" timestamp(3) with time zone,
  "created_at" timestamp(3) with time zone
);

CREATE TABLE IF NOT EXISTS "page_text_locales" (
  "projects_eyebrow" varchar, "projects_title" varchar,
  "projects_director_title" varchar, "projects_director_lead" varchar,
  "projects_producer_title" varchar, "projects_producer_lead" varchar,
  "about_eyebrow" varchar, "about_title" varchar, "about_lead" varchar,
  "services_eyebrow" varchar, "services_title" varchar, "services_lead" varchar,
  "news_eyebrow" varchar, "news_title" varchar, "news_lead" varchar,
  "careers_eyebrow" varchar, "careers_title" varchar, "careers_lead" varchar,
  "contact_eyebrow" varchar, "contact_title" varchar, "contact_lead" varchar,
  "id" serial PRIMARY KEY NOT NULL,
  "_locale" "_locales" NOT NULL,
  "_parent_id" integer NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "page_text_locales_locale_parent_id_unique"
  ON "page_text_locales" USING btree ("_locale","_parent_id");

-- ── 2) gallery_images (Thư viện) ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "gallery_images" (
  "id" serial PRIMARY KEY NOT NULL,
  "image_id" integer NOT NULL,
  "order" numeric DEFAULT 0,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "gallery_images_locales" (
  "caption" varchar,
  "id" serial PRIMARY KEY NOT NULL,
  "_locale" "_locales" NOT NULL,
  "_parent_id" integer NOT NULL
);

ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "gallery_images_id" integer;

CREATE INDEX IF NOT EXISTS "gallery_images_image_idx" ON "gallery_images" USING btree ("image_id");
CREATE INDEX IF NOT EXISTS "gallery_images_updated_at_idx" ON "gallery_images" USING btree ("updated_at");
CREATE INDEX IF NOT EXISTS "gallery_images_created_at_idx" ON "gallery_images" USING btree ("created_at");
CREATE UNIQUE INDEX IF NOT EXISTS "gallery_images_locales_locale_parent_id_unique"
  ON "gallery_images_locales" USING btree ("_locale","_parent_id");
CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_gallery_images_id_idx"
  ON "payload_locked_documents_rels" USING btree ("gallery_images_id");

-- ── 3) Khoá ngoại (bọc trong DO để không lỗi khi chạy lại) ──────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'page_text_locales_parent_id_fk') THEN
    ALTER TABLE "page_text_locales"
      ADD CONSTRAINT "page_text_locales_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."page_text"("id")
      ON DELETE cascade ON UPDATE no action;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'gallery_images_image_id_media_id_fk') THEN
    ALTER TABLE "gallery_images"
      ADD CONSTRAINT "gallery_images_image_id_media_id_fk"
      FOREIGN KEY ("image_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'gallery_images_locales_parent_id_fk') THEN
    ALTER TABLE "gallery_images_locales"
      ADD CONSTRAINT "gallery_images_locales_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."gallery_images"("id")
      ON DELETE cascade ON UPDATE no action;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_gallery_images_fk') THEN
    ALTER TABLE "payload_locked_documents_rels"
      ADD CONSTRAINT "payload_locked_documents_rels_gallery_images_fk"
      FOREIGN KEY ("gallery_images_id") REFERENCES "public"."gallery_images"("id")
      ON DELETE cascade ON UPDATE no action;
  END IF;
END $$;

-- ── Kiểm tra nhanh: liệt kê 4 bảng vừa đảm bảo tồn tại ───────────────────────
SELECT table_name FROM information_schema.tables
WHERE table_schema='public'
  AND table_name IN ('page_text','page_text_locales','gallery_images','gallery_images_locales')
ORDER BY table_name;
