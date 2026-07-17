# Tân Châu Thành — Website doanh nghiệp

Website giới thiệu Công ty TNHH Tân Châu Thành — tổ chức sự kiện & truyền thông tại Hà Nội. Song ngữ Việt/Anh, nội dung quản trị hoàn toàn qua CMS, triển khai trên VPS đặt tại Việt Nam.

**Production:** [truyenthongtanchauthanh.vn](https://truyenthongtanchauthanh.vn) · **Repo:** [github.com/thphattt/JobWeb](https://github.com/thphattt/JobWeb)

## Công nghệ

| Lớp | Công nghệ |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router, RSC, TypeScript) |
| CMS | [Payload CMS 3](https://payloadcms.com) — nhúng trong Next.js, quản trị tại `/admin` |
| Database | PostgreSQL (chạy cùng VPS) |
| Styling | Tailwind CSS v4 (design token OKLCH trong `globals.css`) |
| Đa ngôn ngữ | [next-intl](https://next-intl.dev) (`/vi` `/en`) + localized fields của Payload |
| Email | [Resend](https://resend.com) — form liên hệ + email hệ thống Payload |
| Ảnh | next/image + sharp; upload lưu tại `public/uploads` |
| Hosting | VPS Vietnix (VN) · Nginx · PM2 · Let's Encrypt |

## Bắt đầu

Yêu cầu **Node.js ≥ 20** và một database PostgreSQL.

```bash
git clone https://github.com/thphattt/JobWeb.git
cd JobWeb
npm install
cp .env.example .env    # điền DATABASE_URI, PAYLOAD_SECRET (bắt buộc)
npm run dev             # http://localhost:3000
```

Truy cập lần đầu:

- `http://localhost:3000` → tự chuyển sang `/vi`; đổi ngôn ngữ bằng nút **VI / EN** trên navbar.
- `http://localhost:3000/admin` → tạo tài khoản admin đầu tiên, sau đó quản trị toàn bộ nội dung.

### Biến môi trường

Xem chú thích chi tiết trong [`.env.example`](.env.example).

| Biến | Bắt buộc | Mô tả |
|---|---|---|
| `DATABASE_URI` | ✅ | Connection string PostgreSQL |
| `PAYLOAD_SECRET` | ✅ | Chuỗi ngẫu nhiên ≥ 32 ký tự (lệnh tạo có trong `.env.example`) |
| `RESEND_API_KEY` | — | Thiếu key: form vẫn chạy (validate + log), email chỉ log console |
| `CONTACT_TO_EMAIL` | — | Địa chỉ nhận email từ form liên hệ |
| `CONTACT_FROM_EMAIL` | — | Người gửi form liên hệ (kèm tên hiển thị) |
| `NEXT_PUBLIC_SITE_URL` | — | Domain thật khi deploy (canonical/OG/sitemap); local để trống |

### Lệnh

```bash
npm run dev      # dev server (schema DB tự đồng bộ — push: true)
npm run build    # build production
npm run start    # chạy bản build

npx payload migrate:create <ten>   # tạo migration khi đổi schema
npx payload migrate                # chạy migrations (production)
node scripts/seed.mjs              # seed nội dung mẫu (cần SEED_EMAIL/SEED_PASSWORD)
```

> **Dev vs production:** dev dùng `push: true` (tự sửa schema DB cho nhanh); production **bắt buộc chạy migrations** (`src/migrations/`) — Payload không tự tạo bảng khi `NODE_ENV=production`.

## Cấu trúc dự án

```
messages/                  vi.json · en.json — chuỗi giao diện + fallback nội dung
public/uploads/            ảnh upload từ CMS
scripts/                   seed-*.mjs — nạp dữ liệu mẫu qua REST API
src/
  app/
    (payload)/             /admin + /api của Payload CMS
    [locale]/              trang public theo ngôn ngữ:
      page.tsx               trang chủ (Hero · Stats · About · Why · Services…)
      gioi-thieu/            giới thiệu
      dich-vu/               dịch vụ
      tin-tuc/[slug]/        tin tức + chi tiết bài viết
      tuyen-dung/[slug]/     tuyển dụng + chi tiết tin
      lien-he/               liên hệ (Server Action + Zod + rate limit + Resend)
    robots.ts · sitemap.ts SEO (đọc siteUrl từ src/lib/site.ts)
  components/              Navbar · MobileNav · Footer · LanguageSwitcher · Reveal
  features/                mỗi khối nội dung 1 module: api.ts (đọc Payload Local API,
                           fallback messages) + types.ts + components/
  i18n/                    routing · request · navigation (next-intl)
  payload/
    collections/           News · Projects · Services · Jobs · Collaborators ·
                           Testimonials · Clients · Media · Users
    globals/               Hero · Stats · About · Why · Brand · ContactInfo
  migrations/              database migrations (dùng ở production)
  middleware.ts            định tuyến ngôn ngữ /vi /en
  styles/globals.css       design token (Tailwind v4 @theme)
payload.config.ts          cấu hình CMS: collections, globals, i18n, email, DB
```

**Luồng dữ liệu:** trang public đọc nội dung từ Payload qua **Local API** (không qua HTTP) trong `src/features/*/api.ts`; nếu CMS chưa có dữ liệu thì fallback về `messages/*.json` — site không bao giờ trắng trang.

## Quản trị nội dung

Toàn bộ nội dung sửa tại `/admin` (giao diện tiếng Việt):

- **Nội dung hằng ngày:** Tin tức, Dự án, Dịch vụ, Tuyển dụng, Cộng tác viên, Cảm nhận khách hàng, Khách hàng.
- **Trang chủ:** Hero (carousel), Số liệu, Giới thiệu, Vì sao chọn.
- **Thông tin công ty:** Thương hiệu (logo, màu), Thông tin liên hệ.

Mỗi trường bật localization có 2 bản **vi / en** — chuyển bằng nút ngôn ngữ trong admin. Thiếu bản dịch `en` sẽ fallback về `vi`.

## Đa ngôn ngữ

- Route tách theo ngôn ngữ `/vi/...` · `/en/...`, mặc định `vi` (cấu hình tại `src/i18n/routing.ts`).
- Chuỗi giao diện tĩnh: `messages/vi.json` + `messages/en.json`.
- Nội dung động: localized fields trong Payload.
- Thêm ngôn ngữ mới: thêm mã vào `src/i18n/routing.ts`, tạo `messages/<mã>.json`, thêm locale trong `payload.config.ts`.

## Bảo mật

Đã cấu hình sẵn trong `next.config.ts` và code:

- Security headers toàn site: HSTS, `X-Frame-Options`, `frame-ancestors`, `Referrer-Policy`, `Permissions-Policy`, `X-Content-Type-Options`; ẩn header `X-Powered-By`.
- GraphQL Playground + introspection tắt ở production.
- Form liên hệ: validate Zod phía server + rate limiting.

## Triển khai

Chạy trên **1 VPS Vietnix tại Việt Nam** (yêu cầu khách hàng: web, database, ảnh upload đều trong nước):

```
Người dùng → DNS (Vietnix) → Nginx (SSL Let's Encrypt)
                               ├── /uploads/*  → file tĩnh trực tiếp
                               └── còn lại     → Next.js + Payload (PM2, :3000)
                                                    └── PostgreSQL (localhost)
```

Hướng dẫn từng bước:

- [`DEPLOY-VPS.md`](DEPLOY-VPS.md) — dựng server, bảo mật, Nginx, SSL, PM2, backup.
- [`DOMAIN.md`](DOMAIN.md) — đăng ký tên miền `.vn` tại Vietnix đứng tên khách (kèm bản khai chủ thể).

## Tài liệu khác

- [`PLAN.md`](PLAN.md) — kế hoạch dự án, phạm vi từng giai đoạn (P0 → P3).
- [`design.md`](design.md) — hệ thống thiết kế: token màu, font, spacing.

## Trạng thái

**P2 hoàn tất** — trang chủ đầy đủ (Hero, Stats, About, Why, Services, Projects, Testimonials, Clients), Tin tức, Tuyển dụng, form liên hệ, CMS quản trị toàn bộ nội dung, SEO (sitemap, robots, hreflang, canonical). Đang ở **giai đoạn triển khai production** theo `DEPLOY-VPS.md`.

---

*Dự án riêng (private) — phát triển cho Công ty TNHH Tân Châu Thành.*
