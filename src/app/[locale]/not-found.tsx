import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-32 text-center">
      <p className="font-display text-7xl font-extrabold text-accent">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink">
        {t('title')}
      </h1>
      <p className="mt-3 text-ink-2">{t('body')}</p>
      <Link
        href="/"
        className="mt-8 rounded-pill bg-accent px-6 py-3 text-sm font-semibold text-accent-ink"
      >
        {t('cta')}
      </Link>
    </section>
  );
}
