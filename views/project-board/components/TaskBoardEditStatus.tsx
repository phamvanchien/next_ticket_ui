import { removeStatus, updateStatus } from "@/api/project.api";
import Button from "@/common/components/Button";
import Dropdown from "@/common/components/Dropdown";
import Input from "@/common/components/Input";
import Loading from "@/common/components/Loading";
import Modal from "@/common/components/Modal";
import SelectSingle from "@/common/components/SelectSingle";
import { API_CODE } from "@/enums/api.enum";
import { setStatusDeletedId, setStatusUpdated } from "@/reduxs/project.redux";
import { useAppDispatch } from "@/reduxs/store.redux";
import { BaseResponseType } from "@/types/base.type";
import { ProjectStatusType } from "@/types/project.type";
import { colorRange, displayMessage } from "@/utils/helper.util";
import { faEllipsisV, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MenuProps } from "antd";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

interface TaskBoardEditStatusProps {
  status: ProjectStatusType
  workspaceId: number
  projectId: number
}

const TaskBoardEditStatus: React.FC<TaskBoardEditStatusProps> = ({ status, workspaceId, projectId }) => {
  const [name, setName] = useState<string>(status.name);
  const [color, setColor] = useState<string>(status.color);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const handleUpdateStatus = async () => {
    try {
      if (!name || !color) {
        return;
      }
      setEditLoading(true);
      const response = await updateStatus(workspaceId, projectId, status.id, {
        name: name,
        color: color
      });
      setEditLoading(false);
      if (response && response.code === API_CODE.OK) {
        dispatch(setStatusUpdated(response.data))
        setIsDropdownOpen(false);
        return;
      }
      displayMessage('error', response.error?.message);
    } catch (error) {
      setEditLoading(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  const handleDeleteStatus = async () => {
    try {
      setDeleteLoading(true);
      const response = await removeStatus(workspaceId, projectId, status.id);
      setDeleteLoading(false);
      if (response && response.code === API_CODE.OK) {
        dispatch(setStatusDeletedId(status.id));
        setIsDropdownOpen(false);
        setConfirmDelete(false);
        return;
      }
    } catch (error) {
      setDeleteLoading(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  const menuEditStatus: MenuProps["items"] = [
    {
      key: 1,
      label: (
        <div>
          <Input 
            type="text" 
            value={name} 
            maxLength={50} 
            placeholder={t('project_setting.placeholder_input_status')} 
            onClick={(e) => e.stopPropagation()} 
            onChange={(e) => setName (e.target.value)}
          />
        </div>
      )
    },
    {
      key: 2,
      label: (
        <div>
          <SelectSingle
            onClick={(e) => e.stopPropagation()}
            className="w-100 me-2 flex-grow-1"
            options={colorRange().map((color) => ({
              value: color.code,
              label: (
                <div style={{ background: color.code, height: 20 }}></div>
              ),
            }))}
            handleChange={(value) => setColor (value)}
            placeholder={t("select_color")}
            defaultValue={color}
          />
        </div>
      )
    },
    {
      key: 3,
      label: (
        <Button color={editLoading ? 'secondary' : 'primary'} className="w-100" disabled={editLoading} onClick={(e) =>{ e.stopPropagation(); handleUpdateStatus();}}>
          {editLoading ? <Loading color="light" /> : t('btn_save')}
        </Button>
      )
    },
    {
      key: 4,
      label: (
        <Button color={'default'} outline className="w-100 text-danger" disabled={editLoading} onClick={(e) =>{ e.stopPropagation(); setConfirmDelete(true);}}>
          <FontAwesomeIcon icon={faTrashAlt} /> {t('btn_delete')}
        </Button>
      )
    }
  ];
  return (
    <div className="float-right m-unset pointer">
      <Dropdown items={menuEditStatus} classButton="p-r-unset" isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen}>
        <FontAwesomeIcon icon={faEllipsisV} />
      </Dropdown>
      <Modal 
        title={t('project_setting.message_delete_status')}
        open={confirmDelete} 
        setOpen={setConfirmDelete}
        footerBtn={[
          <Button color="default" key="cancel"className="mr-2" onClick={(e) => {e.stopPropagation();setConfirmDelete (false)}} disabled={deleteLoading}>
            {t("btn_cancel")}
          </Button>,
          <Button color={deleteLoading ? 'secondary' : 'primary'} key="save" type="submit" disabled={deleteLoading} onClick={handleDeleteStatus}>
            {deleteLoading ? <Loading color="light" /> : t("btn_delete")}
          </Button>
        ]}
      >
        <div className="row"></div>
      </Modal>
    </div>
  )
}
export default TaskBoardEditStatus;