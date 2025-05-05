import { formatRelativeTime } from "@/utils/helper.util";
import { faHistory } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

interface RelativeTimeProps {
  className?: string
  time: string
  icon?: boolean
}

const RelativeTime: React.FC<RelativeTimeProps> = ({ time, icon, className }) => {
  const t = useTranslations();
  const [timeText, setTimeText] = useState<string | number>('');
  useEffect(() => {
    const formatTime = formatRelativeTime(time);
    const formatTimeType = formatTime.type;
    const formatTimeNumber = formatTime.number;
    if (formatTimeType === 's') {
      setTimeText(formatTimeNumber + ' ' + t('tasks_page.history.sec_label'));
      return;
    }
    if (formatTimeType === 'm') {
      setTimeText(formatTimeNumber + ' ' +t ('tasks_page.history.minute_label'));
      return;
    }
    if (formatTimeType === 'h') {
      setTimeText(formatTimeNumber + ' ' + t('tasks_page.history.hour_label'));
      return;
    }
    if (formatTimeType === 'd') {
      setTimeText(formatTimeNumber + ' ' + t('tasks_page.history.day_label'));
      return;
    }
    setTimeText(formatTimeNumber);
  }, [t]);
  return (
    <span className={`${className} text-secondary`}>
      {icon && <FontAwesomeIcon icon={faHistory} style={{ marginRight: 5 }} />}
      {timeText}
    </span>
  )
}
export default RelativeTime;