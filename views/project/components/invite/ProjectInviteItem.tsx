import { joinProject, removeInvite } from "@/api/project.api";
import UserAvatar from "@/common/components/AvatarName";
import Button from "@/common/components/Button";
import Loading from "@/common/components/Loading";
import { API_CODE } from "@/enums/api.enum";
import { BaseResponseType } from "@/types/base.type";
import { ProjectInviteType, ProjectType } from "@/types/project.type";
import { displayMessage } from "@/utils/helper.util";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

interface ProjectInviteItemProps {
  invite: ProjectInviteType
  setInviteDecline?: (inviteDecline: number) => void
  setProjectJoined?: (projectJoined: ProjectType) => void
}

const ProjectInviteItem: React.FC<ProjectInviteItemProps> = ({ invite, setInviteDecline, setProjectJoined }) => {
  const t = useTranslations();
  const [removed, setRemoved] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const handleRemoveInvite = async () => {
    try {
      setRemoveLoading(true);
      const response = await removeInvite(invite.project.workspace_id, invite.project.id);
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
  const handleJoinProject = async () => {
    try {
      setJoinLoading(true);
      const response = await joinProject(invite.project.workspace_id, invite.project.id);
      setJoinLoading(false);
      if (response && response.code === API_CODE.OK) {
        displayMessage('success', t('projects.project_joined_message'));
        if (setProjectJoined) {
          setProjectJoined(invite.project);
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
          <UserAvatar className="wp-logo me-3" square name={invite.project.user.first_name} avatar={invite.project.user.avatar} />
          <div>
            <h6 className="mb-1">
              {invite.project.name}
            </h6>
            <p className="m-unset">{t('create_project.user_invite_label')}: <b>{invite.project.user.first_name} {invite.project.user.last_name}</b></p>
          </div>
        </div>
      </div>
      <div className="card-footer">
        <div className="row">
          <div className="col-6">
            <Button color={joinLoading ? 'secondary' : 'primary'} className="w-100" disabled={removeLoading || joinLoading} onClick={handleJoinProject}>
              {joinLoading ? <Loading color="light" /> : t('create_project.join_label')}
            </Button>
          </div>
          <div className="col-6">
            <Button color="light" className="w-100" onClick={handleRemoveInvite} disabled={removeLoading || joinLoading}>
              {removeLoading ? <Loading color="secondary" /> : t('create_project.remove_invite_label')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ProjectInviteItem;