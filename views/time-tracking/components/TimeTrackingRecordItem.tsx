import { TimeTrackingRecordType, TimeTrackingType } from "@/types/time-tracking.type";
import { dateToString, formatMinutesToHourMinute, formatTimeToHourString } from "@/utils/helper.util";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

interface TimeTrackingRecordItemProps {
  record: TimeTrackingRecordType
  timeTracking: TimeTrackingType
  number: number,
  fields?: {
    day?: boolean,
    progressStatus?: boolean
  }
}

const TimeTrackingRecordItem: React.FC<TimeTrackingRecordItemProps> = ({ record, timeTracking, number, fields }) => {
  const t = useTranslations();
  return (
    <tr>
      <td className="fw-medium">{number}</td>
      {fields?.day && <td>{dateToString(new Date(record.start_at))}</td>}
      <td>
        <span className="badge bg-light text-dark border">
          {formatTimeToHourString(new Date(record.start_at))}
        </span>
      </td>
      <td>
        <span className="badge bg-light text-dark border">
          {record.end_at ? formatTimeToHourString(new Date(record.end_at)) : '--:--'}
        </span>
      </td>
      <td className="text-center fw-medium">
        {formatMinutesToHourMinute(record.total_minute)}
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
    </tr>
  )
}
export default TimeTrackingRecordItem;