/* Hallmark · redesign → Colorbond-style Dark Industrial · genre: editorial
 * theme: dark night + orange/gradient accent · big solid square + UPPERCASE heads
 * pre-emit critique: P5 H4 E5 S4 R5 V5
 * Nội dung: đọc từ Payload CMS (fallback messages) — xem src/lib/content.ts
 */
import {
  ArrowRight,
  ArrowUpRight,
  Clapperboard,
  CalendarCheck,
  Users,
  Speaker,
  PackageCheck,
  Award,
  Wrench,
  CalendarClock,
  type LucideIcon
} from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { EventGallery } from '@/components/EventGallery';
import { HeroCarousel, type HeroSlide } from '@/components/HeroCarousel';
import { Reveal } from '@/components/Reveal';
import { CollaboratorGrid } from '@/components/CollaboratorGrid';
import { NewsCard } from '@/components/NewsCard';
import {
  getHero,
  getAbout,
  getWhy,
  getServices,
  getCollaborators,
  getNews
} from '@/lib/content';

const services = [
  { key: 'direction', Icon: Clapperboard },
  { key: 'production', Icon: CalendarCheck },
  { key: 'talent', Icon: Users },
  { key: 'equipment', Icon: Speaker }
] as const;

const strengths = [
  { key: 'turnkey', Icon: PackageCheck },
  { key: 'team', Icon: Award },
  { key: 'equipment', Icon: Wrench },
  { key: 'since', Icon: CalendarClock }
] as const;

/** Ánh xạ giá trị `icon` (select trong CMS) → icon lucide cho thẻ dịch vụ. */
const serviceIcons: Record<string, LucideIcon> = {
  clapperboard: Clapperboard,
  layers: CalendarCheck,
  users: Users,
  speaker: Speaker
};

const btnPrimary =
  'inline-flex items-center gap-2 bg-brand-gradient px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] text-accent-ink transition-transform hover:-translate-y-0.5';

