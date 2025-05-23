import SkeletonLoading from "@/common/components/SkeletonLoading";
import { TimeTrackingType } from "@/types/time-tracking.type";
import { formatMinutesToHourMinute } from "@/utils/helper.util";
import { faClock, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React from "react";

interface TimeTrackingInfoProps {
  timeTracking: TimeTrackingType,
  loading: boolean
}

const TimeTrackingInfo: React.FC<TimeTrackingInfoProps> = ({ timeTracking, loading }) => {
  const t = useTranslations();
  return (
    <div className="col-12 col-md-4 col-lg-3">
      <div className="card shadow-sm border-0 rounded-4 h-100">
        <div className="card-header bg-white border-0 py-3">
          <h5 className="mb-0 fw-semibold">
            {t("time_tracking.time_sheet_label")}
          </h5>
        </div>
        <div className="card-body">
          {
            loading ?
            <SkeletonLoading heigth={200} /> :
            <ul className="list-group list-group-flush time-sheet-list">
              <li className="list-group-item d-flex justify-content-between align-items-center border-0 py-2">
                <span className="text-muted">
                  <FontAwesomeIcon icon={faPlay} className="text-success me-2" />
                  {t("time_tracking.start_at_label")}
                </span>
                <span className="fw-medium">{timeTracking.time.start_at}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center border-0 py-2">
                <span className="text-muted">
                  <FontAwesomeIcon icon={faStop} className="text-danger me-2" />
                  {t("time_tracking.end_at_label")}
                </span>
                <span className="fw-medium">{timeTracking.time.end_at}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center border-0 py-2">
                <span className="text-muted">
                  <span className="emoji me-2">🍽️</span>
                  {t("time_tracking.start_rest_at_label")}
                </span>
                <span className="fw-medium">{timeTracking.rest_time.start_rest_at}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center border-0 py-2">
                <span className="text-muted">
                  <span className="emoji me-2">☕</span>
                  {t("time_tracking.end_rest_at_label")}
                </span>
                <span className="fw-medium">{timeTracking.rest_time.end_rest_at}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center border-0 py-2">
                <span className="text-muted">
                  <FontAwesomeIcon icon={faClock} className="text-primary me-2" />
                  Total Required
                </span>
                <span className="fw-medium text-primary">
                  {formatMinutesToHourMinute(timeTracking.time.total_minute - timeTracking.rest_time.total_minute)}
                </span>
              </li>
            </ul>
          }
        </div>
      </div>
    </div>
  )
}
export default TimeTrackingInfo;