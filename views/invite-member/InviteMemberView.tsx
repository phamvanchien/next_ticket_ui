import { users } from "@/api/user.api";
import { sendInvite, userInvite } from "@/api/workspace.api";
import Button from "@/common/components/Button";
import ErrorAlert from "@/common/components/ErrorAlert";
import Input from "@/common/components/Input";
import Loading from "@/common/components/Loading";
import ErrorPage from "@/common/layouts/ErrorPage";
import Modal from "@/common/modal/Modal";
import ModalBody from "@/common/modal/ModalBody";
import ModalHeader from "@/common/modal/ModalHeader";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { catchError } from "@/services/base.service";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import { ResponseUserDataType } from "@/types/user.type";
import { faArrowCircleRight, faCheckCircle, faEnvelope, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface InviteMemberViewProps {
  openModal: boolean | undefined
  setOpenModal: (openModal: boolean) => void
}

const InviteMemberView: React.FC<InviteMemberViewProps> = ({ openModal, setOpenModal }) => {
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const t = useTranslations();
  const [userData, setUserData] = useState<ResponseUserDataType[]>();
  const [error, setError] = useState<AppErrorType | null>(null);
  const [errorSend, setErrorSend] = useState<AppErrorType | null>(null);
  const [keyword, setKeyword] = useState<string>('');
  const [debounceKeyword, setDebounceKeyword] = useState<string>('');
  const [userSendData, setUserSendData] = useState<string[]>([]);
  const [emailSent, setEmailSent] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const handleChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setKeyword('');
    if (event.target.value && event.target.value !== '') {
      setKeyword(event.target.value);
    }
  }
  const handleSelectUserSend = (email: string) => {
    const added = userSendData.find(u => u === email);
    if (!added) {
      setUserSendData([...userSendData, email]);
    }
  }
  const handleRemoveUserSend = (email: string) => {
    const removed = userSendData.filter(u => u !== email);
    setUserSendData(removed);
  }
  const resetInput = () => {
    const inputSearch = document.getElementById('searchMember') as HTMLInputElement;
    if (inputSearch) {
      inputSearch.value = '';
    }
  }
  const handleCancelModal = () => {
    setOpenModal(false);
    setUserSendData([]);
    setKeyword('')
    setDebounceKeyword('');
    resetInput();
    setEmailSent([]);
    setUserData(undefined);
  }
  const handleSubmitSend = async () => {
    if (userSendData.length === 0 || !workspace) {
      return;
    }

    try {
      setErrorSend(null);
      setLoading(true);
      setEmailSent([]);
      setUserData(undefined);
      resetInput();
      const response = await sendInvite(workspace.id, userSendData.join(','));
      if (response && response.code === API_CODE.OK) {
        setUserSendData([]);
        setEmailSent(response.data);
        setLoading(false);
        return;
      }
      setErrorSend(catchError(response));
    } catch (error) {
      setErrorSend(catchError(error as BaseResponseType));
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
        if (!userLogged || !openModal || !keyword || !workspace) {
          setUserData(undefined);
          return;
        }
        setError(null);
        const response = await userInvite(workspace.id, keyword);
        if (response && response.code === API_CODE.OK) {
          setUserData(response.data);
          return;
        }
        setError(catchError(response));
      } catch (error) {
        setError(catchError(error as BaseResponseType));
      }
    }
    loadUsers();
  }, [openModal, debounceKeyword]);
  return (
    <Modal className="invite-modal" isOpen={openModal ? true : false}>
      <ModalHeader 
        title={t('add_member_project.page_title')}
        setShow={setOpenModal}
      />
      <ModalBody>
        <div className="row mb-2">
          {
            error ? <div className="col-12">
              <ErrorAlert error={error} />
            </div> :
            <>
              {
                userSendData.map((email, index) => (
                  <div className="col-12 mb-2" key={index}>
                    <span className="badge badge-secondary send-to-item w-100 text-left">
                      <FontAwesomeIcon icon={faArrowCircleRight} /> {t('create_project.send_to_text')}: <i>{email}</i>
                      <FontAwesomeIcon icon={faTimesCircle} className="ml-2 float-right" style={{ fontSize: 17 }} onClick={() => handleRemoveUserSend (email)} />
                    </span>
                  </div>
                ))
              }
              <ErrorAlert error={errorSend} />
              {
                emailSent.map((email, index) => (
                  <div className="col-12 mb-2" key={index}>
                    <span className="badge badge-success send-to-item w-100 text-left">
                      <i>{email}</i>
                      <FontAwesomeIcon icon={faCheckCircle} className="ml-2 float-right" style={{ fontSize: 17 }} />
                    </span>
                  </div>
                ))
              }
              <div className="col-12 mb-2">
                <Input type="text" id="searchMember" placeholder={t('create_project.placeholder_input_search_member')} onChange={handleChangeKeyword} disabled={loading} />
                {
                  (keyword && keyword !== '') &&
                  <ul className="list-group invite-group">
                    {
                      userData && userData.map(user => (
                        <li className="list-group-item invite-group-item" key={user.id} onClick={() => handleSelectUserSend (user.email)}>
                          <FontAwesomeIcon icon={faEnvelope} /> {user.email} {userSendData.includes(user.email) && <FontAwesomeIcon icon={faCheckCircle} className="text-primary float-right" onClick={() => handleRemoveUserSend (user.email)} />}
                        </li>
                      ))
                    }
                  </ul>
                }
              </div>
              <div className="col-12 mt-2">
                <Button color="primary" className="float-right ml-2" onClick={handleSubmitSend} disabled={loading}>
                  {loading ? <Loading color="light" /> : t('btn_send')}
                </Button>
                <Button color="secondary" className="float-right btn-no-border" outline onClick={handleCancelModal} disabled={loading}>{t('btn_cancel')}</Button>
              </div>
            </>
          }
        </div>
      </ModalBody>
    </Modal>
  )
}
export default InviteMemberView;