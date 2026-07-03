import type { CollectionConfig } from 'payload';

/** Dự án / Sự kiện tiêu biểu (2 vai trò: đạo diễn / nhà sản xuất). */
export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Dự án', plural: 'Dự án tiêu biểu' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'year', 'order'], group: 'Nội dung' },
  orderable: true,
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: 'Tên chương trình' },
    {
      name: 'role',
      type: 'select',
      label: 'Vai trò',
      defaultValue: 'director',
      options: [
        { label: 'Đạo diễn (thành viên Tân Châu Thành)', value: 'director' },
        { label: 'Nhà sản xuất (Công ty Tân Châu Thành)', value: 'producer' }
      ]
    },
    { name: 'year', type: 'text', label: 'Năm' },
    { name: 'venue', type: 'text', localized: true, label: 'Địa điểm / mô tả ngắn' },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Ảnh (tuỳ chọn)' },
    { name: 'order', type: 'number', label: 'Thứ tự', defaultValue: 0 }
  ]
};
