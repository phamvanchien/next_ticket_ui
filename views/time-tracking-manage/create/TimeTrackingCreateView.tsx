"use client"
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import { ProjectType } from "@/types/project.type";
import { WorkspaceType } from "@/types/workspace.type";
import { faBullhorn, faBullseye, faCalendarDays, faCheckCircle, faCircle, faClock, faCube, faCubes, faPlus, faSave, faSquare, faSquareCheck, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import TimeTrackingProjectList from "./components/TimeTrackingProjectList";
import TimeTrackingMemberList from "./components/TimeTrackingMemberList";
import { MemberShareType } from "@/types/document.type";
import { UserType } from "@/types/user.type";
import TimePicker from "@/common/components/TimePicker";
import { create } from "@/api/time-tracking.api";
import { displayMessage, formatTimeToHourString } from "@/utils/helper.util";
import { API_CODE } from "@/enums/api.enum";
import Modal from "@/common/components/Modal";
import { useRouter } from "next/navigation";
import { BaseResponseType } from "@/types/base.type";
import Loading from "@/common/components/Loading";
import { useAppDispatch } from "@/reduxs/store.redux";
import { setSidebarSelected } from "@/reduxs/menu.redux";

interface TimeTrackingCreateViewProps {
  workspace: WorkspaceType
}

const TimeTrackingCreateView: React.FC<TimeTrackingCreateViewProps> = ({ workspace }) => {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [trackingType, setTrackingType] = useState(3);
  const [projectShare, setProjectShare] = useState<ProjectType[]>([]);
  const [projectMemberSelected, setProjectMemberSelected] = useState<MemberShareType[]>([]);
  const [userShare, setUserShare] = useState<MemberShareType[]>([]);
  const [startAt, setStartAt] = useState<Date | null>(null);
  const [endAt, setEndAt] = useState<Date | null>(null);
  const [startRestAt, setStartRestAt] = useState<Date | null>(null);
  const [endRestAt, setEndRestAt] = useState<Date | null>(null);
  const [title, setTitle] = useState<string>('');
  const [createSuccess, setCreateSuccess] = useState(false);
  const [confirmApplyEntireWorkspace, setConfirmApplyEntireWorkspace] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([2,3,4,5,6]);
  const [dateRange, setDateRange] = useState<{ startDate: number; endDate: number }>({ 
    startDate: 2, 
    endDate: 6 
  });

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
      if (!startAt || !endAt || !startRestAt || !endRestAt || !title) {
        return;
      }

      if (trackingType === 3 && !confirmApplyEntireWorkspace) {
        setConfirmApplyEntireWorkspace(true);
        return;
      }
  
      setCreateLoading(true);
      const response = await create(workspace.id, {
        start_at: startAt,
        end_at: endAt,
        start_rest_at: startRestAt,
        end_rest_at: endRestAt,
        project_id: (projectShare && projectShare.length > 0 && trackingType === 2) ? projectShare[0].id : undefined,
        title: title,
        active: true,
        working_day_start: dateRange.startDate,
        working_day_end: dateRange.endDate,
        members: 
          (projectShare && projectShare.length > 0 && trackingType === 2) ? 
          projectMemberSelected.map(_v => { return {member_id: _v.user.id, permission: _v.permission} }) : 
          userShare.map(_v => { return {member_id: _v.user.id, permission: _v.permission} }),
      });
  
      setCreateLoading(false);
      if (response && response.code === API_CODE.CREATED) {
        setCreateSuccess(true);
        return;
      }
      displayMessage('error', response.error?.message);
    } catch (error) {
      setCreateLoading(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  };

  // Reset form after success
  const resetForm = () => {
    setProjectMemberSelected([]);
    setUserShare([]);
    setProjectShare([]);
    setTrackingType(3);
    setStartAt(null);
    setEndAt(null);
    setStartRestAt(null);
    setEndRestAt(null);
    setTitle('');
    setSelectedDays([]);
    setDateRange({ startDate: 2, endDate: 6 });
  };

  useEffect(() => {
    setProjectMemberSelected([]);
    setUserShare([]);
    setProjectShare([]);
  }, [trackingType]);

  useEffect(() => {
    dispatch(setSidebarSelected('time-tracking-manage'));
  }, []);

  return (
    <div className="container py-4 time-tracking-create">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <FontAwesomeIcon icon={faPlus} className="text-primary me-2" />
          {t('time_tracking.create.title')}
        </h4>
        <Button color={createLoading ? 'secondary' : 'primary'} onClick={handleSubmitTrackingBoard}>
          <FontAwesomeIcon icon={faSave} className="me-2" />
          {createLoading ? <Loading color="light" /> : t('common.btn_save')}
        </Button>
      </div>

      <div className="card shadow-sm rounded p-4 mb-4">
        <div className="mb-3">
          <Input 
            type="text" 
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

        {/* Tracking Area Selection */}
        <div className="mb-3">
          <label className="form-label fw-semibold d-flex align-items-center">
            <FontAwesomeIcon icon={faBullseye} className="text-primary me-2" />
            {t('time_tracking.area_tracking')}
          </label>

          <div className="d-flex gap-3 mt-2 flex-wrap">
            <button
              type="button"
              className={`tracking-type-button ${trackingType === 3 ? 'selected' : ''}`}
              onClick={() => setTrackingType(3)}
            >
              <FontAwesomeIcon icon={faCubes} />
              <div>{t('time_tracking.tracking_in_workspace')}</div>
            </button>

            <button
              type="button"
              className={`tracking-type-button ${trackingType === 2 ? 'selected' : ''}`}
              onClick={() => setTrackingType(2)}
            >
              <FontAwesomeIcon icon={faBullseye} />
              <div>{t('time_tracking.tracking_in_project')}</div>
            </button>

            <button
              type="button"
              className={`tracking-type-button ${trackingType === 1 ? 'selected' : ''}`}
              onClick={() => setTrackingType(1)}
            >
              <FontAwesomeIcon icon={faUserGroup} />
              <div>{t('time_tracking.tracking_in_group')}</div>
            </button>
          </div>
        </div>

        {trackingType === 3 && (
          <div className="alert alert-warning mt-3">
            <i className="fas fa-exclamation-circle me-2"></i>
            {t('time_tracking.warning.confirm_apply_workspace_timesheet')}
          </div>
        )}

        {trackingType === 2 && (
          <div className="row">
            <TimeTrackingProjectList 
              projectShare={projectShare} 
              setProjectShare={setProjectShare} 
              workspaceId={workspace.id} 
              projectMemberSelected={projectMemberSelected}
              setProjectMemberSelected={setProjectMemberSelected}
            />
          </div>
        )}

        {trackingType === 1 && (
          <div className="row">
            <TimeTrackingMemberList 
              userShare={userShare} 
              setUserShare={setUserShare} 
              workspaceId={workspace.id} 
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
              resetForm();
              router.push(`/workspace/${workspace.id}/time-tracking/manage`);
            }}>
              {t('common.btn_ok')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal */}
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
            <Button color="default" className="w-100" onClick={() => setConfirmApplyEntireWorkspace(false)} disabled={createLoading}>
              {t('common.btn_cancel')}
            </Button>
          </div>
          <div className="col-6">
            <Button color={createLoading ? 'secondary' : 'primary'} className="w-100" onClick={handleSubmitTrackingBoard}>
              {createLoading ? <Loading color="light" /> : t('common.btn_ok')}
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
};

export default TimeTrackingCreateView