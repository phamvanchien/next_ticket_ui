import Sidebar from "@/common/layouts/Sidebar";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import DatePickerCustom from "@/common/components/DatePickerCustom";
import TaskAssignee from "@/common/layouts/task-form/TaskAssignee";
import { ProjectAttributeType, ProjectType } from "@/types/project.type";
import { UserType } from "@/types/user.type";
import { useTranslations } from "next-intl";
import TaskStatus from "@/common/layouts/task-form/TaskStatus";
import TaskAttribute from "@/common/layouts/task-form/attribute/TaskAttribute";
import { TaskAttributeType } from "@/types/task.type";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import { displayMessage } from "@/utils/helper.util";
import { BaseResponseType } from "@/types/base.type";
import { create } from "@/api/task.api";
import { API_CODE } from "@/enums/api.enum";
import Loading from "@/common/components/Loading";
import TaskDescription from "@/common/layouts/task-form/TaskDescription";
import { RootState, useAppDispatch } from "@/reduxs/store.redux";
import { setTaskCreated } from "@/reduxs/task.redux";
import { useSelector } from "react-redux";
import TaskCheckList from "@/common/layouts/task-form/checklist/TaskCheckList";

interface TaskCreateProps {
  project: ProjectType
  open: boolean
  createWithStatus?: number
  setOpen: (open: boolean) => void
  setCreateWithStatus: (createWithStatus?: number) => void
}

const TaskCreate: React.FC<TaskCreateProps> = ({ 
  open, 
  project, 
  createWithStatus, 
  setCreateWithStatus,
  setOpen, 
}) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const [memberList, setMemberList] = useState(project.members);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [assignee, setAssignee] = useState<UserType[]>([]);
  const [status, setStatus] = useState<number>(project.status[0].id);
  const [attributesSelected, setAttributesSelected] = useState<TaskAttributeType[]>([]);
  const [title, setTitle] = useState<string>();
  const [createLoading, setCreateLoading] = useState(false);
  const [description, setDescription] = useState<string>('');
  const [projectAttributes, setProjectAttributes] = useState<ProjectAttributeType[]>(project.attributes);
  const attributeCreated = useSelector((state: RootState) => state.projectSlide).attributeCreated;
  const attributeDeleted = useSelector((state: RootState) => state.projectSlide).attributeDeleted;
  const attributeUpdated = useSelector((state: RootState) => state.projectSlide).attributeUpdated;
  useEffect(() => {
    setMemberList([...memberList, project.user]);
  }, []);
  useEffect(() => {
    if (createWithStatus) {
      setOpen(true);
      setStatus(createWithStatus);
    }
  }, [createWithStatus])
  const handleSaveTask = async () => {
    try {
      if (!title || !status) {
        return;
      }
      setCreateLoading(true);
      const response = await create(project.workspace_id, project.id, {
        status_id: status,
        type_id: 1,
        title: title,
        description: description,
        priority: 1,
        due: dueDate ?? undefined,
        assigns: assignee.map(a => a.id),
        attributes: attributesSelected
      });
      setCreateLoading(false);
      if (response && response.code === API_CODE.CREATED) {
        setCreateWithStatus(undefined);
        dispatch(setTaskCreated(response.data));
        setTitle(undefined);
        setDueDate(null);
        setStatus(project.status[0].id);
        setAttributesSelected([]);
        setAssignee([]);
        setOpen(false);
        return;
      }
      displayMessage('error', response.error?.message);
    } catch (error) {
      setCreateLoading(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  useEffect(() => {
    if (attributeCreated) {
      setProjectAttributes([...projectAttributes, attributeCreated]);
    }
  }, [attributeCreated]);
  useEffect(() => {
    if (attributeDeleted) {
      setProjectAttributes(projectAttributes.filter(a => a.id !== attributeDeleted));
    }
  }, [attributeDeleted]);
  useEffect(() => {
    if (attributeUpdated) {
      setProjectAttributes(
        projectAttributes.map(a =>
          a.id === attributeUpdated.id ? attributeUpdated : a
        )
      );
    }
  }, [attributeUpdated]);  
  return (
    <Sidebar 
      open={open}
      width={1000}
      headerTitle={t('tasks.btn_create_task')}
      setOpen={setOpen}
      headerElement={
        <Button color={createLoading ? 'secondary' : 'primary'} onClick={handleSaveTask} disabled={createLoading}>
          {createLoading ? <Loading color="light" /> : t('btn_save')}
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
      <TaskStatus className="mt-3" statusList={project.status} statusSelected={status} setStatusSelected={setStatus} />
      <TaskAttribute 
        className="mt-3" 
        taskId={0}
        projectId={project.id} 
        workspaceId={project.workspace_id} 
        attributes={projectAttributes} 
        attributesSelected={attributesSelected}
        createBtn
        setAttributesSelected={setAttributesSelected}
      />
      <TaskDescription description={description} setDescription={setDescription} taskId={0} />
    </Sidebar>
  )
}
export default TaskCreate;
