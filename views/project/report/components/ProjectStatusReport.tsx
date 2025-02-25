import { reportByPriority, reportByStatus, reportByTag, reportByType } from "@/api/project.api";
import Button from "@/common/components/Button";
import Loading from "@/common/components/Loading";
import { API_CODE } from "@/enums/api.enum";
import { PieChartType } from "@/types/base.type";
import { ProjectType, ReportStatusType } from "@/types/project.type";
import { faPieChart, faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";

interface ProjectStatusReportProps {
  project: ProjectType
}

const ProjectStatusReport: React.FC<ProjectStatusReportProps> = ({ project }) => {
  const [reportData, setReportData] = useState<ReportStatusType[]>();
  const [reportDataStatus, setReportDataStatus] = useState<ReportStatusType[]>();
  const [reportDataPriority, setReportDataPriority] = useState<ReportStatusType[]>();
  const [reportDataType, setReportDataType] = useState<ReportStatusType[]>();
  const [reportDataTag, setReportDataTag] = useState<ReportStatusType[]>();
  const [chartData, setChartData] = useState<PieChartType[]>([]);
  const [chartType, setChartType] = useState<number>(1);
  const t = useTranslations();
  useEffect(() => {
    const loadReportTag = async () => {
      try {
        const response = await reportByTag(project.workspace_id, project.id);
        if (response && response.code === API_CODE.OK) {
          setReportDataTag(response.data);
          return;
        }
        setReportDataTag(undefined);
      } catch (error) {
        setReportDataTag(undefined);
      }
    }
    const loadReportType = async () => {
      try {
        const response = await reportByType(project.workspace_id, project.id);
        if (response && response.code === API_CODE.OK) {
          setReportDataType(response.data);
          return;
        }
        setReportDataType(undefined);
      } catch (error) {
        setReportDataType(undefined);
      }
    }
    const loadReportPriority = async () => {
      try {
        const response = await reportByPriority(project.workspace_id, project.id);
        if (response && response.code === API_CODE.OK) {
          setReportDataPriority(response.data);
          return;
        }
        setReportDataPriority(undefined);
      } catch (error) {
        setReportDataPriority(undefined);
      }
    }
    const loadReportStatus = async () => {
      try {
        const response = await reportByStatus(project.workspace_id, project.id);
        if (response && response.code === API_CODE.OK) {
          setReportDataStatus(response.data);
          return;
        }
        setReportDataStatus(undefined);
      } catch (error) {
        setReportDataStatus(undefined);
      }
    }
    loadReportStatus();
    loadReportPriority();
    loadReportType();
    loadReportTag();
  }, []);
  useEffect(() => {
    if (chartType === 1) {
      setReportData(reportDataStatus);
    }
    if (chartType === 2) {
      setReportData(reportDataPriority);
    }
    if (chartType === 3) {
      setReportData(reportDataType);
    }
    if (chartType === 4) {
      setReportData(reportDataTag);
    }
  }, [chartType, reportDataStatus]);
  useEffect(() => {
    if (!reportData) {
      return;
    }
    setChartData(reportData.map(item => {
      return {
        title: item.name,
        value: item.percent_tasks,
        color: item.color
      }
    }));
  }, [reportData]);
  return (
    <div className="row">
      <div className="col-12 mb-2">
        <hr/>
        <h5 className="text-secondary"><FontAwesomeIcon icon={faPieChart} /> {t('project_report.pie_chart_title')}</h5>
      </div>
      <div className="col-12 mb-2">
        {
          (reportDataStatus && reportDataStatus.length > 0) &&
          <Button color="secondary" className="float-left mr-2" outline={chartType === 2 || chartType === 3 || chartType === 4} onClick={() => setChartType (1)}>
            {t('tasks.status_label')}
          </Button>
        }
        {
          (reportDataPriority && reportDataPriority.length > 0) &&
          <Button color="secondary" className="float-left mr-2" outline={chartType === 1 || chartType === 3 || chartType === 4} onClick={() => setChartType (2)}>
            {t('tasks.priority_label')}
          </Button>
        }
        {
          (reportDataType && reportDataType.length > 0) &&
          <Button color="secondary" className="float-left mr-2" outline={chartType === 2 || chartType === 1 || chartType === 4} onClick={() => setChartType (3)}>
            {t('tasks.type_label')}
          </Button>
        }
        {
          (reportDataTag && reportDataTag.length > 0) &&
          <Button color="secondary" className="float-left mr-2" outline={chartType === 2 || chartType === 1 || chartType === 3} onClick={() => setChartType (4)}>
            {t('tasks.tags_label')}
          </Button>
        }
      </div>
      {
        (reportDataStatus && reportData) && reportData.length > 1 &&
        <div className="col-6 col-lg-4">
          <div className="card">
            <div className="card-body text-center">
              {
                chartData ?
                  <PieChart
                    className="pie-chart-report"
                    data={chartData}
                    label={({ dataEntry }) => `${dataEntry.title} (${dataEntry.value}%)`}
                    labelStyle={{
                      fontSize: "3px",
                      fontFamily: "sans-serif",
                      fill: "#fff",
                    }}
                    labelPosition={75}
                  /> : 
                  <center><Loading color="primary" /></center>
              }
            </div>
          </div>
        </div>
      }
      <div className="col-6 col-lg-8">
        {
          (reportDataStatus && reportData) && reportData.map(value => (
            <p key={value.id}><FontAwesomeIcon icon={faSquare} style={{ color: value.color}} /> {value.name}: <b>{value.total_tasks}</b></p>
          ))
        }
      </div>
    </div>
  )
}
export default ProjectStatusReport;