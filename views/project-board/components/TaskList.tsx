import { ResponseWithPaginationType } from "@/types/base.type";
import { TaskType } from "@/types/task.type";
import React from "react";
import TaskListItem from "./TaskListItem";
import Button from "@/common/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleDown, faArrowDown, faArrowUp, faSort, faSortAlphaAsc, faSortAlphaDesc, faSortAsc, faSortDesc } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";
import { defaultSizeList } from "../ProjectBoardView";
import Loading from "@/common/components/Loading";
import { faSortAmountAsc } from "@fortawesome/free-solid-svg-icons/faSortAmountAsc";
import NoData from "@/common/components/NoData";

interface TaskListProps {
  taskList?: ResponseWithPaginationType<TaskType[]>
  pageSizeList: number
  loadingLoadMoreList: boolean
  sortTitle?: "DESC" | "ASC"
  sortCreatedAt?: "DESC" | "ASC"
  sortDue?: "DESC" | "ASC"
  setLoadingLoadMoreList: (loadingLoadMoreList: boolean) => void
  setPageSizeList: (pageSizeList: number) => void
  setSortTitle: (sortTitle?: "DESC" | "ASC") => void
  setSortCreatedAt: (sortCreatedAt?: "DESC" | "ASC") => void
  setSortDue: (sortDue?: "DESC" | "ASC") => void
  setTaskSelected: (taskSelected?: TaskType) => void
}

const TaskList: React.FC<TaskListProps> = ({ 
  taskList, 
  pageSizeList, 
  loadingLoadMoreList,
  sortTitle,
  sortCreatedAt,
  sortDue,
  setLoadingLoadMoreList, 
  setPageSizeList,
  setSortTitle,
  setSortCreatedAt,
  setSortDue,
  setTaskSelected
}) => {
  const t = useTranslations();

  if (!taskList) {
    return;
  }

  const handleLoadMore = () => {
    setLoadingLoadMoreList(true);
    setPageSizeList(pageSizeList + defaultSizeList);
  }

  const handleSortTitle = () => {
    if (!sortTitle) {
      setSortTitle("DESC");
      return;
    }
    if (sortTitle === "DESC") {
      setSortTitle("ASC");
      return;
    }
    if (sortTitle === "ASC") {
      setSortTitle(undefined);
      return;
    }
  }

  const handleSortCreatedAt = () => {
    if (!sortCreatedAt) {
      setSortCreatedAt("DESC");
      return;
    }
    if (sortCreatedAt === "DESC") {
      setSortCreatedAt("ASC");
      return;
    }
    if (sortCreatedAt === "ASC") {
      setSortCreatedAt(undefined);
      return;
    }
  }

  const handleSortDue = () => {
    if (!sortDue) {
      setSortDue("DESC");
      return;
    }
    if (sortDue === "DESC") {
      setSortDue("ASC");
      return;
    }
    if (sortDue === "ASC") {
      setSortDue(undefined);
      return;
    }
  }

  if (taskList.total === 0) {
    return (
      <NoData message={t('tasks_page.task_not_found')}>
        <center className="d-none d-lg-block">
          
        </center>
      </NoData>
    )
  }

  return (
    <div className="row">
      <div className="col-12">
        <div className="task-list-container">
          <div className="task-list-scroll-container">
            <div className="task-list-body">
              <div className="task-columns-header">
                <div className="task-col-name pointer" onClick={handleSortTitle}>
                  {t('tasks_page.title_label')} <FontAwesomeIcon className={sortTitle ? 'text-primary' : ''} icon={sortTitle === 'ASC' ? faSortAlphaAsc : faSortAlphaDesc} />
                </div>
                <div className="task-col-date pointer" onClick={handleSortCreatedAt}>
                  {t('common.created_at_label')} <FontAwesomeIcon className={sortCreatedAt ? 'text-primary' : ''} icon={sortCreatedAt === 'ASC' ? faArrowUp : faArrowDown} />
                </div>
                <div className="task-col-date pointer" onClick={handleSortDue}>
                  {t('tasks_page.due_label')} <FontAwesomeIcon className={sortDue ? 'text-primary' : ''} icon={sortDue === 'ASC' ? faArrowUp : faArrowDown} />
                </div>
                <div className="task-col-status">
                  {t('tasks_page.status_label')}
                </div>
                <div className="task-col-assignee">
                  {t('tasks_page.assignee_label')}
                </div>
                <div className="task-col-priority">
                  {t('tasks_page.priority_label')}
                </div>
              </div>
              {taskList.items.map((task, index) => (
                <TaskListItem setTaskSelected={setTaskSelected} key={index} task={task} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {
        (pageSizeList < taskList.total) &&
        <div className="col-12 mt-2">
          <Button color="default" onClick={loadingLoadMoreList ? undefined : handleLoadMore}>
            <FontAwesomeIcon icon={faAngleDoubleDown} /> {loadingLoadMoreList ? <Loading color="secondary" /> : t('common.btn_view_more')}
          </Button>
        </div>
      }
    </div>
  );
};

export default TaskList;