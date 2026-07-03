import type { CollectionConfig } from 'payload';

/** Dịch vụ (trang /dich-vu). */
export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Dịch vụ', plural: 'Dịch vụ' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'order'], group: 'Nội dung' },
  orderable: true,
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
      ]
    },
    { name: 'order', type: 'number', label: 'Thứ tự', defaultValue: 0 }
  ]
};
