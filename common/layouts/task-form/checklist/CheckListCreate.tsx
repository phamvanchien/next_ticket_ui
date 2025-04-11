import { create } from "@/api/task.api";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import Loading from "@/common/components/Loading";
import { API_CODE } from "@/enums/api.enum";
import { BaseResponseType } from "@/types/base.type";
import { TaskType } from "@/types/task.type";
import { displayMessage } from "@/utils/helper.util";
import { faCheck, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

interface CheckListCreateProps {
  openCreate: boolean
  task?: TaskType
  setOpenCreate: (openCreate: boolean) => void
  setCheckListCreated: (checkListCreated?: TaskType) => void
}

const CheckListCreate: React.FC<CheckListCreateProps> = ({ openCreate, task, setOpenCreate, setCheckListCreated }) => {
  const t = useTranslations();
  const [title, setTitle] = useState<string>();
  const [loadingCreate, setLoadingCreate] = useState(false);
  const handleCreateSubtask = async () => {
    try {
      if (!task || !title || (title && title === '')) {
        return;
      }
      setLoadingCreate(true);
      const response = await create(task.workspace_id, task.project_id, {
        title: title,
        parent_id: task.id,
        status_id: task.status.id,
        type_id: 0,
        priority: 0,
        attributes: []
      });
      setLoadingCreate(false);
      if (response && response.code === API_CODE.CREATED) {
        setCheckListCreated(response.data);
        setTitle('');
        setOpenCreate(false);
        return;
      }
      displayMessage('error', response.error?.message);
    } catch (error) {
      setLoadingCreate(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  return <>
    <span className="text-secondary pointer mb-2" onClick={() => setOpenCreate (true)}>
      <FontAwesomeIcon icon={faPlus} /> {t("tasks.add_subtask_label")}
    </span>
    {
      openCreate &&
      <div className="row mt-2">
        <div className="col-12">
          <Input type="text" value={title} maxLength={80} placeholder={t('tasks.placeholder_input_subtask')} classGroup="mb-2 w-80 float-left" onChange={(e) => setTitle (e.target.value)} />
          <Button color="default" className="float-right w-10" onClick={() => setOpenCreate (false)} disabled={loadingCreate}>
            <FontAwesomeIcon icon={faTimes} />
          </Button>
          <Button color={loadingCreate ? 'secondary' : 'primary'} className="float-right w-10 ml-2" disabled={loadingCreate} onClick={handleCreateSubtask}>
            {loadingCreate ? <Loading color="light" /> : <FontAwesomeIcon icon={faCheck} />}
          </Button>
        </div>
      </div>
    }
  </>
}
export default CheckListCreate;