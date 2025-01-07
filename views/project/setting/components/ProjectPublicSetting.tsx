import { update } from "@/api/project.api";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { catchError } from "@/services/base.service";
import { BaseResponseType } from "@/types/base.type";
import { ProjectType, RequestUpdateProjectType } from "@/types/project.type";
import { notify } from "@/utils/helper.util";
import { faCircle, faCircleCheck, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useSelector } from "react-redux";

interface ProjectPublicSettingProps {
  project: ProjectType
}

const ProjectPublicSetting: React.FC<ProjectPublicSettingProps> = ({ project }) => {
  const [projectPublic, setProjectPublic] = useState(project.is_public);
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
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
        <h5 className="text-muted">Public / Private</h5>
        <i className="text-muted">
          <FontAwesomeIcon icon={faInfoCircle} /> When private mode is enabled, your project is only accessible to members.
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
        /> Public
      </div>
      <div className="col-6 col-lg-2 col-sm-6 mt-4">
        <FontAwesomeIcon 
          icon={!projectPublic ? faCircleCheck : faCircle} 
          className={`text-${!projectPublic ? 'success' : 'secondary'}`} 
          style={{ cursor: 'pointer' }}
          onClick={projectPublic ? () => updateProject ({is_public: false}, () => { setProjectPublic (false) }) : undefined}
        /> Private
      </div>
    </div>
  </>
}
export default ProjectPublicSetting;