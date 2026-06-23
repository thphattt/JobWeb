import Image from 'next/image';
import type { CollaboratorDoc } from '@/lib/content';

/** Lưới "Gương mặt hợp tác tiêu biểu" — ảnh chân dung + tên + vai trò.
 *  Chưa có ảnh thì hiển thị ô gradient + chữ cái đầu. */
export function CollaboratorGrid({ items }: { items: CollaboratorDoc[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((c) => {
        const initial = c.name?.trim().slice(0, 1).toUpperCase() || '?';
        const photo = c.photo?.url;
        return (
          <figure
            key={c.id}
            className="group relative aspect-3/4 overflow-hidden rounded-card border border-night-rule bg-night-2"
          >
            {photo ? (
              <Image
                src={photo}
                alt={c.photo?.alt || c.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-brand-gradient">
                <span className="select-none font-display text-5xl font-black text-accent-ink/25">
                  {initial}
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/20 to-ink/0" />

            <figcaption className="absolute inset-x-0 bottom-0 p-4">
              <p className="font-display text-sm font-bold leading-tight text-paper">
                {c.name}
              </p>
              {c.role && (
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-accent">
                  {c.role}
                </p>
              )}
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
