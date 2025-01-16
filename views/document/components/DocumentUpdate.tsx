import { update } from "@/api/document.api";
import { projects } from "@/api/project.api";
import { members } from "@/api/workspace.api";
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
import { ProjectType, ResponseProjectsDataType } from "@/types/project.type";
import { ResponseUserDataType } from "@/types/user.type";
import { ResponseMemberWorkspaceDataType } from "@/types/workspace.type";
import { dateToString, formatTime } from "@/utils/helper.util";
import { faArrowCircleLeft, faCircle, faCircleCheck, faGear, faPencil, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface DocumentUpdateProps {
  documentUpdate?: DocumentType
  setDocumentUpdate: (documentUpdate?: DocumentType) => void
  setDocumentUpdated: (documentUpdated?: DocumentType) => void
}

const DocumentUpdate: React.FC<DocumentUpdateProps> = ({ documentUpdate, setDocumentUpdate, setDocumentUpdated }) => {
  const defaultPageSize = 5;
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppErrorType | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [documentPublic, setDocumentPublic] = useState(false);
  const [shareType, setShareType] = useState(documentUpdate?.share_type);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [keyword, setKeyword] = useState<string>('');
  const [debounceKeyword, setDebounceKeyword] = useState<string>('');
  const [keywordMember, setKeywordMember] = useState<string>('');
  const [debounceKeywordMember, setDebounceKeywordMember] = useState<string>('');
  const [projectData, setProjectData] = useState<ResponseProjectsDataType>();
  const [projectShare, setProjectShare] = useState<ProjectType[]>([]);
  const [memberShare, setMemberShare] = useState<MemberShareType[]>([]);
  const [workspaceMembers, setWorkspaceMembers] = useState<ResponseMemberWorkspaceDataType>();
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState<string>();
  const [modifyAt, setModifyAt] = useState<string>();
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const titleRef = useRef<HTMLInputElement>(null);
  const userLogged = useSelector((state: RootState) => state.userSlice).data;

  const handleUpdateDocument = async (payload: UpdateDocumentRequestType) => {
    if (!workspace || !documentUpdate) {
      return;
    }

    setLoading(true);
    setDocumentUpdated(undefined);
    const response = await update (workspace.id, documentUpdate.id, payload);

    setLoading(false);
    if (response && response.code === API_CODE.OK) {
      setDocumentUpdated(response.data);
      setKeyword('');
      setDebounceKeyword('');
      setOpenModal(false);
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
    if (!documentPublic && shareType === 2 && memberShare.length === 0) {
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

  const handleChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setKeyword('');
    if (event.target.value && event.target.value !== '') {
      setKeyword(event.target.value);
    }
  }
  const handleChangeKeywordMember = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setKeywordMember('');
    if (event.target.value && event.target.value !== '') {
      setKeywordMember(event.target.value);
    }
  }
  const handleSetTypeShare = (type: 1 | 2) => {
    setShareType(type);
    setKeyword('');
    setKeywordMember('');
    setDebounceKeyword('');
    setDebounceKeywordMember('');
    // setMemberShare([]);
    // setProjectShare([]);
  }
  const handleSelectProject = (project: ProjectType) => {
    const added = projectShare.find(p => p.id === project.id);
    if (!added) {
      setProjectShare([...projectShare, project]);
    }
  }
  const handleRemoveProject = (project: ProjectType) => {
    setProjectShare(
      projectShare.filter(p => p.id !== project.id)
    );
  }
  const handleSelectMember = (member: ResponseUserDataType) => {
    const added = memberShare.find(p => p.id === member.id);
    if (!added) {
      setMemberShare([...memberShare, {
        id: member.id,
        first_name: member.first_name,
        last_name: member.last_name,
        email: member.email,
        full_permission: false
      }]);
    }
  }
  const handleRemoveMember = (member: MemberShareType) => {
    setMemberShare(
      memberShare.filter(p => p.id !== member.id)
    );
  }
  const handleCancelEdit = () => {
    setOpenModal(false);
    setEdit(false);
    setDocumentUpdate(undefined);
  }
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceKeyword(keyword);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceKeywordMember(keywordMember);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [keywordMember]);
  const loadProjects = async () => {
    try {
      if (!workspace) {
        return;
      }
      const response = await projects(workspace.id, {
        page: 1,
        size: pageSize,
        keyword: keyword
      });
      setLoading(false);
      if (response && response.code === API_CODE.OK) {
        setProjectData(response.data);
        return;
      }
      setError(catchError(response));
    } catch (error) {
      setLoading(false);
      setError(catchError(error as BaseResponseType));
    }
  }
  useEffect(() => {
    loadProjects();
  }, [debounceKeyword, pageSize, workspace]);

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
    loadMembers();
  }, [workspace, debounceKeywordMember]);
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
                    Edit <FontAwesomeIcon icon={faPencil} />
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
                <span className="text-muted" style={{ fontSize: 13 }}>Modified at {modifyAt} by {documentUpdate?.updator.first_name} {documentUpdate?.updator.last_name}</span>
                <h4>{title}</h4>
              </div>
              <div className="col-12">
                {
                  documentUpdate &&
                  <p
                    dangerouslySetInnerHTML={{
                      __html: documentUpdate.content,
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
                  {
                    (error) && <div className="alert alert-light alert-error">
                      <b className="text-danger mt-2">Error: </b> {error.message}
                    </div>
                  }
                </div>
                <div className="col-12">
                  <FontAwesomeIcon 
                    icon={documentPublic ? faCircleCheck : faCircle} 
                    className={`text-${documentPublic ? 'primary' : 'secondary'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setDocumentPublic (true)}
                  /> Public
                  <br/>
                  <FontAwesomeIcon 
                    icon={!documentPublic ? faCircleCheck : faCircle} 
                    className={`text-${!documentPublic ? 'primary' : 'secondary'} mt-2`} 
                    style={{ cursor: 'pointer' }}
                    onClick={() => setDocumentPublic (false)}
                  /> Private
                </div>
                {
                  !documentPublic &&
                  <>
                    <div className="col-6 mt-2 mb-2">
                      <Button color="secondary" outline={shareType === 2} fullWidth className="float-left" onClick={() => handleSetTypeShare (1)}>
                        Share in project
                      </Button>
                    </div>
                    <div className="col-6 mt-2 mb-2">
                      <Button color="secondary" outline={shareType === 1} fullWidth className="float-left" onClick={() => handleSetTypeShare (2)}>
                        Share with member
                      </Button>
                    </div>
                  </>
                }
                {
                  (!documentPublic && shareType === 1 && projectShare.length > 0) &&
                  <div className="col-12 mt-2">
                    {
                      projectShare.map(project => (
                        <span className="badge badge-light mr-2" key={project.id}>
                          {project.name} <FontAwesomeIcon icon={faTimes} className="ml-2 pointer" onClick={() => handleRemoveProject (project)} />
                        </span>
                      ))
                    }
                  </div>
                }
                {
                  (!documentPublic && shareType === 2 && memberShare.length > 0) &&
                    memberShare.map(member => (
                      <div className="col-12" key={member.id}>
                        <div className="card">
                          <div className="row">
                            <div className="col-6">
                              <span className="badge badge-light">
                                <FontAwesomeIcon icon={faTimes} className="ml-2 pointer mr-2" onClick={() => handleRemoveMember (member)} /> {member.first_name} {member.last_name}
                              </span>
                            </div>
                            <div className="col-6">
                              <div className="custom-control custom-checkbox float-right mr-2">
                                <Input type="checkbox" className="custom-control-input" id={`userSharePermission${member.id}`} defaultChecked={member.full_permission} />
                                <label htmlFor={`userSharePermission${member.id}`} className="custom-control-label">All permission</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                }
                {
                  (!documentPublic && shareType === 1) &&
                  <div className="col-12 mt-2">
                    <Input type="search" placeholder="Search projects" className="w-100" onChange={handleChangeKeyword} />
                    <ul className="list-group invite-group">
                      {
                        projectData && projectData.items.map(project => (
                          <li className="list-group-item invite-group-item pointer" key={project.id} onClick={() => handleSelectProject (project)}>
                            <FontAwesomeIcon 
                              icon={projectShare.find(p => p.id === project.id) ? faCircleCheck : faCircle} 
                              className={`text-${projectShare.find(p => p.id === project.id) ? 'primary' : 'secondary'} mr-2`} 
                            /> {project.name}
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                }
                {
                  (!documentPublic && shareType === 2) &&
                  <div className="col-12 mt-2">
                    <Input type="search" placeholder="Search projects" className="w-100" onChange={handleChangeKeywordMember} />
                    <ul className="list-group invite-group">
                      {
                        workspaceMembers && workspaceMembers.items.map(member => (
                          <li className="list-group-item invite-group-item pointer" key={member.id} onClick={() => handleSelectMember (member)}>
                            <FontAwesomeIcon 
                              icon={memberShare.find(p => p.id === member.id) ? faCircleCheck : faCircle} 
                              className={`text-${memberShare.find(p => p.id === member.id) ? 'primary' : 'secondary'} mr-2`} 
                            /> {member.email}
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                }
                <div className="col-12 mt-4">
                  <Button color="secondary" className="float-right" outline onClick={() => setOpenModal (false)} disabled={loading}>
                    Cancel
                  </Button>
                  <Button color="primary" className="float-right mr-2" disabled={loading} onClick={handleUpdateSetting}>
                    Save
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