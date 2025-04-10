import { sendInvite, userInvite } from "@/api/project.api";
import UserAvatar from "@/common/components/AvatarName";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import Loading from "@/common/components/Loading";
import Modal from "@/common/components/Modal";
import { API_CODE } from "@/enums/api.enum";
import useDelaySearch from "@/hooks/useDelaySearch";
import { BaseResponseType } from "@/types/base.type";
import { UserType } from "@/types/user.type";
import { displayMessage, displaySmallMessage } from "@/utils/helper.util";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

interface ProjectAddMemberProps {
  projectId?: number;
  workspaceId: number;
  setOpenModal: (projectId?: number) => void;
}

interface UserSelectedType {
  user: UserType
  owner: number | null
}

const ProjectAddMember: React.FC<ProjectAddMemberProps> = ({ projectId, setOpenModal, workspaceId }) => {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const [userInviteData, setUserInviteData] = useState<UserType[]>([]);
  const [userSelected, setUserSelected] = useState<UserSelectedType[]>([]);
  const [open, setOpen] = useState(!!projectId);
  const [sendLoading, setSendLoading] = useState(false);
  const { value: keyword, debouncedValue, handleChange } = useDelaySearch("", 1000);
  const loadUsersInvite = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const response = await userInvite(workspaceId, projectId);
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
  useEffect(() => {
    loadUsersInvite();
  }, [debouncedValue, projectId]);

  useEffect(() => {
    if (!open){ 
      setOpenModal(undefined);
      resetKeyword();
    }
  }, [open]);

  useEffect(() => {
    setOpen(!!projectId);
    if (!projectId) {
      resetKeyword();
    }
  }, [projectId]);

  const handleSelectUser = (user: UserType) => {
    if (!userSelected.some((u) => u.user.id === user.id)) {
      setUserSelected([...userSelected, {user: user, owner: null}]);
    }
  };

  const handleRemoveUser = (userId: number) => {
    setUserSelected(userSelected.filter((user) => user.user.id !== userId));
  };

  const handleSendInvite = async () => {
    try {
      if (!projectId || userSelected.length === 0) return;
      setSendLoading(true);
      const response = await sendInvite(
        workspaceId,
        projectId,
        {
          members: userSelected.map(u => {
            return {
              id: u.user.id,
              owner: u.owner
            }
          })
        }
      );
      setSendLoading(false);
      if (response && response.code === API_CODE.OK) {
        displayMessage("success", t('create_project.send_invite_success_label'));
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

  const changeOwnerCheck = (userId: number) => {
    setUserSelected(prev =>
      prev.map(u => {
        if (u.user.id === userId) {
          return {
            ...u,
            owner: u.owner === 1 ? null : 1,
          };
        }
        return u;
      })
    );
  };

  return (
    <Modal
      open={open}
      title={t("create_project.add_members_text")}
      footerBtn={[
        <Button color="default" key="cancel" onClick={() => setOpenModal(undefined)} className="mr-2" disabled={sendLoading}>
          {t("btn_cancel")}
        </Button>,
        <Button 
          color={sendLoading ? 'secondary' : 'primary'} 
          key="save" 
          type="submit" disabled={sendLoading || userSelected.length === 0}
          onClick={handleSendInvite}
        >
          {sendLoading ? <Loading color="light" /> : t("btn_send")}
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
            placeholder={t("create_project.placeholder_input_search_member")}
            disabled={sendLoading}
          />
          {loading && (
            <center>
              <Loading className="mt-2" color="secondary" size={20} />
            </center>
          )}
          {!loading && debouncedValue && userInviteData.filter((user) => !userSelected.some((u) => u.user.id === user.id)).length > 0 && (
            <div className="dropdown-member-container">
              {userInviteData.filter((user) => !userSelected.some((u) => u.user.id === user.id)).map((user) => (
                  <div key={user.id} className="dropdown-member-item" onClick={() => handleSelectUser(user)}>
                    <UserAvatar name={user.first_name} avatar={user.avatar} className="me-2" />
                    <span>{user.first_name} {user.last_name}</span>
                  </div>
              ))}
            </div>
          )}
        </div>

        {userSelected.map((user) => (
          <div className="col-12 mt-3">
            <div key={user.user.id} className="selected-user-item-project">
              <FontAwesomeIcon icon={faTimes} className="remove-icon-member-project" onClick={() => handleRemoveUser(user.user.id)} />
              <UserAvatar name={user.user.first_name} avatar={user.user.avatar} className="me-2" />
              <span>{user.user.first_name} {user.user.last_name}</span>
              <div className="form-check mt-1 form-check-owner">
                <label className="form-check-label" htmlFor="ownerCheck">
                  {t('projects.owner_label')}
                </label>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={user.owner === 1}
                  id={`ownerCheck_${user.user.id}`}
                  onChange={() => changeOwnerCheck(user.user.id)}
                />

              </div>
            </div>
          </div>
        ))}

      </div>
    </Modal>
  );
}
export default ProjectAddMember;