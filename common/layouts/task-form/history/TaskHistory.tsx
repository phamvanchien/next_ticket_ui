import { taskHistory } from "@/api/task.api";
import { API_CODE } from "@/enums/api.enum";
import { BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
import { HistoryType, TaskType } from "@/types/task.type";
import { displaySmallMessage } from "@/utils/helper.util";
import React, { useEffect, useState } from "react";
import Loading from "@/common/components/Loading";
import { useTranslations } from "next-intl";
import TaskHistoryItem from "./TaskHistoryItem";

interface TaskHistoryProps {
  task?: TaskType;
}

const TaskHistory: React.FC<TaskHistoryProps> = ({ task }) => {
  const t = useTranslations();
  const defaultPageSize = 2;
  const [historiesData, setHistoriesData] = useState<ResponseWithPaginationType<HistoryType[]>>();
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [loadingViewMore, setLoadingViewMore] = useState(false);
  const loadTaskHistories = async () => {
    try {
      if (!task) return;

      const response = await taskHistory(task.workspace_id, task.project_id, task.id, {
        page: 1,
        size: pageSize,
      });

      setLoadingViewMore(false);
      if (response && response.code === API_CODE.OK) {
        setHistoriesData(response.data);
      } else {
        displaySmallMessage("error", response.error?.message);
      }
    } catch (error) {
      setLoadingViewMore(false);
      displaySmallMessage("error", (error as BaseResponseType).error?.message);
    }
  };
  const handleLoadMore = () => {
    setLoadingViewMore(true);
    setPageSize(pageSize + defaultPageSize);
  };
  useEffect(() => {
    loadTaskHistories();
  }, [task, pageSize]);

  return (
    <div className="row">
      {
        historiesData && historiesData.items.map((item, index) => (
          <TaskHistoryItem history={item} key={index} />
        ))
      }
      {
        (historiesData && historiesData.total > defaultPageSize && pageSize < historiesData.total) &&
        <div className="col-12 mt-3">
          <a className="text-secondary pointer" onClick={!loadingViewMore ? handleLoadMore : undefined}>
            {loadingViewMore ? <Loading color="secondary" /> : t('btn_view_more')}
          </a>
        </div>
      }
    </div>
  );  
};

export default TaskHistory;