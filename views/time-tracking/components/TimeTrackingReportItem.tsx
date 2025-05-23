import { TimeTrackingRecordType } from "@/types/time-tracking.type";
import { formatTimeToHourString } from "@/utils/helper.util";
import { useTranslations } from "next-intl";
import React from "react";

interface TimeTrackingReportItemProps {
  recordIndex: number
  record: TimeTrackingRecordType
}

const TimeTrackingReportItem: React.FC<TimeTrackingReportItemProps> = ({ record, recordIndex }) => {
  const t = useTranslations();
  const recordMinutes = record.total_minute || 0;
  const recordHours = Math.floor(recordMinutes / 60);
  const recordMins = recordMinutes % 60;
  const recordFormattedTime = `${recordHours}h${recordMins > 0 ? `${recordMins}m` : ''}`;
  return (
    <tr className="record-row">
      <td className="ps-5">
        <small className="text-muted">{t('time_tracking.record_label')} {recordIndex}</small>
      </td>
      <td className="text-center">
        <span className="badge bg-light text-dark border">{formatTimeToHourString(new Date(record.start_at))}</span>
      </td>
      <td className="text-center">
        <span className="badge bg-light text-dark border">{record.end_at ? formatTimeToHourString(new Date(record.end_at)) : '--:--'}</span>
      </td>
      <td className="text-center">
        {recordFormattedTime}
      </td>
      <td className="text-center">
        {
          record.status === 0 &&
          <span className={`badge rounded-pill bg-danger bg-opacity-10 text-danger`}>
            {t('time_tracking.record_status.not_completed')}
          </span>
        }
        {
          record.status === 1 &&
          <span className={`badge rounded-pill bg-success bg-opacity-10 text-success`}>
            {t('time_tracking.record_status.completed')}
          </span>
        }
        {
          record.status === 2 &&
          <span className={`badge rounded-pill bg-warning bg-opacity-10 text-warning`}>
            {t('time_tracking.record_status.in_progress')}
          </span>
        }
      </td>
      <td className="pe-4 text-center">

      </td>
    </tr>
  )
}
export default TimeTrackingReportItem;