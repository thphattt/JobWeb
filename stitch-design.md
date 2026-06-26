# Tân Châu Thành — Design Spec for Google Stitch

Mô tả thiết kế **hiện tại** (tối + cam, công nghiệp — kiểu Colorbond) của website
Công ty TNHH Tân Châu Thành để tái tạo trên **Google Stitch** (stitch.withgoogle.com).

> **Cách dùng:** Stitch sinh **một màn hình mỗi prompt**. Dán **§1 Global style**
> trước (hoặc đính kèm đầu mỗi prompt), rồi dùng từng prompt ở **§4 Screens**.
> Văn bản giao diện để tiếng Việt như bên dưới. HEX là **xấp xỉ** từ token OKLCH
> (ghi kèm để chính xác). Khớp `src/styles/globals.css`.

---

## 1. Global style (dán phần này trước)

A **dark, industrial** website for an event-organization & communications company.
Near-black warm background, **UPPERCASE** bold headings, lots of negative space,
**sharp square corners** (no rounded), and a signature **orange→pink→purple brand
gradient**. A recurring **solid gradient square next to every section title**.
Confident and high-contrast (think a premium steel/industrial brand). Vietnamese UI.

**Color palette**

| Role | HEX (approx) | OKLCH (source of truth) | Use |
|------|--------------|--------------------------|-----|
| Night (page bg) | `#181613` | `oklch(16% 0.006 60)` | default dark background |
| Night-2 (surface) | `#221F1B` | `oklch(21% 0.006 60)` | cards / panels |
| Night rule | `#38332E` | `oklch(32% 0.006 60)` | hairline borders on dark |
| White text | `#FFFFFF` | — | headings/body on dark |
| Muted white | `rgba(255,255,255,.6)` | — | secondary text |
| **Accent (orange)** | `#E27D33` | `oklch(66% 0.18 48)` | eyebrows, icons, links, outlines, pagination |
| Paper (light band) | `#F7F1EC` | `oklch(96.3% 0.006 50)` | the single light "Giới thiệu" section |
| Ink (text on light) | `#2C2926` | `oklch(28% 0.005 60)` | text in the light band |

**Brand gradient** (linear 120°): orange `#E27D33` → pink `#D6335A` → purple
`#7A3B93`. Used on: section squares, primary buttons, icon boxes, the hero
carousel panel, event tiles, card bottom-bars, and the footer copyright strip.

**Typography**
- Single family **Be Vietnam Pro** (full Vietnamese). Headings **800 UPPERCASE**,
  tight tracking, large. Body 400–500. Labels/eyebrows 600 uppercase, letter-spacing.
- Eyebrow = small uppercase kicker with a leading dash: `— LABEL`.

**Shape & motion**
- **Square corners everywhere** (radius 0): cards, panels, inputs, image tiles, buttons.
- Buttons are **rectangular**: primary = gradient fill + white uppercase text;
  secondary = outline (white/orange border).
- Sections **fade up on scroll**; the hero panel is a **carousel** (auto, pagination
  01–0n, square arrows). News uses a **swipeable carousel**.
- Event tiles on hover: **scale up + background blur + reveal details** (venue).

> **Nhịp tối/sáng**: hầu hết tối; **duy nhất** dải "Giới thiệu" dùng nền sáng
> (`#F7F1EC`) làm điểm tương phản. (Trước đây dải sáng là "Dịch vụ" — đã đổi.)

---

## 2. Components

- **Navbar** (sticky, near-black, translucent + blur): left = logo (gradient mark +
  "TÂN CHÂU THÀNH"); center = **UPPERCASE** links *Giới thiệu · Dịch vụ · Tin tức ·
  Liên hệ*; right = phone pill `091.353.2566`, `VI / EN` switch, (mobile: hamburger
  → right drawer).
- **Section header**: a **solid gradient square** (≈120px) next to a small orange
  eyebrow + a big **UPPERCASE** title. Sub-section header dùng ô vuông gradient nhỏ (≈20px).
