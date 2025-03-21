import { IMAGE_DEFAULT } from "@/enums/app.enum";
import { ProjectType } from "@/types/project.type";
import { ResponseUserDataType } from "@/types/user.type";
import { WorkspaceUserType } from "@/types/workspace.type";
import { Select } from "antd";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

interface TaskAssignSelectProps {
  assignee: ResponseUserDataType[]
  setAssignee: (assignee: ResponseUserDataType[]) => void
  project: ProjectType
  className?: string
  label?: string
}

const TaskAssignSelect: React.FC<TaskAssignSelectProps> = ({ assignee, project, className, label, setAssignee }) => {
  const [membersData, setMembersData] = useState<WorkspaceUserType[]>(project.members);
  const t = useTranslations();

  const handleChange = (value: string[]) => {
    const memberSelected: ResponseUserDataType[] = [];
    for (let i = 0; i < value.length; i++) {
      const member = membersData.find(m => m.id === Number(value[i]));
      if (member) {
        memberSelected.push({
          id: member.id,
          first_name: member.first_name,
          last_name: member.last_name,
          email: member.email,
          phone: '',
          avatar: member.avatar,
          created_at: '',
          login_type: "common"
        });
      }
    }
    setAssignee(memberSelected);
  };

  useEffect(() => {
    if (project.user) {
      setMembersData(prev => {
        const isUserExist = prev.some(member => member.id === project.user.id);
        if (!isUserExist) {
          return [
            {
              id: project.user.id,
              first_name: project.user.first_name,
              last_name: project.user.last_name,
              email: project.user.email,
              avatar: project.user.avatar,
            },
            ...prev
          ];
        }
        return prev;
      });
    }
  }, [project.user]);
  
  return (
    <div className={`row text-secondary ${className ?? ''}`}>
      <div className="col-4 lh-40">
        {label ?? t('tasks.assignee_label')}:
      </div>
      <div className="col-8">
        <Select
          mode="multiple"
          allowClear
          style={{ width: "100%" }}
          placeholder={t("tasks.unassigned_label")}
          defaultValue={assignee.map((a) => a.id.toString())}
          onChange={handleChange}
          getPopupContainer={(trigger) => trigger.parentElement || document.body}
          options={membersData.map((m) => ({
            value: m.id.toString(),
            label: (
              <div style={{paddingLeft: 10, marginTop: 4, borderRadius: 10, height: 25, lineHeight: '20px', minWidth: 100, marginRight: 10}}>
                <img
                  className="img-circle"
                  src={m.avatar ?? IMAGE_DEFAULT.NO_USER}
                  onError={(e) => (e.currentTarget.src = IMAGE_DEFAULT.NO_USER)}
                  width={25}
                  height={25}
                />{" "}
                {m.first_name} {m.last_name}
              </div>
            ),
            fullTextSearch: `${m.first_name} ${m.last_name} ${m.email} ${m.id}`.toLowerCase(),
          }))}
          showSearch
          filterOption={(input, option) =>
            option?.fullTextSearch?.includes(input.toLowerCase()) ?? false
          }
          dropdownStyle={{ maxHeight: 250, overflowY: "auto" }}
        />
      </div>
    </div>
  )
}
export default TaskAssignSelect;