import type { GlobalConfig } from 'payload';

/** Trang chủ — Số liệu nổi bật (đếm số). */
export const Stats: GlobalConfig = {
  slug: 'stats',
  label: 'Trang chủ — Số liệu nổi bật',
  admin: { group: 'Nội dung' },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, label: 'Dòng nhãn nhỏ' },
    { name: 'title', type: 'text', localized: true, label: 'Tiêu đề' },
    {
      name: 'items',
      type: 'array',
      label: 'Số liệu',
      maxRows: 4,
      fields: [
        { name: 'value', type: 'number', label: 'Giá trị (số)' },
        { name: 'suffix', type: 'text', label: 'Hậu tố (vd + hoặc K)' },
        { name: 'label', type: 'text', localized: true, label: 'Nhãn' }
      ]
    }
  ]
};
