import { ResponseTaskBoardDataType, TaskType } from "@/types/task.type";
import { faGripVertical, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import TaskBoardItem from "./TaskBoardItem";
import { displayMessage } from "@/utils/helper.util";
import { BaseResponseType } from "@/types/base.type";
import { changePositionStatus } from "@/api/project.api";
import { API_CODE } from "@/enums/api.enum";
import { update } from "@/api/task.api";
import TaskBoardCreateStatus from "./TaskBoardCreateStatus";
import TaskBoardEditStatus from "./TaskBoardEditStatus";
import { useTranslations } from "next-intl";
import TaskBoardLoading from "./TaskBoardLoading";
import { ProjectStatusType } from "@/types/project.type";

interface TaskBoardProps {
  tasksBoardData?: ResponseTaskBoardDataType[];
  workspaceId: number;
  projectId: number;
  projectStatus: ProjectStatusType[]
  loadingTaskBoard: boolean
  setTaskSelected: (taskSelected?: TaskType) => void
  setCreateWithStatus: (createWithStatus: number) => void
}

const TaskBoard: React.FC<TaskBoardProps> = ({ 
  tasksBoardData, 
  workspaceId, 
  projectId, 
  projectStatus,
  loadingTaskBoard,
  setTaskSelected, 
  setCreateWithStatus 
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [boardData, setBoardData] = useState(tasksBoardData || []);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedId, setDraggedId] = useState<number>();
  const [draggingTask, setDraggingTask] = useState<number>();
  const [dragOverStatus, setDragOverStatus] = useState<number>();

  const t = useTranslations();

  let isDown = false;
  let startX: number;
  let scrollLeft: number;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapperRef.current) return;
    isDown = true;
    startX = e.pageX - wrapperRef.current.offsetLeft;
    scrollLeft = wrapperRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown = false;
  };

  const handleMouseUp = () => {
    isDown = false;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDown || !wrapperRef.current) return;
    e.preventDefault();
    const x = e.pageX - wrapperRef.current.offsetLeft;
    const walk = (x - startX) * 4;
    wrapperRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number, statusId: number) => {
    setDraggedIndex(index);
    setDraggedId(statusId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, target: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, index: number, statusId: number) => {
    e.preventDefault();

    const dragIndex = draggedIndex;
    if (dragIndex === null || dragIndex === index || !draggedId) return;

    const updatedItems = [...boardData];
    [updatedItems[dragIndex], updatedItems[index]] = [updatedItems[index], updatedItems[dragIndex]];

    setBoardData(updatedItems);

    try {
      const response = await changePositionStatus(workspaceId, projectId, draggedId, {
        statusTargetId: statusId
      });
      if (response && response.code === API_CODE.OK) {
        setDraggedIndex(null);
        setDraggedId(undefined);
        return;
      }
      displayMessage('error', response.error?.message);
    } catch (error) {
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  };

  const handleStatusItemDrop = (e: React.DragEvent, target: number) => {
    e.preventDefault();
  
    const taskData = e.dataTransfer.getData("task");
    const sourceData = e.dataTransfer.getData("source");
  
    if (!taskData || !sourceData) {
      return;
    }
  
    const task = JSON.parse(taskData) as TaskType;
    const sourceStatusId = parseInt(sourceData, 10);
  
    if (sourceStatusId !== target) {
      setBoardData((prev) =>
        prev.map((boardStatus) => {
          if (boardStatus.id === sourceStatusId) {
            return {
              ...boardStatus,
              tasks: boardStatus.tasks.filter((t) => t.id !== task.id),
            };
          }
          if (boardStatus.id === target) {
            return {
              ...boardStatus,
              tasks: [...boardStatus.tasks, task],
            };
          }
          return boardStatus;
        })
      );
      updateStatusTask(target, task.id);
    }
  
    setDraggingTask(undefined);
    setDragOverStatus(undefined);
  };
  
  const handleStatusItemDragOver = (e: React.DragEvent, target: number) => {
    e.preventDefault();
    setDragOverStatus(target);
  };

  const handleDragLeave = () => {
    setDragOverStatus(undefined);
  };

  const updateStatusTask = async (statusId: number, taskId: number) => {
    try {
      const response = await update(workspaceId, projectId, taskId, {
        status_id: statusId
      });
      if (!response || (response && response.code !== API_CODE.OK)) {
        displayMessage('error', response.error?.message);
      }
    } catch (error) {
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  }

  useEffect(() => {
    if (tasksBoardData) setBoardData(tasksBoardData);
  }, [tasksBoardData]);

  if (!tasksBoardData || loadingTaskBoard) {
    return (
      <TaskBoardLoading projectStatus={projectStatus} />
    );
  }

  return (
    <div className="row">
      <div
        className="col-12 status-wrapper"
        ref={wrapperRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {boardData.map((item, index) => (
          <div
            key={index}
            className={`card status-item ${dragOverStatus === item.id ? "drag-over" : ""}`}
            onDragOver={(e) => handleStatusItemDragOver(e, item.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleStatusItemDrop(e, item.id)}
            data-status={item.id}
          >
            <div
              className="card-header d-flex align-items-center justify-content-between"
              style={{ background: item.color ?? '#3333' }}
              draggable
              onDragStart={(e) => handleDragStart(e, index, item.id)}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDrop={(e) => handleDrop(e, index, item.id)}
            >
              <div className="d-flex align-items-center">
                <span className="mr-2 cursor-pointer" style={{ marginRight: 5 }}>
                  <FontAwesomeIcon
                    icon={faGripVertical}
                    style={{ pointerEvents: "none" }}
                  />
                </span>
                <h6 className="card-title m-unset">{item.name}</h6>
              </div>
              <TaskBoardEditStatus workspaceId={workspaceId} projectId={projectId} status={item} />
            </div>
            <div className="card-body status-item-body">
              {item.tasks.map(task => (
                <TaskBoardItem 
                  task={task} 
                  statusId={item.id} 
                  key={task.id} 
                  setDraggingTask={setDraggingTask} 
                  setDragOverStatus={setDragOverStatus}
                  setTaskSelected={setTaskSelected} 
                />
              ))}
            </div>
            <div className="card-footer">
              <a className="text-secondary pointer" onClick={() => setCreateWithStatus (item.id)}>
                <FontAwesomeIcon icon={faPlus} /> {t('tasks.btn_create_task')}
              </a>
            </div>
          </div>
        ))}
        <TaskBoardCreateStatus workspaceId={workspaceId} projectId={projectId} />
      </div>
    </div>
  );
};

export default TaskBoard;