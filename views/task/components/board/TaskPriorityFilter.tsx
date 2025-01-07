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
  const listPriorityRef = useRef<HTMLUListElement>(null);
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
    <div className="row mt-4 text-secondary">
      <div className="col-lg-2 col-4 pt-2"><FontAwesomeIcon icon={faAdjust} /> Priority: </div>
      <div className={`col-8 col-lg-6 ${(!openPriorityList && priority.length === 0) ? 'pt-2' : ''}`}>
        {
          (!openPriorityList && priority.length === 0) &&
          <span style={{ cursor: 'pointer' }} onClick={() => setOpenPriorityList (true)}>
            <FontAwesomeIcon icon={faPlus} /> Add
          </span>
        }
        <ul className="list-group" ref={listPriorityRef}>
            {
              (priority.length > 0) &&
              <li className={`list-group-item p-5 ${!openPriorityList ? 'border-unset' : ''}`}>
                {
                  priority.map(value => (
                    <span key={value.id} className="badge badge-default p-5 float-left mr-2" onClick={() => setOpenPriorityList (true)}>
                      {getIconPriority(value.id, 'mr-2')} {value.title} <FontAwesomeIcon icon={faTimesCircle} className="ml-2" onClick={() => handleRemovePriority (value)} />
                    </span>
                  ))
                }
              </li>
            }
            {
              openPriorityList && priorities.filter(m => !priority.map(p => p.id).includes(m.id)).map(item => (
                <li key={item.id} className={`list-group-item p-5 ${!openPriorityList ? 'border-unset' : ''}`} onClick={() => handleSelectPriority (item)} style={{ cursor: 'pointer' }}>
                  <span className="badge badge-light p-5 float-left mr-2">
                    {getIconPriority(item.id, 'mr-2')} {item.title}
                  </span>
                </li>
              ))
            }
          </ul>
      </div>
    </div>
  )
}
export default TaskPriorityFilter;