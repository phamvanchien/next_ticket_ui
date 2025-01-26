import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarChart, faNoteSticky } from "@fortawesome/free-solid-svg-icons";
import { ProjectType, ReportAssigneeType } from "@/types/project.type";
import { reportByAssignee } from "@/api/project.api";
import { API_CODE } from "@/enums/api.enum";
import { ColumnChartType } from "@/types/base.type";
import { IMAGE_DEFAULT } from "@/enums/app.enum";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ProjectMemberReportProps {
  project: ProjectType
}

const ProjectMemberReport: React.FC<ProjectMemberReportProps> = ({ project }) => {
  const [chartData, setChartData] = useState<ColumnChartType>();
  const [reportData, setReportData] = useState<ReportAssigneeType[]>();
  useEffect(() => {
    const loadReport = async () => {
      try {
        const response = await reportByAssignee(project.workspace_id, project.id);
        if (response && response.code === API_CODE.OK) {
          setReportData(response.data);
          setChartData({
            labels: response.data.map(value => value.last_name),
            datasets: [
              {
                data: response.data.map(value => value.total_tasks),
                backgroundColor: [
                  "#cfe2ff"
                ],
                borderColor: [
                  "#6ea8fe",
                ],
                borderWidth: 1,
              }
            ]
          });
          return;
        }
        setChartData(undefined);
        setReportData(undefined);
      } catch (error) {
        setChartData(undefined);
        setReportData(undefined);
      }
    }
    loadReport();
  }, []);

  if (!chartData || !reportData || (reportData && reportData.length === 0)) {
    return;
  }

  return (
    <div className="row">
      <div className="col-12 mb-2">
        <hr/>
        <h5 className="text-secondary"><FontAwesomeIcon icon={faBarChart} /> Task reporting {chartData.labels.length > 1 ? "chart" : ""} by members</h5>
      </div>
      {
        chartData.labels.length > 1 &&
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                      display: false
                    }
                  },
                }}
              />
            </div>
          </div>
        </div>
      }
      <div className="col-12">
        <div className="card">
          <div className="card-body p-10">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col" style={{width: 300}}>Member</th>
                  <th scope="col">Total</th>
                </tr>
              </thead>
              {
                reportData && reportData.map(value => (
                  <tr key={value.id}>
                    <td style={{minWidth: 200}}>
                      <img 
                        className="img-circle mr-2"
                        width={25}
                        height={25}
                        src={value.avatar ?? IMAGE_DEFAULT.NO_USER} 
                        onError={(e) => e.currentTarget.src = IMAGE_DEFAULT.NO_USER} 
                      />
                      {value.first_name} {value.last_name}
                    </td>
                    <td>
                      <b className="text-secondary">{value.total_tasks} task</b> - <b className="text-primary">{value.percent_tasks}%</b>
                    </td>
                  </tr>
                ))
              }
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProjectMemberReport;