"use client"
import { removeWorkspace, update } from "@/api/workspace.api";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import Loading from "@/common/components/Loading";
import Modal from "@/common/modal/Modal";
import ModalBody from "@/common/modal/ModalBody";
import { API_CODE } from "@/enums/api.enum";
import { APP_LINK } from "@/enums/app.enum";
import { WORKSPACE_ENUM } from "@/enums/workspace.enum";
import { catchError, hasError, printError } from "@/services/base.service";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import { WorkspaceType } from "@/types/workspace.type";
import { notify } from "@/utils/helper.util";
import { faGear, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import MemberWorkspaceSetting from "./components/MemberWorkspaceSetting";
import ErrorAlert from "@/common/components/ErrorAlert";

interface WorkspaceSettingViewProps {
  workspace: WorkspaceType
}

const WorkspaceSettingView: React.FC<WorkspaceSettingViewProps> = ({ workspace }) => {
  const [deleteWorkspace, setDeleteWorkspace] = useState(false);
  const [workspaceName, setWorkspaceName] = useState(workspace.name);
  const [error, setError] = useState<AppErrorType | null>(null);
  const [validateError, setValidateError] = useState<AppErrorType[] | []>([]);
  const [inputValue, setInputValue] = useState<string>();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const workspaceNameRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const handleDeleteWorkspace = async () => {
    try {
      if (hasError(validateError) || inputValue !== workspaceName) {
        return;
      }

      setError(null);
      setValidateError([]);
      setLoadingDelete(true);
      const response = await removeWorkspace (workspace.id);
      setLoadingDelete(false);
      if (response && response.code === API_CODE.OK) {
        router.push(APP_LINK.GO_TO_WORKSPACE);
        return;
      }
      setError(catchError(response));
    } catch (error) {
      setError(catchError(error as BaseResponseType));
    }
  }
  const handleCancelPopupDelete = () => {
    setDeleteWorkspace(false);
    const inputWorkspaceNameDelete = document.getElementById('workspace_name_delete') as HTMLInputElement;
    if (inputWorkspaceNameDelete) {
      inputWorkspaceNameDelete.value = "";
    }
  }
  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setValidateError([]);
    if (value && value !== '') {
      setInputValue(value);
      if (value !== workspaceName) {
        setValidateError([...validateError, {
          property: 'project_name',
          message: WORKSPACE_ENUM.WORKSPACE_NAME_NOT_MATCH
        }]);
      }
      return;
    }
    setValidateError([]);
    setValidateError([...validateError, {
      property: 'project_name',
      message: WORKSPACE_ENUM.WORKSPACE_NAME_DELETE_REQUIRE
    }]);
    setInputValue(undefined);
  }
  useEffect(() => {
    const handleClickOutside = async (event: MouseEvent) => {
      if (workspaceNameRef.current && !workspaceNameRef.current.contains(event.target as Node)) {
        if ((workspaceNameRef.current?.value && workspaceNameRef.current.value !== workspaceName)) {
          try {
            setError(null);
            const response = await update(workspace.id, {
              name: workspaceNameRef.current.value
            });
            if (response && response.code === API_CODE.OK) {
              setWorkspaceName(workspaceNameRef.current.value);
              notify('Workspace is updated', 'success');
              return;
            }
            setError(catchError(response));
          } catch (error) {
            setError(catchError(error as BaseResponseType));
          }
        }
      };
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return <>
    <div className="row text-secondary">
      <div className="col-12">
        <h4>
          <FontAwesomeIcon icon={faGear} /> Workspace setting
        </h4>
      </div>
    </div>
    <div className="row">
      {
        (error) && 
        <div className="col-12 col-lg-4 col-sm-6 mt-4">
          <ErrorAlert error={error} />
        </div>
      }
      <div className="col-12 col-lg-4 col-sm-6 mt-4">
        <Input type="text" defaultValue={workspaceName} ref={workspaceNameRef} style={{ background: '#3333' }} />
      </div>
    </div>
    <MemberWorkspaceSetting workspace={workspace} />
    <div className="row">
      <div className="col-12 col-lg-4 col-sm-6 mt-4">
        <h5 className="text-muted">Delete workspace</h5>
        <i className="text-muted">
          <FontAwesomeIcon icon={faInfoCircle} /> Deleting this project will also delete the related data and it cannot be recovered.
        </i>
      </div>
    </div>
    <div className="row mt-2 mb-2">
      <div className="col-12 col-lg-4 col-sm-6">
        <Button color="danger" onClick={() => setDeleteWorkspace (true)}>Delete workspace</Button>
      </div>
    </div>
    <Modal className="clone-modal" isOpen={deleteWorkspace ? true : false}>
      <ModalBody>
        <div className="row">
          <div className="col-12 mb-2">
            <h6 className="text-muted">
              Type in the workspace name and delete it - ({workspaceName})
            </h6>
          </div>
          {
            (error) && 
            <div className="col-12 mb-2">
              <ErrorAlert error={error} />
            </div>
          }
          <div className="col-12 col-lg-12 mt-2 mb-2">
            <Input 
              id="workspace_name_delete"
              type="text" 
              placeholder="Enter workspace name to delete" 
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
          <div className="col-6">
            <Button color="danger" fullWidth onClick={handleDeleteWorkspace} disabled={loadingDelete}>
              OK {loadingDelete && <Loading color="light" />}
            </Button>
          </div>
          <div className="col-6">
            <Button color="danger" fullWidth outline disabled={loadingDelete} onClick={handleCancelPopupDelete}>
              Cancel
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  </>
}
export default WorkspaceSettingView;