import { tasks } from "@/api/task.api";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { catchError } from "@/services/base.service";
import { AppErrorType, BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
import { ProjectTagType, ProjectType } from "@/types/project.type";
import { TaskPriorityType, TaskType, TaskTypeItem } from "@/types/task.type";
import React, { MouseEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TaskListItem from "./TaskListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleDown } from "@fortawesome/free-solid-svg-icons";
import Loading from "@/common/components/Loading";
import { statusList } from "@/api/project.api";
import { ResponseUserDataType } from "@/types/user.type";
import TaskListLoading from "./TaskListLoading";
import { dateToStamptimeString } from "@/utils/helper.util";
import { useTranslations } from "next-intl";

interface TaskListViewProps {
  project: ProjectType
  taskIncome?: TaskType
  keyword: string
  assignee: ResponseUserDataType[]
  creator: ResponseUserDataType[]
  priority: TaskPriorityType[]
  tags: ProjectTagType[]
  type: TaskTypeItem[]
  prioritySort?: "DESC" | "ASC"
  dueSort?: "DESC" | "ASC"
  dueDateFilter?: Date[]
  createdDateFilter?: Date[]
  setTotalTask: (totalTask: number) => void
}

const TaskListView: React.FC<TaskListViewProps> = ({ 
  project, 
  taskIncome, 
  keyword,
  assignee,
  creator,
  priority,
  tags,
  type,
  prioritySort,
  dueSort,
  dueDateFilter,
  createdDateFilter,
  setTotalTask
}) => {
  const defaultPagesize = 10;
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const [tasksData, setTasksData] = useState<ResponseWithPaginationType<TaskType[]>>();
  const [error, setError] = useState<AppErrorType | null>(null);
  const [pageSize, setPageSize] = useState<number>(defaultPagesize);
  const [loadingViewMore, setLoadingViewMore] = useState(false);
  const [statusData, setStatusData] = useState<ResponseWithPaginationType<ProjectTagType[]>>();
  const [searchStatus, setSearchStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const t = useTranslations();
  const handleViewMore = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setLoadingViewMore(true);
    setPageSize(pageSize + defaultPagesize);
  }
  const loadTasks = async () => {
    try {
      if (!workspace) {
        return;
      }

      const response = await tasks(workspace.id, project.id, {
        page: 1,
        size: pageSize,
        keyword: keyword,
        assignee: assignee.map(a => a.id).join(','),
        tags: tags.map(t => t.id).join(','),
        priority: priority.map(p => p.id).join(','),
        creator: creator.map(c => c.id).join(','),
        type: type.map(t => t.id).join(','),
        sortCreatedAt: (prioritySort || dueSort) ? undefined : 'DESC',
        sortPriority: prioritySort,
        sortDue: dueSort,
        fromDue: (dueDateFilter && dueDateFilter.length > 1) ? dateToStamptimeString(dueDateFilter[1]) + ' 00:00:00' : undefined,
        toDue: (dueDateFilter && dueDateFilter.length > 1) ? dateToStamptimeString(dueDateFilter[0]) + ' 23:59:59' : undefined,
        fromCreated: (createdDateFilter && createdDateFilter.length > 1) ? dateToStamptimeString(createdDateFilter[1]) + ' 00:00:00' : undefined,
        toCreated: (createdDateFilter && createdDateFilter.length > 1) ? dateToStamptimeString(createdDateFilter[0]) + ' 23:59:59' : undefined,
      });
      setLoadingViewMore(false);
      setLoading(false);
      if (response && response.code === API_CODE.OK) {
        setTasksData(response.data);
        if (!tasksData) {
          setTotalTask(response.data.total);
        }
        return;
      }
      setError(catchError(response));
    } catch (error) {
      setLoadingViewMore(false);
      setLoading(false);
      setError(catchError(error as BaseResponseType));
    }
  }
  const loadStatus = async () => {
    try {
      if (!workspace) {
        return;
      }
      const response = await statusList(workspace.id, project.id, {
        page: 1,
        size: 5,
        keyword: searchStatus
      });
      if (response && response.code === API_CODE.OK) {
        setStatusData(response.data);
        return;
      }
      setStatusData(undefined);
    } catch (error) {
      setStatusData(undefined);
    }
  }
  useEffect(() => {
    loadTasks();
  }, [pageSize, keyword, assignee, tags, priority, creator, type, prioritySort, dueSort, dueDateFilter, createdDateFilter]);
  useEffect(() => {
    if (taskIncome) {
      loadTasks();
    }
  }, [taskIncome]);
  useEffect(() => {
    loadStatus();
  }, [searchStatus]);
  if (loading) {
    return <TaskListLoading />
  }
  return (
    <div className="row mt-4">
      <div className="col-12">
        <div className="table-responsive">
          <table className="table table-striped">
            <tbody>
              {
                tasksData && tasksData.items.map((task, index) => (
                  <TaskListItem 
                    index={index + 1} 
                    key={task.id} 
                    task={task} 
                    project={project} 
                    statusList={statusData} 
                    setSearchStatus={setSearchStatus} 
                  />
                ))
              }
              {
                (tasksData && tasksData.total > pageSize) &&
                <tr>
                  <td colSpan={5} className="text-left">
                    <a href="#" className="text-secondary" onClick={!loadingViewMore ? handleViewMore : undefined}>
                      
                      {t('btn_view_more')} {loadingViewMore ? <Loading color="secondary" /> : <FontAwesomeIcon icon={faAngleDoubleDown} />}
                    </a>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
export default TaskListView;