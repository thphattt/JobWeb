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
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
        {t('servicesPage.title')}
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-ink-2">
        {t('servicesPage.lead')}
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {services.map(({ key, Icon }) => (
          <article
            key={key}
            className="rounded-card border border-rule bg-paper p-8"
          >
            <div className="flex size-12 items-center justify-center rounded-card bg-brand-gradient text-accent-ink">
              <Icon className="size-6" aria-hidden />
            </div>
            <h2 className="mt-5 font-display text-xl font-bold text-ink">
              {t(`services.items.${key}.title`)}
            </h2>
            <p className="mt-2 text-ink-2">
              {t(`services.items.${key}.desc`)}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}