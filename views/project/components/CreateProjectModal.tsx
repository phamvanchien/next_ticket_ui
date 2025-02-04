import { create } from "@/api/project.api";
import { members } from "@/api/workspace.api";
import Button from "@/common/components/Button";
import ErrorAlert from "@/common/components/ErrorAlert";
import Input from "@/common/components/Input";
import Loading from "@/common/components/Loading";
import Textarea from "@/common/components/Textarea";
import Modal from "@/common/modal/Modal";
import ModalBody from "@/common/modal/ModalBody";
import ModalHeader from "@/common/modal/ModalHeader";
import { API_CODE } from "@/enums/api.enum";
import { APP_VALIDATE_TYPE } from "@/enums/app.enum";
import { PROJECT_VALIDATE_ENUM } from "@/enums/project.enum";
import { RootState } from "@/reduxs/store.redux";
import { catchError, hasError, validateInput } from "@/services/base.service";
import { AppErrorType, BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
import { ResponseUserDataType } from "@/types/user.type";
import { faEnvelope, faTimesCircle, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface CreateProjectModalProps {
  openModal: boolean
  setOpenModal: (openModal: boolean) => void
  loadProjects: () => void
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ openModal, setOpenModal, loadProjects }) => {
  const [memberData, setMemberData] = useState<ResponseWithPaginationType<ResponseUserDataType[]>>();
  const [error, setError] = useState<AppErrorType | null>(null);
  const [keyword, setKeyword] = useState<string>('');
  const [debounceKeyword, setDebounceKeyword] = useState<string>('');
  const [projectType, setProjectType] = useState<"private" | "public">("public");
  const [userSendData, setUserSendData] = useState<ResponseUserDataType[]>([]);
  const [projectName, setProjectName] = useState<string>();
  const [validateError, setValidateError] = useState<AppErrorType[] | []>([]);
  const [loading, setLoading] = useState(false);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const t = useTranslations();
  const handleChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setKeyword('');
    if (event.target.value && event.target.value !== '') {
      setKeyword(event.target.value);
    }
  }
  const handleSelectUserSend = (user: ResponseUserDataType) => {
    const added = userSendData.find(u => u.id === user.id);
    if (!added) {
      setUserSendData([...userSendData, user]);
    }
  }
  const handleRemoveUserSend = (user: ResponseUserDataType) => {
    const removed = userSendData.filter(u => u.id !== user.id);
    setUserSendData(removed);
  }
  const handleValidateName = (value: string = projectName ?? '') => {
    const required = validateInput('name', value ?? '', t('create_project.project_name_required'), APP_VALIDATE_TYPE.REQUIRED, validateError, setValidateError);
    if (!required) {
      return false;
    }
    return true;
  }
  const handleProjectNameInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProjectName(event.target.value);
    handleValidateName(event.target.value);
  }
  const handleCheckProjectType = (event: ChangeEvent<HTMLInputElement>) => {
    setProjectType(event.target.dataset.type as "private" | "public");
  }
  const handleSubmitProject = async () => {
    try {
      if (!workspace || !projectName) {
        return;
      }

      setError(null);
      setLoading(true);
      const response = await create(workspace.id, {
        name: projectName,
        description: descriptionRef.current?.value ?? undefined,
        is_public: projectType === 'public',
        members: userSendData.map(u => u.id)
      });
      setLoading(false);
      if (response && response.code === API_CODE.CREATED) {
        loadProjects();
        setUserSendData([]);
        setProjectName(undefined);
        const inputSearch = document.getElementById('searchMember') as HTMLInputElement;
        if (inputSearch) {
          inputSearch.value = '';
        }
        const inputName = document.getElementById('projectName') as HTMLInputElement;
        if (inputName) {
          inputName.value = '';
        }
        const inputDescription = document.getElementById('projectDescription') as HTMLTextAreaElement;
        if (inputDescription) {
          inputDescription.value = '';
        }
        setError(null);
        setValidateError([]);
        setProjectType('public');
        setOpenModal(false);
        return;
      }
      setError(catchError(response));
    } catch (error) {
      setLoading(false);
      setError(catchError(error as BaseResponseType));
    }
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
    const loadUsers = async () => {
      try {
        if (!openModal || !workspace) {
          return;
        }
        setError(null);
        const response = await members(workspace.id, 1, 5, keyword);
        if (response && response.code === API_CODE.OK) {
          setMemberData(response.data);
          return;
        }
        setError(catchError(response));
      } catch (error) {
        setError(catchError(error as BaseResponseType));
      }
    }
    loadUsers();
  }, [openModal, debounceKeyword, workspace]);
  return (
    <Modal className="invite-modal" isOpen={openModal ? true : false}>
      <ModalHeader 
        title={t('create_project.page_title')}
        setShow={setOpenModal}
      />
      <ModalBody>
        <div className="row mb-2">
          <div className="col-12">
            <ErrorAlert error={error} />
          </div>
          <div className="col-12">
            <Input 
              minLength={3}
              maxLength={90}
              id="projectName"
              type="text" 
              placeholder={t('create_project.placeholder_input_project_name')} 
              onChange={handleProjectNameInputChange} 
              invalid={hasError(validateError, 'name')}
            />
          </div>
          <div className="col-12 mt-2">
            <Textarea maxLength={290} rows={3} placeholder={t('create_project.placeholder_project_description')} id="projectDescription" ref={descriptionRef}></Textarea>
          </div>
          <div className="col-6 mt-2">
            <div className="custom-control custom-radio">
              <Input 
                type="radio" 
                id="public_project" 
                name="project_type" 
                className="custom-control-input" 
                data-type={'public'} 
                onChange={handleCheckProjectType} 
              />
              <label htmlFor="public_project" className="custom-control-label text-secondary">{t('public_check')}</label>
            </div>
          </div>
          <div className="col-6 mt-2">
            <div className="custom-control custom-radio">
              <Input 
                type="radio" 
                id="private_project" 
                name="project_type" 
                className="custom-control-input" 
                data-type={'private'} 
                onChange={handleCheckProjectType} 
              />
              <label htmlFor="private_project" className="custom-control-label text-secondary">{t('private_check')}</label>
            </div>
          </div>
          {
            projectType === 'private' &&
            <div className="col-12 mt-2">
              {memberData && <label htmlFor="searchMember" className="text-secondary">{t('create_project.add_members_text')} <FontAwesomeIcon icon={faUserPlus} /></label>}
              {(memberData && memberData.total > 10) && <Input type="text" id="searchMember" placeholder={t('create_project.placeholder_input_search_member')} onChange={handleChangeKeyword} />}
              {(memberData && memberData.total === 0 && <h6 className="text-muted">{t('create_project.no_member_message')}</h6>)}
              {
                (memberData) &&
                <ul className="list-group invite-group">
                  {
                    memberData.items.map(member => (
                      <li className="list-group-item invite-group-item text-secondary" key={member.id} onClick={() => handleSelectUserSend (member)}>
                        <FontAwesomeIcon icon={faEnvelope} /> {member.email}
                      </li>
                    ))
                  }
                </ul>
              }
            </div>
          }
          {
            userSendData.map((user, index) => (
              <div className="col-12 mt-2" key={index}>
                <span className="badge badge-secondary send-to-item w-100 text-left">
                  {t('create_project.send_to_text')}: <i>{user.email}</i>
                  <FontAwesomeIcon icon={faTimesCircle} className="ml-2 float-right" style={{ fontSize: 17 }} onClick={() => handleRemoveUserSend (user)} />
                </span>
              </div>
            ))
          }
          <div className="col-12 mt-4">
            <Button color="primary" className="float-right" disabled={hasError(validateError) || loading} onClick={handleSubmitProject}>
              {loading ? <Loading color="light" /> : t('btn_create')}
            </Button>
            <Button color="secondary" className="float-right btn-no-border mr-2" outline onClick={() => setOpenModal (false)}>{t('btn_cancel')}</Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}
export default CreateProjectModal;