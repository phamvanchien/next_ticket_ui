import { comments, create } from "@/api/comment.api";
import Button from "@/common/components/Button";
import EditorArea from "@/common/components/EditorArea";
import Loading from "@/common/components/Loading";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { catchError } from "@/services/base.service";
import { AppErrorType, BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
import { TaskType } from "@/types/task.type";
import { faAngleDoubleDown, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { MouseEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CommentItem from "./components/CommentItem";
import ErrorAlert from "@/common/components/ErrorAlert";
import { CommentType } from "@/types/comment.type";
import { IMAGE_DEFAULT } from "@/enums/app.enum";
import { useTranslations } from "next-intl";

interface CommentViewProps {
  task: TaskType
}

const CommentView: React.FC<CommentViewProps> = ({ task }) => {
  const t = useTranslations();
  const pageSizeDefault = 5;
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const [content, setContent] = useState<string>('');
  const [createForm, setCreateForm] = useState(false);
  const [commentData, setCommentData] = useState<ResponseWithPaginationType<CommentType[]>>();
  const [pageSize, setPageSize] = useState<number>(pageSizeDefault);
  const [error, setError] = useState<AppErrorType | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingViewMore, setLoadingViewMore] = useState(false);
  const loadComments = async () => {
    try {
      if (!workspace) {
        return;
      }

      const response = await comments(workspace.id, task.project_id, task.id, {
        page: 1,
        size: pageSize
      });
      setLoadingViewMore(false);
      if (response && response.code === API_CODE.OK) {
        setCommentData(response.data);
        if (response.data.total === 0) {
          setCreateForm(true);
        }
        return;
      }
      setCommentData(undefined);
    } catch (error) {
      setCommentData(undefined);
    }
  }
  const handleViewMore = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setLoadingViewMore(true);
    setPageSize(pageSize + pageSizeDefault);
  }
  const handleSubmitComment = async () => {
    try {
      if (!workspace) {
        return;
      }

      const response = await create(workspace.id, task.project_id, task.id, {
        content: content
      });
      setLoading(false);
      if (response && response.code === API_CODE.CREATED) {
        loadComments();
        setContent('');
        setCreateForm(false);
        return;
      }
      setError(catchError(response));
    } catch (error) {
      setLoading(false);
      setError(catchError(error as BaseResponseType));
    }
  }
  useEffect(() => {
    loadComments();
  }, [workspace, pageSize]);
  return <>
    <div className="row mt-4">
      <ErrorAlert error={error} />
      {
        createForm ? <>
          <div className="col-12 mb-2">
            <img src={userLogged?.avatar ?? IMAGE_DEFAULT.NO_USER} width={25} height={25} className="img-circle float-left mr-2" onError={(e) => e.currentTarget.src = IMAGE_DEFAULT.NO_USER} />
            <span className="text-muted">
              {t('tasks.write_comment_label')} <FontAwesomeIcon icon={faPencil} />
            </span>
          </div>
          <div className="col-12 mb-2">
            <EditorArea placeholder={t('tasks.placeholder_comment')} value={content} setValue={setContent} />
          </div>
          <div className="col-12">
            <Button color="primary" className="float-right ml-2" onClick={handleSubmitComment} disabled={loading}>
              {loading ? <Loading color="light" /> : t('btn_send')}
            </Button>
            <Button color="secondary" outline className="float-right btn-no-border" onClick={() => setCreateForm (false)} disabled={loading}>{t('btn_cancel')}</Button>
          </div>
        </> : (
          <div className="col-12 text-muted">
            <h6 onClick={() => setCreateForm (true)} style={{ cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faPencil} className="mr-2" />{t('tasks.write_comment_label')}
            </h6>
          </div>
        )
      }
    </div>
    <div className="row mt-4 mb-4">
      {
        loading &&
        <div className="col-12 text-center">
          <Loading color="primary" size={30} />
        </div>
      }
      {
        (!loading && commentData) && commentData.items.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))
      }
      {
        (!loading && commentData && commentData.total > pageSize) &&
        <div className="col-12">
          <Link href={'#'} className="text-secondary" style={{ cursor: 'pointer' }} onClick={!loadingViewMore ? handleViewMore : undefined}>
            {t('btn_view_more')} {loading ? <Loading color="secondary" /> : <FontAwesomeIcon icon={faAngleDoubleDown} />}
          </Link>
        </div>
      }
    </div>
  </>
}
export default CommentView;