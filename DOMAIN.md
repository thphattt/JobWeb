# Quy trình đăng ký tên miền .com tại Vietnix (đứng tên khách hàng)

> Mục tiêu: đăng ký domain `.com` với **chủ thể là khách hàng** (bàn giao sạch, khách toàn quyền
> sở hữu), dùng cho website JobWeb chạy trên VPS Vietnix.
> Domain ví dụ: `tanchauthanh.com`. Sau khi mua xong → tiếp tục `DEPLOY-VPS.md`.
>
> **Vì sao Vietnix:** VPS cũng thuê tại Vietnix → domain + VPS + DNS quản lý chung
> 1 tài khoản portal.vietnix.vn, 1 đầu mối hỗ trợ, 1 nguồn hóa đơn.
>
> Lưu ý: máy chủ đặt ở VN **không bắt buộc** dùng đuôi `.vn` — dùng `.com` hợp lệ,
> chỉ cần làm thủ tục thông báo ở Bước 4.

---

## Bước 0 — Lấy thông tin từ khách (làm trước, 1 lần)

Xin khách cung cấp — thông tin này sẽ thành **thông tin chủ thể tên miền**:

| Thông tin | Ghi chú |
|---|---|
| Họ tên (hoặc tên công ty + MST) | Đăng ký cá nhân hay doanh nghiệp — hỏi rõ khách |
| Số CCCD, ngày cấp | Cần cho khai chủ thể + thông báo tên miền quốc tế; Vietnix có thể yêu cầu ảnh CCCD để xác minh |
| **Email của khách** | Quan trọng nhất — là email quản trị, nhận mọi thông báo gia hạn. Phải là email khách dùng lâu dài, có bảo mật tốt |
| SĐT, địa chỉ | Điền hồ sơ |
| Tên miền muốn mua + 1–2 phương án dự phòng | Phòng khi tên chính đã bị người khác giữ |
| Ai thanh toán, có cần hóa đơn VAT không | Chốt trước khi mua |

**Không công bố tên miền định mua** trước khi mua xong (tránh bị người khác đăng ký chặn trước).

## Bước 1 — Kiểm tra tên miền còn trống

1. Vào https://vietnix.vn/dang-ky-ten-mien/ → ô tra cứu tên miền → gõ `tanchauthanh.com`.
2. Còn trống → sang Bước 2. Đã bị giữ → thử phương án dự phòng (`.vn`, thêm hậu tố...), chốt lại với khách.
3. Kiểm tra nhanh tên không trùng thương hiệu đã đăng ký của bên khác (tránh tranh chấp sau này).

## Bước 2 — Tạo tài khoản Vietnix đứng tên khách

1. Vào https://portal.vietnix.vn → **Đăng ký** bằng **email của khách**.
2. Điền thông tin thật của khách (họ tên, SĐT, địa chỉ) — hệ thống dùng làm thông tin chủ thể domain.
3. Xác nhận email kích hoạt tài khoản.
4. Đặt mật khẩu mạnh; khách giữ mật khẩu, cấp cho bạn để thao tác hộ trong thời gian triển khai (đổi lại sau khi bàn giao).
5. **Tài khoản này dùng chung cho cả VPS** (`DEPLOY-VPS.md` Bước 1b) — mua 2 dịch vụ cùng 1 nơi.

## Bước 3 — Đặt mua và thanh toán

1. Đăng nhập portal.vietnix.vn → tra cứu lại domain → **Thêm vào giỏ hàng**.
2. Chọn **thời hạn**: 1 năm (tối thiểu) hoặc 2 năm (đỡ rủi ro quên gia hạn năm sau; giá KM thường chỉ áp dụng năm đầu).
3. **Bỏ hết dịch vụ bán kèm** được gợi ý: hosting, email server, SSL... — không cần vì đã có VPS riêng + SSL Let's Encrypt miễn phí. Cân nhắc duy nhất: dịch vụ **ẩn thông tin WHOIS** (nếu khách là cá nhân, không muốn lộ SĐT/email công khai).
4. Khai thông tin chủ thể tên miền = thông tin khách (Bước 0). Nếu Vietnix yêu cầu bổ sung hồ sơ xác minh chủ thể (ảnh CCCD với cá nhân / bản khai có chữ ký số với tổ chức) → upload trong portal, mục Quản lý tên miền.
5. Thanh toán: chuyển khoản / thẻ / ví điện tử. Cần hóa đơn VAT → khai thông tin xuất hóa đơn ngay lúc thanh toán (tên miền quốc tế chịu VAT 10%).
6. Nhận email xác nhận, domain chuyển trạng thái **Active** trong mục quản lý tên miền (thường vài phút, tối đa vài giờ).

