"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { TaskPriorityType, TaskType, TaskTypeItem } from "@/types/task.type";
import Button from "@/common/components/Button";
import CreateTaskView from "./create/CreateTaskView";
import { ProjectType, ResponseTagType } from "@/types/project.type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faFilter, faFilterCircleXmark, faGear, faList, faPlus, faSearch, faTable } from "@fortawesome/free-solid-svg-icons";
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

interface TaskPageViewProps {
  project: ProjectType
}

export const maxTaskShowFilter = 10;

const TaskPageView: React.FC<TaskPageViewProps> = ({ project }) => {
  const [typeShow, setTypeShow] = useState(1);
  const [openCreate, setOpenCreate] = useState(false);
  const [taskData, setTaskData] = useState<TaskType>();
  const [inputStatusCreate, setInputStatusCreate] = useState<ResponseTagType>();
  const [keyword, setKeyword] = useState<string>('');
  const [debounceKeyword, setDebounceKeyword] = useState<string>('');
  const [openFilter, setOpenFilter] = useState(false);

  const [assignee, setAssignee] = useState<ResponseUserDataType[]>([]);
  const [creator, setCreator] = useState<ResponseUserDataType[]>([]);
  const [priority, setPriority] = useState<TaskPriorityType[]>([]);
  const [tags, setTags] = useState<ResponseTagType[]>([]);
  const [type, setType] = useState<TaskTypeItem[]>([]);
  const [openSearch, setOpenSearch] = useState(false);
  const [totalTask, setTotalTask] = useState<number>(0);

  const [isSetting, setIsSetting] = useState<boolean>();

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
      />
      <div className="row">
        <div className="col-12">
          <h3>
            {
              typeShow === 3 ? <><FontAwesomeIcon icon={faGear} className="text-secondary" /> Project setting</> :
              <><FontAwesomeIcon icon={faCheckSquare} className="text-success" /> Tasks</>
            }
          </h3>
        </div>
      </div>
      <div className="row mt-2 mb-2">
        <div className="col-12 filter-bar">
          <Button color="secondary" outline={!(typeShow === 1)} className="float-left create-btn mr-2" onClick={() => handleSetTypeShow (1)}>
            <FontAwesomeIcon icon={faTable} />
          </Button>
          {
            (totalTask > 0) &&
              <Button color="secondary" outline={!(typeShow === 2)} className="float-left create-btn mr-2" onClick={() => handleSetTypeShow (2)}>
                <FontAwesomeIcon icon={faList} />
              </Button>
          }
          {
            isSetting &&
            <Button color="secondary" outline={!(typeShow === 3)} className="float-left create-btn mr-2" onClick={() => setTypeShow (3)}>
              <FontAwesomeIcon icon={faGear} />
            </Button>
          }
          {
            (totalTask > maxTaskShowFilter && typeShow !== 3) &&
              <Button color="secondary" outline className="float-left create-btn mr-2" onClick={() => setOpenFilter (true)}>
                <FontAwesomeIcon icon={openFilter ? faFilterCircleXmark : faFilter} />
              </Button>
          }
          {(totalTask > maxTaskShowFilter && !openSearch && typeShow !== 3) && <FontAwesomeIcon icon={faSearch} className="text-secondary" onClick={() => setOpenSearch (true)} />}
          {
            typeShow !== 3 &&
            <Button
              color="primary"
              className="float-right create-btn"
              onClick={() => setOpenCreate(true)}
            >
              New
            </Button>
          }
        </div>
        {
          (openSearch && typeShow !== 3) &&
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
          setType={setType}
          setTags={setTags}
          setPriority={setPriority}
          setCreator={setCreator}
          setAssignee={setAssignee}
        />
      }
      {
        typeShow === 3 && <ProjectSettingView project={project} />
      }
    </>
};

export default TaskPageView;