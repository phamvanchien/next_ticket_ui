import Sidebar from "@/common/layouts/Sidebar";
import React from "react";
import TaskStatisticalBoard from "./TaskStatisticalBoard";
import { ProjectType } from "@/types/project.type";
import { useTranslations } from "next-intl";
import StatusChart from "./chart/StatusChart";
import AssigneeChart from "./chart/AssigneeChart";
import AttributeChart from "./chart/AttributeChart";

interface ProjectBoardChartProps {
  project: ProjectType
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ProjectBoardChart: React.FC<ProjectBoardChartProps> = ({
  project,
  open,
  setOpen,
}) => {
  const t = useTranslations();
  return (
    <Sidebar open={open} width={1500} headerTitle={t('tasks_page.report.report_label')} setOpen={setOpen}>
      {open && <TaskStatisticalBoard project={project} />}
      {open && <StatusChart project={project} />}
      {open && <AttributeChart project={project} />}
      {open && <AssigneeChart project={project} />}
    </Sidebar>
  );
};

export default ProjectBoardChart;