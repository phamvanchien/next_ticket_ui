import UserAvatar from "@/common/components/AvatarName";
import SelectMultiple from "@/common/components/SelectMultiple";
import { setKeywordSearchMembers } from "@/reduxs/project.redux";
import { RootState, useAppDispatch } from "@/reduxs/store.redux";
import { UserType } from "@/types/user.type";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SelectProps } from "antd";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface TaskAssigneeProps {
  className?: string;
  projectMembers: UserType[]
  assigneeSelected: UserType[]
  setAssigneeSelected: (userSelected: UserType[]) => void
}

const TaskAssignee: React.FC<TaskAssigneeProps> = ({ className, projectMembers, assigneeSelected, setAssigneeSelected }) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const membersProject = useSelector((state: RootState) => state.projectSlide).membersProject;
  const [memberList, setMemberList] = useState(projectMembers);
  const options: SelectProps['options'] = memberList.map(member => {
    return {
      label: <div>
        <UserAvatar name={member.first_name} avatar={member.avatar} /> {member.first_name} {member.last_name}
      </div>,
      value: member.id
    }
  });
  const handleChange = (value: (string | number)[]) => {
    const selectedUsers = memberList.filter(member => value.includes(member.id));
    setAssigneeSelected(selectedUsers);
  };  
  const handleSearch = (keyword: string) => {
    if (keyword.trim() === "") return;

    clearTimeout((handleSearch as any).timeoutId);
    (handleSearch as any).timeoutId = setTimeout(() => {
      dispatch(setKeywordSearchMembers(keyword));
    }, 300);
  };
  useEffect(() => {
    if (membersProject) {
      setMemberList(membersProject);
    }
  }, [membersProject]);
  return (
    <div className={`row ${className ?? ''}`}>
      <div className="col-3 text-secondary">
        <FontAwesomeIcon icon={faUser} /> {t('tasks.assignee_label')}:
      </div>
      <div className="col-9">
        <SelectMultiple 
          className="mt-2 dropdown-assignee" 
          placeholder={t('tasks.unassigned_label')} 
          options={options} 
          values={assigneeSelected.map(a => a.id)}
          handleChange={handleChange}
          handleSearch={handleSearch}
        />
      </div>
    </div>
  )
}
export default TaskAssignee;