"use client"
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import TimePicker from "@/common/components/TimePicker";
import { MemberShareType } from "@/types/document.type";
import { ProjectType } from "@/types/project.type";
import { faClock, faSave, faSearch, faFilter, faUserClock, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import TimeTrackingMemberList from "../time-tracking-manage/create/components/TimeTrackingMemberList";
import { TimeTrackingType } from "@/types/time-tracking.type";

const TimeTrackingDetailReportView = () => {
const t = useTranslations();
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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Mock data for demonstration
  const mockMembers = [
    { id: 1, name: 'Nguyễn Văn A', avatar: '', hoursWorked: 8, status: 'completed' },
    { id: 2, name: 'Trần Thị B', avatar: '', hoursWorked: 6.5, status: 'in-progress' },
    { id: 3, name: 'Lê Văn C', avatar: '', hoursWorked: 0, status: 'not-started' },
    { id: 4, name: 'Phạm Thị D', avatar: '', hoursWorked: 7.25, status: 'completed' },
  ];

  const filteredMembers = mockMembers.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-4 time-tracking-dashboard">
      {/* Header Section */}
            {/* Summary Cards */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-0 fw-bold text-dark">
            <FontAwesomeIcon icon={faUserClock} className="text-primary me-2" />
            {t('time_tracking.management.title')}
          </h4>
          <p className="text-muted mb-0">Quản lý thời gian làm việc của tất cả thành viên</p>
        </div>
        <Button color={'primary'} className="fw-semibold">
          <FontAwesomeIcon icon={faSave} className="me-2" />
          {t('common.btn_save')}
        </Button>
      </div>

      <div className="row mt-4 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-primary bg-opacity-10">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Tổng thành viên</h6>
                  <h3 className="mb-0">{mockMembers.length}</h3>
                </div>
                <div className="avatar-sm">
                  <div className="avatar-title bg-primary rounded-circle">
                    <FontAwesomeIcon icon={faUserClock} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-success bg-opacity-10">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Đã hoàn thành</h6>
                  <h3 className="mb-0">{mockMembers.filter(m => m.status === 'completed').length}</h3>
                </div>
                <div className="avatar-sm">
                  <div className="avatar-title bg-success rounded-circle">
                    <FontAwesomeIcon icon={faClock} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-warning bg-opacity-10">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Đang làm việc</h6>
                  <h3 className="mb-0">{mockMembers.filter(m => m.status === 'in-progress').length}</h3>
                </div>
                <div className="avatar-sm">
                  <div className="avatar-title bg-warning rounded-circle">
                    <FontAwesomeIcon icon={faClock} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                {/* <span className="input-group-text bg-white border-end-0">
                  <FontAwesomeIcon icon={faSearch} className="text-muted" />
                </span> */}
                <Input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Tìm kiếm thành viên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FontAwesomeIcon icon={faFilter} className="text-muted" />
                </span>
                <select className="form-select">
                  <option>Tất cả dự án</option>
                  <option>Dự án A</option>
                  <option>Dự án B</option>
                </select>
              </div>
            </div>
            <div className="col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-muted" />
                </span>
                <input type="date" className="form-control" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <ul className="nav nav-tabs mb-4" id="timeTrackingTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Tất cả thành viên
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'in-progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('in-progress')}
          >
            Đang làm việc
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Đã hoàn thành
          </button>
        </li>
      </ul>

      {/* Members Time Tracking Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Thành viên</th>
                  <th>Dự án</th>
                  <th className="text-center">Thời gian bắt đầu</th>
                  <th className="text-center">Thời gian kết thúc</th>
                  <th className="text-center">Tổng giờ làm</th>
                  <th className="text-center">Trạng thái</th>
                  <th className="pe-4 text-end">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center">
                        <div className="avatar-sm me-3">
                          <div className="avatar-title bg-light rounded-circle">
                            {member.name.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-0">{member.name}</h6>
                          <small className="text-muted">Nhân viên</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-primary bg-opacity-10 text-primary">Dự án A</span>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-light text-dark border">08:00</span>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-light text-dark border">17:00</span>
                    </td>
                    <td className="text-center fw-bold">
                      {member.hoursWorked > 0 ? `${member.hoursWorked}h` : '-'}
                    </td>
                    <td className="text-center">
                      <span className={`badge rounded-pill ${
                        member.status === 'completed' 
                          ? 'bg-success bg-opacity-10 text-success' 
                          : member.status === 'in-progress' 
                            ? 'bg-warning bg-opacity-10 text-warning' 
                            : 'bg-secondary bg-opacity-10 text-secondary'
                      }`}>
                        {member.status === 'completed' 
                          ? 'Hoàn thành' 
                          : member.status === 'in-progress' 
                            ? 'Đang làm' 
                            : 'Chưa bắt đầu'}
                      </span>
                    </td>
                    <td className="pe-4 text-end">
                      <button className="btn btn-sm btn-outline-primary me-2">
                        Chi tiết
                      </button>
                      <button className="btn btn-sm btn-outline-secondary">
                        Chỉnh sửa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .time-tracking-dashboard {
          background-color: #f4f5f7;
        }
        
        .nav-tabs .nav-link {
          color: #5e6c84;
          font-weight: 500;
          border: none;
          padding: 0.75rem 1.25rem;
          position: relative;
        }
        
        .nav-tabs .nav-link.active {
          color: #0052cc;
          background-color: transparent;
          border-bottom: 3px solid #0052cc;
        }
        
        .nav-tabs .nav-link:hover:not(.active) {
          color: #0052cc;
          background-color: rgba(9, 30, 66, 0.04);
        }
        
        .table th {
          font-weight: 600;
          color: #5e6c84;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.5px;
          border-top: 1px solid #dfe1e6;
        }
        
        .table td {
          vertical-align: middle;
          border-top: 1px solid #f4f5f7;
        }
        
        .table tr:hover td {
          background-color: rgba(9, 30, 66, 0.04);
        }
        
        .avatar-sm {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .avatar-title {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          font-weight: 600;
        }
        
        .card {
          border-radius: 4px;
          border: 1px solid #dfe1e6;
          transition: all 0.2s ease;
        }
        
        .card:hover {
          box-shadow: 0 4px 8px rgba(9, 30, 66, 0.1);
        }
      `}</style>
    </div>
  );
}
export default TimeTrackingDetailReportView;