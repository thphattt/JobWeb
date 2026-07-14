import type { CollectionConfig } from 'payload';

/** Gương mặt hợp tác tiêu biểu (nghệ sĩ, MC, NSND/NSƯT). */
export const Collaborators: CollectionConfig = {
  slug: 'collaborators',
  labels: { singular: 'Gương mặt hợp tác', plural: 'Gương mặt hợp tác tiêu biểu' },
  defaultSort: 'order',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'order'],
    group: 'Nội dung',
    description: 'Nghệ sĩ, MC… hiển thị ở mục "Gương mặt hợp tác" trên trang chủ và trang Giới thiệu.'
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Tên' },
    { name: 'role', type: 'text', localized: true, label: 'Vai trò / danh hiệu' },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Ảnh chân dung',
      admin: { description: 'Nên dùng ảnh vuông, rõ mặt.' }
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
