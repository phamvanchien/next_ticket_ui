import { createStatus } from "@/api/project.api";
import Button from "@/common/components/Button";
import Dropdown from "@/common/components/Dropdown";
import Input from "@/common/components/Input";
import Loading from "@/common/components/Loading";
import SelectSingle from "@/common/components/SelectSingle";
import { API_CODE } from "@/enums/api.enum";
import { setStatusCreated } from "@/reduxs/project.redux";
import { useAppDispatch } from "@/reduxs/store.redux";
import { BaseResponseType } from "@/types/base.type";
import { colorRange, displayMessage } from "@/utils/helper.util";
import { faCircle, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MenuProps } from "antd";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

interface TaskBoardCreateStatusProps {
  workspaceId: number
  projectId: number
}

const TaskBoardCreateStatus: React.FC<TaskBoardCreateStatusProps> = ({ workspaceId, projectId }) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>();
  const [category, setCategory] = useState<number>();
  const [color, setColor] = useState<string>();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [createLoading, setCreateLoading] = useState(false);
  const handleCreateStatus = async () => {
    try {
      if (!name || !category || !color) {
        return;
      }
      setCreateLoading(true);
      const response = await createStatus(workspaceId, projectId, {
        name: name,
        color: color,
        category_id: category
      });
      setCreateLoading(false);
      if (response && response.code === API_CODE.CREATED) {
        dispatch(setStatusCreated(response.data));
        setName(undefined);
        setColor(undefined);
        setCategory(1);
        setIsDropdownOpen(false);
        return;
      }
      displayMessage('error', response.error?.message);
    } catch (error) {
      setCreateLoading(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  const menuCreateStatus: MenuProps["items"] = [
    {
      key: 1,
      label: (
        <div>
          <Input 
            type="text" 
            value={name}
            placeholder={t('project_setting.placeholder_input_status')} 
            onClick={(e) => e.stopPropagation()} 
            onChange={(e) => setName (e.target.value)}
            maxLength={50}
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
            options={[
              {
                value: 1,
                label: (
                  <div>
                    <FontAwesomeIcon icon={faCircle} style={{ color: '#feb272' }} /> To Do
                  </div>
                )
              },
              {
                value: 2,
                label: (
                  <div>
                    <FontAwesomeIcon icon={faCircle} style={{ color: '#6ea8fe' }} /> In Progress
                  </div>
                )
              },
              {
                value: 3,
                label: (
                  <div>
                    <FontAwesomeIcon icon={faCircle} style={{ color: '#75b798' }} /> Done
                  </div>
                )
              }
            ]}
            handleChange={(value) => setCategory (Number(value))}
            placeholder={t("select_category")}
          />
        </div>
      )
    },
    {
      key: 3,
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
          />
        </div>
      )
    },
    {
      key: 4,
      label: (
        <Button color={createLoading ? 'secondary' : 'primary'} className="w-100" disabled={createLoading} onClick={(e) =>{ e.stopPropagation(); handleCreateStatus();}}>
          {createLoading ? <Loading color="light" /> : t('btn_create')}
        </Button>
      )
    }
  ];
  
  return (
    <div className={`card status-item`}>
      <Dropdown items={menuCreateStatus} setIsDropdownOpen={setIsDropdownOpen} isDropdownOpen={isDropdownOpen} classButton="w-20 btn-create-status">
        <Button color="light" className="pointer">
          <FontAwesomeIcon icon={faPlus} />
        </Button>
      </Dropdown>
    </div>
  )
}
export default TaskBoardCreateStatus;