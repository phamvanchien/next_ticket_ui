import { create, removeSubTask, subTask, update } from "@/api/task.api";
import Button from "@/common/components/Button";
import ErrorAlert from "@/common/components/ErrorAlert";
import Input from "@/common/components/Input";
import InputForm from "@/common/components/InputForm";
import Loading from "@/common/components/Loading";
import { API_CODE } from "@/enums/api.enum";
import { APP_VALIDATE_TYPE } from "@/enums/app.enum";
import { TASK_ENUM } from "@/enums/task.enum";
import { RootState } from "@/reduxs/store.redux";
import { catchError } from "@/services/base.service";
import { AppErrorType, BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
import { TaskType } from "@/types/task.type";
import { notify } from "@/utils/helper.util";
import { faPencil, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface SubTaskProps {
  task: TaskType
}

const SubTask: React.FC<SubTaskProps> = ({ task }) => {
  const defaultPagesize = 7;
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const t = useTranslations();
  const [openCreate, setOpenCreate] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [validateError, setValidateError] = useState<AppErrorType[] | []>([]);
  const [subTaskTitle, setSubTaskTitle] = useState<string>();
  const [error, setError] = useState<AppErrorType | null>(null);
  const [subTaskData, setSubTaskData] = useState<ResponseWithPaginationType<TaskType[]>>();
  const [keyword, setKeyword] = useState<string>('');
  const [debounceKeyword, setDebounceKeyword] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(defaultPagesize);
  const [loadingViewMore, setLoadingViewMore] = useState(false);
  const handleViewMore = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setLoadingViewMore(true);
    setPageSize(pageSize + defaultPagesize);
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
  const handleCreateSubtask = async () => {
    try {
      if (!workspace || !subTaskTitle || subTaskTitle === '') {
        return;
      }
      setLoadingCreate(true);
      const response = await create(workspace.id, task.project_id, {
        title: subTaskTitle ?? '',
        parent_id: task.id,
        priority: task.priority.id,
        status_id: task.status.id,
        type_id: task.type.id,
        attributes: []
      });
      setLoadingCreate(false);
      setError(null);
      if (response && response.code === API_CODE.CREATED) {
        setSubTaskTitle('');
        const subtaskInput = document.getElementById('subTaskName') as HTMLInputElement;
        if (subtaskInput) {
          subtaskInput.value = "";
        }
        loadSubTasks();
        return;
      }
      setError(catchError(response));
    } catch (error) {
      setLoadingCreate(false);
      setError(catchError(error as BaseResponseType));
    }
  }
  const loadSubTasks = async () => {
    try {
      if (!workspace) {
        return;
      }
      const response = await subTask(workspace.id, task.project_id, task.id, {
        page: 1,
        size: pageSize,
        keyword: keyword
      });
      if (response && response.code === API_CODE.OK) {
        setSubTaskData(response.data);
        return;
      }
      setSubTaskData(undefined);
    } catch (error) {
      setSubTaskData(undefined);
    }
  }
  const completeSubtask = async (taskId: number, checked: boolean) => {
    try {
      if (!workspace) {
        return;
      }
      setError(null);
      const response = await update(workspace.id, task.project_id, taskId, {
        due: checked ? new Date() : null
      });
      if (response && response.code === API_CODE.OK) {
        const taskLabel = document.getElementById(`task${taskId}`) as HTMLLabelElement;
        if (taskLabel) {
          if (checked) {
            taskLabel.classList.add('line-through');
          } else {
            taskLabel.classList.remove('line-through');
          }
        }
        return;
      }
      notify(catchError(response)?.message ?? '', 'error');
    } catch (error) {
      notify(catchError(error as BaseResponseType)?.message ?? '', 'error');
    }
  }
  const handleCheckSubtask = (event: ChangeEvent<HTMLInputElement>) => {
    completeSubtask(Number(event.target.value), event.target.checked)
  }
  const handleDeleteSubtask = async (taskId: number) => {
    try {
      if (!workspace) {
        return;
      }
      const response = await removeSubTask(workspace.id, task.project_id, taskId);
      if (response && response.code === API_CODE.OK) {
        loadSubTasks();
        return;
      }
      notify(catchError(response)?.message ?? '', 'error');
    } catch (error) {
      notify(catchError(error as BaseResponseType)?.message ?? '', 'error');
    }
  }
  useEffect(() => {
    loadSubTasks();
  }, [workspace, debounceKeyword, pageSize]);
  return <>
    <div className="row mt-4-4">
      <div className="col-12">
        <h6 className="text-muted">{t('tasks.subtask_label')}:</h6>
      </div>
      <div className="col-12">
        {
          !openCreate &&
          <span style={{cursor: 'pointer'}} className="text-secondary" onClick={() => setOpenCreate (true)}>
            <FontAwesomeIcon icon={faPlus} /> {t('tasks.add_subtask_label')}
          </span>
        }
      </div>
    </div>
    <div className="row">
      {
        openCreate &&
        <>
          {
            (error) && 
            <div className="col-12">
              <ErrorAlert error={error} />
            </div>
          }
          <div className="col-12">
            <InputForm
              className="subtask-title-create"
              id="subTaskName"
              inputType="text"
              inputPlaceholder={t('tasks.placeholder_input_subtask')}
              inputValue={subTaskTitle}
              setInputValue={setSubTaskTitle}
              error={validateError}
              setError={setValidateError}
              defaultValue={subTaskTitle}
              validates={[
                {
                  validateType: APP_VALIDATE_TYPE.REQUIRED,
                  validateMessage: t('tasks.subtask_title_required')
                }
              ]}
            />
          </div>
          <div className="col-12">
            <Button color="default" className="btn-no-border" outline disabled={loadingCreate} onClick={() => setOpenCreate (false)}>
              {t('btn_cancel')}
            </Button>
            <Button color={loadingCreate ? 'secondary' : 'primary'} className="ml-2" disabled={loadingCreate} onClick={handleCreateSubtask}>
              {loadingCreate ? <Loading color="light" /> : t('btn_save')}
            </Button>
          </div>
        </>
      }
      {
        (subTaskData && subTaskData.total > 0) &&
        <div className="col-12 mt-4">
          <Input type="search" placeholder={t('tasks.placeholder_search_subtask')} onChange={handleChangeKeyword} />
        </div>
      }
      <div className="col-12 mt-2">
        {
          subTaskData && subTaskData.items.map(task => (
            <div className="custom-control custom-checkbox mb-2" key={task.id}>
              <Input 
                type="checkbox" 
                className="custom-control-input" 
                id={`subtask${task.id}`} 
                defaultValue={task.id} 
                defaultChecked={task.due ? true : false} 
                onChange={handleCheckSubtask}
              />
              <label htmlFor={`subtask${task.id}`} className={`custom-control-label subtask-title ${task.due ? 'line-through' : ''}`} id={`task${task.id}`}>
                {task.title} 
              </label>
              {userLogged?.id === task.user.id && <FontAwesomeIcon icon={faTrash} className="text-danger ml-2" onClick={() => handleDeleteSubtask (task.id)} />}
            </div>
          ))
        }
      </div>
      {
        (subTaskData && subTaskData.total > pageSize) &&
        <div className="col-12">
          <Link href={'#'} className="text-muted" onClick={!loadingViewMore ? handleViewMore : undefined}>
            {t('btn_view_more')} {loadingViewMore && <Loading color="secondary" />}
          </Link>
        </div>
      }
    </div>
  </>
}
export default SubTask;