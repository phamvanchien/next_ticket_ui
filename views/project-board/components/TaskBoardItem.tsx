import UserAvatar from "@/common/components/AvatarName";
import DynamicIcon from "@/common/components/DynamicIcon";
import UserGroup from "@/common/components/UserGroup";
import { ProjectAttributeItemType } from "@/types/project.type";
import { TaskType } from "@/types/task.type";
import { dateToString, getDaysDifference } from "@/utils/helper.util";
import { faAngleDoubleUp, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "antd";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

interface TaskBoardItemProps {
  task: TaskType
  statusId: number
  draggingTask?: number
  setDraggingTask: (draggingTask?: number) => void;
  setDragOverStatus: (dragOverStatus?: number) => void;
  setTaskSelected: (taskSelected?: TaskType) => void;
}

const TaskBoardItem: React.FC<TaskBoardItemProps> = ({ 
  task, 
  statusId, 
  draggingTask, 
  setDraggingTask, 
  setDragOverStatus,
  setTaskSelected
}) => {
  const t = useTranslations();
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
  }, [task]);
  return (
    <div
      className={`card task-item ${draggingTask === task.id ? "dragging" : ""}`}
      draggable
      onMouseDown={(e) => e.stopPropagation()}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="card-body task-item-body" onClick={() => setTaskSelected (task)}>
        <h6>
          <span className={`${isExpire === -1 ? 'text-secondary' : 'text-dark'} full-text`}>{task.title}</span>
          {
            priority && <DynamicIcon iconName={priority.icon} className={`float-right`} style={{ color: priority.color }} />
          }
        </h6>
        {
          task.due &&
          <p className="text-muted m-unset">{t('tasks.due_label')}: 
            <span style={{ marginLeft: 4 }}>{dateToString(new Date(task.due))}</span>
          </p>
        }
        {
          (task.due && isExpire === -1) &&
          <p className="text-muted m-unset">
            <FontAwesomeIcon icon={faClock} /> {t('tasks.expire_label')}
          </p>
        }

        <div className="d-flex justify-content-between">
          <span className="text-muted small">
            {
              task.assign.length > 0 ?
              <UserGroup className="float-right mt-2">
                {
                  task.assign.map(user => (
                    <UserAvatar key={user.id} name={user.first_name} avatar={user.avatar} />
                  ))
                }
              </UserGroup> :
              <div className="d-flex align-items-center gap-2 mt-2">
                <Avatar src="/images/icons/no-user.png" />
                <span>{t('tasks.unassigned_label')}</span>
              </div>
            }
          </span>
          {
            type &&
            <span className="text-muted small p-t-20" style={{ fontSize: 15 }}>
              <DynamicIcon iconName={type.icon} style={{ color: type.color }} />
            </span>
          }
        </div>
      </div>
    </div>
  )
}
export default TaskBoardItem;