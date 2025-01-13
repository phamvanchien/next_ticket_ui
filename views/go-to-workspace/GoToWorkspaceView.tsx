"use client"
import { APP_LINK } from "@/enums/app.enum";
import { faAngleDoubleDown, faAngleDoubleLeft, faAngleDoubleRight, faCubes, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import WorkspaceItem from "./components/WorkspaceItem";
import Input from "@/common/components/Input";
import Button from "@/common/components/Button";
import { ChangeEvent, useEffect, useState } from "react";
import { workspaces } from "@/api/workspace.api";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import { API_CODE } from "@/enums/api.enum";
import { catchError } from "@/services/base.service";
import { ResponseWorkspacesDataType } from "@/types/workspace.type";
import ErrorPage from "@/common/layouts/ErrorPage";
import Loading from "@/common/components/Loading";

const GoToWorkspaceView = () => {
  const router = useRouter();
  const defaultPageSize = 4;
  const [keyword, setKeyword] = useState<string>('');
  const [debounceKeyword, setDebounceKeyword] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [viewMoreLoading, setViewMoreLoading] = useState(false);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [error, setError] = useState<AppErrorType | null>(null);
  const [workspacesData, setWorkspacesData] = useState<ResponseWorkspacesDataType>();
  const handleChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setKeyword('');
    if (event.target.value && event.target.value !== '') {
      setKeyword(event.target.value);
    }
  }
  const handleViewMore = () => {
    setViewMoreLoading(true);
    setPageSize(pageSize + defaultPageSize);
  }
  useEffect(() => {
    const loadWorkspace = async () => {
      try {
        const response = await workspaces(1, pageSize, keyword);
        if (response && response.code === API_CODE.OK) {
          if (response.data.total === 0 && (!keyword || keyword === '')) {
            router.push(APP_LINK.CREATE_WORKSPACE);
            return;
          }
          setLoading(false);
          setViewMoreLoading(false);
          setWorkspacesData(response.data);
          return;
        }
        setError(catchError(response));
      } catch (error) {
        setError(catchError(error as BaseResponseType));
      }
    }
    loadWorkspace();
  }, [pageSize, debounceKeyword]);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceKeyword(keyword);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);

  if (error) {
    return <ErrorPage errorCode={500} />
  }
  return (
    <div className="row">
      <div className="col-12">
        <div className="row">
          <div className="col-12 col-lg-7 text-secondary">
            <h3><FontAwesomeIcon icon={faCubes} className="text-primary" /> Workspaces</h3>
            <h6 className="text-dark">Join to a workspace or</h6>
            <h6 className="text-secondary">Create a new workspace</h6>
          </div>
          {
            (!loading && workspacesData) &&
            <div className="col-12 col-lg-5">
              <Input type="search" className="input-search float-right" placeholder="Search your workspaces" onChange={handleChangeKeyword} disabled={viewMoreLoading} />
            </div>
          }
        </div>
        <div className="row mt-4">
          <div className="col-12 col-lg-12 col-sm-12">
            <div className="info-box create-box" onClick={() => router.push(APP_LINK.CREATE_WORKSPACE)}>
              <span className="info-box-icon elevation-1">
                <FontAwesomeIcon icon={faPlusCircle} className="create-icon" />
              </span>
            </div>
          </div>
          {
            loading &&
            <div className="col-12 text-center mt-4">
              <Loading color="primary" size={40} />
            </div>
          }
          {
            (!loading && workspacesData) && workspacesData.items.map(workspace => (
              <WorkspaceItem key={workspace.id} workspace={workspace} />
            ))
          }
        </div>
        {
          (workspacesData && workspacesData.total > pageSize) &&
          <div className="row mt-2">
            <div className="col-12 text-center">
              <Button color="primary" rounded outline onClick={handleViewMore} disabled={viewMoreLoading}>
                {viewMoreLoading ? <Loading color="primary" /> : <>View more <FontAwesomeIcon icon={faAngleDoubleDown} /></>}
              </Button>
            </div>
          </div>
        }
      </div>
    </div>
  );
}
export default GoToWorkspaceView;