import { TaskTypeItem } from "@/types/task.type";
import { taskType } from "@/utils/helper.util";
import React, { useEffect, useRef, useState } from "react";
import { getTypeClass, getTypeIcon } from "../board/grib/TaskItem";
import { useTranslations } from "next-intl";

interface TaskTypeSelectProps {
  type?: TaskTypeItem
  setType: (type?: TaskTypeItem) => void
  className?: string
}

const TaskTypeSelect: React.FC<TaskTypeSelectProps> = ({ type, setType, className }) => {
  const types = taskType();
  const t = useTranslations();
  const listPriorityRef = useRef<HTMLDivElement>(null);
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
    <div className={`row text-secondary ${className ?? ''}`}>
      <div className="col-4 lh-40">
        {t('tasks.type_label')}:
      </div>
      <div className="col-8 text-secondary" onClick={() => setOpenTypeList (true)} ref={listPriorityRef}>
        {
          type &&
          <span className="badge badge-light task-info-selectbox lh-20 mb-2 mr-2">
            {getTypeIcon(type.id, `text-${getTypeClass(type.id)}`)} {type.title}
          </span>
        }
        {
          openTypeList &&
          <>
            <ul className="list-group select-search-task">
              {
                types && types.filter(m => type?.id !== m.id).map((value, index) => (
                  <li className="list-group-item border-unset p-unset" key={index} onClick={() => setType(value)}>
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
export default TaskTypeSelect;