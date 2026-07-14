import type { CollectionConfig } from 'payload';
import { slugField } from '../fields/slug';

/** Tuyển dụng (trang /tuyen-dung + chi tiết). */
export const Jobs: CollectionConfig = {
  slug: 'jobs',
  labels: { singular: 'Vị trí tuyển dụng', plural: 'Tuyển dụng' },
  defaultSort: '-createdAt',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'location', 'deadline', 'published'],
    group: 'Nội dung',
    description: 'Các vị trí đang tuyển, hiển thị ở trang Tuyển dụng.'
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: 'Chức danh' },
    { name: 'location', type: 'text', localized: true, label: 'Địa điểm làm việc' },
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
      name: 'summary',
      type: 'textarea',
      localized: true,
      label: 'Tóm tắt',
      admin: { description: 'Vài dòng mô tả ngắn hiển thị ở danh sách tuyển dụng.' }
    },
    { name: 'description', type: 'richText', localized: true, label: 'Mô tả công việc' },
    slugField('title'),
    {
      name: 'deadline',
      type: 'date',
      label: 'Hạn nộp hồ sơ',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } }
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      label: 'Hiển thị trên website',
      admin: {
        position: 'sidebar',
        description: 'Bỏ chọn để tạm ẩn vị trí này (vd đã tuyển xong) mà không cần xoá.'
      }
    }
  ]
};
