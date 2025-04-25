"use client"
import { project as projectDetail } from "@/api/project.api";
import { removeTask, update } from "@/api/task.api";
import UserAvatar from "@/common/components/AvatarName";
import Button from "@/common/components/Button";
import DatePickerCustom from "@/common/components/DatePickerCustom";
import Input from "@/common/components/Input";
import Loading from "@/common/components/Loading";
import RelativeTime from "@/common/components/RelativeTime";
import TaskComment from "@/common/layouts/comment-form/TaskComment";
import TaskAttribute from "@/common/layouts/task-form/attribute/TaskAttribute";
import TaskCheckList from "@/common/layouts/task-form/checklist/TaskCheckList";
import TaskHistory from "@/common/layouts/task-form/history/TaskHistory";
import TaskAssignee from "@/common/layouts/task-form/TaskAssignee";
import TaskDescription from "@/common/layouts/task-form/TaskDescription";
import TaskFile from "@/common/layouts/task-form/TaskFile";
import TaskStatus from "@/common/layouts/task-form/TaskStatus";
import { API_CODE } from "@/enums/api.enum";
import { setIsMemberProject, setIsOwnerProject } from "@/reduxs/project.redux";
import { RootState, useAppDispatch } from "@/reduxs/store.redux";
import { BaseResponseType } from "@/types/base.type";
import { ProjectAttributeType, ProjectStatusType, ProjectType } from "@/types/project.type";
import { TaskAttributeType, TaskType } from "@/types/task.type";
import { UserType } from "@/types/user.type";
import { displayMessage, displaySmallMessage } from "@/utils/helper.util";
import { faCalendar, faClone, faComment, faEllipsisV, faHistory, faList, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TaskDetailLoading from "./TaskDetailLoading";
import { MenuProps } from "antd";
import Dropdown from "@/common/components/Dropdown";
import Modal from "@/common/components/Modal";
import TaskCloneForm from "@/common/layouts/task-form/TaskCloneForm";

interface TaskDetailViewProps {
  task: TaskType
}

const TaskDetailView: React.FC<TaskDetailViewProps> = ({ task }) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const [description, setDescription] = useState<string>(task.description);
  const [activityLayout, setActivityLayout] = useState(1);
  const [editLoading, setEditLoading] = useState(false);
  const [memberList, setMemberList] = useState<UserType[]>();
  const [attributesSelected, setAttributesSelected] = useState<TaskAttributeType[]>(task.attributes);
  const [projectAttributes, setProjectAttributes] = useState<ProjectAttributeType[]>();
  const [title, setTitle] = useState<string>(task ? task.title : '');
  const [status, setStatus] = useState<number>(task.status.id);
  const [dueDate, setDueDate] = useState<Date | null>(task ? new Date(task.due) : null);
  const [assignee, setAssignee] = useState<UserType[]>(task ? task.assign : []);
  const [projectStatus, setProjectStatus] = useState<ProjectStatusType[]>();
  const [project, setProject] = useState<ProjectType>();
  const [openDelete, setOpenDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [openClone, setOpenClone] = useState(false);
  const handleDeleteTask = async () => {
    try {
      if (!task) {
        return;
      }
      setLoadingDelete(true);
      const response = await removeTask(task.workspace_id, task.project_id, task.id);
      if (response && response.code === API_CODE.OK) {
        router.push(`/workspace/${task.workspace_id}/project/${task.project_id}`);
        return;
      }
      setLoadingDelete(false);
      displayMessage('error', response.error?.message);
    } catch (error) {
      setLoadingDelete(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  const loadProject = async () => {
    try {
      const response = await projectDetail(task.workspace_id, task.project_id);
      if (response && response.code === API_CODE.OK) {
        setProject(response.data);
        return;
      }
      displaySmallMessage('error', response.error?.message);
    } catch (error) {
      displaySmallMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  const handleSaveTask = async () => {
    try {
      if (!title || !status || !task) {
        return;
      }
      setEditLoading(true);
      const response = await update(task.workspace_id, task.project_id, task.id, {
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
        return;
      }
      displayMessage('error', response.error?.message);
    } catch (error) {
      setEditLoading(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  useEffect(() => {
    loadProject();
  }, []);
  useEffect(() => {
    if (project) {
      setMemberList([...project.members, project.user]);
      setProjectAttributes(project.attributes);
      setProjectStatus(project.status);
      dispatch(setIsOwnerProject(project.is_owner));
      dispatch(
        setIsMemberProject(
          ((userLogged && project.members.find(m => m.id === userLogged.id) || project.is_owner)) ? true : false
        )
      );
    }
  }, [project]);
  if (!project) {
    return <TaskDetailLoading />
  }
  const items: MenuProps['items'] = [
    {
      key: 1,
      label: (
        <div className="text-secondary" onClick={() => setOpenClone (true)}>
          <FontAwesomeIcon icon={faClone} /> {t('btn_clone')}
        </div>
      ),
    },
    {
      key: 2,
      label: (
        <div className="text-danger" onClick={() => setOpenDelete (true)}>
          <FontAwesomeIcon icon={faTrashAlt} /> {t('btn_move_to_trash')}
        </div>
      ),
    }
  ];
  return (
    <div className="container-fluid px-3 py-3">
      <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
        <span className="w-100">
          <UserAvatar avatar={task?.user.avatar} name={task?.user.first_name ?? 'U'} /> {task?.user.first_name} {task?.user.last_name} - <RelativeTime time={task.created_at} />
        </span>
        <Button color={editLoading ? 'secondary' : 'primary'} className="float-right" onClick={handleSaveTask} disabled={editLoading}>
          {editLoading ? <Loading color="light" /> : t('btn_save')}
        </Button>
        <Button color="default" className="float-right ml-2" onClick={() => router.push(`/workspace/${task.workspace_id}/project/${task.project_id}`)}>
          <FontAwesomeIcon icon={faList} />
        </Button>
        <Dropdown items={items} className="float-right">
          <Button color="default">
            <FontAwesomeIcon icon={faEllipsisV} />
          </Button>
        </Dropdown>
      </div>
      <div className="row">
        <div className="col-12">
          <Input type="text" classInput="task-title-input" value={title} onChange={(e) => setTitle (e.target.value)} />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-8 col-12">
          <TaskFile className="mt-3" task={task} />
          <TaskCheckList className="mt-4" task={task} />
          <TaskDescription description={description} setDescription={setDescription} taskId={task.id} contentSize={1200} />
          <div className="row mt-3">
            <div className="col-12">
              <ul className="board-menu">
                <li className={`board-menu-item ${activityLayout === 1 ? 'active' : ''}`} onClick={() => setActivityLayout (1)}>
                  <FontAwesomeIcon icon={faComment} style={{ marginRight: 5 }} /> {t('tasks.comment_label')}
                </li>
                <li className={`board-menu-item ${activityLayout === 2 ? 'active' : ''}`} onClick={() => setActivityLayout (2)}>
                  <FontAwesomeIcon icon={faHistory} style={{ marginRight: 5 }} /> {t('tasks.history_label')}
                </li>
              </ul>
            </div>
          </div>
          {activityLayout === 1 && <TaskComment className="mt-2" task={task} />}
          {activityLayout === 2 && <TaskHistory task={task} />}
        </div>
        <div className="col-lg-4 col-12">
          <div className="card p-4">
            {memberList && <TaskAssignee className="dropdown-assignee" projectMembers={memberList} assigneeSelected={assignee} setAssigneeSelected={setAssignee} />}
            <div className="row mt-3 due-date-row">
              <div className="col-4 col-lg-3 text-secondary">
                <FontAwesomeIcon icon={faCalendar} /> {t('tasks.placeholder_due_date')}:
              </div>
              <div className="col-8 col-lg-9">
                <DatePickerCustom setDate={setDueDate} date={dueDate} />
              </div>
            </div>
            {projectStatus && <TaskStatus className="mt-3" statusList={projectStatus} statusSelected={status} setStatusSelected={setStatus} />}
            {
              projectAttributes &&
              <TaskAttribute 
                className="mt-3" 
                projectId={task.project_id} 
                workspaceId={task.workspace_id} 
                taskId={task.id}
                attributes={projectAttributes} 
                attributesSelected={attributesSelected}
                createBtn
                setAttributesSelected={setAttributesSelected}
              />
            }
          </div>
        </div>
      </div>
      <Modal 
        open={openDelete} 
        title={t('tasks.delete_task_message')}
        footerBtn={[
          <Button color='default' key={1} onClick={() => setOpenDelete (false)} className='mr-2' disabled={loadingDelete}>
            {t('btn_cancel')}
          </Button>,
          <Button key={2} color={loadingDelete ? 'secondary' : 'primary'} type="submit" disabled={loadingDelete} onClick={handleDeleteTask}>
            {loadingDelete ? <Loading color="light" /> : t('btn_delete')}
          </Button>
        ]
        }
        setOpen={setOpenDelete} 
      >
        <div className="row"></div>
      </Modal>
      <Modal 
        open={openClone} 
        title={t('tasks.clone_task_message')}
        footerBtn={[]}
        setOpen={setOpenClone} 
      >
        <TaskCloneForm task={task} project={project} openClone={openClone} setOpenClone={setOpenClone} />
      </Modal>
    </div>
  )
}
export default TaskDetailView;