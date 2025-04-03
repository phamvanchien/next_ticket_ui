import { MenuProps } from "antd";
import Dropdown from "./Dropdown";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { locales } from "@/next-intl-config";

const LanguageDropdown = () => {
  const t = useTranslations();
  const router = useRouter();
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    const savedLocale = document.cookie.replace(/(?:(?:^|.*;\s*)locale\s*\=\s*([^;]*).*$)|^.*$/, '$1');
    if (savedLocale) setLocale(savedLocale);
  }, []);

  const changeLanguage = (newLocale: string) => {
    document.cookie = `locale=${newLocale}; path=/`;
    setLocale(newLocale);
    router.refresh();
  };
  const items: MenuProps["items"] = locales.map(lang => {
    return {
      key: lang,
      label: (
        <div onClick={() => changeLanguage(lang)}>
          <img width={30} height={20} src={`/images/icons/${lang}.png`} style={{ marginRight: 5 }} className="float-left" /> 
          <span className="d-none d-lg-block float-left">
            {lang === 'vi' && t('country.vietnam')}
            {lang === 'en' && t('country.england')}
            {lang === 'ja' && t('country.japan')}
          </span>
        </div>
      )
    }
  })
  return (
    <Dropdown items={items}>
      <img width={30} height={20} src={`/images/icons/${locale}.png`} style={{ marginRight: 5, float: 'left' }} /> 
      <span className="d-none d-lg-block" style={{ float: 'left' }}>
        {locale === 'vi' && t('country.vietnam')}
        {locale === 'en' && t('country.england')}
        {locale === 'ja' && t('country.japan')}
      </span>
    </Dropdown>
  )
}
export default LanguageDropdown;