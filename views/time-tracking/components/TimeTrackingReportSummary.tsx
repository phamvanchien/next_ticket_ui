import SkeletonLoading from "@/common/components/SkeletonLoading";
import { TimeTrackingReportType } from "@/types/time-tracking.type";
import { formatMinutesToHourMinute } from "@/utils/helper.util";
import { faClock, faUserClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React from "react";

interface TimeTrackingReportSummaryProps {
  reportsData?: TimeTrackingReportType
}

const TimeTrackingReportSummary: React.FC<TimeTrackingReportSummaryProps> = ({ reportsData }) => {
  const t = useTranslations();
  return (
    <div className="row mt-4 mb-4">
      <div className="col-md-3">
        <div className="card shadow-sm border-0 bg-success bg-opacity-10 card-report">
          <div className="card-body">
            {
              reportsData ? 
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">{t('time_tracking.summary.total_hour')}</h6>
                  <h3 className="mb-0">{reportsData ? formatMinutesToHourMinute(reportsData?.total.minute) : 0}</h3>
                </div>
                <div className="avatar-sm">
                  <div className="avatar-title bg-success rounded-circle">
                    <FontAwesomeIcon icon={faClock} className="text-white" />
                  </div>
                </div>
              </div> :
              <SkeletonLoading heigth={50} />
            }
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card shadow-sm border-0 bg-warning bg-opacity-10 card-report">
          <div className="card-body">
            {
              reportsData ?
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">{t('time_tracking.summary.total_missing_hour')}</h6>
                  <h3 className="mb-0">{reportsData ? formatMinutesToHourMinute(reportsData.total.minute_missing) : 0}</h3>
                </div>
                <div className="avatar-sm">
                  <div className="avatar-title bg-warning rounded-circle">
                    <FontAwesomeIcon icon={faUserClock} className="text-white" />
                  </div>
                </div>
              </div> :
              <SkeletonLoading heigth={50} />
            }
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card shadow-sm border-0 bg-danger bg-opacity-10 card-report">
          <div className="card-body">
            {
              reportsData ?
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">{t('time_tracking.summary.go_late')}</h6>
                  <h3 className="mb-0">{reportsData?.total.late}</h3>
                </div>
                <div className="avatar-sm">
                  <div className="avatar-title bg-danger rounded-circle">
                    <FontAwesomeIcon icon={faClock} className="text-white" />
                  </div>
                </div>
              </div> :
              <SkeletonLoading heigth={50} />
            }
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card shadow-sm border-0 bg-danger bg-opacity-10 card-report">
          <div className="card-body">
            {
              reportsData ?
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">{t('time_tracking.summary.out_soon')}</h6>
                  <h3 className="mb-0">{reportsData?.total.out_soon}</h3>
                </div>
                <div className="avatar-sm">
                  <div className="avatar-title bg-danger rounded-circle">
                    <FontAwesomeIcon icon={faClock} className="text-white" />
                  </div>
                </div>
              </div> :
              <SkeletonLoading heigth={50} />
            }
          </div>
        </div>
      </div>
    </div>
  )
}
export default TimeTrackingReportSummary;