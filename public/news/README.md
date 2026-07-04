# Ảnh bìa tin tức (demo)

3 minh họa khớp với 3 bài seed trong `scripts/seed-news.mjs`:

| file                  | bài viết                                          |
| --------------------- | ------------------------------------------------- |
| `news-dai-hoi-dang.jpg` | Đồng hành chuỗi sự kiện chào mừng Đại hội Đảng bộ |
| `news-hau-truong.jpg`   | Hậu trường sản xuất chương trình nghệ thuật       |
| `news-tuyen-ctv.jpg`    | Tuyển cộng tác viên sự kiện mùa cao điểm 2026     |

Khác với events/hero, thẻ tin tức chỉ đọc `coverImage` từ CMS (không có
fallback đường dẫn tĩnh). Cách gắn:

1. Vào Payload Admin → **Media** → upload 3 file này.
2. Mở từng bài trong **News** → chọn **Cover Image** tương ứng → Save.

Khi chưa gắn, card tự hiển thị ô gradient thương hiệu nên vẫn không vỡ layout.
