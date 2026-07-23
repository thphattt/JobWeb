import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowUpRight, MapPin, Clock, CalendarDays } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { languageAlternates } from '@/lib/site';
import type { Locale } from '@/i18n/routing';
import { getJobs } from '@/features/careers/api';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const path = '/tuyen-dung';
  return {
    title: t('careers.title'),
    description: t('careers.description'),
    alternates: {
      canonical: `/${locale}${path}`,
      languages: languageAlternates(path)
    },
    openGraph: {
      title: t('careers.title'),
      description: t('careers.description'),
      url: `/${locale}${path}`
    }
  };
}

function formatDate(date: string | undefined, locale: string): string {
  if (!date) return '';
  try {
    return new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  } catch {
    return '';
  }
}

export default async function CareersPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('careers');
  const jobs = await getJobs(locale as Locale);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-accent">
        <span className="h-px w-8 bg-accent" aria-hidden />
        {t('eyebrow')}
      </p>
      <h1 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">
        {t('title')}
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-white/60">{t('lead')}</p>

      {jobs.length ? (
        <div className="mt-12 space-y-4">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/tuyen-dung/${job.slug}`}
              className="group flex flex-col gap-4 border border-night-rule bg-night-2 p-6 transition-colors hover:border-accent sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h2 className="font-display text-xl font-bold text-white transition-colors group-hover:text-accent">
                  {job.title}
                </h2>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/55">
                  {job.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-4 text-accent" aria-hidden />
                      {job.location}
                    </span>
                  )}
                  {job.type && (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-4 text-accent" aria-hidden />
                      {t(`types.${job.type}`)}
                    </span>
                  )}
                  {job.deadline && (
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="size-4 text-accent" aria-hidden />
                      {t('deadline')}: {formatDate(job.deadline, locale)}
                    </span>
                  )}
                </div>
                {job.summary && (
                  <p className="mt-3 max-w-2xl text-sm text-white/55">{job.summary}</p>
                )}
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-accent transition-all group-hover:gap-2.5">
                {t('viewDetail')}
                <ArrowUpRight className="size-4" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-12 text-white/50">{t('empty')}</p>
      )}
    </div>
  );
}
