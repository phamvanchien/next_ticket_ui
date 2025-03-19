import Button from "@/common/components/Button";
import { APP_LINK, IMAGE_DEFAULT } from "@/enums/app.enum";
import { ProjectType } from "@/types/project.type";
import { WorkspaceUserType } from "@/types/workspace.type";
import { faBullseye, faCircle, faCircleCheck, faGlobe, faGlobeAsia, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import AddMemberModal from "./AddMemberModal";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxs/store.redux";
import { formatTime } from "@/utils/helper.util";
import { useTranslations } from "next-intl";
import UserGroup from "@/common/components/UserGroup";
import { ResponseUserDataType } from "@/types/user.type";
import { Avatar } from "antd";

interface ProjectItemProps {
  project: ProjectType
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project }) => {
  const t = useTranslations();
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const [modalAddMember, setModalAddmember] = useState<boolean>(false);
  const [projectMembers, setProjectMembers] = useState<WorkspaceUserType[]>();
  // useEffect(() => {
  //   setProjectMembers(project.members.splice(0, 3));
  // }, [project])
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
          <UserGroup className="mr-1" users={project.members as ResponseUserDataType[]} />
          <Avatar.Group>
            <Avatar src={<img src={'/img/icon/user-plus.png'} width={50} height={50} alt="avatar" />} />
          </Avatar.Group>
          <p className="m-b-unset mt-2">
            {
              project.is_public &&
              <span className="text-success">
                <FontAwesomeIcon icon={faGlobeAsia} /> {t('public_check')}
              </span>
            }
            {
              !project.is_public &&
              <span className="text-primary">
                <FontAwesomeIcon icon={faLock} /> {t('private_check')}
              </span>
            }
          </p>
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