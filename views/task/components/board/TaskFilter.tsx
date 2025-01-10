import { ProjectType, ResponseTagType } from "@/types/project.type";
import { ResponseUserDataType } from "@/types/user.type";
import React, { MouseEvent, useEffect, useRef, useState } from "react";
import TaskAssignee from "../../detail/components/TaskAssignee";
import { TaskPriorityType, TaskTypeItem } from "@/types/task.type";
import TaskPriorityFilter from "./TaskPriorityFilter";
import TaskTag from "../../detail/components/TaskTag";
import TaskTypeList from "../../detail/components/TaskTypeList";
import TaskTypeFilter from "./TaskTypeFilter";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowRight, faCalendar, faTimes, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import DateInput from "@/common/components/DateInput";
import DateBox from "@/common/components/DateBox";

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
  tags: ResponseTagType[]
  setTags: (tags: ResponseTagType[]) => void,
  type: TaskTypeItem[]
  setType: (type: TaskTypeItem[]) => void,
  setDueDate: (dueDate?: Date[]) => void
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
  setDueDate
}) => {
  const [dueDateFilterFrom, setDueDateFilterFrom] = useState<Date | null>(null);
  const [dueDateFilterTo, setDueDateFilterTo] = useState<Date | null>(null);
  const taskDivRef = useRef<HTMLDivElement>(null);
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
  }, [dueDateFilterFrom, dueDateFilterTo])
  return <>
    <div id="wrapper" ref={taskDivRef}>
      <div id="sidebar-wrapper" className={open ? 'open-filter' : 'close-sidebar'} style={
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
              Clear filter
            </Link>
          </div>
        </div>
        <TaskAssignee project={project} assignee={creator} setAssignee={setCreator} label="Creator" />
        <TaskAssignee project={project} assignee={assignee} setAssignee={setAssignee} />
        <TaskPriorityFilter priority={priority} setPriority={setPriority} />
        <TaskTag tags={tags} setTags={setTags} projectId={project.id} />
        <TaskTypeFilter type={type} setType={setType} />
        <div className="row mt-4 text-muted">
          <div className="col-12 mb-2">
            <FontAwesomeIcon icon={faCalendar} /> Due:
          </div>
          <div className="col-3">
            <DateInput selected={dueDateFilterTo} setSelected={setDueDateFilterTo} id="dueDateTo" className="float-left" placeholder="Due date from" />
          </div>
          <div className="col-3">
            <DateInput selected={dueDateFilterFrom} setSelected={setDueDateFilterFrom} id="dueDateFrom" className="float-left" placeholder="Due date to" />
          </div>
        </div>
      </div>
    </div>
  </>
}
export default TaskFilter;