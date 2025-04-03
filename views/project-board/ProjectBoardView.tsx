"use client"
import UserAvatar from "@/common/components/AvatarName";
import Button from "@/common/components/Button";
import UserGroup from "@/common/components/UserGroup";
import { ProjectType } from "@/types/project.type";
import { faCheckSquare, faFilter, faGrip, faList, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import TaskSort from "./components/TaskSort";
import { useTranslations } from "next-intl";
import TaskInputSearch from "./components/TaskInputSearch";
import TaskBoard from "./components/TaskBoard";
import { tasks, tasksBoard } from "@/api/task.api";
import { displaySmallMessage } from "@/utils/helper.util";
import { BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
import { API_CODE } from "@/enums/api.enum";
import { ResponseTaskBoardDataType, TaskType } from "@/types/task.type";
import useDelaySearch from "@/hooks/useDelaySearch";
import TaskCreate from "./components/TaskCreate";
import TaskEdit from "./components/TaskEdit";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/reduxs/store.redux";
import { members } from "@/api/workspace.api";
import { setKeywordSearchMembers, setMembersProject } from "@/reduxs/project.redux";
import { membersList } from "@/api/project.api";
import TaskList from "./components/TaskList";

interface ProjectBoardViewProps {
  project: ProjectType
}
export const defaultSizeList = 20;
const ProjectBoardView: React.FC<ProjectBoardViewProps> = ({ project }) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const [tasksBoardData, setTasksBoardData] = useState<ResponseTaskBoardDataType[]>();
  const [openCreate, setOpenCreate] = useState(false);
  const [taskSelected, setTaskSelected] = useState<TaskType>();
  const [createWithStatus, setCreateWithStatus] = useState<number>();
  const [layout, setLayout] = useState(1);
  const [taskList, setTaskList] = useState<ResponseWithPaginationType<TaskType[]>>();
  const statusCreated = useSelector((state: RootState) => state.projectSlide).statusCreated;
  const statusUpdated = useSelector((state: RootState) => state.projectSlide).statusUpdated;
  const statusDeletedId = useSelector((state: RootState) => state.projectSlide).statusDeletedId;
  const keywordSearchMember = useSelector((state: RootState) => state.projectSlide).keywordSearchMember;
  const membersProject = useSelector((state: RootState) => state.projectSlide).membersProject;
  const taskCreated = useSelector((state: RootState) => state.taskSlide).taskCreated;
  const taskUpdated = useSelector((state: RootState) => state.taskSlide).taskUpdated;

  const [pageSizeList, setPageSizeList] = useState(defaultSizeList);
  const [loadingLoadMoreList, setLoadingLoadMoreList] = useState(false);
  const { value: keyword, debouncedValue, handleChange } = useDelaySearch("", 500);
  const loadTasksBoard = async () => {
    try {
      const response = await tasksBoard(project.workspace_id, project.id, {
        keyword: debouncedValue
      });
      if (response && response.code === API_CODE.OK) {
        setTasksBoardData(response.data);
        return;
      }
      displaySmallMessage('error', response.error?.message);
    } catch (error) {
      displaySmallMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  const loadMembersBoard = async () => {
    try {
      if (project.is_public) {
        const response = await members(project.workspace_id, 1, 5, keywordSearchMember);
        if (response && response.code === API_CODE.OK) {
          dispatch(setMembersProject([...response.data.items, project.user]));
          return;
        }
        return;
      }
      const response = await membersList(project.workspace_id, project.id, 1, 5, keywordSearchMember);
      if (response && response.code === API_CODE.OK) {
        dispatch(setMembersProject([...response.data.items, project.user]));
        return;
      }
      return;
    } catch (error) {
      displaySmallMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  const loadTaskList = async () => {
    try {
      const response = await tasks(project.workspace_id, project.id, {
        keyword: debouncedValue,
        page: 1,
        size: pageSizeList
      });
      setLoadingLoadMoreList(false);
      if (response && response.code === API_CODE.OK) {
        setTaskList(response.data);
        return;
      }
      displaySmallMessage('error', response.error?.message);
    } catch (error) {
      setLoadingLoadMoreList(false);
      displaySmallMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  useEffect(() => {
    if (keywordSearchMember) {
      dispatch(setKeywordSearchMembers(''));
    }
  }, [project]);
  useEffect(() => {
    if (keywordSearchMember) {
      dispatch(setKeywordSearchMembers(''));
    }
  }, [openCreate, taskSelected]);
  useEffect(() => {
    loadMembersBoard();
  }, [project, keywordSearchMember]);
  useEffect(() => {
    loadTasksBoard();
  }, [project, debouncedValue]);
  useEffect(() => {
    loadTaskList();
  }, [project, debouncedValue, pageSizeList])
  useEffect(() => {
    if (taskCreated) {
      setTasksBoardData((prevTasksBoardData) => {
        if (!prevTasksBoardData) return prevTasksBoardData;
  
        const updatedTasksBoardData = prevTasksBoardData.map((board) => {
          if (board.id === taskCreated.status.id) {
            return {
              ...board,
              tasks: [...board.tasks, taskCreated],
            };
          }
          return board;
        });
  
        return updatedTasksBoardData;
      });
    }
  }, [taskCreated]);
  useEffect(() => {
    if (taskUpdated) {
      setTasksBoardData((prevTasksBoardData) => {
        if (!prevTasksBoardData) return prevTasksBoardData;

        const updatedTasksBoardData = prevTasksBoardData.map((board) => {
          return {
            ...board,
            tasks: board.tasks.map((task) =>
              task.id === taskUpdated.id ? { ...task, ...taskUpdated } : task
            ),
          };
        });

        return updatedTasksBoardData;
      });
    }
  }, [taskUpdated]);
  useEffect(() => {
    if (statusCreated) {
      setTasksBoardData((prevTasksBoardData) => {
        if (!prevTasksBoardData) return [{ ...statusCreated, tasks: [] }];
        return [...prevTasksBoardData, { ...statusCreated, tasks: [] }];
      });
    }
  }, [statusCreated]);
  useEffect(() => {
    if (statusUpdated) {
      setTasksBoardData((prevTasksBoardData) => {
        if (!prevTasksBoardData) return prevTasksBoardData;
        return prevTasksBoardData.map((status) =>
          status.id === statusUpdated.id ? { ...status, ...statusUpdated } : status
        );
      });
    }
  }, [statusUpdated]);
  useEffect(() => {
    if (statusDeletedId) {
      setTasksBoardData((prevTasksBoardData) => {
        if (!prevTasksBoardData) return prevTasksBoardData;
        return prevTasksBoardData.filter((status) => status.id !== statusDeletedId);
      });
    }
  }, [statusDeletedId]);

  return <>
    <div className="container-fluid">
      <div className="row board-wrapper">
        <div className="col-12">
          <h3 className="m-unset lh-50 float-left"><FontAwesomeIcon icon={faCheckSquare} className="text-success" /> {project.name}</h3>
          <Button color="primary" className="float-right mt-2" style={{ marginLeft: 7 }} onClick={() => setOpenCreate (true)}>
            <FontAwesomeIcon icon={faPlus} /> {t('tasks.btn_create_task')}
          </Button>
          {
            (!project.is_public && membersProject && membersProject.length > 0) &&
            <UserGroup className="float-right mt-2">
              {
                membersProject.map((member, index) => (
                  <UserAvatar name={member.first_name} avatar={member.avatar} key={index} />
                ))
              }
            </UserGroup>
          }
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-2 d-block d-lg-none">
          <TaskInputSearch keyword={keyword} handleChange={handleChange} />
        </div>
        <div className="col-6 col-lg-6">
          <ul className="board-menu">
            <li className={`board-menu-item ${layout === 1 ? 'active' : ''}`} onClick={() => setLayout (1)}>
              <FontAwesomeIcon icon={faGrip} style={{ marginRight: 5 }} /> {t('tasks.board')}
            </li>
            <li className={`board-menu-item ${layout === 2 ? 'active' : ''}`} onClick={() => setLayout (2)}>
              <FontAwesomeIcon icon={faList} style={{ marginRight: 5 }} /> {t('tasks.list')}
            </li>
          </ul>
        </div>
        <div className="col-6 col-lg-6">
          <Button color="default" className="float-right mt-1">
            <FontAwesomeIcon icon={faFilter} /> {t('tasks.filter_label')}
          </Button>
          <TaskSort className="float-right" />
          <FontAwesomeIcon icon={faSearch} className="float-right d-block d-lg-none" style={{ marginTop: 15, marginRight: 7 }} />
          <TaskInputSearch keyword={keyword} handleChange={handleChange} className="d-none d-lg-block float-right mt-2" />
        </div>
      </div>
      {
        layout === 1 && 
        <TaskBoard 
          tasksBoardData={tasksBoardData} 
          workspaceId={project.workspace_id} 
          projectId={project.id} 
          setTaskSelected={setTaskSelected}
          setCreateWithStatus={setCreateWithStatus}
        />
      }
      {
        layout === 2 && 
        <TaskList 
          taskList={taskList} 
          pageSizeList={pageSizeList}
          loadingLoadMoreList={loadingLoadMoreList}
          setPageSizeList={setPageSizeList}
          setLoadingLoadMoreList={setLoadingLoadMoreList}
        />
      }
      <TaskCreate 
        open={openCreate}
        createWithStatus={createWithStatus} 
        setOpen={setOpenCreate} 
        setCreateWithStatus={setCreateWithStatus}
        project={project} 
      />
      <TaskEdit
        project={project}
        task={taskSelected}
        setOpenModal={setTaskSelected}
      />
    </div>
  </>
}
export default ProjectBoardView;