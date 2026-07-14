import type { CollectionConfig } from 'payload';

/** Người dùng quản trị (đăng nhập /admin). */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  labels: { singular: 'Tài khoản', plural: 'Tài khoản quản trị' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email'],
    group: 'Hệ thống',
    description: 'Tài khoản đăng nhập trang quản trị. Thêm tài khoản mới cho nhân sự tại đây.'
  },
  fields: [{ name: 'name', type: 'text', label: 'Tên hiển thị' }]
};
