import { HistoryContentType, HistoryType } from "@/types/task.type";
import { dateToString, priorityRange, taskType } from "@/utils/helper.util";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React from "react";

interface TaskHistoryItemProps {
  history: HistoryContentType
}

const TaskHistoryItem: React.FC<TaskHistoryItemProps> = ({ history }) => {
  const t = useTranslations();
  return (
    <div className="card mt-2">
      <div className="card-body p-5 text-muted">
        {
          history.field === 'title' &&
          <span><b>- {t('tasks.title_label')}:</b> {history.before} <FontAwesomeIcon icon={faArrowRight} className="ml-2 mr-2" /> {history.after}</span>
        }
        {
          history.field === 'due' &&
          <span><b>- {t('tasks.due_label')}:</b> {dateToString(new Date(history.before))} <FontAwesomeIcon icon={faArrowRight} className="ml-2 mr-2" /> {dateToString(new Date(history.after))}</span>
        }
        {
          history.field === 'status' &&
          <span><b>- {t('tasks.status_label')}:</b> {JSON.parse(history.before).name} <FontAwesomeIcon icon={faArrowRight} className="ml-2 mr-2" /> {JSON.parse(history.after).name}</span>
        }
        {
          history.field === 'type' &&
          <span><b>- {t('tasks.type_label')}:</b> {taskType(Number(history.before))[0].title} <FontAwesomeIcon icon={faArrowRight} className="ml-2 mr-2" /> {taskType(Number(history.after))[0].title}</span>
        }
        {
          history.field === 'assignee' &&
          <span><b>- {t('tasks.assignee_label')}:</b> {JSON.parse(history.before).map((u: any) => u.first_name + ' ' + u.last_name).join(', ')} <FontAwesomeIcon icon={faArrowRight} className="ml-2 mr-2" /> {JSON.parse(history.after).map((u: any) => u.first_name + ' ' + u.last_name).join(', ')}</span>
        }
        {
          history.field === 'priority' &&
          <span><b>- {t('tasks.priority_label')}:</b> {priorityRange().find(p => p.id === Number(history.before))?.title} <FontAwesomeIcon icon={faArrowRight} className="ml-2 mr-2" /> {priorityRange().find(p => p.id === Number(history.after))?.title}</span>
        }
        {
          history.field === 'tags' &&
          <span><b>- {t('tasks.tags_label')}:</b> {JSON.parse(history.before).map((u: any) => u.name).join(', ')} <FontAwesomeIcon icon={faArrowRight} className="ml-2 mr-2" /> {JSON.parse(history.after).map((u: any) => u.name).join(', ')}</span>
        }
        {
          history.field === 'description' &&
          <span>{t('task_history.updated_description')}</span>
        }
      </div>
    </div>
  )
}
export default TaskHistoryItem;