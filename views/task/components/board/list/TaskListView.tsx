import { tasks } from "@/api/task.api";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { catchError } from "@/services/base.service";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import { ProjectType, ResponseTagsDataType, ResponseTagType } from "@/types/project.type";
import { ResponseTasksDataType, TaskPriorityType, TaskType, TaskTypeItem } from "@/types/task.type";
import React, { MouseEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TaskListItem from "./TaskListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleDown } from "@fortawesome/free-solid-svg-icons";
import Loading from "@/common/components/Loading";
import { statusList } from "@/api/project.api";
import { ResponseUserDataType } from "@/types/user.type";

interface TaskListViewProps {
  project: ProjectType
  taskIncome?: TaskType
  keyword: string
  assignee: ResponseUserDataType[]
  setAssignee: (assignee: ResponseUserDataType[]) => void
  creator: ResponseUserDataType[]
  setCreator: (creator: ResponseUserDataType[]) => void,
  priority: TaskPriorityType[]
  setPriority: (priority: TaskPriorityType[]) => void,
  tags: ResponseTagType[]
  setTags: (tags: ResponseTagType[]) => void,
  type: TaskTypeItem[]
  setType: (type: TaskTypeItem[]) => void
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
  setType,
  setTags,
  setPriority,
  setCreator,
  setAssignee,
}) => {
  const defaultPagesize = 10;
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const [tasksData, setTasksData] = useState<ResponseTasksDataType>();
  const [error, setError] = useState<AppErrorType | null>(null);
  const [pageSize, setPageSize] = useState<number>(defaultPagesize);
  const [loadingViewMore, setLoadingViewMore] = useState(false);
  const [statusData, setStatusData] = useState<ResponseTagsDataType>();
  const [searchStatus, setSearchStatus] = useState<string>('');
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
        sortCreatedAt: 'DESC'
      });
      setLoadingViewMore(false);
      if (response && response.code === API_CODE.OK) {
        setTasksData(response.data);
        return;
      }
      setError(catchError(response));
    } catch (error) {
      setLoadingViewMore(false);
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
  }, [pageSize, keyword, assignee, tags, priority, creator, type]);
  useEffect(() => {
    if (taskIncome) {
      loadTasks();
    }
  }, [taskIncome]);
  useEffect(() => {
    loadStatus();
  }, [searchStatus]);
  return (
    <div className="row mt-4">
      <div className="col-12">
        <div className="table-responsive">          
          <table className="table">
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
                    <a href="#" className="link" onClick={!loadingViewMore ? handleViewMore : undefined}>
                      {loadingViewMore ? <>Loading <Loading color="primary" /></> : <>View more <FontAwesomeIcon icon={faAngleDoubleDown} /></>}
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