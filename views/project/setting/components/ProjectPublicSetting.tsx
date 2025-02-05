import { update } from "@/api/project.api";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { catchError } from "@/services/base.service";
import { BaseResponseType } from "@/types/base.type";
import { ProjectType, RequestUpdateProjectType } from "@/types/project.type";
import { notify } from "@/utils/helper.util";
import { faCircle, faCircleCheck, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useSelector } from "react-redux";

interface ProjectPublicSettingProps {
  project: ProjectType
}

const ProjectPublicSetting: React.FC<ProjectPublicSettingProps> = ({ project }) => {
  const [projectPublic, setProjectPublic] = useState(project.is_public);
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const t = useTranslations();
  const updateProject = async (payload: RequestUpdateProjectType, callbackSuccess?: () => void) => {
    try {
      if (!workspace) {
        return;
      }

      const response = await update (workspace.id, project.id, payload);
      if (response && response.code === API_CODE.OK) {
        if (callbackSuccess) {
          callbackSuccess();
        }
        return;
      }
      notify(response.error?.message ?? '', 'error');
    } catch (error) {
      notify(catchError(error as BaseResponseType)?.message ?? '', 'error');
    }
  }
  return <>
    <div className="row">
      <div className="col-12 col-lg-4 col-sm-6 mt-4">
        <h5 className="text-muted">{t('public_check')} / {t('private_check')}</h5>
        <i className="text-muted">
          <FontAwesomeIcon icon={faInfoCircle} /> {t('project_setting.setting_public_title')}
        </i>
      </div>
    </div>
    <div className="row">
      <div className="col-6 col-lg-2 col-sm-6 mt-4">
        <FontAwesomeIcon 
          icon={projectPublic ? faCircleCheck : faCircle} 
          className={`text-${projectPublic ? 'success' : 'secondary'}`}
          style={{ cursor: 'pointer' }}
          onClick={!projectPublic ? () => updateProject ({is_public: true}, () => { setProjectPublic (true) }) : undefined}
        /> {t('public_check')}
      </div>
      <div className="col-6 col-lg-2 col-sm-6 mt-4">
        <FontAwesomeIcon 
          icon={!projectPublic ? faCircleCheck : faCircle} 
          className={`text-${!projectPublic ? 'success' : 'secondary'}`} 
          style={{ cursor: 'pointer' }}
          onClick={projectPublic ? () => updateProject ({is_public: false}, () => { setProjectPublic (false) }) : undefined}
        /> {t('private_check')}
      </div>
    </div>
  </>
}
export default ProjectPublicSetting;