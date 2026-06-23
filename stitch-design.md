# Tân Châu Thành — Design Spec for Google Stitch

Tài liệu mô tả thiết kế **hiện tại** của website Công ty TNHH Tân Châu Thành để
tái tạo trên **Google Stitch** (stitch.withgoogle.com).

> **Cách dùng:** Stitch sinh **một màn hình mỗi prompt**. Dán **§1 Global style**
> vào ô mô tả phong cách (hoặc đính kèm đầu mỗi prompt), rồi dùng từng prompt ở
> **§4 Screens**. Văn bản giao diện để tiếng Việt như bên dưới; phần mô tả layout
> có thể dán nguyên (Stitch hiểu cả Anh lẫn Việt).
>
> Giá trị màu HEX là **xấp xỉ** từ token OKLCH gốc (ghi kèm để chính xác tuyệt đối).

---

## 1. Global style (dán phần này trước)

A warm, editorial, modern-corporate website for an event-organization &
communications company. Light "paper" background, lots of whitespace, a
**Bento-grid** hero, rounded cards, pill-shaped buttons, and a signature
orange→pink→purple brand gradient taken from the logo. Calm and premium, not
flashy. Bilingual Vietnamese/English (UI copy below is Vietnamese).

**Color palette**

| Role | HEX (approx) | OKLCH (source of truth) | Notes |
|------|--------------|--------------------------|-------|
| Paper (background) | `#F7F1EC` | `oklch(96.3% 0.006 50)` | warm off-white, page bg |
| Paper 2 (surface) | `#E9E4DC` | `oklch(92% 0.008 80)` | secondary surface / cards |
| Ink (text) | `#2C2926` | `oklch(28% 0.005 60)` | warm charcoal, headings/body |
| Ink 2 (muted) | `#6E6E6E` | `oklch(50% 0 0)` | secondary text |
| Rule (hairline) | `#E9E4DC` | `oklch(92% 0.008 80)` | borders/dividers |
| **Accent** | `#D6325A` | `oklch(57% 0.2 13)` | raspberry-pink, links/eyebrows/icons |
| Accent ink | `#FFFFFF` | `oklch(99% 0 0)` | text on accent/gradient |
| Focus ring | `#2A5680` | `oklch(43% 0.08 245)` | slate-blue focus outline |
| Clay (decorative) | `#C49F8A` | `oklch(73% 0.045 52)` | warm decorative on dark |

**Brand gradient** (linear, 120°): orange `#E47C2E` → raspberry `#D6335A` →
purple `#7A3B93`. Used on primary buttons, stat tiles, gallery placeholders.
Reversed variant (purple→pink→orange) when left-aligned text sits on it.

**Typography**
- Single family: **Be Vietnam Pro** (Google Font, full Vietnamese support) for
  both headings and body.
- Headings: weight **800 (extrabold)**, tight tracking, large.
- Body: weight 400–500. Buttons/labels: 600.
- Eyebrows (section kickers): small UPPERCASE, letter-spacing ~0.25em, accent
  color, preceded by a short **horizontal dash** (`— LABEL`).

**Shape & spacing**
- Card radius **20px**; input radius 6px; buttons are **full pills** (radius ∞).
- Hairline borders `#E9E4DC` (1px). Soft, generous padding (24–48px).
- Max content width ~1280px (home), ~1024–1152px (sub-pages), centered.

**Motion** (describe to Stitch as static, note for build): elements **fade up**
on scroll (translateY + opacity, ease `cubic-bezier(0.16,1,0.3,1)`, slight
stagger); cards reveal extra info on hover; mobile menu is a right-side drawer.

---

## 2. Components

- **Navbar (sticky, translucent paper + blur):** left = logo (gradient mark +
  "TÂN CHÂU THÀNH" wordmark); center = text links *Giới thiệu · Dịch vụ · Liên
  hệ*; right = phone pill `091.353.2566` (phone icon, paper-2 bg), language
  switcher `VI / EN`. On mobile: links collapse into a **hamburger → right
  drawer**.
