import { reportByStatusWithCategory } from "@/api/project.api";
import { API_CODE } from "@/enums/api.enum";
import { BaseResponseType } from "@/types/base.type";
import { ProjectType, ReportTaskWithCategory } from "@/types/project.type";
import { displaySmallMessage } from "@/utils/helper.util";
import {
  StopOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

interface TaskStatisticalBoardProps {
  project: ProjectType
}

const TaskStatisticalBoard: React.FC<TaskStatisticalBoardProps> = ({ project }) => {
  const t = useTranslations();
  const [reportData, setReportData] = useState<ReportTaskWithCategory[]>();
  const [overDue, setOverDue] = useState(0);
  const loadReport = async () => {
    try {
      const response = await reportByStatusWithCategory (project.workspace_id, project.id);
      if (response && response.code === API_CODE.OK) {
        const reportDataInput = []
        reportDataInput.push(
          response.data[0] ?? {
            category_id: 1,
            task_count: 0,
            overdue_count: 0,
            color: '#fff7e6'
          }
        );
        reportDataInput.push(
          response.data[1] ?? {
            category_id: 1,
            task_count: 0,
            overdue_count: 0,
            color: '#e6f7ff'
          }
        );
        reportDataInput.push(
          response.data[2] ?? {
            category_id: 1,
            task_count: 0,
            overdue_count: 0,
            color: '#f6ffed'
          }
        );
        setReportData(reportDataInput);
        const totalOverdue = response.data.reduce((acc: number, item: any) => {
          const count = parseInt(item.overdue_count || 0);
          return acc + (isNaN(count) ? 0 : count);
        }, 0);
  
        setOverDue(totalOverdue);
        return;
      }
      displaySmallMessage('error', response.error?.message);
    } catch (error) {
      displaySmallMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  useEffect(() => {
    loadReport();
  }, [project]);
  return (
    <div className="row">
      {reportData && reportData.map((item, index) => (
        <div className="col-md-3 col-sm-6 mb-4" key={index}>
          <div
            className="card shadow-sm h-100"
            style={{ backgroundColor: item.color }}
          >
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small">
                  {item.category_id === 1 && t('tasks.report.todo_label')}
                  {item.category_id === 2 && t('tasks.report.in_progress_label')}
                  {item.category_id === 3 && t('tasks.report.done_label')}
                </div>
                <div className="h4 mb-0">{item.task_count}</div>
              </div>
              <div>
                {item.category_id === 1 && <StopOutlined style={{ fontSize: 24, color: "#fa8c16" }} />}
                {item.category_id === 2 && <ClockCircleOutlined style={{ fontSize: 24, color: "#1890ff" }} />}
                {item.category_id === 3 && <CheckCircleOutlined style={{ fontSize: 24, color: "#52c41a" }} />}
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="col-md-3 col-sm-6 mb-4">
        <div
          className="card shadow-sm h-100"
          style={{ backgroundColor: '#fff1f0' }}
        >
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <div className="text-muted small">{t('tasks.report.over_due_label')}</div>
              <div className="h4 mb-0">{overDue}</div>
            </div>
            <div>
              <PieChartOutlined style={{ fontSize: 24, color: "#f5222d" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default TaskStatisticalBoard;