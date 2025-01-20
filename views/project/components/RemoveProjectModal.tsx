import { remove } from "@/api/project.api";
import Button from "@/common/components/Button";
import ErrorAlert from "@/common/components/ErrorAlert";
import Loading from "@/common/components/Loading";
import Modal from "@/common/modal/Modal";
import ModalBody from "@/common/modal/ModalBody";
import ModalHeader from "@/common/modal/ModalHeader";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { catchError } from "@/services/base.service";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import React, { useState } from "react";
import { useSelector } from "react-redux";

interface RemoveProjectModalProps {
  openModal: boolean
  setOpenModal: (openModal: boolean) => void
  projectId: number
  loadProjects: () => void
}

const RemoveProjectModal: React.FC<RemoveProjectModalProps> = ({ openModal, setOpenModal, projectId, loadProjects }) => {
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppErrorType | null>(null);
  const handleSubmitRemove = async () => {
    try {
      if (!workspace) {
        return;
      }

      setLoading(true);
      const response = await remove(workspace.id, projectId);
      setLoading(false);
      if (response && response.code === API_CODE.OK) {
        loadProjects();
        setOpenModal(false);
        return;
      }
      setError(catchError(response));
    } catch (error) {
      setLoading(false);
      setError(catchError(error as BaseResponseType));
    }
  }
  return (
    <Modal className="invite-modal" isOpen={openModal ? true : false}>
      <ModalHeader 
        title="Are you sure remove this project ?"
        setShow={setOpenModal}
      />
      <ModalBody>
        <div className="row mb-2">
          <div className="col-12 mb-2">
            <ErrorAlert error={error} />
          </div>
          <div className="col-6">
            <Button color="secondary" outline fullWidth onClick={() => setOpenModal (false)} disabled={loading}>Cancel</Button>
          </div>
          <div className="col-6">
            <Button color="danger" fullWidth disabled={loading} onClick={handleSubmitRemove}>
              {loading ? <Loading color="light" /> : 'Remove'}
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}
export default RemoveProjectModal;