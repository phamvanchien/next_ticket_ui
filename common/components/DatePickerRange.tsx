import React, { useEffect } from 'react';
import { ConfigProvider, DatePicker, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { getCookie } from '@/utils/cookie.util';
import viVN from 'antd/es/locale/vi_VN';
import enUS from 'antd/es/locale/en_US';
import jaJP from 'antd/es/locale/ja_JP';

interface DatePickerRangeProps {
  dateFrom: Date | null;
  dateTo: Date | null;
  setDateFrom: (dateFrom: Date | null) => void;
  setDateTo: (dateTo: Date | null) => void;
}

const DatePickerRange: React.FC<DatePickerRangeProps> = ({ dateFrom, dateTo, setDateFrom, setDateTo }) => {
  dayjs.extend(customParseFormat);
  const { RangePicker } = DatePicker;
  const dateFormat = 'YYYY/MM/DD';

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
      <Space direction="vertical" size={12}>
        <RangePicker
          value={[
            dateFrom ? dayjs(dateFrom) : undefined,
            dateTo ? dayjs(dateTo) : undefined
          ] as [Dayjs | undefined, Dayjs | undefined]}

          format={dateFormat}
          onChange={(dates) => {
            console.log("dates: ", dates);
            if (!dates) {
              setDateFrom(null);
              setDateTo(null);
            } else {
              setDateFrom(dates[0]?.toDate() || null);
              setDateTo(dates[1]?.toDate() || null);
            }
          }}

          getPopupContainer={(trigger) => {
            return trigger.closest('#wrapper') || document.body;
          }}

          allowClear
          popupStyle={{ zIndex: 1050 }} 
        />

      </Space>
    </ConfigProvider>
  );
};

export default DatePickerRange;