- **Primary button:** brand-gradient fill, white text, pill, arrow icon, slight
  lift on hover.
- **Secondary button:** transparent with 1px ink/15 border, pill, ink text.
- **Card:** paper bg, 1px rule border, radius 20px; hover = border turns accent.
- **Eyebrow:** `— DỰ ÁN TIÊU BIỂU` style (dash + uppercase accent).
- **Footer:** 3 columns on paper-2, hairline top border, bottom copyright bar.

---

## 3. Pages (overview)

1. **Trang chủ (Home)** — Bento hero + stats + about strip, Services, Event
   gallery, Contact CTA.
2. **Giới thiệu (About)** — intro, leadership cards, event gallery, collaborators.
3. **Dịch vụ (Services)** — 4 service cards.
4. **Liên hệ (Contact)** — contact info + form + 2 maps.

---

## 4. Screen prompts (paste one at a time into Stitch)

### 4.1 — Home (desktop)

> Design a desktop homepage for an event & communications company, warm editorial
> style on a `#F7F1EC` paper background, single font **Be Vietnam Pro**, raspberry
> accent `#D6325A`, 20px rounded cards, pill buttons, max width 1280px.
>
> **Sticky top navbar:** logo on the left; centered links "Giới thiệu", "Dịch vụ",
> "Liên hệ"; on the right a pill button "📞 091.353.2566" and a "VI / EN" language
> switch.
>
> **Bento grid hero** (6-column grid, 16px gaps):
> - Large card spanning 4 cols × 2 rows, paper bg, 1px border: a small uppercase
>   accent eyebrow "— TỔ CHỨC SỰ KIỆN · TRUYỀN THÔNG", a huge extrabold heading
>   "Kiến tạo những chương trình sự kiện tầm vóc", a muted subtitle paragraph, and
>   two buttons: primary gradient pill "Liên hệ ngay →" and secondary outline pill
>   "Xem dịch vụ".
> - Card spanning 2 cols with an **orange→pink→purple gradient** background, white
>   text: giant number "2018" and label "Năm thành lập".
> - Card spanning 2 cols, surface `#E9E4DC`: giant number "2" and "Văn phòng tại
>   Hà Nội".
> - Full-width dark card (`#2C2926` ink bg): left side eyebrow "— VỀ CHÚNG TÔI" +
>   heading "Đối tác tổ chức sự kiện & truyền thông từ 2018"; right side a light
>   paragraph and an accent link "Tìm hiểu thêm ↗".
>
> **Services section:** eyebrow "— DỊCH VỤ", heading "Những gì chúng tôi làm", a
> row of 4 cards (icons: film clapperboard, calendar-check, users, speaker), each
> with a title and short description and a small "↗" in the corner. Titles:
> "Đạo diễn & Kịch bản", "Tổ chức sản xuất", "Nhân sự sự kiện", "Thiết bị sự kiện".
>
> **Featured events gallery:** eyebrow "— DỰ ÁN TIÊU BIỂU", heading "Những sự kiện
> chúng tôi đã thực hiện", a 3-column grid of 6 image tiles (4:3). Each tile has a
> brand-gradient background, a faint big year watermark, a small white year badge
> top-left, and the event name in white at the bottom. Names/years: "Bế mạc SEA
> Games 22" (2003), "Đại lễ 1000 năm Thăng Long – Hà Nội" (2010), "Tôi yêu Tổ quốc
> tôi" (2015), "10 năm mở rộng địa giới Thủ đô" (2018), "Tôi yêu Tổ quốc tôi tại
> Đền Hùng" (2019), "Chào mừng Đại hội Đảng bộ các cấp".
>
> **Contact CTA:** a centered surface `#E9E4DC` card: eyebrow "— LIÊN HỆ", heading
> "Bắt đầu sự kiện của bạn", a subtitle, and a primary gradient pill button "Gửi
> yêu cầu →".
>
> **Footer** (surface `#E9E4DC`, 3 columns): (1) company name "Công ty TNHH Tân
> Châu Thành" + tagline + a Facebook icon; (2) "Văn phòng" with two addresses and
> map-pin icons: "26 Trần Quốc Toản, P. Cửa Nam, Hà Nội" and "44 ngõ 36a Trần
> Điền, P. Phương Liệt, Hà Nội"; (3) "Liên hệ" with phones 0243.822.9251 /
> 091.353.2566 / 091.949.6886 and email tanchauthanhhn@gmail.com. A thin bottom
> bar with "© 2026 Công ty TNHH Tân Châu Thành".

