import EditorArea from "@/common/components/EditorArea"
import { faAngleDoubleLeft, faAngleDoubleRight, faPen } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useTranslations } from "next-intl"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"

interface TaskDescriptionProps {
  className?: string
  description: string
  taskId: number
  placeholder?: string
  disableReadMore?: boolean
  contentSize?: number
  setDescription: Dispatch<SetStateAction<string>>
}

const TaskDescription: React.FC<TaskDescriptionProps> = ({ className, taskId, disableReadMore, description, contentSize, setDescription }) => {
  const maxContentSize = contentSize ?? 800;
  const t = useTranslations();
  const [readMore, setReadMore] = useState(false);
  const [edit, setEdit] = useState(true);
  const [placeholderText, setPlaceholderText] = useState(t('tasks.placeholder_task_description'));
  useEffect(() => {
    setEdit(false);
  }, [taskId])
  return (
    <div className="row mt-4">
      <div className="col-12">
        {
          (!edit) &&
          <i className="text-secondary pointer" onClick={() => setEdit (true)}>
            <FontAwesomeIcon icon={faPen} /> {t('tasks.write_description_label')}
          </i>
        }
        {(edit) ? (
          <div>
            <EditorArea value={description} setValue={setDescription} placeholder={placeholderText} />
          </div>
        ) : (
          (description && description !== '') && (
            <p
              dangerouslySetInnerHTML={disableReadMore ? {__html: description} : {
                __html: (readMore || (description.length < maxContentSize))
                  ? description
                  : description.substring(0, maxContentSize),
              }}
              onClick={() => setEdit(true)}
              className="mt-2"
            ></p>
          )
        )}
        {description && !edit && description.length > maxContentSize && !readMore && (
          <span
            style={{ cursor: "pointer" }}
            className="text-secondary"
            onClick={() => setReadMore(true)}
          >
            {t('btn_read_more')} <FontAwesomeIcon icon={faAngleDoubleRight} />
          </span>
        )}
        {description && !edit && description.length > maxContentSize && readMore && (
          <span
            style={{ cursor: "pointer" }}
            className="text-secondary"
            onClick={() => setReadMore(false)}
          >
            <FontAwesomeIcon icon={faAngleDoubleLeft} /> {t('btn_hide_read_more')}
          </span>
        )}
      </div>
    </div>
  )
}
export default TaskDescription;