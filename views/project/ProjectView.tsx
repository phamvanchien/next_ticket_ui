"use client"
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import { faAngleDoubleDown, faBullseye, faEnvelope, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CreateProjectModal from "./components/CreateProjectModal";
import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { AppErrorType, BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
import { catchError } from "@/services/base.service";
import { projects } from "@/api/project.api";
import { API_CODE } from "@/enums/api.enum";
import ErrorPage from "@/common/layouts/ErrorPage";
import ProjectInvitationModal from "./components/ProjectInvitationModal";
import { WorkspaceType } from "@/types/workspace.type";
import Loading from "@/common/components/Loading";
import { ProjectType } from "@/types/project.type";
import ProjectItem from "./components/ProjectItem";
import { useTranslations } from "next-intl";

interface ProjectViewProps {
  workspace: WorkspaceType
}

const ProjectView: React.FC<ProjectViewProps> = ({ workspace }) => {
  const defaultPageSize = 10;
  const t = useTranslations();
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [openModal, setOpenModal] = useState(false);
  const [projectData, setProjectData] = useState<ResponseWithPaginationType<ProjectType[]>>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppErrorType | null>(null);
  const [keyword, setKeyword] = useState<string>('');
  const [debounceKeyword, setDebounceKeyword] = useState<string>('');
  const [inviteModal, setInviteModal] = useState(false);
  const [originTotal, setOriginTotal] = useState(0);
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
        if (!projectData) {
          setOriginTotal(response.data.total);
        }
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
      <div className="col-6">
        <h3><FontAwesomeIcon icon={faBullseye} className="text-primary" /> {t('projects.page_title')}</h3>
      </div>
      <div className="col-6">
        <Button color="default" className="letter-btn float-right mt-2 btn-no-border" outline onClick={() => setInviteModal (true)}>
          <FontAwesomeIcon icon={faEnvelope} /> {t('projects.invitation')}
        </Button>
        <Button color="primary" className="create-btn mt-2 mr-2 float-right" onClick={() => setOpenModal (true)}>
          {t('btn_new')} <FontAwesomeIcon icon={faPlus} />
        </Button>
      </div>
    </div>
    <div className="row mt-2">
      {
        (originTotal > 8) &&
        <div className="col-12 col-lg-4">
          <Input type="search" placeholder={t('projects.placeholder_input_search')} className="float-left input-search mt-2" onChange={handleChangeKeyword} />
        </div>
      }
    </div>
    <div className="row mt-4">
      {
        loading &&
        <div className="col-12 text-center mt-4">
          <Loading color="primary" size={50} />
        </div>
      }
      {
        (!loading && projectData && projectData.total > 0) && projectData.items.map(project => (
          <ProjectItem project={project} key={project.id} />
        ))
      }
      {
        (!loading && projectData && projectData.total === 0) &&
        <div className="col-12 text-center">
          <h6 className="text-muted">{t('projects.project_empty_message')}</h6>
        </div>
      }
      {
        (!loading && projectData && projectData.total > pageSize) &&
        <div className="col-12 text-center">
          <a href="#" className="text-secondary" onClick={handleViewMoreProjects}>
            {t('btn_view_more')} <FontAwesomeIcon icon={faAngleDoubleDown} />
          </a>
        </div>
      }
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