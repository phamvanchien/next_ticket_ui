import Input from "@/common/components/Input";
import { TaskAttributeType, TaskType } from "@/types/task.type";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import TaskAssignee from "./TaskAssignee";
import { UserType } from "@/types/user.type";
import { ProjectAttributeType, ProjectType } from "@/types/project.type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import DatePickerCustom from "@/common/components/DatePickerCustom";
import TaskStatus from "./TaskStatus";
import TaskAttribute from "./attribute/TaskAttribute";
import TaskDescription from "./TaskDescription";
import Button from "@/common/components/Button";
import { RootState, useAppDispatch } from "@/reduxs/store.redux";
import { setTaskCreated } from "@/reduxs/task.redux";
import { API_CODE } from "@/enums/api.enum";
import { create } from "@/api/task.api";
import { displayMessage } from "@/utils/helper.util";
import { BaseResponseType } from "@/types/base.type";
import Loading from "@/common/components/Loading";
import { useSelector } from "react-redux";

interface TaskCloneFormProps {
  task?: TaskType
  project: ProjectType
  openClone?: boolean
  setOpenClone?: (openClone: boolean) => void
}

const TaskCloneForm: React.FC<TaskCloneFormProps> = ({ task, project, openClone, setOpenClone }) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState<string>(task ? task.title + ' Copy' : '');
  const [assignee, setAssignee] = useState<UserType[]>(task ? task.assign : []);
  const [memberList, setMemberList] = useState<UserType[]>();
  const [dueDate, setDueDate] = useState<Date | null>(task ? new Date(task.due) : null);
  const [status, setStatus] = useState<number>(task ? task.status.id : project.status[0].id);
  const [attributesSelected, setAttributesSelected] = useState<TaskAttributeType[]>([]);
  const [taskId, setTaskId] = useState<number>(task ? task.id : 0);
  const [projectAttributes, setProjectAttributes] = useState<ProjectAttributeType[]>(project.attributes);
  const [description, setDescription] = useState<string>(task?.description ?? '');
  const [loading, setLoading] = useState(false);
  const attributeCreated = useSelector((state: RootState) => state.projectSlide).attributeCreated;
  const attributeDeleted = useSelector((state: RootState) => state.projectSlide).attributeDeleted;
  const attributeUpdated = useSelector((state: RootState) => state.projectSlide).attributeUpdated;
  const handleCloneTask = async () => {
    try {
      if (!task) {
        return;
      }
      setLoading(true);
      const response = await create(project.workspace_id, project.id, {
        status_id: status,
        type_id: 1,
        title: title,
        description: description,
        priority: 1,
        due: dueDate ? dueDate : undefined,
        assigns: assignee.map(a => a.id),
        attributes: attributesSelected
      });
      setLoading(false);
      if (response && response.code === API_CODE.CREATED) {
        dispatch(setTaskCreated(response.data));
        if (setOpenClone) {
          setOpenClone(false);
        }
        return;
      }
      displayMessage('error', response.error?.message);
    } catch (error) {
      setLoading(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  useEffect(() => {
    setMemberList([...project.members, project.user]);
  }, []);
  useEffect(() => {
    if (task) {
      setAttributesSelected(task.attributes);
      setTitle(task.title + ' Copy');
      setDueDate(new Date(task.due));
      setAssignee(task.assign);
      setStatus(task.status.id);
      setTaskId(task.id);
      setDescription(task.description);
    }
  }, [task, openClone]);
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
  return <>
    <div className="row mt-4">
      <div className="col-12">
        <Input type="text" value={title} placeholder={t('tasks.task_title_default')} onChange={(e) => setTitle (e.target.value)} />
      </div>
    </div>
    {memberList && <TaskAssignee className="mt-2 dropdown-assignee" projectMembers={memberList} assigneeSelected={assignee} setAssigneeSelected={setAssignee} />}
    <div className="row mt-3 due-date-row">
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
      projectId={project.id} 
      workspaceId={project.workspace_id} 
      taskId={taskId}
      attributes={projectAttributes} 
      attributesSelected={attributesSelected}
      setAttributesSelected={setAttributesSelected}
    />
    <TaskDescription description={description} setDescription={setDescription} taskId={taskId} />
    <div className="row mt-4">
      <div className="col-12">
        <Button key={2} color={loading ? 'secondary' : 'primary'} type="submit" className="float-right" disabled={loading} onClick={handleCloneTask}>
          {loading ? <Loading color="light" /> : t('btn_clone')}
        </Button>
        <Button color='default' key={1} className='mr-2 float-right' disabled={loading} onClick={setOpenClone ? () => setOpenClone (false) : undefined}>
          {t('btn_cancel')}
        </Button>
      </div>
    </div>
  </>
}
export default TaskCloneForm;