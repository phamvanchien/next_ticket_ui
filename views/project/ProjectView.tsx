"use client";
import { inviteList, projects } from "@/api/project.api";
import UserAvatar from "@/common/components/AvatarName";
import Button from "@/common/components/Button";
import LoadingGif from "@/common/components/LoadingGif";
import NoData from "@/common/components/NoData";
import UserGroup from "@/common/components/UserGroup";
import { API_CODE } from "@/enums/api.enum";
import { BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
import { ProjectInviteType, ProjectType } from "@/types/project.type";
import { displaySmallMessage } from "@/utils/helper.util";
import { faBullseye, faEnvelope, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "antd";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import ProjectCreate from "./components/ProjectCreate";
import { members } from "@/api/workspace.api";
import { UserType } from "@/types/user.type";
import useDelaySearch from "@/hooks/useDelaySearch";
import ProjectItem from "./components/ProjectItem";
import ProjectAddMember from "./components/ProjectAddMember";
import ProjectInvite from "./components/invite/ProjectInvite";

interface ProjectViewProps {
  workspaceId: number
}

const ProjectView: React.FC<ProjectViewProps> = ({ workspaceId }) => {
  const t = useTranslations();
  const [projectsData, setProjectsData] = useState<ProjectType[]>([]);
  const [projectsTotal, setProjectsTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [workspaceMembers, setWorkspaceData] = useState<UserType[]>([]);
  const [projectCreated, setProjectCreated] = useState<ProjectType>();
  const [openAddMember, setOpenAddMember] = useState<number>();
  const [invitesData, setInvitesData] = useState<ResponseWithPaginationType<ProjectInviteType[]>>();
  const [openInvite, setOpenInvite] = useState(false);
  const [inviteDecline, setInviteDecline] = useState(0);
  const [projectJoined, setProjectJoined] = useState<ProjectType>();
  const { value: keyword, debouncedValue, handleChange } = useDelaySearch("", 500);
  const { value: keywordProject, debouncedValue: debouncedKeywordProject, handleChange: handleChangeProject } = useDelaySearch("", 500);
  const loadProjects = async () => {
    try {
      const response = await projects(workspaceId, {
        page: 1,
        size: 10,
        keyword: debouncedKeywordProject
      });
      setLoading(false);
      if (response && response.code === API_CODE.OK) {
        setProjectsData(response.data.items);
        setProjectsTotal(response.data.total);
        return;
      }
      displaySmallMessage('error', response.error?.message);
    } catch (error) {
      setLoading(false);
      displaySmallMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  const loadWorkspaceMember = async () => {
    try {
      const response = await members(workspaceId, 1, 5, '');
      if (response && response.code === API_CODE.OK) {
        setTimeout(() => {
          setWorkspaceData(response.data.items);
        }, 1000);
        return;
      }
      displaySmallMessage('error', response.error?.message);
    } catch (error) {
      displaySmallMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  const loadInvites = async () => {
    try {
      const response = await inviteList(workspaceId, 1, 20);
      if (response && response.code === API_CODE.OK) {
        setInvitesData(response.data);
        return;
      }
      displaySmallMessage('error', response.error?.message);
    } catch (error) {
      displaySmallMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  useEffect(() => {
    loadProjects();
  }, [debouncedKeywordProject, workspaceId]);
  useEffect(() => {
    loadWorkspaceMember();
  }, [workspaceId]);
  useEffect(() => {
    if (projectCreated) {
      setProjectsTotal(projectsTotal + 1);
      setProjectsData((prevProjects) => {
        const filteredProjects = prevProjects?.filter(ws => ws.id !== projectCreated.id) || [];
        return [projectCreated, ...filteredProjects];
      });
    }
  }, [projectCreated]);
  useEffect(() => {
    if (projectJoined) {
      setOpenInvite(false);
      setProjectsTotal(projectsTotal + 1);
      setProjectsData((prevProjects) => {
        const filteredWorkspaces = prevProjects?.filter(ws => ws.id !== projectJoined.id) || [];
        return [projectJoined, ...filteredWorkspaces];
      });
    }
  }, [projectJoined]);
  useEffect(() => {
    loadInvites();
  }, [inviteDecline, projectJoined]);

  return <>
  <div className="container-fluid px-3 py-3">
    <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
      <h3 className="mb-0">
        <FontAwesomeIcon icon={faBullseye} className="text-primary me-2" />
        {t("projects.page_title")}
      </h3>

      {
        (projectsTotal > 0) &&
        <div className="d-flex gap-3">
          <div className="position-relative">
            <FontAwesomeIcon icon={faSearch} className="position-absolute ms-3 wp-search-icon" />
            <input
              type="text"
              className="form-control ps-5 rounded wp-search-input"
              placeholder={t('projects.placeholder_input_search') + '...'}
              value={keywordProject}
              onChange={handleChangeProject}
            />
          </div>
          
          <Button color="primary" className="d-flex align-items-center rounded d-none d-md-flex" onClick={() => setOpenCreate (true)}>
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: 5 }} /> {t('btn_new')}
          </Button>

          <Button color="default" className="d-flex align-items-center rounded d-none d-md-flex" onClick={() => setOpenInvite (true)}>
            <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: 5 }} /> {t('top_menu.invitation')}
          </Button>
        </div>
      }
    </div>

    {
      loading && <div className="row">
        <div className="col-12 text-center">
          <LoadingGif />
        </div>
      </div>
    }

    {
      !loading && <>
      <div className="row">
        {(projectsTotal > 0) ? (
          projectsData.map((project) => (
            <div key={project.id} className="col-lg-3 col-md-4 col-6 mb-4">
              <ProjectItem project={project} setOpenAddMember={setOpenAddMember} />
            </div>
          ))
        ) : (
          <div className="col-12">
            <NoData message={t('projects.no_project_message')} description={t('projects.no_project_description')}>
              <center>
                <Button color="primary" className="d-flex align-items-center rounded d-none d-md-flex" onClick={() => setOpenCreate (true)}>
                  <FontAwesomeIcon icon={faPlus} style={{ marginRight: 5 }} /> {t('btn_new')}
                </Button>
              </center>
            </NoData>
          </div>
        )}
      </div>
      <div className="d-md-none">
        <div className="floating-buttons">
          <Button color="primary" className="rounded-circle shadow" onClick={() => setOpenCreate (true)}>
            <FontAwesomeIcon icon={faPlus} size="lg" />
          </Button>
          <Button color="secondary" className="rounded-circle shadow" onClick={() => setOpenInvite (true)}>
            <FontAwesomeIcon icon={faEnvelope} size="lg" />
          </Button>
        </div>
      </div>
      </>
    }
    <ProjectCreate
      workspaceMembers={workspaceMembers}
      open={openCreate}
      setOpen={setOpenCreate}
      workspaceId={workspaceId}
      keyword={keyword}
      debouncedValue={debouncedValue}
      handleChange={handleChange}
      setProjectCreated={setProjectCreated}
    />
    <ProjectAddMember 
      projectId={openAddMember} 
      workspaceId={workspaceId}
      setOpenModal={setOpenAddMember} 
    />
    <ProjectInvite
      open={openInvite}
      setOpen={setOpenInvite}
      invitesData={invitesData}
      setInviteDecline={setInviteDecline}
      setProjectJoined={setProjectJoined}
    />
  </div>
  </>
};

export default ProjectView;
