import Button from "@/common/components/Button";
import EditorArea from "@/common/components/EditorArea";
import { faAngleDoubleLeft, faAngleDoubleRight, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

interface TaskDescriptionProps {
  description: string;
  setDescription: Dispatch<SetStateAction<string>>
}

const TaskDescription: React.FC<TaskDescriptionProps> = ({ description, setDescription }) => {
  const maxContentSize = 800;
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
          {!edit && <><FontAwesomeIcon icon={faPencil} /> {(description && description !== '' ? 'Edit' : 'Write') + ' description'}</>}
        </h6>
      </div>
      <div className="col-12">
        {edit ? (
          <EditorArea value={content} setValue={setContent} placeholder="Description about your task..." />
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
            Read more <FontAwesomeIcon icon={faAngleDoubleRight} />
          </span>
        )}
        {!edit && description.length > maxContentSize && readMore && (
          <span
            style={{ cursor: "pointer" }}
            className="text-secondary"
            onClick={() => setReadMore(false)}
          >
            <FontAwesomeIcon icon={faAngleDoubleLeft} /> Hide
          </span>
        )}
      </div>
      {
        edit &&
        <div className="col-12">
          <Button color="secondary" outline className="float-right" onClick={() => setEdit (false)}>Cancel</Button>
          <Button color="secondary" className="float-right mr-2" onClick={handleSaveDescription}>Save</Button>
        </div>
      }
    </div>
  );
};
export default TaskDescription;