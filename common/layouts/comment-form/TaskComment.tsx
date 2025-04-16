import React, { useEffect, useState } from "react";
import CommentCreate from "./CommentCreate";
import UserAvatar from "@/common/components/AvatarName";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { TaskType } from "@/types/task.type";
import { displayMessage, displaySmallMessage } from "@/utils/helper.util";
import { BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
import { comments, update } from "@/api/comment.api";
import { API_CODE } from "@/enums/api.enum";
import { CommentType } from "@/types/comment.type";
import CommentItem from "./CommentItem";
import Modal from "@/common/components/Modal";
import Button from "@/common/components/Button";
import { useTranslations } from "next-intl";
import Loading from "@/common/components/Loading";

interface TaskCommentProps {
  className?: string
  task?: TaskType
}

const TaskComment: React.FC<TaskCommentProps> = ({ className, task }) => {
  const [commentsData, setCommentsData] = useState<ResponseWithPaginationType<CommentType[]>>();
  const [commentCreated, setCommentCreated] = useState<number>();
  const [openEdit, setOpenEdit] = useState<number>();
  const [confirmDelete, setConfirmDelete] = useState<number>();
  const [openDelete, setOpenDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const t = useTranslations();
  const loadComments = async () => {
    try {
      if (!task) {
        return;
      }
      const response = await comments(task.workspace_id, task.project_id, task.id, {
        page: 1,
        size: 5
      });
      if (response && response.code === API_CODE.OK) {
        setCommentsData(response.data);
        return;
      }
      displaySmallMessage('error', response.error?.message);
    } catch (error) {
      displaySmallMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  const handleDeleteComment = async () => {
    try {
      if (!task || !confirmDelete) {
        return;
      }
      setLoadingDelete(true);
      const response = await update(task.workspace_id, task.project_id, task.id, confirmDelete, {
        content: t('tasks.deleted_comment_message'),
        deleted: 1
      });
      setLoadingDelete(false);
      if (response && response.code === API_CODE.OK) {
        loadComments();
        setConfirmDelete(undefined);
        setOpenDelete(false);
        return;
      }
      displayMessage('error', response.error?.message);
    } catch (error) {
      setLoadingDelete(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  useEffect(() => {
    loadComments();
  }, [task]);
  useEffect(() => {
    if (commentCreated) {
      loadComments();
    }
  }, [commentCreated]);
  useEffect(() => {
    if (confirmDelete) {
      setOpenDelete(true);
    } else {
      setOpenDelete(false);
    }
  }, [confirmDelete]);
  return <div className={className}>
    <CommentCreate task={task} setCommentCreated={setCommentCreated} />
    {
      (commentsData) && commentsData.items.map((comment, index) => (
        <CommentItem 
          comment={comment} 
          key={index} 
          setOpenEdit={setOpenEdit} 
          setConfirmDelete={setConfirmDelete}
          openEdit={openEdit} 
        />
      ))
    }
    <Modal 
      open={openDelete} 
      title={t('tasks.confirm_delete_comment_message')}
      footerBtn={[
        <Button color='default' key={1} onClick={() => setConfirmDelete (undefined)} className='mr-2' disabled={loadingDelete}>
          {t('btn_cancel')}
        </Button>,
        <Button key={2} color={loadingDelete ? 'secondary' : 'primary'} type="submit" onClick={handleDeleteComment} disabled={loadingDelete}>
          {loadingDelete ? <Loading color="light" /> : t('btn_delete')}
        </Button>
      ]
      }
      setOpen={setOpenDelete} 
    >
      <div className="row"></div>
    </Modal>
  </div>
}
export default TaskComment;