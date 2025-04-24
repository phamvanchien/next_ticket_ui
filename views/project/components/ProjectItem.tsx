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
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project }) => {
  const t = useTranslations();
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  return (
    <div className="project-card">
      <div className="card-title">
        <div>
          <FontAwesomeIcon icon={project.is_public ? faGlobe : faLock} className="text-muted me-2" />
          <Link href={`/workspace/${project.workspace_id}/project/${project.id}`}>
            {project.name}
          </Link>
        </div>
        <div className="project-members">
          <UserGroup>
          {project.members
            .filter(m => m.id !== userLogged?.id)
            .map(pm => (
              <UserAvatar key={pm.id} name={pm.first_name} avatar={pm.avatar} />
            ))}
          </UserGroup>
        </div>
      </div>

      <div className="text-muted small">
        {t('projects.created_by_text')}: {project.user.first_name} {project.user.last_name}
      </div>

      <div className="description">
        <i>{project.description || t('projects.no_description')}</i>
      </div>

      <div className="project-progress">
        <div
          className="progress-bar"
          style={{
            width: `${project.percent_done}%`,
            backgroundColor: project.percent_done >= 90 ? '#36b37e' : undefined,
          }}
        ></div>
      </div>
    </div>
  );
}
export default ProjectItem;