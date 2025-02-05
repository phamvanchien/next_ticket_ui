import Input from "@/common/components/Input";
import { MemberShareType } from "@/types/document.type";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React from "react";

interface DocumentMemberSharedProps {
  memberShared: MemberShareType[]
  setMemberShared: (memberShared: MemberShareType[]) => void
}

const DocumentMemberShared: React.FC<DocumentMemberSharedProps> = ({ memberShared, setMemberShared }) => {
  const t = useTranslations();
  const handleRemoveMember = (member: MemberShareType) => {
    setMemberShared(
      memberShared.filter(p => p.id !== member.id)
    );
  }
  return <>
    {
      memberShared.map(member => (
        <div className="col-12" key={member.id}>
          <div className="card mb-2">
            <div className="row">
              <div className="col-6">
                <span className="badge badge-light">
                  <FontAwesomeIcon icon={faMinusCircle} className="text-danger ml-2 pointer mr-2" onClick={() => handleRemoveMember (member)} /> {member.first_name} {member.last_name}
                </span>
              </div>
              <div className="col-6">
                <div className="custom-control custom-checkbox float-right mr-2">
                  <Input type="checkbox" className="custom-control-input" id={`userSharePermission${member.id}`} defaultChecked={member.full_permission} />
                  <label htmlFor={`userSharePermission${member.id}`} className="custom-control-label">
                    {t('documents.permission_label')}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))
    }
  </>
}
export default DocumentMemberShared;