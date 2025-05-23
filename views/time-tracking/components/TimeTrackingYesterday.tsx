import { getWorkingTimeRecords } from "@/api/time-tracking.api";
import { API_CODE } from "@/enums/api.enum";
import { BaseResponseType } from "@/types/base.type";
import { TimeTrackingRecordType, TimeTrackingType } from "@/types/time-tracking.type";
import { dateToString, displayMessage, formatMinutesToHourMinute, formatTimeToHourString } from "@/utils/helper.util";
import { faClock, faHistory } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import TimeTrackingRecordItem from "./TimeTrackingRecordItem";
import SkeletonLoading from "@/common/components/SkeletonLoading";
import Link from "next/link";

interface TimeTrackingYesterdayProps {
  timeTracking: TimeTrackingType
  tracking: boolean
}

const TimeTrackingYesterday: React.FC<TimeTrackingYesterdayProps> = ({ timeTracking, tracking }) => {
  const t = useTranslations();
  const [workingRecords, setWorkingRecords] = useState<TimeTrackingRecordType[]>();
  const [loading, setLoading] = useState(true);
  const loadWorkingTimeRecords = async () => {
    try {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const yesterdayAt = new Date(yesterday);
      yesterdayAt.setHours(0, 0, 0, 0);
      const yesterdayEnd = new Date(yesterday);
      yesterdayEnd.setHours(23, 59, 59, 999);

      const response = await getWorkingTimeRecords(timeTracking.workspace_id, {
        start_at: yesterdayAt,
        end_at: yesterdayEnd
      });
      setLoading(false);
      if (response && response.code === API_CODE.OK) {
        setWorkingRecords(response.data);
        return;
      }
      displayMessage("error", response.error?.message);
    } catch (error) {
      setLoading(false);
      displayMessage("error", (error as BaseResponseType).error?.message);
    }
  };
  useEffect(() => {
    loadWorkingTimeRecords();
  }, [tracking]);
  return (
    <div className="col-12 col-md-8 col-lg-9">
      <div className="card shadow-sm border-0 rounded-4 h-100">
        <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-semibold">
            <FontAwesomeIcon icon={faHistory} className="text-primary me-2" />
            {t('time_tracking.yesterday_label')}
          </h5>
          <Link href={`/workspace/${timeTracking.workspace_id}/time-tracking/report`} className="link pointer">
            <FontAwesomeIcon icon={faHistory} className="me-2" />
            {t('time_tracking.report_monthly_label')}
          </Link>
        </div>
        <div className={`card-body p-${loading ? '10' : '0'}`}>
          {
            loading && <SkeletonLoading heigth={150} />
          }
          {
            (!loading && workingRecords) && <>
              {
                workingRecords.length > 0 ?
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="text-muted text-uppercase small">#</th>
                        <th className="text-muted text-uppercase small">{t('time_tracking.date_label')}</th>
                        <th className="text-muted text-uppercase small">{t("time_tracking.start_at_label")}</th>
                        <th className="text-muted text-uppercase small">{t("time_tracking.end_at_label")}</th>
                        <th className="text-muted text-uppercase small text-center">{t("time_tracking.total_time_label")}</th>
                        <th className="text-muted text-uppercase small text-center">{t('time_tracking.status_label')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        workingRecords.map((working, index) => (
                          <TimeTrackingRecordItem 
                            timeTracking={timeTracking} 
                            record={working} 
                            number={index + 1} 
                            key={index} 
                            fields={{day: true, progressStatus: true}}
                          /> 
                        ))
                      }
                    </tbody>
                  </table>
                </div> :
                <div className="text-center py-5">
                  <FontAwesomeIcon icon={faHistory} className="text-muted mb-3" size="2x" />
                  <p className="text-muted">{t("time_tracking.no_history_records")}</p>
                </div>
              }
            </>
          }
        </div>
      </div>
    </div>
  )
}
export default TimeTrackingYesterday;