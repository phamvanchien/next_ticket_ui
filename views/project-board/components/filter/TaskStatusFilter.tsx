import SelectMultiple from "@/common/components/SelectMultiple"
import { RootState } from "@/reduxs/store.redux"
import { ProjectStatusType } from "@/types/project.type"
import { faCircle, faClipboardList } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useTranslations } from "next-intl"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"

interface TaskStatusFilterProps {
  className?: string
  statusList: ProjectStatusType[]
  statusSelected: number[]
  setStatusSelected: (statusSelected: number[]) => void
}

const TaskStatusFilter: React.FC<TaskStatusFilterProps> = ({ className, statusList, statusSelected, setStatusSelected }) => {
  const t = useTranslations();
  const statusCreated = useSelector((state: RootState) => state.projectSlide).statusCreated;
  const statusUpdated = useSelector((state: RootState) => state.projectSlide).statusUpdated;
  const statusDeletedId = useSelector((state: RootState) => state.projectSlide).statusDeletedId;
  const [statusData, setStatusData] = useState(statusList);
  useEffect(() => {
    if (statusCreated) {
      setStatusData([...statusData, statusCreated]);
    }
  }, [statusCreated]);
  useEffect(() => {
    if (statusUpdated) {
      setStatusData((prev) =>
        prev.map((status) =>
          status.id === statusUpdated.id ? { ...status, ...statusUpdated } : status
        )
      );
    }
  }, [statusUpdated]);
  useEffect(() => {
    if (statusDeletedId) {
      setStatusData(statusData.filter(s => s.id !== statusDeletedId));
    }
  }, [statusDeletedId]);
  return (
    <div className={`row ${className ?? ''}`}>
      <div className="col-lg-3 col-12 text-secondary">
        <FontAwesomeIcon icon={faClipboardList} /> {t('tasks.status_label')}:
      </div>
      <div className="col-lg-9 col-12">
        <SelectMultiple
          className="status-dropdown-filter" 
          options={statusData.map(status => {
            return {
              value: status.id,
              label: (
                <div className="status-card" style={{ color: status.color, minWidth: 100 }}>
                  <FontAwesomeIcon icon={faCircle} size="sm" style={{ color: status.color }} /> {status.name}
                </div>
              )
            }
          })} 
          handleChange={(values) => setStatusSelected (values.map(v => Number(v)))}
          values={statusSelected} 
          placeholder={t('empty_label')}
        />
      </div>
    </div>
  )
}
export default TaskStatusFilter;