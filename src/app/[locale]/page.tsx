/* Hallmark · redesign → Bento Grid · genre: editorial
 * theme: studied-DNA (design.md locked) · brand preserved: paper/accent/fonts/CTA voice
 * pre-emit critique: P5 H4 E5 S4 R5 V5
 */
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  PenTool,
  Megaphone,
  Cpu
} from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

const services = [
  { key: 'events', Icon: CalendarDays },
  { key: 'design', Icon: PenTool },
  { key: 'media', Icon: Megaphone },
  { key: 'tech', Icon: Cpu }
] as const;

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {/* BENTO — hero + số liệu + giới thiệu */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {/* Hero (ô lớn) */}
        <article className="rounded-card border border-rule bg-paper p-8 sm:col-span-2 sm:p-10 lg:col-span-4 lg:row-span-2 lg:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
            {t('hero.eyebrow')}
          </p>
          <h1
            className="mt-3 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl"
            style={{ overflowWrap: 'anywhere', minWidth: 0 }}
          >
            {t('hero.title')}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-2">
            {t('hero.subtitle')}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-pill bg-accent px-7 py-3.5 text-sm font-semibold text-accent-ink transition-transform hover:-translate-y-0.5"
            >
              {t('hero.ctaPrimary')}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-pill border border-ink/15 px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink/40"
            >
              {t('hero.ctaSecondary')}
            </Link>
          </div>
        </article>

        {/* Số liệu A — nền cam */}
        <article className="flex flex-col justify-between rounded-card bg-accent p-8 text-accent-ink lg:col-span-2">
          <p className="font-display text-6xl font-extrabold leading-none">
            {t('stats.a.value')}
          </p>
          <div className="mt-6">
            <p className="font-display text-lg font-bold">
              {t('stats.a.label')}
            </p>
            <p className="mt-1 text-sm text-accent-ink/70">{t('stats.note')}</p>
          </div>
        </article>

        {/* Số liệu B — nền paper-2 */}
        <article className="flex flex-col justify-between rounded-card border border-rule bg-paper-2 p-8 lg:col-span-2">
          <p className="font-display text-6xl font-extrabold leading-none text-ink">
            {t('stats.b.value')}
          </p>
          <div className="mt-6">
            <p className="font-display text-lg font-bold text-ink">
              {t('stats.b.label')}
            </p>
            <p className="mt-1 text-sm text-ink-2">{t('stats.note')}</p>
          </div>
        </article>

        {/* Giới thiệu — dải tối full-width */}
        <article className="rounded-card bg-ink p-8 sm:col-span-2 lg:col-span-6 lg:p-12">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-clay">
                {t('about.eyebrow')}
              </p>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-paper sm:text-4xl">
                {t('about.title')}
              </h2>
            </div>
            <div>
              <p className="text-lg text-paper/70">{t('about.body')}</p>
              <Link
                href="/"
                className="mt-5 inline-flex items-center gap-2 font-semibold text-accent hover:underline"
              >
                {t('about.cta')}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </article>
      </section>

      {/* DỊCH VỤ — lưới thẻ */}
      <section className="mt-10">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
          {t('services.eyebrow')}
        </p>
        <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {t('services.title')}
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ key, Icon }) => (
            <article
              key={key}
              className="group flex flex-col rounded-card border border-rule bg-paper p-7 transition-colors hover:border-accent"
            >
              <Icon className="size-7 text-accent" aria-hidden />
              <h3 className="mt-5 font-display text-lg font-bold text-ink">
                {t(`services.items.${key}.title`)}
              </h3>
              <p className="mt-2 text-sm text-ink-2">
                {t(`services.items.${key}.desc`)}
              </p>
              <ArrowUpRight
                className="mt-6 size-5 text-ink-2 transition-colors group-hover:text-accent"
                aria-hidden
              />
            </article>
          ))}
        </div>
      </section>

      {/* CTA Liên hệ — thẻ sáng */}
      <section className="mt-10">
        <article className="rounded-card border border-rule bg-paper-2 px-8 py-12 text-center sm:px-16 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
            {t('contact.eyebrow')}
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {t('contact.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-ink-2">
            {t('contact.subtitle')}
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-pill bg-accent px-7 py-3.5 text-sm font-semibold text-accent-ink transition-transform hover:-translate-y-0.5"
          >
            {t('contact.cta')}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </article>
      </section>
    </div>
  );
}
