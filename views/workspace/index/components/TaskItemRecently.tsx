import { APP_LINK, IMAGE_DEFAULT } from "@/enums/app.enum";
import { TaskType } from "@/types/task.type";
import { dateToString } from "@/utils/helper.util";
import { getIconPriority, getTypeClass, getTypeIcon } from "@/views/task/components/board/grib/TaskItem";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface TaskItemRecentlyProps {
  task: TaskType
}

const TaskItemRecently: React.FC<TaskItemRecentlyProps> = ({ task }) => {
  const t = useTranslations();
  const router = useRouter();
  const taskLink: string = APP_LINK.WORKSPACE + '/' + task.workspace_id + '/project/' + task.project_id + '/task/' + task.id;
  return (
    <div
      className={`card task-item`}
      style={{ marginRight: 10 }}
    >
      <div className="card-body mt-2" style={{ padding: 15 }} onClick={() => router.push(taskLink)}>
        <h6>
          <Link
            href={taskLink}
            className="text-dark"
          >
            {task.title.length > 25 ? task.title.substring(0, 25) + '...' : task.title}
          </Link>
        </h6>
        <div>
          <p className="text-secondary task-due">{t('tasks.due_label')}: {dateToString(new Date(task.due))}</p>
          <img src={task.user.avatar ?? IMAGE_DEFAULT.NO_USER} className="img-circle mr-2" width={25} height={25} onError={(e) => e.currentTarget.src = IMAGE_DEFAULT.NO_USER} />
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