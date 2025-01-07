import Button from "@/common/components/Button";
import { faClone, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { MouseEvent, useEffect, useRef, useState } from "react";
import SubTask from "./SubTask";
import { TaskType } from "@/types/task.type";
import Modal from "@/common/modal/Modal";
import ModalBody from "@/common/modal/ModalBody";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxs/store.redux";
import { create, removeTask } from "@/api/task.api";
import { API_CODE } from "@/enums/api.enum";
import { useRouter } from "next/navigation";
import { APP_LINK } from "@/enums/app.enum";
import { notify } from "@/utils/helper.util";
import { catchError } from "@/services/base.service";
import { BaseResponseType } from "@/types/base.type";
import Loading from "@/common/components/Loading";

interface TaskSettingProps {
  open: boolean
  task: TaskType
  setOpen: (open: boolean) => void
}

const TaskSetting: React.FC<TaskSettingProps> = ({ open, task, setOpen }) => {
  const taskDivRef = useRef<HTMLDivElement>(null);
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const router = useRouter();
  const [confirmClone, setConfirmClone] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClose = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setOpen(false);
  }
  const handleSubmitClone = async () => {
    try {
      if (!workspace) {
        return;
      }
      setLoading(true);
      const response = await create (workspace.id, task.project_id, {
        title: task.title + ' - Copy',
        priority: task.priority.id,
        status_id: task.status.id,
        type_id: task.type.id,
        description: task.description,
        due: new Date(task.due),
        tags: task.tags.map(t => t.id),
        assigns: task.assign.map(a => a.id)
      });
      setLoading(false);
      if (response && response.code === API_CODE.CREATED) {
        router.push(`${APP_LINK.WORKSPACE}/${workspace.id}/project/${task.project_id}/task/${response.data.id}`);
        return;
      }
      notify(catchError(response)?.message ?? '', 'error');
    } catch (error) {
      setLoading(false);
      notify(catchError(error as BaseResponseType)?.message ?? '', 'error');
    }
  }
  const handleRemoveTask = async () => {
    try {
      if (!workspace) {
        return;
      }
      const response = await removeTask (workspace.id, task.project_id, task.id);
      setLoading(true);
      if (response && response.code === API_CODE.OK) {
        router.push(`${APP_LINK.WORKSPACE}/${workspace.id}/project/${task.project_id}`);
        return;
      }
      notify(catchError(response)?.message ?? '', 'error');
    } catch (error) {
      setLoading(false);
      notify(catchError(error as BaseResponseType)?.message ?? '', 'error');
    }
  }
  useEffect(() => {
    const handleClickOutside = async (event: any) => {
      if (taskDivRef.current && !taskDivRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div id="wrapper" ref={taskDivRef}>
      <div id="sidebar-wrapper" className={open ? 'open-sidebar-detail' : 'close-sidebar'} style={
        {marginRight: open ? -250 : -275}
      }>
        <div className="row mb-4">
          <div className="col-6">
            <Link className="text-secondary" href={'#'} onClick={handleClose}>
              <FontAwesomeIcon icon={faTimes} style={{ fontSize: 22 }} />
            </Link>
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-12">
            <Button color="secondary" outline onClick={() => setConfirmClone (true)}>
              <FontAwesomeIcon icon={faClone} /> Duplicate
            </Button>
          </div>
          {
            userLogged?.id === task.user.id &&
            <div className="col-12">
              <Button color="danger" className="mt-2" outline onClick={() => setConfirmDelete (true)}>
                <FontAwesomeIcon icon={faTrash} /> Remove
              </Button>
            </div>
          }
        </div>
        <SubTask task={task} />
      </div>
      <Modal className="clone-modal" isOpen={confirmClone ? true : false}>
        <ModalBody>
          <div className="row">
            <div className="col-12 mb-2">
              <h6 className="text-muted">
                You will duplicate this task into a similar one.
              </h6>
            </div>
            <div className="col-6">
              <Button color="secondary" fullWidth onClick={handleSubmitClone} disabled={loading}>
                Duplicate {loading && <Loading color="light" />}
              </Button>
            </div>
            <div className="col-6">
              <Button color="secondary" fullWidth outline disabled={loading} onClick={() => setConfirmClone (false)}>
                Cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
      <Modal className="delete-modal" isOpen={confirmDelete ? true : false}>
        <ModalBody>
          <div className="row">
            <div className="col-12 mb-2">
              <h6 className="text-muted">
                You will delete this task and related data.
              </h6>
            </div>
            <div className="col-6">
              <Button color="danger" fullWidth onClick={handleRemoveTask} disabled={loading}>
                OK {loading && <Loading color="light" />}
              </Button>
            </div>
            <div className="col-6">
              <Button color="danger" fullWidth outline disabled={loading} onClick={() => setConfirmClone (false)}>
                Cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  )
}
export default TaskSetting;