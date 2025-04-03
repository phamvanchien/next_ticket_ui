import UserAvatar from "@/common/components/AvatarName";
import Input from "@/common/components/Input";
import Loading from "@/common/components/Loading";
import { UserType } from "@/types/user.type";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { ChangeEvent, useState } from "react";

interface WorkspaceMemberProps {
  workspaceMembers?: UserType[]
  userSelected: UserType[]
  debouncedValue: string
  keyword: string
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void
  setUserSelected: (userSelected: UserType[]) => void
}

const WorkspaceMember: React.FC<WorkspaceMemberProps> = ({ 
  workspaceMembers, 
  userSelected, 
  debouncedValue, 
  keyword, 
  handleChange, 
  setUserSelected 
}) => {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const handleSelectUser = (user: UserType) => {
    if (!userSelected.some((u) => u.id === user.id)) {
      setUserSelected([...userSelected, user]);
    }
  };

  const handleRemoveUser = (userId: number) => {
    setUserSelected(userSelected.filter((user) => user.id !== userId));
  };
  if (!workspaceMembers) {
    return <></>
  }
  return (
    <div className="row">
      <div className="col-12">
        <Input
          type="search"
          value={keyword}
          onChange={handleChange}
          placeholder={t("create_project.placeholder_input_search_member")}
          disabled={loading}
        />
        {loading && (
          <center>
            <Loading className="mt-2" color="secondary" size={20} />
          </center>
        )}
        {!loading && debouncedValue && workspaceMembers.filter((user) => !userSelected.some((u) => u.id === user.id)).length > 0 && (
          <div className="dropdown-member-container">
            {workspaceMembers.filter((user) => !userSelected.some((u) => u.id === user.id)).map((user) => (
                <div key={user.id} className="dropdown-member-item" onClick={() => handleSelectUser(user)}>
                  <UserAvatar name={user.first_name} avatar={user.avatar} className="me-2" />
                  <span>{user.first_name} {user.last_name}</span>
                </div>
            ))}
          </div>
        )}
      </div>

      <div className="col-12 mt-3">
        {userSelected.length > 0 && (
          <div className="selected-user-list">
            {userSelected.map((user) => (
              <div key={user.id} className="selected-user-item">
                <UserAvatar name={user.first_name} avatar={user.avatar} className="me-2" />
                <span>{user.first_name} {user.last_name}</span>
                <FontAwesomeIcon icon={faTimes} className="remove-icon" onClick={() => handleRemoveUser(user.id)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
export default WorkspaceMember;