import { TaskTypeItem } from "@/types/task.type";
import { taskType } from "@/utils/helper.util";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { getTypeClass, getTypeIcon } from "../../components/board/grib/TaskItem";
import { useTranslations } from "next-intl";
import Button from "@/common/components/Button";
import { Card } from "antd";

interface TaskTypeFilterProps {
  type: TaskTypeItem[]
  setType: (type: TaskTypeItem[]) => void
}

const TaskTypeFilter: React.FC<TaskTypeFilterProps> = ({ type, setType }) => {
  const t = useTranslations();
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
    <div className="row text-secondary mt-2">
      <div className="col-4 lh-40">
        {t('tasks.type_label')}:
      </div>
      <div className="col-8 text-secondary" onClick={() => setOpenTypeList (true)} ref={listTypeRef}>
        {
          (type.length === 0) &&
          <Button color="default" className="btn-bo-border pointer">
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        }
        {
          type.map((value, index) => (
            <Card key={index} className="float-left p-unset pointer mr-1">
              {getTypeIcon(value.id, `text-${getTypeClass(value.id)}`)} {value.title}
              <FontAwesomeIcon icon={faTimes} className="mt-2 ml-4 text-secondary pointer" onClick={() => handleRemovePriority (value)} />
            </Card>
          ))
        }
        {
          openTypeList &&
          <>
            <ul className="list-group select-search-task">
              {
                types && types.filter(m => !type.map(a => a.id).includes(m.id)).map((value, index) => (
                  <li className="list-group-item border-unset p-unset pointer" key={index} onClick={() => handleSelectPriority (value)}>
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