import type { CollectionConfig } from 'payload';

/** Dự án / Sự kiện tiêu biểu (2 vai trò: đạo diễn / nhà sản xuất). */
export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Dự án', plural: 'Dự án tiêu biểu' },
  defaultSort: 'order',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'role', 'year', 'order'],
    group: 'Nội dung',
    description:
      'Sự kiện tiêu biểu hiển thị ở trang chủ, chia theo vai trò Đạo diễn / Nhà sản xuất.'
  },
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
      ],
      admin: { description: 'Quyết định chương trình xuất hiện ở mục nào trên trang chủ.' }
    },
    { name: 'year', type: 'text', label: 'Năm', admin: { width: '50%' } },
    { name: 'venue', type: 'text', localized: true, label: 'Địa điểm / mô tả ngắn' },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Ảnh',
      admin: { description: 'Ảnh ngang (4:3). Để trống sẽ hiện nền màu thương hiệu kèm năm.' }
    },
    {
      name: 'order',
      type: 'number',
      label: 'Thứ tự',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        step: 1,
        description: 'Số nhỏ hiển thị trước (1, 2, 3…). Dùng để sắp xếp thứ tự các card.'
      }
    }
  ]
};
