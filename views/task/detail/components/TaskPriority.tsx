import { TaskPriorityType } from "@/types/task.type";
import { priorityRange } from "@/utils/helper.util";
import { faAdjust, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { getIconPriority } from "../../components/board/grib/TaskItem";

interface TaskPriorityProps {
  priority?: TaskPriorityType
  setPriority: (priority?: TaskPriorityType) => void
}

const TaskPriority: React.FC<TaskPriorityProps> = ({ priority, setPriority }) => {
  const priorities = priorityRange();
  const listPriorityRef = useRef<HTMLUListElement>(null);
  const [openPriorityList, setOpenPriorityList] = useState(false);
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
      <div className={`col-8 col-lg-6 ${(!openPriorityList && !priority) ? 'pt-2' : ''}`}>
        <ul className="list-group" ref={listPriorityRef}>
            <li className={`list-group-item p-5 ${!openPriorityList ? 'border-unset' : ''}`}>
              {
                priority &&
                <span className="badge badge-default p-5 float-left mr-2" onClick={() => setOpenPriorityList (true)}>
                  {getIconPriority(priority.id, 'mr-2')} {priority.title}
                </span>
              }
            </li>
            {
              openPriorityList && <>
                {
                  openPriorityList && priorities.filter(m => priority?.id !== m.id).map(item => (
                    <li key={item.id} className={`list-group-item p-5 ${!openPriorityList ? 'border-unset' : ''}`} onClick={() => setPriority(item)} style={{ cursor: 'pointer' }}>
                      <span className="badge badge-light p-5 float-left mr-2">
                        {getIconPriority(item.id, 'mr-2')} {item.title}
                      </span>
                    </li>
                  ))
                }
              </>
            }
          </ul>
      </div>
    </div>
  )
}
export default TaskPriority;