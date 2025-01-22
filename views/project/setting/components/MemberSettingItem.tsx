import { ResponseUserDataType } from "@/types/user.type";
import { WorkspaceUserType } from "@/types/workspace.type";
import { faMinusCircle, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface MemberSettingItemProps {
  member: ResponseUserDataType
  setMemberDelete: (memberId?: ResponseUserDataType) => void
}

const MemberSettingItem: React.FC<MemberSettingItemProps> = ({ member, setMemberDelete }) => {
  return (
    <div className="mt-2"
      style={{
        padding: "8px",
        borderRadius: "5px",
        backgroundColor: "#f8f9fa",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
        cursor: "pointer",
      }}
    >
      <FontAwesomeIcon icon={faUser} /> {member.first_name} {member.last_name} - {member.email}
      <FontAwesomeIcon icon={faMinusCircle} className="float-right text-danger w-10 m-t-5" style={{ cursor: 'pointer' }} onClick={() => setMemberDelete (member)} />
    </div>
  )
}
export default MemberSettingItem;