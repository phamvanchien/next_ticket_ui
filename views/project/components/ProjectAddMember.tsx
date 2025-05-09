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
import { faMinus, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Switch } from "antd";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface ProjectAddMemberProps {
  projectId?: number;
  workspaceId: number;
  open: boolean
  setOpenModal: (open: boolean) => void;
}

interface UserSelectedType {
  user: UserType
  owner: number | null
}

const ProjectAddMember: React.FC<ProjectAddMemberProps> = ({ projectId, open, setOpenModal, workspaceId }) => {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const [userInviteData, setUserInviteData] = useState<UserType[]>([]);
  const [userSelected, setUserSelected] = useState<UserSelectedType[]>([]);
  const [sendLoading, setSendLoading] = useState(false);
  const { value: keyword, debouncedValue, handleChange } = useDelaySearch("", 1000);
  const loadUsersInvite = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const response = await userInvite(workspaceId, projectId, debouncedValue);
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
        displayMessage("success", t('projects_page.invitation.send_invite_success_label'));
        setOpenModal(false);
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

  useEffect(() => {
    if (!open) {
      setUserSelected([]);
      setUserInviteData([]);
      resetKeyword();
    }
  }, [open]);

  return (
    <Modal
      open={open}
      title={t("projects_page.create.add_members_text")}
      footerBtn={[
        <Button color="default" key="cancel" onClick={() => setOpenModal(false)} className="mr-2" disabled={sendLoading}>
          {t("common.btn_cancel")}
        </Button>,
        <Button 
          color={sendLoading ? 'secondary' : 'primary'} 
          key="save" 
          type="submit" disabled={sendLoading || userSelected.length === 0}
          onClick={handleSendInvite}
        >
          {sendLoading ? <Loading color="light" /> : t("common.btn_send")}
        </Button>,
      ]}
      setOpen={setOpenModal}
    >
      <div className="row">
        <div className="col-12 col-lg-12">
          <div className="bg-white rounded-4 shadow-sm border p-3">
            <div className="d-flex justify-content-between align-items-center mb-3 px-2">
              <div className="position-relative w-100">
                <FontAwesomeIcon icon={faSearch} className="position-absolute ms-3 wp-search-icon" />
                <input
                  type="text"
                  className="form-control ps-5 rounded search-input float-right"
                  value={keyword}
                  onChange={handleChange}
                  placeholder={t("projects_page.create.placeholder_input_search_member")}
                  disabled={sendLoading}
                />
              </div>
            </div>
            {
              !loading && debouncedValue && userInviteData.filter((user) => !userSelected.some((u) => u.user.id === user.id)).length > 0 &&
              <div className="table-responsive mb-2">
                <table className="table align-middle mb-0">
                  <tbody>
                    {userInviteData.filter((user) => !userSelected.some((u) => u.user.id === user.id)).map((user, index) => (
                      <tr key={index} className="border-bottom pointer" onClick={() => handleSelectUser(user)}>
                        <td>
                          <UserAvatar name={user.first_name} avatar={user.avatar} />
                        </td>
                        <td className="fw-semibold text-dark">{user.first_name} {user.last_name}</td>
                        <td className="text-muted">{user.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
          </div>
          {
            userSelected.length > 0 &&
            <div className="table-responsive mb-2 mt-2">
              <table className="table align-middle mb-0">
                <tbody>
                  {
                    userSelected.map((user, index) => (
                      <tr key={index} className="border-bottom">
                        <td className="text-muted">
                          <p className="m-unset">{user.user.email}</p>
                          <Switch
                            style={{ marginRight: 7 }}
                            onChange={() => changeOwnerCheck(user.user.id)}
                          />
                          {t('projects_page.owner_label')}
                        </td>
                        <td className="text-end">
                          <Button size="sm" color="danger" className="px-3 rounded" onClick={() => handleRemoveUser(user.user.id)}>
                            <FontAwesomeIcon icon={faMinus} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      </div>
    </Modal>
  );
}
export default ProjectAddMember;