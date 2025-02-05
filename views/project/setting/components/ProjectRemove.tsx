import { remove } from "@/api/project.api";
import Button from "@/common/components/Button";
import ErrorAlert from "@/common/components/ErrorAlert";
import Input from "@/common/components/Input";
import Loading from "@/common/components/Loading";
import Modal from "@/common/modal/Modal";
import ModalBody from "@/common/modal/ModalBody";
import { API_CODE } from "@/enums/api.enum";
import { APP_LINK } from "@/enums/app.enum";
import { PROJECT_VALIDATE_ENUM } from "@/enums/project.enum";
import { RootState } from "@/reduxs/store.redux";
import { catchError, hasError, printError } from "@/services/base.service";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import { ProjectType } from "@/types/project.type";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface ProjectRemoveProps {
  projectId: number
  projectName: string
}

const ProjectRemove: React.FC<ProjectRemoveProps> = ({ projectId, projectName }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [inputValue, setInputValue] = useState<string>();
  const [error, setError] = useState<AppErrorType | null>(null);
  const [validateError, setValidateError] = useState<AppErrorType[] | []>([]);
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const router = useRouter();
  const t = useTranslations();
  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setValidateError([]);
    if (value && value !== '') {
      setInputValue(value);
      if (value !== projectName) {
        setValidateError([...validateError, {
          property: 'project_name',
          message: PROJECT_VALIDATE_ENUM.PROJECT_NAME_NOT_MATCH
        }]);
      }
      return;
    }
    setValidateError([]);
    setValidateError([...validateError, {
      property: 'project_name',
      message: PROJECT_VALIDATE_ENUM.PROJECT_NAME_REQUIRE
    }]);
    setInputValue(undefined);
  }
  const handleDeleteProject = async () => {
    try {
      if (!workspace || !inputValue || inputValue === '' || inputValue !== projectName) {
        return;
      }

      setError(null);
      setValidateError([]);
      setLoadingDelete(true);
      const response = await remove(workspace.id, projectId);
      setLoadingDelete(false);
      if (response && response.code === API_CODE.OK) {
        router.push(APP_LINK.WORKSPACE + '/' + workspace.id + '/project');
        return;
      }
      setError(catchError(response));
    } catch (error) {
      setError(catchError(error as BaseResponseType));
    }
  }
  return <>
    <div className="row">
      <div className="col-12 col-lg-4 col-sm-6 mt-4">
        <h5 className="text-muted">{t('project_setting.setting_delete_project_title')}</h5>
        <i className="text-muted">
          <FontAwesomeIcon icon={faInfoCircle} /> {t('project_setting.setting_delete_project_message')}
        </i>
      </div>
    </div>
    <div className="row mt-2 mb-2">
      <div className="col-12 col-lg-4 col-sm-6">
        <Button color="danger" onClick={() => setConfirmDelete (true)}>{t('project_setting.setting_delete_project_title')}</Button>
      </div>
    </div>
    <Modal className="clone-modal" isOpen={confirmDelete ? true : false}>
      <ModalBody>
        <div className="row">
          {
            error &&
            <div className="col-12">
              <ErrorAlert error={error} />
            </div>
          }
          <div className="col-12 mb-2">
            <h6 className="text-muted">
              {t('project_setting.label_delete_project')} - ({projectName})
            </h6>
          </div>
          <div className="col-12 mb-2">
            <Input 
              type="text" 
              placeholder={t('create_project.placeholder_input_project_name')}
              onChange={handleChangeInput} 
              invalid={hasError(validateError)}
            />
            {
              hasError(validateError, 'project_name') &&
              <div className="invalid-feedback" style={{display: 'block'}}>
                {printError(validateError, 'project_name')}
              </div>
            }
          </div>
          <div className="col-12 mt-2">
            <Button color="primary" className="float-right" onClick={handleDeleteProject} disabled={loadingDelete}>
              {t('btn_delete')} {loadingDelete && <Loading color="light" />}
            </Button>
            <Button color="secondary" className="float-right btn-no-border mr-2" outline disabled={loadingDelete} onClick={() => setConfirmDelete (false)}>
              {t('btn_cancel')}
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
    <hr/>
  </>
}
export default ProjectRemove;