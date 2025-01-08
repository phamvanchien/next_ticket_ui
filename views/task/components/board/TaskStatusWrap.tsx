import { updateStatus } from "@/api/project.api";
import { update } from "@/api/task.api";
import Input from "@/common/components/Input";
import { API_CODE } from "@/enums/api.enum";
import { APP_ERROR } from "@/enums/app.enum";
import { RootState } from "@/reduxs/store.redux";
import { catchError } from "@/services/base.service";
import { BaseResponseType } from "@/types/base.type";
import { ResponseTaskBoardDataType, TaskType } from "@/types/task.type";
import { notify } from "@/utils/helper.util";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface TaskStatusWrapProps {
  status: ResponseTaskBoardDataType;
  dragOverStatus: number | undefined;
  children: React.ReactNode;
  projectId: number
  projectUserId: number,
  setDragOverStatus: (dragOverStatus?: number) => void;
  setDraggingTask: (draggingTask?: number) => void;
  setTasks: React.Dispatch<React.SetStateAction<ResponseTaskBoardDataType[]>>;
}

const TaskStatusWrap: React.FC<TaskStatusWrapProps> = ({
  status,
  setDragOverStatus,
  setDraggingTask,
  setTasks,
  dragOverStatus,
  children,
  projectId,
  projectUserId
}) => {
  const inputStatusNameRef = useRef<HTMLInputElement>(null);
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const [statusName, setStatusName] = useState(status.name);
  const handleDragOver = (e: React.DragEvent, target: number) => {
    e.preventDefault();
    setDragOverStatus(target);
  };

  const handleDragLeave = () => {
    setDragOverStatus(undefined);
  };

  const updateStatusTask = async (statusId: number, taskId: number) => {
    try {
      if (!workspace) {
        return;
      }
      const response = await update(workspace.id, projectId, taskId, {
        status_id: statusId
      });
      if (!response || (response && response.code !== API_CODE.OK)) {
        notify(catchError(response)?.message ?? APP_ERROR.SERVER_MAINTAIN, 'error')
      }
    } catch (error) {
      notify(catchError(error as BaseResponseType)?.message ?? APP_ERROR.SERVER_MAINTAIN, 'error');
    }
  }

  const handleDrop = (e: React.DragEvent, target: number) => {
    const task = JSON.parse(e.dataTransfer.getData("task")) as TaskType;
    const sourceStatusId = parseInt(e.dataTransfer.getData("source"), 10);

    if (sourceStatusId !== target) {
      setTasks((prev) => {
        const updatedTasks = prev.map((boardStatus) => {
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
        });
        return updatedTasks;
      });
      updateStatusTask(target, task.id);
    }

    setDraggingTask(undefined);
    setDragOverStatus(undefined);
  };

  useEffect(() => {
    const handleClickOutside = async (event: MouseEvent) => {
      if (inputStatusNameRef.current && !inputStatusNameRef.current.contains(event.target as Node)) {
        if (inputStatusNameRef.current && inputStatusNameRef.current.value && inputStatusNameRef.current.value !== statusName) {
          try {
            if (!workspace || userLogged?.id !== projectUserId) {
              return;
            }

            const response = await updateStatus(workspace.id, projectId, status.id, {
              name: inputStatusNameRef.current.value,
              color: status.color
            });
            if (response && response.code === API_CODE.OK) {
              setStatusName(inputStatusNameRef.current.value);
              notify('Status is updated', 'success');
              return;
            }
            notify(response.error?.message ?? APP_ERROR.SERVER_MAINTAIN, 'error');
          } catch (error) {
            const errRes = error as BaseResponseType;
            notify(errRes.error?.message ?? APP_ERROR.SERVER_MAINTAIN, 'error');
          }
          return;
        }

        if (!inputStatusNameRef.current || !inputStatusNameRef.current.value || inputStatusNameRef.current.value === '') {
          const statusInput = document.getElementById(`statusName${status.id}`) as HTMLInputElement;
          if (statusInput) {
            statusInput.value = statusName;
          }
        }
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [statusName]);

  return (
    <div
      className={`card status-item ${dragOverStatus === status.id ? "drag-over" : ""}`}
      onDragOver={(e) => handleDragOver(e, status.id)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, status.id)}
      data-status={status.id}
    >
      <div className="card-header mb-2">
        <h6 className="card-title status-label" style={{ background: status.color }}>
          <FontAwesomeIcon icon={faCircle} style={{ fontSize: 12, color: '#3333' }} className="icon-circle" /> 
          <Input type="text" defaultValue={statusName} className="status-name" id={`statusName${status.id}`} ref={inputStatusNameRef} disabled={userLogged?.id !== projectUserId} />
        </h6>
      </div>
      <div className="card-body" style={{ padding: 0 }}>
        {children}
      </div>
    </div>
  );
};

export default TaskStatusWrap;