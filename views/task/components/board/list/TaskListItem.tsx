import { TaskType } from "@/types/task.type";
import { dateToString } from "@/utils/helper.util";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { MouseEvent, useEffect, useState } from "react";
import { ProjectType, ResponseTagsDataType } from "@/types/project.type";
import CreateTaskView from "@/views/task/create/CreateTaskView";
import SelectStatusModal from "./SelectStatusModal";
import { getIconPriority, getTypeClass, getTypeIcon } from "../grib/TaskItem";
import Link from "next/link";
import { APP_LINK, APP_LOCALSTORAGE } from "@/enums/app.enum";
import { useRouter } from "next/navigation";
import TaskListLoading from "./TaskListLoading";

interface TaskListItemProps {
  statusList?: ResponseTagsDataType
  task: TaskType
  index: number
  project: ProjectType
  setSearchStatus: (searchStatus: string) => void
}

const TaskListItem: React.FC<TaskListItemProps> = ({ task, index, project, statusList, setSearchStatus }) => {
  const [taskData, setTaskData] = useState(task);
  const [taskTitle, setTaskTitle] = useState(task.title);
  const [openEdit, setOpenEdit] = useState(false);
  const [openUpdateStatus, setOpenUpdateStatus] = useState(false);
  const [taskStatus, setTaskStatus] = useState(taskData.status);
  const router = useRouter();
  const redirectDetailTask = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const tasksStorage = localStorage.getItem(APP_LOCALSTORAGE.TASK_RECENTLY);
    if (tasksStorage) {
      const taskParse: TaskType[] = JSON.parse(tasksStorage);
      if (taskParse && taskParse.length > 0) {
        const taskFind = taskParse.find(t => t.id === taskData.id);
        if (!taskFind) {
          taskParse.unshift(taskData);
          localStorage.setItem(APP_LOCALSTORAGE.TASK_RECENTLY, JSON.stringify(taskParse));
          router.push(APP_LINK.WORKSPACE + '/' + task.workspace_id + '/project/' + project.id + '/task/' + task.id);
          return;
        }
      }
    }
    localStorage.setItem(APP_LOCALSTORAGE.TASK_RECENTLY, JSON.stringify([taskData]));
    router.push(APP_LINK.WORKSPACE + '/' + task.workspace_id + '/project/' + project.id + '/task/' + task.id);
  }
  useEffect(() => {
    setTaskData(task);
  }, [task]);

  useEffect(() => {
    setTaskTitle(taskData.title);
  }, [taskData.title]);
  return <>
    <tr>
      <td style={{minWidth: 350, cursor: 'pointer'}} onClick={() => setOpenEdit (true)}>
        <h6 className="text-secondary">
          {index}. {getTypeIcon(taskData.type.id, `text-${getTypeClass(taskData.type.id)} mr-2`)}
          <Link 
            href={APP_LINK.WORKSPACE + '/' + project.workspace_id + '/project/' + project.id + '/task/' + task.id} 
            className="text-secondary"
          >
            {taskTitle.length > 50 ? taskTitle.substring(0, 50) + '...' : taskTitle}
          </Link>
        </h6>
      </td>
      <td style={{minWidth: 150}}>
        <div className="card-header p-unset border-unset">
          <h6 
            className="card-title status-label" 
            style={{ background: taskStatus.color, fontSize: 12, padding: 5, cursor: 'pointer' }}
            onClick={() => setOpenUpdateStatus (true)}
          >
            <FontAwesomeIcon icon={faCircle} style={{ fontSize: 7, color: '#3333' }} className="mr-2" /> 
            {taskStatus.name}
          </h6>
        </div>
      </td>
      <td style={{minWidth: 150}}>
        <img src={taskData.user.avatar} className="img-circle mr-2" width={25} height={25} onError={(e) => e.currentTarget.src = '/img/icon/user-loading.png'} />
        <span className="text-muted created-by">{taskData.user.first_name} {taskData.user.last_name}</span>
      </td>
      <td style={{minWidth: 150}} className="text-secondary">Due: {dateToString(new Date(taskData.due))}</td>
      <td>
        {getIconPriority(taskData.priority.id, `mr-2 text-${getIconPriority(taskData.priority.id)}`)}
      </td>
    </tr>
    <CreateTaskView open={openEdit} setOpen={setOpenEdit} project={project} task={taskData} setTaskResponse={setTaskData} />
    <SelectStatusModal 
      taskStatus={taskStatus}
      openModal={openUpdateStatus} 
      setOpenModal={setOpenUpdateStatus} 
      setTaskStatus={setTaskStatus}
      setSearchStatus={setSearchStatus}
      statusList={statusList}
      taskId={task.id}
      projectId={project.id}
    />
  </>
}
export default TaskListItem;