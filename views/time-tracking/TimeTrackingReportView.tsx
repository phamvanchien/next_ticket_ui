"use client"
import Button from "@/common/components/Button";
import { faSearch, faUserClock, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { TimeTrackingReportType, TimeTrackingType } from "@/types/time-tracking.type";
import Dropdown from "@/common/components/Dropdown";
import { MenuProps } from "antd";
import { displayMessage, monthList, rangeNumber } from "@/utils/helper.util";
import { getReportTracking } from "@/api/time-tracking.api";
import { API_CODE } from "@/enums/api.enum";
import { BaseResponseType } from "@/types/base.type";
import TimeTrackingReportSummary from "./components/TimeTrackingReportSummary";
import { useRouter } from "next/navigation";
import { setSidebarSelected } from "@/reduxs/menu.redux";
import { useAppDispatch } from "@/reduxs/store.redux";
import TimeTrackingReportRecord from "./components/TimeTrackingReportRecord";
import TimeTrackingReportForm from "./components/TimeTrackingReportForm";
import { getCookie } from "@/utils/cookie.util";
import Loading from "@/common/components/Loading";

interface TimeTrackingReportViewProps {
  timeTracking: TimeTrackingType
}

const TimeTrackingReportView: React.FC<TimeTrackingReportViewProps> = ({ timeTracking }) => {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [activeTab, setActiveTab] = useState(1);
  const [reportsData, setReportsData] = useState<TimeTrackingReportType>();
  const loadReport = async () => {
    try {
      const response = await getReportTracking(timeTracking.workspace_id, month);
      if (response && response.code === API_CODE.OK) {
        setReportsData(response.data);
        return;
      }
      displayMessage("error", response.error?.message);
    } catch (error) {
      displayMessage("error", (error as BaseResponseType).error?.message);
    }
  }

  const lang = getCookie('locale');
  const items: MenuProps["items"] = monthList(lang ?? undefined).map(_v => {
    return {
      key: _v.id,
      label: <div className="" onClick={() => setMonth(_v.id)}>
        {_v.text}
      </div>
    }
  });

  const handleGetReport = () => {
    setReportsData(undefined);
    loadReport();
  }

  useEffect(() => {
    dispatch(setSidebarSelected('time-tracking'));
    loadReport();
  }, []);

  return (
    <div className="container py-4 time-tracking-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-0 fw-bold text-dark">
            <FontAwesomeIcon icon={faUserClock} className="text-primary me-2" />
            {t('time_tracking.page_title_manage')}
          </h4>
          <p className="text-muted mb-0">{t('time_tracking.page_title_manage_personal')}</p>
        </div>
        <Button color={'default'} className="fw-semibold" onClick={() => router.push(`/workspace/${timeTracking.workspace_id}/time-tracking`)}>
          <FontAwesomeIcon icon={faHome} className="me-2" />
          {t('btn_back_main_page')}
        </Button>
      </div>

      <div className="row mt-4 mb-4">
        <div className="col-12 col-lg-3">
          <Dropdown items={items} className="w-50 float-left">
            <Button color='secondary' outline className="w-100">
              {monthList(lang ?? undefined).find(_v => _v.id === month)?.text}
            </Button>
          </Dropdown>
          <Button color={!reportsData ? 'secondary' : 'primary'} className="float-left" style={{ marginLeft: 7 }} onClick={handleGetReport} disabled={!reportsData}>
            {reportsData ? <FontAwesomeIcon icon={faSearch} /> : <Loading color="light" />} {t('common.search_label')}
          </Button>
        </div>
      </div>

      <TimeTrackingReportSummary reportsData={reportsData} />

      <ul className="nav nav-tabs-report mb-4" id="timeTrackingTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 1 ? 'active' : ''}`}
            onClick={() => setActiveTab(1)}
          >
            {t('time_tracking.history_label')}
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 2 ? 'active' : ''}`}
            onClick={() => setActiveTab(2)}
          >
            {t('time_tracking.report_label')}
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 3 ? 'active' : ''}`}
            onClick={() => setActiveTab(3)}
          >
            {t('time_tracking.break_time_label')}
          </button>
        </li>
      </ul>

      <div className="card shadow-sm border-0 card-report">
        {
          activeTab === 1 && <TimeTrackingReportRecord reportsData={reportsData} timeTracking={timeTracking} />
        }
        {
          activeTab === 2 && <TimeTrackingReportForm timeTracking={timeTracking} />
        }
      </div>
    </div>
  );
}
export default TimeTrackingReportView;