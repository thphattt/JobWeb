import 'server-only';
import { getPayload } from 'payload';
import config from '@payload-config';

/** Ảnh đã populate từ Payload (upload field, depth ≥ 1). */
export type MediaRef = { url?: string; alt?: string } | null;

let cached: ReturnType<typeof getPayload> | null = null;

/** Instance Payload (Local API) dùng chung, khởi tạo một lần. */
export function payloadClient() {
  return (cached ??= getPayload({ config }));
}

/**
 * Bọc một truy vấn CMS: lỗi/không có dữ liệu → trả `fallback` (null/[]),
 * để trang tự fallback về messages thay vì vỡ khi DB gián đoạn.
 */
export async function safe<T>(
  label: string,
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error(`[content] ${label} failed:`, err);
    return fallback;
  }
}
