import { comments, create } from "@/api/comment.api";
import Button from "@/common/components/Button";
import EditorArea from "@/common/components/EditorArea";
import Loading from "@/common/components/Loading";
import Textarea from "@/common/components/Textarea";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { catchError } from "@/services/base.service";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import { ResponseCommentsDataType } from "@/types/comment.type";
import { TaskType } from "@/types/task.type";
import { formatTime } from "@/utils/helper.util";
import { faAngleDoubleDown, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CommentItem from "./components/CommentItem";

interface CommentViewProps {
  task: TaskType
}

const CommentView: React.FC<CommentViewProps> = ({ task }) => {
  const pageSizeDefault = 5;
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const [content, setContent] = useState<string>('');
  const [createForm, setCreateForm] = useState(false);
  const [commentData, setCommentData] = useState<ResponseCommentsDataType>();
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
      {
        (error) && 
          <div className="col-12">
            <div className="alert alert-light alert-error">
              <b className="text-danger mt-2">Error: </b> {error.message}
            </div>
          </div>
      }
      {
        createForm ? <>
          <div className="col-12 mb-2">
            <img src={userLogged?.avatar ?? '/img/icon/user-loading.png'} width={25} height={25} className="img-circle float-left mr-2" onError={(e) => e.currentTarget.src = '/img/icon/user-loading.png'} />
            <span className="text-muted">
              Write a new comment <FontAwesomeIcon icon={faPencil} />
            </span>
          </div>
          <div className="col-12 mb-2">
            <EditorArea placeholder="Enter your content" value={content} setValue={setContent} />
          </div>
          <div className="col-12">
            <Button color="secondary" outline className="float-right" onClick={() => setCreateForm (false)} disabled={loading}>Cancel</Button>
            <Button color="primary" className="float-right mr-2" onClick={handleSubmitComment} disabled={loading}>
              {loading ? <Loading color="light" /> : 'Send'}
            </Button>
          </div>
        </> : (
          <div className="col-12 text-muted">
            <h6 onClick={() => setCreateForm (true)} style={{ cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faPencil} className="mr-2" />Write a new comment
            </h6>
          </div>
        )
      }
    </div>
    <div className="row mt-4 mb-4">
      {
        commentData && commentData.items.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))
      }
      {
        (commentData && commentData.total > pageSize) &&
        <div className="col-12">
          <Link href={'#'} className="text-secondary" style={{ cursor: 'pointer' }} onClick={!loadingViewMore ? handleViewMore : undefined}>
            View more {loading ? <Loading color="secondary" /> : <FontAwesomeIcon icon={faAngleDoubleDown} />}
          </Link>
        </div>
      }
    </div>
  </>
}
export default CommentView;