import { create, removeTask, update } from "@/api/task.api";
import Button from "@/common/components/Button";
import DatePickerCustom from "@/common/components/DatePickerCustom";
import Dropdown from "@/common/components/Dropdown";
import Input from "@/common/components/Input";
import Loading from "@/common/components/Loading";
import Modal from "@/common/components/Modal";
import TaskComment from "@/common/layouts/comment-form/TaskComment";
import Sidebar from "@/common/layouts/Sidebar";
import TaskAttribute from "@/common/layouts/task-form/attribute/TaskAttribute";
import TaskCheckList from "@/common/layouts/task-form/checklist/TaskCheckList";
import TaskAssignee from "@/common/layouts/task-form/TaskAssignee";
import TaskCloneForm from "@/common/layouts/task-form/TaskCloneForm";
import TaskDescription from "@/common/layouts/task-form/TaskDescription";
import TaskFile from "@/common/layouts/task-form/TaskFile";
import TaskHistory from "@/common/layouts/task-form/history/TaskHistory";
import TaskStatus from "@/common/layouts/task-form/TaskStatus";
import { API_CODE } from "@/enums/api.enum";
import { RootState, useAppDispatch } from "@/reduxs/store.redux";
import { setTaskCreated, setTaskDeleted, setTaskUpdated } from "@/reduxs/task.redux";
import { BaseResponseType } from "@/types/base.type";
import { ProjectAttributeType, ProjectType } from "@/types/project.type";
import { TaskAttributeType, TaskType } from "@/types/task.type";
import { UserType } from "@/types/user.type";
import { dateToString, displayMessage } from "@/utils/helper.util";
import { faCalendar, faClone, faComment, faEllipsisV, faExpand, faGripVertical, faHistory, faTrashAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MenuProps } from "antd";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserAvatar from "@/common/components/AvatarName";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(!!task);
  const [editLoading, setEditLoading] = useState(false);
  const [memberList, setMemberList] = useState(project.members);
  const [dueDate, setDueDate] = useState<Date | null>((task && task.due) ? new Date(task.due) : null);
  const [assignee, setAssignee] = useState<UserType[]>(task ? task.assign : []);
  const [status, setStatus] = useState<number>(task ? task.status.id : project.status[0].id);
  const [attributesSelected, setAttributesSelected] = useState<TaskAttributeType[]>([]);
  const [title, setTitle] = useState<string>(task ? task.title : '');
  const [taskId, setTaskId] = useState<number>(task ? task.id : 0);
  const [description, setDescription] = useState<string>('');
  const [projectAttributes, setProjectAttributes] = useState<ProjectAttributeType[]>(project.attributes);
  const [openDelete, setOpenDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [openClone, setOpenClone] = useState(false);
  const [activityLayout, setActivityLayout] = useState(1);
  const attributeCreated = useSelector((state: RootState) => state.projectSlide).attributeCreated;
  const attributeDeleted = useSelector((state: RootState) => state.projectSlide).attributeDeleted;
  const attributeUpdated = useSelector((state: RootState) => state.projectSlide).attributeUpdated;
  const handleSaveTask = async () => {
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
        due: dueDate ?? null,
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
  const handleDeleteTask = async () => {
    try {
      if (!task) {
        return;
      }
      setLoadingDelete(true);
      const response = await removeTask(task.workspace_id, task.project_id, task.id);
      if (response && response.code === API_CODE.OK) {
        dispatch(setTaskDeleted(task));
        setOpenDelete(false);
        setOpenModal(undefined);
        return;
      }
      setLoadingDelete(false);
      displayMessage('error', response.error?.message);
    } catch (error) {
      setLoadingDelete(false);
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
      setDueDate(task.due ? new Date(task.due) : null);
      setAssignee(task.assign);
      setStatus(task.status.id);
      setTaskId(task.id);
      setDescription(task.description);
    }
  }, [task]);
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
  const items: MenuProps['items'] = [
    {
      key: 1,
      label: (
        <div className="text-secondary" onClick={() => setOpenClone (true)}>
          <FontAwesomeIcon icon={faClone} /> {t('common.btn_clone')}
        </div>
      ),
    },
    {
      key: 2,
      label: (
        <div className="text-danger" onClick={() => setOpenDelete (true)}>
          <FontAwesomeIcon icon={faTrashAlt} /> {t('common.btn_move_to_trash')}
        </div>
      ),
    }
  ];
  return (
    <Sidebar 
      open={open}
      width={1000}
      setOpen={setOpen}
      headerElement={
        <>
        <Dropdown items={items} className="float-right">
          <Button color="default" className="menu-property-task">
            <FontAwesomeIcon icon={faEllipsisV} />
          </Button>
        </Dropdown>
        <Button color={'default'} className="float-right m-r-5 d-md-block d-none" disabled={editLoading} onClick={() => router.push(`/workspace/${task?.workspace_id}/project/${task?.project_id}/task/${task?.id}`)}>
          <FontAwesomeIcon icon={faExpand} />
        </Button>
        <Button color={editLoading ? 'secondary' : 'primary'} className="float-right m-r-5" onClick={handleSaveTask} disabled={editLoading}>
          {editLoading ? <Loading color="light" /> : t('common.btn_save')}
        </Button>
        </>
      }
    >
      <div className="row">
        <div className="col-12">
          <Input type="text" value={title} classInput="task-title-input" placeholder={t('tasks_page.create.task_title_default')} onChange={(e) => setTitle (e.target.value)} />
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-lg-3 col-12 mt-2 text-secondary">
          <FontAwesomeIcon icon={faUser} /> {t('projects_page.created_by_text')}:
        </div>
        <div className="col-12 col-lg-9 mt-2">
          <UserAvatar avatar={task?.user.avatar} name={task?.user.first_name ?? 'U'} /> {task?.user.first_name} {task?.user.last_name} - <i>{dateToString(new Date(task?.created_at ?? ''), '/', true)}</i>
        </div>
      </div>

      <TaskAssignee className="mt-3 dropdown-assignee" projectMembers={memberList} assigneeSelected={assignee} setAssigneeSelected={setAssignee} />
      <div className="row mt-3 due-date-row">
        <div className="col-4 col-lg-3 text-secondary">
          <FontAwesomeIcon icon={faCalendar} /> {t('tasks_page.placeholder_due_date')}:
        </div>
        <div className="col-8 col-lg-9">
          <DatePickerCustom className="duedate-task" setDate={setDueDate} date={dueDate} />
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
        createBtn
        setAttributesSelected={setAttributesSelected}
      />
      <TaskFile className="mt-3" task={task} />
      <TaskCheckList className="mt-4" task={task} />
      <TaskDescription description={description} setDescription={setDescription} taskId={taskId} />
      <div className="row mt-3">
        <div className="col-12">
          <ul className="board-menu">
            <li className={`board-menu-item ${activityLayout === 1 ? 'active' : ''}`} onClick={() => setActivityLayout (1)}>
              <FontAwesomeIcon icon={faComment} style={{ marginRight: 5 }} /> {t('tasks_page.comment.comment_title')}
            </li>
            <li className={`board-menu-item ${activityLayout === 2 ? 'active' : ''}`} onClick={() => setActivityLayout (2)}>
              <FontAwesomeIcon icon={faHistory} style={{ marginRight: 5 }} /> {t('tasks_page.history_label')}
            </li>
          </ul>
        </div>
      </div>
      {activityLayout === 1 && <TaskComment className="mt-2" task={task} />}
      {activityLayout === 2 && <TaskHistory task={task} />}
      <Modal 
        open={openDelete} 
        title={t('tasks_page.delete_task_message')}
        footerBtn={[
          <Button color='default' key={1} onClick={() => setOpenDelete (false)} className='mr-2' disabled={loadingDelete}>
            {t('common.btn_cancel')}
          </Button>,
          <Button key={2} color={loadingDelete ? 'secondary' : 'primary'} type="submit" disabled={loadingDelete} onClick={handleDeleteTask}>
            {loadingDelete ? <Loading color="light" /> : t('common.btn_delete')}
          </Button>
        ]
        }
        setOpen={setOpenDelete} 
      >
        <div className="row"></div>
      </Modal>
      <Modal 
        open={openClone} 
        title={t('tasks_page.clone_task_message')}
        footerBtn={[]}
        setOpen={setOpenClone} 
      >
        <TaskCloneForm task={task} project={project} openClone={openClone} setOpenClone={setOpenClone} />
      </Modal>
    </Sidebar>
  )
}
export default TaskEdit;