import { inviteList, joinProject, removeInvite } from "@/api/project.api";
import Button from "@/common/components/Button";
import ErrorAlert from "@/common/components/ErrorAlert";
import Loading from "@/common/components/Loading";
import ErrorPage from "@/common/layouts/ErrorPage";
import Modal from "@/common/modal/Modal";
import ModalBody from "@/common/modal/ModalBody";
import ModalHeader from "@/common/modal/ModalHeader";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { catchError } from "@/services/base.service";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import { ResponseProjectInviteDataType } from "@/types/project.type";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface ProjectInvitationModalProps {
  openModal: boolean
  setOpenModal: (openModal: boolean) => void
  loadProjects?: () => void
}

const ProjectInvitationModal: React.FC<ProjectInvitationModalProps> = ({ openModal, setOpenModal, loadProjects }) => {
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const [inviteData, setInviteData] = useState<ResponseProjectInviteDataType>();
  const [error, setError] = useState<AppErrorType | null>(null);
  const [errorProjectItem, setErrorProjectItem] = useState<AppErrorType | null>(null);
  const [joinLoading, setJoinLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const handleJoinProject = async (projectId: number) => {
    try {
      if (!workspace) {
        return;
      }

      setJoinLoading(true);
      setErrorProjectItem(null);
      const response = await joinProject(workspace.id, projectId);
      setJoinLoading(false);
      if (response && response.code === API_CODE.OK) {
        loadInvites();
        if (loadProjects) {
          loadProjects();
        }
        return;
      }
      setErrorProjectItem(catchError(response));
    } catch (error) {
      setJoinLoading(false);
      setErrorProjectItem(catchError(error as BaseResponseType));
    }
  }
  const handleRemoveProject = async (projectId: number) => {
    try {
      if (!workspace) {
        return;
      }

      setJoinLoading(true);
      setErrorProjectItem(null);
      const response = await removeInvite(workspace.id, projectId);
      setJoinLoading(false);
      if (response && response.code === API_CODE.OK) {
        loadInvites();
        return;
      }
      setErrorProjectItem(catchError(response));
    } catch (error) {
      setRemoveLoading(false);
      setErrorProjectItem(catchError(error as BaseResponseType));
    }
  }
  const loadInvites = async () => {
    try {
      if (!workspace) {
        return;
      }
      setError(null);
      const response = await inviteList(workspace.id, 1, 10);
      if (response && response.code === API_CODE.OK) {
        setInviteData(response.data);
        return;
      }
      setError(catchError(response));
    } catch (error) {
      setError(catchError(error as BaseResponseType));
    }
  }
  useEffect(() => {
    loadInvites();
  }, [workspace, openModal]);
  if (error) {
    return <ErrorPage errorCode={500} />
  }
  return (
    <Modal className="invite-modal" isOpen={openModal ? true : false}>
      <ModalHeader 
        title="Project invitation"
        setShow={setOpenModal}
      />
      <ModalBody>
        {
          (errorProjectItem) && 
          <div className="row">
            <div className="col-12">
              <ErrorAlert error={errorProjectItem} />
            </div>
          </div>
        }
        {
          (inviteData && inviteData.total === 0) &&
          <div className="row">
            <div className="col-12">
              <h6 className="text-center text-muted">
                Project invitation is empty
              </h6>
            </div>
          </div>
        }
        {
          (inviteData) && inviteData.items.map(invite => (
            <div className="row">
              <div className="col-6">
                <h6>{invite.project.name}</h6>
                <p className="text-muted" style={{fontSize: 12}}>from {invite.project.user.first_name} {invite.project.user.last_name}</p>
              </div>
              <div className="col-3">
                <Button color="primary" fullWidth disabled={joinLoading || removeLoading} onClick={() => handleJoinProject (invite.project.id)}>
                  {joinLoading ? <Loading color="light" /> : 'Join'}
                </Button>
              </div>
              <div className="col-3">
                <Button color="secondary" fullWidth outline disabled={joinLoading || removeLoading} onClick={() => handleRemoveProject (invite.project.id)}>
                  {removeLoading ? <Loading color="light" /> : 'Remove'}
                </Button>
              </div>
            </div>
          ))
        }
      </ModalBody>
    </Modal>
  )
}
export default ProjectInvitationModal;