## Bước 4 — Thông báo sử dụng tên miền quốc tế (BẮT BUỘC theo luật, hay bị bỏ quên)

Chủ thể tại VN dùng tên miền quốc tế (`.com`, `.net`...) **phải thông báo** với cơ quan quản lý nhà nước (Nghị định 147/2024/NĐ-CP; hướng dẫn hiện hành: Thông tư 48/2025/TT-BKHCN):

1. Vào https://thongbaotenmien.vn
2. Chọn **Thông báo sử dụng tên miền** → khai online (~10 phút): tên miền + thông tin chủ thể (thông tin khách ở Bước 0).
3. Lưu lại email/bản xác nhận đã thông báo (đưa vào hồ sơ bàn giao).
4. Sau này đổi thông tin chủ thể → phải cập nhật lại thông báo.

Không làm bước này: về nguyên tắc có thể bị phạt hành chính khi bị kiểm tra — làm luôn cho chắc, miễn phí.

## Bước 5 — Cấu hình domain sau khi mua

1. Vào portal.vietnix.vn → **Quản lý tên miền** → chọn domain:
   - Kiểm tra **khóa tên miền (registrar lock) = BẬT** — chống transfer trộm.
   - Kiểm tra thông tin chủ thể đúng tên khách.
2. **Trỏ DNS về VPS** (làm khi VPS đã sẵn sàng — theo `DEPLOY-VPS.md` Bước 7). VPS cùng tài khoản nên IP có sẵn trong portal:

   | Loại | Tên | Giá trị |
   |---|---|---|
   | A | `@` | IP VPS |
   | A | `www` | IP VPS |

3. Sau khi deploy web xong → thêm bản ghi **SPF/DKIM** cho Resend (theo `DEPLOY-VPS.md` Bước 9.3).
4. **Đặt lịch gia hạn**: ghi ngày hết hạn vào lịch (Google Calendar), nhắc trước 30 ngày. Thống nhất rõ với khách: **ai** gia hạn, thanh toán thế nào. Domain hết hạn quá ~30–45 ngày là có thể mất vĩnh viễn. Gia hạn domain + VPS cùng đợt cho tiện (cùng portal).

## Checklist hoàn thành

- [ ] Đủ thông tin chủ thể của khách (Bước 0)
- [ ] Tài khoản portal.vietnix.vn đứng email khách, đã xác minh
- [ ] Domain thanh toán xong, trạng thái Active, chủ thể đúng tên khách
- [ ] Đã thông báo tại thongbaotenmien.vn, lưu bản xác nhận
- [ ] Registrar lock bật
- [ ] Bản ghi A trỏ đúng IP VPS (khi VPS sẵn sàng)
- [ ] Ngày hết hạn đã vào lịch nhắc, chốt người gia hạn
- [ ] Bàn giao khách: tài khoản portal.vietnix.vn (khách đổi mật khẩu), hóa đơn, bản xác nhận thông báo tên miền

## Chi phí

| Khoản | Chi phí |
|---|---|
| `.com` năm đầu | ~235–300k (giá KM 235k tại thời điểm khảo sát 7/2026) |
| `.com` gia hạn | ~320k/năm |
| Ẩn WHOIS (tùy chọn) | ~vài chục k/năm |
| Thông báo tên miền quốc tế | Miễn phí |

Giá xem tại https://vietnix.vn/bang-gia-ten-mien/ (tên miền quốc tế chưa gồm VAT 10%).

## Lưu ý rủi ro

- **Mất email quản trị = nguy cơ mất domain.** Email khách phải bật 2FA, không dùng email rác.
- Domain mới mua bị ICANN khóa transfer 60 ngày đầu — không ảnh hưởng (mình dùng tại Vietnix luôn).
- Đứng tên khách ngay từ đầu tránh được thủ tục **chuyển nhượng quyền sử dụng** rườm rà về sau.
- Domain + VPS cùng 1 tài khoản: tiện nhưng **mất tài khoản là mất cả hai** — càng phải bảo vệ kỹ email + bật 2FA.
