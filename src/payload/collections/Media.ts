import path from 'path';
import type { CollectionConfig } from 'payload';

/** Thư viện ảnh (hero, sự kiện, tin tức, …). */
export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Hệ thống' },
  // Ảnh phải xem được công khai (khách chưa đăng nhập); ghi vẫn cần đăng nhập.
  access: { read: () => true },
  upload: {
    staticDir: path.resolve(process.cwd(), 'public/uploads'),
    mimeTypes: ['image/*']
  },
  fields: [
    { name: 'alt', type: 'text', label: 'Mô tả ảnh (alt)', localized: true }
  ]
};
