import type { CollectionConfig } from 'payload';

/** Cảm nhận khách hàng. */
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Cảm nhận', plural: 'Cảm nhận khách hàng' },
  admin: { useAsTitle: 'author', defaultColumns: ['author', 'role', 'order'], group: 'Nội dung' },
  orderable: true,
  fields: [
    { name: 'quote', type: 'textarea', required: true, localized: true, label: 'Nội dung cảm nhận' },
    { name: 'author', type: 'text', required: true, label: 'Tên người nhận xét' },
    { name: 'role', type: 'text', localized: true, label: 'Chức vụ / đơn vị' },
    { name: 'photo', type: 'upload', relationTo: 'media', label: 'Ảnh (tuỳ chọn)' },
    { name: 'order', type: 'number', label: 'Thứ tự', defaultValue: 0 }
  ]
};
