import type { CollectionConfig } from 'payload';

/** Dịch vụ (trang /dich-vu). */
export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Dịch vụ', plural: 'Dịch vụ' },
  defaultSort: 'order',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order'],
    group: 'Nội dung',
    description: 'Các dịch vụ hiển thị ở trang Dịch vụ.'
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: 'Tên dịch vụ' },
    { name: 'description', type: 'textarea', localized: true, label: 'Mô tả' },
    {
      name: 'icon',
      type: 'select',
      label: 'Biểu tượng',
      defaultValue: 'clapperboard',
      options: [
        { label: 'Đạo diễn / Kịch bản', value: 'clapperboard' },
        { label: 'Tổ chức sản xuất', value: 'layers' },
        { label: 'Nhân sự sự kiện', value: 'users' },
        { label: 'Thiết bị sự kiện', value: 'speaker' }
      ],
      admin: { description: 'Chọn biểu tượng minh hoạ hiển thị kèm dịch vụ.' }
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
