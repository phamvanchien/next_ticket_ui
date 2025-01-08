"use client"
import Input from "@/common/components/Input";
import { TaskPriorityType, TaskType, TaskTypeItem } from "@/types/task.type";
import React, { useRef, useState } from "react";
import TaskAssignee from "./components/TaskAssignee";
import TaskStatus from "./components/TaskStatus";
import TaskTag from "./components/TaskTag";
import TaskPriority from "./components/TaskPriority";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleLeft, faCalendarCheck, faComment, faInfo } from "@fortawesome/free-solid-svg-icons";
import DateInput from "@/common/components/DateInput";
import { ResponseUserDataType } from "@/types/user.type";
import { ResponseTagType } from "@/types/project.type";
import TaskTypeList from "./components/TaskTypeList";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxs/store.redux";
import { update } from "@/api/task.api";
import { API_CODE } from "@/enums/api.enum";
import { catchError } from "@/services/base.service";
import Button from "@/common/components/Button";
import Loading from "@/common/components/Loading";
import TaskSetting from "./components/TaskSetting";
import CommentView from "@/views/comment/CommentView";
import TaskDescription from "./components/TaskDescription";
import { notify } from "@/utils/helper.util";
import { useRouter } from "next/navigation";
import { APP_LINK } from "@/enums/app.enum";
import Link from "next/link";

interface TaskDetailViewProps {
  task: TaskType
}

const TaskDetailView: React.FC<TaskDetailViewProps> = ({ task }) => {
  const [dueDate, setDueDate] = useState<Date | null>(task ? new Date(task.due) : new Date());
  const [assignee, setAssignee] = useState<ResponseUserDataType[]>(task ? task.assign : []);
  const [status, setStatus] = useState<ResponseTagType | undefined>(task ? task.status : undefined);
  const [tags, setTags] = useState<ResponseTagType[]>(task ? task.tags : []);
  const [priority, setPriority] = useState<TaskPriorityType | undefined>(task ? task.priority : undefined);
  const [type, setType] = useState<TaskTypeItem | undefined>(task ? task.type : undefined);
  const [description, setDescription] = useState<string>(task ? task.description : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppErrorType | null>(null);
  const [openSetting, setOpenSetting] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const router = useRouter();
  const handleUpdateTask = async () => {
    try {
      if (!workspace || !titleRef.current || titleRef.current.value === '' || !dueDate || !status || !type || !priority) {
        return;
      }
      setLoading(true);
      setError(null);

      const payload = {
        title: titleRef.current.value,
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
        notify('Task is saved', 'success');
        return;
      }
      setError(catchError(response));
    } catch (error) {
      setLoading(false);
      setError(catchError(error as BaseResponseType));
    }
  }
  return (
    <div className="container mt-4">
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
      <div className="row mt-2">
        <div className="col-12">
          <Link href={APP_LINK.WORKSPACE + '/' + workspace?.id + '/project/' + task.project_id} className="text-secondary mr-4">
            <FontAwesomeIcon icon={faAngleDoubleLeft} /> Back to board
          </Link>
          <Button color="secondary" className="ml-2 float-right" disabled={loading} onClick={() => setOpenSetting (true)}>
            <FontAwesomeIcon icon={faInfo} />
          </Button>
          <Button color="primary" className="float-right" onClick={handleUpdateTask} disabled={loading}>
            {loading ? <Loading color="light" /> : 'Save'}
          </Button>
        </div>
        <div className="col-12 mt-4">
          <Input type="text" defaultValue={task.title} className="task-title" ref={titleRef} />
        </div>
      </div>
      <TaskAssignee 
        project={task.project}
        assignee={assignee}
        setAssignee={setAssignee}
      />
      <div className="row mt-4 text-secondary">
        <div className="col-lg-2 col-4 pt-2"><FontAwesomeIcon icon={faCalendarCheck} /> Due: </div>
        <div className={`col-8 col-lg-6`}>
          <DateInput selected={dueDate} setSelected={setDueDate} id="dueDate" className="ml-2" />
        </div>
      </div>
      <TaskStatus task={task} status={status} setStatus={setStatus} />
      <TaskTag projectId={task.project_id} tags={tags} setTags={setTags} />
      <TaskPriority priority={priority} setPriority={setPriority} />
      <TaskTypeList type={type} setType={setType} />
      <TaskDescription description={description} setDescription={setDescription} />
      <hr/>
      <TaskSetting task={task} open={openSetting} setOpen={setOpenSetting} />
      <CommentView task={task} />
    </div>
  )
}
export default TaskDetailView;