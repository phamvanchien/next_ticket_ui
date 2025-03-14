'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageIcon from './ImageIcon';
import Dropdown from '../dropdown/Dropdown';
import DropdownItem from '../dropdown/DropdownItem';
import { useTranslations } from 'next-intl';

interface LanguageSwitcherProps {
  className?: string
  dropdown?: boolean
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className, dropdown }) => {
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

  if (dropdown) {
    return (
      <Dropdown color='default' title="Language" className="float-left">
        <DropdownItem className="pointer" onClick={() => changeLanguage("vi")}>
          <img width={30} height={20} src="/img/icon/vi.png" className={`mr-2 ${locale === 'vi' ? 'lang-select' : ''}`} /> Viet Nam
        </DropdownItem>
        <DropdownItem className="pointer" onClick={() => changeLanguage("en")}>
          <img width={30} height={20} src="/img/icon/en.png" className={`mr-2 ${locale === 'en' ? 'lang-select' : ''}`} /> England
        </DropdownItem>
        <DropdownItem className="pointer" onClick={() => changeLanguage("ja")}>
          <img width={30} height={20} src="/img/icon/ja.png" className={`mr-2 ${locale === 'ja' ? 'lang-select' : ''}`} /> Japan
        </DropdownItem>
      </Dropdown>
    )
  }

  return (
    <div className={`row ${className ?? ''}`}>
      <div className="col-12 text-center">
        <img width={30} height={20} src="/img/icon/vi.png" className={`mr-2 ${locale === 'vi' ? 'lang-select' : ''}`} onClick={() => changeLanguage("vi")} />
        <img width={30} height={20} src="/img/icon/en.png" className={`mr-2 ${locale === 'en' ? 'lang-select' : ''}`} onClick={() => changeLanguage("en")} />
        <img width={30} height={20} src="/img/icon/ja.png" className={locale === 'ja' ? 'lang-select' : ''} onClick={() => changeLanguage("ja")} />
      </div>
    </div>
  );
}
export default LanguageSwitcher;