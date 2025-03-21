import { tagsList } from "@/api/project.api";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { ResponseWithPaginationType } from "@/types/base.type";
import { ProjectTagType } from "@/types/project.type";
import { Select } from "antd";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface TaskTagSelectProps {
  tags: ProjectTagType[]
  className?: string
  projectId: number
  setTags: (tags: ProjectTagType[]) => void
  tagsData?: ProjectTagType[]
}

const TaskTagSelect: React.FC<TaskTagSelectProps> = ({ tags, className, projectId, tagsData, setTags }) => {
  const [tagDataResponse, setTagDataResponse] = useState<ProjectTagType[]>([]);
  const t = useTranslations();
  const handleChange = (value: string[]) => {
    const tagsSelected: ProjectTagType[] = [];
    for (let i = 0; i < value.length; i++) {
      const tag = tagDataResponse.find(t => t.id === Number(value[i]));
      if (tag) {
        tagsSelected.push(tag);
      }
    }
    setTags(tagsSelected);
  };
  useEffect(() => {
    if (tagsData) {
      setTagDataResponse(tagsData);
    }
  }, [tagsData]);
  return (
    <div className={`row text-secondary ${className ?? ''}`}>
      <div className="col-4 lh-40">
        {t('tasks.tags_label')}:
      </div>
      <div className="col-8 text-secondary">
        <Select
          mode="multiple"
          allowClear
          style={{ width: "100%" }}
          placeholder={t("empty_label")}
          defaultValue={tags.map((t) => t.id.toString())}
          onChange={handleChange}
          getPopupContainer={(trigger) => trigger.parentElement || document.body}
          options={tagDataResponse.map((m) => ({
            value: m.id.toString(),
            label: (
              <div style={{ background: m.color, paddingRight: 10, paddingLeft: 10, marginTop: 4, borderRadius: 10, height: 25, lineHeight: '25px', minWidth: 100, marginRight: 10 }}>
                {m.name}
              </div>
            ),
            fullTextSearch: `${m.name}`.toLowerCase(),
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
}
export default TaskTagSelect;