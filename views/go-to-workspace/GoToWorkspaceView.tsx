"use client"
import { APP_LINK, APP_LOCALSTORAGE, APP_VALIDATE_TYPE } from "@/enums/app.enum";
import { faAngleDoubleDown, faCubes, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import WorkspaceItem from "./components/WorkspaceItem";
import Input from "@/common/components/Input";
import Button from "@/common/components/Button";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { create, workspaces } from "@/api/workspace.api";
import { AppErrorType, BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
import { API_CODE } from "@/enums/api.enum";
import { catchError, hasError, printError, validateInput } from "@/services/base.service";
import ErrorPage from "@/common/layouts/ErrorPage";
import Loading from "@/common/components/Loading";
import { WorkspaceType } from "@/types/workspace.type";
import { useTranslations } from "next-intl";
import Modal from "@/common/modal/Modal";
import ModalHeader from "@/common/modal/ModalHeader";
import ModalBody from "@/common/modal/ModalBody";
import Textarea from "@/common/components/Textarea";

const GoToWorkspaceView = () => {
  const router = useRouter();
  const defaultPageSize = 4;
  const t = useTranslations();
  const [keyword, setKeyword] = useState<string>('');
  const [debounceKeyword, setDebounceKeyword] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [viewMoreLoading, setViewMoreLoading] = useState(false);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [error, setError] = useState<AppErrorType | null>(null);
  const [workspacesData, setWorkspacesData] = useState<ResponseWithPaginationType<WorkspaceType[]>>();
  const [createWorkspace, setCreateWorkspace] = useState(false);
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

  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [validateError, setValidateError] = useState<AppErrorType[] | []>([]);
  const handleValidateName = (value: string = name ?? '') => {
    const required = validateInput('name', value ?? '', t('create_workspace.workspace_name_required'), APP_VALIDATE_TYPE.REQUIRED, validateError, setValidateError);
    if (!required) {
      return false;
    }
    return true;
  }
  const handleWorkspaceNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    handleValidateName(event.target.value);
  }
  const handleWorkspaceDescriotionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  }
  const handleSubmitCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!handleValidateName()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await create({
        name: name ?? '',
        description: description
      });
      if (response && response.code === API_CODE.CREATED) {
        localStorage.setItem(APP_LOCALSTORAGE.WORKSPACE_STORAGE, response.data.id.toString());
        router.push (APP_LINK.WORKSPACE + '/' + response.data.id);
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(catchError(response));
    } catch (error) {
      setLoading(false);
      setError(catchError(error as BaseResponseType));
    }
  }

  useEffect(() => {
    setError(null);
    setValidateError([]);
  }, [createWorkspace]);

  if (error) {
    return <ErrorPage errorCode={500} />
  }
  return (
    <div className="row">
      <div className="col-12">
        <div className="row">
          <div className="col-12 col-lg-7 text-secondary">
            <h3><FontAwesomeIcon icon={faCubes} className="text-primary" /> {t('workspaces.page_title')}</h3>
            <h6 className="text-dark">{t('workspaces.page_title_join')}</h6>
            <h6 className="text-secondary">{t('workspaces.page_title_create')}</h6>
          </div>
          {/* {
            (!loading && workspacesData) &&
            <div className="col-12 col-lg-5">
              <Input type="search" className="input-search float-right" placeholder={t('workspaces.placeholder_input_search')} onChange={handleChangeKeyword} disabled={viewMoreLoading} />
            </div>
          } */}
        </div>
        <div className="row mt-4">
          <div className="col-12 col-lg-12 col-sm-12">
            <div className="info-box create-box" onClick={() => setCreateWorkspace (true)}>
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
              <Button color="secondary" className="btn-load-more" rounded outline onClick={handleViewMore} disabled={viewMoreLoading}>
                {viewMoreLoading ? <Loading color="secondary" /> : <>{t('btn_view_more')} <FontAwesomeIcon icon={faAngleDoubleDown} /></>}
              </Button>
            </div>
          </div>
        }
      </div>
      <Modal isOpen={createWorkspace}>
        <ModalHeader setShow={setCreateWorkspace} title={t('create_workspace.page_title')} />
        <ModalBody>
          <form onSubmit={handleSubmitCreate}>
            <div className="row">
              <div className="col-12">
                <Input 
                  type="text" 
                  minLength={3} 
                  maxLength={100} 
                  placeholder={t('create_workspace.input_workspace_name')} 
                  onChange={handleWorkspaceNameChange} 
                  invalid={hasError(validateError, 'name')}
                  disabled={loading}
                />
                {
                  hasError(validateError, 'name') &&
                  <div className="invalid-feedback" style={{display: 'block'}}>
                    {printError(validateError, 'name')}
                  </div>
                }
              </div>
              <div className="col-12">
                <Textarea 
                  className="mt-2" 
                  placeholder={t('create_workspace.placeholder_workspace_description')} 
                  onChange={handleWorkspaceDescriotionChange} 
                  disabled={loading}></Textarea>
              </div>
              <div className="col-12">
                <Button type="submit" color="primary" className="float-right mt-2 ml-2" disabled={loading}>
                  {loading ? <Loading color="light" /> : t('btn_create')}
                </Button>
                <Button type="button" color="default" outline className="float-right mt-2 btn-no-border" onClick={() => setCreateWorkspace (false)} disabled={loading}>
                  {t('btn_cancel')}
                </Button>
              </div>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}
export default GoToWorkspaceView;