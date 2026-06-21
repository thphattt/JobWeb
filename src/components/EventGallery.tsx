import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { events } from '@/lib/events';

export async function EventGallery() {
  const t = await getTranslations('events');

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((ev, i) => {
        const title = t(`items.${ev.id}.title`);
        const year = t(`items.${ev.id}.year`);
        const venue = t(`items.${ev.id}.venue`);

        return (
          <article
            key={ev.id}
            className="group relative aspect-[4/3] overflow-hidden rounded-card border border-rule"
          >
            {/* Ảnh thật nếu có, ngược lại là ô gradient thương hiệu */}
            {ev.image ? (
              <Image
                src={ev.image}
                alt={title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div
                className={`absolute inset-0 flex items-center justify-center ${
                  i % 2 === 0 ? 'bg-brand-gradient' : 'bg-brand-gradient-rev'
                }`}
              >
                <span className="select-none font-display text-7xl font-black text-accent-ink/15">
                  {year}
                </span>
              </div>
            )}

            {/* Lớp phủ tối giúp chữ dễ đọc, đậm thêm khi hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-ink/0 opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Năm */}
            {year && (
              <span className="absolute left-4 top-4 rounded-pill bg-paper/90 px-2.5 py-1 text-xs font-bold text-ink">
                {year}
              </span>
            )}

            {/* Tên luôn hiện; địa điểm/chi tiết trượt lên khi hover */}
            <div className="absolute inset-x-0 bottom-0 p-5">
              <h3 className="font-display text-lg font-bold leading-snug text-paper">
                {title}
              </h3>
              <p className="max-h-0 overflow-hidden text-sm leading-relaxed text-paper/85 opacity-0 transition-all duration-300 group-hover:mt-2 group-hover:max-h-32 group-hover:opacity-100">
                {venue}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}