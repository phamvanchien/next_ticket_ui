import { TaskPriorityType } from "@/types/task.type";
import { priorityRange } from "@/utils/helper.util";
import { faAdjust, faPlus, faTimes, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { getIconPriority } from "../../components/board/grib/TaskItem";

interface TaskPriorityProps {
  priority: TaskPriorityType[]
  setPriority: (priority: TaskPriorityType[]) => void
}

const TaskPriorityFilter: React.FC<TaskPriorityProps> = ({ priority, setPriority }) => {
  const priorities = priorityRange();
  const listPriorityRef = useRef<HTMLDivElement>(null);
  const [openPriorityList, setOpenPriorityList] = useState(false);
  const handleSelectPriority = (priorityItem: TaskPriorityType) => {
    const selected = priority.find(p => p.id === priorityItem.id);
    if (!selected) {
      setPriority([...priority, priorityItem])
    }
  }
  const handleRemovePriority = (priorityItem: TaskPriorityType) => {
    const priorityFilter = priority.filter(p => p.id !== priorityItem.id);
    if (priorityFilter.length === 0) {
      setOpenPriorityList(false);
    }
    setPriority(priorityFilter);
  }
  useEffect(() => {
    const handleClickOutside = async (event: MouseEvent) => {
      if (listPriorityRef.current && !listPriorityRef.current.contains(event.target as Node)) {
        setOpenPriorityList(false);
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
        Priority:
      </div>
      <div className="col-8 text-secondary" onClick={() => setOpenPriorityList (true)} ref={listPriorityRef}>
        {
          (priority.length === 0) &&
          <span className="badge badge-light lh-20 mb-2 mr-2">
            <FontAwesomeIcon icon={faPlus} /> Add filter
          </span>
        }
        {
          priority.map((value, index) => (
            <span className="badge badge-light lh-20 mb-2 mr-2" key={index}>
              {getIconPriority(value.id)} {value.title}
              <FontAwesomeIcon icon={faTimesCircle} className="mt-2 ml-2 text-secondary" onClick={() => handleRemovePriority (value)} />
            </span>
          ))
        }
        {
          openPriorityList &&
          <>
            <ul className="list-group select-search-task">
              {
                priorities && priorities.filter(m => !priority.map(a => a.id).includes(m.id)).map((value, index) => (
                  <li className="list-group-item border-unset p-unset" key={index} onClick={() => handleSelectPriority (value)}>
                    <span className="badge badge-default w-100 text-left">
                      {getIconPriority(value.id)} {value.title}
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
export default TaskPriorityFilter;