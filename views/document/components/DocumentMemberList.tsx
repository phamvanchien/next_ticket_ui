import { members } from "@/api/workspace.api";
import UserAvatar from "@/common/components/AvatarName";
import Input from "@/common/components/Input";
import { API_CODE } from "@/enums/api.enum";
import useDelaySearch from "@/hooks/useDelaySearch";
import { ResponseWithPaginationType } from "@/types/base.type";
import { UserType } from "@/types/user.type";
import { faCheckCircle, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Switch } from "antd";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { MemberShareType } from "@/types/document.type";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxs/store.redux";

interface DocumentMemberListProps {
  workspaceId: number
  userShare: MemberShareType[]
  setUserShare: (userShare: MemberShareType[]) => void
}

const DocumentMemberList: React.FC<DocumentMemberListProps> = ({ workspaceId, userShare, setUserShare }) => {
  const [membersData, setMembersData] = useState<ResponseWithPaginationType<UserType[]>>();
  const [memberSelected, setMemberSelected] = useState<MemberShareType[]>(userShare);
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const workspaceSelected = useSelector((state: RootState) => state.workspaceSlide).workspaceSelected;
  const { value: keyword, debouncedValue, handleChange } = useDelaySearch("", 500);
  const t = useTranslations();
  const loadMembers = async () => {
    try {
      if (!debouncedValue) {
        setMembersData(undefined);
        return;
      };
      const response = await members(workspaceId, 1, 5, debouncedValue);
      if (response?.code === API_CODE.OK && workspaceSelected) {
        const data = response.data;

        data.items = data.items.filter(member => member.id !== userLogged?.id);
  
        if (
          workspaceSelected.user &&
          userLogged &&
          userLogged.id !== workspaceSelected.user_id &&
          !data.items.find(m => m.id === workspaceSelected.user_id)
        ) {
          if (workspaceSelected.user.id !== userLogged.id) {
            data.items.push(workspaceSelected.user);
          }
        }
  
        setMembersData(data);
      } else {
        setMembersData(undefined);
      }
    } catch (error) {
      setMembersData(undefined);
    }
  };  

  useEffect(() => {
    loadMembers();
  }, [debouncedValue]);

  const handleSelectMember = (member: UserType) => {
    if (!memberSelected.some(m => m.user.id === member.id)) {
      setMemberSelected([...memberSelected, { user: member, permission: 0 }]);
    }
  };

  const handleRemoveMember = (memberId: number) => {
    setMemberSelected(memberSelected.filter(m => m.user.id !== memberId));
  };

  const handleTogglePermission = (memberId: number) => {
    setMemberSelected(prev =>
      prev.map(m =>
        m.user.id === memberId
          ? { ...m, permission: m.permission === 1 ? 0 : 1 }
          : m
      )
    );
  };

  useEffect(() => {
    setUserShare(memberSelected);
  }, [memberSelected]);

  return (
    <>
      <div className="col-12 mt-4">
        <Input
          type="search"
          placeholder={t('workspaces_page.member.placeholder_input_search')}
          value={keyword}
          onChange={handleChange}
        />
        {membersData && (
          <ul className="list-group">
            {membersData.items.map((member) => (
              <li
                className="list-group-item pointer"
                key={member.id}
                onClick={() => handleSelectMember(member)}
              >
                <UserAvatar avatar={member.avatar} name={member.first_name} /> {member.first_name} {member.last_name} {memberSelected.find(_v => _v.user.id === member.id) && <FontAwesomeIcon icon={faCheckCircle} className="text-success float-right mt-2" />}
              </li>
            ))}
          </ul>
        )}
      </div>

      {memberSelected.length > 0 && (
        <div className="col-12 mt-4 mb-4">
          <ul className="list-group">
            {memberSelected.map((item) => (
              <li
                className="list-group-item d-flex justify-content-between align-items-center"
                key={item.user.id}
              >
                <div>
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    className="text-danger pointer me-2"
                    onClick={() => handleRemoveMember(item.user.id)}
                  />
                  {item.user.first_name} {item.user.last_name}
                </div>
                <div>
                  {t('documents.permission_label')}
                  <Switch
                    style={{ marginLeft: 7 }}
                    checked={item.permission === 1}
                    onChange={() => handleTogglePermission(item.user.id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default DocumentMemberList;