import Button from "@/common/components/Button";
import EditorArea from "@/common/components/EditorArea";
import { faAngleDoubleLeft, faAngleDoubleRight, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

interface TaskDescriptionProps {
  description: string;
  setDescription: Dispatch<SetStateAction<string>>
}

const TaskDescription: React.FC<TaskDescriptionProps> = ({ description, setDescription }) => {
  const maxContentSize = 800;
  const t = useTranslations();
  const [readMore, setReadMore] = useState(false);
  const [edit, setEdit] = useState(false);
  const [clientRendered, setClientRendered] = useState(false);
  const [content, setContent] = useState<string>(description);
  const handleSaveDescription = () => {
    setDescription(content);
    setEdit(false);
  }

  useEffect(() => {
    setClientRendered(true);
  }, []);

  return (
    <div className="row">
      <div className="col-12 text-muted">
        <h6 style={{ cursor: 'pointer' }} onClick={() => setEdit (edit ? false : true)}>
          {!edit && <><FontAwesomeIcon icon={faPencil} /> {(description && description !== '' ? t('tasks.edit_label') : t('tasks.write_label')) + ' ' + t('tasks.description_label')}</>}
        </h6>
      </div>
      <div className="col-12">
        {edit ? (
          <EditorArea value={content} setValue={setContent} placeholder={t('tasks.placeholder_task_description')} />
        ) : (
          clientRendered && (
            <p
              dangerouslySetInnerHTML={{
                __html: (readMore || description.length < maxContentSize)
                  ? description
                  : description.substring(0, maxContentSize),
              }}
            ></p>
          )
        )}
        {!edit && description.length > maxContentSize && !readMore && (
          <span
            style={{ cursor: "pointer" }}
            className="text-secondary"
            onClick={() => setReadMore(true)}
          >
            {t('btn_read_more')} <FontAwesomeIcon icon={faAngleDoubleRight} />
          </span>
        )}
        {!edit && description.length > maxContentSize && readMore && (
          <span
            style={{ cursor: "pointer" }}
            className="text-secondary"
            onClick={() => setReadMore(false)}
          >
            <FontAwesomeIcon icon={faAngleDoubleLeft} /> {t('btn_hide_read_more')}
          </span>
        )}
      </div>
      {
        edit &&
        <div className="col-12">
          <Button color="primary" className="float-right ml-2" onClick={handleSaveDescription}>{t('btn_save')}</Button>
          <Button color="secondary" outline className="float-right btn-no-border" onClick={() => setEdit (false)}>{t('btn_cancel')}</Button>
        </div>
      }
    </div>
  );
};
export default TaskDescription;