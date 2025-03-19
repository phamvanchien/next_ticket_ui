import { TaskPriorityType } from "@/types/task.type";
import { priorityRange } from "@/utils/helper.util";
import React, { useEffect, useRef, useState } from "react";
import { getIconPriority } from "../board/grib/TaskItem";
import { useTranslations } from "next-intl";
import { Card } from "antd";

interface TaskPrioritySelectProps {
  priority?: TaskPriorityType
  className?: string
  setPriority: (priority?: TaskPriorityType) => void
}

const TaskPrioritySelect: React.FC<TaskPrioritySelectProps> = ({ priority, className, setPriority}) => {
  const priorities = priorityRange();
  const listPriorityRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();
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
    <div className={`row text-secondary ${className ?? ''}`}>
      <div className="col-4 lh-40">
        {t('tasks.priority_label')}:
      </div>
      <div className="col-8 text-secondary pointer" onClick={() => setOpenPriorityList (true)} ref={listPriorityRef}>
        {
          priority &&
          <Card className="p-unset float-left pointer">
            {getIconPriority(priority.id)} {priority.title}
          </Card>
        }
        {
          openPriorityList &&
          <>
            <ul className="list-group select-search-task" style={{top: 38}}>
              {
                priorities && priorities.filter(m => priority?.id !== m.id).map((value, index) => (
                  <li className="list-group-item border-unset p-unset pointer" key={index} onClick={() => setPriority(value)}>
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
export default TaskPrioritySelect;