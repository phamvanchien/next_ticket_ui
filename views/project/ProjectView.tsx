"use client";
import { inviteList, projects } from "@/api/project.api";
import Button from "@/common/components/Button";
import LoadingGif from "@/common/components/LoadingGif";
import NoData from "@/common/components/NoData";
import { API_CODE } from "@/enums/api.enum";
import { BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
import { ProjectInviteType, ProjectType } from "@/types/project.type";
import { displaySmallMessage } from "@/utils/helper.util";
import { faBullseye, faEnvelope, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import ProjectCreate from "./components/ProjectCreate";
import { members } from "@/api/workspace.api";
import { UserType } from "@/types/user.type";
import useDelaySearch from "@/hooks/useDelaySearch";
import ProjectItem from "./components/ProjectItem";
import ProjectInvite from "./components/invite/ProjectInvite";
import { useAppDispatch } from "@/reduxs/store.redux";
import { setSidebarSelected } from "@/reduxs/menu.redux";
import ProjectLoading from "./components/ProjectLoading";
import { usePathname, useSearchParams } from "next/navigation";
import ImageIcon from "@/common/components/ImageIcon";

interface ProjectViewProps {
  workspaceId: number
}

const ProjectView: React.FC<ProjectViewProps> = ({ workspaceId }) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const openInviteParam = searchParams.get("openInvite");
  const [projectsData, setProjectsData] = useState<ProjectType[]>([]);
  const [projectsTotal, setProjectsTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [workspaceMembers, setWorkspaceData] = useState<UserType[]>([]);
  const [projectCreated, setProjectCreated] = useState<ProjectType>();
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
    dispatch(setSidebarSelected('project'));
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
  }, [inviteDecline, projectJoined, openInvite]);
  useEffect(() => {
    if (openInviteParam && Number(openInviteParam) === 1 && invitesData) {
      setOpenInvite(true);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("openInvite");
      const newUrl = `${pathname}${params.toString() ? "?" + params.toString() : ""}`;
      window.history.replaceState(null, "", newUrl);
    }
  }, [openInviteParam, invitesData]);

  if (loading) {
    return <ProjectLoading />
  }

  return <>
    <div className="container-fluid px-3 py-3">
      <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
        <h3 className="mb-0">
          {/* <FontAwesomeIcon icon={faBullseye} className="text-primary me-2" /> */}
          <ImageIcon name="project" width={35} height={35} />
          {t("projects_page.page_title")}
        </h3>

        {
          (projectsTotal > 0) &&
          <div className="d-flex gap-3">
            <div className="position-relative">
              <FontAwesomeIcon icon={faSearch} className="position-absolute ms-3 wp-search-icon" />
              <input
                type="text"
                className="form-control ps-5 rounded search-input"
                placeholder={t('projects_page.placeholder_input_search') + '...'}
                value={keywordProject}
                onChange={handleChangeProject}
              />
            </div>
            
            <Button color="primary" className="d-flex align-items-center rounded d-none d-md-flex" onClick={() => setOpenCreate (true)}>
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: 5 }} /> {t('common.btn_new')}
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
              <div key={project.id} className="col-lg-3 col-md-4 col-12 mb-4">
                <ProjectItem project={project} />
              </div>
            ))
          ) : (
            <div className="col-12">
              <NoData message={t('projects_page.no_project_message')} description={t('projects_page.no_project_description')}>
                <center className="d-none d-lg-block">
                  <Button color="primary" style={{ marginRight: 10 }} onClick={() => setOpenCreate (true)}>
                    <FontAwesomeIcon icon={faPlus} style={{ marginRight: 5 }} /> {t('common.btn_new')}
                  </Button>
                  <Button color="light" onClick={() => setOpenInvite (true)}>
                    <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: 5 }} /> {t('top_menu.invitation')}
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
      {/* <ProjectAddMember 
        projectId={openAddMember} 
        workspaceId={workspaceId}
        setOpenModal={setOpenAddMember} 
      /> */}
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
