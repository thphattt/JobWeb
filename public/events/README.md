# Ảnh sự kiện

Thả ảnh thật của các sự kiện vào thư mục này, sau đó khai báo đường dẫn trong
`src/lib/events.ts` (trường `image`). Khi chưa có ảnh, gallery tự hiển thị ô
gradient thương hiệu + năm — nên web vẫn đẹp mà không bị ảnh vỡ.

## Cách bật ảnh cho một sự kiện

1. Bỏ ảnh vào đây, ví dụ `sea-games-22.jpg` (khuyến nghị tỉ lệ 4:3, ≥ 1200px ngang, < 400KB).
2. Mở `src/lib/events.ts`, thêm `image` vào đúng `id`:

   ```ts
   { id: 'seaGames22', image: '/events/sea-games-22.jpg' },
   ```

## Gợi ý tên file theo từng sự kiện (id → file)

| id              | sự kiện                                   | file gợi ý               |
| --------------- | ----------------------------------------- | ------------------------ |
| `seaGames22`    | Bế mạc SEA Games 22 (2003)                | `sea-games-22.jpg`       |
| `thangLong1000` | 1000 năm Thăng Long – Hà Nội (2010)       | `thang-long-1000.jpg`    |
| `toQuoc2015`    | "Tôi yêu Tổ quốc tôi" (2015)              | `to-quoc-2015.jpg`       |
| `thuDo10`       | 10 năm mở rộng địa giới Thủ đô (2018)     | `thu-do-10.jpg`          |
| `denHung2019`   | "Tôi yêu Tổ quốc tôi" tại Đền Hùng (2019) | `den-hung-2019.jpg`      |
| `daiHoiDang`    | Chào mừng Đại hội Đảng bộ các cấp         | `dai-hoi-dang.jpg`       |

Ảnh đặt trong `public/` được Next.js phục vụ trực tiếp; `next/image` đã tối ưu
sẵn (lazy-load, đổi kích thước). Không cần cấu hình thêm.