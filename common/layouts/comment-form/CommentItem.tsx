import { update } from "@/api/comment.api";
import UserAvatar from "@/common/components/AvatarName";
import Button from "@/common/components/Button";
import EditorArea from "@/common/components/EditorArea";
import Loading from "@/common/components/Loading";
import RelativeTime from "@/common/components/RelativeTime";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { BaseResponseType } from "@/types/base.type";
import { CommentType } from "@/types/comment.type";
import { displayMessage } from "@/utils/helper.util";
import { faAngleDoubleLeft, faAngleDoubleRight, faHistory, faPencil, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface CommentItemProps {
  comment: CommentType
  openEdit?: number
  setOpenEdit: (openEdit?: number) => void
  setConfirmDelete: (confirmDelete?: number) => void
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, openEdit, setOpenEdit, setConfirmDelete }) => {
  const t = useTranslations();
  const maxContentSize = 800;
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const [readMore, setReadMore] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [contentEdit, setContentEdit] = useState(content);
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(comment.deleted);
  const handleSubmitComment = async () => {
    try {
      if (!contentEdit || (contentEdit && contentEdit === '')) {
        return;
      }
      setLoading(true);
      const response = await update(comment.workspace_id, comment.project_id, comment.task_id, comment.id, {
        content: contentEdit
      });
      setLoading(false);
      if (response && response.code === API_CODE.OK) {
        setOpenEdit(response.data.id);
        setContent(contentEdit);
        return;
      }
      displayMessage('error', response.error?.message);
    } catch (error) {
      setLoading(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  useEffect(() => {
    setContentEdit(content);
  }, [openEdit]);
  useEffect(() => {
    setContent(comment.content);
    setDeleted(comment.deleted);
  }, [comment]);
  return (
    <div className="comment-item">
      <div className="comment-header">
        <UserAvatar size={30} name={comment.user.first_name} avatar={comment.user.avatar} />
        <div className="comment-user-info">
          <strong>{comment.user.first_name} {comment.user.last_name}</strong>
          <RelativeTime className="m-l-10" icon time={comment.created_at} />
        </div>
        {
          (userLogged?.id === comment.user.id && !deleted) &&
          <div className="comment-actions">
            <FontAwesomeIcon icon={faPencil} className="icon edit" onClick={() => setOpenEdit(comment.id)} />
            <FontAwesomeIcon icon={faTrashAlt} className="icon delete" onClick={() => setConfirmDelete(comment.id)} />
          </div>
        }
      </div>
  
      <div className="comment-body">
        {
          deleted ? (
            <div className="comment-deleted">{t('tasks_page.comment.deleted_comment_message')}</div>
          ) : (
            (openEdit === comment.id) ? (
              <>
                <EditorArea value={contentEdit} setValue={setContentEdit} />
                <div className="comment-edit-actions">
                  <Button color={loading ? 'secondary' : 'primary'} disabled={loading} onClick={handleSubmitComment}>
                    {loading ? <Loading color="light" /> : t('common.btn_save')}
                  </Button>
                  <Button color="default" className="ml-2" onClick={() => setOpenEdit(undefined)} disabled={loading}>
                    {t('common.btn_cancel')}
                  </Button>
                </div>
              </>
            ) : (
              <div
                className="comment-content"
                dangerouslySetInnerHTML={{
                  __html: (readMore || (content.length < maxContentSize))
                    ? content
                    : content.substring(0, maxContentSize),
                }}
              />
            )
          )
        }
        {content && !openEdit && content.length > maxContentSize && !readMore && (
          <span
            style={{ cursor: "pointer" }}
            className="text-secondary"
            onClick={() => setReadMore(true)}
          >
            {t('common.btn_read_more')} <FontAwesomeIcon icon={faAngleDoubleRight} />
          </span>
        )}
        {content && !openEdit && content.length > maxContentSize && readMore && (
          <span
            style={{ cursor: "pointer" }}
            className="text-secondary"
            onClick={() => setReadMore(false)}
          >
            <FontAwesomeIcon icon={faAngleDoubleLeft} /> {t('common.btn_hide_read_more')}
          </span>
        )}
      </div>
    </div>
  );
}
export default CommentItem;