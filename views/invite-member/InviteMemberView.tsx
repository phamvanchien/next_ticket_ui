import { users } from "@/api/user.api";
import { sendInvite, userInvite } from "@/api/workspace.api";
import Button from "@/common/components/Button";
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
import { faCheckCircle, faEnvelope, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface InviteMemberViewProps {
  openModal: boolean | undefined
  setOpenModal: (openModal: boolean) => void
}

const InviteMemberView: React.FC<InviteMemberViewProps> = ({ openModal, setOpenModal }) => {
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
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
        title="Invite members"
        setShow={setOpenModal}
      />
      <ModalBody>
        <div className="row mb-2">
          {
            error ? <ErrorPage errorCode={500} /> :
            <>
              {
                userSendData.map((email, index) => (
                  <div className="col-12 mb-2" key={index}>
                    <span className="badge badge-secondary send-to-item w-100 text-left">
                      Send to: <i>{email}</i>
                      <FontAwesomeIcon icon={faTimesCircle} className="ml-2 float-right" style={{ fontSize: 17 }} onClick={() => handleRemoveUserSend (email)} />
                    </span>
                  </div>
                ))
              }
              {
                (errorSend) && <div className="alert alert-light alert-error">
                  <b className="text-danger mt-2">Error: </b> {errorSend.message}
                </div>
              }
              {
                emailSent.map((email, index) => (
                  <div className="col-12 mb-2" key={index}>
                    <span className="badge badge-success send-to-item w-100 text-left">
                      Send to: <i>{email}</i>
                      <FontAwesomeIcon icon={faCheckCircle} className="ml-2 float-right" style={{ fontSize: 17 }} />
                    </span>
                  </div>
                ))
              }
              <div className="col-12 mb-2">
                <label htmlFor="searchMember" className="text-muted">Email or name</label>
                <Input type="text" id="searchMember" placeholder="Enter name or email" onChange={handleChangeKeyword} disabled={loading} />
                {
                  (keyword && keyword !== '') &&
                  <ul className="list-group invite-group">
                    {
                      userData && userData.map(user => (
                        <li className="list-group-item invite-group-item" key={user.id} onClick={() => handleSelectUserSend (user.email)}>
                          {userSendData.includes(user.email) ? <FontAwesomeIcon icon={faCheckCircle} className="text-success" onClick={() => handleRemoveUserSend (user.email)} /> : <FontAwesomeIcon icon={faEnvelope} />} {user.email}
                        </li>
                      ))
                    }
                  </ul>
                }
              </div>
              <div className="col-12">
                <Button color="secondary" className="float-right" outline onClick={handleCancelModal} disabled={loading}>Cancel</Button>
                <Button color="primary" className="float-right mr-2" onClick={handleSubmitSend} disabled={loading}>
                  {loading ? <Loading color="light" /> : 'Send invite'}
                </Button>
              </div>
            </>
          }
        </div>
      </ModalBody>
    </Modal>
  )
}
export default InviteMemberView;