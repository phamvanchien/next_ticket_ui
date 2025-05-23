"use client";

import { endWorking, getWorkingTimeRecord, startWorking } from "@/api/time-tracking.api";
import Button from "@/common/components/Button";
import { API_CODE } from "@/enums/api.enum";
import { BaseResponseType } from "@/types/base.type";
import { TimeTrackingRecordType, TimeTrackingType } from "@/types/time-tracking.type";
import { displayMessage } from "@/utils/helper.util";
import { faClock, faInfoCircle, faPlay, faStop, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import TimeTrackingToday from "./components/TimeTrackingToday";
import TimeTrackingYesterday from "./components/TimeTrackingYesterday";
import TimeTrackingInfo from "./components/TimeTrackingInfo";
import SkeletonLoading from "@/common/components/SkeletonLoading";
import { useAppDispatch } from "@/reduxs/store.redux";
import { setSidebarSelected } from "@/reduxs/menu.redux";

interface TimeTrackingViewProps {
  timeTracking: TimeTrackingType;
}

const TimeTrackingView: React.FC<TimeTrackingViewProps> = ({ timeTracking }) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [secondsWorking, setSecondWorking] = useState(new Date().getSeconds());
  const [tracking, setTracking] = useState(false);
  const [startWorkingLoading, setStartWorkingLoading] = useState(false);
  const [endWorkingLoading, setEndWorkingLoading] = useState(false);
  const [workingRecord, setWorkingRecord] = useState<TimeTrackingRecordType>();
  const [error, setError] = useState<string>();
  const [progressText, setProgressText] = useState(t('time_tracking.progress_status.start'));
  const [loadingRecord, setLoadingRecord] = useState(true);

  const handleStartWorking = async () => {
    try {
      setError(undefined);
      setStartWorkingLoading(true);
      const response = await startWorking(timeTracking.workspace_id);
      setStartWorkingLoading(false);
      if (response && response.code === API_CODE.OK) {
        const now = new Date();
        setHour(now.getHours());
        setMinute(now.getMinutes());
        setSecondWorking(now.getSeconds());
        setTracking(true);
        setProgressText(t('time_tracking.progress_status.in_progress'));
        return;
      }
      setError(response.error?.message);
    } catch (error) {
      setStartWorkingLoading(false);
      setError((error as BaseResponseType).error?.message);
    }
  };

  const handleEndWorking = async () => {
    try {
      setError(undefined);
      setEndWorkingLoading(true);
      const response = await endWorking(timeTracking.workspace_id);
      setEndWorkingLoading(false);
      if (response && response.code === API_CODE.OK) {
        const now = new Date();
        setHour(now.getHours());
        setMinute(0);
        setSeconds(0);
        setTracking(false);
        setProgressText(t('time_tracking.progress_status.end'));
        return;
      }
      setError(response.error?.message);
    } catch (error) {
      setEndWorkingLoading(false);
      setError((error as BaseResponseType).error?.message);
    }
  };

  const loadWorkingTimeRecord = async () => {
    try {
      const response = await getWorkingTimeRecord(timeTracking.workspace_id);
      setLoadingRecord(false);
      if (response && response.code === API_CODE.OK) {
        if (response.data) {
          setProgressText(t('time_tracking.progress_status.in_progress'));
          setWorkingRecord(response.data);
        }
        return;
      }
      displayMessage("error", response.error?.message);
    } catch (error) {
      setLoadingRecord(false);
      displayMessage("error", (error as BaseResponseType).error?.message);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!tracking) return;

    const now = new Date();
    const start = new Date();
    start.setHours(hour);
    start.setMinutes(minute);
    start.setSeconds(secondsWorking);
    const diffInSeconds = Math.floor((now.getTime() - start.getTime()) / 1000);
    setSeconds(diffInSeconds);
  }, [tracking, hour, minute]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (tracking) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [tracking]);

  useEffect(() => {
    dispatch(setSidebarSelected('time-tracking'));
    loadWorkingTimeRecord();
  }, []);

  useEffect(() => {
    if (workingRecord) {
      const workingTimeStart = new Date(workingRecord.start_at);
      setHour(workingTimeStart.getHours());
      setMinute(workingTimeStart.getMinutes());
      setSecondWorking(workingTimeStart.getSeconds());
      setTracking(true);
    }
  }, [workingRecord]);

  return (
    <div className="container-fluid px-4 py-4 time-tracking-view">
      <div className="alert alert-info alert-dismissible fade show rounded-3 shadow-sm">
        <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
        {t("time_tracking.feature_notice")}
      </div>

      {
        error &&
        <div className={`alert alert-danger element-${error ? 'show' : 'hide'} alert-dismissible rounded-3 shadow-sm ${error ? 'mt-3' : ''}`}>
          <FontAwesomeIcon icon={faWarning} /> {error}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setError(undefined)}
          ></button>
        </div>
      }

      <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
        <h3 className="mb-0 text-dark fw-bold">
          <FontAwesomeIcon icon={faClock} className="text-primary me-2" />
          {t("time_tracking.page_title")}
        </h3>
      </div>

      <div className="row g-4">
        <div className="col-12 col-md-4 col-lg-3">
          <div className="card shadow-sm border-0 rounded-4 h-100 timer-card">
            <div className="card-body d-flex flex-column justify-content-center py-4">
              <div className="text-center mb-4">
                {
                  loadingRecord ? <SkeletonLoading heigth={100} /> : <>
                  <h6 className="text-muted mb-3">{progressText}</h6>
                  <h1 className={`display-4 fw-bold mb-4 ${tracking ? 'text-primary' : 'text-secondary'}`}>
                    {tracking ? formatTime(seconds) : "--:--:--"}
                  </h1>
                  </>
                }
              </div>
              {
                loadingRecord ? <SkeletonLoading heigth={50} /> :
                <Button
                  color={tracking ? "danger" : "success"}
                  className="w-100 fw-semibold py-3"
                  onClick={!tracking ? handleStartWorking : handleEndWorking}
                  disabled={startWorkingLoading || endWorkingLoading}
                >
                  <FontAwesomeIcon icon={tracking ? faStop : faPlay} className="me-2" />
                  {tracking ? t("time_tracking.end_working_label") : t("time_tracking.start_working_label")}
                </Button>
              }
            </div>
          </div>
        </div>
        <TimeTrackingToday timeTracking={timeTracking} tracking={tracking} />
      </div>

      <div className="row mt-4">
        <TimeTrackingInfo timeTracking={timeTracking} loading={loadingRecord} />
        <TimeTrackingYesterday timeTracking={timeTracking} tracking={tracking} />
      </div>
    </div>
  );
};

export default TimeTrackingView;