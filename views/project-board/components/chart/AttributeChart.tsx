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
import { ProjectType, ReportTaskWithAttribute, ReportTaskWithStatus } from "@/types/project.type";
import React, { useEffect, useState } from "react";
import { displaySmallMessage } from "@/utils/helper.util";
import { BaseResponseType } from "@/types/base.type";
import { reportByAttribute, reportByStatus } from "@/api/project.api";
import { API_CODE } from "@/enums/api.enum";
import DynamicIcon from "@/common/components/DynamicIcon";

interface AttributeChartProps {
  project: ProjectType
}

interface AttributeReportType {
  type: 'priority' | 'type',
  title: string
}

interface ReportDataAttribute {
  title: string
  totalTask: number
  data: ReportTaskWithAttribute[]
}

const  AttributeChart: React.FC<AttributeChartProps> = ({ project }) => {
  const [reportData, setReportData] = useState<ReportDataAttribute[]>([]);
  const t = useTranslations();
  const attributes: AttributeReportType[] = [
    {
      type: 'priority',
      title: t('tasks_page.report.priority_chart_label')
    },
    {
      type: 'type',
      title: t('tasks_page.report.type_chart_label')
    }
  ];
  const loadReportByAttribute = async () => {
    try {
      const responseReport = await Promise.all(
        attributes.map(async (attr) => {
          const response = await reportByAttribute(project.workspace_id, project.id, attr.type);
          if (response && response.code === API_CODE.OK) {
            return {
              title: attr.title,
              totalTask: response.data.reduce(
                (sum: number, item: any) => sum + (Number(item.task_count) || 0),
                0
              ),
              data: response.data
            }
          }
          return {
            title: attr.title,
            totalTask: 0,
            data: []
          }
        })
      );
      setReportData(responseReport);
    } catch (error) {
      setReportData([]);
      displaySmallMessage('error', (error as BaseResponseType).error?.message);
    }
  }  
  useEffect(() => {
    loadReportByAttribute();
  }, [project]);
  if (reportData.filter(v => v.data.length > 0).length === 0) {
    return <></>
  }
  return (
    <div>
      {
        reportData.map((report, index) => (
          <div className="row" key={index}>
            <div className="col-12 col-lg-6">
              <div className="card border-unset shadow-sm mb-4">
                <div className="card-header border-unset text-primary">
                  <FontAwesomeIcon icon={faPieChart} /> {report.title}
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={report.data?.map(c => {
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
                        {report.data?.map((entry, index) => (
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
                      report.data && report.data.map((chart, index) => (
                        <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                          <span>
                            <DynamicIcon iconName={chart.icon} style={{ color: chart.color, marginRight: 7 }} />
                            {chart.name}
                          </span>
                          <span><b className="text-primary">{chart.task_count}</b> ({Math.round((chart.task_count / report.totalTask) * 100)}%)</span>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}
export default AttributeChart;