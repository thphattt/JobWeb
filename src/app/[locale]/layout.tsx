import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Be_Vietnam_Pro } from 'next/font/google';
import { routing, type Locale } from '@/i18n/routing';
import { siteUrl, languageAlternates } from '@/lib/site';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import '@/styles/globals.css';

const sans = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap'
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const tb = await getTranslations({ locale, namespace: 'brand' });
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t('title'),
      template: `%s · ${tb('name')}`
    },
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages: languageAlternates('')
    },
    openGraph: {
      type: 'website',
      siteName: tb('fullName'),
      title: t('title'),
      description: t('description'),
      url: `/${locale}`,
      locale: locale === 'vi' ? 'vi_VN' : 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description')
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className={sans.variable}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
