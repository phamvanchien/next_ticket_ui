import { update } from "@/api/task.api";
import Button from "@/common/components/Button";
import DatePickerCustom from "@/common/components/DatePickerCustom";
import Input from "@/common/components/Input";
import Loading from "@/common/components/Loading";
import Sidebar from "@/common/layouts/Sidebar";
import TaskAttribute from "@/common/layouts/task-form/attribute/TaskAttribute";
import TaskAssignee from "@/common/layouts/task-form/TaskAssignee";
import TaskDescription from "@/common/layouts/task-form/TaskDescription";
import TaskStatus from "@/common/layouts/task-form/TaskStatus";
import { API_CODE } from "@/enums/api.enum";
import { useAppDispatch } from "@/reduxs/store.redux";
import { setTaskUpdated } from "@/reduxs/task.redux";
import { BaseResponseType } from "@/types/base.type";
import { ProjectType } from "@/types/project.type";
import { TaskAttributeType, TaskType } from "@/types/task.type";
import { UserType } from "@/types/user.type";
import { displayMessage } from "@/utils/helper.util";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

interface TaskEditProps {
  project: ProjectType
  task?: TaskType;
  setOpenModal: (task?: TaskType) => void;
}

const TaskEdit: React.FC<TaskEditProps> = ({ 
  task, 
  project, 
  setOpenModal
}) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(!!task);
  const [editLoading, setEditLoading] = useState(false);
  const [memberList, setMemberList] = useState(project.members);
  const [dueDate, setDueDate] = useState<Date | null>(task ? new Date(task.due) : null);
  const [assignee, setAssignee] = useState<UserType[]>(task ? task.assign : []);
  const [status, setStatus] = useState<number>(task ? task.status.id : project.status[0].id);
  const [attributesSelected, setAttributesSelected] = useState<TaskAttributeType[]>([]);
  const [title, setTitle] = useState<string>(task ? task.title : '');
  const [taskId, setTaskId] = useState<number>(task ? task.id : 0);
  const [description, setDescription] = useState<string>('');
  const handleSaveTask = async () => {
    console.log('title: ', title)
    console.log('assignee: ', assignee)
    console.log('dueDate: ', dueDate)
    console.log('status: ', status)
    console.log('attributesSelected: ', attributesSelected)

    try {
      if (!title || !status || !task) {
        return;
      }
      setEditLoading(true);
      const response = await update(project.workspace_id, project.id, task.id, {
        status_id: status,
        type_id: 1,
        title: title,
        description: description,
        priority: 1,
        due: dueDate ?? undefined,
        assigns: assignee.map(a => a.id),
        attributes: attributesSelected.map(a => {
          return {
            ...a,
            id: a.attribute.id
          }
        })
      });
      setEditLoading(false);
      if (response && response.code === API_CODE.OK) {
        dispatch(setTaskUpdated(response.data));
        setOpen(false);
        return;
      }
      displayMessage('error', response.error?.message);
    } catch (error) {
      setEditLoading(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  useEffect(() => {
    setMemberList([...memberList, project.user]);
  }, []);
  useEffect(() => {
    if (!open){ 
      setOpenModal(undefined);
    }
  }, [open]);

  useEffect(() => {
    setOpen(!!task);
  }, [task]);
  useEffect(() => {
    if (task) {
      setAttributesSelected(task.attributes);
      setTitle(task.title);
      setDueDate(new Date(task.due));
      setAssignee(task.assign);
      setStatus(task.status.id);
      setTaskId(task.id);
      setDescription(task.description);
    }
  }, [task]);
  return (
    <Sidebar 
      open={open}
      width={800}
      setOpen={setOpen}
      headerElement={
        <Button color={editLoading ? 'secondary' : 'primary'} onClick={handleSaveTask} disabled={editLoading}>
          {editLoading ? <Loading color="light" /> : t('btn_save')}
        </Button>
      }
    >
      <div className="row">
        <div className="col-12">
          <Input type="text" value={title} classInput="task-title" placeholder={t('tasks.task_title_default')} onChange={(e) => setTitle (e.target.value)} />
        </div>
      </div>
      <TaskAssignee className="mt-4 dropdown-assignee" projectMembers={memberList} assigneeSelected={assignee} setAssigneeSelected={setAssignee} />
      <div className="row mt-3">
        <div className="col-3 text-secondary">
          <FontAwesomeIcon icon={faCalendar} /> {t('tasks.placeholder_due_date')}:
        </div>
        <div className="col-9">
          <DatePickerCustom setDate={setDueDate} date={dueDate} />
        </div>
      </div>
      <TaskStatus className="mt-2" statusList={project.status} statusSelected={status} setStatusSelected={setStatus} />
      <TaskAttribute 
        className="mt-2" 
        projectId={project.id} 
        workspaceId={project.workspace_id} 
        taskId={taskId}
        attributes={project.attributes} 
        attributesSelected={attributesSelected}
        setAttributesSelected={setAttributesSelected}
      />
      <TaskDescription description={description} setDescription={setDescription} taskId={taskId} />
    </Sidebar>
  )
}
export default TaskEdit;