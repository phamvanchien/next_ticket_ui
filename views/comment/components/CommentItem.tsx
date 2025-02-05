import { update } from "@/api/comment.api";
import Button from "@/common/components/Button";
import EditorArea from "@/common/components/EditorArea";
import Loading from "@/common/components/Loading";
import { API_CODE } from "@/enums/api.enum";
import { APP_LINK, IMAGE_DEFAULT } from "@/enums/app.enum";
import { RootState } from "@/reduxs/store.redux";
import { catchError } from "@/services/base.service";
import { BaseResponseType } from "@/types/base.type";
import { CommentType } from "@/types/comment.type";
import { formatTime, notify } from "@/utils/helper.util";
import { faAngleDoubleLeft, faAngleDoubleRight, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface CommentItemProps {
  comment: CommentType
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const t = useTranslations();
  const maxContentSize = 600;
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const router = useRouter();
  const [readMore, setReadMore] = useState(false);
  const [edit, setEdit] = useState(false);
  const [contentEdit, setContentEdit] = useState(comment.content);
  const [deleted, setDeleted] = useState(comment.deleted);
  const [content, setContent] = useState(
    deleted ? `${userLogged?.id === comment.user.id ? 'You' : comment.user.first_name + ' ' + comment.user.last_name} deleted this comment` :
    comment.content
  );
  const [clientRendered, setClientRendered] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const handleCancelEdit = () => {
    setEdit(false);
    setContentEdit(content);
  }
  const handleUpdateComment = async (payload: {content?: string, deleted?: number}, callback?: () => void) => {
    try {
      if (!workspace || (payload.content && contentEdit === content)) {
        return;
      }

      setLoadingUpdate(true);
      const response = await update(workspace.id, comment.project_id, comment.task_id, comment.id, payload);
      setLoadingUpdate(false);
      if (response && response.code === API_CODE.OK) {
        setEdit(false);
        setContent(contentEdit);
        if (callback) {
          callback();
        }
        return;
      }
      notify(catchError(response)?.message ?? '', 'error');
    } catch (error) {
      notify(catchError(error as BaseResponseType)?.message ?? '', 'error');
    }
  }
  const callbackDeleteComment = () => {
    setDeleted(true);
  }

  useEffect(() => {
    setContent(deleted ? `${userLogged?.id === comment.user.id ? 'You' : comment.user.first_name + ' ' + comment.user.last_name} deleted this comment` :
      comment.content);
  }, [deleted]);

  useEffect(() => {
    setClientRendered(true);
  }, []);
  return (
    <div className="col-12" key={comment.id}>
      <img 
        src={comment.user.avatar ?? IMAGE_DEFAULT.NO_USER} 
        width={25} height={25} 
        className="img-circle float-left mr-2" 
        onError={(e) => e.currentTarget.src = IMAGE_DEFAULT.NO_USER} 
        onClick={() => router.push(APP_LINK.PROFILE + '/' + (userLogged?.id === comment.user.id ? '' : comment.user.id))} 
      />
      <span className="text-muted" style={{cursor: 'pointer'}} onClick={() => router.push(APP_LINK.PROFILE + '/' + (userLogged?.id === comment.user.id ? '' : comment.user.id))}>
        <b>{comment.user.first_name} {comment.user.last_name}</b> <span className="float-right" style={{ fontSize: 12 }}>{formatTime(new Date(comment.created_at))}</span>
      </span>
      <div className="card mt-2">
        <div 
          className="card-body p-10" 
        >
          {edit ? <>
            <EditorArea value={contentEdit} setValue={setContentEdit} placeholder={t('tasks.placeholder_comment')} />
            <Button color="primary" className="float-right mr-2 mt-2" disabled={loadingUpdate || (contentEdit.length === content.length)} onClick={() => handleUpdateComment ({content: contentEdit})}>
              {loadingUpdate ? <Loading color="light" /> : t('btn_save')}
            </Button>
            <Button color="default" outline className="float-right mt-2 mr-2 btn-no-border" onClick={handleCancelEdit} disabled={loadingUpdate}>{t('btn_cancel')}</Button>
          </> : (
            clientRendered && <>
              {
                (userLogged?.id === comment.user.id && !deleted) && <>
                  <FontAwesomeIcon icon={faPencil} className="text-muted mr-2" style={{ fontSize: 14, cursor: 'pointer' }} onClick={() => setEdit (true)} />
                  <FontAwesomeIcon icon={faTrash} className="text-muted" style={{ fontSize: 14, cursor: 'pointer' }} onClick={() => handleUpdateComment ({deleted: 1}, callbackDeleteComment)} />
                </>
              }
              <p className={deleted ? 'text-muted m-unset' : 'm-unset'} dangerouslySetInnerHTML={{ __html: deleted ? t('tasks.deleted_comment_message') : (readMore || content.length < maxContentSize) ? content : content.substring(0, maxContentSize) + '...' }}></p>
            </>
          )}
          {
            (!edit && content.length > maxContentSize && !readMore) && 
            <span style={{ cursor: 'pointer' }} className="text-secondary" onClick={() => setReadMore (true)}>{t('btn_read_more')} <FontAwesomeIcon icon={faAngleDoubleRight} /></span>
          }
          {
            (!edit && content.length > maxContentSize && readMore) && 
            <span style={{ cursor: 'pointer' }} className="text-secondary" onClick={() => setReadMore (false)}><FontAwesomeIcon icon={faAngleDoubleLeft} /> {t('btn_hide_read_more')}</span>
          }
        </div>
      </div>
    </div>
  )
}
export default CommentItem;