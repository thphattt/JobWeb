import type { CollectionConfig } from 'payload';

/** Gương mặt hợp tác tiêu biểu (nghệ sĩ, MC, NSND/NSƯT). */
export const Collaborators: CollectionConfig = {
  slug: 'collaborators',
  labels: { singular: 'Gương mặt hợp tác', plural: 'Gương mặt hợp tác tiêu biểu' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'role', 'order'], group: 'Nội dung' },
  orderable: true,
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Tên' },
    { name: 'role', type: 'text', localized: true, label: 'Vai trò / danh hiệu' },
    { name: 'photo', type: 'upload', relationTo: 'media', label: 'Ảnh chân dung' },
    { name: 'order', type: 'number', label: 'Thứ tự', defaultValue: 0 }
  ]
};
