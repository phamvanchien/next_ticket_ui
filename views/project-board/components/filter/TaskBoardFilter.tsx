import Button from "@/common/components/Button";
import DatePickerCustom from "@/common/components/DatePickerCustom";
import Sidebar from "@/common/layouts/Sidebar";
import TaskAssignee from "@/common/layouts/task-form/TaskAssignee";
import { ProjectAttributeType, ProjectType } from "@/types/project.type";
import { UserType } from "@/types/user.type";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import TaskStatusFilter from "./TaskStatusFilter";
import TaskAttributeFilter from "./TaskAttributeFilter";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/reduxs/store.redux";
import { setTaskFilter } from "@/reduxs/task.redux";
import { formatToTimestampString } from "@/utils/helper.util";
import Loading from "@/common/components/Loading";

interface TaskBoardFilterProps {
  project: ProjectType
  open: boolean
  loadingTaskBoard: boolean
  setOpen: (open: boolean) => void
  setLoadingTaskBoard: (loadingTaskBoard: boolean) => void
}

const TaskBoardFilter: React.FC<TaskBoardFilterProps> = ({ open, project, loadingTaskBoard, setOpen, setLoadingTaskBoard }) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const [assignee, setAssignee] = useState<UserType[]>([]);
  const [creator, setCreator] = useState<UserType[]>([]);
  const [memberList, setMemberList] = useState(project.members);
  const [dueDateFrom, setDueDateFrom] = useState<Date | null>(null);
  const [dueDateTo, setDueDateTo] = useState<Date | null>(null);
  const [createDateFrom, setCreateDateFrom] = useState<Date | null>(null);
  const [createDateTo, setCreateDateTo] = useState<Date | null>(null);
  const [statusSelected, setStatusSelected] = useState<number[]>([]);
  const [attributesSelected, setAttributesSelected] = useState<Record<number, number[]>>([]);
  const [projectAttributes, setProjectAttributes] = useState<ProjectAttributeType[]>(project.attributes.filter(a => [3, 4].includes(a.type)));
  const attributeCreated = useSelector((state: RootState) => state.projectSlide).attributeCreated;
  const attributeDeleted = useSelector((state: RootState) => state.projectSlide).attributeDeleted;
  const attributeUpdated = useSelector((state: RootState) => state.projectSlide).attributeUpdated;
  const taskFilter = useSelector((state: RootState) => state.taskSlide).taskFilter;
  useEffect(() => {
    if (attributeCreated && [3, 4].includes(attributeCreated.type)) {
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
  useEffect(() => {
    setMemberList([...memberList, project.user]);
  }, []);
  const handleSubmitFilter = () => {
    setLoadingTaskBoard(true);
    dispatch(setTaskFilter({
      assignee: assignee.map(a => a.id).join(','),
      creator: creator.map(a => a.id).join(','),
      fromCreated: createDateFrom ? formatToTimestampString(createDateFrom) : undefined,
      toCreated: createDateTo ? formatToTimestampString(createDateTo) : undefined,
      fromDue: dueDateFrom ? formatToTimestampString(dueDateFrom) : undefined,
      toDue: dueDateTo ? formatToTimestampString(dueDateTo) : undefined,
      status: statusSelected.join(','),
      attributes: Object.values(attributesSelected).flat().join(',')
    }));
    setOpen(false);
  }
  const handleClearFilter = () => {
    setAssignee([]);
    setCreator([]);
    setDueDateFrom(null);
    setDueDateTo(null);
    setCreateDateFrom(null);
    setCreateDateTo(null);
    setStatusSelected([]);
    setAttributesSelected([]);
    setOpen(false);
    if (
      (taskFilter.assignee && taskFilter.assignee.length > 0) ||
      (taskFilter.creator && taskFilter.creator.length > 0) ||
      taskFilter.fromCreated || taskFilter.toCreated ||
      taskFilter.fromDue || taskFilter.toDue ||
      (taskFilter.status && taskFilter.status.length > 0) ||
      (taskFilter.attributes && taskFilter.attributes.length > 0)
    ) {
      setLoadingTaskBoard(true);
      dispatch(setTaskFilter({
        assignee: undefined,
        creator: undefined,
        fromCreated: undefined,
        toCreated: undefined,
        fromDue: undefined,
        toDue: undefined,
        status: undefined,
        attributes: undefined
      }));
    }
  }
  return (
    <Sidebar 
      open={open}
      width={800}
      setOpen={setOpen}
      headerElement={
        <>
        {
          (assignee.length > 0 || creator.length > 0 || dueDateFrom || dueDateTo || createDateFrom || createDateTo || statusSelected.length > 0 || Object.values(attributesSelected).flat().join(',').length > 0) &&
          <Button color={'light'} disabled={loadingTaskBoard} onClick={handleClearFilter}>
            {t('tasks_page.btn_clear_filter')}
          </Button>
        }
        <Button color={loadingTaskBoard ? 'secondary' : 'primary'} style={{ marginLeft: 5 }} onClick={handleSubmitFilter} disabled={loadingTaskBoard}>
          {loadingTaskBoard ? <Loading color="light" /> : t('tasks_page.filter_label')}
        </Button>
        </>
      }
    >
      <TaskAssignee 
        assigneeSelected={assignee} 
        projectMembers={memberList} 
        setAssigneeSelected={setAssignee} 
        className="dropdown-assignee" 
        placeholder={t('common.empty_label')}
      />
      <TaskAssignee 
        label={t('tasks_page.creator_label')} 
        assigneeSelected={creator} 
        projectMembers={memberList} 
        setAssigneeSelected={setCreator} 
        className="mt-2 dropdown-assignee" 
        placeholder={t('common.empty_label')}
      />
      <div className="row mt-3">
        <div className="col-lg-3 col-12 text-secondary">
          <FontAwesomeIcon icon={faCalendar} /> {t('tasks_page.placeholder_due_date')}:
        </div>
        <div className="col-lg-9 col-12">
          <DatePickerCustom className="date-filter m-r-10" setDate={setDueDateFrom} date={dueDateFrom} />
          <DatePickerCustom className="date-filter" setDate={setDueDateTo} date={dueDateTo} />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-lg-3 col-12 text-secondary">
          <FontAwesomeIcon icon={faCalendar} /> {t('common.created_at_label')}:
        </div>
        <div className="col-lg-9 col-12">
          <DatePickerCustom className="m-r-10 date-filter" setDate={setCreateDateFrom} date={createDateFrom} />
          <DatePickerCustom className="date-filter" setDate={setCreateDateTo} date={createDateTo} />
        </div>
      </div>
      <TaskStatusFilter className="mt-3" statusList={project.status} statusSelected={statusSelected} setStatusSelected={setStatusSelected} />
      <TaskAttributeFilter 
        className="mt-3"
        attributes={projectAttributes} 
        attributesSelected={attributesSelected}
        setAttributesSelected={setAttributesSelected}
      />
    </Sidebar>
  )
}
export default TaskBoardFilter;