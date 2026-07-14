import type { CollectionConfig } from 'payload';
import { slugField } from '../fields/slug';

/** Tin tức (trang /tin-tuc + chi tiết). */
export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'Bài viết', plural: 'Tin tức' },
  defaultSort: '-date',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'published'],
    group: 'Nội dung',
    description:
      'Các bài tin hiển thị ở trang chủ và trang Tin tức. Bài mới nhất tự lên đầu.'
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Tiêu đề'
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Ảnh bìa',
      admin: {
        description: 'Nên dùng ảnh ngang (tỉ lệ 16:9). Để trống sẽ hiện nền màu thương hiệu.'
      }
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      label: 'Tóm tắt',
      admin: { description: 'Vài dòng giới thiệu hiển thị trên thẻ tin và kết quả tìm kiếm.' }
    },
    { name: 'content', type: 'richText', localized: true, label: 'Nội dung' },
    slugField('title'),
    {
      name: 'date',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      label: 'Ngày đăng',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } }
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      label: 'Hiển thị trên website',
      admin: {
        position: 'sidebar',
        description: 'Bỏ chọn để tạm ẩn bài khỏi website mà không cần xoá.'
      }
    }
  ]
};
