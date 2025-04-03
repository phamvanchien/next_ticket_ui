import NoData from "@/common/components/NoData";
import Sidebar from "@/common/layouts/Sidebar";
import { ResponseWithPaginationType } from "@/types/base.type";
import { InviteType, WorkspaceType } from "@/types/workspace.type";
import { useTranslations } from "next-intl";
import React from "react";
import WorkspaceInviteItem from "./WorkspaceInviteItem";

interface WorkspaceInviteProps {
  invitesData?: ResponseWithPaginationType<InviteType[]>
  open: boolean
  setOpen: (open: boolean) => void
  setInviteDecline?: (inviteDecline: number) => void
  setWorkspaceJoined?: (workspaceJoined: WorkspaceType) => void
}

const WorkspaceInvite: React.FC<WorkspaceInviteProps> = ({ open, invitesData, setOpen, setInviteDecline, setWorkspaceJoined }) => {
  const t = useTranslations();
  return (
    <Sidebar 
      open={open}
      width={450}
      headerTitle={t('workspaces.invitation_title')}
      setOpen={setOpen}
    >
      <div className="row">
        {
          (invitesData && invitesData.total === 0) &&
          <div className="col-12 text-secondary">
            <NoData message={t('workspaces.no_data_invite')} />
          </div>
        }
        {
          (invitesData && invitesData.items.map(invite => (
            <div className="col-12" key={invite.id}>
              <WorkspaceInviteItem 
                invite={invite} 
                setInviteDecline={setInviteDecline}
                setWorkspaceJoined={setWorkspaceJoined}
              />
            </div>
          )))
        }
      </div>
    </Sidebar>
  )
}
export default WorkspaceInvite;