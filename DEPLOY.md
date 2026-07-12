# Quy trình deploy JobWeb lên Mắt Bão (Vibe Hosting)

Stack: Next.js 15 + Payload CMS 3 + PostgreSQL. Repo: `github.com/thphattt/JobWeb`.
Dịch vụ dùng: **Vibe Hosting** (PaaS của Mắt Bão, deploy từ GitHub) — https://www.matbao.net/hosting/vibe-hosting.html

---

## Bước 0 — Chuẩn bị code (làm trước khi mua gì)

1. Build thử production tại máy:
   ```bash
   npm run build
   ```
   Build phải pass 100%. Sửa hết lỗi trước khi deploy.
2. Kiểm tra `.env` KHÔNG bị commit lên git (chỉ commit `.env.example`).
3. Push code mới nhất lên GitHub:
   ```bash
   git push origin main
   ```
4. (Khuyến nghị) Khai báo Node version trong `package.json`:
   ```json
   "engines": { "node": ">=20" }
   ```

## Bước 1 — Mua dịch vụ tại matbao.net

1. Tạo tài khoản tại https://id.matbao.net
2. Mua **domain** (vd `tanchauthanh.com`): giỏ hàng → thanh toán → khai thông tin chủ thể (domain `.vn` cần CMND/CCCD hoặc giấy tờ doanh nghiệp của khách).
3. Mua **Vibe Hosting** gói Starter (~79.000đ/tháng, 1 website). Nếu site khách cần dư tài nguyên, chọn gói cao hơn.
4. Sau thanh toán, dịch vụ xuất hiện trong trang quản trị của Mắt Bão.

## Bước 2 — Tạo PostgreSQL database

1. Vào panel Vibe Hosting → mục **Database** → tạo database PostgreSQL mới.
2. Ghi lại connection string, dạng:
   ```
   postgresql://user:password@host:port/dbname
   ```
   Đây chính là giá trị `DATABASE_URI`.
