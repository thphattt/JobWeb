import type { CollectionConfig } from 'payload';

/** Cảm nhận khách hàng. */
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Cảm nhận', plural: 'Cảm nhận khách hàng' },
  defaultSort: 'order',
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'role', 'order'],
    group: 'Nội dung',
    description: 'Nhận xét của khách hàng (hiện có thể chưa bật hiển thị trên trang chủ).'
  },
  fields: [
    { name: 'quote', type: 'textarea', required: true, localized: true, label: 'Nội dung cảm nhận' },
    { name: 'author', type: 'text', required: true, label: 'Tên người nhận xét' },
    { name: 'role', type: 'text', localized: true, label: 'Chức vụ / đơn vị' },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Ảnh (tuỳ chọn)',
      admin: { description: 'Ảnh chân dung người nhận xét. Để trống cũng được.' }
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
