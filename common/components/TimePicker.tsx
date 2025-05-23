import React, { useEffect } from 'react';
import { ConfigProvider, DatePickerProps, TimePicker as TimePickerAnt } from 'antd';
import dayjs from 'dayjs';
import viVN from 'antd/es/locale/vi_VN';
import enUS from 'antd/es/locale/en_US';
import jaJP from 'antd/es/locale/ja_JP';
import { getCookie } from '@/utils/cookie.util';

const format = 'HH:mm';

interface TimePickerProps {
  setTime: (time: Date | null) => void;
  time: Date | null;
  className?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({ time, className, setTime }) => {
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    setTime(date ? date.toDate() : null);
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
      <TimePickerAnt className={className} value={time ? dayjs(time) : undefined} format={format} onChange={onChange} />
    </ConfigProvider>
  )
}
export default TimePicker;