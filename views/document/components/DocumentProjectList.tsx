import { projects } from "@/api/project.api";
import Input from "@/common/components/Input";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { ProjectType, ResponseProjectsDataType } from "@/types/project.type";
import { faCircle, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface DocumentProjectListProps {
  setProjectShared: (projectShared: ProjectType[]) => void
  projectShared: ProjectType[]
}

const DocumentProjectList: React.FC<DocumentProjectListProps> = ({ projectShared, setProjectShared }) => {
  const [keyword, setKeyword] = useState<string>('');
  const [debounceKeyword, setDebounceKeyword] = useState<string>('');
  const [projectData, setProjectData] = useState<ResponseProjectsDataType>();
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const handleSelectProject = (project: ProjectType) => {
    const added = projectShared.find(p => p.id === project.id);
    if (!added) {
      setProjectShared([...projectShared, project]);
    }
  }
  const handleChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setKeyword('');
    if (event.target.value && event.target.value !== '') {
      setKeyword(event.target.value);
    }
  }
  const loadProjects = async () => {
    try {
      if (!workspace) {
        return;
      }
      const response = await projects(workspace.id, {
        page: 1,
        size: 5,
        keyword: keyword
      });
      if (response && response.code === API_CODE.OK) {
        setProjectData(response.data);
        return;
      }
      setProjectData(undefined);
    } catch (error) {
      setProjectData(undefined);
    }
  }
  useEffect(() => {
    loadProjects();
  }, [debounceKeyword, workspace]);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceKeyword(keyword);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);
  return (
    <div className="col-12 mt-2">
      <Input type="search" placeholder="Search projects" className="w-100" onChange={handleChangeKeyword} />
      <ul className="list-group invite-group">
        {
          projectData && projectData.items.map(project => (
            <li className="list-group-item invite-group-item pointer" key={project.id} onClick={() => handleSelectProject (project)}>
              <FontAwesomeIcon 
                icon={projectShared.find(p => p.id === project.id) ? faCircleCheck : faCircle} 
                className={`text-${projectShared.find(p => p.id === project.id) ? 'primary' : 'secondary'} mr-2`} 
              /> {project.name}
            </li>
          ))
        }
      </ul>
    </div>
  )
}
export default DocumentProjectList;