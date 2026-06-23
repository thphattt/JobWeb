'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type HeroSlide = {
  value: string;
  label: string;
  /** Ảnh thật (tuỳ chọn): thả vào public/hero/ rồi điền '/hero/xxx.jpg'. */
  image?: string;
};

export function HeroCarousel({
  slides,
  prevLabel,
  nextLabel
}: {
  slides: HeroSlide[];
  prevLabel: string;
  nextLabel: string;
}) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = slides.length;

  const go = (d: number) => setI((p) => (p + d + n) % n);

  // Tự chạy 5s, dừng khi hover/focus hoặc bật giảm chuyển động.
  useEffect(() => {
    if (paused || n <= 1) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setI((p) => (p + 1) % n), 5000);
    return () => clearInterval(id);
  }, [paused, n]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="absolute -inset-3 border border-white/10" aria-hidden />

      {/* Khung slide (vuông góc) */}
      <div className="relative aspect-4/5 overflow-hidden">
        {slides.map((s, idx) => (
          <div
            key={idx}
            aria-hidden={idx !== i}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              idx === i ? 'opacity-100' : 'pointer-events-none opacity-0'
            } ${idx % 2 === 0 ? 'bg-brand-gradient' : 'bg-brand-gradient-rev'}`}
          >
            {s.image && (
              <Image
                src={s.image}
                alt={s.label}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 flex flex-col justify-end bg-night/10 p-8">
              <p className="font-display text-7xl font-black leading-none text-white">
                {s.value}
              </p>
              <p className="mt-3 max-w-60 font-display text-lg font-bold uppercase tracking-wide text-white">
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Điều khiển: phân trang 01–0n + nút mũi tên */}
      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-end gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`${idx + 1}`}
              aria-current={idx === i}
              className="flex flex-col items-center gap-1.5"
            >
              <span
                className={`font-display text-lg font-bold leading-none ${
                  idx === i ? 'text-accent' : 'text-white/45'
                }`}
              >
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span
                className={`h-0.5 w-6 ${idx === i ? 'bg-accent' : 'bg-white/20'}`}
                aria-hidden
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={prevLabel}
            className="flex size-11 items-center justify-center border-2 border-white/25 text-white transition-colors hover:border-accent hover:text-accent"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={nextLabel}
            className="flex size-11 items-center justify-center bg-brand-gradient text-accent-ink transition-transform hover:-translate-y-0.5"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
