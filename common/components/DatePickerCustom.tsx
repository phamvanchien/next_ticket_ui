import React, { useEffect, useState } from 'react';
import type { DatePickerProps } from 'antd';
import { DatePicker, Space, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import 'dayjs/locale/en';
import 'dayjs/locale/ja';
import viVN from 'antd/es/locale/vi_VN';
import enUS from 'antd/es/locale/en_US';
import jaJP from 'antd/es/locale/ja_JP';
import { getCookie } from '@/utils/cookie.util';

interface DatePickerCustomProps {
  setDueDate: (dueDate: Date | null) => void;
  dueDate: Date | null;
  placeholder?: string;
  className?: string;
}

const DatePickerCustom: React.FC<DatePickerCustomProps> = ({ setDueDate, dueDate, placeholder, className }) => {
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    setDueDate(date ? date.toDate() : null);
  };

  const localeFromCookie = getCookie('locale') || 'en';

  const localeMap: Record<string, any> = {
    vi: viVN,
    en: enUS,
    ja: jaJP,
  };

  useEffect(() => {
    dayjs.locale(localeFromCookie);
  }, [localeFromCookie]);

  return (
    <ConfigProvider locale={localeMap[localeFromCookie] || enUS}>
      <Space direction="vertical">
        <DatePicker
          format="YYYY-MM-DD"
          onChange={onChange}
          value={dueDate ? dayjs(dueDate) : undefined}
          getPopupContainer={(trigger) => trigger.parentElement || document.body}
          placeholder={placeholder}
          className={className}
        />
      </Space>
    </ConfigProvider>
  );
};

export default DatePickerCustom;