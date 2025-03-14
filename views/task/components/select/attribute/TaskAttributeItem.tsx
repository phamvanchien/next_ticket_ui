import { RootState } from "@/reduxs/store.redux";
import { ProjectAttributeType } from "@/types/project.type";
import { TaskAttributeType, TaskAttributeValueType } from "@/types/task.type";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface TaskAttributeItemProps {
  attribute: ProjectAttributeType
  taskAttributes: TaskAttributeType[]
  setTaskAttributes: (taskAttributes: TaskAttributeType[]) => void
}

const TaskAttributeItem: React.FC<TaskAttributeItemProps> = ({ 
  attribute,
  taskAttributes,
  setTaskAttributes
}) => {
  const [attributeData, setAttributeData] = useState(attribute);
  const attributeIncome = taskAttributes.find(a => a.id === attributeData.id);
  const attributesUpdated = useSelector((state: RootState) => state.attributeSlice).dataUpdated;
  const [openValueList, setOpenValueList] = useState(false);
  const [valueSelected, setValueSelected] = useState<TaskAttributeValueType[]>(attributeIncome ? attributeIncome.value : []);
  const valueListRef = useRef<HTMLDivElement>(null);
  const handleSelectValue = (value: TaskAttributeValueType) => {
    const added = valueSelected.find(a => a.key === value.key);
    if (!added) {
      setValueSelected([...valueSelected, value]);
    }
  }
  const handleRemoveValue = (value: TaskAttributeValueType) => {
    setValueSelected(valueSelected.filter(v => v.key !== value.key));
  }
  useEffect(() => {
    const handleClickOutside = async (event: MouseEvent) => {
      if (valueListRef.current && !valueListRef.current.contains(event.target as Node)) {
        setOpenValueList(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const existingIndex = taskAttributes.findIndex(attr => attr.id === attributeData.id);
  
    if (existingIndex !== -1) {
      const updatedAttributes = [...taskAttributes];
      updatedAttributes[existingIndex] = {
        ...updatedAttributes[existingIndex],
        value: valueSelected
      };
      setTaskAttributes(updatedAttributes.filter(a => a.value.length > 0));
    } else {
      setTaskAttributes([
        ...taskAttributes,
        {
          id: attributeData.id,
          value: valueSelected
        }
      ]);
    }
  }, [valueSelected, attributeData.id]);
  useEffect(() => {
    
  }, [attributesUpdated]);
  
  return (
    <div className={`row text-secondary mt-2`}>
      <div className="col-4 lh-40">
        {attributeData.name}:
      </div>
      <div className="col-8 text-secondary" onClick={() => setOpenValueList (true)} ref={valueListRef}>
        {
          valueSelected.length === 0 &&
          <span className="badge badge-light task-info-selectbox mb-2 mr-2 pointer task-btn-circle">
            <FontAwesomeIcon icon={faPlus} />
          </span>
        }
        {
          valueSelected.map((value, index) => (
            <span className="badge badge-light task-info-selectbox mr-2 mb-1" key={index}>
              {value.value}
              <FontAwesomeIcon icon={faTimes} className="mt-2 ml-4 text-secondary pointer" onClick={() => handleRemoveValue (value)} />
            </span>
          ))
        }
        {
          (openValueList && attributeData.value.filter(m => !valueSelected.map(a => a.key).includes(m.key)).length > 0) &&
          <ul className="list-group select-search-task">
            {
              attributeData.value.filter(m => !valueSelected.map(a => a.key).includes(m.key)).map((v, index) => (
                <li className="list-group-item border-unset p-unset pointer" key={index} onClick={() => handleSelectValue (v)}>
                  <span className="badge badge-default w-100 text-left">
                    {v.value}
                  </span>
                </li>
              ))
            }
          </ul>
        }
      </div>
    </div>
  );
}
export default TaskAttributeItem;