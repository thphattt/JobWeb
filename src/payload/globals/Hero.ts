import type { GlobalConfig } from 'payload';

/** Trang chủ — Hero (tiêu đề + carousel slide). */
export const Hero: GlobalConfig = {
  slug: 'hero',
  label: 'Đầu trang (Hero)',
  admin: {
    group: 'Trang chủ',
    description: 'Khối đầu trang chủ: tiêu đề lớn, mô tả, 2 nút và carousel bên phải.'
  },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, label: 'Dòng nhãn nhỏ' },
    { name: 'title', type: 'text', localized: true, label: 'Tiêu đề lớn' },
    { name: 'subtitle', type: 'textarea', localized: true, label: 'Mô tả' },
    { name: 'ctaPrimary', type: 'text', localized: true, label: 'Nút chính' },
    { name: 'ctaSecondary', type: 'text', localized: true, label: 'Nút phụ' },
    {
      name: 'slides',
      type: 'array',
      label: 'Slide carousel (khối bên phải)',
      labels: { singular: 'Slide', plural: 'Slide' },
      fields: [
        { name: 'value', type: 'text', label: 'Số/Chữ lớn (vd 2018)' },
        { name: 'label', type: 'text', localized: true, label: 'Nhãn dưới' },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Ảnh nền (tuỳ chọn)' }
      ]
    }
  ]
};
