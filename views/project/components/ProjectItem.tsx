import Button from "@/common/components/Button";
import { APP_LINK, IMAGE_DEFAULT } from "@/enums/app.enum";
import { ProjectType } from "@/types/project.type";
import { WorkspaceUserType } from "@/types/workspace.type";
import { faBullseye, faCircle, faCircleCheck, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import AddMemberModal from "./AddMemberModal";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxs/store.redux";
import { formatTime } from "@/utils/helper.util";
import { useTranslations } from "next-intl";

interface ProjectItemProps {
  project: ProjectType
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project }) => {
  const t = useTranslations();
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const [modalAddMember, setModalAddmember] = useState<boolean>(false);
  const [projectMembers, setProjectMembers] = useState<WorkspaceUserType[]>();
  useEffect(() => {
    setProjectMembers(project.members.splice(0, 3));
  }, [project])
  return (
    <div className="col-12 col-lg-3">
      <div className={`card ${formatTime(new Date(project.created_at)).indexOf('Now') !== -1 ? 'just-create' : ''}`}>
        <div className="card-body p-10">
          <h6 className="title-project">
            <Link href={APP_LINK.WORKSPACE + '/' + project.workspace_id + '/project/' + project.id}>
              <FontAwesomeIcon icon={faBullseye} className="text-secondary" /> {project.name}
            </Link>
          </h6>
          <p className="text-muted" style={{ fontSize: 13 }}>
            <FontAwesomeIcon icon={faUser} /> {t('projects.created_by_text')} {project.user.first_name} {project.user.last_name}
          </p>
          <ul className="list-inline mt-2">
            {
              projectMembers && projectMembers.map(member => (
                <li className="list-inline-item" key={member.id} title={member.email}>
                  <img 
                    className="img-circle table-avatar" 
                    width={30} height={30} 
                    src={member.avatar ?? IMAGE_DEFAULT.NO_USER} 
                    onError={(e) => e.currentTarget.src = IMAGE_DEFAULT.NO_USER} 
                  />
                </li>
              ))
            }
            {
              project.members.length > 3 &&
              <li className="list-inline-item">
                <Button color="secondary" rounded>+{project.members.length - 3}</Button>
              </li>
            }
            <li className="list-inline-item">
              <img 
                className="img-circle table-avatar pointer" 
                width={30} height={30} src={'/img/icon/user-plus.png'} 
                onError={(e) => e.currentTarget.src = IMAGE_DEFAULT.NO_USER} 
                onClick={() => setModalAddmember (true)}
              />
            </li>
          </ul>
          {
            project.is_public &&
            <span className="text-success">
              <FontAwesomeIcon icon={faCircleCheck} /> {t('public_check')}
            </span>
          }
          {
            !project.is_public &&
            <span className="text-primary">
              <FontAwesomeIcon icon={faCircle} /> {t('private_check')}
            </span>
          }
        </div>
      </div>
      {
        project.user_id === userLogged?.id && <AddMemberModal 
          openModal={modalAddMember} 
          setOpenModal={setModalAddmember} 
          projectId={project.id}
        />
      }
    </div>
  )
}
export default ProjectItem;