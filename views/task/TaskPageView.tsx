
"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { TaskPriorityType, TaskType, TaskTypeItem } from "@/types/task.type";
import Button from "@/common/components/Button";
import CreateTaskView from "./create/CreateTaskView";
import { ProjectTagType, ProjectType } from "@/types/project.type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faChevronLeft, faCopy, faEllipsis, faEllipsisV, faFilter, faFilterCircleXmark, faGear, faList, faPieChart, faPlus, faSearch, faSearchMinus, faSearchPlus, faSort, faSortAmountAsc, faSortAmountDesc, faTable, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import TaskBoardView from "./components/board/grib/TaskBoardView";
import { APP_LOCALSTORAGE } from "@/enums/app.enum";
import Input from "@/common/components/Input";
import TaskListView from "./components/board/list/TaskListView";
import { useSearchParams } from "next/navigation";
import TaskFilter from "./components/board/TaskFilter";
import { ResponseUserDataType } from "@/types/user.type";
import ProjectSettingView from "../project/setting/ProjectSettingView";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxs/store.redux";
import ProjectReportView from "../project/report/ProjectReportView";
import CloneProjectModal from "../project/components/CloneProjectModal";
import { useTranslations } from "next-intl";
import { Button as ButtonAnt, Dropdown, MenuProps, Space } from 'antd';

interface TaskPageViewProps {
  project: ProjectType
}

export const maxTaskShowFilter = 10;

