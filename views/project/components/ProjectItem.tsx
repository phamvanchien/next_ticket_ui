import UserAvatar from "@/common/components/AvatarName";
import UserGroup from "@/common/components/UserGroup";
import { RootState } from "@/reduxs/store.redux";
import { ProjectType } from "@/types/project.type";
import { faEllipsisH, faGlobe, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "antd";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

interface ProjectItemProps {
  project: ProjectType
  setOpenAddMember: (openAddMember?: number) => void
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project, setOpenAddMember }) => {
  const t = useTranslations();
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  return (
    <div className="card project-card border-0 shadow-sm">
      <div className="project-header" style={{ backgroundColor: '#3333' }}></div>
      <div className="card-body">
        <h5 className="card-title">
          <FontAwesomeIcon icon={project.is_public ? faGlobe : faLock} className="text-secondary" style={{marginRight: 3}} />
          <Link href={`/workspace/${project.workspace_id}/project/${project.id}`}>{project.name}</Link>
          {
            project.user_id === userLogged?.id && 
            <Avatar src={'/images/icons/user-plus.png'} className="pointer float-right" onClick={setOpenAddMember ? () => setOpenAddMember (project.id) : undefined} />
          }
          {
            project.members.filter(m => m.id !== userLogged?.id).length > 0 && <UserGroup className="float-right">
              {
                project.members.filter(m => m.id !== userLogged?.id).map(pm => (
                  <UserAvatar name={pm.first_name} avatar={pm.avatar} key={pm.id} />
                ))
              }
            </UserGroup>
          }
        </h5>
        <p className="card-text text-muted m-unset">{t('projects.created_by_text')}: {project.user.first_name} {project.user.last_name}</p>
        <p className="card-text text-muted">
          <i>{project.description ? project.description : t('projects.no_description')}</i>
        </p>
        {project.percent_done.toString()}%
        <div className="progress progress-project">
          <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: `${project.percent_done}%` }}></div>
        </div>
      </div>
    </div>
  )
}
export default ProjectItem;