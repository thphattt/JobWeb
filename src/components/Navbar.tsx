import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Phone } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileNav } from './MobileNav';

export function Navbar() {
  const t = useTranslations('nav');
  const tb = useTranslations('brand');
  const hotline = tb('hotline');

  const links = [
    { href: '/gioi-thieu', label: t('about') },
    { href: '/dich-vu', label: t('services') },
    { href: '/tin-tuc', label: t('news') },
    { href: '/lien-he', label: t('contact') }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-night-rule bg-night/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center"
          aria-label={tb('fullName')}
        >
          <Image
            src="/logo.png"
            alt={tb('fullName')}
            width={469}
            height={231}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l, i) => (
            <Link
              key={i}
              href={l.href}
              className="text-xs font-semibold uppercase tracking-wide text-white/70 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={`tel:${hotline.replace(/[.\s]/g, '')}`}
            className="hidden items-center gap-2 rounded-pill border border-night-rule bg-night-2 px-3 py-1.5 text-sm font-semibold text-white sm:inline-flex"
          >
            <Phone className="size-4 text-accent" aria-hidden />
            {hotline}
          </a>
          <LanguageSwitcher />
          <MobileNav
            links={links}
            title={tb('name')}
            menuLabel={t('menu')}
            closeLabel={t('close')}
            hotline={hotline}
          />
        </div>
      </div>
    </header>
  );
}