3. Nếu panel không có PostgreSQL (chỉ MySQL) → liên hệ support Mắt Bão xác nhận,
   hoặc dùng Postgres ngoài: Neon (https://neon.tech, free) vẫn kết nối được bình thường.

## Bước 3 — Deploy từ GitHub

1. Panel → **Tạo dự án mới** → chọn nguồn **GitHub** → đăng nhập/authorize OAuth → chọn repo `thphattt/JobWeb`, nhánh `main`.
2. Cấu hình build (nếu panel hỏi):
   - Build command: `npm run build`
   - Start command: `npm run start`
   - Node: 20 trở lên
3. Khai báo **biến môi trường** (bắt buộc khai TRƯỚC khi build, vì `NEXT_PUBLIC_*` được nhúng lúc build):

   | Biến | Giá trị |
   |---|---|
   | `DATABASE_URI` | connection string từ Bước 2 |
   | `PAYLOAD_SECRET` | chuỗi ngẫu nhiên ≥32 ký tự (lệnh tạo ở dưới) |
   | `NEXT_PUBLIC_SITE_URL` | `https://tanchauthanh.com` |
   | `RESEND_API_KEY` | API key từ https://resend.com |
   | `CONTACT_TO_EMAIL` | `tanchauthanhhn@gmail.com` |
   | `CONTACT_FROM_EMAIL` | `Tân Châu Thành <lienhe@tanchauthanh.com>` (sau khi verify domain ở Resend) |

   Tạo `PAYLOAD_SECRET`:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
4. Bấm **Deploy** → chờ build (lần đầu 5–10 phút vì cài `sharp` và dependencies).
5. Build lỗi → đọc log trong panel (có AI hỗ trợ chẩn đoán lỗi build).

## Bước 4 — Trỏ domain + SSL

1. Panel Vibe Hosting sẽ cho **IP hoặc CNAME** của app.
2. Vào quản lý DNS domain tại Mắt Bão, thêm bản ghi:
   - `A` | `@` | → IP app (hoặc `CNAME` theo hướng dẫn panel)
   - `CNAME` | `www` | → domain chính
3. Chờ DNS phân giải (vài phút đến vài giờ, kiểm tra tại https://dnschecker.org).
4. SSL (Let's Encrypt) tự cấp sau khi DNS trỏ đúng. Kiểm tra `https://` hoạt động.

## Bước 5 — Thiết lập sau deploy

1. Truy cập `https://tanchauthanh.com/admin` → tạo tài khoản admin đầu tiên (Payload tự hiện form lần đầu).
2. Nạp dữ liệu mẫu nếu cần — script seed gọi qua REST API, chạy từ máy local:
   ```bash
   SEED_BASE=https://tanchauthanh.com/api SEED_EMAIL=<email admin> SEED_PASSWORD=<mật khẩu> node scripts/seed.mjs
   ```
   (Windows PowerShell: `$env:SEED_BASE="https://tanchauthanh.com/api"; ...` rồi `node scripts/seed.mjs`)
   (các script khác: `seed-hero-slides.mjs`, `seed-news.mjs`, `seed-projects.mjs`, `seed-p2.mjs`, `attach-images.mjs`)
3. Upload ảnh thật qua `/admin` → collection Media.
4. Test toàn bộ: trang chủ 2 ngôn ngữ (vi/en), trang dịch vụ/dự án/tin tức/tuyển dụng, form liên hệ.

---

## ⚠️ 2 vấn đề PHẢI xử lý

### 1. Ảnh upload sẽ MẤT khi redeploy

Payload đang lưu ảnh vào `public/uploads` (ổ đĩa local của container).
Trên PaaS, mỗi lần redeploy container được tạo lại → **ảnh admin đã upload sẽ mất**.

Chọn 1 trong 2:
- **Hỏi support Mắt Bão**: "Vibe Hosting có persistent storage/volume cho thư mục uploads không?" Nếu có → cấu hình mount vào `public/uploads`, xong.
- **Chuyển sang S3 storage** (chắc chắn nhất): dùng `@payloadcms/storage-s3` + Cloudflare R2 (free 10GB):
  ```bash
  npm install @payloadcms/storage-s3
  ```
  rồi thêm plugin vào `payload.config.ts`. Cần làm TRƯỚC khi khách bắt đầu upload ảnh thật.

### 2. Email form liên hệ (Resend)

- `CONTACT_FROM_EMAIL` hiện dùng `onboarding@resend.dev` — chỉ để test.
- Để gửi từ `@tanchauthanh.com`: vào dashboard Resend → **Domains** → add `tanchauthanh.com` → thêm các bản ghi DNS (SPF/DKIM) mà Resend yêu cầu vào DNS Mắt Bão → chờ verify → đổi `CONTACT_FROM_EMAIL`.

---

## Checklist bàn giao

- [ ] `npm run build` pass local
- [ ] Domain + Vibe Hosting đã mua, dịch vụ active
- [ ] PostgreSQL tạo xong, `DATABASE_URI` hoạt động
- [ ] Đủ 6 biến môi trường, deploy thành công
- [ ] DNS trỏ đúng, HTTPS hoạt động
- [ ] Tài khoản `/admin` tạo xong, đổi mật khẩu mạnh
- [ ] Giải quyết vấn đề lưu ảnh (persistent storage hoặc S3/R2)
- [ ] Resend verify domain, form liên hệ gửi mail thật thành công
- [ ] Test đầy đủ vi/en trên mobile + desktop
- [ ] Bàn giao tài khoản Mắt Bão/admin cho khách, hẹn lịch gia hạn domain+hosting

## Chi phí ước tính năm đầu

| Khoản | Chi phí |
|---|---|
| Domain `.com` | ~300.000đ/năm (`.vn` ~750.000đ) |
| Vibe Hosting Starter | ~948.000đ/năm (79k × 12) |
| Resend | Free (3.000 email/tháng) |
| Cloudflare R2 (nếu dùng) | Free (10GB) |
| **Tổng** | **~1,3–1,7 triệu đ/năm** |

Hỗ trợ Mắt Bão 24/7: hotline **1900 1830**, ticket trong trang quản trị.
