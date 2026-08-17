'use server';

import { headers } from 'next/headers';
import { z } from 'zod';

export type ContactState = {
  status: 'idle' | 'success' | 'error';
  fields?: string[];
};

const schema = z.object({
  name: z.string().trim().min(2),
  contact: z.string().trim().min(5),
  message: z.string().trim().min(10)
});

// ── Chống spam: rate-limit theo IP (in-memory) ────────────────────────────
// Đủ dùng cho 1 tiến trình (VPS). Trên serverless nhiều instance sẽ nới lỏng
// hơn nhưng vẫn có tác dụng, và không phụ thuộc thư viện ngoài.
const RATE_LIMIT = 3; // số lần gửi tối đa
const RATE_WINDOW_MS = 10 * 60 * 1000; // trong 10 phút
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  // Dọn bớt bộ nhớ khi map phình to.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > RATE_LIMIT;
}

async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get('x-forwarded-for');
  return (fwd ? fwd.split(',')[0].trim() : h.get('x-real-ip')) || 'unknown';
}

// Ô "contact" cho phép nhập email HOẶC số điện thoại. Nếu là email thì đặt làm
// Reply-To để bấm "Trả lời" trong hộp thư là trả lời thẳng khách.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Honeypot: trường ẩn "company" — người thật không thấy nên để trống.
  // Bot điền vào → coi như thành công (không gửi email, không lộ là bị chặn).
  if (String(formData.get('company') ?? '').trim() !== '') {
    return { status: 'success' };
  }

  const parsed = schema.safeParse({
    name: formData.get('name'),
    contact: formData.get('contact'),
    message: formData.get('message')
  });

  if (!parsed.success) {
    const fields = [
      ...new Set(parsed.error.issues.map((i) => String(i.path[0])))
    ];
    return { status: 'error', fields };
  }

  // Giới hạn tần suất theo IP (chống spam làm ngập hộp thư / cạn quota Resend).
  if (rateLimited(await clientIp())) {
    return { status: 'error' };
  }

  const data = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;
  // Hỗ trợ nhiều người nhận: CONTACT_TO_EMAIL="a@x.com, b@y.com"
  const to = (process.env.CONTACT_TO_EMAIL ?? 'tanchauthanhhn@gmail.com')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (!apiKey) {
    // Thiếu key: ở production đây là LỖI THẬT (tin nhắn khách sẽ mất) nên phải
    // báo lỗi ra form, không được báo thành công giả. Ở local thì cho qua.
    console.error(
      '[contact] THIẾU RESEND_API_KEY — KHÔNG gửi được email. Nội dung bị mất:',
      data
    );
    return process.env.NODE_ENV === 'production'
      ? { status: 'error' }
      : { status: 'success' };
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    // QUAN TRỌNG: SDK Resend KHÔNG throw khi API trả lỗi (403/422/429…).
    // Nó trả về { data, error } — phải kiểm tra `error`, nếu không lỗi sẽ bị
    // nuốt mất và form vẫn báo "gửi thành công" dù email không hề được gửi.
    const { data: sent, error } = await resend.emails.send({
      from:
        process.env.CONTACT_FROM_EMAIL ??
        'Tân Châu Thành <onboarding@resend.dev>',
      to,
      replyTo: EMAIL_RE.test(data.contact) ? data.contact : undefined,
      subject: `Liên hệ mới từ ${data.name}`,
      text: `Tên: ${data.name}\nLiên hệ: ${data.contact}\n\nNội dung:\n${data.message}`
    });

    if (error) {
      console.error(
        `[contact] Resend TỪ CHỐI gửi → to=${to.join(', ')} | ${error.name}: ${error.message}`
      );
      console.error('[contact] Nội dung không gửi được:', data);
      return { status: 'error' };
    }

    console.log(`[contact] Đã gửi email id=${sent?.id} → ${to.join(', ')}`);
  } catch (err) {
    // Chỉ còn lỗi mạng / cấu hình SDK mới rơi vào đây.
    console.error('[contact] Lỗi khi gọi Resend:', err);
    console.error('[contact] Nội dung không gửi được:', data);
    return { status: 'error' };
  }

  return { status: 'success' };
}
