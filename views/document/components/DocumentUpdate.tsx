import { update } from "@/api/document.api";
import Button from "@/common/components/Button";
import EditorArea from "@/common/components/EditorArea";
import Input from "@/common/components/Input";
import Loading from "@/common/components/Loading";
import Modal from "@/common/modal/Modal";
import ModalBody from "@/common/modal/ModalBody";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { catchError } from "@/services/base.service";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import { DocumentType, MemberShareType, UpdateDocumentRequestType } from "@/types/document.type";
import { ProjectType } from "@/types/project.type";
import { dateToString, formatTime } from "@/utils/helper.util";
import { faArrowCircleLeft, faCircle, faCircleCheck, faGear, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import DocumentMemberList from "./DocumentMemberList";
import DocumentProjectList from "./DocumentProjectList";
import DocumentAlertPrivate from "./DocumentAlertPrivate";
import DocumentMemberShared from "./DocumentMemberShared";
import DocumentProjectShared from "./DocumentProjectShared";
import DocumentShareType from "./DocumentShareType";
import ErrorAlert from "@/common/components/ErrorAlert";
import { useTranslations } from "next-intl";

interface DocumentUpdateProps {
  documentUpdate?: DocumentType
  setDocumentUpdate: (documentUpdate?: DocumentType) => void
  setDocumentUpdated: (documentUpdated?: DocumentType) => void
}

const DocumentUpdate: React.FC<DocumentUpdateProps> = ({ documentUpdate, setDocumentUpdate, setDocumentUpdated }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppErrorType | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [documentPublic, setDocumentPublic] = useState(false);
  const [shareType, setShareType] = useState(documentUpdate?.share_type);
  const [projectShare, setProjectShare] = useState<ProjectType[]>([]);
  const [memberShare, setMemberShare] = useState<MemberShareType[]>([]);
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState<string>();
  const [modifyAt, setModifyAt] = useState<string>();
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const titleRef = useRef<HTMLInputElement>(null);
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const t = useTranslations();

  const handleUpdateDocument = async (payload: UpdateDocumentRequestType) => {
    try {
      if (!workspace || !documentUpdate) {
        return;
      }
  
      setLoading(true);
      setDocumentUpdated(undefined);
      const response = await update (workspace.id, documentUpdate.id, payload);
  
      setLoading(false);
      if (response && response.code === API_CODE.OK) {
        setDocumentUpdated(response.data);
        setOpenModal(false);
        setTitle(response.data.title);
        setContent(response.data.content);
        return;
      }
      setError(catchError(response));
    } catch (error) {
      setError(catchError(error as BaseResponseType));
    }
  }

  const handleUpdateContent = () => {
    if (!content || content === '') {
      return;
    }

    handleUpdateDocument({
      title: titleRef.current?.value,
      content: content
    });
  }

  const handleUpdateSetting = () => {
    if (!documentPublic && shareType === 1 && projectShare.length === 0) {
      return;
    }
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
    handleUpdateDocument({
      public: documentPublic,
      share_type: shareType,
      user_share: (documentPublic) ? undefined : payloadMember,
      project_share: documentPublic ? undefined : projectShare.map(p => p.id)
    })
  }
  const handleSetTypeShare = (type: number) => {
    setShareType(type);
  }
  const handleCancelEdit = () => {
    setOpenModal(false);
    setEdit(false);
    setDocumentUpdate(undefined);
  }
  useEffect(() => {
    if (!documentUpdate) {
      return;
    }
    setEdit(false);
    setModifyAt(formatTime(new Date(documentUpdate.updated_at)))
    setTitle(documentUpdate.title);
    setShareType(documentUpdate.share_type);
    setDocumentPublic(documentUpdate.is_public);
    setProjectShare(documentUpdate.projects_share);
    setMemberShare(documentUpdate.members_share);
    setContent(documentUpdate.content);
  }, [documentUpdate]);
  return <>
    <div id="wrapper">
      <div id="sidebar-wrapper" className={documentUpdate ? 'open-sidebar-create-document' : 'close-sidebar'} style={
        {marginRight: documentUpdate ? -250 : -275}
      }>
        <div className="row mt-4">
          {
            !edit &&
            <>
              <div className="col-12 mb-2">
                <Button color="secondary" className="mr-2" onClick={handleCancelEdit}>
                  <FontAwesomeIcon icon={faArrowCircleLeft} />
                </Button>
                {
                  documentUpdate?.full_permission &&
                  <Button color="primary" className="mr-2" onClick={() => setEdit (true)}>
                    {t('tasks.edit_label')} <FontAwesomeIcon icon={faPencil} />
                  </Button>
                }
                {
                  userLogged?.id === documentUpdate?.user_id &&
                  <Button color="secondary" outline onClick={() => setOpenModal (true)}>
                    <FontAwesomeIcon icon={faGear} />
                  </Button>
                }
              </div>
              <div className="col-12 mt-2 mb-2">
                <span className="text-muted" style={{ fontSize: 13 }}>{t('documents.last_modify_label')} {documentUpdate?.updator.first_name} {documentUpdate?.updator.last_name}</span>
                <h4>{title}</h4>
              </div>
              <div className="col-12">
                {
                  documentUpdate &&
                  <p
                    dangerouslySetInnerHTML={{
                      __html: content,
                    }}
                  ></p>
                }
              </div>
            </>
          }
          {
            (edit) &&
            <>
            <div className="col-12 mb-2">
              <Button color="secondary" className="float-left mr-2" onClick={() => setDocumentUpdate (undefined)} disabled={loading}>
                <FontAwesomeIcon icon={faArrowCircleLeft} />
              </Button>
              <Button color="secondary" className="float-left mr-2" outline onClick={() => setEdit (false)} disabled={loading}>
                Cancel
              </Button>
              <Button color="primary" className="float-left mr-2" onClick={handleUpdateContent} disabled={loading}>
                {loading ? <Loading color="light" /> : 'Save'}
              </Button>
              {
                userLogged?.id === documentUpdate?.user_id &&
                <Button color="secondary" className="float-left" outline onClick={() => setOpenModal (true)} disabled={loading}>
                  <FontAwesomeIcon icon={faGear} />
                </Button>
              }
            </div>
            <div className="col-12 mb-2">
              <Input type="text" className="input-title" id="documentTitle" defaultValue={title ?? 'New document ' + dateToString(new Date())} ref={titleRef} />
            </div>
            <div className="col-12">
              <EditorArea setValue={setContent} value={content} toolbarExtra placeholder="Document text here ..." />
            </div>
            </>
          }
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
                  <Button color="primary" className="float-right ml-2" disabled={loading} onClick={handleUpdateSetting}>
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
export default DocumentUpdate;