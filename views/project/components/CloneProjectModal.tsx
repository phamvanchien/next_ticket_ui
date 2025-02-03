import { cloneProject, create } from "@/api/project.api";
import Button from "@/common/components/Button";
import ErrorAlert from "@/common/components/ErrorAlert";
import Input from "@/common/components/Input";
import Loading from "@/common/components/Loading";
import Modal from "@/common/modal/Modal";
import ModalBody from "@/common/modal/ModalBody";
import ModalHeader from "@/common/modal/ModalHeader";
import { API_CODE } from "@/enums/api.enum";
import { APP_LINK } from "@/enums/app.enum";
import { catchError } from "@/services/base.service";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import { ProjectType } from "@/types/project.type";
import { faCheckCircle, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

interface CloneProjectModalProps {
  openModal: boolean
  project: ProjectType
  setOpenModal: (openModal: boolean) => void
}

const CloneProjectModal: React.FC<CloneProjectModalProps> = ({ openModal, project, setOpenModal }) => {
  const [isPublic, setIsPublic] = useState(project.is_public);
  const [error, setError] = useState<AppErrorType | null>(null);
  const [loading, setLoading] = useState(false);
  const projectNameRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const handleCloneProject = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await cloneProject(project.workspace_id, project.id, {
        project_name_clone: projectNameRef.current?.value ?? '',
        is_public_clone: isPublic
      });
      setLoading(false);
      if (response && response.code === API_CODE.CREATED) {
        router.push(APP_LINK.WORKSPACE + '/' + project.workspace_id + '/project');
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
        title="Clone this project"
        setShow={setOpenModal}
      />
      <ModalBody>
        <div className="row">
          {
            (error) && 
            <div className="col-12 mb-2">
              <ErrorAlert error={error} />
            </div>
          }
          <div className="col-12">
            <Input type="text" defaultValue={`${project.name} - Copy`} ref={projectNameRef} />
          </div>
          <div className="col-12 mt-3">
            <span className="mr-4 pointer" onClick={() => setIsPublic (true)}>
              <FontAwesomeIcon icon={isPublic ? faCheckCircle : faCircle} className={`text-${isPublic ? 'primary' : 'secondary'}`} /> Public
            </span>
            <span className="pointer" onClick={() => setIsPublic (false)}>
              <FontAwesomeIcon icon={!isPublic ? faCheckCircle : faCircle} className={`text-${!isPublic ? 'primary' : 'secondary'}`} /> Private
            </span>
          </div>
          <div className="col-12 mt-2">
            <Button color="primary" className="float-right" onClick={handleCloneProject} disabled={loading}>
              {loading ? <Loading color="light" /> : 'Clone'}
            </Button>
            <Button color="default" className="float-right btn-no-border mr-2" onClick={() => setOpenModal (false)} disabled={loading}>
              Cancel
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
export default CloneProjectModal;