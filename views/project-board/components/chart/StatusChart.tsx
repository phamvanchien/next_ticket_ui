import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { faPieChart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { ProjectType, ReportTaskWithStatus } from "@/types/project.type";
import React, { useEffect, useState } from "react";
import { displaySmallMessage } from "@/utils/helper.util";
import { BaseResponseType } from "@/types/base.type";
import { reportByStatus } from "@/api/project.api";
import { API_CODE } from "@/enums/api.enum";

interface StatusChartProps {
  project: ProjectType
}

const StatusChart: React.FC<StatusChartProps> = ({ project }) => {
  const t = useTranslations();
  const [chartData, setChartData] = useState<ReportTaskWithStatus[]>();
  const [totalTask, setTotalTask] = useState(0);
  const loadChartData = async () => {
    try {
      const response = await reportByStatus(project.workspace_id, project.id);
      if (response && response.code === API_CODE.OK) {
        setChartData(response.data);
        const total = response.data.reduce(
          (sum: number, item: any) => sum + (Number(item.task_count) || 0),
          0
        );
        setTotalTask(total);
        return;
      }
      displaySmallMessage('error', response.error?.message);
    } catch (error) {
      displaySmallMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  useEffect(() => {
    loadChartData();
  }, [project]);
  return (
    <div className="row">
      <div className="col-12 col-lg-6">
        <div className="card border-unset shadow-sm mb-4">
          <div className="card-header border-unset text-primary">
            <FontAwesomeIcon icon={faPieChart} /> {t('tasks_page.report.pie_chart_status')}
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData?.map(c => {
                    return {
                      name: c.name,
                      value: c.task_count
                    }
                  })}
                  cx="50%"
                  cy="50%"
                  label
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-6">
        <div className="card border-unset shadow-sm mb-4">
          <div className="card-body">
            <ul className="list-group list-group-flush">
              {
                chartData && chartData.map((chart, index) => (
                  <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                    <span>
                      <span
                        className="badge me-2"
                        style={{
                          backgroundColor: chart.color,
                          width: 12,
                          height: 12,
                          display: "inline-block",
                          borderRadius: "50%",
                        }}
                      ></span>
                      {chart.name}
                    </span>
                    <span><b className="text-primary">{chart.task_count}</b> ({Math.round((chart.task_count / totalTask) * 100)}%)</span>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
export default StatusChart;