import { TaskType } from "@/types/task.type";
import { dateToString, notify } from "@/utils/helper.util";
import React, { MouseEvent, useEffect, useState } from "react";
import { ProjectTagType, ProjectType } from "@/types/project.type";
import CreateTaskView from "@/views/task/create/CreateTaskView";
import { getIconPriority, getTypeClass, getTypeIcon } from "../grib/TaskItem";
import Link from "next/link";
import { APP_ERROR, APP_LINK, APP_LOCALSTORAGE, IMAGE_DEFAULT } from "@/enums/app.enum";
import { useRouter } from "next/navigation";
import { BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
import { useTranslations } from "next-intl";
import { Avatar, Divider, Dropdown, Tag, Tooltip } from "antd";
import { catchError } from "@/services/base.service";
import { API_CODE } from "@/enums/api.enum";
import { update } from "@/api/task.api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faUser } from "@fortawesome/free-solid-svg-icons";
import { icon } from "@fortawesome/fontawesome-svg-core";
import UserGroup from "@/common/components/UserGroup";

interface TaskListItemProps {
  statusList?: ResponseWithPaginationType<ProjectTagType[]>
  task: TaskType
  index: number
  project: ProjectType
  setSearchStatus: (searchStatus: string) => void
}

const TaskListItem: React.FC<TaskListItemProps> = ({ task, index, project, statusList, setSearchStatus }) => {
  const [taskData, setTaskData] = useState(task);
  const [taskTitle, setTaskTitle] = useState(task.title);
  const [openEdit, setOpenEdit] = useState(false);
  const [taskStatus, setTaskStatus] = useState(taskData.status);
  const [assigneeData, setAssigneeData] = useState(taskData.assign);
  const router = useRouter();
  const t = useTranslations();
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
  const updateStatusTask = async (status: ProjectTagType) => {
    try {
      if (status.id === taskStatus.id) {
        setSearchStatus('');
        return;
      }
      const response = await update(project.workspace_id, project.id, taskData.id, {
        status_id: status.id
      });
      if (response && response.code === API_CODE.OK) {
        setTaskStatus(status);
        return;
      }
      notify(catchError(response)?.message ?? APP_ERROR.SERVER_MAINTAIN, 'error');
    } catch (error) {
      notify(catchError(error as BaseResponseType)?.message ?? APP_ERROR.SERVER_MAINTAIN, 'error');
    }
  }
  useEffect(() => {
    setTaskData(task);
  }, [task]);

  useEffect(() => {
    setTaskTitle(taskData.title);
  }, [taskData.title]);
  useEffect(() => {
    setAssigneeData(taskData.assign);
  }, taskData.assign);
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
          <Dropdown menu={{ items: statusList?.items.map(s => {
            return {
              key: s.id,
              label: (
                <Tag color={s.color} className="p-5 pointer" onClick={() => updateStatusTask (s)}>
                  <FontAwesomeIcon icon={faCircle} style={{fontSize: 13}} /> {s.name}
                </Tag>
              )
            }
          }) }} placement="bottomLeft" trigger={["click"]}>
            <Tag color={taskStatus.color} className="p-5 pointer">
              <FontAwesomeIcon icon={faCircle} style={{fontSize: 13}} /> {taskStatus.name}
            </Tag>
          </Dropdown>
        </div>
      </td>
      <td style={{minWidth: 150}}>
        {/* <img src={taskData.user.avatar ?? IMAGE_DEFAULT.NO_USER} className="img-circle mr-2" width={25} height={25} onError={(e) => e.currentTarget.src = IMAGE_DEFAULT.NO_USER} />
        <span className="text-muted created-by">{taskData.user.first_name} {taskData.user.last_name}</span> */}
        {/* <Avatar.Group
          max={{
            count: 2,
            style: { color: '#f56a00', backgroundColor: '#fde3cf' },
          }}
        >
          <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />
          <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
          <Tooltip title="Ant User" placement="top">
            <Avatar style={{ backgroundColor: '#87d068' }} icon={<FontAwesomeIcon icon={faUser} />} />
          </Tooltip>
          <Avatar style={{ backgroundColor: '#1677ff' }} icon={<FontAwesomeIcon icon={faUser} />} />
        </Avatar.Group> */}
        <UserGroup users={assigneeData} />
      </td>
      <td style={{minWidth: 150}} className="text-secondary">{t('tasks.due_label')}: {dateToString(new Date(taskData.due))}</td>
      <td>
        {getIconPriority(taskData.priority.id, `mr-2 text-${getIconPriority(taskData.priority.id)}`)}
      </td>
    </tr>
    <CreateTaskView open={openEdit} setOpen={setOpenEdit} project={project} task={taskData} setTaskResponse={setTaskData} />
  </>
}
export default TaskListItem;