import SelectSingle from "@/common/components/SelectSingle";
import { RootState } from "@/reduxs/store.redux";
import { ProjectStatusType } from "@/types/project.type";
import { faCircle, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface TaskStatusProps {
  className?: string
  statusList: ProjectStatusType[]
  statusSelected: number
  setStatusSelected: (statusSelected: number) => void
}

const TaskStatus: React.FC<TaskStatusProps> = ({ className, statusList, statusSelected, setStatusSelected }) => {
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
      setStatusSelected(statusUpdated.id);
    }
  }, [statusUpdated]);
  useEffect(() => {
    if (statusDeletedId) {
      setStatusData(statusData.filter(s => s.id !== statusDeletedId));
    }
  }, [statusDeletedId]);
  return (
    <div className={`row ${className ?? ''}`}>
      <div className="col-3 text-secondary">
        <FontAwesomeIcon icon={faClipboardList} /> {t('tasks.status_label')}:
      </div>
      <div className="col-9">
        <SelectSingle
          // className="status-dropdown" 
          options={statusData.map(status => {
            return {
              value: status.id,
              label: (
                <div>
                  <FontAwesomeIcon icon={faCircle} style={{ color: status.color }} /> {status.name}
                </div>
              )
            }
          })} 
          handleChange={(value) => setStatusSelected (Number(value))}
          value={statusSelected ? statusSelected : statusData[0].id} 
        />
      </div>
    </div>
  )
}
export default TaskStatus;