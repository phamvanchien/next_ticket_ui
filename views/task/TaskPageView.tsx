"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { TaskPriorityType, TaskType, TaskTypeItem } from "@/types/task.type";
import Button from "@/common/components/Button";
import CreateTaskView from "./create/CreateTaskView";
import { ProjectTagType, ProjectType } from "@/types/project.type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faCopy, faFilter, faFilterCircleXmark, faGear, faList, faPieChart, faPlus, faSearchMinus, faSearchPlus, faSort, faSortAmountAsc, faSortAmountDesc, faTable, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
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

  const searchParams = useSearchParams();
  const createParam = searchParams.get('create');
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
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
        <div className="col-12">
          <h3>
            {typeShow === 3 && <><FontAwesomeIcon icon={faGear} className="text-secondary" /> Project setting</>}
            {[1, 2].includes(typeShow) && <><FontAwesomeIcon icon={faCheckSquare} className="text-secondary" /> Tasks</>}
            {typeShow === 4 && <><FontAwesomeIcon icon={faPieChart} className="text-secondary" /> Project report</>}
          </h3>
          {
            (isSetting && typeShow !== 3) &&
            <Button color="secondary" className="btn-no-border" outline onClick={() => setTypeShow (3)}>
              <FontAwesomeIcon icon={faGear} /> Settings
            </Button>
          }
          {
            (typeShow !== 4 && totalTask > 1) &&
            <Button color="secondary" className="btn-no-border" outline onClick={() => setTypeShow (4)}>
              <FontAwesomeIcon icon={faPieChart} /> Reports
            </Button>
          }
          <Button color="secondary" className="btn-no-border" outline onClick={() => setOpenClone (true)}>
            <FontAwesomeIcon icon={faCopy} /> Clone
          </Button>
        </div>
      </div>
      <div className="row mt-2 mb-2">
        <div className="col-12 filter-bar">
          <Button color="secondary" className={`float-left btn-layout-type${typeShow === 1 ? '-active' : ''} create-btn mr-2`} onClick={() => handleSetTypeShow (1)}>
            <FontAwesomeIcon icon={faTable} /> Board
          </Button>
          {
            (totalTask > 0) &&
              <Button color="secondary" className={`float-left btn-layout-type${typeShow === 2 ? '-active' : ''} create-btn mr-2`} onClick={() => handleSetTypeShow (2)}>
                <FontAwesomeIcon icon={faList} /> List
              </Button>
          }
          {
            (totalTask > maxTaskShowFilter && typeShow !== 3 && typeShow !== 4) &&
              <>
              <Button color="secondary" outline className="float-left create-btn btn-no-border mr-2" onClick={() => setOpenFilter (true)}>
                <FontAwesomeIcon icon={openFilter ? faFilterCircleXmark : faFilter} />
              </Button>
              {
                !openSort &&
                <Button color="secondary" outline className="float-left btn-no-border create-btn mr-2" onClick={() => setOpenSort (true)}>
                  <FontAwesomeIcon icon={faSort} />
                </Button>
              }
              </>
          }
          {
            (totalTask > maxTaskShowFilter && typeShow !== 3 && typeShow !== 4) && 
            <Button color="secondary" outline className="float-left btn-no-border create-btn mr-2" onClick={() => setOpenSearch (openSearch ? false : true)}>
              <FontAwesomeIcon icon={openSearch ? faSearchMinus : faSearchPlus} />
            </Button>
          }
          {
            (typeShow !== 3 && typeShow !== 4) &&
            <Button
              color="primary"
              className="float-right create-btn"
              onClick={() => setOpenCreate(true)}
            >
              New <FontAwesomeIcon icon={faPlus} />
            </Button>
          }
        </div>
        {
          (openSort && [1, 2].includes(typeShow)) &&
          <div className="col-12 mt-2">
            <Button color="secondary" className="float-left create-btn mr-2" outline={prioritySort !== 'ASC'} onClick={() => handleSelectFilter ('priority', "ASC")}>
              <FontAwesomeIcon icon={faSortAmountAsc} /> Priority
            </Button>
            <Button color="secondary" className="float-left create-btn mr-2" outline={prioritySort !== 'DESC'} onClick={() => handleSelectFilter ('priority', "DESC")}>
              <FontAwesomeIcon icon={faSortAmountDesc} /> Priority
            </Button>
            <Button color="secondary" className="float-left create-btn mr-2" outline={dueSort !== 'ASC'} onClick={() => handleSelectFilter ('due', 'ASC')}>
              <FontAwesomeIcon icon={faSortAmountAsc} /> Due
            </Button>
            <Button color="secondary" className="float-left create-btn mr-2" outline={dueSort !== 'DESC'} onClick={() => handleSelectFilter ('due', 'DESC')}>
              <FontAwesomeIcon icon={faSortAmountDesc} /> Due
            </Button>
            <FontAwesomeIcon icon={faTimesCircle} className="text-muted" style={{ fontSize: 20, marginTop: 5 }} onClick={handleCancelSort} />
          </div>
        }
        {
          (openSearch && typeShow !== 3 && typeShow !== 4) &&
          <div className="col-12 col-lg-3 mt-2">
            <Input 
              type="search" 
              className="input-search-tasks" 
              placeholder="Search tasks" 
              onChange={handleChangeKeyword} 
            />
          </div>
        }
      </div>
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