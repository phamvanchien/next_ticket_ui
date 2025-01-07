import Button from "@/common/components/Button";
import EditorArea from "@/common/components/EditorArea";
import { priorityRange, taskType } from "@/utils/helper.util";
import { faCheckCircle, faExternalLink, faPencil, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { MouseEvent, useEffect, useRef, useState } from "react";
import TaskAssignee from "../components/TaskAssignee";
import { ProjectType, ResponseTagType } from "@/types/project.type";
import { ResponseUserDataType } from "@/types/user.type";
import TaskTag from "../components/TaskTag";
import TaskStatus from "../components/TaskStatus";
import InputForm from "@/common/components/InputForm";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import { APP_LINK, APP_VALIDATE_TYPE } from "@/enums/app.enum";
import { TASK_ENUM } from "@/enums/task.enum";
import DateInput from "@/common/components/DateInput";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxs/store.redux";
import { create, update } from "@/api/task.api";
import { API_CODE } from "@/enums/api.enum";
import { TaskType } from "@/types/task.type";
import { catchError } from "@/services/base.service";
import Loading from "@/common/components/Loading";
import ImageIcon from "@/common/components/ImageIcon";
import { getIconPriority, getTypeClass, getTypeIcon } from "../components/board/grib/TaskItem";

interface CreateTaskViewProps {
  open: boolean
  project: ProjectType
  inputStatus?: ResponseTagType
  task?: TaskType
  setOpen: (open: boolean) => void
  setTaskResponse: (task: TaskType) => void
}

const CreateTaskView: React.FC<CreateTaskViewProps> = ({ open, setOpen, project, inputStatus, task, setTaskResponse }) => {
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const [validateError, setValidateError] = useState<AppErrorType[] | []>([]);
  const [description, setDescription] = useState<string>(task ? task.description : '');
  const [assignee, setAssignee] = useState<ResponseUserDataType[]>(task ? task.assign : []);
  const [tags, setTags] = useState<ResponseTagType[]>(task ? task.tags : []);
  const [status, setStatus] = useState<ResponseTagType | undefined>(task ? task.status : undefined);
  const [priority, setPriority] = useState<number>(task ? task.priority.id : 1);
  const [title, setTitle] = useState<string | undefined>(task ? task.title : 'Your task title here');
  const [dueDate, setDueDate] = useState<Date | null>(task ? new Date(task.due) : new Date());
  const [type, setType] = useState(task ? task.type.id : 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppErrorType | null>(null);
  const taskDivRef = useRef<HTMLDivElement>(null);
  const handleCreateTask = async () => {
    try {
      if (!workspace || !title || title === '' || !dueDate || !status || !type) {
        return;
      }
      setLoading(true);
      setError(null);

      const payload = {
        title: title,
        description: description,
        priority: priority,
        status_id: status.id,
        type_id: type,
        due: dueDate,
        tags: tags.map(t => t.id),
        assigns: assignee.map(a => a.id)
      }

      if (task) {
        payload.status_id = 0;
        const response = await update(task.workspace_id, task.project_id, task.id, payload);
        setLoading(false);
        if (response && response.code === API_CODE.OK) {
          setTaskResponse(response.data);
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
        setType(1);
        setPriority(1);
        setTitle('Your task title here');
        setDueDate(new Date());
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
      <div id="sidebar-wrapper" className={open ? 'open-sidebar' : 'close-sidebar'} style={
        {marginRight: open ? -250 : -275}
      }>
        <div className="row mb-4">
          <div className="col-6">
            <Link className="text-secondary" href={'#'} onClick={handleClose}>
              <FontAwesomeIcon icon={faTimes} style={{ fontSize: 22 }} />
            </Link>
          </div>
          <div className="col-6">
            {
              task &&
              <Link 
                href={APP_LINK.WORKSPACE + '/' + workspace?.id + '/project/' + project.id + '/task/' + task.id} 
                className="float-right" style={{ marginTop: 3 }}
              >
                View task <FontAwesomeIcon icon={faExternalLink} />
              </Link>
            }
            <Button color="primary" className="float-right mr-2" disabled={loading} onClick={handleCreateTask}>
              {loading ? <Loading color="light" /> : 'Save'}
            </Button>
          </div>
        </div>
        {
          (error) && 
          <div className="row">
            <div className="col-12">
              <div className="alert alert-light alert-error">
                <b className="text-danger mt-2">Error: </b> {error.message}
              </div>
            </div>
          </div>
        }
        <div className="row">
          <div className="col-12">
            <InputForm
              className="task-title-create"
              id="taskName"
              inputType="text"
              inputIcon={<FontAwesomeIcon icon={faPencil} />}
              inputPlaceholder="Your task title here"
              inputValue={title}
              setInputValue={setTitle}
              error={validateError}
              setError={setValidateError}
              defaultValue={title}
              validates={[
                {
                  validateType: APP_VALIDATE_TYPE.REQUIRED,
                  validateMessage: TASK_ENUM.TASK_TITLE_EMPTY
                }
              ]}
            />
          </div>

          <TaskAssignee project={project} assignee={assignee} setAssignee={setAssignee} />

          <div className="col-3 mt-4 text-secondary" style={{ paddingLeft: 20 }}>
            Due:
          </div>
          <div className="col-9 mt-4">
            <label htmlFor="dueDate">
              <ImageIcon icon="calendar" width={25} height={25} className="mr-2" />
            </label>
            <DateInput selected={dueDate} setSelected={setDueDate} id="dueDate" />
          </div>

          <TaskTag projectId={project.id} tags={tags} setTags={setTags} />

          {!task && <TaskStatus projectId={project.id} status={status} setStatus={setStatus} />}

          <div className="col-3 mt-4 text-secondary" style={{ paddingLeft: 20 }}>
            Priority:
          </div>
          <div className="col-9 mt-4">
            {
              priorityRange().map(item => (
                <span className="badge badge-light mr-2" key={item.id} style={{ cursor: 'pointer' }} onClick={() => setPriority (item.id)}>
                  {getIconPriority(item.id, 'mr-2')} {item.title} {priority === item.id && <FontAwesomeIcon icon={faCheckCircle} className="text-secondary" />}
                </span>
              ))
            }
          </div>
          <div className="col-3 mt-4 text-secondary" style={{ paddingLeft: 20 }}>
            Type:
          </div>
          <div className="col-9 mt-4">
            {
              taskType().map(item => (
                <span key={item.id} className={`badge badge-${getTypeClass(item.id)} mr-2`} style={{cursor: 'pointer'}} onClick={() => setType (item.id)}>
                  {getTypeIcon(item.id)} {item.title} {type === item.id && <FontAwesomeIcon icon={faCheckCircle} />}
                </span>
              ))
            }
          </div>
          <div className="col-12 mt-4">
            <EditorArea value={description} setValue={setDescription} placeholder="Description about your task..." />
          </div>
        </div>
      </div>
    </div>
  </>
}
export default CreateTaskView;