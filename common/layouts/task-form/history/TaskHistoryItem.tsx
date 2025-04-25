import { HistoryType } from "@/types/task.type";
import { useTranslations } from "next-intl"
import React, { useEffect, useState } from "react";
import UserAvatar from "@/common/components/AvatarName";
import { dateToString, formatRelativeTime, isJsonLike } from "@/utils/helper.util";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RelativeTime from "@/common/components/RelativeTime";

interface TaskHistoryItemProps {
  history: HistoryType
}

const TaskHistoryItem: React.FC<TaskHistoryItemProps> = ({ history }) => {
  const t = useTranslations();
  const [timeText, setTimeText] = useState<string>('');
  useEffect(() => {
    const formatTime = formatRelativeTime(history.created_at);
    const formatTimeType = formatTime.type;
    const formatTimeNumber = formatTime.number;
    if (formatTimeType === 's') {
      setTimeText(formatTimeNumber + ' ' + t('tasks.history.sec_label'));
      return;
    }
    if (formatTimeType === 'm') {
      setTimeText(formatTimeNumber + ' ' +t ('tasks.history.minute_label'));
      return;
    }
    if (formatTimeType === 'h') {
      setTimeText(formatTimeNumber + ' ' + t('tasks.history.hour_label'));
      return;
    }
    if (formatTimeType === 'd') {
      setTimeText(formatTimeNumber + ' ' + t('tasks.history.day_label'));
      return;
    }
  }, [t]);
  return (
    <div className="col-12 mt-2">
      <div className="card history-card">
        <div className="card-body p-unset">
          <UserAvatar className="wp-logo me-2 float-left history-avatar" name={history.user.first_name} avatar={history.user.avatar} />
          <b>{history.user.first_name} {history.user.last_name}</b> <RelativeTime time={history.created_at} className="m-l-10" icon />
          <div className="text-muted mt-3">
            {
              history.content.map((history, key) => {
                if (history.field === 'title') {
                  return (
                    <span key={key}>
                      {t('tasks.history.updated_title') + ': '}
                      <p className="m-unset">{history.before} <FontAwesomeIcon icon={faArrowRight} className="ml-2 mr-2" /> {history.after}</p>
                    </span>
                  )
                }
                if (history.field === 'due') {
                  return (
                    <span key={key}>
                      {history.before ? t('tasks.history.updated_due') + ': ' : t('tasks.history.added_due') + ': '} 
                      <p className="m-unset">{history.before && dateToString(new Date(history.before))} {history.before && <FontAwesomeIcon icon={faArrowRight} className="ml-2 mr-2" />} {dateToString(new Date(history.after))}</p>
                    </span>
                  )
                }
                if (history.field === 'status') {
                  return (
                    <span key={key}>
                      {t('tasks.history.updated_status') + ': '}
                      <p className="m-unset">{JSON.parse(history.before).name} <FontAwesomeIcon icon={faArrowRight} className="ml-2 mr-2" /> {JSON.parse(history.after).name}</p>
                    </span>
                  )
                }
                if (history.field === 'description') {
                  return (
                    <span key={key}>{t('task_history.updated_description')}</span>
                  )
                }
                if (history.field === 'assignee') {
                  return (
                    <span key={key}>
                      {(history.before && history.before !== '[]') ? t('tasks.history.updated_assign') + ': ' : t('tasks.history.added_assign') + ': '} 
                      <p className="m-unset">{
                        (history.before && history.before !== '[]' && history.before.length > 0) && JSON.parse(history.before).map((u: any) => u.first_name + ' ' + u.last_name).join(', ')
                        } {
                          (history.before && history.before !== '[]') && <FontAwesomeIcon icon={faArrowRight} className="ml-2 mr-2" />
                          } {
                            (history.after && history.after !== '[]' && history.after.length > 0) ? JSON.parse(history.after).map((u: any) => u.first_name + ' ' + u.last_name).join(', ') : t('tasks.unassigned_label')
                            }
                            </p>
                    </span>
                  )
                }
                if (history.field === 'attribute') {
                  return (
                    <p key={key}>
                      {history.before ? t('tasks.history.added_label') + ': ' : t('tasks.history.updated_label') + ': '} {(history.before) && (isJsonLike(history.before) ? JSON.parse(history.before).map((u: any) => u.value).join(', ') : history.before)} {history.before && <FontAwesomeIcon icon={faArrowRight} className="ml-2 mr-2" />} {(history.after && history.after !== '[]') ? (isJsonLike(history.after) ? JSON.parse(history.after).map((u: any) => u.value).join(', ') : history.after) : t('tasks.history.no_value')}
                    </p>
                  )
                }
                if (history.field === 'file_added') {
                  return (
                    <span key={key}>
                      {t('tasks.history.added_file')}:
                      <p className="m-unset">
                        {(history.after && history.after !== '[]') ? JSON.parse(history.after).map((u: any) => u.name).join(', ') : ''}
                      </p>
                    </span>
                  )
                }
                if (history.field === 'file_removed') {
                  return (
                    <span key={key}>
                      {t('tasks.history.removed_file')}:
                      <p className="m-unset">
                        {(history.before && history.before !== '[]') ? JSON.parse(history.before).map((u: any) => u.name).join(', ') : ''}
                      </p>
                    </span>
                  )
                }
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}
export default TaskHistoryItem;