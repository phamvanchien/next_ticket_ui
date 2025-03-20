import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import Textarea from "@/common/components/Textarea";
import { ProjectAttributeItemType, ProjectAttributeType } from "@/types/project.type";
import { TaskAttributeType } from "@/types/task.type";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card } from "antd";
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
  const [valueFinal, setValueFinal] = useState<any>("");

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
    } else if ([3, 4].includes(attribute.type)) {
      setValueFinal(JSON.stringify(valueSelected));
    }
  }, [textValue, textAreaValue, valueSelected, attribute.type]);

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
    } else if ([3, 4].includes(attribute.type)) {
      setValueSelected(JSON.parse(value))
    }
  }, [value, attribute.type]);

  useEffect(() => {
    console.log("Item change")
  }, [attribute]);

  return (
    <div className="row text-secondary mt-2">
      <div className="col-4 lh-40">{attribute.name}</div>
      <div className="col-8 text-secondary" onClick={() => setOpenChildrens(true)} ref={listAttributeChildrensRef}>
        {attribute.type === 1 && <Input type="text" className="mt-2" value={textValue} onChange={handleChangeText} />}
        {attribute.type === 2 && <Textarea rows={2} value={textAreaValue} onChange={handleChangeTextArea} />}
        {[3, 4].includes(attribute.type) && (
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
        )}
      </div>
    </div>
  );
};

export default TaskAttributeItem;