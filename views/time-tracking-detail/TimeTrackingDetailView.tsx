"use client"
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import TimePicker from "@/common/components/TimePicker";
import { MemberShareType } from "@/types/document.type";
import { ProjectType } from "@/types/project.type";
import { faClock, faSave, faSearch, faFilter, faUserClock, faCalendarAlt, faPlus, faCalendarDays, faBullseye, faCubes, faUserGroup, faCheckCircle, faBullhorn, faCircle, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import TimeTrackingMemberList from "../time-tracking-manage/create/components/TimeTrackingMemberList";
import { TimeTrackingType } from "@/types/time-tracking.type";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/reduxs/store.redux";
import { displayMessage, formatHourStringToDate, rangeNumber } from "@/utils/helper.util";
import { BaseResponseType } from "@/types/base.type";
import { setSidebarSelected } from "@/reduxs/menu.redux";
import Loading from "@/common/components/Loading";
import TimeTrackingProjectList from "../time-tracking-manage/create/components/TimeTrackingProjectList";
import Modal from "@/common/components/Modal";
import { API_CODE } from "@/enums/api.enum";
import { updateTimeSheet, updateTimeSheetActive } from "@/api/time-tracking.api";
import ImageIcon from "@/common/components/ImageIcon";

interface TimeTrackingDetailViewProps {
  timeTracking: TimeTrackingType
}

const TimeTrackingDetailView: React.FC<TimeTrackingDetailViewProps> = ({ timeTracking }) => {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [trackingType, setTrackingType] = useState(timeTracking.tracking_type);
  const [projectShare, setProjectShare] = useState<ProjectType[]>(timeTracking.project ? [timeTracking.project] : []);
  const [projectMemberSelected, setProjectMemberSelected] = useState<MemberShareType[]>(timeTracking.members);
  const [userShare, setUserShare] = useState<MemberShareType[]>(timeTracking.members);
  const [startAt, setStartAt] = useState<Date | null>(formatHourStringToDate(timeTracking.time.start_at));
  const [endAt, setEndAt] = useState<Date | null>(formatHourStringToDate(timeTracking.time.end_at));
  const [startRestAt, setStartRestAt] = useState<Date | null>(formatHourStringToDate(timeTracking.rest_time.start_rest_at));
  const [endRestAt, setEndRestAt] = useState<Date | null>(formatHourStringToDate(timeTracking.rest_time.end_rest_at));
  const [title, setTitle] = useState<string>(timeTracking.title);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>(rangeNumber(timeTracking.working_day.start, timeTracking.working_day.end + 1));
  const [active, setActive] = useState(timeTracking.active);
  const [activeLoading, setActiveLoading] = useState(false);
  const [confirmApplyEntireWorkspace, setConfirmApplyEntireWorkspace] = useState(false);
  const [titleDefault, setTitleDefault] = useState(timeTracking.title);
  const [error, setError] = useState<string>();

  const daysOfWeek = [
    { id: 2, name: t('time_tracking.week_day.monday') },
    { id: 3, name: t('time_tracking.week_day.tuesday') },
    { id: 4, name: t('time_tracking.week_day.wednesday') },
    { id: 5, name: t('time_tracking.week_day.thursday') },
    { id: 6, name: t('time_tracking.week_day.friday') },
    { id: 7, name: t('time_tracking.week_day.saturday') },
    { id: 8, name: t('time_tracking.week_day.sunday') }
  ];

  const handleDaySelection = (dayId: number) => {
    setSelectedDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(id => id !== dayId) 
        : [...prev, dayId]
    );
  };

  const handleSubmitTrackingBoard = async () => {
    try {
      if (!startAt || !endAt || !startRestAt || !endRestAt || !title || selectedDays.length === 0) {
        return;
      }
      setUpdateLoading(true);
      const response = await updateTimeSheet(timeTracking.workspace_id, timeTracking.id, {
        start_at: startAt,
        end_at: endAt,
        start_rest_at: startRestAt,
        end_rest_at: endRestAt,
        title: title,
        working_day_start: selectedDays[0],
        working_day_end: selectedDays[selectedDays.length - 1],
        members: []
        // members: 
        //   (projectShare && projectShare.length > 0 && trackingType === 2) ? 
        //   projectMemberSelected.map(_v => { return {member_id: _v.user.id, permission: _v.permission} }) : 
        //   userShare.map(_v => { return {member_id: _v.user.id, permission: _v.permission} }),
      });
      setUpdateLoading(false);
      if (response && response.code === API_CODE.OK) {
        setTitle(title);
        return;
      }
      setError(response.error?.message);
    } catch (error) {
      setUpdateLoading(false);
      setError((error as BaseResponseType).error?.message);
    }
  };

  const handleActiveTracking = async (activeInput: boolean) => {
    try {
      if (timeTracking.tracking_type === 3 && activeInput && !confirmApplyEntireWorkspace) {
        setConfirmApplyEntireWorkspace(true);
        return;
      }

      setActiveLoading(true);
      const response = await updateTimeSheetActive(timeTracking.workspace_id, timeTracking.id, {
        start_at: new Date(),
        end_at: new Date(),
        start_rest_at: new Date(),
        end_rest_at: new Date(),
        title: title,
        members: [],
        active: activeInput
      });
      setActiveLoading(false);
      if (response && response.code === API_CODE.OK) {
        setActive(activeInput);
        setConfirmApplyEntireWorkspace(false);
        return;
      }
      setError(response.error?.message);
    } catch (error) {
      setActiveLoading(false);
      setError((error as BaseResponseType).error?.message);
    }
  }

  useEffect(() => {
    dispatch(setSidebarSelected('time-tracking-manage'));
  }, []);

  return (
    <div className="container py-4 time-tracking-create">
      {
        error &&
        <div className={`alert alert-danger element-${error ? 'show' : 'hide'} alert-dismissible rounded-3 shadow-sm ${error ? 'mb-3' : ''}`}>
          <FontAwesomeIcon icon={faWarning} /> {t('time_tracking.cannot_active')} {error}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setError(undefined)}
          ></button>
        </div>
      }
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <ImageIcon name="time-tracking-2" width={35} height={35} />
          {titleDefault}
        </h4>
        <div>
          <Button 
            color={active ? 'success' : 'secondary'} 
            style={{ marginRight: 5 }} 
            disabled={updateLoading || activeLoading}
            onClick={() => handleActiveTracking (active ? false : true)}
          >
            <FontAwesomeIcon icon={active ? faCheckCircle : faCircle} className="me-2" />
            {active ? 'Active' : 'Deactive'}
          </Button>
          <Button color={updateLoading ? 'secondary' : 'primary'} onClick={handleSubmitTrackingBoard} disabled={updateLoading || activeLoading}>
            <FontAwesomeIcon icon={faSave} className="me-2" />
            {updateLoading ? <Loading color="light" /> : t('common.btn_save')}
          </Button>
        </div>
      </div>

      <div className="card shadow-sm rounded p-4 mb-4">
        <div className="mb-3">
          <Input 
            type="text"
            value={title} 
            maxLength={90} 
            className="form-control" 
            placeholder={t('time_tracking.placeholder_enter_title')} 
            onChange={(e) => setTitle(e.target.value)} 
          />
        </div>

        {/* Working Days Selection */}
        <div className="row mb-3">
          <div className="col-12">
            <label className="form-label d-flex align-items-center">
              <FontAwesomeIcon icon={faCalendarDays} className="text-primary me-2" />
              {t('time_tracking.week_day_label')}
            </label>
            <div className="d-flex flex-wrap gap-2">
              {daysOfWeek.map(day => (
                <button
                  key={day.id}
                  type="button"
                  className={`btn btn-sm ${selectedDays.includes(day.id) ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleDaySelection(day.id)}
                >
                  {day.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Time Selection */}
        <div className="row mb-3">
          <div className="col-md-6 mt-2">
            <label className="form-label d-flex align-items-center">
              <FontAwesomeIcon icon={faClock} className="text-primary me-2" />
              {t('time_tracking.start_at_label')}
            </label>
            <TimePicker time={startAt} setTime={setStartAt} />
          </div>
          <div className="col-md-6 mt-2">
            <label className="form-label d-flex align-items-center">
              <FontAwesomeIcon icon={faClock} className="text-primary me-2" />
              {t('time_tracking.end_at_label')}
            </label>
            <TimePicker time={endAt} setTime={setEndAt} />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label d-flex align-items-center">
              <span className="emoji me-2">🍽️</span>
              {t('time_tracking.start_rest_at_label')}
            </label>
            <TimePicker time={startRestAt} setTime={setStartRestAt} />
          </div>
          <div className="col-md-6 mt-2">
            <label className="form-label d-flex align-items-center">
              <span className="emoji me-2">☕</span>
              {t('time_tracking.end_rest_at_label')}
            </label>
            <TimePicker time={endRestAt} setTime={setEndRestAt} />
          </div>
        </div>

        {trackingType === 2 && (
          <div className="row">
            <TimeTrackingProjectList 
              allowSearch={false}
              projectShare={projectShare} 
              setProjectShare={setProjectShare} 
              workspaceId={timeTracking.workspace_id} 
              projectMemberSelected={projectMemberSelected}
              setProjectMemberSelected={setProjectMemberSelected}
            />
          </div>
        )}

        {(trackingType === 1) && (
          <div className="row">
            <TimeTrackingMemberList 
              userShare={userShare} 
              setUserShare={setUserShare} 
              workspaceId={timeTracking.workspace_id} 
            />
          </div>
        )}
      </div>

      {/* Success Modal */}
      <Modal
        open={createSuccess}
        setOpen={setCreateSuccess}
        title=""
        footerBtn={[]}
        width={300}
        closable={false}
      >
        <div className="row">
          <div className="col-12 text-center mb-4">
            <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: 50 }} className="text-success" />
          </div>
          <div className="col-12 text-center mb-4 text-success">
            {t('time_tracking.success.timesheet_create_success')}
          </div>
          <div className="col-12">
            <Button color="primary" className="w-100" onClick={() => {
              router.push(`/workspace/${timeTracking.workspace_id}/time-tracking/manage`);
            }}>
              {t('common.btn_ok')}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={confirmApplyEntireWorkspace}
        setOpen={setConfirmApplyEntireWorkspace}
        title=""
        footerBtn={[]}
        width={500}
        closable={false}
      >
        <div className="row">
          <div className="col-12 mb-4 text-center">
            <FontAwesomeIcon icon={faBullhorn} style={{ fontSize: 50 }} className="text-warning" />
          </div>
          <div className="col-12 text-center mb-4 text-dark">
            {t('time_tracking.warning.timesheet_applied_to_workspace')}<br/>
            {t('time_tracking.warning.other_timesheets_will_be_deactivated')}
          </div>
          <div className="col-6">
            <Button color="default" className="w-100" onClick={() => setConfirmApplyEntireWorkspace(false)} disabled={activeLoading}>
              {t('common.btn_cancel')}
            </Button>
          </div>
          <div className="col-6">
            <Button color={activeLoading ? 'secondary' : 'primary'} className="w-100" onClick={() => handleActiveTracking (active ? false : true)}>
              {activeLoading ? <Loading color="light" /> : t('common.btn_ok')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Custom CSS */}
      <style jsx>{`
        .time-tracking-create .card {
          border-radius: 6px;
          border: 1px solid #dfe1e6;
          background-color: #ffffff;
        }
        
        .tracking-type-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 110px;
          height: 100px;
          border: 2px solid #dfe1e6;
          border-radius: 6px;
          background-color: #f4f5f7;
          color: #5e6c84;
          transition: all 0.2s ease;
        }
        
        .tracking-type-button.selected {
          border-color: #0052cc;
          background-color: #e6f0ff;
          color: #0052cc;
        }
        
        .tracking-type-button:hover:not(.selected) {
          background-color: #ebecf0;
        }
        
        .tracking-type-button svg {
          font-size: 1.5rem;
          margin-bottom: 8px;
        }
        
        .emoji {
          font-size: 1.2em;
        }
        
        .form-label {
          font-weight: 600;
          color: #5e6c84;
        }
        
        .alert-warning {
          background-color: #fffae6;
          border-color: #ffd700;
          color: #5e6c84;
        }
      `}</style>
    </div>
  );
}
export default TimeTrackingDetailView;