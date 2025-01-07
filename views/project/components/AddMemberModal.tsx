import { sendInvite, userInvite } from "@/api/project.api";
import Button from "@/common/components/Button";
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
import { faEnvelope, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface AddMemberModalProps {
  openModal: boolean
  setOpenModal: (openModal: boolean) => void
  projectId: number
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ openModal, setOpenModal, projectId }) => {
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppErrorType | null>(null);
  const [keyword, setKeyword] = useState<string>('');
  const [debounceKeyword, setDebounceKeyword] = useState<string>('');
  const [memberData, setMemberData] = useState<ResponseUserDataType[]>();
  const [userSendData, setUserSendData] = useState<ResponseUserDataType[]>([]);
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
        if (!openModal || !workspace) {
          return;
        }
        setError(null);
        const response = await userInvite(workspace.id, projectId, keyword);
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
        title="Add member"
        setShow={setOpenModal}
      />
      <ModalBody>
        <div className="row mb-2">
          {
            (memberData && memberData.length === 0) && 
            <div className="col-12">
              <h6 className="text-muted text-center">Invite list is empty</h6>
            </div>
          }
          {
            (error) && 
            <div className="col-12">
              <div className="alert alert-light alert-error">
                <b className="text-danger mt-2">Error: </b> {error.message}
              </div>
            </div>
          }
          <div className="col-12 mt-2">
            {(memberData && memberData.length > 0) && <label htmlFor="searchMember" className="text-secondary">Add member</label>}
            {(memberData && memberData.length > 4) && <Input type="text" id="searchMember" placeholder="Enter name or email" onChange={handleChangeKeyword} />}
            {
              (memberData) &&
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
          {
            userSendData.map((user, index) => (
              <div className="col-12 mt-2" key={index}>
                <span className="badge badge-secondary send-to-item w-100 text-left">
                  Send to: <i>{user.email}</i>
                  <FontAwesomeIcon icon={faTimesCircle} className="ml-2 float-right" style={{ fontSize: 17 }} onClick={() => handleRemoveUserSend (user)} />
                </span>
              </div>
            ))
          }
          {
            (memberData && memberData.length > 0) && 
            <div className="col-12 mt-4">
              <Button color="primary" className="float-right" disabled={loading} onClick={handleSubmitSendInvite}>
                {loading ? <Loading color="light" /> : 'Send'}
              </Button>
              <Button color="secondary" className="float-right mr-2" outline disabled={loading} onClick={() => setOpenModal (false)}>Cancel</Button>
            </div>
          }
        </div>
      </ModalBody>
    </Modal>
  )
}
export default AddMemberModal;