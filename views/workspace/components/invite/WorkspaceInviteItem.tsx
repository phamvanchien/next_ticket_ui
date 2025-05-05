import { acceptInvite, removeInvite } from "@/api/workspace.api";
import UserAvatar from "@/common/components/AvatarName";
import Button from "@/common/components/Button";
import Loading from "@/common/components/Loading";
import { API_CODE } from "@/enums/api.enum";
import { BaseResponseType } from "@/types/base.type";
import { InviteType, WorkspaceType } from "@/types/workspace.type";
import { displayMessage, displaySmallMessage } from "@/utils/helper.util";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

interface WorkspaceInviteItemProps {
  invite: InviteType
  setInviteDecline?: (inviteDecline: number) => void
  setWorkspaceJoined?: (workspaceJoined: WorkspaceType) => void
}

const WorkspaceInviteItem: React.FC<WorkspaceInviteItemProps> = ({ invite, setInviteDecline, setWorkspaceJoined }) => {
  const t = useTranslations();
  const [removed, setRemoved] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const handleRemoveInvite = async () => {
    try {
      setRemoveLoading(true);
      const response = await removeInvite(invite.workspace.id, invite.id);
      if (response && response.code === API_CODE.OK) {
        if (setInviteDecline) {
          setInviteDecline(invite.id);
        }
        setRemoved(true);
        return;
      }
      setRemoveLoading(false);
      displayMessage("error", response.error?.message);
    } catch (error) {
      setRemoveLoading(false);
      displayMessage("error", (error as BaseResponseType).error?.message);
    }
  }
  const handleJoinWorkspace = async () => {
    try {
      setJoinLoading(true);
      const response = await acceptInvite(invite.workspace.id, invite.id);
      setJoinLoading(false);
      if (response && response.code === API_CODE.OK) {
        displayMessage('success', t('workspaces_page.workspace_joined_message'));
        if (setWorkspaceJoined) {
          setWorkspaceJoined(invite.workspace);
        }
        return;
      }
      setJoinLoading(false);
      displayMessage("error", response.error?.message);
    } catch (error) {
      setJoinLoading(false);
      displayMessage("error", (error as BaseResponseType).error?.message);
    }
  }
  if (removed) {
    return <></>
  }
  return (
    <div className="card mt-2">
      <div className="card-body">
        <div className="d-flex align-items-center">
          <UserAvatar className="wp-logo me-3" square name={invite.workspace.name} avatar={invite.workspace.logo} />
          <div>
            <h6 className="mb-1">
              {invite.workspace.name}
            </h6>
            <p className="m-unset">{t('workspaces_page.invite.invite_by')}: <b>{invite.workspace.user?.first_name} {invite.workspace.user?.last_name}</b></p>
          </div>
        </div>
      </div>
      <div className="card-footer">
        <div className="row">
          <div className="col-6">
            <Button color={joinLoading ? 'secondary' : 'primary'} className="w-100" disabled={removeLoading || joinLoading} onClick={handleJoinWorkspace}>
              {joinLoading ? <Loading color="light" /> : t('workspaces_page.invite.accept_invite')}
            </Button>
          </div>
          <div className="col-6">
            <Button color="light" className="w-100" onClick={handleRemoveInvite} disabled={removeLoading || joinLoading}>
              {removeLoading ? <Loading color="secondary" /> : t('workspaces_page.invite.remove_invite')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default WorkspaceInviteItem;