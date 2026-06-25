/* Hallmark · redesign → Colorbond-style Dark Industrial · genre: editorial
 * theme: dark night + orange/gradient accent · big solid square + UPPERCASE heads
 * pre-emit critique: P5 H4 E5 S4 R5 V5
 * Nội dung: đọc từ Payload CMS (fallback messages) — xem src/lib/content.ts
 */
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { EventGallery } from '@/components/EventGallery';
import { HeroCarousel, type HeroSlide } from '@/components/HeroCarousel';
import { Reveal } from '@/components/Reveal';
import { CollaboratorGrid } from '@/components/CollaboratorGrid';
import { NewsCard } from '@/components/NewsCard';
import { getHero, getAbout, getCollaborators, getNews } from '@/lib/content';

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
  const [hero, about, collaborators, news] = await Promise.all([
    getHero(locale as Locale),
    getAbout(locale as Locale),
    getCollaborators(locale as Locale),
    getNews(locale as Locale, 3)
  ]);

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
        <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-8 sm:px-6 lg:grid-cols-2 lg:items-start lg:gap-16 lg:px-8 lg:pb-28 lg:pt-12">
          <div>
            <Image
              src="/logo.png"
              alt={t('brand.fullName')}
              width={469}
              height={231}
              priority
              className="mx-auto mb-14 block h-28 w-auto sm:h-36 lg:h-44"
            />
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
            <div className="mt-14 flex flex-wrap items-center gap-3">
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

          {/* Mục 1 — vai trò Đạo diễn */}
          <div className="mt-12">
            <h3 className="flex items-center gap-3 font-display text-xl font-bold uppercase text-white">
              <span className="size-5 shrink-0 bg-brand-gradient" aria-hidden />
              {t('events.directorTitle')}
            </h3>
            <p className="mt-2 max-w-2xl text-sm text-white/55">
              {t('events.directorLead')}
            </p>
            <div className="mt-6">
              <EventGallery role="director" limit={4} />
            </div>
          </div>

          {/* Mục 2 — vai trò Nhà sản xuất */}
          <div className="mt-14">
            <h3 className="flex items-center gap-3 font-display text-xl font-bold uppercase text-white">
              <span className="size-5 shrink-0 bg-brand-gradient" aria-hidden />
              {t('events.producerTitle')}
            </h3>
            <p className="mt-2 max-w-2xl text-sm text-white/55">
              {t('events.producerLead')}
            </p>
            <div className="mt-6">
              <EventGallery role="producer" limit={4} />
            </div>
          </div>
        </Reveal>
      </section>

      {/* GIỚI THIỆU — dải sáng (tông tương phản) */}
      <section className="border-t border-rule bg-paper text-ink">
        <Reveal className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <SectionHead
            eyebrow={about?.eyebrow ?? t('about.eyebrow')}
            title={about?.title ?? t('about.title')}
          />
          <div>
            <p className="text-lg text-ink-2">
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
