import NoData from "@/common/components/NoData";
import Sidebar from "@/common/layouts/Sidebar";
import { ResponseWithPaginationType } from "@/types/base.type";
import { ProjectInviteType, ProjectType } from "@/types/project.type";
import { useTranslations } from "next-intl";
import React from "react";
import ProjectInviteItem from "./ProjectInviteItem";

interface ProjectInviteProps {
  invitesData?: ResponseWithPaginationType<ProjectInviteType[]>
  open: boolean
  setOpen: (open: boolean) => void
  setInviteDecline?: (inviteDecline: number) => void
  setProjectJoined?: (projectJoined: ProjectType) => void
}

const ProjectInvite: React.FC<ProjectInviteProps> = ({ open, invitesData, setOpen, setInviteDecline, setProjectJoined }) => {
  const t = useTranslations();
  return (
    <Sidebar 
      open={open}
      width={450}
      headerTitle={t('projects_page.invitation_btn')}
      setOpen={setOpen}
    >
      <div className="row">
        {
          (invitesData && invitesData.total === 0) &&
          <div className="col-12 text-secondary">
            <NoData message={t('workspaces_page.no_data_invite')} />
          </div>
        }
        {
          (invitesData && invitesData.items.map(invite => (
            <div className="col-12" key={invite.id}>
              <ProjectInviteItem 
                invite={invite} 
                setInviteDecline={setInviteDecline}
                setProjectJoined={setProjectJoined}
              />
            </div>
          )))
        }
      </div>
    </Sidebar>
  )
}
export default ProjectInvite;