import type { CollectionConfig } from 'payload';
import { slugField } from '../fields/slug';

/** Tin tức (trang /tin-tuc + chi tiết). */
export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'Tin tức', plural: 'Tin tức' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'published'],
    group: 'Nội dung'
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: 'Tiêu đề' },
    slugField('title'),
    {
      name: 'date',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      label: 'Ngày đăng',
      admin: { date: { pickerAppearance: 'dayOnly' } }
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media', label: 'Ảnh bìa' },
    { name: 'excerpt', type: 'textarea', localized: true, label: 'Tóm tắt' },
    { name: 'content', type: 'richText', localized: true, label: 'Nội dung' },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      label: 'Hiển thị trên website'
    }
  ]
};
