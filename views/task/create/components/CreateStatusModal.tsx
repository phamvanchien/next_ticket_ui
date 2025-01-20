import { createStatus, createTag } from "@/api/project.api";
import Button from "@/common/components/Button";
import ErrorAlert from "@/common/components/ErrorAlert";
import InputForm from "@/common/components/InputForm";
import Loading from "@/common/components/Loading";
import Modal from "@/common/modal/Modal";
import ModalBody from "@/common/modal/ModalBody";
import ModalHeader from "@/common/modal/ModalHeader";
import { API_CODE } from "@/enums/api.enum";
import { APP_VALIDATE_TYPE } from "@/enums/app.enum";
import { TASK_STATUS_ENUM } from "@/enums/task.enum";
import { RootState } from "@/reduxs/store.redux";
import { catchError, hasError } from "@/services/base.service";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import { colorRange } from "@/utils/helper.util";
import { faCheckCircle, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useSelector } from "react-redux";

interface CreateStatusModalProps {
  openCreate: boolean
  projectId: number
  setOpenCreate: (openCreate: boolean) => void
  loadStatus?: () => void
}

const CreateStatusModal: React.FC<CreateStatusModalProps> = ({ 
  openCreate, 
  projectId, 
  setOpenCreate, 
  loadStatus 
}) => {
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const colors = colorRange().filter(c => c.level === 200);
  const [statusColor, setStatusColor] = useState<string>(colors[0].code);
  const [validateError, setValidateError] = useState<AppErrorType[] | []>([]);
  const [name, setName] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppErrorType | null>(null);
  const handleSelectColor = (colorCode: string) => {
    setStatusColor(colorCode);
  }
  const handleCreateStatus = async () => {
    if (!name || name === '' || !statusColor || statusColor === '' || !workspace) {
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const response = await createStatus(workspace.id, projectId, {
        name: name,
        color: statusColor
      });
      setLoading(false);
      if (response && response.code === API_CODE.CREATED) {
        const input = document.getElementById('statusName') as HTMLInputElement;
        if (input) {
          input.value = '';
        }
        if (loadStatus) {
          loadStatus();
        }
        setName('');
        setStatusColor(colors[0].code);
        setOpenCreate(false);
        return;
      }
      setError(catchError(response));
    } catch (error) {
      setLoading(false);
      setError(catchError(error as BaseResponseType));
    }
  }
  return (
    <Modal className="create-modal" isOpen={openCreate}>
      <ModalHeader 
        title="Create status"
        setShow={setOpenCreate}
      />
      <ModalBody>
        <div className="row mb-2">
          {
            (error) && <div className="col-12">
              <ErrorAlert error={error} />
            </div>
          }
          <div className="col-12">
            <InputForm
              label="Status name"
              id="statusName"
              inputType="text"
              inputPlaceholder="Enter status name"
              inputIcon={<FontAwesomeIcon icon={faTag} />}
              inputValue={name}
              setInputValue={setName}
              error={validateError}
              setError={setValidateError}
              validates={[
                {
                  validateType: APP_VALIDATE_TYPE.REQUIRED,
                  validateMessage: TASK_STATUS_ENUM.STATUS_NAME_EMPTY
                }
              ]}
            />
          </div>
          <div className="col-12 mt-2">
            {
              colors.map(color => (
                <span 
                  key={color.code} 
                  className="badge badge-primary mr-2" 
                  style={{ background: color.code, cursor: 'pointer' }} 
                  onClick={() => handleSelectColor (color.code)}
                >
                  {color.color} {statusColor === color.code && <FontAwesomeIcon icon={faCheckCircle} />}
                </span>
              ))
            }
          </div>
          <div className="col-12 mt-4">
            <Button color="primary" className="float-right ml-2" disabled={hasError(validateError) || loading} onClick={handleCreateStatus}>
              {loading ? <Loading color="light" /> : 'Save'}
            </Button>
            <Button color="secondary" outline className="float-right btn-no-border" disabled={loading} onClick={() => setOpenCreate (false)}>
              Cancel
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}
export default CreateStatusModal;