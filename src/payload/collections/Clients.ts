import type { CollectionConfig } from 'payload';

/** Khách hàng & Đối tác (logo/tên). */
export const Clients: CollectionConfig = {
  slug: 'clients',
  labels: { singular: 'Khách hàng', plural: 'Khách hàng & Đối tác' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'order'], group: 'Nội dung' },
  orderable: true,
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Tên khách hàng / đối tác' },
    { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo (tuỳ chọn)' },
    { name: 'order', type: 'number', label: 'Thứ tự', defaultValue: 0 }
  ]
};
