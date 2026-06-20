# JobWeb — Website giới thiệu doanh nghiệp

Next.js 15 (App Router) + Tailwind CSS v4 + next-intl (song ngữ VN/EN).
Hệ thống thiết kế theo [design.md](design.md); kế hoạch dự án trong [PLAN.md](PLAN.md).

## Yêu cầu
- Node.js ≥ 18.18 (đang dùng v22)

## Lệnh
```bash
npm install      # cài dependencies
npm run dev      # chạy môi trường dev (http://localhost:3000)
npm run build    # build production
npm run start    # chạy bản build production
```

Mở http://localhost:3000 → tự chuyển sang `/vi`. Đổi ngôn ngữ qua nút **VI / EN** trên thanh nav.

## Cấu trúc
```
messages/                vi.json · en.json   (chuỗi giao diện song ngữ)
src/
  app/[locale]/          layout · page · not-found · [...rest] (catch-all 404)
  components/            Navbar · Footer · LanguageSwitcher
  i18n/                  routing · request · navigation
  middleware.ts          định tuyến ngôn ngữ /vi /en
  styles/globals.css     token thiết kế (Tailwind v4 @theme, từ design.md)
```

## Đa ngôn ngữ (i18n)
- Route tách theo ngôn ngữ: `/vi/...`, `/en/...` (mặc định `vi`).
- Thêm/sửa nội dung tĩnh: cập nhật `messages/vi.json` và `messages/en.json`.
- Thêm ngôn ngữ mới: thêm mã vào `src/i18n/routing.ts` và tạo file `messages/<mã>.json`.

## Trạng thái — P0 (Nền tảng) ✅
Đã có: khung Next.js + Tailwind token, i18n VN/EN, Navbar (hotline + đổi ngôn ngữ),
Footer (3 văn phòng + social), trang chủ Hero · Giới thiệu · Dịch vụ · CTA Liên hệ.

> ⚠️ Nội dung, tên "Công ty ABC", địa chỉ, hotline đều là **placeholder** — thay bằng
> dữ liệu thật của khách. Màu/font đang theo DNA bản gốc, sẽ tái tạo theo brand thật.

## Bước tiếp theo — P1 (MVP)
- Tích hợp **Payload CMS 3 + Neon Postgres** để khách tự cập nhật nội dung *(cần credentials DB)*.
- Trang riêng: `/gioi-thieu`, `/dich-vu`, `/lien-he` (form + Resend gửi email).
- Thay font sang **Be Vietnam Pro** đã cấu hình; nạp logo + brand color thật.

## Deploy (Vercel)
1. Push repo lên GitHub.
2. Import vào [Vercel](https://vercel.com) → tự nhận Next.js, không cần cấu hình thêm.
3. Thêm domain + biến môi trường (khi tích hợp CMS/email ở P1).
