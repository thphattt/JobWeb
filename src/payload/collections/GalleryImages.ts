import type { CollectionConfig } from 'payload';

/** Thư viện ảnh (hiển thị hiệu ứng vòm 3D ở trang Thư viện). */
export const GalleryImages: CollectionConfig = {
  slug: 'gallery-images',
  labels: { singular: 'Ảnh thư viện', plural: 'Thư viện ảnh' },
  defaultSort: 'order',
  access: { read: () => true },
  admin: {
    useAsTitle: 'caption',
    defaultColumns: ['caption', 'order'],
    group: 'Nội dung',
    description: 'Ảnh hiển thị ở trang Thư viện (hiệu ứng vòm 3D). Tải ảnh lên và sắp thứ tự.'
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Ảnh'
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
      label: 'Chú thích (tuỳ chọn)',
      admin: { description: 'Mô tả ngắn cho ảnh — dùng làm nhãn khi rê chuột / trợ năng.' }
    },
    {
      name: 'order',
      type: 'number',
      label: 'Thứ tự',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        step: 1,
        description: 'Số nhỏ hiển thị trước (1, 2, 3…).'
      }
    }
  ]
};
