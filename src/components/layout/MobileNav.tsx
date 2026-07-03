'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, Phone } from 'lucide-react';
import { Link } from '@/i18n/navigation';

type NavLink = { href: string; label: string };

export function MobileNav({
  links,
  title,
  menuLabel,
  closeLabel,
  hotline
}: {
  links: NavLink[];
  title: string;
  menuLabel: string;
  closeLabel: string;
  hotline: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Portal chỉ chạy phía client.
  useEffect(() => setMounted(true), []);

  // Khóa scroll nền + đóng bằng phím Esc khi drawer mở.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  // Drawer luôn nằm trong DOM (để animate cả lúc đóng), portal ra <body>
  // để không bị neo bởi backdrop-filter của header. `inert` khi đóng.
  const drawer = (
    <div
      className="fixed inset-0 z-100 md:hidden"
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      inert={!open}
    >
      {/* Lớp nền mờ dần */}
      <button
        type="button"
        aria-label={closeLabel}
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Panel trượt từ phải */}
      <div
        className={`absolute right-0 top-0 flex h-full w-72 max-w-[80%] flex-col overflow-y-auto border-l border-night-rule bg-night p-6 shadow-xl transition-transform duration-300 ease-out motion-reduce:transition-none ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-base font-bold text-white">
            {title}
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={closeLabel}
            className="-mr-1 flex size-9 items-center justify-center rounded-pill text-white transition-colors hover:bg-white/10"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <nav className="mt-6 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-input px-3 py-3 text-base font-medium text-white transition-colors hover:bg-white/10"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <a
          href={`tel:${hotline.replace(/[.\s]/g, '')}`}
          onClick={() => setOpen(false)}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-pill bg-brand-gradient px-5 py-3 text-sm font-semibold text-accent-ink"
        >
          <Phone className="size-4" aria-hidden />
          {hotline}
        </a>
      </div>
    </div>
  );

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={menuLabel}
        aria-expanded={open}
        className="flex size-9 items-center justify-center rounded-pill text-white transition-colors hover:bg-white/10"
      >
        <Menu className="size-5" aria-hidden />
      </button>

      {mounted && createPortal(drawer, document.body)}
    </div>
  );
}
