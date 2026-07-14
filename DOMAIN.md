# Quy trình đăng ký tên miền .vn tại Vietnix (đứng tên khách hàng)

> Mục tiêu: đăng ký **`truyenthongtanchauthanh.vn`** (ĐÃ CHỐT) với **chủ thể là khách hàng**
> — Công ty TNHH Tân Châu Thành (tổ chức) — bàn giao sạch, khách toàn quyền sở hữu.
> Dùng cho website JobWeb chạy trên VPS Vietnix. Sau khi mua xong → tiếp tục `DEPLOY-VPS.md`.
>
> **Vì sao Vietnix:** VPS cũng thuê tại Vietnix → domain + VPS + DNS quản lý chung
> 1 tài khoản portal.vietnix.vn, 1 đầu mối hỗ trợ, 1 nguồn hóa đơn.
>
> **Đuôi `.vn` (khác `.com`):** KHÔNG cần thủ tục thông báo tại thongbaotenmien.vn
> (chỉ áp dụng tên miền quốc tế), nhưng BẮT BUỘC nộp **hồ sơ bản khai chủ thể** sau khi mua
> (Bước 4) — không nộp có thể bị tạm ngừng/thu hồi tên miền.

---

## Bước 0 — Lấy thông tin từ khách (làm trước, 1 lần)

Xin khách cung cấp — thông tin này sẽ thành **thông tin chủ thể tên miền**:

| Thông tin | Ghi chú |
|---|---|
| Tên công ty + MST (khớp GPKD) | Chủ thể là tổ chức — thông tin phải khớp giấy tờ pháp lý |
| Người đại diện/quản lý tên miền: họ tên, CCCD, chức vụ | Cần cho bản khai chủ thể `.vn` |
| **Email của khách** | Quan trọng nhất — là email quản trị, nhận mọi thông báo gia hạn. Phải là email khách dùng lâu dài, có bảo mật tốt |
| SĐT, địa chỉ trụ sở | Điền hồ sơ |
| Chữ ký số của công ty (hoặc khả năng ký + đóng dấu bản giấy) | Bản khai `.vn` của tổ chức cần chữ ký số hoặc bản có dấu đỏ |
| Ai thanh toán, có cần hóa đơn VAT không | Chốt trước khi mua |

**Không công bố tên miền định mua** trước khi mua xong (tránh bị người khác đăng ký chặn trước).

## Bước 1 — Kiểm tra tên miền còn trống

1. Vào https://vietnix.vn/dang-ky-ten-mien/ → tra cứu `truyenthongtanchauthanh.vn`.
2. Còn trống → sang Bước 2. Đã bị giữ → chốt lại phương án dự phòng với khách.
3. Kiểm tra nhanh tên không trùng thương hiệu đã đăng ký của bên khác (tránh tranh chấp sau này).

## Bước 2 — Tài khoản Vietnix đứng tên khách

1. Vào https://portal.vietnix.vn → **Đăng ký** bằng **email của khách** (nếu chưa có).
2. Điền thông tin thật của khách — hệ thống dùng làm thông tin chủ thể domain.
3. Xác nhận email kích hoạt tài khoản.
4. Đặt mật khẩu mạnh; khách giữ mật khẩu, cấp cho bạn để thao tác hộ trong thời gian triển khai (đổi lại sau khi bàn giao).
5. **Tài khoản này dùng chung cho cả VPS** (`DEPLOY-VPS.md` Bước 1b) — mua 2 dịch vụ cùng 1 nơi.

## Bước 3 — Đặt mua và thanh toán

1. Đăng nhập portal.vietnix.vn → tra cứu lại domain → **Thêm vào giỏ hàng**.
2. **Nameserver: để mặc định** `ns1.vietnix.net` / `ns2.vietnix.net`, bỏ trống NS3–NS5 — DNS quản lý ngay trong portal. (Chỉ đổi khi muốn dùng DNS ngoài như Cloudflare.)
3. Chọn **thời hạn**: 1 năm (tối thiểu) hoặc 2 năm (đỡ rủi ro quên gia hạn năm sau).
4. **Bỏ hết dịch vụ bán kèm** được gợi ý: hosting, email server, SSL... — không cần vì đã có VPS riêng + SSL Let's Encrypt miễn phí.
5. Khai thông tin chủ thể tên miền = thông tin khách (Bước 0) — chủ thể **tổ chức**, đúng tên công ty + MST.
6. Thanh toán: chuyển khoản / thẻ / ví điện tử. Cần hóa đơn VAT → khai thông tin xuất hóa đơn ngay lúc thanh toán. (Phí, lệ phí nhà nước của `.vn` không chịu VAT; chỉ phần dịch vụ quản trị chịu VAT 10%.)
7. Nhận email xác nhận, domain xuất hiện trong mục Quản lý tên miền.

