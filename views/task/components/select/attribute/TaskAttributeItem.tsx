import Button from "@/common/components/Button";
import DatePickerCustom from "@/common/components/DatePickerCustom";
import Input from "@/common/components/Input";
import Textarea from "@/common/components/Textarea";
import { ProjectAttributeItemType, ProjectAttributeType } from "@/types/project.type";
import { TaskAttributeType } from "@/types/task.type";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Select } from "antd";
import { useTranslations } from "next-intl";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";

interface TaskAttributeItemProps {
  attribute: ProjectAttributeType;
  id: number;
  value: any;
  setTaskAttributes: React.Dispatch<React.SetStateAction<TaskAttributeType[]>>;
}

const TaskAttributeItem: React.FC<TaskAttributeItemProps> = ({ 
  attribute,
  id,
  value,
  setTaskAttributes
}) => {
  const [openChildrens, setOpenChildrens] = useState(false);
  const [valueSelected, setValueSelected] = useState<ProjectAttributeItemType[]>([]);
  const [textValue, setTextValue] = useState<string>("");
  const [textAreaValue, setTextAreaValue] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  const [valueFinal, setValueFinal] = useState<any>("");
  const t = useTranslations();

  const handleAddSelect = (select: ProjectAttributeItemType) => {
    if (attribute.type === 3) {
      setValueSelected([select]);
    } else if (attribute.type === 4 && !valueSelected.find(v => v.id === select.id)) {
      setValueSelected([...valueSelected, select]);
    }
  };

  const handleRemoveSelect = (select: ProjectAttributeItemType) => {
    setValueSelected(valueSelected.filter(a => a.id !== select.id));
  };

  const handleChangeText = (e: ChangeEvent<HTMLInputElement>) => {
    setTextValue(e.target.value);
  };

  const handleChangeTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaValue(e.target.value);
  };

  const listAttributeChildrensRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (listAttributeChildrensRef.current && !listAttributeChildrensRef.current.contains(event.target as Node)) {
        setOpenChildrens(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (attribute.type === 1) {
      setValueFinal(textValue);
    } else if (attribute.type === 2) {
      setValueFinal(textAreaValue);
    } else if (attribute.type === 5) {
      setValueFinal(date);
    } else if ([3, 4].includes(attribute.type)) {
      setValueFinal(JSON.stringify(valueSelected));
    }
  }, [textValue, textAreaValue, valueSelected, attribute.type, date]);

  useEffect(() => {
    if (valueFinal === undefined) return;
    
    setTaskAttributes(prevTaskAttributes => {
      const updatedAttributes = [...prevTaskAttributes, { id, value: valueFinal, attribute }];
      const uniqueAttributes = updatedAttributes.reduce((acc, curr) => {
        acc.set(curr.id, curr);
        return acc;
      }, new Map<number, TaskAttributeType>()).values();
      return Array.from(uniqueAttributes);
    });
  }, [valueFinal, attribute, id, setTaskAttributes]);

  useEffect(() => {
    if (!value) return;
  
    if (attribute.type === 1) {
      setTextValue(value as string);
    } else if (attribute.type === 2) {
      setTextAreaValue(value as string);
    } else if (attribute.type === 5) {
      setDate(new Date(value));
    } else if ([3, 4].includes(attribute.type)) {
      setValueSelected(JSON.parse(value))
    }
  }, [value, attribute.type]);

  const handleChange = (value: string[]) => {
    if (!value) {
      setValueSelected([]);
      return;
    }
    const arraySelected = attribute.childrens.filter(m => value.includes(m.id.toString()));
    setValueSelected(arraySelected);
  };  

  return (
    <div className="row text-secondary mt-2">
      <div className="col-4 lh-40">{attribute.name}:</div>
      <div className="col-8 text-secondary" onClick={() => setOpenChildrens(true)} ref={listAttributeChildrensRef}>
        {attribute.type === 1 && <Input type="text" className="text-attribute-task" value={textValue} onChange={handleChangeText} placeholder={t('tasks.enter_text_attribute_placeholder')} />}
        {attribute.type === 2 && <Textarea className="mt-2 text-attribute-task" placeholder={t('tasks.enter_text_attribute_placeholder')} rows={2} value={textAreaValue} onChange={handleChangeTextArea} />}
        {
          [3, 4].includes(attribute.type) &&
          <Select
            mode={attribute.type === 4 ? 'multiple' : undefined}
            allowClear
            style={{ width: "100%" }}
            placeholder={t("empty_label")}
            value={valueSelected.map((t) => t.id.toString())}
            onChange={handleChange}
            getPopupContainer={(trigger) => trigger.parentElement || document.body}
            options={attribute.childrens.map((m) => ({
              value: m.id.toString(),
              label: (
                <div style={{ marginTop: 4, borderRadius: 10, height: 25, lineHeight: '25px', minWidth: 100, marginRight: 10 }}>
                  {m.value}
                </div>
              ),
              fullTextSearch: `${m.value}`.toLowerCase(),
            }))}
            showSearch
            filterOption={(input, option) =>
              option?.fullTextSearch?.includes(input.toLowerCase()) ?? false
            }
            dropdownStyle={{ maxHeight: 250, overflowY: "auto" }}
            notFoundContent={null}
          />
        }
        {/* {[3, 4].includes(attribute.type) && (
          <>
            {valueSelected.length === 0 && (
              <Button color="default" className="btn-bo-border pointer">
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            )}
            {valueSelected.map((value, index) => (
              <Card key={index} className="float-left p-unset pointer mr-1 mt-1">
                {value.value}
                {attribute.type === 4 && (
                  <FontAwesomeIcon icon={faTimes} className="mt-2 ml-4 text-secondary pointer" onClick={() => handleRemoveSelect(value)} />
                )}
              </Card>
            ))}
            {((attribute.type === 3 && openChildrens) || (openChildrens && attribute.childrens.some(m => !valueSelected.some(a => a.id === m.id)))) && (
              <ul className="list-group select-search-task" style={valueSelected.length === 0 ? { top: 38 } : undefined}>
                {attribute.childrens.filter(m => !valueSelected.some(a => a.id === m.id)).map((attrChild, index) => (
                  <li className="list-group-item border-unset p-unset pointer" key={index} onClick={() => handleAddSelect(attrChild)}>
                    <span className="badge badge-default w-100 text-left">{attrChild.value}</span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )} */}
        {
          attribute.type === 5 && <DatePickerCustom className="mt-2" setDueDate={setDate} dueDate={date} />
        }
      </div>
    </div>
  );
};

export default TaskAttributeItem;