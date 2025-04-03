import { addAttribute } from "@/api/project.api";
import Button from "@/common/components/Button";
import Dropdown from "@/common/components/Dropdown";
import DynamicIcon from "@/common/components/DynamicIcon";
import Input from "@/common/components/Input";
import Loading from "@/common/components/Loading";
import SelectSingle from "@/common/components/SelectSingle";
import { ICON_CONFIG } from "@/configs/icon.config";
import { API_CODE } from "@/enums/api.enum";
import { BaseResponseType } from "@/types/base.type";
import { ProjectAttributeType } from "@/types/project.type";
import { colorRange, displayMessage } from "@/utils/helper.util";
import {
  faAlignJustify,
  faAlignLeft,
  faCalendar,
  faCaretSquareDown,
  faListUl,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MenuProps } from "antd";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

interface TaskAttributeCreateProps {
  projectId: number;
  workspaceId: number;
  setAttributeCreated: (attributeCreated: ProjectAttributeType) => void;
}

const TaskAttributeCreate: React.FC<TaskAttributeCreateProps> = ({
  workspaceId,
  projectId,
  setAttributeCreated,
}) => {
  const t = useTranslations();
  const [attributeType, setAttributeType] = useState<number>(1);
  const [attributeName, setAttributeName] = useState<string>();
  const [values, setValues] = useState<{ value: string; icon: string; color: string }[]>([{ value: "", icon: "", color: "" }]);
  const [createLoading, setCreateLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [attributeIcon, setAttributeIcon] = useState<string>();

  const handleValueChange = (index: number, field: "value" | "icon" | "color", newValue: string) => {
    const newValues = [...values];
    newValues[index][field] = newValue;
    setValues(newValues);
  };

  const addValueInput = () => {
    if (values.some((value) => value.value.trim() === "")) return;
    setValues([...values, { value: "", icon: "", color: "" }]);
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
      setCreateLoading(true);
      const response = await addAttribute(workspaceId, projectId, {
        name: attributeName,
        type: attributeType,
        value: values.filter((v) => v.value !== ""),
        icon: attributeIcon,
      });
      setCreateLoading(false);
      if (response && response.code === API_CODE.CREATED) {
        setIsDropdownOpen(false);
        setAttributeCreated(response.data);
        setAttributeName(undefined);
        setAttributeType(1);
        setValues([]);
        return;
      }
      displayMessage("error", response.error?.message);
    } catch (error) {
      setCreateLoading(false);
      displayMessage("error", (error as BaseResponseType).error?.message);
    }
  };

  const items: MenuProps["items"] = [
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
          placeholder={t('select_icon')}
        />
      ),
    },
    {
      key: 4,
      label: (
        <SelectSingle
          handleChange={(value) => setAttributeType(Number(value))}
          onClick={(e) => e.stopPropagation()}
          className="w-100"
          options={[
            { value: 1, label: <div><FontAwesomeIcon icon={faAlignLeft} /> Text</div> },
            { value: 2, label: <div><FontAwesomeIcon icon={faAlignJustify} /> Textarea</div> },
            { value: 3, label: <div><FontAwesomeIcon icon={faCaretSquareDown} /> Select</div> },
            { value: 4, label: <div><FontAwesomeIcon icon={faListUl} /> Multi select</div> },
            { value: 5, label: <div><FontAwesomeIcon icon={faCalendar} /> Date</div> },
          ]}
          defaultValue={attributeType}
        />
      ),
    },
  ];

  if (attributeType === 3 || attributeType === 4) {
    items.push({
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
                placeholder={t('tasks.enter_text_attribute_placeholder')}
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
                placeholder={t('select_icon')}
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
                placeholder={t('select_color')}
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

  items.push({
    key: 5,
    label: (
      <div className="d-flex justify-content-end mt-2">
        <Button
          color={createLoading ? "secondary" : "primary"}
          className="w-100"
          onClick={(e) => {
            e.stopPropagation();
            handleSaveAttribute();
          }}
          disabled={createLoading}
        >
          {createLoading ? <Loading color="light" /> : t("btn_save")}
        </Button>
      </div>
    ),
  });

  return (
    <div className="row mt-2">
      <div className="col-12">
        <Dropdown items={items} classButton="btn-add-property text-secondary" isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen}>
          <FontAwesomeIcon icon={faPlus} /> {t("tasks.add_property_label")}
        </Dropdown>
      </div>
    </div>
  );
};

export default TaskAttributeCreate;