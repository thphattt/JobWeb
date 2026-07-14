import path from 'path';
import type { CollectionConfig } from 'payload';

/** Thư viện ảnh (hero, sự kiện, tin tức, …). */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Ảnh', plural: 'Thư viện ảnh' },
  admin: {
    group: 'Hệ thống',
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    description: 'Kho ảnh dùng chung. Tải ảnh lên đây rồi chọn lại ở các mục Tin tức, Dự án, Hero…'
  },
  // Ảnh phải xem được công khai (khách chưa đăng nhập); ghi vẫn cần đăng nhập.
  access: { read: () => true },
  upload: {
    staticDir: path.resolve(process.cwd(), 'public/uploads'),
    mimeTypes: ['image/*']
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Mô tả ảnh',
      localized: true,
      admin: {
        description: 'Mô tả ngắn nội dung ảnh — giúp SEO và người khiếm thị. VD: "Sân khấu bế mạc SEA Games".'
      }
    }
  ]
};
