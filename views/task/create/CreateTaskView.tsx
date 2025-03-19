import Button from "@/common/components/Button";
import EditorArea from "@/common/components/EditorArea";
import { priorityRange, taskType } from "@/utils/helper.util";
import { faExternalLink, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { MouseEvent, useEffect, useRef, useState } from "react";
import { ProjectType, ProjectTagType } from "@/types/project.type";
import { ResponseUserDataType } from "@/types/user.type";
import InputForm from "@/common/components/InputForm";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import { APP_LINK, APP_VALIDATE_TYPE } from "@/enums/app.enum";
import DateInput from "@/common/components/DateInput";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxs/store.redux";
import { create, update } from "@/api/task.api";
import { API_CODE } from "@/enums/api.enum";
import { TaskAttributeType, TaskPriorityType, TaskType, TaskTypeItem } from "@/types/task.type";
import { catchError } from "@/services/base.service";
import Loading from "@/common/components/Loading";
import TaskAssignSelect from "../components/select/TaskAssignSelect";
import TaskTagSelect from "../components/select/TaskTagSelect";
import TaskStatusSelect from "../components/select/TaskStatusSelect";
import TaskPrioritySelect from "../components/select/TaskPrioritySelect";
import TaskTypeSelect from "../components/select/TaskTypeSelect";
import ErrorAlert from "@/common/components/ErrorAlert";
import { useTranslations } from "next-intl";
import DatePickerCustom from "@/common/components/DatePickerCustom";

interface CreateTaskViewProps {
  open: boolean
  project: ProjectType
  inputStatus?: ProjectTagType
  task?: TaskType
  setOpen: (open: boolean) => void
  setTaskResponse: (task: TaskType) => void
}

const CreateTaskView: React.FC<CreateTaskViewProps> = ({ open, setOpen, project, inputStatus, task, setTaskResponse }) => {
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const types = taskType();
  const priorities = priorityRange();
  const t = useTranslations();
  const [validateError, setValidateError] = useState<AppErrorType[] | []>([]);
  const [description, setDescription] = useState<string>(task ? task.description : '');
  const [assignee, setAssignee] = useState<ResponseUserDataType[]>(task ? task.assign : []);
  const [tags, setTags] = useState<ProjectTagType[]>(task ? task.tags : []);
  const [status, setStatus] = useState<ProjectTagType | undefined>(task ? task.status : undefined);
  const [priority, setPriority] = useState<TaskPriorityType | undefined>(task ? task.priority : priorities[0]);
  const [title, setTitle] = useState<string | undefined>(task ? task.title : t('tasks.task_title_default'));
  const [dueDate, setDueDate] = useState<Date | null>(task ? new Date(task.due) : new Date());
  const [type, setType] = useState<TaskTypeItem | undefined>(task ? task.type : types[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppErrorType | null>(null);
  const [taskAttributes, setTaskAttributes] = useState<TaskAttributeType[]>(task ? task.attributes : []);
  const taskDivRef = useRef<HTMLDivElement>(null);
  const handleCreateTask = async () => {
    try {
      if (!workspace || !title || title === '' || !dueDate || !status || !type || !priority || !type) {
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
        assigns: assignee.map(a => a.id),
        attributes: taskAttributes
      }

      if (task) {
        payload.status_id = 0;
        const response = await update(task.workspace_id, task.project_id, task.id, payload);
        setLoading(false);
        if (response && response.code === API_CODE.OK) {
          setTaskResponse(response.data);
          setTitle(t('tasks.task_title_default'));
          setOpen(false);
        }
        return;
      }
      const response = await create(workspace.id, project.id, payload);
      setLoading(false);

      if (response && response.code === API_CODE.CREATED) {
        setTaskResponse(response.data);
        setOpen(false);
        setDescription('');
        setAssignee([]);
        setTags([]);
        setStatus(undefined);
        setType(types[0]);
        setPriority(priorities[0]);
        setTitle(t('tasks.task_title_default'));
        setDueDate(new Date());
        setTaskAttributes([]);
        return;
      }
      setError(catchError(response));
    } catch (error) {
      setLoading(false);
      setError(catchError(error as BaseResponseType));
    }
  }
  const handleClose = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (!loading) {
      setOpen(false);
    }
  }
  useEffect(() => {
    if (inputStatus) {
      setStatus(inputStatus);
    }
  }, [inputStatus]);
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

  return <>
    <div id="wrapper" ref={taskDivRef}>
      <div id="sidebar-wrapper-next-tech" className={open ? 'open-sidebar' : 'close-sidebar-next-tech'} style={
        {marginRight: open ? -250 : -275}
      }>
        <div className="row mb-4">
          <div className="col-6 pt-2">
            <Link className="text-secondary" href={'#'} onClick={handleClose}>
              <FontAwesomeIcon icon={faTimes} style={{ fontSize: 22 }} />
            </Link>
          </div>
          <div className="col-6">
            {
              task &&
              <Link 
                href={APP_LINK.WORKSPACE + '/' + workspace?.id + '/project/' + project.id + '/task/' + task.id} 
                className="float-right mt-2" style={{ marginTop: 3 }}
              >
                {t('tasks.btn_view_task')} <FontAwesomeIcon icon={faExternalLink} />
              </Link>
            }
            <Button color="primary" className="float-right mr-2" disabled={loading} onClick={handleCreateTask}>
              {loading ? <Loading color="light" /> : t('btn_save')}
            </Button>
          </div>
        </div>
        {
          (error) && 
          <div className="row">
            <div className="col-12">
              <ErrorAlert error={error} />
            </div>
          </div>
        }

        <div className="row mb-2">
          <div className="col-12">
            <InputForm
              className="task-title-create"
              id="taskName"
              inputType="text"
              inputPlaceholder={t('tasks.task_title_default')}
              inputValue={title}
              setInputValue={setTitle}
              error={validateError}
              setError={setValidateError}
              defaultValue={title}
              validates={[
                {
                  validateType: APP_VALIDATE_TYPE.REQUIRED,
                  validateMessage: t('tasks.task_title_required')
                }
              ]}
            />
          </div>
        </div>
        <TaskAssignSelect 
          assignee={assignee}
          setAssignee={setAssignee}
          project={project}
        />
        <div className="row mt-2 text-secondary">
          <div className="col-4 lh-40">
            {t('tasks.due_label')}:
          </div>
          <div className={`col-8`}>
            {/* <DateInput selected={dueDate} setSelected={setDueDate} id="dueDate" className="ml-2" /> */}
            <DatePickerCustom setDueDate={setDueDate} dueDate={dueDate} placeholder={t('tasks.placeholder_due_date')} />
          </div>
        </div>
        <TaskTagSelect
          tags={tags}
          projectId={project.id}
          setTags={setTags}
          className="mt-2"
        />
        {
          !task &&
          <TaskStatusSelect
            status={status}
            projectId={project.id}
            setStatus={setStatus}
            className="mt-2"
          />
        }
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
        {/* <TaskAttributeSelect 
          attributes={project.attributes}
          taskAttributes={taskAttributes}
          setTaskAttributes={setTaskAttributes}
        /> */}
        <div className="row" style={{marginBottom: 30}}>
          <div className="col-12 mt-4">
            <EditorArea value={description} setValue={setDescription} placeholder={t('tasks.placeholder_task_description')} />
          </div>
        </div>
      </div>
    </div>
  </>
}
export default CreateTaskView;