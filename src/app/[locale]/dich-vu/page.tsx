import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Clapperboard, CalendarCheck, Users, Speaker } from 'lucide-react';
import { languageAlternates } from '@/lib/site';

const services = [
  { key: 'direction', Icon: Clapperboard },
  { key: 'production', Icon: CalendarCheck },
  { key: 'talent', Icon: Users },
  { key: 'equipment', Icon: Speaker }
] as const;

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const path = '/dich-vu';
  return {
    title: t('services.title'),
    description: t('services.description'),
    alternates: {
      canonical: `/${locale}${path}`,
      languages: languageAlternates(path)
    },
    openGraph: {
      title: t('services.title'),
      description: t('services.description'),
      url: `/${locale}${path}`
    }
  };
}

export default async function ServicesPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-accent">
        <span className="h-px w-8 bg-accent" aria-hidden />
        {t('servicesPage.eyebrow')}
      </p>
      <h1 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">
        {t('servicesPage.title')}
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-white/60">
        {t('servicesPage.lead')}
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {services.map(({ key, Icon }) => (
          <article
            key={key}
            className="group relative flex flex-col border border-night-rule bg-night-2 p-8 pb-10 transition-colors hover:border-accent"
          >
            <span className="flex size-14 items-center justify-center bg-brand-gradient text-accent-ink">
              <Icon className="size-7" aria-hidden />
            </span>
            <h2 className="mt-6 font-display text-xl font-bold uppercase leading-tight text-white">
              {t(`services.items.${key}.title`)}
            </h2>
            <p className="mt-2 text-white/55">
              {t(`services.items.${key}.desc`)}
            </p>
            <span
              className="absolute inset-x-0 bottom-0 h-1 scale-x-0 bg-brand-gradient transition-transform duration-300 group-hover:scale-x-100"
              aria-hidden
            />
          </article>
        ))}
      </div>
    </div>
  );
}