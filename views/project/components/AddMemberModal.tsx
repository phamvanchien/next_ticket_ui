import { sendInvite, userInvite } from "@/api/project.api";
import Button from "@/common/components/Button";
import ErrorAlert from "@/common/components/ErrorAlert";
import Input from "@/common/components/Input";
import Loading from "@/common/components/Loading";
import Modal from "@/common/modal/Modal";
import ModalBody from "@/common/modal/ModalBody";
import ModalHeader from "@/common/modal/ModalHeader";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { catchError } from "@/services/base.service";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import { ResponseUserDataType } from "@/types/user.type";
import { faEnvelope, faTimesCircle, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface AddMemberModalProps {
  openModal: boolean
  setOpenModal: (openModal: boolean) => void
  projectId: number
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ openModal, setOpenModal, projectId }) => {
  const t = useTranslations();
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppErrorType | null>(null);
  const [keyword, setKeyword] = useState<string>('');
  const [debounceKeyword, setDebounceKeyword] = useState<string>('');
  const [memberData, setMemberData] = useState<ResponseUserDataType[]>();
  const [userSendData, setUserSendData] = useState<ResponseUserDataType[]>([]);
  const [loadingList, setLoadingList] = useState(false);
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
  const handleSubmitSendInvite = async () => {
    try {
      if (userSendData.length === 0 || !workspace) {
        return;
      }

      setLoading(true);
      setError(null);
      const response = await sendInvite(workspace.id, projectId, {
        members: userSendData.map(u => u.id)
      });

      setLoading(false);
      if (response && response.code === API_CODE.OK) {
        setOpenModal(false);
        setUserSendData([]);
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
        if (!openModal || !workspace || !keyword) {
          setMemberData(undefined);
          return;
        }
        setError(null);
        setLoadingList(true);
        const response = await userInvite(workspace.id, projectId, keyword);
        setLoadingList(false);
        if (response && response.code === API_CODE.OK) {
          setMemberData(response.data);
          return;
        }
        setError(catchError(response));
      } catch (error) {
        setLoadingList(false);
        setError(catchError(error as BaseResponseType));
      }
    }
    loadUsers();
  }, [openModal, debounceKeyword, workspace]);
  return (
    <Modal className="invite-modal" isOpen={openModal ? true : false}>
      <ModalHeader 
        title={t('add_member_project.page_title')}
        setShow={setOpenModal}
      />
      <ModalBody>
        <div className="row mb-2">
          {
            (error) && 
            <div className="col-12">
              <ErrorAlert error={error} />
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
          <div className="col-12 mt-2">
            <Input type="text" id="searchMember" placeholder={t('create_project.placeholder_input_search_member')} onChange={handleChangeKeyword} />
            {loadingList && <center><Loading color="secondary" className="mt-2" /></center>}
            {
              (memberData && keyword && keyword !== '') &&
              <ul className="list-group invite-group">
                {
                  memberData.map(member => (
                    <li className="list-group-item invite-group-item" key={member.id} onClick={() => handleSelectUserSend (member)}>
                      <FontAwesomeIcon icon={faEnvelope} /> {member.email}
                    </li>
                  ))
                }
              </ul>
            }
          </div>
          <div className="col-12 mt-4">
            <Button color="primary" className="float-right" disabled={loading} onClick={handleSubmitSendInvite}>
              {loading ? <Loading color="light" /> : t('btn_send')}
            </Button>
            <Button color="secondary" className="float-right mr-2 btn-no-border" outline disabled={loading} onClick={() => setOpenModal (false)}>{t('btn_cancel')}</Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}
export default AddMemberModal;