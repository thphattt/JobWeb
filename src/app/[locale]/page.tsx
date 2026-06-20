import {
  ArrowRight,
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
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <p className="font-script text-3xl text-accent sm:text-4xl">
            {t('hero.eyebrow')}
          </p>
          <h1
            className="mt-3 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl"
            style={{ overflowWrap: 'anywhere' }}
          >
            {t('hero.title')}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-2">
            {t('hero.subtitle')}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
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
        </div>
      </section>

      {/* ABOUT */}
      <section className="border-t border-rule">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="font-script text-2xl text-accent">
              {t('about.eyebrow')}
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              {t('about.title')}
            </h2>
          </div>
          <div className="flex flex-col items-start justify-center">
            <p className="text-lg text-ink-2">{t('about.body')}</p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 font-semibold text-accent hover:underline"
            >
              {t('about.cta')}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="border-t border-rule bg-paper-2">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="font-script text-2xl text-accent">
            {t('services.eyebrow')}
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {t('services.title')}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ key, Icon }) => (
              <div
                key={key}
                className="rounded-card border border-rule bg-paper p-7 transition-colors hover:border-accent/50"
              >
                <Icon className="size-7 text-accent" aria-hidden />
                <h3 className="mt-5 font-display text-lg font-bold text-ink">
                  {t(`services.items.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-ink-2">
                  {t(`services.items.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="border-t border-rule">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-card bg-ink px-8 py-14 text-center sm:px-16">
            <p className="font-script text-2xl text-clay">
              {t('contact.eyebrow')}
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-paper sm:text-4xl">
              {t('contact.title')}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-paper/70">
              {t('contact.subtitle')}
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 rounded-pill bg-accent px-7 py-3.5 text-sm font-semibold text-accent-ink transition-transform hover:-translate-y-0.5"
            >
              {t('contact.cta')}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
