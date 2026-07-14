import type { CollectionConfig } from 'payload';

/** Khách hàng & Đối tác (logo/tên). */
export const Clients: CollectionConfig = {
  slug: 'clients',
  labels: { singular: 'Khách hàng', plural: 'Khách hàng & Đối tác' },
  defaultSort: 'order',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'order'],
    group: 'Nội dung',
    description: 'Logo/tên khách hàng & đối tác hiển thị ở dải logo trên trang chủ.'
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Tên khách hàng / đối tác' },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo (tuỳ chọn)',
      admin: { description: 'Logo nền trong suốt (PNG) sẽ đẹp nhất. Để trống sẽ hiện tên chữ.' }
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
