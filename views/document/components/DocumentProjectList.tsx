import { projects } from "@/api/project.api";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import { API_CODE } from "@/enums/api.enum";
import useDelaySearch from "@/hooks/useDelaySearch";
import { ResponseWithPaginationType } from "@/types/base.type";
import { ProjectType } from "@/types/project.type";
import { faBullseye, faCheckCircle, faMinus, faSearch, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
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
      <div className="col-12 col-lg-12 mt-4">
        <div className="bg-white rounded-4 shadow-sm border p-3">
          <div className="d-flex justify-content-between align-items-center mb-3 px-2">
            <div className="position-relative w-100">
              <FontAwesomeIcon icon={faSearch} className="position-absolute ms-3 wp-search-icon" />
              <input
                type="text"
                className="form-control ps-5 rounded search-input float-right"
                value={keyword}
                onChange={handleChange}
                placeholder={t("projects_page.create.placeholder_input_search")}
              />
            </div>
          </div>
          {
            debouncedValue && projectsData && projectsData?.items.filter((project) => !projectsSelected.some((u) => u.id === project.id)).length > 0 &&
            <div className="table-responsive mb-2">
              <table className="table align-middle mb-0">
                <tbody>
                  {projectsData?.items.filter((project) => !projectsSelected.some((u) => u.id === project.id)).map((project, index) => (
                    <tr key={index} className="border-bottom pointer" onClick={() => handleSelectProject(project)}>
                      <td>
                        <FontAwesomeIcon icon={faBullseye} /> {project.name}
                      </td>
                      {/* <td className="fw-semibold text-dark">{user.first_name} {user.last_name}</td>
                      <td className="text-muted">{user.email}</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        </div>
        {
          projectsSelected.length > 0 &&
          <div className="table-responsive mb-2 mt-2">
            <table className="table align-middle mb-0">
              <tbody>
                {
                  projectsSelected.map((item, index) => (
                    <tr key={index} className="border-bottom">
                      <td className="text-muted">
                        <p className="m-unset">{item.name}</p>
                      </td>
                      <td className="text-end">
                        <Button size="sm" color="danger" className="px-3 rounded" onClick={() => handleRemoveProject(item.id)}>
                          <FontAwesomeIcon icon={faMinus} />
                        </Button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </>
  );
}
export default DocumentProjectList;