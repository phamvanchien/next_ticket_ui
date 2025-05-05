import { sendInvite, userInvite } from "@/api/workspace.api";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import Loading from "@/common/components/Loading";
import Modal from "@/common/components/Modal";
import UserAvatar from "@/common/components/AvatarName";
import { API_CODE } from "@/enums/api.enum";
import useDelaySearch from "@/hooks/useDelaySearch";
import { BaseResponseType } from "@/types/base.type";
import { UserType } from "@/types/user.type";
import { displayMessage, displaySmallMessage } from "@/utils/helper.util";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface WorkspaceAddMemberProps {
  workspaceId?: number;
  setOpenModal: (workspaceId?: number) => void;
}

const WorkspaceAddMember: React.FC<WorkspaceAddMemberProps> = ({ workspaceId, setOpenModal }) => {
  const t = useTranslations();
  const [userInviteData, setUserInviteData] = useState<UserType[]>([]);
  const [userSelected, setUserSelected] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(!!workspaceId);
  const [sendLoading, setSendLoading] = useState(false);
  const { value: keyword, debouncedValue, handleChange } = useDelaySearch("", 1000);

  const loadUsersInvite = async () => {
    if (!workspaceId) return;
    setLoading(true);
    try {
      const response = await userInvite(workspaceId, debouncedValue);
      if (response?.code === API_CODE.OK) {
        setTimeout(() => {
          setUserInviteData(response.data);
          setLoading(false);
        }, 1000);
      }
      setLoading(false);
    } catch (error) {
      displaySmallMessage("error", (error as BaseResponseType).error?.message);
    }
    setLoading(false);
  };

  const resetKeyword = () => {
    handleChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
  }

  const handleSendInvite = async () => {
    try {
      if (!workspaceId || userSelected.length === 0) return;
      setSendLoading(true);
      const response = await sendInvite(
        workspaceId,
        userSelected.map(u => u.email).join(',')
      );
      setSendLoading(false);
      if (response && response.code === API_CODE.OK) {
        displayMessage("success", t('workspaces_page.member.success.send_invite_success'));
        setOpenModal(undefined);
        setOpen(false);
        setUserSelected([]);
        setUserInviteData([]);
        resetKeyword();
        return;
      }
      displayMessage("error", response.error?.message);
    } catch (error) {
      setSendLoading(false);
      displayMessage("error", (error as BaseResponseType).error?.message);
    }
  }

  useEffect(() => {
    loadUsersInvite();
  }, [debouncedValue, workspaceId]);

  useEffect(() => {
    if (!open){ 
      setOpenModal(undefined);
      resetKeyword();
    }
  }, [open]);

  useEffect(() => {
    setOpen(!!workspaceId);
    if (!workspaceId) {
      resetKeyword();
    }
  }, [workspaceId]);

  const handleSelectUser = (user: UserType) => {
    if (!userSelected.some((u) => u.id === user.id)) {
      setUserSelected([...userSelected, user]);
    }
  };

  const handleRemoveUser = (userId: number) => {
    setUserSelected(userSelected.filter((user) => user.id !== userId));
  };

  return (
    <Modal
      open={open}
      title={t("workspaces_page.member.add_title")}
      footerBtn={[
        <Button color="default" key="cancel" onClick={() => setOpenModal(undefined)} className="mr-2" disabled={sendLoading}>
          {t("common.btn_cancel")}
        </Button>,
        <Button color={sendLoading ? 'secondary' : 'primary'} key="save" type="submit" onClick={handleSendInvite} disabled={sendLoading || userSelected.length === 0}>
          {sendLoading ? <Loading color="light" /> : t("common.btn_send")}
        </Button>,
      ]}
      setOpen={setOpen}
    >
      <div className="row">
        <div className="col-12">
          <Input
            type="search"
            value={keyword}
            onChange={handleChange}
            placeholder={t("workspaces_page.member.placeholder_input_search_user_invite")}
            disabled={sendLoading}
          />
          {loading && (
            <center>
              <Loading className="mt-2" color="secondary" size={20} />
            </center>
          )}
          {!loading && debouncedValue && userInviteData.filter((user) => !userSelected.some((u) => u.id === user.id)).length > 0 && (
            <div className="dropdown-member-container">
              {userInviteData.filter((user) => !userSelected.some((u) => u.id === user.id)).map((user) => (
                  <div key={user.id} className="dropdown-member-item" onClick={() => handleSelectUser(user)}>
                    <UserAvatar name={user.first_name} avatar={user.avatar} className="me-2" />
                    <span>{user.first_name} {user.last_name}</span>
                  </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-12 mt-3">
          {userSelected.length > 0 && (
            <div className="selected-user-list">
              {userSelected.map((user) => (
                <div key={user.id} className="selected-user-item">
                  <UserAvatar name={user.first_name} avatar={user.avatar} className="me-2" />
                  <span>{user.first_name} {user.last_name}</span>
                  <FontAwesomeIcon icon={faTimes} className="remove-icon" onClick={() => handleRemoveUser(user.id)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default WorkspaceAddMember;