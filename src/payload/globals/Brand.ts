import type { GlobalConfig } from 'payload';

/** Thương hiệu (tên công ty + khẩu hiệu). */
export const Brand: GlobalConfig = {
  slug: 'brand',
  label: 'Thương hiệu',
  admin: {
    group: 'Thông tin công ty',
    description: 'Tên công ty và khẩu hiệu, dùng ở chân trang và nhiều nơi trên website.'
  },
  fields: [
    { name: 'name', type: 'text', localized: true, label: 'Tên công ty' },
    { name: 'tagline', type: 'text', localized: true, label: 'Khẩu hiệu' }
  ]
};
