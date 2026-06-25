import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { languageAlternates } from '@/lib/site';
import type { Locale } from '@/i18n/routing';
import { getNews } from '@/lib/content';
import { NewsCarousel } from '@/components/NewsCarousel';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const path = '/tin-tuc';
  return {
    title: t('news.title'),
    description: t('news.description'),
    alternates: {
      canonical: `/${locale}${path}`,
      languages: languageAlternates(path)
    },
    openGraph: {
      title: t('news.title'),
      description: t('news.description'),
      url: `/${locale}${path}`
    }
  };
}

export default async function NewsListPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('news');
  const tn = await getTranslations('nav');
  const posts = await getNews(locale as Locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-accent">
        <span className="h-px w-8 bg-accent" aria-hidden />
        {t('eyebrow')}
      </p>
      <h1 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">
        {t('title')}
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-white/60">{t('lead')}</p>

      {posts.length ? (
        <div className="mt-12">
          <NewsCarousel
            posts={posts.map((p) => ({
              id: p.id,
              title: p.title,
              slug: p.slug,
              date: p.date,
              excerpt: p.excerpt,
              coverImage: p.coverImage
            }))}
            locale={locale}
            readMore={t('readMore')}
            prevLabel={tn('prev')}
            nextLabel={tn('next')}
          />
        </div>
      ) : (
        <p className="mt-12 text-white/50">{t('empty')}</p>
      )}
    </div>
  );
}
