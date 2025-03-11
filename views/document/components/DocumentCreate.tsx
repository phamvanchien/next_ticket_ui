import { create } from "@/api/document.api";
import Button from "@/common/components/Button";
import EditorArea from "@/common/components/EditorArea";
import Input from "@/common/components/Input";
import Modal from "@/common/modal/Modal";
import ModalBody from "@/common/modal/ModalBody";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { catchError } from "@/services/base.service";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import { ProjectType } from "@/types/project.type";
import { dateToString } from "@/utils/helper.util";
import { faCircle, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import DocumentMemberList from "./DocumentMemberList";
import { MemberShareType } from "@/types/document.type";
import DocumentProjectList from "./DocumentProjectList";
import DocumentAlertPrivate from "./DocumentAlertPrivate";
import DocumentProjectShared from "./DocumentProjectShared";
import DocumentMemberShared from "./DocumentMemberShared";
import DocumentShareType from "./DocumentShareType";
import Loading from "@/common/components/Loading";
import ErrorAlert from "@/common/components/ErrorAlert";
import { useTranslations } from "next-intl";

interface DocumentCreateProps {
  openCreate: boolean
  setOpenCreate: (openCreate: boolean) => void
  loadDocuments: () => void
}

const DocumentCreate: React.FC<DocumentCreateProps> = ({ openCreate, setOpenCreate, loadDocuments }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppErrorType | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [documentPublic, setDocumentPublic] = useState(true);
  const [shareType, setShareType] = useState(1);
  const [projectShare, setProjectShare] = useState<ProjectType[]>([]);
  const [memberShare, setMemberShare] = useState<MemberShareType[]>([]);
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const titleRef = useRef<HTMLInputElement>(null);
  const t = useTranslations();
  const handleCreateDocument = async () => {
    try {
      if (!workspace || !content || content === '' || !titleRef.current || (titleRef.current && titleRef.current.value && titleRef.current.value === '')) {
        return;
      }
  
      setLoading(true);
      const payloadMember = [];
      for (let i = 0; i < memberShare.length; i++) {
        const userId = memberShare[i].id;
        const checkboxPermission = document.getElementById(`userSharePermission${userId}`) as HTMLInputElement;
        if (checkboxPermission) {
          payloadMember.push({
            id: userId,
            permission: checkboxPermission.checked ? 1 : 2
          });
        }
      }
      const response = await create (workspace.id, {
        title: titleRef.current.value,
        content: content,
        public: documentPublic,
        user_share: (documentPublic) ? undefined : payloadMember,
        project_share: documentPublic ? undefined : projectShare.map(p => p.id)
      });
  
      setLoading(false);
      if (response && response.code === API_CODE.CREATED) {
        loadDocuments();
        setProjectShare([]);
        setMemberShare([]);
        setContent('');
        const inputTitle = document.getElementById('documentTitle') as HTMLInputElement;
        if (inputTitle) {
          inputTitle.value = t('documents.document_title_default') +" " + dateToString(new Date());
        }
        setOpenModal(false);
        setOpenCreate(false);
        return;
      }
      setError(catchError(response));
    } catch (error) {
      setError(catchError(error as BaseResponseType));
    }
  }
  const handleSetTypeShare = (type: number) => {
    setShareType(type);
    setMemberShare([]);
    setProjectShare([]);
  }
  return <>
    <div id="wrapper">
      <div id="sidebar-wrapper" className={openCreate ? 'open-sidebar-create-document' : 'close-sidebar'} style={
        {marginRight: openCreate ? -250 : -275}
      }>
        <div className="row mt-4">
          <div className="col-12 mb-2">
            <Button color="secondary" className="float-left mr-2 btn-no-border" outline onClick={() => setOpenCreate (false)}>
              {t('btn_cancel')}
            </Button>
            <Button color="primary" className="float-left" onClick={(content && content !== '') ? () => setOpenModal (true) : undefined}>
              {t('btn_save')}
            </Button>
          </div>
          <div className="col-12 mb-2">
            <Input type="text" className="input-title" id="documentTitle" defaultValue={t('documents.document_title_default') + ' ' + dateToString(new Date())} ref={titleRef} />
          </div>
          <div className="col-12">
            <EditorArea setValue={setContent} value={content} toolbarExtra placeholder={t('documents.placeholder_document')} />
          </div>
          <Modal className="invite-modal" isOpen={openModal ? true : false}>
            <ModalBody>
              <div className="row mb-2">
                <div className="col-12 mb-2">
                  <ErrorAlert error={error} />
                </div>
                <div className="col-12">
                  <FontAwesomeIcon 
                    icon={documentPublic ? faCircleCheck : faCircle} 
                    className={`text-${documentPublic ? 'primary' : 'secondary'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setDocumentPublic (true)}
                  /> {t('public_check')}
                  <br/>
                  <FontAwesomeIcon 
                    icon={!documentPublic ? faCircleCheck : faCircle} 
                    className={`text-${!documentPublic ? 'primary' : 'secondary'} mt-2`} 
                    style={{ cursor: 'pointer' }}
                    onClick={() => setDocumentPublic (false)}
                  /> {t('private_check')}
                </div>
                {
                  !documentPublic &&
                  <DocumentShareType
                    shareType={shareType}
                    setShareType={handleSetTypeShare}
                  />
                }
                {
                  (!documentPublic && shareType === 1 && projectShare.length > 0) &&
                  <DocumentProjectShared
                    setProjectShared={setProjectShare}
                    projectShared={projectShare}
                  />
                }
                {
                  !documentPublic && shareType === 2 &&
                  <DocumentAlertPrivate />
                }
                {
                  (!documentPublic && shareType === 2 && memberShare.length > 0) &&
                  <DocumentMemberShared
                    setMemberShared={setMemberShare}
                    memberShared={memberShare}
                  />
                }
                {
                  (!documentPublic && shareType === 1) &&
                  <DocumentProjectList
                    setProjectShared={setProjectShare}
                    projectShared={projectShare}
                  />
                }
                {
                  (!documentPublic && shareType === 2) &&
                  <DocumentMemberList
                    setMemberShared={setMemberShare}
                    memberShared={memberShare}
                  />
                }
                <div className="col-12 mt-4">
                  <Button color="primary" className="float-right ml-2" disabled={loading} onClick={handleCreateDocument}>
                    {loading ? <Loading color="light" /> : t('btn_save')}
                  </Button>
                  <Button color="secondary" className="float-right btn-no-border" outline onClick={() => setOpenModal (false)} disabled={loading}>
                    {t('btn_cancel')}
                  </Button>
                </div>
              </div>
            </ModalBody>
          </Modal>
        </div>
      </div>
    </div>
  </>
}
export default DocumentCreate;