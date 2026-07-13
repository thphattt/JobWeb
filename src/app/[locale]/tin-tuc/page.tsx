import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { languageAlternates } from '@/lib/site';
import type { Locale } from '@/i18n/routing';
import { getNewsPage } from '@/features/news/api';
import { NewsCard } from '@/features/news/components/NewsCard';

const PER_PAGE = 6;

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
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('news');
  const tn = await getTranslations('nav');

  const requested = Math.max(1, Number.parseInt(pageParam ?? '1', 10) || 1);
  const { docs: posts, page, totalPages } = await getNewsPage(
    locale as Locale,
    requested,
    PER_PAGE
  );

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
        <>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <NewsCard
                key={p.id}
                post={{
                  id: p.id,
                  title: p.title,
                  slug: p.slug,
                  date: p.date,
                  excerpt: p.excerpt,
                  coverImage: p.coverImage
                }}
                locale={locale}
                readMore={t('readMore')}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              className="mt-12 flex flex-wrap items-center justify-center gap-2"
              aria-label={t('title')}
            >
              <PageLink page={page - 1} disabled={page <= 1} label={tn('prev')} icon="prev" />
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={n === 1 ? '/tin-tuc' : `/tin-tuc?page=${n}`}
                  aria-current={n === page ? 'page' : undefined}
                  className={`inline-flex size-10 items-center justify-center border text-sm font-bold transition-colors ${
                    n === page
                      ? 'border-accent bg-accent text-accent-ink'
                      : 'border-night-rule bg-night-2 text-white/70 hover:border-accent hover:text-accent'
                  }`}
                >
                  {n}
                </Link>
              ))}
              <PageLink page={page + 1} disabled={page >= totalPages} label={tn('next')} icon="next" />
            </nav>
          )}
        </>
      ) : (
        <p className="mt-12 text-white/50">{t('empty')}</p>
      )}
    </div>
  );
}

/** Nút Trước/Sau; khi hết trang thì hiển thị mờ, không phải link. */
function PageLink({
  page,
  disabled,
  label,
  icon
}: {
  page: number;
  disabled: boolean;
  label: string;
  icon: 'prev' | 'next';
}) {
  const Icon = icon === 'prev' ? ArrowLeft : ArrowRight;
  const base =
    'inline-flex size-10 items-center justify-center border transition-colors';
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        aria-label={label}
        className={`${base} cursor-not-allowed border-night-rule text-white/20`}
      >
        <Icon className="size-4" aria-hidden />
      </span>
    );
  }
  return (
    <Link
      href={page === 1 ? '/tin-tuc' : `/tin-tuc?page=${page}`}
      aria-label={label}
      className={`${base} border-night-rule bg-night-2 text-white/70 hover:border-accent hover:text-accent`}
    >
      <Icon className="size-4" aria-hidden />
    </Link>
  );
}