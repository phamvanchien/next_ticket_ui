import { members } from "@/api/workspace.api";
import UserAvatar from "@/common/components/AvatarName";
import { API_CODE } from "@/enums/api.enum";
import useDelaySearch from "@/hooks/useDelaySearch";
import { ResponseWithPaginationType } from "@/types/base.type";
import { UserType } from "@/types/user.type";
import { faMinus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Switch } from "antd";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { MemberShareType } from "@/types/document.type";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxs/store.redux";
import Button from "@/common/components/Button";

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
      <div className="col-12 col-lg-12 mt-4">
        <div className="bg-white rounded-4 shadow-sm border p-3">
          <div className="d-flex justify-content-between align-items-center mb-3 px-2">
            <div className="position-relative w-100">
              <FontAwesomeIcon icon={faSearch} className="position-absolute ms-3 wp-search-icon" />
              <input
                type="text"
                className="form-control ps-5 rounded search-input float-right"
                value={keyword}
                onChange={handleChange}
                placeholder={t("projects_page.create.placeholder_input_search_member")}
              />
            </div>
          </div>
          {
            debouncedValue && membersData && membersData?.items.filter((user) => !memberSelected.some((u) => u.user.id === user.id)).length > 0 &&
            <div className="table-responsive mb-2">
              <table className="table align-middle mb-0">
                <tbody>
                  {membersData?.items.filter((user) => !memberSelected.some((u) => u.user.id === user.id)).map((user, index) => (
                    <tr key={index} className="border-bottom pointer" onClick={() => handleSelectMember(user)}>
                      <td>
                        <UserAvatar name={user.first_name} avatar={user.avatar} />
                      </td>
                      <td className="fw-semibold text-dark">{user.first_name} {user.last_name}</td>
                      <td className="text-muted">{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        </div>
        {
          memberSelected.length > 0 &&
          <div className="table-responsive mb-2 mt-2">
            <table className="table align-middle mb-0">
              <tbody>
                {
                  memberSelected.map((user, index) => (
                    <tr key={index} className="border-bottom">
                      <td className="text-muted">
                        <p className="m-unset">{user.user.email}</p>
                        <Switch
                          style={{ marginRight: 7 }}
                          checked={user.permission === 1}
                          onChange={() => handleTogglePermission(user.user.id)}
                        />
                        {t('documents.permission_label')}
                      </td>
                      <td className="text-end">
                        <Button size="sm" color="danger" className="px-3 rounded" onClick={() => handleRemoveMember(user.user.id)}>
                          <FontAwesomeIcon icon={faMinus} />
                        </Button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </>
  );
};

export default DocumentMemberList;