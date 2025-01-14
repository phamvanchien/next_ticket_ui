import { TaskTypeItem } from "@/types/task.type";
import { taskType } from "@/utils/helper.util";
import { faPlus, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { getTypeClass, getTypeIcon } from "../../components/board/grib/TaskItem";

interface TaskTypeFilterProps {
  type: TaskTypeItem[]
  setType: (type: TaskTypeItem[]) => void
}

const TaskTypeFilter: React.FC<TaskTypeFilterProps> = ({ type, setType }) => {
  const types = taskType();
  const listTypeRef = useRef<HTMLDivElement>(null);
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
    <div className="row text-secondary">
      <div className="col-4 lh-40">
        Type:
      </div>
      <div className="col-8 text-secondary" onClick={() => setOpenTypeList (true)} ref={listTypeRef}>
        {
          (type.length === 0) &&
          <span className="badge badge-light lh-20 mb-2 mr-2">
            <FontAwesomeIcon icon={faPlus} /> Add filter
          </span>
        }
        {
          type.map((value, index) => (
            <span className="badge badge-light lh-20 mb-2 mr-2" key={index}>
              {getTypeIcon(value.id, `text-${getTypeClass(value.id)}`)} {value.title}
              <FontAwesomeIcon icon={faTimesCircle} className="mt-2 ml-2 text-secondary" onClick={() => handleRemovePriority (value)} />
            </span>
          ))
        }
        {
          openTypeList &&
          <>
            <ul className="list-group select-search-task">
              {
                types && types.filter(m => !type.map(a => a.id).includes(m.id)).map((value, index) => (
                  <li className="list-group-item border-unset p-unset" key={index} onClick={() => handleSelectPriority (value)}>
                    <span className="badge badge-default w-100 text-left">
                      {getTypeIcon(value.id, `text-${getTypeClass(value.id)}`)} {value.title}
                    </span>
                  </li>
                ))
              }
            </ul>
          </>
        }
      </div>
    </div>
  )
}
export default TaskTypeFilter;