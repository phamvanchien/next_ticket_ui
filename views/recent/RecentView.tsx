"use client"
import { projects } from "@/api/project.api";
import { tasks } from "@/api/workspace.api";
import UserAvatar from "@/common/components/AvatarName";
import NoData from "@/common/components/NoData";
import RelativeTime from "@/common/components/RelativeTime";
import SkeletonLoading from "@/common/components/SkeletonLoading";
import UserGroup from "@/common/components/UserGroup";
import { API_CODE } from "@/enums/api.enum";
import { setSidebarSelected } from "@/reduxs/menu.redux";
import { useAppDispatch } from "@/reduxs/store.redux";
import { BaseResponseType } from "@/types/base.type";
import { ProjectType } from "@/types/project.type";
import { TaskType } from "@/types/task.type";
import { dateToString, displaySmallMessage } from "@/utils/helper.util";
import { faHistory, faCheckSquare, faBullseye, faGlobe, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface RecentViewProps {
  workspaceId: number;
}

interface DataStorageType {
  id: number
  date: string
}

const RecentView: React.FC<RecentViewProps> = ({ workspaceId }) => {
  const [projectsData, setProjectsData] = useState<ProjectType[]>();
  const [taskList, setTaskList] = useState<TaskType[]>();
  const router = useRouter();
  const t = useTranslations();
  const dispatch = useAppDispatch();

  const loadProjects = async (projectStorage: DataStorageType[]) => {
    try {
      const response = await projects(workspaceId, {
        page: 1,
        size: 10,
        ids: projectStorage.map((item: { id: number }) => item.id).join(',')
      });
      if (response && response.code === API_CODE.OK) {
        const data = response.data.items;
        const results = [];
        for (let i = 0; i < projectStorage.length; i++) {
          const project = data.find(_v => _v.id === projectStorage[i].id);
          if (project) {
            project.created_at = projectStorage[i].date;
            results.push(project);
          }
        }
        setProjectsData(results);
        return;
      }
      displaySmallMessage('error', response.error?.message);
    } catch (error) {
      displaySmallMessage('error', (error as BaseResponseType).error?.message);
    }
  };

  const loadTaskList = async (taskStorage: DataStorageType[]) => {
    try {
      if (!projectsData) {
        return;
      }
      const response = await tasks(workspaceId, {
        page: 1,
        size: 10,
        ids: taskStorage.map((item: { id: number }) => item.id).join(',')
      });
      if (response && response.code === API_CODE.OK) {
        const data = response.data.items;
        const results = [];
        for (let i = 0; i < taskStorage.length; i++) {
          const task = data.find(_v => _v.id === taskStorage[i].id);
          if (task) {
            task.created_at = taskStorage[i].date;
            results.push(task);
          }
        }
        setTaskList(results);
        return;
      }
      displaySmallMessage('error', response.error?.message);
    } catch (error) {
      displaySmallMessage('error', (error as BaseResponseType).error?.message);
    }
  };

  useEffect(() => {
    dispatch(setSidebarSelected('recent'));
    const projectIdsLocalStorage = localStorage.getItem("recent_projects");
    const projectStorage = JSON.parse(projectIdsLocalStorage || '[]');
    if (projectStorage && projectStorage.length > 0) {
      loadProjects(projectStorage);
    } else {
      setProjectsData([]);
    }
  }, []);

  useEffect(() => {
    if (projectsData && projectsData.length > 0) {
      const taskIdsLocalStorage = localStorage.getItem("recent_tasks");
      const taskStorage = JSON.parse(taskIdsLocalStorage || '[]');
      if (taskStorage && taskStorage.length > 0) {
        loadTaskList(taskStorage);
      } else {
        setTaskList([]);
      }
    }
  }, [projectsData]);

  return (
    <div className="container-fluid recent-view px-3 py-4">
      <div className="d-flex align-items-center mb-4">
        <FontAwesomeIcon icon={faHistory} className="me-2 text-dark" />
        <h2 className="mb-0">{t("recent.page_title")}</h2>
      </div>

      {
        (projectsData && projectsData.length === 0) ?
        <NoData message="Không có dữ liệu" /> :
        <>
          <div className="mb-4">
            <h4 className="section-title mb-3">{t('recent.project_recent')}</h4>
            <ul className="list-group">
              {
                !projectsData && <>
                  <SkeletonLoading heigth={50} className="mt-2" />
                  <SkeletonLoading heigth={50} className="mt-2" />
                  <SkeletonLoading heigth={50} className="mt-2" />
                </>
              }
              {projectsData && projectsData.map((project, index) => (
                <li key={index} className="list-group-item recent-list-item d-flex justify-content-between align-items-center" onClick={() => router.push(`/workspace/${project.workspace_id}/project/${project.id}`)}>
                  <div className="d-flex align-items-center w-90">
                    <FontAwesomeIcon icon={faBullseye} className="me-3 text-primary fs-5" />
                    <div>
                      <div className="fw-bold">{project.name}</div>
                      <div className="text-muted small">{t('recent.view_at')}: <RelativeTime time={project.created_at} icon /></div>
                    </div>
                  </div>
                  <span className="float-right d-md-block d-none" style={{ fontSize: 12 }}>
                    <FontAwesomeIcon icon={project.is_public ? faGlobe : faLock} /> {project.is_public ? t('common.public_check') : t('common.private_check')}
                  </span>
                  <UserAvatar className="float-right" name={project.user.first_name} avatar={project.user.avatar} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="section-title mb-3">{t('recent.task_recent')}</h4>
            <ul className="list-group">
              {
                !taskList && <>
                  <SkeletonLoading heigth={50} className="mt-2" />
                  <SkeletonLoading heigth={50} className="mt-2" />
                  <SkeletonLoading heigth={50} className="mt-2" />
                </>
              }
              {taskList && taskList.map((task, index) => (
                <li key={index} className="list-group-item recent-list-item d-flex justify-content-between align-items-center" onClick={() => router.push(`/workspace/${task.workspace_id}/project/${task.project_id}?task=${task.id}`)}>
                  <div className="d-flex align-items-center w-90">
                    <FontAwesomeIcon icon={faCheckSquare} className="me-3 text-success fs-5" />
                    <div>
                      <div className="fw-bold">{task.title}</div>
                      <div className="text-muted small">{t('recent.in_project')}: {task.project.name}</div>
                      <div className="text-muted small">{t('recent.view_at')}: <RelativeTime time={task.created_at} icon /></div>
                    </div>
                  </div>
                  <span className={`float-right d-md-block d-none`} style={{ fontSize: 12, color: task.status.color }}>
                    {task.status.name}
                  </span>
                  <UserGroup>
                    {task.assign.map(user => (
                      <UserAvatar className="float-right" key={user.id} name={user.first_name} avatar={user.avatar} />
                    ))}
                  </UserGroup>
                </li>
              ))}
            </ul>
          </div> 
        </>
      }
    </div>
  );
};

export default RecentView;