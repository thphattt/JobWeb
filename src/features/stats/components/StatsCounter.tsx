'use client';

import { useEffect, useRef, useState } from 'react';
import type { StatItem } from '../types';

/** Khối số liệu với hiệu ứng đếm tăng khi cuộn vào tầm nhìn. */
export function StatsCounter({ items }: { items: StatItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActive(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
      {items.map((it, i) => (
        <div key={i}>
          <p className="font-display text-5xl font-black leading-none text-white sm:text-6xl">
            <Counter target={it.value} active={active} />
            {it.suffix && <span className="text-accent">{it.suffix}</span>}
          </p>
          <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-white/55">
            {it.label}
          </p>
        </div>
      ))}
    </div>
  );
}

function Counter({ target, active }: { target: number; active: boolean }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(target);
      return;
    }
    let raf = 0;
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setN(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);

  return <>{n}</>;
}
