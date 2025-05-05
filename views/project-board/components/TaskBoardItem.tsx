import UserAvatar from "@/common/components/AvatarName";
import DynamicIcon from "@/common/components/DynamicIcon";
import UserGroup from "@/common/components/UserGroup";
import { RootState } from "@/reduxs/store.redux";
import { ProjectAttributeItemType } from "@/types/project.type";
import { TaskType } from "@/types/task.type";
import { dateToString, getDaysDifference } from "@/utils/helper.util";
import { faAngleDoubleUp, faCalendarAlt, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "antd";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface TaskBoardItemProps {
  task: TaskType
  statusId: number
  draggingTask?: number
  taskSelected?: TaskType
  setDraggingTask: (draggingTask?: number) => void;
  setDragOverStatus: (dragOverStatus?: number) => void;
  setTaskSelected: (taskSelected?: TaskType) => void;
}

const TaskBoardItem: React.FC<TaskBoardItemProps> = ({ 
  task, 
  statusId, 
  draggingTask, 
  taskSelected,
  setDraggingTask, 
  setDragOverStatus,
  setTaskSelected
}) => {
  const t = useTranslations();
  const taskCreated = useSelector((state: RootState) => state.taskSlide).taskCreated;
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("task", JSON.stringify(task));
    e.dataTransfer.setData("source", statusId.toString());
    setDraggingTask(task.id);

    e.currentTarget.classList.add("dragging");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggingTask(undefined);
    setDragOverStatus(undefined);

    e.currentTarget.classList.remove("dragging");
  };

  const [priority, setPriority] = useState<ProjectAttributeItemType>();
  const [type, setType] = useState<ProjectAttributeItemType>();
  const [isExpire, setIsExpire] = useState<number>(1);
  const [totalSubtask, setTotalSubtask] = useState(task.sub_tasks.total);
  const [totalSubtaskDone, setTotalSubtaskDone] = useState(task.sub_tasks.totalDone);
  const [taskPercent, setTaskPercent] = useState((totalSubtaskDone / totalSubtask) * 100);
  const isMember = useSelector((state: RootState) => state.projectSlide).isMember;
  useEffect(() => {
    const priority = task.attributes.find(a => a.default_name === 'priority');
    if (priority) {
      const priorityParse = JSON.parse(priority.value);
      setPriority((priorityParse && priorityParse.length > 0) ? priorityParse[0] : undefined);
    }

    const type = task.attributes.find(a => a.default_name === 'type');
    if (type && type.value !== '') {
      const typeParse = JSON.parse(type.value);
      setType((typeParse && typeParse.length > 0) ? typeParse[0] : undefined);
    }

    setIsExpire(getDaysDifference(new Date(task.due)));
    setTotalSubtaskDone(task.sub_tasks.totalDone);
    setTotalSubtask(task.sub_tasks.total);
  }, [task]);
  useEffect(() => {
    if (totalSubtask > 0) {
      setTaskPercent((totalSubtaskDone / totalSubtask) * 100);
    } else {
      setTaskPercent(0);
    }
  }), [totalSubtask, totalSubtaskDone];
  return (
<div
  className={`card task-item ${draggingTask === task.id ? "dragging" : ""}`}
  draggable={isMember}
  onMouseDown={(e) => e.stopPropagation()}
  onDragStart={handleDragStart}
  onDragEnd={handleDragEnd}
>
  <div
    className={`card-body task-item-body 
      ${taskCreated?.id === task.id ? 'glow-box-success' : ''} 
      ${taskSelected?.id === task.id ? 'glow-box-primary' : ''}`
    }
    onClick={!isMember ? undefined : () => setTaskSelected(task)}
  >

    <div className="d-flex justify-content-between align-items-start mb-2">
      <span className={`task-title ${isExpire === -1 ? 'text-secondary' : 'text-dark'}`}>{task.title}</span>
      {priority && (
        <DynamicIcon iconName={priority.icon} className="priority-icon" style={{ color: priority.color }} />
      )}
    </div>

    {task.due && (
      <div className="d-flex align-items-center text-muted mb-1" style={{ fontSize: 13 }}>
        <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
        <span>{dateToString(new Date(task.due))}</span>
        {isExpire === -1 && (
          <span className="ms-2 text-secondary">
            <FontAwesomeIcon icon={faClock} className="me-1" style={{ color: '#ffda6a' }} />
            {t('tasks_page.expire_label')}
          </span>
        )}
      </div>
    )}

    <div className="d-flex justify-content-between align-items-center mt-3">
      <div className="d-flex align-items-center gap-2">
        {task.assign.length > 0 ? (
          <UserGroup>
            {task.assign.map(user => (
              <UserAvatar key={user.id} name={user.first_name} avatar={user.avatar} />
            ))}
          </UserGroup>
        ) : (
          <div className="d-flex align-items-center gap-2">
            <Avatar src="/images/icons/no-user.png" />
            <span className="text-muted small">{t('tasks_page.unassigned_label')}</span>
          </div>
        )}
      </div>
      {type && (
        <DynamicIcon iconName={type.icon} style={{ color: type.color, fontSize: 16 }} />
      )}
    </div>

    {taskPercent > 0 && (
      <div className="progress mt-3" style={{ height: 5 }}>
        <div
          className={`progress-bar progress-bar-striped ${taskPercent >= 100 ? 'bg-success' : ''}`}
          role="progressbar"
          style={{ width: `${taskPercent}%` }}
        />
      </div>
    )}
  </div>
</div>

  )
}
export default TaskBoardItem;