- **Primary button**: gradient fill, white uppercase text, square, arrow icon.
- **Secondary / "XEM THÊM"**: transparent, 2px orange (or white) border, square, uppercase.
- **Card**: `#221F1B` surface, 1px dark border, square, often a **gradient bottom bar**.
- **Event tile** (square, 4:3): brand-gradient bg + big faint year watermark + white
  year badge top-left + event name bottom; hover phóng to + làm mờ nền + hiện địa điểm.
- **Collaborator tile** (portrait 3:4): ảnh chân dung (hoặc gradient + chữ cái đầu),
  tên trắng + vai trò cam ở đáy.
- **News card** (square): ảnh bìa 16:9 + ngày (cam) + tiêu đề + tóm tắt + "ĐỌC TIẾP →";
  mọi card **cao bằng nhau**.
- **Footer**: near-black columns; bottom **copyright strip uses the brand gradient**.

---

## 3. Pages

1. **Trang chủ** — Hero (logo + carousel) · Dự án tiêu biểu (2 mục: Đạo diễn /
   Nhà sản xuất) · Giới thiệu (**nền sáng**) · Gương mặt hợp tác tiêu biểu ·
   Tin tức (carousel) · CTA.
2. **Giới thiệu** — intro · đội ngũ lãnh đạo · chương trình tiêu biểu (gallery) ·
   cộng tác viên + lưới gương mặt hợp tác.
3. **Dịch vụ** — 4 thẻ dịch vụ (trang riêng; đã bỏ khỏi trang chủ).
4. **Tin tức** — danh sách bài (carousel) · trang chi tiết bài.
5. **Liên hệ** — thông tin · form (nền tối) · 2 bản đồ.

> Lưu ý: hai mục **"Dịch vụ"** và **"Vì sao chọn chúng tôi"** đã **bỏ khỏi trang chủ**
> (Dịch vụ vẫn còn ở trang riêng `/dich-vu`).

---

## 4. Screen prompts (paste one at a time)

### 4.1 — Home (desktop)

