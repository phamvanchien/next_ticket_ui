import { members } from "@/api/workspace.api";
import Input from "@/common/components/Input";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { ResponseWithPaginationType } from "@/types/base.type";
import { MemberShareType } from "@/types/document.type";
import { ResponseUserDataType } from "@/types/user.type";
import { WorkspaceUserType } from "@/types/workspace.type";
import { faCircle, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface DocumentMemberListProps {
  setMemberShared: (memberShared: MemberShareType[]) => void
  memberShared: MemberShareType[]
}

const DocumentMemberList: React.FC<DocumentMemberListProps> = ({ setMemberShared, memberShared }) => {
  const [workspaceMembers, setWorkspaceMembers] = useState<ResponseWithPaginationType<ResponseUserDataType[]>>();
  const [keywordMember, setKeywordMember] = useState<string>('');
  const [debounceKeywordMember, setDebounceKeywordMember] = useState<string>('');
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const handleChangeKeywordMember = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setKeywordMember('');
    if (event.target.value && event.target.value !== '') {
      setKeywordMember(event.target.value);
    }
  }
  const handleSelectMember = (member: ResponseUserDataType) => {
    const added = memberShared.find(p => p.id === member.id);
    if (!added) {
      setMemberShared([...memberShared, {
        id: member.id,
        first_name: member.first_name,
        last_name: member.last_name,
        email: member.email,
        full_permission: false
      }]);
    }
  }
  const loadMembers = async () => {
    try {
      if (!workspace) {
        return;
      }
      const response = await members(workspace.id, 1, 5, keywordMember);
      if (response && response.code === API_CODE.OK) {
        setWorkspaceMembers(response.data);
        return;
      }
      setWorkspaceMembers(undefined);
    } catch (error) {
      setWorkspaceMembers(undefined);
    }
  };
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceKeywordMember(keywordMember);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [keywordMember]);
  useEffect(() => {
    loadMembers();
  }, [workspace, debounceKeywordMember]);
  return (
    <div className="col-12 mt-2">
      <Input type="search" placeholder="Search members" className="w-100" onChange={handleChangeKeywordMember} />
      <ul className="list-group invite-group">
          {
          workspaceMembers && workspaceMembers.items.map(member => (
              <li className="list-group-item invite-group-item pointer" key={member.id} onClick={() => handleSelectMember (member)}>
              <FontAwesomeIcon 
                  icon={memberShared.find(p => p.id === member.id) ? faCircleCheck : faCircle} 
                  className={`text-${memberShared.find(p => p.id === member.id) ? 'primary' : 'secondary'} mr-2`} 
              /> {member.email}
              </li>
          ))
          }
      </ul>
    </div>
  )
}
export default DocumentMemberList;