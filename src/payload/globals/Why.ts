import type { GlobalConfig } from 'payload';

/** Trang chủ — Vì sao chọn (4 thế mạnh). Hiện chưa hiển thị nhưng vẫn quản trị được. */
export const Why: GlobalConfig = {
  slug: 'why',
  label: 'Trang chủ — Vì sao chọn',
  admin: { group: 'Nội dung' },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, label: 'Dòng nhãn nhỏ' },
    { name: 'title', type: 'text', localized: true, label: 'Tiêu đề' },
    {
      name: 'items',
      type: 'array',
      label: 'Thế mạnh',
      maxRows: 4,
      fields: [
        { name: 'title', type: 'text', localized: true, label: 'Tiêu đề' },
        { name: 'description', type: 'textarea', localized: true, label: 'Mô tả' }
      ]
    }
  ]
};
