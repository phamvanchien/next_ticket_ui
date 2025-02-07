"use client"
import Input from "@/common/components/Input";
import { HistoryType, TaskPriorityType, TaskType, TaskTypeItem } from "@/types/task.type";
import React, { MouseEvent, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleLeft, faCaretDown, faCaretUp, faCheck, faTimes, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import DateInput from "@/common/components/DateInput";
import { ResponseUserDataType } from "@/types/user.type";
import { AppErrorType, BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
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
import ErrorAlert from "@/common/components/ErrorAlert";
import { ProjectTagType } from "@/types/project.type";
import { useTranslations } from "next-intl";

interface TaskDetailViewProps {
  task: TaskType
}

const TaskDetailView: React.FC<TaskDetailViewProps> = ({ task }) => {
  const defaultPageSizeHistory = 5;
  const [dueDate, setDueDate] = useState<Date | null>(task ? new Date(task.due) : new Date());
  const [assignee, setAssignee] = useState<ResponseUserDataType[]>(task ? task.assign : []);
  const [status, setStatus] = useState<ProjectTagType | undefined>(task ? task.status : undefined);
  const [tags, setTags] = useState<ProjectTagType[]>(task ? task.tags : []);
  const [priority, setPriority] = useState<TaskPriorityType | undefined>(task ? task.priority : undefined);
  const [type, setType] = useState<TaskTypeItem | undefined>(task ? task.type : undefined);
  const [description, setDescription] = useState<string>(task ? task.description : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppErrorType | null>(null);
  const [historyData, setHistoryData] = useState<ResponseWithPaginationType<HistoryType[]>>();
  const [pageSize, setPageSize] = useState(defaultPageSizeHistory);
  const [loadingViewMore, setLoadingViewMore] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [openUpdateTitle, setOpenUpdateTitle] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [confirmClone, setConfirmClone] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const colTitleRef = useRef<HTMLDivElement>(null);
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const router = useRouter();
  const t = useTranslations();
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
      setLoading(true);
      const response = await removeTask (workspace.id, task.project_id, task.id);
      setLoading(false);
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
  useEffect(() => {
    const handleClickOutside = async (event: any) => {
      if (colTitleRef.current && !colTitleRef.current.contains(event.target as Node)) {
        setOpenUpdateTitle(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="row mt-2">
      {
        (error) && 
          <div className="col-12 mb-2">
            <ErrorAlert error={error} />
          </div>
      }
      <div className="col-12">
        <Link href={APP_LINK.WORKSPACE + '/' + task.workspace_id + '/project/' + task.project_id} className="text-secondary">
          <FontAwesomeIcon icon={faAngleDoubleLeft} /> {t('tasks.back_to_board')}
        </Link>
      </div>
      <div className="col-12 mb-2" ref={colTitleRef}>
        {!openUpdateTitle && <h4 className="mt-2" onClick={() => setOpenUpdateTitle (true)}>{title}</h4>}
        {
          openUpdateTitle &&
          <Input 
            type="text" 
            defaultValue={title} 
            className="input-title" 
            readOnly={openUpdateTitle ? false : true} 
            ref={titleRef}
          />
        }
        {
          openUpdateTitle &&
          <>
          <Button color="secondary" outline className="float-left mr-2" onClick={() => setOpenUpdateTitle (false)}>
            <FontAwesomeIcon icon={faTimes} />
          </Button>
          <Button color="primary" className="float-left" outline onClick={handleSaveTitle}>
            <FontAwesomeIcon icon={faCheck} />
          </Button>
          </>
        }
      </div>
      <div className="col-12 mb-2">
        <Dropdown title={t('tasks.action_label')} className="float-left">
          <DropdownItem className="pointer" onClick={() => setConfirmClone (true)}>
            {t('btn_clone')}
          </DropdownItem>
          {
            userLogged?.id === task.user.id &&
            <DropdownItem className="pointer" onClick={() => setConfirmDelete (true)}>
              {t('btn_delete')}
            </DropdownItem>
          }
        </Dropdown>
      </div>
      <div className="col-lg-4 col-12">
        <div className="card">
          <div className="card-header p-10">
            <div className="card-title">
              <h6 className="text-secondary m-unset">{t('tasks.detail_label')}:</h6>
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
                {t('tasks.due_label')}:
              </div>
              <div className={`col-8`}>
                <DateInput selected={dueDate} setSelected={setDueDate} id="dueDate" className="ml-2" />
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header p-10 text-secondary">
            <div className="card-title">
              <h6 className="text-secondary m-unset">{t('tasks.history_label')}:</h6>
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
      <div className="col-lg-8 col-12">
        <div className="card mb-4">
          <div className="card-body p-10 text-secondary">
            <SubTask task={task} />
          </div>
        </div>
        <TaskDescription description={description} setDescription={setDescription} />
        <CommentView task={task} />
      </div>
      <Modal className="clone-modal" isOpen={confirmClone ? true : false}>
        <ModalBody>
          <div className="row">
            <div className="col-12 mb-2">
              <h6 className="text-muted">
                {t('tasks.clone_task_message')}
              </h6>
            </div>
            <div className="col-12">
              <Button color="primary" className="float-right" onClick={handleSubmitClone} disabled={loading}>
                {t('btn_clone')} {loading && <Loading color="light" />}
              </Button>
              <Button color="default" className="float-right btn-no-border mr-2" outline disabled={loading} onClick={() => setConfirmClone (false)}>
                {t('btn_cancel')}
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
                {t('tasks.delete_task_message')}
              </h6>
            </div>
            <div className="col-12">
              <Button color="primary" className="float-right" onClick={handleRemoveTask} disabled={loading}>
                {t('btn_ok')} {loading && <Loading color="light" />}
              </Button>
              <Button color="default" className="float-right btn-no-border mr-2" outline disabled={loading} onClick={() => setConfirmDelete (false)}>
                {t('btn_cancel')}
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
export default TaskDetailView;