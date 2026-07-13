import type { GlobalConfig } from 'payload';

/** Trang chủ — Về chúng tôi. */
export const About: GlobalConfig = {
  slug: 'about',
  label: 'Giới thiệu (Về chúng tôi)',
  admin: {
    group: 'Trang chủ',
    description: 'Đoạn giới thiệu công ty ở trang chủ và trang Giới thiệu.'
  },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, label: 'Dòng nhãn nhỏ' },
    { name: 'title', type: 'text', localized: true, label: 'Tiêu đề' },
    { name: 'body', type: 'textarea', localized: true, label: 'Nội dung' }
  ]
};
