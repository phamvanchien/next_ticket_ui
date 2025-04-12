import { removeTask, update } from "@/api/task.api";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import Loading from "@/common/components/Loading";
import { API_CODE } from "@/enums/api.enum";
import { useAppDispatch } from "@/reduxs/store.redux";
import { setSubtaskDeleted, setSubtaskDone, setSubtaskUndo } from "@/reduxs/task.redux";
import { BaseResponseType } from "@/types/base.type";
import { TaskType } from "@/types/task.type";
import { displaySmallMessage } from "@/utils/helper.util";
import { faCheck, faCheckSquare, faEdit, faSquare, faTimes, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

interface CheckListItemProps {
  checkListItem: TaskType
  setCheckListDeleted: (checkListDeleted?: number) => void
}

const CheckListItem: React.FC<CheckListItemProps> = ({ checkListItem, setCheckListDeleted }) => {
  const [checked, setChecked] = useState(checkListItem.due ? true : false);
  const [title, setTitle] = useState<string>(checkListItem.title);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const completeSubtask = async (taskId: number, checked: boolean) => {
    const checkedTask = checked;
    try {
      setChecked(true);
      const response = await update(checkListItem.workspace_id, checkListItem.project_id, taskId, {
        due: checked ? new Date() : null
      });
      if (response && response.code === API_CODE.OK) {
        setChecked(response.data.due ? true : false);
        if (response.data.due) {
          dispatch(setSubtaskDone({
            taskId: response.data.parent_id || 0,
            date: new Date().toTimeString()
          }));
        } else {
          dispatch(setSubtaskUndo({
            taskId: response.data.parent_id || 0,
            date: new Date().toTimeString()
          }));
        }
        return;
      }
      setChecked(checkedTask);
      displaySmallMessage('error', response.error?.message);
    } catch (error) {
      setChecked(checkedTask);
      displaySmallMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  const handleOpenEdit = () => {
    setOpenEdit(true);
  }
  const handleUpdateTask = async () => {
    try {
      setLoadingEdit(true);
      const response = await update(checkListItem.workspace_id, checkListItem.project_id, checkListItem.id, {
        title: title
      });
      setLoadingEdit(false);
      if (response && response.code === API_CODE.OK) {
        setTitle(response.data.title);
        setOpenEdit(false);
        return;
      }
      displaySmallMessage('error', response.error?.message);
    } catch (error) {
      setLoadingEdit(false);
      displaySmallMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  const handleDeleteTask = async () => {
    try {
      const response = await removeTask(checkListItem.workspace_id, checkListItem.project_id, checkListItem.id);
      if (response && response.code === API_CODE.OK) {
        dispatch(setSubtaskDeleted({
          taskId: checkListItem.parent_id || 0,
          date: new Date().toTimeString()
        }));
        setCheckListDeleted(checkListItem.id);
        return;
      }
      displaySmallMessage('error', response.error?.message);
    } catch (error) {
      displaySmallMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  useEffect(() => {
    setTitle(checkListItem.title);
    setChecked(checkListItem.due ? true : false);
  }, [checkListItem]);
  return <>
    {
      openEdit &&
      <div className="col-12 mt-2">
        <Input type="text" value={title} maxLength={80} placeholder={t('tasks.placeholder_input_subtask')} classGroup="mb-2 w-80 float-left" onChange={(e) => setTitle (e.target.value)} />
        <Button color="default" className="float-right w-10" onClick={() => setOpenEdit (false)} disabled={loadingEdit}>
          <FontAwesomeIcon icon={faTimes} />
        </Button>
        <Button color={loadingEdit ? 'secondary' : 'primary'} className="float-right w-10 ml-2" disabled={loadingEdit} onClick={handleUpdateTask}>
          {loadingEdit ? <Loading color="light" /> : <FontAwesomeIcon icon={faCheck} />}
        </Button>
      </div>
    }
    {
      !openEdit &&
      <div className="col-12 mt-2 checklist-item">
        <FontAwesomeIcon 
          icon={checked ? faCheckSquare : faSquare} 
          className={`text-${checked ? 'success' : 'secondary'}`} 
          size="lg"
          onClick={() => completeSubtask (checkListItem.id, checked ? false : true)}
          style={{ marginRight: 5 }}
        /> 
        <span className={checked ? 'line-through' : ''}>{title}</span>
        <span className="checklist-control">
          <FontAwesomeIcon icon={faEdit} className="text-secondary pointer" style={{ marginRight: 5, marginLeft: 7 }} onClick={handleOpenEdit} />
          <FontAwesomeIcon icon={faTrashAlt} className="text-danger pointer" onClick={handleDeleteTask} />
        </span>
      </div>
    }
  </>
}
export default CheckListItem;