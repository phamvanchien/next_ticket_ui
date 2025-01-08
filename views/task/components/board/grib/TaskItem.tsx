import { TaskType } from "@/types/task.type";
import { dateToString } from "@/utils/helper.util";
import React, { MouseEvent, useEffect, useState } from "react";
import CreateTaskView from "../../../create/CreateTaskView";
import { ProjectType } from "@/types/project.type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faBug, faCheckSquare, faClone, faEquals, faExclamationCircle, faLineChart, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { APP_LINK, APP_LOCALSTORAGE } from "@/enums/app.enum";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxs/store.redux";
import { useRouter } from "next/navigation";

interface TaskItemProps {
  task: TaskType
  statusKey: number
  draggingTask?: number
  project: ProjectType
  setDraggingTask: (draggingTask?: number) => void;
  setDragOverStatus: (dragOverStatus?: number) => void;
}

export const getTypeClass = (id: number) => {
  if (id === 1 || id === 2) return 'primary';
  if (id === 3 || id === 5) return 'success';
  if (id === 4) return 'danger'
  if (id === 6) return 'warning'
  return 'default';
};
export const getTypeIcon = (id: number, className?: string) => {
  if (id === 1) return <FontAwesomeIcon icon={faCheckSquare} className={className ?? ''} />;
  if (id === 2) return <FontAwesomeIcon icon={faClone} className={className ?? ''} />;
  if (id === 3) return <FontAwesomeIcon icon={faPlusSquare} className={className ?? ''} />;
  if (id === 4) return <FontAwesomeIcon icon={faBug} className={className ?? ''} />;
  if (id === 5) return <FontAwesomeIcon icon={faLineChart} className={className ?? ''} />;
  if (id === 6) return <FontAwesomeIcon icon={faExclamationCircle} className={className ?? ''} />;
  return <FontAwesomeIcon icon={faCheckSquare} className={className ?? ''} />;
}
export const getIconPriority = (id: number, className?: string) => {
  if (id === 1) return <FontAwesomeIcon icon={faArrowUp} className={`text-danger ${className ?? ''}`} />;
  if (id === 2) return <FontAwesomeIcon icon={faEquals} className={`text-warning ${className ?? ''}`} />;
  if (id === 3) return <FontAwesomeIcon icon={faArrowDown} className={`text-success ${className ?? ''}`} />;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, statusKey, draggingTask, project, setDraggingTask, setDragOverStatus }) => {
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const router = useRouter();
  const [taskData, setTaskData] = useState(task);
  const [taskTitle, setTaskTitle] = useState(task.title);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    setTaskData(task);
  }, [task]);

  useEffect(() => {
    setTaskTitle(taskData.title);
  }, [taskData.title]);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("task", JSON.stringify(taskData));
    e.dataTransfer.setData("source", statusKey.toString());
    setDraggingTask(taskData.id);

    e.currentTarget.classList.add("dragging");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggingTask(undefined);
    setDragOverStatus(undefined);

    e.currentTarget.classList.remove("dragging");
  };

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
          router.push(APP_LINK.WORKSPACE + '/' + workspace?.id + '/project/' + project.id + '/task/' + task.id);
          return;
        }
      }
    }
    localStorage.setItem(APP_LOCALSTORAGE.TASK_RECENTLY, JSON.stringify([taskData]));
    router.push(APP_LINK.WORKSPACE + '/' + workspace?.id + '/project/' + project.id + '/task/' + task.id);
  }

  return (
    <>
      <CreateTaskView open={openEdit} setOpen={setOpenEdit} project={project} task={taskData} setTaskResponse={setTaskData} />
      <div
        className={`card task-item ${draggingTask === taskData.id ? "dragging" : ""}`}
        draggable
        onMouseDown={(e) => e.stopPropagation()}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="card-body mt-2" style={{ padding: 15 }}>
          <h6>
            <Link 
              href={'#'} 
              className="text-dark"
              title={taskTitle}
              onClick={redirectDetailTask}
            >
              {taskTitle.length > 35 ? taskTitle.substring(0, 35) + '...' : taskTitle}
            </Link>
          </h6>
          <div onClick={() => setOpenEdit(true)}>
            <p className="text-secondary task-due">Due: {dateToString(new Date(taskData.due))}</p>
            <img src={taskData.user.avatar} className="img-circle mr-2" width={25} height={25} onError={(e) => e.currentTarget.src = '/img/icon/user-loading.png'} />
            <span className="text-muted created-by">{taskData.user.first_name} {taskData.user.last_name}</span>
            <p className="mt-4">
              {getIconPriority(taskData.priority.id)}
              {getTypeIcon(taskData.type.id, `float-right text-${getTypeClass(taskData.type.id)}`)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskItem;