import { notFound } from 'next/navigation';

// Bắt mọi route không khớp dưới một ngôn ngữ -> trang 404 đã bản địa hoá.
export default function CatchAllPage() {
  notFound();
}
