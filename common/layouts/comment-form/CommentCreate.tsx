import { create } from "@/api/comment.api";
import UserAvatar from "@/common/components/AvatarName";
import Button from "@/common/components/Button";
import EditorArea from "@/common/components/EditorArea";
import Input from "@/common/components/Input";
import Loading from "@/common/components/Loading";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { BaseResponseType } from "@/types/base.type";
import { CommentType } from "@/types/comment.type";
import { TaskType } from "@/types/task.type";
import { displayMessage } from "@/utils/helper.util";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useSelector } from "react-redux";

interface CommentCreateProps {
  task?: TaskType
  setCommentCreated: (commentCreated?: number) => void
}

const CommentCreate: React.FC<CommentCreateProps> = ({ task, setCommentCreated }) => {
  const t = useTranslations();
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const [value, setValue] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const handleSubmitComment = async () => {
    try {
      if (!value || (value && value === '') || !task) {
        return;
      }
      setLoading(true);
      const response = await create(task.workspace_id, task.project_id, task.id, {
        content: value
      });
      setLoading(false);
      if (response && response.code === API_CODE.CREATED) {
        setCommentCreated(response.data.id);
        setValue('');
        setOpenCreate(false);
        return;
      }
      displayMessage('error', response.error?.message);
    } catch (error) {
      setLoading(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  return (
    <div className="row mb-4">
      {
        !openCreate &&
        <div className="col-12">
          <UserAvatar avatar={userLogged?.avatar} name={userLogged?.first_name ?? 'U'} className="float-left" />
          <Input type="text" placeholder={t('tasks_page.comment.write_comment_label')} classGroup="float-left w-90" classInput="input-create-comment" onClick={() => setOpenCreate (true)} />
        </div>
      }
      {
        openCreate &&
        <>
          <div className="col-12">
            <UserAvatar avatar={userLogged?.avatar} name={userLogged?.first_name ?? 'U'} /> {t('tasks_page.comment.write_comment_label')}
          </div>
          <div className="col-12 mt-2">
            <EditorArea value={value} setValue={setValue} placeholder={t('tasks_page.comment.placeholder_comment')} />
            <Button color={loading ? 'secondary' : 'primary'} className="float-right" disabled={loading} onClick={handleSubmitComment}>
              {loading ? <Loading color="light" /> : t('common.btn_save')}
            </Button>
            <Button color="default" className="float-right mr-2" onClick={() => setOpenCreate (false)} disabled={loading}>
              {t('common.btn_cancel')}
            </Button>
          </div>
        </>
      }
    </div>
  )
}
export default CommentCreate;