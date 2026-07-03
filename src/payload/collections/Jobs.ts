import type { CollectionConfig } from 'payload';
import { slugField } from '../fields/slug';

/** Tuyển dụng (trang /tuyen-dung + chi tiết). */
export const Jobs: CollectionConfig = {
  slug: 'jobs',
  labels: { singular: 'Vị trí tuyển dụng', plural: 'Tuyển dụng' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'location', 'deadline', 'published'],
    group: 'Nội dung'
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: 'Chức danh' },
    slugField('title'),
    { name: 'location', type: 'text', localized: true, label: 'Địa điểm' },
    {
      name: 'type',
      type: 'select',
      label: 'Hình thức',
      defaultValue: 'fulltime',
      options: [
        { label: 'Toàn thời gian', value: 'fulltime' },
        { label: 'Bán thời gian', value: 'parttime' },
        { label: 'Cộng tác viên', value: 'contract' }
      ]
    },
    {
      name: 'deadline',
      type: 'date',
      label: 'Hạn nộp hồ sơ',
      admin: { date: { pickerAppearance: 'dayOnly' } }
    },
    { name: 'summary', type: 'textarea', localized: true, label: 'Tóm tắt' },
    { name: 'description', type: 'richText', localized: true, label: 'Mô tả công việc' },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      label: 'Hiển thị trên website'
    }
  ]
};
