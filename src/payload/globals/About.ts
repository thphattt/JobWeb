import type { GlobalConfig } from 'payload';

/** Trang chủ — Về chúng tôi. */
export const About: GlobalConfig = {
  slug: 'about',
  label: 'Trang chủ — Về chúng tôi',
  admin: { group: 'Nội dung' },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, label: 'Dòng nhãn nhỏ' },
    { name: 'title', type: 'text', localized: true, label: 'Tiêu đề' },
    { name: 'body', type: 'textarea', localized: true, label: 'Nội dung' }
  ]
};
