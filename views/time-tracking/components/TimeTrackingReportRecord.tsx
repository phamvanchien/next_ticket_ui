import { TimeTrackingReportType, TimeTrackingType } from "@/types/time-tracking.type";
import { useTranslations } from "next-intl";
import React from "react";
import TimeTrackingReportDay from "./TimeTrackingReportDay";
import TimeTrackingReportItem from "./TimeTrackingReportItem";
import LoadingGif from "@/common/components/LoadingGif";

interface TimeTrackingReportRecordProps {
  reportsData?: TimeTrackingReportType
  timeTracking: TimeTrackingType
}

const TimeTrackingReportRecord: React.FC<TimeTrackingReportRecordProps> = ({ reportsData, timeTracking }) => {
  const t = useTranslations();
  return (
    <div className="card-body p-0">
      <div className="table-responsive">
        <table className="table table-report table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="ps-4">{t('time_tracking.date_label')}</th>
              <th className="text-center">{t('time_tracking.start_label')}</th>
              <th className="text-center">{t('time_tracking.end_label')}</th>
              <th className="text-center">{t('time_tracking.total_time_label')}</th>
              <th className="text-center">{t('time_tracking.status_label')}</th>
              <th className="pe-4 text-center">#</th>
            </tr>
          </thead>
          <tbody>
            {
              reportsData ? reportsData?.items.map((dayRecord, index) => 
                <React.Fragment key={index}>
                  <TimeTrackingReportDay dayRecord={dayRecord} timeTrackingId={timeTracking.id} workspaceId={timeTracking.workspace_id} />
                  {dayRecord.records.map((record, recordIndex) => (
                    <TimeTrackingReportItem key={`${index}-${recordIndex}`} recordIndex={recordIndex + 1} record={record} />
                  ))}
                </React.Fragment>
              ) : 
              <tr>
                <td colSpan={6} className="text-center">
                  <LoadingGif width={70} height={70} />
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default TimeTrackingReportRecord;