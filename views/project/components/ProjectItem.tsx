import UserAvatar from "@/common/components/AvatarName";
import UserGroup from "@/common/components/UserGroup";
import { RootState } from "@/reduxs/store.redux";
import { ProjectType } from "@/types/project.type";
import { dateToString } from "@/utils/helper.util";
import { faGlobe, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

interface ProjectItemProps {
  project: ProjectType
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project }) => {
  const t = useTranslations();
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const router = useRouter();
  const handleProjectClick = (e: React.MouseEvent) => {
    e.preventDefault();
  
    const storageKey = "recent_projects";
    const MAX_RECENT_PROJECTS = 10;
    let storedProjects: { id: number, date: string }[] = [];
  
    try {
      const stored = localStorage.getItem(storageKey);
      storedProjects = stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error("Failed to read localStorage", err);
    }

    storedProjects = storedProjects.filter(p => p.id !== project.id);

    storedProjects.unshift({
      id: project.id,
      date: new Date().toISOString()
    });

    if (storedProjects.length > MAX_RECENT_PROJECTS) {
      storedProjects = storedProjects.slice(0, MAX_RECENT_PROJECTS);
    }
  
    localStorage.setItem(storageKey, JSON.stringify(storedProjects));
    router.push(`/workspace/${project.workspace_id}/project/${project.id}`);
  };   
  
  return (
    <div className="project-card">
      <div className="card-title">
        <div>
          <FontAwesomeIcon icon={project.is_public ? faGlobe : faLock} className="text-muted me-2" />
          <a href="#" onClick={handleProjectClick}>
            {project.name}
          </a>
        </div>
        <div className="project-members">
          <UserGroup>
            <UserAvatar name={project.user.first_name} avatar={project.user.avatar} />
            {project.members
              .filter(m => m.id !== userLogged?.id)
              .map(pm => (
                <UserAvatar key={pm.id} name={pm.first_name} avatar={pm.avatar} />
              ))}
          </UserGroup>
        </div>
      </div>

      <div className="text-muted small">
        {t("projects_page.created_by_text")}: {project.user.first_name} {project.user.last_name}
      </div>

      <div className="text-muted small">
        {t("common.created_at_label")}: {dateToString(new Date(project.created_at))}
      </div>

      <div className="project-progress">
        <div
          className="progress-bar"
          style={{
            width: `${project.percent_done}%`,
            backgroundColor: project.percent_done >= 90 ? "#36b37e" : undefined,
          }}
        ></div>
      </div>
    </div>
  );
}
export default ProjectItem;