"use client"
import Button from "@/common/components/Button";
import { ProjectType } from "@/types/project.type";
import { faCheck, faCheckCircle, faCheckSquare, faCopy, faFilter, faFilterCircleXmark, faGear, faGrip, faLineChart, faList, faPlus, faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import TaskInputSearch from "./components/TaskInputSearch";
import TaskBoard from "./components/TaskBoard";
import { tasks, tasksBoard } from "@/api/task.api";
import { displayMessage, displaySmallMessage } from "@/utils/helper.util";
import { BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
import { API_CODE } from "@/enums/api.enum";
import { ResponseTaskBoardDataType, TaskType } from "@/types/task.type";
import useDelaySearch from "@/hooks/useDelaySearch";
import TaskCreate from "./components/TaskCreate";
import TaskEdit from "./components/TaskEdit";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/reduxs/store.redux";
import { members } from "@/api/workspace.api";
import { setIsMemberProject, setIsOwnerProject, setKeywordSearchMembers, setMembersProject } from "@/reduxs/project.redux";
import { cloneProject, membersList } from "@/api/project.api";
import TaskList from "./components/TaskList";
import TaskBoardFilter from "./components/filter/TaskBoardFilter";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProjectBoardChart from "./components/ProjectBoardChart";
import { setSidebarSelected } from "@/reduxs/menu.redux";
import Modal from "@/common/components/Modal";
import Loading from "@/common/components/Loading";
import Input from "@/common/components/Input";
import ProjectSetting from "./components/setting/ProjectSetting";
import { setTaskFilter } from "@/reduxs/task.redux";
import { useSocket } from "@/hooks/useSocket";

interface ProjectBoardViewProps {
  project: ProjectType
}
export const defaultSizeList = 20;
const ProjectBoardView: React.FC<ProjectBoardViewProps> = ({ project }) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const taskParam = searchParams.get('task');
  const pathname = usePathname();
  const router = useRouter();
  const [tasksBoardData, setTasksBoardData] = useState<ResponseTaskBoardDataType[]>();
  const [openCreate, setOpenCreate] = useState(false);
  const [taskSelected, setTaskSelected] = useState<TaskType>();
  const [createWithStatus, setCreateWithStatus] = useState<number>();
  const [layout, setLayout] = useState(1);
  const [taskList, setTaskList] = useState<ResponseWithPaginationType<TaskType[]>>();
  const [projectData, setProjectData] = useState(project);
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const statusCreated = useSelector((state: RootState) => state.projectSlide).statusCreated;
  const statusUpdated = useSelector((state: RootState) => state.projectSlide).statusUpdated;
  const statusDeletedId = useSelector((state: RootState) => state.projectSlide).statusDeletedId;
  const keywordSearchMember = useSelector((state: RootState) => state.projectSlide).keywordSearchMember;
  const projectUpdated = useSelector((state: RootState) => state.projectSlide).projectUpdated;
  const membersProject = useSelector((state: RootState) => state.projectSlide).membersProject;
  const taskCreated = useSelector((state: RootState) => state.taskSlide).taskCreated;
  const taskUpdated = useSelector((state: RootState) => state.taskSlide).taskUpdated;
  const taskDeleted = useSelector((state: RootState) => state.taskSlide).taskDeleted;
  const taskFilter = useSelector((state: RootState) => state.taskSlide).taskFilter;
  const subTaskDone = useSelector((state: RootState) => state.taskSlide).subTaskDone;
  const subTaskUnDo = useSelector((state: RootState) => state.taskSlide).subTaskUnDo;
  const subTaskDeleted = useSelector((state: RootState) => state.taskSlide).subTaskDeleted;
  const subTaskCreated = useSelector((state: RootState) => state.taskSlide).subTaskCreated;
  const isMember = useSelector((state: RootState) => state.projectSlide).isMember;
  const isOwner = useSelector((state: RootState) => state.projectSlide).isOwner;

  const [pageSizeList, setPageSizeList] = useState(defaultSizeList);
  const [loadingLoadMoreList, setLoadingLoadMoreList] = useState(false);
  const [loadingTaskBoard, setLoadingTaskBoard] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [sortTitle, setSortTitle] = useState<"DESC" | "ASC">();
  const [sortCreatedAt, setSortCreatedAt] = useState<"DESC" | "ASC">();
  const [sortDue, setSortDue] = useState<"DESC" | "ASC">();
  const [openBoardchart, setOpenBoardChart] = useState(false);
  const [openClone, setOpenClone] = useState(false);
  const [cloneLoading, setCloneLoading] = useState(false);
  const [projectCloneName, setProjectCloneName] = useState(project.name + ' Copy');
  const [openCloneSuccess, setOpenCloneSuccess] = useState(false);
  const [projectIdCloned, setProjectIdCloned] = useState();
  const [projectCloneSetting, setProjectCloneSetting] = useState({
    include_attribute: true,
    include_member: false
  });
  const [openSetting, setOpenSetting] = useState(false);
  const socket = useSocket();

  const { value: keyword, debouncedValue, handleChange } = useDelaySearch("", 500);
  const handleCloneProject = async () => {
    try {
      if (!projectCloneName || projectCloneName === '') {
        return;
      }
      setCloneLoading(true);
      const response = await cloneProject(project.workspace_id, project.id, {
        project_name_clone: projectCloneName,
        ...projectCloneSetting
      });
      setCloneLoading(false);
      if (response && response.code === API_CODE.CREATED) {
        setOpenClone(false);
        setProjectCloneName(project.name + ' Copy');
        setOpenCloneSuccess(true);
        setProjectIdCloned(response.data);
        return;
      }
      displayMessage('error', response.error?.message);
    } catch (error) {
      setCloneLoading(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  }
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
        size: pageSizeList,
        sortTitle: sortTitle,
        sortCreatedAt: sortCreatedAt,
        sortDue: sortDue,
        ...taskFilter
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
    dispatch(setSidebarSelected('project'));
    dispatch(setIsOwnerProject(project.is_owner));
    dispatch(
      setIsMemberProject(
        ((userLogged && project.members.find(m => m.id === userLogged.id) || project.is_owner)) ? true : false
      )
    );
  }, [project]);
  useEffect(() => {
    if (keywordSearchMember) {
      dispatch(setKeywordSearchMembers(''));
    }
    if (Object.keys(taskFilter).length > 0) {
      dispatch(setTaskFilter({}));
    }
  }, [project]);
  useEffect(() => {
    if (keywordSearchMember) {
      dispatch(setKeywordSearchMembers(''));
    }
    if (taskSelected) {
      const storageKey = "recent_tasks";
      let storedTasks: { id: number, date: string }[] = [];
    
      try {
        const stored = localStorage.getItem(storageKey);
        storedTasks = stored ? JSON.parse(stored) : [];
      } catch (err) {
        console.error("Failed to read localStorage", err);
      }
    
      storedTasks = storedTasks.filter(task => task.id !== taskSelected.id);
    
      storedTasks.unshift({
        id: taskSelected.id,
        date: new Date().toISOString()
      });
    
      if (storedTasks.length > 10) {
        storedTasks.pop();
      }
    
      localStorage.setItem(storageKey, JSON.stringify(storedTasks));
    }        
  }, [openCreate, taskSelected]);
  useEffect(() => {
    loadMembersBoard();
  }, [project, keywordSearchMember]);
  useEffect(() => {
    loadTasksBoard();
    loadTaskList();
  }, [debouncedValue, taskFilter]);
  useEffect(() => {
    loadTaskList();
  }, [project, debouncedValue, pageSizeList, sortTitle, sortCreatedAt, sortDue]);
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
    if (taskDeleted) {
      setTasksBoardData((prevTasksBoardData) => {
        if (!prevTasksBoardData) return prevTasksBoardData;
  
        const updatedTasksBoardData = prevTasksBoardData.map((board) => ({
          ...board,
          tasks: board.tasks.filter((task) => task.id !== taskDeleted.id),
        }));
  
        return updatedTasksBoardData;
      });
      loadTaskList();
    }
  }, [taskDeleted]);
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
  useEffect(() => {
    if (taskParam && tasksBoardData) {
      for (let i = 0; i < tasksBoardData.length; i++) {
        const boardItem = tasksBoardData[i];
        const taskFind = boardItem.tasks.find(t => t.id === Number(taskParam));
        if (taskFind) {
          setTaskSelected(taskFind);
          const params = new URLSearchParams(searchParams.toString());
          params.delete("task");
          const newUrl = `${pathname}${params.toString() ? "?" + params.toString() : ""}`;
          window.history.replaceState(null, "", newUrl);
          break;
        }
      }
    }
  }, [taskParam, tasksBoardData]);
  useEffect(() => {
    if (projectUpdated) {
      if (projectUpdated.is_public !== projectData.is_public) {
        loadMembersBoard();
      }
      setProjectData(projectUpdated);
    }
  }, [projectUpdated]);
  useEffect(() => {
    if (socket) {
      socket.emit('join_project_room', project.id.toString());
      socket.on('new_task_event', (event: TaskType) => {
        if (event.user.id !== userLogged?.id) {
          setTasksBoardData((prevTasksBoardData) => {
            if (!prevTasksBoardData) return prevTasksBoardData;
      
            const updatedTasksBoardData = prevTasksBoardData.map((board) => {
              if (board.id === event.status.id) {
                return {
                  ...board,
                  tasks: [...board.tasks, event],
                };
              }
              return board;
            });
      
            return updatedTasksBoardData;
          });
          loadTaskList();
        }
      });
      socket.on('update_task_event', (event: TaskType) => {
        setTasksBoardData((prevTasksBoardData) => {
          if (!prevTasksBoardData) return prevTasksBoardData;
  
          const updatedTasksBoardData = prevTasksBoardData.map((board) => {
            if (board.id === event.status.id) {
              const taskExists = board.tasks.some((task) => task.id === event.id);
        
              return {
                ...board,
                tasks: taskExists
                  ? 
                    board.tasks.map((task) =>
                      task.id === event.id ? { ...task, ...event } : task
                    )
                  : 
                    [...board.tasks, event],
              };
            }
            return {
              ...board,
              tasks: board.tasks.map((task) => {
                if (task.id === event.id) {
                  if (task.status.id !== event.status.id) {
                    return null;
                  } else {
                    return { ...task, ...event };
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
              task.id === event.id ? { ...task, ...event } : task
            ),
          };
        });
      });
    }
  
    return () => {
      if (socket) {
        socket.off('join_project_room');
      }
    };
  }, [socket]);
  return <>
    <div className="container-fluid">
      <div className="row board-wrapper">
        <div className="col-12">
          <h3 className="m-unset lh-50 float-left"><FontAwesomeIcon icon={faCheckSquare} className="text-success" /> {projectData.name}</h3>
          {
            isOwner && <>
            <Button color="default" className="float-right mt-2 text-secondary" onClick={() => setOpenSetting (true)}>
              <FontAwesomeIcon
                icon={faGear}
                style={{ pointerEvents: "none" }}
              />
            </Button>
            <Button color="default" className="float-right mt-2 text-secondary" onClick={() => setOpenClone (true)}>
              <FontAwesomeIcon
                icon={faCopy}
                style={{ pointerEvents: "none" }}
              />
            </Button>
            </>
          }
          {
            isMember &&
            <Button color="primary" className="float-right mt-2" style={{ marginLeft: 7 }} onClick={() => setOpenCreate (true)}>
              <FontAwesomeIcon icon={faPlus} /> {t('tasks_page.btn_create_task')}
            </Button>
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
              <FontAwesomeIcon icon={faGrip} style={{ marginRight: 5 }} /> {t('tasks_page.board')}
            </li>
            <li className={`board-menu-item ${layout === 2 ? 'active' : ''}`} onClick={() => setLayout (2)}>
              <FontAwesomeIcon icon={faList} style={{ marginRight: 5 }} /> {t('tasks_page.list')}
            </li>
          </ul>
        </div>
        <div className="col-6 col-lg-6 mt-2">
          <Button color="default" className="float-right mt-2" onClick={() => setOpenFilter (true)}>
            <FontAwesomeIcon 
              icon={
                (
                  (taskFilter.assignee && taskFilter.assignee.length > 0) 
                  || (taskFilter.creator && taskFilter.creator.length > 0)
                  || taskFilter.fromDue || taskFilter.toDue || taskFilter.fromCreated || taskFilter.toCreated || 
                  (taskFilter.status && taskFilter.status.length > 0) 
                  || (taskFilter.attributes && Object.values(taskFilter.attributes).flat().join(',').length > 0)) ? faFilterCircleXmark :
                faFilter
              } /> {t('tasks_page.filter_label')}
          </Button>
          {
            isMember &&
            <Button color="default" className="float-right mt-2" onClick={() => setOpenBoardChart (true)}>
              <FontAwesomeIcon icon={faLineChart} /> {t('tasks_page.report.report_label')}
            </Button>
          }
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
          taskSelected={taskSelected}
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
          sortTitle={sortTitle}
          sortCreatedAt={sortCreatedAt}
          sortDue={sortDue}
          setSortCreatedAt={setSortCreatedAt}
          setPageSizeList={setPageSizeList}
          setLoadingLoadMoreList={setLoadingLoadMoreList}
          setSortTitle={setSortTitle}
          setSortDue={setSortDue}
          setTaskSelected={setTaskSelected}
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
      <ProjectBoardChart
        project={project}
        open={openBoardchart}
        setOpen={setOpenBoardChart}
      />
      <Modal
        open={openClone}
        setOpen={setOpenClone}
        title={t('projects_page.clone_project_title')}
        footerBtn={[
          <Button color="default" key="cancel"className="mr-2" onClick={() => setOpenClone (false)} disabled={cloneLoading}>
            {t("common.btn_cancel")}
          </Button>,
          <Button color={cloneLoading ? 'secondary' : 'primary'} key="save" type="submit" onClick={handleCloneProject} disabled={cloneLoading || !projectCloneName || projectCloneName === ''}>
            {cloneLoading ? <Loading color="light" /> : t("tasks_page.clone")}
          </Button>
        ]}
      >
        <div className="row">
          <div className="col-12">
            <Input 
              type="text" 
              value={projectCloneName} 
              placeholder={t('projects_page.create.placeholder_input_project_name')} 
              onChange={(e) => setProjectCloneName (e.target.value)}
            />
          </div>
          <div className="col-12 text-secondary mt-2">
            <span 
              className={`pointer ${projectCloneSetting.include_attribute ? 'text-success' : 'text-secondary'}`} 
              onClick={() => setProjectCloneSetting ({include_member: projectCloneSetting.include_member, include_attribute: projectCloneSetting.include_attribute ? false : true})}
            >
              <FontAwesomeIcon icon={projectCloneSetting.include_attribute ? faCheckSquare : faSquare} /> {t('projects_page.setting.clone_with_attribute')}
            </span><br/>
            <span 
              className={`pointer mt-2 ${projectCloneSetting.include_member ? 'text-success' : 'text-secondary'}`}
              onClick={() => setProjectCloneSetting ({include_member: projectCloneSetting.include_member ? false : true, include_attribute: projectCloneSetting.include_attribute})}
            >
              <FontAwesomeIcon icon={projectCloneSetting.include_member ? faCheckSquare : faSquare} /> {t('projects_page.setting.clone_with_member')}
            </span>
          </div>
        </div>
      </Modal>
      <Modal
        open={openCloneSuccess}
        setOpen={setOpenCloneSuccess}
        title=""
        footerBtn={[]}
        width={300}
        closable={false}
      >
        <div className="row">
          <div className="col-12 text-center">
            <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: 50 }} className="text-success" />
          </div>
          <div className="col-12 text-center mb-4 text-success">
            {t('projects_page.create.success_message')}
          </div>
          <div className="col-12">
            <Button color="primary" className="w-100" onClick={() => router.push(`/workspace/${project.workspace_id}/project/${projectIdCloned}`)}>
              {t('projects_page.setting.view_project_btn')}
            </Button>
            <Button color="light" className="w-100 mt-2" onClick={() => setOpenCloneSuccess (false)}>{t('common.btn_cancel')}</Button>
          </div>
        </div>
      </Modal>
      <ProjectSetting
        project={project}
        open={openSetting}
        setOpen={setOpenSetting}
      />
    </div>
  </>
}
export default ProjectBoardView;