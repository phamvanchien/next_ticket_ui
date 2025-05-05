"use client"
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import { setSidebarSelected } from "@/reduxs/menu.redux";
import { RootState, useAppDispatch } from "@/reduxs/store.redux";
import { WorkspaceType } from "@/types/workspace.type";
import { displayMessage } from "@/utils/helper.util";
import { faGear, faTrash, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import WorkspaceSettingInfo from "./components/WorkspaceSettingInfo";
import WorkspaceAddMember from "../workspace/components/WorkspaceAddMember";
import { useSelector } from "react-redux";
import WorkspaceMember from "./components/WorkspaceMember";
import Modal from "@/common/components/Modal";
import Loading from "@/common/components/Loading";
import { BaseResponseType } from "@/types/base.type";
import { removeWorkspace } from "@/api/workspace.api";
import { API_CODE } from "@/enums/api.enum";
import { useRouter } from "next/navigation";
import { APP_LINK } from "@/enums/app.enum";

interface WorkspaceSettingViewProps {
  workspace: WorkspaceType
}

const WorkspaceSettingView: React.FC<WorkspaceSettingViewProps> = ({ workspace }) => {
  const workspaceUpdated = useSelector((state: RootState) => state.workspaceSlide).workspaceUpdated;
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [openAddMember, setOpenAddMember] = useState<number>();
  const [workspaceData, setWorkspaceData] = useState(workspace);
  const [workspaceNameDelete, setWorkspaceNameDelete] = useState<string>();
  const [openDeleteWorkspace, setOpenDeleteWorkspace] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const handleDeleteWorkspace = async () => {
    try {
      setLoadingDelete(true);
      if (!workspaceNameDelete || !openDeleteWorkspace) {
        return;
      }
      const response = await removeWorkspace(workspace.id);
      if (response && response.code === API_CODE.OK) {
        router.replace(APP_LINK.WORKSPACE);
        return;
      }
      setLoadingDelete(false);
    } catch (error) {
      setLoadingDelete(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  useEffect(() => {
    dispatch(setSidebarSelected('workspace_setting'));
  }, []);
  useEffect(() => {
    if (workspaceUpdated) {
      setWorkspaceData(workspaceUpdated);
    }
  }, [workspaceUpdated]);
  useEffect(() => {
    setWorkspaceData(workspace);
  }, [workspace]);
  return (
    <div className="container-fluid px-3 py-3">
      <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
        <h3 className="mb-0">
          <FontAwesomeIcon icon={faGear} className="text-primary me-2" />
          {t('workspaces_page.setting.setting_title')}
        </h3>
        <Button color="primary" onClick={() => setOpenAddMember (workspaceData.id)}>
            <FontAwesomeIcon icon={faUserPlus} />
        </Button>
      </div>
      <WorkspaceSettingInfo workspace={workspaceData} />
      <WorkspaceMember workspace={workspace} />
      <div className="row mt-4">
        <div className="col-12">
          <p className="pointer text-danger" onClick={() => setOpenDeleteWorkspace (true)}>
            <FontAwesomeIcon icon={faTrash} /> {t('workspaces_page.setting.setting_delete_title')}
          </p>
        </div>
      </div>
      <WorkspaceAddMember 
        workspaceId={openAddMember} 
        setOpenModal={setOpenAddMember} 
      />
      <Modal 
        closable={false}
        open={openDeleteWorkspace} 
        title={t('workspaces_page.setting.delete_workspace_warning_message')}
        footerBtn={[
          <Button color='default' key={1} onClick={() => setOpenDeleteWorkspace (false)} className='mr-2' disabled={loadingDelete}>
            {t('common.btn_cancel')}
          </Button>,
          <Button key={2} color={loadingDelete ? 'secondary' : 'primary'} type="submit" disabled={loadingDelete || workspaceNameDelete !== workspace.name} onClick={handleDeleteWorkspace}>
            {loadingDelete ? <Loading color="light" /> : t('common.btn_delete')}
          </Button>
        ]
        }
        setOpen={setOpenDeleteWorkspace} 
      >
        <div className="row">
          <div className="col-12">
            <Input type="text" onChange={(e) => setWorkspaceNameDelete (e.target.value)} />
          </div>
        </div>
      </Modal>
    </div>
  )
}
export default WorkspaceSettingView;