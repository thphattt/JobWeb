'use client';

import { useEffect, useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Link } from '@/i18n/navigation';

type NavLink = { href: string; label: string };

export function MobileNav({
  links,
  menuLabel,
  closeLabel,
  hotline
}: {
  links: NavLink[];
  menuLabel: string;
  closeLabel: string;
  hotline: string;
}) {
  const [open, setOpen] = useState(false);

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

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={menuLabel}
        aria-expanded={open}
        className="flex size-9 items-center justify-center rounded-pill text-ink transition-colors hover:bg-paper-2"
      >
        <Menu className="size-5" aria-hidden />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label={closeLabel}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          />
          <div className="absolute right-0 top-0 flex h-full w-72 max-w-[80%] flex-col bg-paper p-6 shadow-xl">
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={closeLabel}
                className="flex size-9 items-center justify-center rounded-pill text-ink transition-colors hover:bg-paper-2"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <nav className="mt-4 flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-input px-3 py-3 text-base font-medium text-ink transition-colors hover:bg-paper-2"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <a
              href={`tel:${hotline.replace(/[.\s]/g, '')}`}
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-pill bg-brand-gradient px-5 py-3 text-sm font-semibold text-accent-ink"
            >
              <Phone className="size-4" aria-hidden />
              {hotline}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}