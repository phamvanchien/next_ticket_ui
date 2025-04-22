import Sidebar from "@/common/layouts/Sidebar";
import { ProjectType } from "@/types/project.type";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import ProjectSettingInfo from "./ProjectSettingInfo";
import ProjectSettingVisibility from "./ProjectSettingVisibility";
import ProjectSettingMember from "./ProjectSettingMember";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "@/common/components/Modal";
import Button from "@/common/components/Button";
import Loading from "@/common/components/Loading";
import Input from "@/common/components/Input";
import { remove } from "@/api/project.api";
import { API_CODE } from "@/enums/api.enum";
import { BaseResponseType } from "@/types/base.type";
import { displayMessage } from "@/utils/helper.util";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxs/store.redux";
import { useRouter } from "next/navigation";

interface ProjectSettingProps {
  project: ProjectType
  open: boolean
  setOpen: (open: boolean) => void
}

const ProjectSetting: React.FC<ProjectSettingProps> = ({ open, project, setOpen }) => {
  const t = useTranslations();
  const router = useRouter();
  const projectUpdated = useSelector((state: RootState) => state.projectSlide).projectUpdated;
  const [openDeleteProject, setOpenDeleteProject] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [projectNameDelete, setProjectNameDelete] = useState<string>();
  const [projectData, setProjectData] = useState(project);
  const handleDeleteProject = async () => {
    try {
      setLoadingDelete(true);
      if (!projectNameDelete || !openDeleteProject) {
        return;
      }
      const response = await remove(projectData.workspace_id, projectData.id);
      if (response && response.code === API_CODE.OK) {
        router.replace(`/workspace/${project.workspace_id}/project`);
        return;
      }
      setLoadingDelete(false);
    } catch (error) {
      setLoadingDelete(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  useEffect(() => {
    if (projectUpdated) {
      setProjectData(projectUpdated);
    }
  }, [projectUpdated]);
  return (
    <Sidebar open={open} width={800} headerTitle={t('tasks.page_title_project_setting')} setOpen={setOpen}>
      <ProjectSettingInfo project={projectData} />
      <ProjectSettingVisibility project={projectData} />
      <ProjectSettingMember project={projectData} />
      <div className="row mt-4">
        <div className="col-12">
          <p className="pointer text-danger" onClick={() => setOpenDeleteProject (true)}>
            <FontAwesomeIcon icon={faTrash} /> {t('project_setting.setting_delete_project_title')}
          </p>
        </div>
      </div>
      <Modal 
        closable={false}
        open={openDeleteProject} 
        title={t('project_setting.label_delete_project')}
        footerBtn={[
          <Button color='default' key={1} onClick={() => setOpenDeleteProject (false)} className='mr-2' disabled={loadingDelete}>
            {t('btn_cancel')}
          </Button>,
          <Button key={2} color={loadingDelete ? 'secondary' : 'primary'} type="submit" disabled={loadingDelete || projectNameDelete !== projectData.name} onClick={handleDeleteProject}>
            {loadingDelete ? <Loading color="light" /> : t('btn_delete')}
          </Button>
        ]
        }
        setOpen={setOpenDeleteProject} 
      >
        <div className="row">
          <div className="col-12">
            <Input type="text" onChange={(e) => setProjectNameDelete (e.target.value)} />
          </div>
        </div>
      </Modal>
    </Sidebar>
  )
}
export default ProjectSetting;