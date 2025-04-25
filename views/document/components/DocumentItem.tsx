import UserAvatar from "@/common/components/AvatarName";
import { DocumentType } from "@/types/document.type";
import { dateToString, formatToTimestampString } from "@/utils/helper.util";
import { faBullseye, faLock, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge } from "antd";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface DocumentItemProps {
  document: DocumentType;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ document }) => {
  const router = useRouter();
  const t = useTranslations();

  return (
    <div className="col-md-3 mb-4">
      <div className="document-item-card shadow-sm border-0 h-100 rounded-4">
        <div className="document-item-card-body">
          <Image alt="" width={100} height={100} src={'/images/icons/document.png'} className="document-item-avatar" />
          <UserAvatar avatar={document.creator.avatar} name={document.creator.first_name} className="document-item-avatar-user" />
          <h5 className="document-item-title mb-0 text-truncate w-75 pointer" onClick={() => router.push(`/workspace/${document.workspace_id}/document/${document.id}`)}>
            {document.title}
          </h5>
          <Badge className="document-item-badge mt-2 mb-2" text={`${t('documents.last_modify_label')}: ${dateToString(new Date(document.updated_at), '/', true)}`} showZero color="#198754" />
          <br />
          <a className="document-item-share-link text-secondary">
            {document.share_type === 1 && <><FontAwesomeIcon icon={faLock} /> {t('documents.just_you')}</>}
            {document.share_type === 2 && <><FontAwesomeIcon icon={faUserGroup} /> {t('documents.share_with_member')}</>}
            {document.share_type === 3 && <><FontAwesomeIcon icon={faBullseye} /> {t('documents.share_in_project_label')}</>}
          </a>
        </div>
      </div>
    </div>
  );
};

export default DocumentItem;