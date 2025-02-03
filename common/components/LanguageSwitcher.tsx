'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageIcon from './ImageIcon';

interface LanguageSwitcherProps {
  className?: string
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
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