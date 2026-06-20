import { useTranslations } from "next-intl";
import { Facebook, Youtube, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const tb = useTranslations("brand");
  const year = new Date().getFullYear();

  // Placeholder — thay bằng địa chỉ thật của khách.
  const offices = [
    { city: "Hà Nội", addr: "123 Đường ABC, Quận X, Hà Nội" },
    { city: "Đà Nẵng", addr: "456 Đường DEF, Quận Y, Đà Nẵng" },
    { city: "TP. Hồ Chí Minh", addr: "789 Đường GHI, Quận Z, TP.HCM" },
  ];

  const links = [
    tn("about"),
    tn("services"),
    tn("projects"),
    tn("news"),
    tn("careers"),
    tn("contact"),
  ];

  return (
    <footer className="mt-24 border-t border-rule bg-paper-2">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <div className="font-display text-xl font-extrabold text-ink">
            {tb("name")}
          </div>
          <p className="mt-3 max-w-xs text-sm text-ink-2">{t("tagline")}</p>
          <div className="mt-5 flex gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="flex size-9 items-center justify-center rounded-pill border border-rule text-ink-2 transition-colors hover:border-accent hover:text-accent"
            >
              <Facebook className="size-4" aria-hidden />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="flex size-9 items-center justify-center rounded-pill border border-rule text-ink-2 transition-colors hover:border-accent hover:text-accent"
            >
              <Youtube className="size-4" aria-hidden />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">
            {t("offices")}
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-ink-2">
            {offices.map((o) => (
              <li key={o.city} className="flex gap-2">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-accent"
                  aria-hidden
                />
                <span>
                  <span className="font-medium text-ink">{o.city}</span>
                  <br />
                  {o.addr}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">
            {t("quickLinks")}
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {links.map((l, i) => (
              <li key={i}>
                <Link
                  href="/"
                  className="text-ink-2 transition-colors hover:text-ink"
                >
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-rule">
        <div className="mx-auto max-w-7xl px-4 py-5 text-xs text-ink-2 sm:px-6 lg:px-8">
          {t("rights", { year })}
        </div>
      </div>
    </footer>
  );
}
