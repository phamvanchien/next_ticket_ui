import { ProjectTagType, ProjectType } from "@/types/project.type";
import { ResponseUserDataType } from "@/types/user.type";
import React, { MouseEvent, useEffect, useRef, useState } from "react";
import { TaskPriorityType, TaskTypeItem } from "@/types/task.type";
import TaskPriorityFilter from "./TaskPriorityFilter";
import TaskTypeFilter from "./TaskTypeFilter";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faTimes } from "@fortawesome/free-solid-svg-icons";
import DateInput from "@/common/components/DateInput";
import TaskAssignSelect from "../select/TaskAssignSelect";
import TaskTagSelect from "../select/TaskTagSelect";
import { useTranslations } from "next-intl";

interface TaskFilterProps {
  open: boolean
  setOpen: (open: boolean) => void
  project: ProjectType
  assignee: ResponseUserDataType[]
  setAssignee: (assignee: ResponseUserDataType[]) => void
  creator: ResponseUserDataType[]
  setCreator: (creator: ResponseUserDataType[]) => void,
  priority: TaskPriorityType[]
  setPriority: (priority: TaskPriorityType[]) => void,
  tags: ProjectTagType[]
  setTags: (tags: ProjectTagType[]) => void,
  type: TaskTypeItem[]
  setType: (type: TaskTypeItem[]) => void,
  setDueDate: (dueDate?: Date[]) => void
  setCreatedDate: (dueDate?: Date[]) => void
}

const TaskFilter: React.FC<TaskFilterProps> = ({ 
  open, 
  project, 
  assignee,
  creator,
  priority,
  tags,
  type,
  setType,
  setTags,
  setPriority,
  setCreator,
  setAssignee,
  setOpen,
  setDueDate,
  setCreatedDate
}) => {
  const [dueDateFilterFrom, setDueDateFilterFrom] = useState<Date | null>(null);
  const [dueDateFilterTo, setDueDateFilterTo] = useState<Date | null>(null);
  const [createdDateFilterFrom, setCreatedDateFilterFrom] = useState<Date | null>(null);
  const [createdDateFilterTo, setCreatedDateFilterTo] = useState<Date | null>(null);
  const taskDivRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();
  const handleClose = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setOpen(false);
  }
  const handleClearFilter = () => {
    setType([]);
    setTags([]);
    setPriority([]);
    setCreator([]);
    setAssignee([]);
    handleClearDueDate();
    handleClearCreatedDate();
  }
  const handleClearCreatedDate = () => {
    setCreatedDateFilterFrom(null);
    setCreatedDateFilterTo(null);
    setCreatedDate(undefined);
  }
  const handleClearDueDate = () => {
    setDueDateFilterFrom(null);
    setDueDateFilterTo(null);
    setDueDate(undefined);
  }
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
  useEffect(() => {
    if (dueDateFilterFrom && dueDateFilterTo) {
      setDueDate([
        dueDateFilterFrom,
        dueDateFilterTo
      ]);
    }
  }, [dueDateFilterFrom, dueDateFilterTo]);
  useEffect(() => {
    if (createdDateFilterFrom && createdDateFilterTo) {
      setCreatedDate([
        createdDateFilterFrom,
        createdDateFilterTo
      ]);
    }
  }, [createdDateFilterFrom, createdDateFilterTo]);
  return <>
    <div id="wrapper" ref={taskDivRef}>
      <div id="sidebar-wrapper-next-tech" className={open ? 'open-filter' : 'close-sidebar-next-tech'} style={
        {marginRight: open ? -250 : -275}
      }>
        <div className="row mb-4">
          <div className="col-6">
            <Link className="text-secondary" href={'#'} onClick={handleClose}>
              <FontAwesomeIcon icon={faTimes} style={{ fontSize: 22 }} />
            </Link>
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-6">
            <Link className="text-primary" href={'#'} onClick={handleClearFilter}>
              {t('tasks.btn_clear_filter')}
            </Link>
          </div>
        </div>
        <TaskAssignSelect
          assignee={creator}
          setAssignee={setCreator}
          project={project}
          className="mb-2"
          label={t('tasks.creator_label')}
        />
        <TaskAssignSelect
          assignee={assignee}
          setAssignee={setAssignee}
          project={project}
          className="mb-2"
        />
        <TaskTagSelect
          tags={tags}
          projectId={project.id}
          setTags={setTags}
          className="mb-2"
        />
        <TaskPriorityFilter priority={priority} setPriority={setPriority} />
        <TaskTypeFilter type={type} setType={setType} />
        <div className="row mt-4 text-muted">
          <div className="col-12 mb-2">
            <FontAwesomeIcon icon={faCalendar} /> {t('tasks.due_label')}:
          </div>
          <div className="col-3">
            <DateInput selected={dueDateFilterTo} setSelected={setDueDateFilterTo} id="dueDateTo" className="float-left" placeholder={t('tasks.from_date_label')} />
          </div>
          <div className="col-3">
            <DateInput selected={dueDateFilterFrom} setSelected={setDueDateFilterFrom} id="dueDateFrom" className="float-left" placeholder={t('tasks.to_date_label')} />
          </div>
          {
            (dueDateFilterFrom && dueDateFilterTo) &&
            <div className="col-3">
              <FontAwesomeIcon icon={faTimes} onClick={handleClearDueDate} />
            </div>
          }
        </div>
        <div className="row mt-4 text-muted">
          <div className="col-12 mb-2">
            <FontAwesomeIcon icon={faCalendar} /> {t('tasks.created_at_label')}:
          </div>
          <div className="col-3">
            <DateInput selected={createdDateFilterTo} setSelected={setCreatedDateFilterTo} id="dueDateTo" className="float-left" placeholder={t('tasks.from_date_label')} />
          </div>
          <div className="col-3">
            <DateInput selected={createdDateFilterFrom} setSelected={setCreatedDateFilterFrom} id="dueDateFrom" className="float-left" placeholder={t('tasks.to_date_label')} />
          </div>
          {
            (createdDateFilterFrom && createdDateFilterTo) &&
            <div className="col-3">
              <FontAwesomeIcon icon={faTimes} onClick={handleClearCreatedDate} />
            </div>
          }
        </div>
      </div>
    </div>
  </>
}
export default TaskFilter;