import Link from "next/link";
import { useRouter } from "next/router";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

const LanguageSwitcher = () => {
  const router = useRouter();
  const { locales, locale: activeLocale } = router;
  const otherLocales = locales.filter((locale) => locale !== activeLocale);

  return (
    <div>
      <ul>
        {otherLocales.map((locale) => {
          const { pathname, query, asPath } = router;
          return (
            <li key={locale}>
              <Link href={{ pathname, query }} as={asPath} locale={locale}>
                <a className="text-4xl">
                  {getUnicodeFlagIcon(locale.slice(-2))}
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
