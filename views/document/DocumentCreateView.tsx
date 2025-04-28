"use client"
import Button from "@/common/components/Button";
import EditorArea from "@/common/components/EditorArea";
import Input from "@/common/components/Input";
import Modal from "@/common/components/Modal";
import UploadFiles from "@/common/components/UploadFiles";
import { faCheckSquare, faLink, faPlus, faSave, faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UploadFile } from "antd";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import DocumentMemberList from "./components/DocumentMemberList";
import DocumentProjectList from "./components/DocumentProjectList";
import { displayMessage } from "@/utils/helper.util";
import { BaseResponseType } from "@/types/base.type";
import { create, uploadFiles } from "@/api/document.api";
import { API_CODE } from "@/enums/api.enum";
import { useRouter } from "next/navigation";
import Loading from "@/common/components/Loading";
import { UserType } from "@/types/user.type";
import { ProjectType } from "@/types/project.type";
import { MemberShareType } from "@/types/document.type";
import { setSidebarSelected } from "@/reduxs/menu.redux";
import { useAppDispatch } from "@/reduxs/store.redux";

interface DocumentCreateViewProps {
  workspaceId: number
}

const DocumentCreateView: React.FC<DocumentCreateViewProps> = ({ workspaceId }) => {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>('');
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [openSave, setOpenSave] = useState(false);
  const [shareType, setShareType] = useState(1);
  const [userShare, setUserShare] = useState<MemberShareType[]>([]);
  const [projectShare, setProjectShare] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(false);
  const handleCreateDocument = async () => {
    try {
      if ((!title || title === '') || description === '') {
        return;
      }

      if (shareType === 2 && (!userShare || (userShare && userShare.length === 0))) {
        return;
      }

      if (shareType === 3 && (!projectShare || (projectShare && projectShare.length === 0))) {
        return;
      }

      setLoading(true);
      const response = await create(workspaceId, {
        title: title,
        content: description,
        user_share: shareType === 2 ? userShare.map(member => {
          return {
            id: member.user.id,
            permission: member.permission
          }
        }) : [],
        project_share: shareType === 3 ? projectShare.map(project => project.id) : []
      });
      setLoading(false);
      if (response && response.code === API_CODE.CREATED) {
        if (files.length > 0) {
          uploadFiles(workspaceId, response.data.id, files.map(f => f.originFileObj) as File[]);
        }
        router.push(`/workspace/${workspaceId}/document`);
        return;
      }
      displayMessage('error', response.error?.message);
    } catch (error) {
      setLoading(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  useEffect(() => {
    dispatch(setSidebarSelected('document'));
  }, []);

  return (
    <div className="container-fluid px-3 py-3">
      <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
        <h3 className="mb-0">
          <FontAwesomeIcon icon={faPlus} className="text-primary me-2" />
          {t('documents.document_title_default')}
        </h3>
        <div className="d-flex gap-3">        
          <Button 
            color="primary" 
            className="d-flex align-items-center rounded d-none d-md-flex" 
            onClick={() => setOpenSave (true)}
            disabled={(!title || title === '') && description === ''}
          >
            <FontAwesomeIcon icon={faSave} style={{ marginRight: 5 }} /> {t('btn_save')}
          </Button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <Input type="text" placeholder={t('documents.placeholder_enter_title')} classInput="document-title" onChange={(e) => setTitle (e.target.value)} />
        </div>
        <div className="col-12 mt-4">
          <UploadFiles files={files} setFiles={setFiles}>
            <span className="text-secondary pointer">
              <FontAwesomeIcon icon={faLink} /> {t('tasks.attach_file')}
            </span>
          </UploadFiles>
        </div>
        <div className="col-12 mt-4">
          <EditorArea value={description} setValue={setDescription} />
        </div>
      </div>
      <Modal
        open={openSave}
        setOpen={setOpenSave}
        title={t('documents.save_label')}
        footerBtn={[
          <Button color="default" key="cancel" onClick={() => setOpenSave(false)} className="mr-2" disabled={loading}>
            {t("btn_cancel")}
          </Button>,
          <Button color={loading ? 'secondary' : 'primary'} key="save" type="submit" disabled={loading} onClick={handleCreateDocument}>
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
          {shareType === 2 && <DocumentMemberList setUserShare={setUserShare} userShare={userShare} workspaceId={workspaceId} />}
          {shareType === 3 && <DocumentProjectList setProjectShare={setProjectShare} projectShare={projectShare} workspaceId={workspaceId} />}
        </div>
      </Modal>
    </div>
  );
}
export default DocumentCreateView;