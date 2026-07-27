import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { languageAlternates } from '@/lib/site';
import type { Locale } from '@/i18n/routing';
import { getGalleryImages } from '@/features/gallery/api';
import DomeGallery from '@/features/gallery/components/DomeGallery';

const NIGHT = 'oklch(16% 0.006 60)';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const path = '/thu-vien';
  return {
    title: t('gallery.title'),
    description: t('gallery.description'),
    alternates: {
      canonical: `/${locale}${path}`,
      languages: languageAlternates(path)
    },
    openGraph: {
      title: t('gallery.title'),
      description: t('gallery.description'),
      url: `/${locale}${path}`
    }
  };
}

export default async function GalleryPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('galleryPage');

  const docs = await getGalleryImages(locale as Locale);
  const images = docs
    .map((d) => ({ src: d.image?.url ?? '', alt: d.caption || d.image?.alt || '' }))
    .filter((i) => i.src);

  return (
    <div className="bg-night text-white">
      <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
          {t('eyebrow')}
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-white/60">{t('lead')}</p>
      </div>

      {images.length ? (
        <div className="relative mt-10 h-[75vh] min-h-130 w-full">
          <DomeGallery
            images={images}
            grayscale={false}
            overlayBlurColor={NIGHT}
            fit={0.6}
            segments={22}
            imageBorderRadius="18px"
            openedImageBorderRadius="18px"
            openedImageWidth=""
            openedImageHeight=""
          />
        </div>
      ) : (
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
          <p className="text-white/50">{t('empty')}</p>
        </div>
      )}
    </div>
  );
}
