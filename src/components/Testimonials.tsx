import Image from 'next/image';
import { Quote } from 'lucide-react';
import type { TestimonialDoc, ClientDoc } from '@/lib/content';

/** Lưới cảm nhận khách hàng + dải logo khách hàng/đối tác. */
export function Testimonials({
  items,
  clients,
  clientsTitle
}: {
  items: TestimonialDoc[];
  clients: ClientDoc[];
  clientsTitle: string;
}) {
  return (
    <div>
      {items.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((tm) => (
            <figure
              key={tm.id}
              className="flex h-full flex-col border border-night-rule bg-night-2 p-6"
            >
              <Quote className="size-7 text-accent" aria-hidden />
              <blockquote className="mt-4 flex-1 leading-relaxed text-white/75">
                “{tm.quote}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                {tm.photo?.url ? (
                  <Image
                    src={tm.photo.url}
                    alt={tm.photo.alt || tm.author}
                    width={44}
                    height={44}
                    className="size-11 rounded-pill object-cover"
                  />
                ) : (
                  <span className="flex size-11 items-center justify-center rounded-pill bg-brand-gradient font-display font-bold text-accent-ink">
                    {tm.author.trim().slice(0, 1).toUpperCase()}
                  </span>
                )}
                <span>
                  <span className="block font-display font-bold text-white">
                    {tm.author}
                  </span>
                  {tm.role && (
                    <span className="block text-xs text-white/55">{tm.role}</span>
                  )}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {clients.length > 0 && (
        <div className="mt-12">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/45">
            {clientsTitle}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-4">
            {clients.map((c) =>
              c.logo?.url ? (
                <Image
                  key={c.id}
                  src={c.logo.url}
                  alt={c.logo.alt || c.name}
                  width={140}
                  height={48}
                  className="h-10 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                />
              ) : (
                <span
                  key={c.id}
                  className="font-display text-lg font-bold text-white/40 transition-colors hover:text-white/80"
                >
                  {c.name}
                </span>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
