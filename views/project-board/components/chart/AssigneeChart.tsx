import { reportByAssignee } from "@/api/project.api";
import { API_CODE } from "@/enums/api.enum";
import { BaseResponseType } from "@/types/base.type";
import { ProjectType, ReportTaskWithAssignee } from "@/types/project.type";
import { displaySmallMessage } from "@/utils/helper.util";
import { faBarChart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import {
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const memberTaskData = [
  { name: "An", tasks: 10 },
  { name: "Bình", tasks: 15 },
  { name: "Chi", tasks: 7 },
  { name: "Dũng", tasks: 20 },
  { name: "Hà", tasks: 5 },
  { name: "An", tasks: 10 },
  { name: "Bình", tasks: 15 },
  { name: "Chi", tasks: 7 },
  { name: "Dũng", tasks: 20 },
  { name: "Hà", tasks: 5 },
  { name: "An", tasks: 10 },
  { name: "Bình", tasks: 15 },
  { name: "Chi", tasks: 7 },
  { name: "Dũng", tasks: 20 }
];

interface AssigneeChartProps {
  project: ProjectType
}

const AssigneeChart: React.FC<AssigneeChartProps> = ({ project }) => {
  const t = useTranslations();
  const [chartData, setChartData] = useState<ReportTaskWithAssignee[]>();
  const loadChartData = async () => {
    try {
      const response = await reportByAssignee(project.workspace_id, project.id);
      if (response && response.code === API_CODE.OK) {
        setChartData(response.data);
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
  if (!chartData) {
    return <></>
  }
  return (
    <div className="row">
      <div className="col-12">
        <div className="card border-unset shadow-sm mb-4">
          <div className="card-header border-unset text-primary">
            <FontAwesomeIcon icon={faBarChart} /> {t('tasks.report.bar_chart_label')}
          </div>
          <div className="card-body custom-scrollbar" style={{ overflowX: "auto",  minWidth: 100 }}>
            <div style={{ width: `${chartData.length * 80}px` }}>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart
                  data={chartData.map(chart => {
                    return {
                      name: chart.name || t('tasks.unassigned_label'),
                      tasks: chart.task_count
                    }
                  })}
                  margin={{ top: 20, right: 5, left: 0, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tasks" fill="#1890ff" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AssigneeChart;