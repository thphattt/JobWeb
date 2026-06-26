'use client';

import { useRef } from 'react';
import Image from 'next/image';

/** Logo hero nghiêng 3D theo con trỏ (parallax tilt), trả về thẳng khi rời chuột. */
export function HeroLogo({ alt }: { alt: string }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const MAX = 14; // độ nghiêng tối đa (deg)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = innerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${px * MAX}deg) rotateX(${-py * MAX}deg)`;
  };

  const reset = () => {
    const el = innerRef.current;
    if (el) el.style.transform = 'rotateY(0deg) rotateX(0deg)';
  };

  return (
    <div
      className="hero-logo perspective-midrange mx-auto mb-14 w-fit"
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      <div ref={innerRef} className="hero-logo-tilt relative inline-block">
        <Image
          src="/logo.png"
          alt={alt}
          width={469}
          height={231}
          priority
          className="block h-28 w-auto sm:h-36 lg:h-44"
        />
        <span className="hero-logo-sheen" aria-hidden />
      </div>
    </div>
  );
}
