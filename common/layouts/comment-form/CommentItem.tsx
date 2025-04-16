import { update } from "@/api/comment.api";
import UserAvatar from "@/common/components/AvatarName";
import Button from "@/common/components/Button";
import EditorArea from "@/common/components/EditorArea";
import Loading from "@/common/components/Loading";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { BaseResponseType } from "@/types/base.type";
import { CommentType } from "@/types/comment.type";
import { displayMessage } from "@/utils/helper.util";
import { faHistory, faPencil, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
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
    <div className="row mt-3">
      <div className="col-12">
        <span className="float-left mb-2">
          <UserAvatar name={comment.user.first_name} avatar={comment.user.avatar} /> {comment.user.first_name} {comment.user.last_name}
        </span>
        {
          ((openEdit !== comment.id) && userLogged?.id === comment.user.id && !deleted) &&
          <span className="float-right mt-2">
            <FontAwesomeIcon icon={faPencil} className="text-secondary pointer" onClick={() => setOpenEdit (comment.id)} style={{marginRight: 7}} />
            <FontAwesomeIcon icon={faTrashAlt} className="text-danger pointer" onClick={() => setConfirmDelete (comment.id)} />
          </span>
        }
      </div>
      {
        deleted &&
        <div className="col-12">
          <div className="comment-box-deleted">{t('tasks.deleted_comment_message')}</div>
        </div>
      }
      {
        !deleted &&
        <div className="col-12">
          {
            (openEdit && openEdit === comment.id) ?
            <>
              <EditorArea value={contentEdit} setValue={setContentEdit} />
              <Button color={loading ? 'secondary' : 'primary'} className="float-right" disabled={loading} onClick={handleSubmitComment}>
                {loading ? <Loading color="light" /> : t('btn_save')}
              </Button>
              <Button color="default" className="float-right mr-2" onClick={() => setOpenEdit (undefined)} disabled={loading}>
                {t('btn_cancel')}
              </Button>
            </> :
            <div className="comment-box" dangerouslySetInnerHTML={{
                __html: (readMore || (content.length < maxContentSize))
                  ? content
                  : content.substring(0, maxContentSize),
              }}>
            </div>
          }
        </div>
      }
    </div>
  )
}
export default CommentItem;