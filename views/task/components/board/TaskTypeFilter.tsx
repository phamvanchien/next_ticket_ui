import { TaskPriorityType, TaskTypeItem } from "@/types/task.type";
import { priorityRange, taskType } from "@/utils/helper.util";
import { faAdjust, faDotCircle, faPlus, faTimes, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { getIconPriority, getTypeClass, getTypeIcon } from "../../components/board/grib/TaskItem";

interface TaskTypeFilterProps {
  type: TaskTypeItem[]
  setType: (type: TaskTypeItem[]) => void
}

const TaskTypeFilter: React.FC<TaskTypeFilterProps> = ({ type, setType }) => {
  const types = taskType();
  const listTypeRef = useRef<HTMLUListElement>(null);
  const [openTypeList, setOpenTypeList] = useState(false);
  const handleSelectPriority = (typeItem: TaskTypeItem) => {
    const selected = type.find(p => p.id === typeItem.id);
    if (!selected) {
      setType([...type, typeItem])
    }
  }
  const handleRemovePriority = (typeItem: TaskTypeItem) => {
    const priorityFilter = type.filter(p => p.id !== typeItem.id);
    if (priorityFilter.length === 0) {
      setOpenTypeList(false);
    }
    setType(priorityFilter);
  }
  useEffect(() => {
    const handleClickOutside = async (event: MouseEvent) => {
      if (listTypeRef.current && !listTypeRef.current.contains(event.target as Node)) {
        setOpenTypeList(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div className="row mt-4 text-secondary">
      <div className="col-lg-2 col-4 pt-2"><FontAwesomeIcon icon={faDotCircle} /> Type: </div>
      <div className={`col-8 col-lg-6 ${(!openTypeList && type.length === 0) ? 'pt-2' : ''}`}>
        {
          (!openTypeList && type.length === 0) &&
          <span style={{ cursor: 'pointer' }} onClick={() => setOpenTypeList (true)}>
            <FontAwesomeIcon icon={faPlus} /> Add
          </span>
        }
        <ul className="list-group" ref={listTypeRef}>
            {
              (type.length > 0) &&
              <li className={`list-group-item p-5 ${!openTypeList ? 'border-unset' : ''}`}>
                {
                  type.map(value => (
                    <span className="badge badge-default p-5 float-left mr-2" onClick={() => setOpenTypeList (true)}>
                      {getTypeIcon(value.id, `mr-2 text-${getTypeClass(value.id)}`)} {value.title} <FontAwesomeIcon icon={faTimesCircle} className="ml-2" onClick={() => handleRemovePriority (value)} />
                    </span>
                  ))
                }
              </li>
            }
            {
              openTypeList && types.filter(m => !type.map(p => p.id).includes(m.id)).map(item => (
                <li key={item.id} className={`list-group-item p-5 ${!openTypeList ? 'border-unset' : ''}`} onClick={() => handleSelectPriority (item)} style={{ cursor: 'pointer' }}>
                  <span className="badge badge-light p-5 float-left mr-2">
                    {getTypeIcon(item.id, `mr-2 text-${getTypeClass(item.id)}`)} {item.title}
                  </span>
                </li>
              ))
            }
          </ul>
      </div>
    </div>
  )
}
export default TaskTypeFilter;