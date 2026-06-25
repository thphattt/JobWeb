import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { events } from '@/lib/events';
import { getProjects, type ProjectRole } from '@/lib/content';
import { Reveal } from './Reveal';

type Tile = { key: string; title: string; year: string; venue: string; image?: string };

/**
 * Lưới sự kiện tiêu biểu. `role` lọc theo vai trò (Đạo diễn / Nhà sản xuất),
 * `limit` giới hạn số card (vd 4 = một hàng). Không truyền `role` → hiện tất cả.
 */
export async function EventGallery({
  role,
  limit
}: {
  role?: ProjectRole;
  limit?: number;
} = {}) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('events');

  // Nguồn chính: CMS (Payload). Trống/lỗi → fallback messages (chỉ khi không lọc role).
  const docs = await getProjects(locale);
  let tiles: Tile[] = docs.length
    ? docs
        .filter((d) => (role ? d.role === role : true))
        .map((d) => ({
          key: String(d.id),
          title: d.title,
          year: d.year ?? '',
          venue: d.venue ?? '',
          image: d.image?.url ?? undefined
        }))
    : role
      ? []
      : events.map((ev) => ({
          key: ev.id,
          title: t(`items.${ev.id}.title`),
          year: t(`items.${ev.id}.year`),
          venue: t(`items.${ev.id}.venue`),
          image: ev.image
        }));

  if (limit) tiles = tiles.slice(0, limit);
  if (tiles.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {tiles.map((ev, i) => (
        <Reveal key={ev.key} index={i} className="hover:z-20">
          <article className="group relative aspect-4/3 overflow-hidden rounded-card border border-rule transition-transform duration-300 ease-out will-change-transform hover:scale-[1.5] hover:shadow-2xl hover:shadow-black/40 motion-reduce:transition-none motion-reduce:hover:scale-100">
            {/* Ảnh thật nếu có, ngược lại là ô gradient thương hiệu */}
            {ev.image ? (
              <Image
                src={ev.image}
                alt={ev.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105 group-hover:blur-[3px]"
              />
            ) : (
              <div
                className={`absolute inset-0 flex items-center justify-center transition duration-500 group-hover:blur-[3px] ${
                  i % 2 === 0 ? 'bg-brand-gradient' : 'bg-brand-gradient-rev'
                }`}
              >
                <span className="select-none font-display text-7xl font-black text-accent-ink/15">
                  {ev.year}
                </span>
              </div>
            )}

            {/* Lớp phủ tối giúp chữ dễ đọc, đậm thêm khi hover */}
            <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/25 to-ink/0 opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
            {/* Hover: tối thêm + làm nền mờ để chi tiết nổi bật */}
            <div className="absolute inset-0 bg-ink/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Năm */}
            {ev.year && (
              <span className="absolute left-4 top-4 rounded-pill bg-paper/90 px-2.5 py-1 text-xs font-bold text-ink">
                {ev.year}
              </span>
            )}

            {/* Tên luôn hiện; địa điểm/chi tiết trượt lên khi hover */}
            <div className="absolute inset-x-0 bottom-0 p-5">
              <h3 className="font-display text-lg font-bold leading-snug text-paper">
                {ev.title}
              </h3>
              <p className="max-h-0 overflow-hidden text-sm leading-relaxed text-paper/85 opacity-0 transition-all duration-300 group-hover:mt-2 group-hover:max-h-32 group-hover:opacity-100">
                {ev.venue}
              </p>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
