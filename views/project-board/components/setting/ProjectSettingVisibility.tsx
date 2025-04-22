import { update } from "@/api/project.api";
import Button from "@/common/components/Button";
import Dropdown from "@/common/components/Dropdown";
import { API_CODE } from "@/enums/api.enum";
import { setProjectUpdated } from "@/reduxs/project.redux";
import { useAppDispatch } from "@/reduxs/store.redux";
import { BaseResponseType } from "@/types/base.type";
import { ProjectType } from "@/types/project.type";
import { displayMessage } from "@/utils/helper.util";
import { faCheck, faGlobe, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MenuProps } from "antd";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

interface ProjectSettingVisibilityProps {
  project: ProjectType
}

const ProjectSettingVisibility: React.FC<ProjectSettingVisibilityProps> = ({ project }) => {
  const [projectData, setProjectData] = useState(project);
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const handleUpdateProject = async (isPublic: boolean) => {
    try {
      if (isPublic === projectData.is_public) {
        return;
      }
      const response = await update (project.workspace_id, project.id, {
        is_public: isPublic
      });
      if (response && response.code === API_CODE.OK) {
        setProjectData(response.data);
        dispatch(setProjectUpdated(response.data));
        return;
      }
      displayMessage('error', response.error?.message);
    } catch (error) {
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  useEffect(() => {
    setProjectData(project);
  }, [project]);
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <span className="pointer" onClick={() => handleUpdateProject (false)}>
          <FontAwesomeIcon icon={faLock} style={{ marginRight: 7 }} /> {t('private_check')} {!projectData.is_public && <FontAwesomeIcon icon={faCheck} className="text-success float-right" />}
        </span>
      ),
    },
    {
      key: '2',
      label: (
        <span className="pointer" onClick={() => handleUpdateProject (true)}>
          <FontAwesomeIcon icon={faGlobe} style={{ marginRight: 7 }} /> {t('public_check')} {projectData.is_public && <FontAwesomeIcon icon={faCheck} className="text-success float-right" />}
        </span>
      ),
    }
  ];
  return <div className="row">
    <div className="col-12 text-secondary">
      <h6 className="text-dark">{t('project_setting.project_visibility_title')}</h6>
      <FontAwesomeIcon icon={projectData.is_public ? faGlobe : faLock} style={{ marginRight: 7 }} />
      {
        projectData.is_public ? 
        <span>
          {t('project_setting.project_public_note')}
        </span> : 
        <span>
          {t('project_setting.project_private_note')}
        </span>
      }
    </div>
    <div className="col-4 col-lg-3 mt-2">
      <Dropdown items={items}>
        <Button color="secondary" outline>{t('change_btn')}</Button>
      </Dropdown>
    </div>
    <div className="col-12">
    <hr/>
    </div>
  </div>
}
export default ProjectSettingVisibility;