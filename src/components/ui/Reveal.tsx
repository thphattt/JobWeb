'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Hiện nội dung khi cuộn vào tầm nhìn bằng "fade-up" tiết chế —
 * khớp Motion stance trong design.md (DNA nguyenle.com.vn): trồi lên +
 * hiện dần, dùng easing giảm tốc cubic-bezier(0.16, 1, 0.3, 1), không
 * scale/blur, chỉ transition transform + opacity. `index` tạo độ trễ so le.
 * Tôn trọng prefers-reduced-motion.
 */
export function Reveal({
  index = 0,
  className = '',
  children
}: {
  index?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Giảm chuyển động: hiện ngay, bỏ animate.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          // Bật/tắt theo tầm nhìn → cuộn ra rồi cuộn vào lại vẫn chạy hiệu ứng.
          setShown(e.isIntersecting);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: shown ? `${index * 90}ms` : '0ms' }}
      className={`transition-[transform,opacity] duration-700 ease-out will-change-transform motion-reduce:transition-none ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-7 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
}