const TaskPageView: React.FC<TaskPageViewProps> = ({ project }) => {
  const [typeShow, setTypeShow] = useState(1);
  const [openCreate, setOpenCreate] = useState(false);
  const [taskData, setTaskData] = useState<TaskType>();
  const [inputStatusCreate, setInputStatusCreate] = useState<ProjectTagType>();
  const [keyword, setKeyword] = useState<string>('');
  const [debounceKeyword, setDebounceKeyword] = useState<string>('');
  const [openFilter, setOpenFilter] = useState(false);

  const [assignee, setAssignee] = useState<ResponseUserDataType[]>([]);
  const [creator, setCreator] = useState<ResponseUserDataType[]>([]);
  const [priority, setPriority] = useState<TaskPriorityType[]>([]);
  const [tags, setTags] = useState<ProjectTagType[]>([]);
  const [type, setType] = useState<TaskTypeItem[]>([]);
  const [openSearch, setOpenSearch] = useState(false);
  const [totalTask, setTotalTask] = useState<number>(0);
  const [isSetting, setIsSetting] = useState<boolean>();
  const [prioritySort, setPrioritySort] = useState<"DESC" | "ASC">();
  const [dueSort, setDueSort] = useState<"DESC" | "ASC">();
  const [openSort, setOpenSort] = useState(false);
  const [dueDateFilter, setDueDateFilter] = useState<Date[]>();
  const [createdDateFilter, setCreatedDateFilter] = useState<Date[]>();
  const [openClone, setOpenClone] = useState(false);
  const [isFilter, setIsFilter] = useState(false);

  const searchParams = useSearchParams();
  const createParam = searchParams.get('create');
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const t = useTranslations();
  const handleSetTypeShow = (type: number) => {
    setTypeShow(type);
    localStorage.setItem(APP_LOCALSTORAGE.TASK_BOARD_TYPE_SHOW, type.toString());
  }
  const handleChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setKeyword('');
    if (event.target.value && event.target.value !== '') {
      setKeyword(event.target.value);
    }
  }
  const handleSelectFilter = (sortField: "priority" | "due", sortType: "DESC" | "ASC") => {
    setPrioritySort(undefined);
    setDueSort(undefined);
    if (sortField === 'priority') {
      setPrioritySort(sortType);
    }
    if (sortField === 'due') {
      setDueSort(sortType);
    }
  }
  const handleCancelSort = () => {
    setPrioritySort(undefined);
    setDueSort(undefined);
    setOpenSort(false);
  }
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceKeyword(keyword);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);
  useEffect(() => {
    const typeShowStorage = localStorage.getItem(APP_LOCALSTORAGE.TASK_BOARD_TYPE_SHOW);
    if (typeShowStorage) {
      setTypeShow(Number(typeShowStorage));
    }
  }, []);
  useEffect(() => {
    if (userLogged) {
      setIsSetting(project.user_id === userLogged.id);
    }
  }, [userLogged]);
  useEffect(() => {
    if (createParam) {
      setOpenCreate(true);
      const url = new URL(window.location.href);
      const searchParams = url.searchParams;
      searchParams.delete("create");
      window.history.replaceState({}, '', url.toString());
    }
  }, [createParam]);
  const items: MenuProps['items'] = [
    {
      key: 'priority_sort_asc',
      label: (
        <div className="text-secondary" onClick={() => handleSelectFilter ('priority', "ASC")}>
          <FontAwesomeIcon icon={faSortAmountAsc} /> {t('tasks.priority_sort')}
        </div>
      ),
    },
    {
      key: 'priority_sort_desc',
      label: (
        <div className="text-secondary" onClick={() => handleSelectFilter ('priority', "DESC")}>
          <FontAwesomeIcon icon={faSortAmountDesc} /> {t('tasks.priority_sort')}
        </div>
      ),
    },
    {
      key: 'due_sort_asc',
      label: (
        <div className="text-secondary" onClick={() => handleSelectFilter ('due', "ASC")}>
          <FontAwesomeIcon icon={faSortAmountAsc} /> {t('tasks.due_sort')}
        </div>
      ),
    },
    {
      key: 'due_sort_desc',
      label: (
        <div className="text-secondary" onClick={() => handleSelectFilter ('due', "DESC")}>
          <FontAwesomeIcon icon={faSortAmountDesc} /> {t('tasks.due_sort')}
        </div>
      ),
    },
  ];

  const itemsMenu: MenuProps['items'] = [
    {
      key: 'setting',
      disabled: typeShow === 3,
      label: (
        <div onClick={() => setTypeShow (3)}>
          <FontAwesomeIcon icon={faGear} className="text-secondary" /> {t('tasks.page_title_project_setting')}
        </div>
      ),
    },
    {
      key: 'clone',
      label: (
        <div onClick={() => setOpenClone (true)}>
          <FontAwesomeIcon className="text-secondary" icon={faCopy} /> {t('tasks.clone')}
        </div>
      ),
    }
  ];
  useEffect(() => {
    setIsFilter(false);
    if (
      (createdDateFilter && createdDateFilter.length > 0) ||
      (dueDateFilter && dueDateFilter.length > 0) ||
      tags.length > 0 ||
      type.length > 0 ||
      priority.length > 0 ||
      creator.length > 0 ||
      assignee.length > 0
    ) {
      setIsFilter(true);
    }
  }, [createdDateFilter, dueDateFilter, tags, type, priority, creator, assignee]);

  return <>
      <CreateTaskView 
        open={openCreate} 
        setOpen={setOpenCreate} 
        project={project} 
        inputStatus={inputStatusCreate} 
        setTaskResponse={setTaskData} 
      />
      <CloneProjectModal
        project={project}
        openModal={openClone}
        setOpenModal={setOpenClone}
      />
      <TaskFilter 
        open={openFilter} 
        setOpen={setOpenFilter} 
        project={project} 
        assignee={assignee}
        creator={creator}
        priority={priority}
        tags={tags}
        type={type}
        setType={setType}
        setTags={setTags}
        setPriority={setPriority}
        setCreator={setCreator}
        setAssignee={setAssignee}
        setDueDate={setDueDateFilter}
        setCreatedDate={setCreatedDateFilter}
      />
      <div className="row">
        <div className="col-6">
          <h3>
            {typeShow === 3 && <><FontAwesomeIcon icon={faGear} className="text-secondary" /> {t('tasks.page_title_project_setting')}</>}
            {[1, 2].includes(typeShow) && <><FontAwesomeIcon icon={faCheckSquare} className="text-success" /> {t('tasks.page_title_task')}</>}
            {typeShow === 4 && <><FontAwesomeIcon icon={faPieChart} className="text-secondary" /> {t('tasks.page_title_project_report')}</>}
          </h3>
        </div>
        <div className="col-6">
          <Dropdown menu={{ items: itemsMenu }} placement="bottomLeft" className="float-right ml-2" trigger={["click"]}>
            <Button color="default" style={{ background: '#fff' }}>
              <FontAwesomeIcon icon={faEllipsisV} />
            </Button>
          </Dropdown>
          {
            [1, 2, 3].includes(typeShow) &&
            <Button color="default" className="float-right ml-2" style={{ background: '#fff' }} onClick={() => handleSetTypeShow (4)}>
              <FontAwesomeIcon icon={faPieChart} />
            </Button>
          }
          {
            [3, 4].includes(typeShow) &&
            <Button color="default" className="float-right ml-2" style={{ background: '#fff' }} onClick={() => handleSetTypeShow (1)}>
              <FontAwesomeIcon icon={faChevronLeft} /> {t('tasks.page_title_task')}
            </Button>
          }
          {
            [1, 2].includes(typeShow) &&
            <Button
              color="primary"
              className="float-right create-btn"
              onClick={() => setOpenCreate(true)}
            >
              <FontAwesomeIcon icon={faPlus} /> {t('btn_new')}
            </Button>
          }
        </div>
      </div>
      {
        [1, 2].includes(typeShow) &&
        <div className="row mt-2 mb-2">
          <div className="col-12 col-lg-6 filter-bar">
            <Button color="secondary" className={`float-left btn-layout-type${typeShow === 1 ? '-active' : ''} create-btn mr-2`} onClick={() => handleSetTypeShow (1)}>
              <FontAwesomeIcon icon={faTable} /> {t('tasks.board')}
            </Button>
            {
              (totalTask > 0) &&
                <Button color="secondary" className={`float-left btn-layout-type${typeShow === 2 ? '-active' : ''} create-btn mr-2`} onClick={() => handleSetTypeShow (2)}>
                  <FontAwesomeIcon icon={faList} /> {t('tasks.list')}
                </Button>
            }
          </div>
          <div className="col-12 col-lg-6 filter-bar filter-bar-right">
            {
              (totalTask > maxTaskShowFilter && typeShow !== 3 && typeShow !== 4) &&
                <Button color={'default'} outline className={`create-btn btn-filter-tasks btn-no-border mr-2`} onClick={() => setOpenFilter (true)}>
                  <FontAwesomeIcon className={`text-${isFilter ? 'primary' : 'secondary'}`} icon={openFilter ? faFilterCircleXmark : faFilter} /> 
                  <span className={`ml-1 text-${isFilter ? 'primary' : 'secondary'}`}>Filter</span>
                </Button>
            }
            <Dropdown menu={{ items }} placement="bottomLeft" className="dropdown-sort" trigger={["click"]}>
              <Button color="default" className="btn-filter-tasks btn-no-border" style={{ background: '#fff', border: 'none' }}>
                <FontAwesomeIcon className="text-secondary" icon={faSort} /> 
                <span className="text-secondary ml-1">Sort</span>
              </Button>
            </Dropdown>
            <Input type="search" placeholder={t('tasks.placeholder_input_search')} onChange={handleChangeKeyword} className="input-search-tasks" />
          </div>
        </div>
      }
      
      {
        (typeShow === 1) && <TaskBoardView
          taskData={taskData}
          project={project}
          setOpenCreate={setOpenCreate}
          setInputStatusCreate={setInputStatusCreate}
          setTotalTask={setTotalTask}
          totalTask={totalTask}
          keyword={debounceKeyword}
          assignee={assignee}
          creator={creator}
          priority={priority}
          tags={tags}
          type={type}
          prioritySort={prioritySort}
          dueSort={dueSort}
          dueDateFilter={dueDateFilter}
          createdDateFilter={createdDateFilter}
        />
      }
      {
        typeShow === 2 && <TaskListView 
          project={project} 
          taskIncome={taskData} 
          keyword={debounceKeyword} 
          assignee={assignee}
          creator={creator}
          priority={priority}
          tags={tags}
          type={type}
          prioritySort={prioritySort}
          dueSort={dueSort}
          dueDateFilter={dueDateFilter}
          createdDateFilter={createdDateFilter}
        />
      }
      {
        typeShow === 3 && <ProjectSettingView project={project} />
      }
      {
        typeShow === 4 && <ProjectReportView project={project} />
      }
    </>
};

export default TaskPageView;