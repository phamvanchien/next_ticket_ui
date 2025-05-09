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
import { faMinus, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

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
              !loading && debouncedValue && userInviteData.filter((user) => !userSelected.some((u) => u.id === user.id)).length > 0 &&
              <div className="table-responsive mb-2">
                <table className="table align-middle mb-0">
                  <tbody>
                    {userInviteData.filter((user) => !userSelected.some((u) => u.id === user.id)).map((user, index) => (
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
                        <td className="text-muted">{user.email}</td>
                        <td className="text-end">
                          <Button size="sm" color="danger" className="px-3 rounded" onClick={() => handleRemoveUser(user.id)}>
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
};

export default WorkspaceAddMember;