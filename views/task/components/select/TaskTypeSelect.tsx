import { TaskTypeItem } from "@/types/task.type";
import { taskType } from "@/utils/helper.util";
import React from "react";
import { getTypeClass, getTypeIcon } from "../board/grib/TaskItem";
import { useTranslations } from "next-intl";
import { Select } from "antd";

interface TaskTypeSelectProps {
  type?: TaskTypeItem;
  setType: (type?: TaskTypeItem) => void;
  className?: string;
}

const TaskTypeSelect: React.FC<TaskTypeSelectProps> = ({ type, setType, className }) => {
  const types = taskType();
  const t = useTranslations();

  const handleChange = (value: string) => {
    const selectedType = types.find(t => t.id === Number(value));
    setType(selectedType);
  };

  return (
    <div className={`row text-secondary ${className ?? ''}`}>
      <div className="col-4 lh-40">
        {t('tasks.type_label')}:
      </div>
      <div className="col-8 text-secondary pointer">
        <Select
          allowClear
          placeholder={t("empty_label")}
          value={type?.id.toString()}
          onChange={handleChange}
          getPopupContainer={(trigger) => trigger.parentElement || document.body}
          options={types.map((t) => ({
            value: t.id.toString(),
            label: (
              <div style={{ paddingLeft: 5, display: "flex", alignItems: "center", gap: 8, marginTop: 4, borderRadius: 10, height: 25, lineHeight: '25px', minWidth: 100, marginRight: 10 }}>
                {getTypeIcon(t.id, `text-${getTypeClass(t.id)}`)} {t.title}
              </div>
            ),
            fullTextSearch: t.title.toLowerCase(),
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

export default TaskTypeSelect;