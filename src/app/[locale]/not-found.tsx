import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-32 text-center">
      <p className="font-display text-7xl font-extrabold text-accent">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold uppercase text-white">
        {t('title')}
      </h1>
      <p className="mt-3 text-white/60">{t('body')}</p>
      <Link
        href="/"
        className="mt-8 bg-brand-gradient px-8 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-accent-ink"
      >
        {t('cta')}
      </Link>
    </section>
  );
}
