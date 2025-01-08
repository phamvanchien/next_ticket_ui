import { TaskType } from "@/types/task.type";
import { dateToString } from "@/utils/helper.util";
import { getIconPriority, getTypeClass, getTypeIcon } from "@/views/task/components/board/grib/TaskItem";
import React from "react";

interface TaskItemRecentlyProps {
  task: TaskType
}

const TaskItemRecently: React.FC<TaskItemRecentlyProps> = ({ task }) => {
  return (
    <div
      className={`card task-item`}
      style={{ marginRight: 10 }}
    >
      <div className="card-body mt-2" style={{ padding: 15 }}>
        <h6>
          <a 
            href={'#'} 
            className="text-dark"
          >
            {task.title.length > 35 ? task.title.substring(0, 35) + '...' : task.title}
          </a>
        </h6>
        <div>
          <p className="text-secondary task-due">Due: {dateToString(new Date(task.due))}</p>
          <img src={task.user.avatar ?? '/img/icon/user-loading.png'} className="img-circle mr-2" width={25} height={25} onError={(e) => e.currentTarget.src = '/img/icon/user-loading.png'} />
          <span className="text-muted created-by">{task.user.first_name} {task.user.last_name}</span>
          <p className="mt-4">
            {getIconPriority(task.priority.id)}
            {getTypeIcon(task.type.id, `float-right text-${getTypeClass(task.type.id)}`)}
          </p>
        </div>
      </div>
    </div>
  )
}
export default TaskItemRecently;