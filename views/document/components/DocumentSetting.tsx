import Button from "@/common/components/Button";
import Loading from "@/common/components/Loading";
import Modal from "@/common/components/Modal";
import { DocumentType, MemberShareType } from "@/types/document.type";
import { ProjectType } from "@/types/project.type";
import { faCheckSquare, faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import DocumentMemberList from "./DocumentMemberList";
import DocumentProjectList from "./DocumentProjectList";
import { update } from "@/api/document.api";
import { API_CODE } from "@/enums/api.enum";
import { displayMessage } from "@/utils/helper.util";
import { BaseResponseType } from "@/types/base.type";

interface DocumentSettingProps {
  open: boolean
  document: DocumentType
  setOpen: (open: boolean) => void
}

const DocumentSetting: React.FC<DocumentSettingProps> = ({ open, document, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const [shareType, setShareType] = useState(1);
  const [userShare, setUserShare] = useState<MemberShareType[]>([]);
  const [projectShare, setProjectShare] = useState<ProjectType[]>([]);
  const t = useTranslations();
  const handleUpdateDocument = async () => {
    try {
      if (shareType === 2 && (!userShare || (userShare && userShare.length === 0))) {
        return;
      }

      if (shareType === 3 && (!projectShare || (projectShare && projectShare.length === 0))) {
        return;
      }

      setLoading(true);
      const response = await update(document.workspace_id, document.id, {
        share_type: shareType,
        user_share: shareType === 2 ? userShare.map(member => {
          return {
            id: member.user.id,
            permission: member.permission
          }
        }) : [],
        project_share: shareType === 3 ? projectShare.map(project => project.id) : []
      });
      setLoading(false);
      if (response && response.code === API_CODE.OK) {
        setOpen(false);
        return;
      }
      displayMessage('error', response.error?.message);
    } catch (error) {
      setLoading(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  useEffect(() => {
    setShareType(document.share_type);
    setUserShare(document.members_share);
    setProjectShare(document.projects_share);
  }, [document]);
  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title={t('documents.save_label')}
      footerBtn={[
        <Button color="default" key="cancel" onClick={() => setOpen(false)} className="mr-2" disabled={loading}>
          {t("btn_cancel")}
        </Button>,
        <Button color={loading ? 'secondary' : 'primary'} key="save" type="submit" disabled={loading} onClick={handleUpdateDocument}>
          {loading ? <Loading color="light" /> : t("btn_save")}
        </Button>
      ]}
    >
      <div className="row">
        <div className="col-12 mt-2 text-secondary pointer" onClick={() => setShareType (1)}>
          <FontAwesomeIcon
            className={shareType === 1 ? 'text-primary' : ''} 
            icon={shareType === 1 ? faCheckSquare : faSquare} 
            style={{ fontSize: 16 }} /> {t('documents.just_you')}
        </div>
        <div className="col-12 mt-2 text-secondary pointer" onClick={() => setShareType (2)}>
          <FontAwesomeIcon 
            className={shareType === 2 ? 'text-primary' : ''} 
            icon={shareType === 2 ? faCheckSquare : faSquare} 
            style={{ fontSize: 16 }} /> {t('documents.share_with_member')}
        </div>
        <div className="col-12 mt-2 text-secondary pointer" onClick={() => setShareType (3)}>
          <FontAwesomeIcon 
            className={shareType === 3 ? 'text-primary' : ''} 
            icon={shareType === 3 ? faCheckSquare : faSquare} 
            style={{ fontSize: 16 }} /> {t('documents.share_in_project_label')}
        </div>
        {shareType === 2 && <DocumentMemberList setUserShare={setUserShare} userShare={userShare} workspaceId={document.workspace_id} />}
        {shareType === 3 && <DocumentProjectList setProjectShare={setProjectShare} projectShare={projectShare} workspaceId={document.workspace_id} />}
      </div>
    </Modal>
  )
}
export default DocumentSetting;