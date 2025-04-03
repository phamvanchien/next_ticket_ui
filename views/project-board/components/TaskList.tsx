import { ResponseWithPaginationType } from "@/types/base.type";
import { TaskType } from "@/types/task.type";
import React from "react";
import TaskListItem from "./TaskListItem";
import Button from "@/common/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleDown } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";
import { defaultSizeList } from "../ProjectBoardView";
import Loading from "@/common/components/Loading";

interface TaskListProps {
  taskList?: ResponseWithPaginationType<TaskType[]>
  pageSizeList: number
  loadingLoadMoreList: boolean
  setLoadingLoadMoreList: (loadingLoadMoreList: boolean) => void
  setPageSizeList: (pageSizeList: number) => void
}

const TaskList: React.FC<TaskListProps> = ({ taskList, pageSizeList, loadingLoadMoreList, setLoadingLoadMoreList, setPageSizeList }) => {
  const t = useTranslations();

  if (!taskList) {
    return;
  }

  const handleLoadMore = () => {
    setLoadingLoadMoreList(true);
    setPageSizeList(pageSizeList + defaultSizeList);
  }

  return (
    <div className="row">
      <div className="col-12">
        <div className="task-list-container">
          <div className="task-list-scroll-container">
            <div className="task-list-body">
              <div className="task-columns-header">
                <div className="task-col-name">Task Name</div>
                <div className="task-col-status">Status</div>
                <div className="task-col-assignee">Assignee</div>
                <div className="task-col-date">Date</div>
                <div className="task-col-priority">Priority</div>
              </div>
              {taskList.items.map((task, index) => (
                <TaskListItem key={index} task={task} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {
        (pageSizeList < taskList.total) &&
        <div className="col-12 mt-2">
          <Button color="default" onClick={loadingLoadMoreList ? undefined : handleLoadMore}>
            <FontAwesomeIcon icon={faAngleDoubleDown} /> {loadingLoadMoreList ? <Loading color="secondary" /> : t('btn_view_more')}
          </Button>
        </div>
      }
    </div>
  );
};

export default TaskList;