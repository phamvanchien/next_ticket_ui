import React, { useEffect, useRef, useState } from "react";
import ProjectStatusSetting from "./components/ProjectStatusSetting";
import { ProjectType } from "@/types/project.type";
import ProjectTagSetting from "./components/ProjectTagSetting";
import ProjectMemberSetting from "./components/ProjectMemberSetting";
import ProjectPublicSetting from "./components/ProjectPublicSetting";
import ProjectRemove from "./components/ProjectRemove";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import Input from "@/common/components/Input";
import { update } from "@/api/project.api";
import { API_CODE } from "@/enums/api.enum";
import { notify } from "@/utils/helper.util";
import { catchError } from "@/services/base.service";

interface ProjectSettingViewProps {
  project: ProjectType
}

const ProjectSettingView: React.FC<ProjectSettingViewProps> = ({ project }) => {
  const [error, setError] = useState<AppErrorType | null>(null);
  const [projectName, setProjectName] = useState(project.name);
  const projectNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = async (event: MouseEvent) => {
      if (projectNameRef.current && !projectNameRef.current.contains(event.target as Node)) {
        if ((projectNameRef.current?.value && projectNameRef.current.value !== projectName)) {
          try {
            setError(null);
            const response = await update(project.workspace_id, project.id, {
              name: projectNameRef.current.value
            });
            if (response && response.code === API_CODE.OK) {
              setProjectName(projectNameRef.current.value);
              notify('Project is updated', 'success');
              return;
            }
            setError(catchError(response));
          } catch (error) {
            setError(catchError(error as BaseResponseType));
          }
        }
      };
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [projectName]);

  return <>
    <div className="row">
      {
        (error) && 
        <div className="col-12 col-lg-4 col-sm-6 mt-4">
          <div className="alert alert-light alert-error">
            <b className="text-danger mt-2">Error: </b> {error.message}
          </div>
        </div>
      }
      <div className="col-12 col-lg-4 col-sm-6 mt-4">
        <Input type="text" defaultValue={projectName} ref={projectNameRef} style={{ background: '#3333' }} />
      </div>
    </div>
    <ProjectPublicSetting project={project} />
    <ProjectStatusSetting project={project} />
    <ProjectTagSetting project={project} />
    <ProjectMemberSetting project={project} />
    <ProjectRemove projectId={project.id} projectName={projectName} />
  </>;
};

export default ProjectSettingView;