## Bước 4 — Nộp hồ sơ bản khai chủ thể .vn (BẮT BUỘC, làm ngay sau khi mua)

Tên miền `.vn` phải có hồ sơ chủ thể hợp lệ theo quy định VNNIC (Nghị định 147/2024/NĐ-CP):

1. Vào portal.vietnix.vn → **Quản lý tên miền** → chọn domain → mục hồ sơ/bản khai.
2. Chủ thể là **tổ chức**: nộp **bản khai đăng ký tên miền có chữ ký số của công ty** (hoặc bản giấy ký tên + đóng dấu, scan upload) theo mẫu Vietnix cung cấp.
3. Kèm thông tin người quản lý tên miền (họ tên, CCCD — Bước 0).
4. Theo dõi trạng thái duyệt trong portal; thiếu/sai hồ sơ → Vietnix báo bổ sung. **Không hoàn tất hồ sơ, tên miền có thể bị tạm ngừng hoặc thu hồi.**
5. Lưu bản khai đã duyệt vào hồ sơ bàn giao.

Sau này đổi thông tin chủ thể (đổi tên công ty, người đại diện...) → làm lại thủ tục cập nhật bản khai.

## Bước 5 — Cấu hình domain sau khi mua

1. Vào portal.vietnix.vn → **Quản lý tên miền** → chọn domain:
   - Kiểm tra trạng thái **Active**, thông tin chủ thể đúng tên công ty khách.
   - Bật khóa tên miền/khóa transfer nếu portal có tùy chọn.
2. **Trỏ DNS về VPS** (làm khi VPS đã sẵn sàng — theo `DEPLOY-VPS.md` Bước 7). VPS cùng tài khoản nên IP có sẵn trong portal:

   | Loại | Tên | Giá trị |
   |---|---|---|
   | A | `@` | IP VPS |
   | A | `www` | IP VPS |

3. Sau khi deploy web xong → thêm bản ghi **SPF/DKIM** cho Resend (theo `DEPLOY-VPS.md` Bước 9.3).
4. **Đặt lịch gia hạn**: ghi ngày hết hạn vào lịch (Google Calendar), nhắc trước 30 ngày. Thống nhất rõ với khách: **ai** gia hạn, thanh toán thế nào. `.vn` quá hạn không gia hạn (~25–30 ngày) là bị thu hồi theo quy định VNNIC. Gia hạn domain + VPS cùng đợt cho tiện (cùng portal).

## Checklist hoàn thành

- [ ] Đủ thông tin chủ thể của khách + chữ ký số/dấu công ty (Bước 0)
- [ ] Tài khoản portal.vietnix.vn đứng email khách, đã xác minh
- [ ] Domain thanh toán xong, trạng thái Active, chủ thể đúng tên công ty khách
- [ ] **Bản khai chủ thể `.vn` đã nộp và được duyệt** (Bước 4)
- [ ] Nameserver mặc định Vietnix, bản ghi A trỏ đúng IP VPS (khi VPS sẵn sàng)
- [ ] Ngày hết hạn đã vào lịch nhắc, chốt người gia hạn
- [ ] Bàn giao khách: tài khoản portal.vietnix.vn (khách đổi mật khẩu), hóa đơn, bản khai đã duyệt

## Chi phí

| Khoản | Chi phí |
|---|---|
| `.vn` năm đầu | ~670k (lệ phí đăng ký 100k + phí duy trì 350k + DV quản trị năm đầu 200k + VAT phần dịch vụ) |
| `.vn` gia hạn | ~460k/năm |
| Bản khai chủ thể | Miễn phí (tự làm) |

Giá xem tại https://vietnix.vn/bang-gia-ten-mien/ (phí nhà nước `.vn` không chịu VAT, phần dịch vụ chịu VAT 10%).

## Lưu ý rủi ro

- **Mất email quản trị = nguy cơ mất domain.** Email khách phải bật 2FA, không dùng email rác.
- **Hồ sơ bản khai không hoàn tất** → tên miền bị tạm ngừng/thu hồi dù đã trả tiền — làm ngay Bước 4, đừng để quên.
- `.vn` hết hạn bị thu hồi nhanh hơn tên miền quốc tế (~25–30 ngày) — lịch nhắc gia hạn là bắt buộc.
- Đứng tên khách ngay từ đầu tránh được thủ tục **chuyển nhượng quyền sử dụng** rườm rà về sau.
- Domain + VPS cùng 1 tài khoản: tiện nhưng **mất tài khoản là mất cả hai** — càng phải bảo vệ kỹ email + bật 2FA.
