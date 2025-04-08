import DatePickerCustom from "@/common/components/DatePickerCustom";
import Dropdown from "@/common/components/Dropdown";
import DynamicIcon from "@/common/components/DynamicIcon";
import Input from "@/common/components/Input";
import SelectMultiple from "@/common/components/SelectMultiple";
import SelectSingle from "@/common/components/SelectSingle";
import Textarea from "@/common/components/Textarea";
import { ProjectAttributeType } from "@/types/project.type";
import { TaskAttributeType } from "@/types/task.type";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MenuProps } from "antd";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import TaskAttributeEdit from "./TaskAttributeEdit";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxs/store.redux";

interface TaskAttributeItemProps {
  className?: string;
  attribute: ProjectAttributeType;
  attributesSelected: TaskAttributeType[];
  taskId: number;
  projectId: number
  workspaceId: number
  setAttributesSelected: (attributesSelected: TaskAttributeType[]) => void;
}

const TaskAttributeItem: React.FC<TaskAttributeItemProps> = ({
  className,
  attribute,
  taskId,
  attributesSelected,
  workspaceId,
  projectId,
  setAttributesSelected,
}) => {
  const t = useTranslations();
  const [date, setDate] = useState<Date | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [textareaValue, setTextareaValue] = useState<string>("");
  const [singleSelectValue, setSingleSelectValue] = useState<string>("");
  const [multipleSelectValue, setMultipleSelectValue] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [attributeData, setAttributeData] = useState(attribute);
  const [attributesChildren, setAttributesChildren] = useState(attributeData.childrens);

  const handleChangeSingleSelect = (value: string) => {
    const child = attributeData.childrens.find((c) => c.id === Number(value));
    if (child) {
      setSingleSelectValue(JSON.stringify([child]));
    }
  };

  const handleChangeMultipleSelect = (value: string[]) => {
    const values = value
      .map((val) => attributeData.childrens.find((c) => c.id === Number(val)))
      .filter((child): child is typeof attributeData.childrens[0] => !!child);
    setMultipleSelectValue(JSON.stringify(values));
  };

  const updateOrAddAttribute = (newAttribute: TaskAttributeType) => {
    const existingIndex = attributesSelected.findIndex(
      (attr) => attr.attribute.id === newAttribute.id
    );

    if (existingIndex !== -1) {
      const updatedAttributes = [...attributesSelected];
      const existingAttribute = updatedAttributes[existingIndex];

      if (existingAttribute.value !== newAttribute.value) {
        updatedAttributes[existingIndex] = newAttribute;
        setAttributesSelected(updatedAttributes);
      }
    } else {
      setAttributesSelected([...attributesSelected, newAttribute]);
    }
  };

  useEffect(() => {
    const selectedAttribute = attributesSelected.find(
      (attr) => attr.attribute.id === attributeData.id && attr.task_id === taskId
    );

    if (selectedAttribute) {
      switch (attributeData.type) {
        case 1:
          setInputValue(selectedAttribute.value);
          break;
        case 2:
          setTextareaValue(selectedAttribute.value);
          break;
        case 3:
          setSingleSelectValue(selectedAttribute.value);
          break;
        case 4:
          setMultipleSelectValue(selectedAttribute.value);
          break;
        case 5:
          const newDate = selectedAttribute.value ? new Date(selectedAttribute.value) : null;
          setDate(newDate);
          break;
        default:
          break;
      }
    } else {
      setInputValue("");
      setTextareaValue("");
      setSingleSelectValue("");
      setMultipleSelectValue("");
      setDate(null);
    }
    setIsInitialized(true);
  }, [attributesSelected, attribute, taskId]);

  useEffect(() => {
    if (isInitialized) {
      updateOrAddAttribute({
        id: attributeData.id,
        task_id: taskId,
        value: inputValue,
        attribute: attribute,
      });
    }
  }, [inputValue]);

  useEffect(() => {
    if (isInitialized) {
      updateOrAddAttribute({
        id: attributeData.id,
        task_id: taskId,
        value: textareaValue,
        attribute: attribute,
      });
    }
  }, [textareaValue]);

  useEffect(() => {
    if (isInitialized) {
      updateOrAddAttribute({
        id: attributeData.id,
        task_id: taskId,
        value: singleSelectValue,
        attribute: attribute,
      });
    }
  }, [singleSelectValue]);

  useEffect(() => {
    if (isInitialized) {
      updateOrAddAttribute({
        id: attributeData.id,
        task_id: taskId,
        value: multipleSelectValue,
        attribute: attribute,
      });
    }
  }, [multipleSelectValue]);

  useEffect(() => {
    if (isInitialized) {
      const newDateValue = date ? date.toISOString() : null;
      updateOrAddAttribute({
        id: attributeData.id,
        task_id: taskId,
        value: newDateValue,
        attribute: attribute,
      });
    }
  }, [date]);

  useEffect(() => {
    setAttributeData(attribute);
    if (attribute && [3, 4].includes(attribute.type)) {
      setAttributesChildren(attribute.childrens);
    }
  }, [attribute]);

  return (
    <div className={`row ${className ?? ""}`}>
      <div className="col-lg-3 col-12 text-secondary pointer">
        <TaskAttributeEdit projectId={projectId} workspaceId={workspaceId} attribute={attribute} />
      </div>
      <div className="col-lg-9 col-12 attribute-item-value">
        {attributeData.type === 1 && (
          <Input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={t('empty_label')} />
        )}
        {attributeData.type === 2 && (
          <Textarea rows={3} value={textareaValue} onChange={(e) => setTextareaValue(e.target.value)} placeholder={t('empty_label')} />
        )}
        {attributeData.type === 3 && (
          <SelectSingle
            options={attributesChildren.map((child) => ({
              value: child.id,
              label: <div>
                {child.icon && <DynamicIcon iconName={child.icon} style={{ color: child.color ?? '#3333', marginRight: 5 }} />} {child.value}
              </div>
            }))}
            handleChange={handleChangeSingleSelect}
            value={singleSelectValue ? JSON.parse(singleSelectValue)[0]?.id : undefined}
            placeholder={t('empty_label')}
          />
        )}
        {attributeData.type === 4 && (
          <SelectMultiple
            options={attributesChildren.map((child) => ({
              value: child.id,
              label: (
                <div style={{ color: child.color }}>
                  {child.icon && <DynamicIcon iconName={child.icon} />} {child.value}
                </div>
              ),
            }))}
            handleChange={handleChangeMultipleSelect}
            values={multipleSelectValue ? JSON.parse(multipleSelectValue)?.map((item: any) => Number(item.id)) : undefined}
            placeholder={t('empty_label')}
          />
        )}
        {attributeData.type === 5 && (
          <DatePickerCustom date={date} setDate={setDate} placeholder={t('empty_label')} />
        )}
      </div>
    </div>
  );
};

export default TaskAttributeItem;