import { statusList } from "@/api/project.api";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { ResponseWithPaginationType } from "@/types/base.type";
import { ProjectTagType } from "@/types/project.type";
import { Select } from "antd";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface TaskStatusSelectProps {
  status?: ProjectTagType;
  className?: string;
  projectId: number;
  setStatus: (status?: ProjectTagType) => void;
  statusData?: ProjectTagType[]
}

const TaskStatusSelect: React.FC<TaskStatusSelectProps> = ({
  status,
  className,
  projectId,
  setStatus,
  statusData
}) => {
  const [statusDataResponse, setStatusDataResponse] = useState<ProjectTagType[]>([]);
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const t = useTranslations();

  useEffect(() => {
    if (statusData) {
      setStatusDataResponse(statusData);
    }
  }, [statusData]);

  return (
    <div className={`row text-secondary ${className ?? ""}`}>
      <div className="col-4 lh-40">{t("tasks.status_label")}:</div>
      <div className="col-8">
        <Select
          className="w-30"
          placeholder={t("empty_label")}
          value={status?.id?.toString()}
          onChange={(value) => {
            const selectedStatus = statusDataResponse.find((s) => s.id.toString() === value);
            setStatus(selectedStatus);
          }}
          getPopupContainer={(trigger) => trigger.parentElement || document.body}
          options={statusDataResponse.map((s) => ({
            value: s.id.toString(),
            label: (
              <div
                style={{marginTop: 4, borderRadius: 10, height: 25, lineHeight: '20px', minWidth: 100, marginRight: 10}}
              >
                {s.name}
              </div>
            ),
            fullTextSearch: s.name.toLowerCase(),
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

export default TaskStatusSelect;