> Design a **dark, industrial** desktop homepage for an event & communications
> company. Near-black warm background `#181613`, white **UPPERCASE** headings, font
> **Be Vietnam Pro**, accent **orange `#E27D33`**, **sharp square corners**, max width 1280px.
>
> **Sticky near-black navbar**: logo left; centered UPPERCASE links "GIỚI THIỆU",
> "DỊCH VỤ", "TIN TỨC", "LIÊN HỆ"; right a pill "📞 091.353.2566" and "VI / EN".
>
> **Hero** (two columns), top content aligned just under the navbar: LEFT — a large
> **company logo** (gradient mark + "TÂN CHÂU THÀNH") centered in the column, then a
> small orange eyebrow "— TỔ CHỨC SỰ KIỆN · TRUYỀN THÔNG", a huge UPPERCASE heading
> "KIẾN TẠO NHỮNG CHƯƠNG TRÌNH SỰ KIỆN TẦM VÓC", a muted paragraph, and (with extra
> gap) two square buttons: gradient "LIÊN HỆ NGAY →" and white-outline "XEM DỊCH VỤ".
> RIGHT — a tall **carousel** panel (portrait, orange→pink→purple gradient) showing a
> giant number "2018" and "NĂM THÀNH LẬP"; below it a row with numbered pagination
> "01 02 03 04" (01 active in orange with an underline) and two square arrow buttons
> (left outline, right gradient-filled).
>
> **Dự án tiêu biểu** (dark): a **solid gradient square** + UPPERCASE title "DỰ ÁN
> TIÊU BIỂU". Then **two sub-sections**, each = a small gradient square + UPPERCASE
> sub-title + one short line + a **row of 4 square event tiles**:
> • "VAI TRÒ ĐẠO DIỄN" — "BẾ MẠC SEA GAMES 22" (2003), "ĐẠI LỄ 1000 NĂM THĂNG LONG –
> HÀ NỘI" (2010), "TÔI YÊU TỔ QUỐC TÔI" (2015), "TÔI YÊU TỔ QUỐC TÔI TẠI ĐỀN HÙNG" (2019).
> • "VAI TRÒ NHÀ SẢN XUẤT" — "10 NĂM MỞ RỘNG ĐỊA GIỚI THỦ ĐÔ" (2018), "CHÀO MỪNG ĐẠI
> HỘI ĐẢNG BỘ CÁC CẤP", + 2 ô khác. Each tile: brand-gradient bg, faint big year
> watermark, white year badge top-left, event name bottom; on hover it **scales up,
> the background blurs, and the venue text fades in**.
>
> **Giới thiệu band** (a **light** `#F7F1EC` section for contrast): a solid gradient
> square next to a small eyebrow "— VỀ CHÚNG TÔI" and a dark UPPERCASE heading; on the
> right a dark paragraph and an orange link "TÌM HIỂU THÊM ↗".
>
> **Gương mặt hợp tác tiêu biểu** (slightly lighter dark `#221F1B`): gradient square +
> UPPERCASE title "GƯƠNG MẶT HỢP TÁC TIÊU BIỂU" + a short line; a **5-column grid of
> portrait tiles** (3:4) — each a photo (or gradient + big initial), with a white name
> and an orange uppercase role at the bottom (NSND/NSƯT/Ca sĩ/MC), e.g. "NSND QUANG THỌ",
> "TRỌNG TẤN", "MC HOÀI ANH".
>
> **Tin tức** (dark): gradient square + UPPERCASE title "TIN TỨC & HOẠT ĐỘNG", with an
> orange "XEM TẤT CẢ TIN ↗" link top-right; a **row of 3 news cards** (square, equal
> height): 16:9 cover image, an orange date, a 2-line title, a 3-line excerpt, and an
> orange "ĐỌC TIẾP →" pinned at the bottom.
>
> **CTA**: a full-width **brand-gradient** panel, centered: UPPERCASE heading "BẮT
> ĐẦU SỰ KIỆN CỦA BẠN", a subtitle, and a square near-black button "GỬI YÊU CẦU →".
>
> **Footer** (near-black, multi-column): logo + tagline + a Facebook icon; columns
> "VĂN PHÒNG" (two Hanoi addresses with map-pin icons) and "LIÊN HỆ" (phones
> 0243.822.9251 / 091.353.2566 / 091.949.6886, email tanchauthanhhn@gmail.com). A
> **gradient bottom strip** with "© 2026 Công ty TNHH Tân Châu Thành".

### 4.2 — Home (mobile)

> Same homepage at 390px. Navbar = logo + hamburger. Tapping opens a **right-side
> dark drawer** over a dimmed blurred backdrop: brand name + close ✕, vertical
> UPPERCASE links (Giới thiệu · Dịch vụ · Tin tức · Liên hệ), and a gradient phone
> pill at the bottom. Columns stack to one; hero carousel, event tiles, collaborator
> grid and news cards are single-column (news cards swipeable).

### 4.3 — About / Giới thiệu (dark)

> Dark sub-page (`#181613`, white text), max width ~1024px. Orange eyebrow "— VỀ
> CHÚNG TÔI", big UPPERCASE heading "CÔNG TY TNHH TÂN CHÂU THÀNH", an intro paragraph.
> Section "ĐỘI NGŨ LÃNH ĐẠO" (small gradient square + UPPERCASE title): a 2-column
> grid of 4 dark cards, each an orange UPPERCASE role + a bold white name —
> "GIÁM ĐỐC · Bà Ngô Thị Ninh", "PHÓ GIÁM ĐỐC · Bà Nguyễn Thị Hạnh Nguyên",
> "KẾ TOÁN TRƯỞNG · Ông Nguyễn Anh Tuấn", "CỐ VẤN NGHỆ THUẬT · Ths. Lại Hồng Đăng".
> Section "CHƯƠNG TRÌNH TIÊU BIỂU": a 3–4 column grid of gradient event tiles. Section
> "CỘNG TÁC VIÊN NGHỆ THUẬT": a light paragraph, then a **5-column grid of portrait
> collaborator tiles** (name + orange role).

