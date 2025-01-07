import { taskType } from "@/utils/helper.util";
import { faDotCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { getTypeClass, getTypeIcon } from "../../components/board/grib/TaskItem";
import { TaskTypeItem } from "@/types/task.type";

interface TaskTypeListProps {
  type?: TaskTypeItem
  setType: (type?: TaskTypeItem) => void
}

const TaskTypeList: React.FC<TaskTypeListProps> = ({ type, setType }) => {
  const types = taskType();
  const listPriorityRef = useRef<HTMLUListElement>(null);
  const [openTypeList, setOpenTypeList] = useState(false);
  useEffect(() => {
    const handleClickOutside = async (event: MouseEvent) => {
      if (listPriorityRef.current && !listPriorityRef.current.contains(event.target as Node)) {
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
      <div className={`col-8 col-lg-6`}>
      <ul className="list-group" ref={listPriorityRef}>
          <li className={`list-group-item p-5 ${!openTypeList ? 'border-unset' : ''}`}>
            {
              type &&
              <span className="badge badge-light p-5 float-left mr-2" onClick={() => setOpenTypeList (true)}>
                {getTypeIcon(type.id, `mr-2 text-${getTypeClass(type.id)}`)} {type.title}
              </span>
            }
          </li>
          {
            openTypeList && <>
              {
                openTypeList && types.filter(m => type?.id !== m.id).map(item => (
                  <li key={item.id} className={`list-group-item p-5 ${!openTypeList ? 'border-unset' : ''}`} onClick={() => setType(item)} style={{ cursor: 'pointer' }}>
                    <span className="badge badge-light p-5 float-left mr-2">
                      {getTypeIcon(item.id, `mr-2 text-${getTypeClass(item.id)}`)} {item.title}
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
export default TaskTypeList;