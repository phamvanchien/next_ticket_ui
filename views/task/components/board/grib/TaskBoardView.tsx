import React, { useState, useRef, useEffect } from "react";
import { ResponseTaskBoardDataType, TaskPriorityType, TaskType, TaskTypeItem } from "@/types/task.type";
import { ProjectTagType, ProjectType } from "@/types/project.type";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxs/store.redux";
import { tasksBoard } from "@/api/task.api";
import { API_CODE } from "@/enums/api.enum";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import { catchError } from "@/services/base.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { colorRange, dateToStamptimeString } from "@/utils/helper.util";
import TaskBoardLoading from "./TaskBoardLoading";
import TaskStatusWrap from "../TaskStatusWrap";
import TaskItem from "./TaskItem";
import { ResponseUserDataType } from "@/types/user.type";
import { maxTaskShowFilter } from "@/views/task/TaskPageView";
import { useTranslations } from "next-intl";

interface TaskBoardViewProps {
  taskData?: TaskType
  project: ProjectType
  keyword: string
  totalTask?: number,
  setOpenCreate: (openCreate: boolean) => void
  setInputStatusCreate: (inputStatusCreate?: ProjectTagType) => void,
  setTotalTask: (totalTask: number) => void,
  assignee: ResponseUserDataType[]
  creator: ResponseUserDataType[]
  priority: TaskPriorityType[]
  tags: ProjectTagType[]
  type: TaskTypeItem[]
  prioritySort?: "DESC" | "ASC"
  dueSort?: "DESC" | "ASC"
  dueDateFilter?: Date[]
  createdDateFilter?: Date[]
}

const TaskBoardView: React.FC<TaskBoardViewProps> = ({ 
  project, 
  taskData, 
  keyword,
  assignee,
  creator,
  priority,
  tags,
  type,
  totalTask,
  prioritySort,
  dueSort,
  dueDateFilter,
  createdDateFilter,
  setTotalTask,
  setOpenCreate, 
  setInputStatusCreate 
}) => {
  const [tasks, setTasks] = useState<ResponseTaskBoardDataType[]>([]);
  const [draggingTask, setDraggingTask] = useState<number>();
  const [dragOverStatus, setDragOverStatus] = useState<number>();
  const [error, setError] = useState<AppErrorType | null>(null);
  const [loading, setLoading] = useState(true);

  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const scrollStartX = useRef(0);
  const scrollLeft = useRef(0);

  const t = useTranslations();

  const handleOpenCreate = (status: ProjectTagType) => {
    setInputStatusCreate(status);
    setOpenCreate(true);
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const wrapper = wrapperRef.current;
    if (wrapper) {
      isScrolling.current = true;
      scrollStartX.current = e.pageX - wrapper.offsetLeft;
      scrollLeft.current = wrapper.scrollLeft;
      wrapper.classList.add("scrolling");
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isScrolling.current) return;
    e.preventDefault();
    const wrapper = wrapperRef.current;
    if (wrapper) {
      const x = e.pageX - wrapper.offsetLeft;
      const walk = (x - scrollStartX.current) * 1.5;
      wrapper.scrollLeft = scrollLeft.current - walk;
    }
  };

  const handleMouseUp = () => {
    isScrolling.current = false;
    const wrapper = wrapperRef.current;
    if (wrapper) {
      wrapper.classList.remove("scrolling");
    }
  };
  
  useEffect(() => {
    const loadTaskBoard = async () => {
      try {
        if (!workspace) {
          return;
        }

        const response = await tasksBoard(workspace.id, project.id, {
          keyword: keyword,
          assignee: assignee.map(a => a.id).join(','),
          tags: tags.map(t => t.id).join(','),
          priority: priority.map(p => p.id).join(','),
          creator: creator.map(c => c.id).join(','),
          type: type.map(t => t.id).join(','),
          sortCreatedAt: (prioritySort || dueSort) ? undefined : 'ASC',
          sortPriority: prioritySort,
          sortDue: dueSort,
          fromDue: (dueDateFilter && dueDateFilter.length > 1) ? dateToStamptimeString(dueDateFilter[1]) + ' 00:00:00' : undefined,
          toDue: (dueDateFilter && dueDateFilter.length > 1) ? dateToStamptimeString(dueDateFilter[0]) + ' 23:59:59' : undefined,
          fromCreated: (createdDateFilter && createdDateFilter.length > 1) ? dateToStamptimeString(createdDateFilter[1]) + ' 00:00:00' : undefined,
          toCreated: (createdDateFilter && createdDateFilter.length > 1) ? dateToStamptimeString(createdDateFilter[0]) + ' 23:59:59' : undefined,
        });
        if (response && response.code === API_CODE.OK) {
          setTasks(response.data);
          if (loading) {
            const responseTasksTotal = response.data.reduce((total, status) => total + status.tasks.length, 0);
            setTotalTask(responseTasksTotal);
          }
          setLoading(false);
          return;
        }
        setLoading(false);
        setError(catchError(response));
      } catch (error) {
        setLoading(false);
        setError(catchError(error as BaseResponseType));
      }
    }
    loadTaskBoard();
  }, [workspace, keyword, assignee, tags, priority, creator, type, prioritySort, dueSort, dueDateFilter, createdDateFilter]);
  
  useEffect(() => {
    if (taskData) {
      const checkTaskBoard = tasks.find(t => t.id === taskData.status.id);
      if (checkTaskBoard) {
        setTasks((prevTasks) => {
          const updatedTasks = prevTasks.map((taskBoard) => {
            if (taskBoard.id === taskData.status.id) {
              return {
                ...taskBoard,
                tasks: [...taskBoard.tasks, taskData],
              };
            }
            return taskBoard;
          });
    
          return updatedTasks;
        });
        return;
      }
      setTasks([...tasks, {
        ...taskData.status,
        tasks: [taskData]
      }]);
    }
  }, [taskData, taskData?.id]);

  if (error) {
    return (
      <div className="row mt-2">
        <div className="col-12">
          <h6 className="text-center text-muted">{error.message}</h6>
        </div>
      </div>
    )
  }

  if (loading) {
    return <TaskBoardLoading />
  }

  if (tasks.length === 0) {
    return (
      <div className="row mt-4">
        <div className="col-12">
          <h6 className="text-center text-muted">{t('tasks.task_empty_message')}</h6>
        </div>
      </div>
    )
  }
  return (
    <div className="row">
      <div className="col-12">
        <div
          className="wrapper-board pl-unset pr-unset"
          ref={wrapperRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {tasks.map(status => (
            <TaskStatusWrap
              status={status}
              key={status.id}
              setDragOverStatus={setDragOverStatus}
              setDraggingTask={setDraggingTask}
              dragOverStatus={dragOverStatus}
              setTasks={setTasks}
              projectId={project.id}
              projectUserId={project.user_id}
            >
              {
                status.tasks.map(task => (
                  <TaskItem 
                    key={task.id}
                    task={task}
                    statusKey={status.id}
                    setDraggingTask={setDraggingTask}
                    setDragOverStatus={setDragOverStatus}
                    draggingTask={draggingTask}
                    project={project}
                  />
                ))
              }
              <div 
                className="card" 
                style={{ cursor: 'pointer', background: colorRange().find(c => (c.code === status.color && c.level === 200))?.code }}
                onClick={() => handleOpenCreate (status)}
              >
                <div className="card-body create-task-status" style={{ padding: 15 }}>
                  {t('tasks.btn_create_task')} <FontAwesomeIcon icon={faPlus} />
                </div>
              </div>
            </TaskStatusWrap>
          ))}
        </div>
      </div>
    </div>
  )
}
export default TaskBoardView;