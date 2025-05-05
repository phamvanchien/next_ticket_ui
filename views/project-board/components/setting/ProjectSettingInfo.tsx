import { update } from "@/api/project.api";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import Loading from "@/common/components/Loading";
import { API_CODE } from "@/enums/api.enum";
import { setProjectUpdated } from "@/reduxs/project.redux";
import { useAppDispatch } from "@/reduxs/store.redux";
import { BaseResponseType } from "@/types/base.type";
import { ProjectType } from "@/types/project.type";
import { displayMessage } from "@/utils/helper.util";
import { faBullseye, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

interface ProjectSettingInfoProps {
  project: ProjectType
}

const ProjectSettingInfo: React.FC<ProjectSettingInfoProps> = ({  project}) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const [openEdit, setOpenEdit] = useState(false);
  const [projectName, setProjectName] = useState(project.name);
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState(project);
  const handleUpdateProject = async () => {
    try {
      setLoading(true);
      const response = await update (project.workspace_id, project.id, {
        name: projectName
      });
      setLoading(false);
      if (response && response.code === API_CODE.OK) {
        setOpenEdit(false);
        setProjectData(response.data);
        dispatch(setProjectUpdated(response.data));
        return;
      }
      displayMessage('error', response.error?.message);
    } catch (error) {
      setLoading(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  useEffect(() => {
    setProjectName(project.name);
    setProjectData(project);
  }, [project]);
  return <div className="row">
    <div className="col-12 text-secondary">
      {
        openEdit ? 
        <>
          <Input type="text" value={projectName} onChange={(e) => setProjectName (e.target.value)} /> 
          <Button color={loading ? 'secondary' : 'primary'} className="float-right mt-2" onClick={handleUpdateProject} disabled={loading}>
            {loading ? <Loading color="light" /> : t('common.btn_save')}
          </Button>
          <Button color="default" className="float-right mt-2" onClick={() => setOpenEdit (false)} disabled={loading}>{t('common.btn_cancel')}</Button>
        </>
        :
        <h6><FontAwesomeIcon icon={faBullseye} /> {projectData.name} <FontAwesomeIcon icon={faPencil} className="pointer" onClick={() => setOpenEdit (true)} /></h6>
      }
    </div>
    <div className="col-12">
      <hr/>
    </div>
  </div>
}
export default ProjectSettingInfo;