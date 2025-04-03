import { deleteAttribute, updateAttribute } from "@/api/project.api";
import Button from "@/common/components/Button";
import Dropdown from "@/common/components/Dropdown";
import DynamicIcon from "@/common/components/DynamicIcon";
import Input from "@/common/components/Input";
import Loading from "@/common/components/Loading";
import Modal from "@/common/components/Modal";
import SelectSingle from "@/common/components/SelectSingle";
import { ICON_CONFIG } from "@/configs/icon.config";
import { API_CODE } from "@/enums/api.enum";
import { BaseResponseType } from "@/types/base.type";
import { ProjectAttributeType } from "@/types/project.type";
import { colorRange, displayMessage } from "@/utils/helper.util";
import { faCircle, faEdit, faTrash, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MenuProps } from "antd";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

interface TaskAttributeEditProps {
  attribute: ProjectAttributeType;
  projectId: number
  workspaceId: number
  setAttributeUpdated: (attributeUpdated: ProjectAttributeType) => void
  setAttributeDeleted: (attributeDeleted: boolean) => void
}

const TaskAttributeEdit: React.FC<TaskAttributeEditProps> = ({ attribute, workspaceId, projectId, setAttributeUpdated, setAttributeDeleted }) => {
  const t = useTranslations();
  const [attributeData, setAttributeData] = useState(attribute);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [attributeName, setAttributeName] = useState<string>(attributeData.name);
  const [values, setValues] = useState<{ id: number, value: string; icon: string; color: string }[]>(attributeData.childrens);
  const [editLoading, setEditLoading] = useState(false);
  const [isDropdownOpenEdit, setIsDropdownOpenEdit] = useState<boolean>(false);
  const [attributeIcon, setAttributeIcon] = useState<string>(attributeData.icon);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleValueChange = (index: number, field: "value" | "icon" | "color", newValue: string) => {
    const newValues = [...values];
    newValues[index][field] = newValue;
    setValues(newValues);
  };

  const addValueInput = () => {
    if (values.some((value) => value.value.trim() === "")) return;
    const maxId = values.length > 0 ? Math.max(...values.map((v) => v.id)) : 0;
    setValues([...values, { id: maxId + 1, value: "", icon: "", color: "" }]);
  };
  
  const removeValueInput = (index: number) => {
    const newValues = [...values];
    newValues.splice(index, 1);
    setValues(newValues);
  };

  const handleSaveAttribute = async () => {
    try {
      if (!attributeName) {
        return;
      }
      setEditLoading(true);
      const response = await updateAttribute(workspaceId, projectId, attributeData.id, {
        name: attributeName,
        icon: attributeIcon,
        value: values
      });
      setEditLoading(false);
      if (response && response.code === API_CODE.OK) {
        setAttributeUpdated(response.data);
        setAttributeData(response.data);
        setIsDropdownOpenEdit(false);
        setIsDropdownOpen(false);
        return;
      }
      displayMessage("error", response.error?.message);
    } catch (error) {
      setEditLoading(false);
      displayMessage("error", (error as BaseResponseType).error?.message);
    }
  };

  const handleClickEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(true);
    setIsDropdownOpenEdit(true);
  };

  const handleDeleteAttribute = async () => {
    try {
      setDeleteLoading(true);
      const response = await deleteAttribute(workspaceId, projectId, attributeData.id);
      setDeleteLoading(false);
      if (response && response.code === API_CODE.OK) {
        setConfirmDelete(false);
        setAttributeDeleted(true);
        return;
      }
      displayMessage("error", response.error?.message);
    } catch (error) {
      setDeleteLoading(false);
      displayMessage("error", (error as BaseResponseType).error?.message);
    }
  }

  const items: MenuProps["items"] = [
    {
      key: 1,
      label: (
        <div onClick={handleClickEdit} style={{ display: isDropdownOpenEdit ? "none" : "block" }}>
          <FontAwesomeIcon icon={faEdit} /> {t("tasks.edit_label")}
        </div>
      ),
    }
  ];

  if (!attribute.default_name) {
    items.push({
      key: 2,
      label: (
        <div onClick={() => setConfirmDelete (true)}>
          <FontAwesomeIcon icon={faTrashAlt} className="text-danger" /> {t("btn_delete")}
        </div>
      ),
    })
  }

  const itemsEdit: MenuProps["items"] = [
    {
      key: 1,
      label: (
        <Input
          type="text"
          placeholder={t("tasks.placeholder_attribute_name")}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setAttributeName(e.target.value)}
          value={attributeName}
        />
      ),
    },
    {
      key: 2,
      label: (
        <SelectSingle
          handleChange={(value) => setAttributeIcon(value)}
          onClick={(e) => e.stopPropagation()}
          className="w-100"
          options={ICON_CONFIG.LIST.map((icon) => ({
            value: icon,
            label: (
              <div>
                <DynamicIcon iconName={icon} />
              </div>
            ),
          }))}
          placeholder={t("select_icon")}
          defaultValue={attributeIcon}
        />
      ),
    },
  ];

  if ([3, 4].includes(attributeData.type)) {
    itemsEdit.push({
      key: 3,
      label: (
        <div className="value-inputs">
          {values.map((value, index) => (
            <div key={index} className="d-flex align-items-center mb-2">
              <Input
                minLength={3}
                maxLength={30}
                type="text"
                value={value.value}
                onChange={(e) => handleValueChange(index, "value", e.target.value)}
                onClick={(e) => e.stopPropagation()}
                classGroup="me-2 flex-grow-1"
                placeholder={t("tasks.enter_text_attribute_placeholder")}
              />
              <SelectSingle
                onClick={(e) => e.stopPropagation()}
                className="w-100 me-2 flex-grow-1"
                options={ICON_CONFIG.LIST.map((icon) => ({
                  value: icon,
                  label: (
                    <div>
                      <DynamicIcon iconName={icon} />
                    </div>
                  ),
                }))}
                handleChange={(icon) => handleValueChange(index, "icon", icon)}
                placeholder={t("select_icon")}
                defaultValue={value.icon}
              />
              <SelectSingle
                onClick={(e) => e.stopPropagation()}
                className="w-100 me-2 flex-grow-1"
                options={colorRange().map((color) => ({
                  value: color.code,
                  label: (
                    <div style={{ background: color.code, height: 20 }}></div>
                  ),
                }))}
                handleChange={(color) => handleValueChange(index, "color", color)}
                placeholder={t("select_color")}
                defaultValue={value.color}
              />
              <FontAwesomeIcon
                className="text-danger"
                style={{ marginLeft: 5 }}
                icon={faTrash}
                onClick={(e) => {
                  e.stopPropagation();
                  removeValueInput(index);
                }}
              />
            </div>
          ))}
          <Button
            color="default"
            onClick={(e) => {
              e.stopPropagation();
              addValueInput();
            }}
          >
            + {t("tasks.attribute_add_value_label")}
          </Button>
        </div>
      ),
    });
  }

  itemsEdit.push({
    key: 4,
    label: (
      <div className="d-flex justify-content-end mt-2">
        <Button
          color={editLoading ? "secondary" : "primary"}
          className={`me-2 w-${!attribute.default_name ? '50' : '100'}`}
          onClick={(e) => {
            e.stopPropagation();
            handleSaveAttribute();
            // setIsDropdownOpenEdit(false);
          }}
          disabled={editLoading}
        >
          {editLoading ? <Loading color="light" /> : t("btn_save")}
        </Button>
        {!attribute.default_name && <Button
          color="danger"
          outline
          className="w-50"
          disabled={editLoading}
          onClick={(e) => {e.stopPropagation();setConfirmDelete (true)}}
        >
          {t("btn_delete")}
        </Button>}
      </div>
    ),
  });

  return <>
    <Dropdown
      classButton="dropdown-attribute text-secondary"
      items={isDropdownOpenEdit ? itemsEdit : items}
      isDropdownOpen={isDropdownOpen}
      setIsDropdownOpen={setIsDropdownOpen}
    >
      {attributeData.icon ? (
        <DynamicIcon iconName={attributeData.icon} />
      ) : (
        <FontAwesomeIcon icon={faCircle} />
      )}{" "}
      {attributeData.name} <FontAwesomeIcon icon={faEdit} />
    </Dropdown>
    <Modal 
      open={confirmDelete} 
      setOpen={setConfirmDelete}
      title={t('project_setting.delete_attribute_warning')}
      footerBtn={[
        <Button color="default" key="cancel"className="mr-2" onClick={(e) => {e.stopPropagation();setConfirmDelete (false)}} disabled={deleteLoading}>
          {t("btn_cancel")}
        </Button>,
        <Button color={deleteLoading ? 'secondary' : 'primary'} key="save" type="submit" onClick={handleDeleteAttribute} disabled={deleteLoading}>
          {deleteLoading ? <Loading color="light" /> : t("btn_delete")}
        </Button>,
      ]}
    >
      <div className="row">
        <div className="col-12">
        </div>
      </div>
    </Modal>
  </>
};

export default TaskAttributeEdit;
