import UserAvatar from "@/common/components/AvatarName";
import DynamicIcon from "@/common/components/DynamicIcon";
import UserGroup from "@/common/components/UserGroup";
import { RootState } from "@/reduxs/store.redux";
import { ProjectAttributeItemType } from "@/types/project.type";
import { TaskType } from "@/types/task.type";
import { formatToTimestampString, getDaysDifference } from "@/utils/helper.util";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface TaskListItemProps {
  task: TaskType
  setTaskSelected: (taskSelected?: TaskType) => void
}

const TaskListItem: React.FC<TaskListItemProps> = ({ task, setTaskSelected }) => {
  const [priority, setPriority] = useState<ProjectAttributeItemType>();
  const [type, setType] = useState<ProjectAttributeItemType>();
  const [isExpire, setIsExpire] = useState<number>(1);
  const t = useTranslations();
  const isMember = useSelector((state: RootState) => state.projectSlide).isMember;
  useEffect(() => {
    const priority = task.attributes.find(a => a.default_name === 'priority');
    if (priority) {
      const priorityParse = JSON.parse(priority.value);
      setPriority((priorityParse && priorityParse.length > 0) ? priorityParse[0] : undefined);
    }

    const type = task.attributes.find(a => a.default_name === 'type');
    if (type) {
      const typeParse = JSON.parse(type.value);
      setType((typeParse && typeParse.length > 0) ? typeParse[0] : undefined);
    }

    setIsExpire(getDaysDifference(new Date(task.due)));
  }, [task]);
  return (
    <div className="task-item-list">
      <div className="task-col-name pointer" onClick={!isMember ? undefined : () => setTaskSelected (task)}>
        <h6 className="m-unset">
          {type && <DynamicIcon iconName={type.icon} style={{ color: type.color, marginRight: 6, fontSize: 15 }} />}
          <span className={isExpire === -1 ? 'text-secondary' : 'text-dark'}>{task.title}</span>
          {
            isExpire === -1 &&
            <p className="m-unset mt-1 text-secondary" style={{ fontSize: 12 }}><FontAwesomeIcon icon={faClock} /> {t('tasks.expire_label')}</p>
          }
        </h6>
      </div>
      <div className="task-col-date">{formatToTimestampString(new Date(task.created_at))}</div>
      <div className="task-col-date">{formatToTimestampString(new Date(task.due))}</div>
      <div className={`task-col-status`} style={{ color: task.status.color }}>
        {task.status.name}
      </div>
      <div className="task-col-assignee">
        {
          task.assign.length > 0 &&
          <UserGroup>
            {
              task.assign.map(user => (
                <UserAvatar key={user.id} name={user.first_name} avatar={user.avatar} />
              ))
            }
          </UserGroup>
        }
      </div>
      <div className={`task-col-priority`}>
        {priority && <DynamicIcon className="mr-2" iconName={priority.icon} style={{ color: priority.color }} />} {priority?.value}
      </div>
    </div>
  )
}
export default TaskListItem;