### 4.4 — Services / Dịch vụ (dark)

> Dark sub-page. Eyebrow "— DỊCH VỤ", UPPERCASE heading "GIẢI PHÁP SỰ KIỆN TRỌN
> GÓI", a lead paragraph. A 2-column grid of 4 dark square cards; each has a
> **gradient icon box**, an UPPERCASE title, a description, and a gradient bottom
> bar that appears on hover. Cards: "ĐẠO DIỄN & KỊCH BẢN", "TỔ CHỨC SẢN XUẤT",
> "NHÂN SỰ SỰ KIỆN", "THIẾT BỊ SỰ KIỆN".

### 4.5 — News list / Tin tức (dark)

> Dark sub-page. Eyebrow "— TIN TỨC", big UPPERCASE heading "TIN TỨC & HOẠT ĐỘNG",
> a lead paragraph. A **carousel** of square news cards (3 per view on desktop, 2 on
> tablet, 1 on mobile) with square ◀ ▶ arrows bottom-right. Each card (equal height):
> 16:9 cover image, orange date, 2-line title, 3-line excerpt, orange "ĐỌC TIẾP →".

### 4.6 — News detail / Tin tức chi tiết (dark)

> Dark article page, max width ~768px. Top: an orange "← TẤT CẢ TIN TỨC" back link.
> Then an orange date, a big UPPERCASE title, a 16:9 cover image, a lead paragraph,
> and the rich-text body (paragraphs, headings, lists; links in orange).

### 4.7 — Contact / Liên hệ (dark)

> Dark sub-page. Eyebrow "— LIÊN HỆ", UPPERCASE heading "LIÊN HỆ VỚI TÂN CHÂU
> THÀNH", a lead. Two columns: LEFT = contact info with orange labels —
> "VĂN PHÒNG" (two addresses + map-pin icons), "ĐIỆN THOẠI" (three numbers),
> "EMAIL"; RIGHT = a dark bordered card "GỬI YÊU CẦU" with a form on **dark inputs**
> (near-black fields, orange focus border): Họ và tên, Email hoặc số điện thoại, Nội
> dung (textarea), and a square gradient submit button "GỬI YÊU CẦU →". Below, a
> section "VỊ TRÍ VĂN PHÒNG" with two embedded map cards side by side.

---

## 5. Reference data (real content)

- **Brand:** Công ty TNHH Tân Châu Thành — tổ chức sự kiện & truyền thông, Hà Nội,
  thành lập 2018. Hotline 091.353.2566 · tanchauthanhhn@gmail.com ·
  facebook.com/TanChauThanhhn.
- **Offices:** 26 Trần Quốc Toản, P. Cửa Nam, Hà Nội · 44 ngõ 36a Trần Điền, P.
  Phương Liệt, Hà Nội.
- **Services:** Đạo diễn & Kịch bản · Tổ chức sản xuất · Nhân sự sự kiện · Thiết bị sự kiện.
- **Hero slides (carousel):** 2018 / Năm thành lập · 2 / Văn phòng tại Hà Nội ·
  2003 / Bế mạc SEA Games 22 · 2010 / Đại lễ 1000 năm Thăng Long – Hà Nội.
- **Collaborators (gương mặt):** NSND Quang Thọ, NSND Quốc Hưng, Đăng Dương, Trọng Tấn,
  NSƯT Anh Thơ, Việt Hoàn, NSƯT Lan Anh, MC Hoài Anh, MC Sơn Lâm, MC Hồng Nhung.

> Nội dung chính (Hero/Giới thiệu/Dự án/Gương mặt/Tin tức/Liên hệ) do **Payload CMS**
> quản trị; UI strings nằm ở `messages/*.json`. Token gốc: `src/styles/globals.css`.
> Nếu chỉnh màu/bo góc/bố cục trong code, cập nhật lại §1–§4.