### 4.2 — Home (mobile)

> Same homepage, mobile width (390px). Navbar shows logo + a hamburger icon.
> Tapping it opens a **right-side drawer** over a dimmed blurred backdrop: brand
> name at top with a close ✕, vertical links "Giới thiệu / Dịch vụ / Liên hệ", and
> a gradient pill "📞 091.353.2566" pinned at the bottom. Bento cards stack to a
> single column; the event gallery is one column.

### 4.3 — About / Giới thiệu

> Sub-page, paper background, max width ~1024px. Eyebrow "— VỀ CHÚNG TÔI", big
> heading "Công ty TNHH Tân Châu Thành", an intro paragraph. Then section
> "Đội ngũ lãnh đạo": a 2-column grid of 4 small cards, each with an uppercase
> accent role and a bold name — "Giám đốc — Bà Ngô Thị Ninh", "Phó Giám đốc — Bà
> Nguyễn Thị Hạnh Nguyên", "Kế toán trưởng — Ông Nguyễn Anh Tuấn", "Cố vấn nghệ
> thuật — Ths. Lại Hồng Đăng". Then "Chương trình tiêu biểu": the same 3-column
> gradient event gallery as the homepage. Then a dark `#2C2926` card
> "Cộng tác viên nghệ thuật" with a light paragraph listing artists.

### 4.4 — Services / Dịch vụ

> Sub-page, paper background. Eyebrow "— DỊCH VỤ", heading "Giải pháp sự kiện trọn
> gói", a lead paragraph. A 2-column grid of 4 large cards; each card has a
> rounded square icon box filled with the **brand gradient** (white icon inside),
> a bold title and a description. Cards: "Đạo diễn & Kịch bản", "Tổ chức sản
> xuất", "Nhân sự sự kiện", "Thiết bị sự kiện".

### 4.5 — Contact / Liên hệ

> Sub-page, paper background. Eyebrow "— LIÊN HỆ", heading "Liên hệ với Tân Châu
> Thành", a lead paragraph. Two columns: **left** = contact info with accent
> labels — "Văn phòng" (two addresses with map-pin icons), "Điện thoại" (three
> numbers), "Email" (tanchauthanhhn@gmail.com); **right** = a bordered paper card
> "Gửi yêu cầu" containing a form: Họ và tên, Email hoặc số điện thoại, Nội dung
> (textarea), and a gradient pill submit button "Gửi yêu cầu →". Below, a section
> "Vị trí văn phòng" with two embedded map cards side by side.

---

## 5. Reference data (real content)

- **Brand:** Công ty TNHH Tân Châu Thành — tổ chức sự kiện & truyền thông, Hà Nội,
  thành lập 2018. Hotline 091.353.2566 · tanchauthanhhn@gmail.com · Facebook
  facebook.com/TanChauThanhhn.
- **Offices:** 26 Trần Quốc Toản, P. Cửa Nam, Hà Nội · 44 ngõ 36a Trần Điền, P.
  Phương Liệt, Hà Nội.
- **Services:** Đạo diễn & Kịch bản · Tổ chức sản xuất · Nhân sự sự kiện · Thiết
  bị sự kiện.
- **Stats:** Thành lập 2018 · 2 văn phòng tại Hà Nội.

> Spec này khớp với mã nguồn hiện tại (Next.js + Tailwind v4). Token gốc:
> `src/styles/globals.css`. Nếu chỉnh màu/bo góc trong code, cập nhật lại §1.
