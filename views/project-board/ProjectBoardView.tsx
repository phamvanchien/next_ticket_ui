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
import { setIsOwnerProject, setKeywordSearchMembers, setMembersProject } from "@/reduxs/project.redux";
import { membersList } from "@/api/project.api";
import TaskList from "./components/TaskList";
import TaskBoardFilter from "./components/filter/TaskBoardFilter";

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
  const taskFilter = useSelector((state: RootState) => state.taskSlide).taskFilter;
  const subTaskDone = useSelector((state: RootState) => state.taskSlide).subTaskDone;
  const subTaskUnDo = useSelector((state: RootState) => state.taskSlide).subTaskUnDo;
  const subTaskDeleted = useSelector((state: RootState) => state.taskSlide).subTaskDeleted;
  const subTaskCreated = useSelector((state: RootState) => state.taskSlide).subTaskCreated;

  const [pageSizeList, setPageSizeList] = useState(defaultSizeList);
  const [loadingLoadMoreList, setLoadingLoadMoreList] = useState(false);
  const [loadingTaskBoard, setLoadingTaskBoard] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const { value: keyword, debouncedValue, handleChange } = useDelaySearch("", 500);
  const loadTasksBoard = async () => {
    try {
      setLoadingTaskBoard(true);
      const response = await tasksBoard(project.workspace_id, project.id, {
        keyword: debouncedValue,
        ...taskFilter
      });
      setLoadingTaskBoard(false);
      if (response && response.code === API_CODE.OK) {
        setTasksBoardData(response.data);
        return;
      }
      displaySmallMessage('error', response.error?.message);
    } catch (error) {
      setLoadingTaskBoard(false);
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
    dispatch(setIsOwnerProject(project.is_owner));
  }, [project]);
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
  }, [project, debouncedValue, taskFilter]);
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
      loadTaskList();
    }
  }, [taskCreated]);
  useEffect(() => {
    if (taskUpdated) {
      setTasksBoardData((prevTasksBoardData) => {
      if (!prevTasksBoardData) return prevTasksBoardData;

      const updatedTasksBoardData = prevTasksBoardData.map((board) => {
        if (board.id === taskUpdated.status.id) {
          const taskExists = board.tasks.some((task) => task.id === taskUpdated.id);
    
          return {
            ...board,
            tasks: taskExists
              ? 
                board.tasks.map((task) =>
                  task.id === taskUpdated.id ? { ...task, ...taskUpdated } : task
                )
              : 
                [...board.tasks, taskUpdated],
          };
        }
        return {
          ...board,
          tasks: board.tasks.map((task) => {
            if (task.id === taskUpdated.id) {
              if (task.status.id !== taskUpdated.status.id) {
                return null;
              } else {
                return { ...task, ...taskUpdated };
              }
            }
            return task;
          }).filter(task => task !== null),
        };
      });

      return updatedTasksBoardData;
    });

    setTaskList((prevTasksListData) => {
      if (!prevTasksListData) return prevTasksListData;
    
      return {
        ...prevTasksListData,
        items: prevTasksListData.items.map((task) =>
          task.id === taskUpdated.id ? { ...task, ...taskUpdated } : task
        ),
      };
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
  useEffect(() => {
    if (subTaskDone && tasksBoardData) {
      setTasksBoardData((prevTasksBoardData) => {
        if (!prevTasksBoardData) return prevTasksBoardData;
  
        const updatedTasksBoardData = prevTasksBoardData.map((board) => {
          const updatedTasks = board.tasks.map((task) => {
            if (task.id === subTaskDone.taskId) {
              return {
                ...task,
                sub_tasks: {
                  ...task.sub_tasks,
                  totalDone: (task.sub_tasks?.totalDone || 0) + 1,
                },
              };
            }
            return task;
          });
  
          return {
            ...board,
            tasks: updatedTasks,
          };
        });
  
        return updatedTasksBoardData;
      });
  
      setTaskList((prevTaskList) => {
        if (!prevTaskList) return prevTaskList;
  
        const updatedItems = prevTaskList.items.map((task) => {
          if (task.id === subTaskDone.taskId) {
            return {
              ...task,
              sub_tasks: {
                ...task.sub_tasks,
                totalDone: (task.sub_tasks?.totalDone || 0) + 1,
              },
            };
          }
          return task;
        });
  
        return {
          ...prevTaskList,
          items: updatedItems,
        };
      });
    }
  }, [subTaskDone]);  
  useEffect(() => {
    if (subTaskUnDo && tasksBoardData) {
      setTasksBoardData((prevTasksBoardData) => {
        if (!prevTasksBoardData) return prevTasksBoardData;
  
        const updatedTasksBoardData = prevTasksBoardData.map((board) => {
          const updatedTasks = board.tasks.map((task) => {
            if (task.id === subTaskUnDo.taskId) {
              return {
                ...task,
                sub_tasks: {
                  ...task.sub_tasks,
                  totalDone: (task.sub_tasks?.totalDone || 0) - 1,
                },
              };
            }
            return task;
          });
  
          return {
            ...board,
            tasks: updatedTasks,
          };
        });
  
        return updatedTasksBoardData;
      });
  
      setTaskList((prevTaskList) => {
        if (!prevTaskList) return prevTaskList;
  
        const updatedItems = prevTaskList.items.map((task) => {
          if (task.id === subTaskUnDo.taskId) {
            return {
              ...task,
              sub_tasks: {
                ...task.sub_tasks,
                totalDone: (task.sub_tasks?.totalDone || 0) - 1,
              },
            };
          }
          return task;
        });
  
        return {
          ...prevTaskList,
          items: updatedItems,
        };
      });
    }
  }, [subTaskUnDo]);
  useEffect(() => {
    if (subTaskDeleted && tasksBoardData) {
      setTasksBoardData((prevTasksBoardData) => {
        if (!prevTasksBoardData) return prevTasksBoardData;
  
        const updatedTasksBoardData = prevTasksBoardData.map((board) => {
          const updatedTasks = board.tasks.map((task) => {
            if (task.id === subTaskDeleted.taskId) {
              return {
                ...task,
                sub_tasks: {
                  ...task.sub_tasks,
                  total: (task.sub_tasks?.total || 0) - 1,
                },
              };
            }
            return task;
          });
  
          return {
            ...board,
            tasks: updatedTasks,
          };
        });
  
        return updatedTasksBoardData;
      });
  
      setTaskList((prevTaskList) => {
        if (!prevTaskList) return prevTaskList;
  
        const updatedItems = prevTaskList.items.map((task) => {
          if (task.id === subTaskDeleted.taskId) {
            return {
              ...task,
              sub_tasks: {
                ...task.sub_tasks,
                total: (task.sub_tasks?.total || 0) - 1,
              },
            };
          }
          return task;
        });
  
        return {
          ...prevTaskList,
          items: updatedItems,
        };
      });
    }
  }, [subTaskDeleted]);
  useEffect(() => {
    if (subTaskCreated && tasksBoardData) {
      setTasksBoardData((prevTasksBoardData) => {
        if (!prevTasksBoardData) return prevTasksBoardData;
  
        const updatedTasksBoardData = prevTasksBoardData.map((board) => {
          const updatedTasks = board.tasks.map((task) => {
            if (task.id === subTaskCreated.taskId) {
              return {
                ...task,
                sub_tasks: {
                  ...task.sub_tasks,
                  total: (task.sub_tasks?.total || 0) + 1,
                },
              };
            }
            return task;
          });
  
          return {
            ...board,
            tasks: updatedTasks,
          };
        });
  
        return updatedTasksBoardData;
      });
  
      setTaskList((prevTaskList) => {
        if (!prevTaskList) return prevTaskList;
  
        const updatedItems = prevTaskList.items.map((task) => {
          if (task.id === subTaskCreated.taskId) {
            return {
              ...task,
              sub_tasks: {
                ...task.sub_tasks,
                total: (task.sub_tasks?.total || 0) + 1,
              },
            };
          }
          return task;
        });
  
        return {
          ...prevTaskList,
          items: updatedItems,
        };
      });
    }
  }, [subTaskCreated]);  
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
        <div className="col-6 col-lg-6 mt-2">
          <ul className="board-menu">
            <li className={`board-menu-item ${layout === 1 ? 'active' : ''}`} onClick={() => setLayout (1)}>
              <FontAwesomeIcon icon={faGrip} style={{ marginRight: 5 }} /> {t('tasks.board')}
            </li>
            <li className={`board-menu-item ${layout === 2 ? 'active' : ''}`} onClick={() => setLayout (2)}>
              <FontAwesomeIcon icon={faList} style={{ marginRight: 5 }} /> {t('tasks.list')}
            </li>
          </ul>
        </div>
        <div className="col-6 col-lg-6 mt-2">
          <Button color="default" className="float-right mt-1" onClick={() => setOpenFilter (true)}>
            <FontAwesomeIcon icon={faFilter} /> {t('tasks.filter_label')}
          </Button>
          {/* <TaskSort className="float-right mt-1" /> */}
          <TaskInputSearch keyword={keyword} handleChange={handleChange} className="d-none d-lg-block float-right mt-2" />
        </div>
      </div>
      {
        layout === 1 && 
        <TaskBoard 
          loadingTaskBoard={loadingTaskBoard}
          projectStatus={project.status}
          tasksBoardData={tasksBoardData} 
          workspaceId={project.workspace_id} 
          projectId={project.id} 
          setTaskSelected={setTaskSelected}
          setCreateWithStatus={setCreateWithStatus}
          setTasksBoardData={setTasksBoardData}
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
      <TaskBoardFilter 
        open={openFilter} 
        project={project} 
        setOpen={setOpenFilter} 
        setLoadingTaskBoard={setLoadingTaskBoard} 
        loadingTaskBoard={loadingTaskBoard} 
      />
    </div>
  </>
}
export default ProjectBoardView;