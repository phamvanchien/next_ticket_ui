import { TaskPriorityType } from "@/types/task.type";
import { priorityRange } from "@/utils/helper.util";
import React from "react";
import { useTranslations } from "next-intl";
import { Select } from "antd";
import { getIconPriority } from "../board/grib/TaskItem";

interface TaskPrioritySelectProps {
  priority?: TaskPriorityType;
  className?: string;
  setPriority: (priority?: TaskPriorityType) => void;
}

const TaskPrioritySelect: React.FC<TaskPrioritySelectProps> = ({ priority, className, setPriority }) => {
  const priorities = priorityRange();
  const t = useTranslations();

  const handleChange = (value: string) => {
    const selectedPriority = priorities.find(t => t.id === Number(value));
    setPriority(selectedPriority);
  };

  return (
    <div className={`row text-secondary ${className ?? ''}`}>
      <div className="col-4 lh-40">
        {t('tasks.priority_label')}:
      </div>
      <div className="col-8 text-secondary pointer">
        <Select
          allowClear
          placeholder={t("empty_label")}
          value={priority?.id.toString()}
          onChange={handleChange}
          getPopupContainer={(trigger) => trigger.parentElement || document.body}
          options={priorities.map((p) => ({
            value: p.id.toString(),
            label: (
              <div style={{ marginTop: 4, borderRadius: 10, height: 25, lineHeight: '25px', minWidth: 100, marginRight: 10 }}>
                {getIconPriority(p.id)} {p.title}
              </div>
            ),
            fullTextSearch: p.title.toLowerCase(),
          }))}
          showSearch
          filterOption={(input, option) =>
            option?.fullTextSearch?.includes(input.toLowerCase()) ?? false
          }
          dropdownStyle={{ maxHeight: 250, overflowY: "auto" }}
          notFoundContent={null}
        />
      </div>
    </div>
  );
};

export default TaskPrioritySelect;