/** Tiêu đề mục kiểu Colorbond: ô vuông gradient lớn + tiêu đề IN HOA. */
function SectionHead({
  eyebrow,
  title,
  dark = false
}: {
  eyebrow: string;
  title: string;
  dark?: boolean;
}) {
  return (
    <div className="flex items-center gap-5">
      <span
        className="size-16 shrink-0 bg-brand-gradient sm:size-24 lg:size-28"
        aria-hidden
      />
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          {eyebrow}
        </p>
        <h2
          className={`mt-1 font-display text-3xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl ${
            dark ? 'text-white' : 'text-ink'
          }`}
        >
          {title}
        </h2>
      </div>
    </div>
  );
}

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  // Nội dung từ CMS (song song), fallback messages nếu trống/lỗi.
  const [hero, about, why, svcDocs, collaborators, news] = await Promise.all([
    getHero(locale as Locale),
    getAbout(locale as Locale),
    getWhy(locale as Locale),
    getServices(locale as Locale),
    getCollaborators(locale as Locale),
    getNews(locale as Locale, 3)
  ]);

  const serviceCards = svcDocs.length
    ? svcDocs.map((d) => ({
        key: String(d.id),
        Icon: serviceIcons[d.icon ?? ''] ?? Clapperboard,
        title: d.title,
        desc: d.description ?? ''
      }))
    : services.map(({ key, Icon }) => ({
        key,
        Icon,
        title: t(`services.items.${key}.title`),
        desc: t(`services.items.${key}.desc`)
      }));

  const whyItems = why?.items?.length;
  const whyCards = whyItems
    ? why!.items!.map((it, idx) => ({
        key: String(idx),
        Icon: strengths[idx]?.Icon ?? PackageCheck,
        title: it.title ?? '',
        desc: it.description ?? ''
      }))
    : strengths.map(({ key, Icon }) => ({
        key,
        Icon,
        title: t(`why.items.${key}.title`),
        desc: t(`why.items.${key}.desc`)
      }));

  // Slide hero: số liệu + sự kiện tiêu biểu (thêm `image` để dùng ảnh thật).
  const heroSlides: HeroSlide[] = [
    { value: t('stats.a.value'), label: t('stats.a.label') },
    { value: t('stats.b.value'), label: t('stats.b.label') },
    {
      value: t('events.items.seaGames22.year'),
      label: t('events.items.seaGames22.title')
    },
    {
      value: t('events.items.thangLong1000.year'),
      label: t('events.items.thangLong1000.title')
    }
  ];

  return (
    <>
      {/* HERO — nền tối, khối gradient bên phải */}
      <section className="relative overflow-hidden bg-night text-white">
        <div
          className="pointer-events-none absolute -right-40 -top-40 size-112 bg-brand-gradient opacity-20 blur-3xl"
          aria-hidden
        />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-28">
          <div>
            <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-accent">
              <span className="h-px w-8 bg-accent" aria-hidden />
              {hero?.eyebrow ?? t('hero.eyebrow')}
            </p>
            <h1 className="mt-5 font-display text-4xl font-extrabold uppercase leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
              {hero?.title ?? t('hero.title')}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/60">
              {hero?.subtitle ?? t('hero.subtitle')}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/lien-he" className={btnPrimary}>
                {hero?.ctaPrimary ?? t('hero.ctaPrimary')}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href="/dich-vu"
                className="inline-flex items-center gap-2 border-2 border-white/25 px-8 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white transition-colors hover:border-white/70"
              >
                {hero?.ctaSecondary ?? t('hero.ctaSecondary')}
              </Link>
            </div>
          </div>

          {/* Carousel hero — thay panel 2018 tĩnh */}
          <HeroCarousel
            slides={heroSlides}
            prevLabel={t('nav.prev')}
            nextLabel={t('nav.next')}
          />
        </div>
      </section>

      {/* DỰ ÁN TIÊU BIỂU — gallery (tối), đưa lên trước Giới thiệu */}
      <section className="border-t border-night-rule bg-night text-white">
        <Reveal className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow={t('events.eyebrow')}
            title={t('events.title')}
            dark
          />
          <p className="mt-6 max-w-2xl text-white/55">{t('events.lead')}</p>
          <div className="mt-10">
            <EventGallery />
          </div>
        </Reveal>
      </section>

      {/* GIỚI THIỆU — dải tối phụ */}
      <section className="border-t border-night-rule bg-night-2 text-white">
        <Reveal className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <SectionHead
            eyebrow={about?.eyebrow ?? t('about.eyebrow')}
            title={about?.title ?? t('about.title')}
            dark
          />
          <div>
            <p className="text-lg text-white/65">
              {about?.body ?? t('about.body')}
            </p>
            <Link
              href="/gioi-thieu"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-accent transition-all hover:gap-3"
            >
              {t('about.cta')}
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* DỊCH VỤ — dải sáng (nhịp tương phản), đưa lên trước Vì sao chọn */}
      <section className="bg-paper text-ink">
        <Reveal className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow={t('services.eyebrow')}
            title={t('services.title')}
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCards.map(({ key, Icon, title, desc }) => (
              <article
                key={key}
                className="group relative flex flex-col border border-rule bg-paper p-8 pb-10 transition-colors hover:border-accent"
              >
                <span className="flex size-14 items-center justify-center bg-brand-gradient">
                  <Icon className="size-7 text-white" aria-hidden />
                </span>
                <h3 className="mt-6 font-display text-lg font-bold uppercase leading-tight text-ink">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-ink-2">{desc}</p>
                <span
                  className="absolute inset-x-0 bottom-0 h-1 scale-x-0 bg-brand-gradient transition-transform duration-300 group-hover:scale-x-100"
                  aria-hidden
                />
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      {/* VÌ SAO CHỌN — 4 thẻ tối, viền dưới gradient */}
      <section className="border-t border-night-rule bg-night text-white">
        <Reveal className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow={why?.eyebrow ?? t('why.eyebrow')}
            title={why?.title ?? t('why.title')}
            dark
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyCards.map(({ key, Icon, title, desc }) => (
              <div key={key} className="relative flex flex-col bg-night-2 p-8 pb-10">
                <Icon className="size-10 text-accent" aria-hidden />
                <h3 className="mt-6 font-display text-xl font-bold uppercase leading-tight">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{desc}</p>
                <span
                  className="absolute inset-x-0 bottom-0 h-1 bg-brand-gradient"
                  aria-hidden
                />
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* GƯƠNG MẶT HỢP TÁC TIÊU BIỂU — chỉ hiện khi CMS có dữ liệu */}
      {collaborators.length > 0 && (
        <section className="border-t border-night-rule bg-night-2 text-white">
          <Reveal className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <SectionHead
              eyebrow={t('collaborators.eyebrow')}
              title={t('collaborators.title')}
              dark
            />
            <p className="mt-6 max-w-2xl text-white/55">
              {t('collaborators.lead')}
            </p>
            <div className="mt-10">
              <CollaboratorGrid items={collaborators} />
            </div>
          </Reveal>
        </section>
      )}

      {/* TIN TỨC MỚI NHẤT — chỉ hiện khi có bài đã xuất bản */}
      {news.length > 0 && (
        <section className="border-t border-night-rule bg-night text-white">
          <Reveal className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHead
                eyebrow={t('news.eyebrow')}
                title={t('news.title')}
                dark
              />
              <Link
                href="/tin-tuc"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-accent transition-all hover:gap-3"
              >
                {t('news.viewAll')}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((post) => (
                <NewsCard
                  key={post.id}
                  post={post}
                  locale={locale}
                  readMore={t('news.readMore')}
                />
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* CTA LIÊN HỆ — panel gradient (tối) */}
      <section className="bg-night">
        <Reveal className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-brand-gradient px-8 py-16 text-center sm:px-16">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
              {t('contact.eyebrow')}
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl">
              {t('contact.title')}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-white/85">
              {t('contact.subtitle')}
            </p>
            <Link
              href="/lien-he"
              className="mt-8 inline-flex items-center gap-2 bg-night px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] text-white transition-transform hover:-translate-y-0.5"
            >
              {t('contact.cta')}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
