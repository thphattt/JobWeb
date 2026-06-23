# KẾ HOẠCH DỰ ÁN — Website Giới Thiệu Doanh Nghiệp

> Tham chiếu cấu trúc/DNA từ nguyenle.com.vn (đã trích trong [design.md](design.md)).
> **Chỉ mượn cấu trúc — không sao chép nội dung/ảnh/chữ của bản gốc.**

## Quyết định nền tảng
- **Tech:** Next.js 15 (App Router) + Tailwind CSS v4 (token OKLCH từ design.md)
- **CMS:** Payload CMS 3 (tích hợp trong Next.js) + Neon Postgres — khách tự cập nhật nội dung *(P1, cần DB credentials)*
- **Đa ngôn ngữ:** Tiếng Việt + Tiếng Anh (`next-intl`, routing `/vi` `/en`)
- **Triển khai:** MVP trước → mở rộng sau

## Stack chi tiết
| Lớp | Lựa chọn |
|---|---|
| Framework | Next.js 15 (App Router, RSC, TypeScript) |
| Styling | Tailwind CSS v4 + token design.md |
| CMS | Payload CMS 3 + Neon Postgres *(P1)* |
| i18n | next-intl (`/vi` `/en`) + trường localized Payload |
| Form | React Hook Form + Zod + Server Actions + Resend |
| Carousel | Embla Carousel (thay slick/flickity) |
| Icon | Lucide (thay Font Awesome) |
| Ảnh | next/image + Payload media + Vercel Blob/Cloudinary |
| Hosting | Vercel + GitHub Actions |
| Font | **Be Vietnam Pro** (free, đủ dấu VN) + Beau Rivage (script) — thay SVN-Gilroy thương mại |

## Phạm vi (MVP trước)
**Giai đoạn 1 (MVP):** Nav · Hero · Giới thiệu · Dịch vụ · Liên hệ · Footer — song ngữ, responsive, deploy.
**Giai đoạn 2:** Số liệu · Khách hàng/Cảm nhận · Tin tức · Tuyển dụng · Thư viện Media.

## Lộ trình
| Giai đoạn | Hạng mục | Thời lượng |
|---|---|---|
| **P0 — Nền tảng** | Khung Next.js + Tailwind token + i18n + Nav/Footer + deploy | ~1 tuần |
| **P1 — MVP** | Hero, About, Services, Contact + CMS 4 khối | ~2–3 tuần |
| **P2 — Mở rộng** | Stats, Clients, Tin tức, Tuyển dụng, Media | ~2–3 tuần |
| **P3 — Hoàn thiện** | SEO, hiệu năng, a11y, analytics, đào tạo CMS | ~1 tuần |

Tổng ~6–8 tuần; MVP live sau ~3–4 tuần.

## Cần khách cung cấp
Logo (vector), brand color/guideline (nếu có), ảnh dự án thật, nội dung dịch vụ, thông tin liên hệ/văn phòng, tài khoản: Vercel, Neon (DB), Resend (email), domain.

## Lưu ý
- Font Gilroy là thương mại → dùng Be Vietnam Pro (free, đủ dấu VN).
- Màu hiện theo bản gốc → tái tạo token khi có brand thật của khách.
- Payload cần DB (Neon) → tích hợp ở P1 khi có credentials.

---
*Trạng thái hiện tại: **P1 — MVP hoàn tất** (Hero/About/Services/Contact + CMS Payload 3 + Neon).
Nội dung chính (Hero, Giới thiệu, Vì sao chọn, Dịch vụ, Dự án, Liên hệ, Thương hiệu) đã
quản trị qua `/admin`, đọc trên site qua Local API với fallback messages. Tiếp theo: P2
(Tin tức/Tuyển dụng) và deploy Vercel.*
