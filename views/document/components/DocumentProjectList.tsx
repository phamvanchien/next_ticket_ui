import { projects } from "@/api/project.api";
import Input from "@/common/components/Input";
import { API_CODE } from "@/enums/api.enum";
import useDelaySearch from "@/hooks/useDelaySearch";
import { ResponseWithPaginationType } from "@/types/base.type";
import { ProjectType } from "@/types/project.type";
import { faCheckCircle, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

interface DocumentProjectListProps {
  workspaceId: number
  projectShare: ProjectType[]
  setProjectShare: (projectShare: ProjectType[]) => void
}

const DocumentProjectList: React.FC<DocumentProjectListProps> = ({ workspaceId, projectShare, setProjectShare }) => {
  const [projectsData, setProjectsData] = useState<ResponseWithPaginationType<ProjectType[]>>();
  const [projectsSelected, setProjectsSelected] = useState<ProjectType[]>(projectShare);
  const { value: keyword, debouncedValue, handleChange } = useDelaySearch("", 500);
  const t = useTranslations();
  const handleSelectProject = (project: ProjectType) => {
    if (!projectsSelected.some(m => m.id === project.id)) {
      setProjectsSelected([...projectsSelected, project]);
    }
  };
  const handleRemoveProject = (projectId: number) => {
    setProjectsSelected(projectsSelected.filter(m => m.id !== projectId));
  };
  const loadProjects = async () => {
    try {
      if (!debouncedValue) {
        setProjectsData(undefined);
        return;
      };
      const response = await projects(workspaceId, {
        page: 1,
        size: 5,
        keyword: debouncedValue
      });
      if (response?.code === API_CODE.OK) {
        setProjectsData(response.data);
      } else {
        setProjectsData(undefined);
      }
    } catch (error) {
      setProjectsData(undefined);
    }
  };
  useEffect(() => {
    loadProjects();
  }, [debouncedValue]);
  useEffect(() => {
    setProjectShare(projectsSelected);
  }, [projectsSelected]);
  return (
    <>
      <div className="col-12 mt-4">
        <Input
          type="search"
          placeholder={t('projects.placeholder_input_search')}
          value={keyword}
          onChange={handleChange}
        />
        {projectsData && (
          <ul className="list-group">
            {projectsData.items.map((project) => (
              <li
                className="list-group-item pointer"
                key={project.id}
                onClick={() => handleSelectProject(project)}
              >
                {project.name} {projectsSelected.find(_v => _v.id === project.id) && <FontAwesomeIcon icon={faCheckCircle} className="text-success float-right mt-2" />}
              </li>
            ))}
          </ul>
        )}
      </div>

      {projectsSelected.length > 0 && (
        <div className="col-12 mt-4 mb-4">
          <ul className="list-group">
            {projectsSelected.map((item, index) => (
              <li
                className="list-group-item d-flex justify-content-between align-items-center"
                key={index}
              >
                <div>
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    className="text-danger pointer me-2"
                    onClick={() => handleRemoveProject(item.id)}
                  />
                  {item.name}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
export default DocumentProjectList;