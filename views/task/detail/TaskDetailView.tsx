"use client"
import Input from "@/common/components/Input";
import { ResponseHistoryDataType, TaskPriorityType, TaskType, TaskTypeItem } from "@/types/task.type";
import React, { MouseEvent, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleLeft, faCaretDown, faCaretUp, faCheck, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import DateInput from "@/common/components/DateInput";
import { ResponseUserDataType } from "@/types/user.type";
import { ResponseTagType } from "@/types/project.type";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxs/store.redux";
import { create, removeTask, taskHistory, update } from "@/api/task.api";
import { API_CODE } from "@/enums/api.enum";
import { catchError } from "@/services/base.service";
import Button from "@/common/components/Button";
import Loading from "@/common/components/Loading";
import CommentView from "@/views/comment/CommentView";
import TaskDescription from "./components/TaskDescription";
import { notify } from "@/utils/helper.util";
import { useRouter } from "next/navigation";
import { APP_LINK } from "@/enums/app.enum";
import SubTask from "./components/SubTask";
import TaskAssignSelect from "../components/select/TaskAssignSelect";
import TaskTagSelect from "../components/select/TaskTagSelect";
import TaskStatusSelect from "../components/select/TaskStatusSelect";
import TaskPrioritySelect from "../components/select/TaskPrioritySelect";
import TaskTypeSelect from "../components/select/TaskTypeSelect";
import TaskHistory from "./components/TaskHistory";
import Dropdown from "@/common/dropdown/Dropdown";
import DropdownItem from "@/common/dropdown/DropdownItem";
import Modal from "@/common/modal/Modal";
import ModalBody from "@/common/modal/ModalBody";
import Link from "next/link";

interface TaskDetailViewProps {
  task: TaskType
}

const TaskDetailView: React.FC<TaskDetailViewProps> = ({ task }) => {
  const defaultPageSizeHistory = 5;
  const [dueDate, setDueDate] = useState<Date | null>(task ? new Date(task.due) : new Date());
  const [assignee, setAssignee] = useState<ResponseUserDataType[]>(task ? task.assign : []);
  const [status, setStatus] = useState<ResponseTagType | undefined>(task ? task.status : undefined);
  const [tags, setTags] = useState<ResponseTagType[]>(task ? task.tags : []);
  const [priority, setPriority] = useState<TaskPriorityType | undefined>(task ? task.priority : undefined);
  const [type, setType] = useState<TaskTypeItem | undefined>(task ? task.type : undefined);
  const [description, setDescription] = useState<string>(task ? task.description : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppErrorType | null>(null);
  const [historyData, setHistoryData] = useState<ResponseHistoryDataType>();
  const [pageSize, setPageSize] = useState(defaultPageSizeHistory);
  const [loadingViewMore, setLoadingViewMore] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [openUpdateTitle, setOpenUpdateTitle] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [confirmClone, setConfirmClone] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const router = useRouter();
  const handleUpdateTask = async () => {
    try {
      if (!workspace || !title || title === '' || !dueDate || !status || !type || !priority) {
        return;
      }
      setLoading(true);
      setError(null);

      const payload = {
        title: title,
        description: description,
        priority: priority.id,
        status_id: status.id,
        type_id: type.id,
        due: dueDate,
        tags: tags.map(t => t.id),
        assigns: assignee.map(a => a.id)
      }
      const response = await update(task.workspace_id, task.project_id, task.id, payload);
      setLoading(false);
      if (response && response.code === API_CODE.OK) {
        loadHistories();
        return;
      }
      setError(catchError(response));
    } catch (error) {
      setLoading(false);
      setError(catchError(error as BaseResponseType));
    }
  }
  const handleViewMore = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setLoadingViewMore(true);
    setPageSize(pageSize + defaultPageSizeHistory);
  }
  const loadHistories = async () => {
    try {
      const response = await taskHistory(task.workspace_id, task.project_id, task.id, {
        page: 1,
        size: pageSize
      });
      setLoadingViewMore(false);
      if (response && response.code === API_CODE.OK) {
        setHistoryData(response.data);
        return;
      }
      setHistoryData(undefined);
    } catch (error) {
      setLoadingViewMore(false);
      setHistoryData(undefined);
    }
  }
  const handleSaveTitle = () => {
    if (titleRef.current && titleRef.current.value) {
      setTitle(titleRef.current.value);
    }
    setOpenUpdateTitle(false);
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
    loadHistories();
  }, [pageSize]);
  useEffect(() => {
    handleUpdateTask();
  }, [priority, status, type, assignee, tags, dueDate, description, title]);

  return (
    <div className="row mt-2">
      {
        (error) && 
          <div className="col-12 mb-2">
            <div className="alert alert-light alert-error">
              <b className="text-danger mt-2">Error: </b> {error.message}
            </div>
          </div>
      }
      <div className="col-12 mb-2">
        {
          openUpdateTitle &&
          <>
          <Button color="secondary" outline className="float-left mr-2" onClick={() => setOpenUpdateTitle (false)}>
            <FontAwesomeIcon icon={faTimesCircle} />
          </Button>
          <Button color="secondary" className="float-left" onClick={handleSaveTitle}>
            <FontAwesomeIcon icon={faCheck} />
          </Button>
          </>
        }
        <Input 
          type="text" 
          defaultValue={task.title} 
          className="input-title" 
          readOnly={openUpdateTitle ? false : true} 
          ref={titleRef}
          onClick={() => setOpenUpdateTitle (true)} 
        />
      </div>
      <div className="col-12 mb-2">
        <Link href={APP_LINK.WORKSPACE + '/' + task.workspace_id + '/project/' + task.project_id} className="text-secondary">
          <FontAwesomeIcon icon={faAngleDoubleLeft} /> Back to board
        </Link>
        <Dropdown title="Action" className="float-left">
          <DropdownItem className="pointer" onClick={() => setConfirmClone (true)}>
            Clone
          </DropdownItem>
          <DropdownItem className="pointer" onClick={() => setConfirmDelete (true)}>
            Delete
          </DropdownItem>
        </Dropdown>
      </div>
      <div className="col-lg-5 col-12">
        <div className="card">
          <div className="card-header p-10">
            <div className="card-title">
              <h6 className="text-secondary">Details:</h6>
            </div>
          </div>
          <div className="card-body p-10 text-secondary">
            <TaskAssignSelect 
              assignee={assignee}
              setAssignee={setAssignee}
              project={task.project}
            />
            <TaskTagSelect
              tags={tags}
              projectId={task.project_id}
              setTags={setTags}
              className="mt-2"
            />
            <TaskStatusSelect
              status={status}
              projectId={task.project_id}
              setStatus={setStatus}
              className="mt-2"
            />
            <TaskPrioritySelect
              priority={priority}
              setPriority={setPriority}
              className="mt-2"
            />
            <TaskTypeSelect
              type={type}
              setType={setType}
              className="mt-2"
            />
            <div className="row mt-2 text-secondary">
              <div className="col-4 lh-40">
                Due:
              </div>
              <div className={`col-8`}>
                <DateInput selected={dueDate} setSelected={setDueDate} id="dueDate" className="ml-2" />
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body p-10 text-secondary">
            <SubTask task={task} />
          </div>
        </div>
        <div className="card">
          <div className="card-header p-10 text-secondary">
            <div className="card-title">
              <h6 className="text-secondary">History:</h6>
            </div>
            {
              openHistory ? 
              <FontAwesomeIcon icon={faCaretUp} className="float-right pointer" onClick={() => setOpenHistory (false)} />
              :
              <FontAwesomeIcon icon={faCaretDown} className="float-right pointer" onClick={() => setOpenHistory (true)} />
            }
          </div>
          {
            openHistory &&
            <div className="card-body p-10 text-secondary history-section">
              <TaskHistory 
                historyData={historyData} 
                task={task} 
                loadingViewMore={loadingViewMore}
                pageSize={pageSize}
                handleViewMoreHistory={handleViewMore}
              />
            </div>
          }
        </div>
      </div>
      <div className="col-lg-7 col-12">
        <TaskDescription description={description} setDescription={setDescription} />
        <CommentView task={task} />
      </div>
      <Modal className="clone-modal" isOpen={confirmClone ? true : false}>
        <ModalBody>
          <div className="row">
            <div className="col-12 mb-2">
              <h6 className="text-muted">
                You will clone this task into a similar one.
              </h6>
            </div>
            <div className="col-6">
              <Button color="secondary" fullWidth onClick={handleSubmitClone} disabled={loading}>
                Clone {loading && <Loading color="light" />}
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
              <Button color="danger" fullWidth outline disabled={loading} onClick={() => setConfirmDelete (false)}>
                Cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
export default TaskDetailView;