"use client"
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import { faAngleDoubleDown, faBullseye, faEnvelope, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CreateProjectModal from "./components/CreateProjectModal";
import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import ProjectTableHead from "./components/ProjectTableHead";
import ProjectTableItem from "./components/ProjectTableItem";
import { AppErrorType, BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
import { catchError } from "@/services/base.service";
import { projects } from "@/api/project.api";
import { API_CODE } from "@/enums/api.enum";
import ErrorPage from "@/common/layouts/ErrorPage";
import ProjectInvitationModal from "./components/ProjectInvitationModal";
import { WorkspaceType } from "@/types/workspace.type";
import Loading from "@/common/components/Loading";
import { ProjectType } from "@/types/project.type";

interface ProjectViewProps {
  workspace: WorkspaceType
}

const ProjectView: React.FC<ProjectViewProps> = ({ workspace }) => {
  const defaultPageSize = 10;
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [openModal, setOpenModal] = useState(false);
  const [projectData, setProjectData] = useState<ResponseWithPaginationType<ProjectType[]>>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppErrorType | null>(null);
  const [keyword, setKeyword] = useState<string>('');
  const [debounceKeyword, setDebounceKeyword] = useState<string>('');
  const [inviteModal, setInviteModal] = useState(false);
  const handleChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setKeyword('');
    if (event.target.value && event.target.value !== '') {
      setKeyword(event.target.value);
    }
  }
  const handleViewMoreProjects = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setPageSize(pageSize + defaultPageSize);
  }
  const loadProjects = async () => {
    try {
      if (!workspace) {
        return;
      }
      const response = await projects(workspace.id, {
        page: 1,
        size: pageSize,
        keyword: keyword
      });
      setLoading(false);
      if (response && response.code === API_CODE.OK) {
        setProjectData(response.data);
        return;
      }
      setError(catchError(response));
    } catch (error) {
      setLoading(false);
      setError(catchError(error as BaseResponseType));
    }
  }
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceKeyword(keyword);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);
  useEffect(() => {
    loadProjects();
  }, [debounceKeyword, pageSize, workspace.id]);
  if (error) {
    return <ErrorPage errorCode={500} />
  }
  return <>
    <div className="row">
      <div className="col-12">
          <h3><FontAwesomeIcon icon={faBullseye} className="text-primary" /> Projects</h3>
      </div>
    </div>
    <div className="row mt-4">
      <div className="col-6 col-lg-6 mb-2">
        <Button color="primary" className="create-btn mt-2 mr-2" onClick={() => setOpenModal (true)}>
          New <FontAwesomeIcon icon={faPlus} />
        </Button>
        <Button color="secondary" className="letter-btn mt-2 btn-no-border" outline onClick={() => setInviteModal (true)}>
          <FontAwesomeIcon icon={faEnvelope} /> Invitation
        </Button>
      </div>
      {
        (projectData) &&
        <div className="col-6 col-lg-6">
          <Input type="search" placeholder="Search projects" className="float-right input-search mt-2" onChange={handleChangeKeyword} />
        </div>
      }
    </div>
    <div className="row">
      <div className="col-12 col-lg-12">
        <div className="table-responsive">
          <table className="table">
            <ProjectTableHead />
            <tbody>
              {
                loading &&
                <tr>
                  <td colSpan={6} className="text-center">
                    <Loading color="primary" size={40} />
                  </td>
                </tr>
              }
              {
                (!loading && projectData && projectData.total > 0) && projectData.items.map(project => (
                  <ProjectTableItem key={project.id} project={project} loadProjects={loadProjects} />
                ))
              }
              {
                (!loading && projectData && projectData.total === 0) &&
                <tr>
                  <td colSpan={6}>
                    <h6 className="text-muted text-center">Your projects will be show here</h6>
                  </td>
                </tr>
              }
              {
                (!loading && projectData && projectData.total > pageSize) &&
                <tr>
                  <td colSpan={6} className="text-left">
                    <a href="#" className="text-secondary" onClick={handleViewMoreProjects}>
                      View more <FontAwesomeIcon icon={faAngleDoubleDown} />
                    </a>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <ProjectInvitationModal 
      openModal={inviteModal} 
      setOpenModal={setInviteModal} 
      loadProjects={loadProjects} 
    />
    <CreateProjectModal 
      openModal={openModal} 
      setOpenModal={setOpenModal} 
      loadProjects={loadProjects} 
    />
  </>
}
export default ProjectView;