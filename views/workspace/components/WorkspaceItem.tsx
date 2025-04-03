import UserAvatar from "@/common/components/AvatarName";
import Button from "@/common/components/Button";
import UserGroup from "@/common/components/UserGroup";
import { RootState } from "@/reduxs/store.redux";
import { WorkspaceType } from "@/types/workspace.type";
import { dateToString } from "@/utils/helper.util";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "antd";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

interface WorkspaceItemProps {
  workspace: WorkspaceType
  workspaceJoined?: WorkspaceType
  setOpenAddMember: (openAddMember?: number) => void
}

const WorkspaceItem: React.FC<WorkspaceItemProps> = ({ workspace, workspaceJoined, setOpenAddMember }) => {
  const t = useTranslations();
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  return (
    <div 
      className={`
        d-flex justify-content-between align-items-center p-3 border rounded 
        ${(workspaceJoined && workspaceJoined.id === workspace.id) ? 'wp-item-highlight' : ''}
      `}
    >
      <div className="d-flex align-items-center">
        <UserAvatar className="wp-logo me-3" square name={workspace.name} avatar={workspace.logo} />
        <div>
          <h5 className="mb-1">
            <Link href={`/workspace/${workspace.id}`}>{workspace.name}</Link>
          </h5>
          <p className="text-muted mb-0">
            {t('projects.created_by_text')}: {workspace.user?.first_name} {workspace.user?.last_name}<br />
            {t('tasks.created_at_label')}: {dateToString(new Date(workspace.created_at))}
          </p>
        </div>
      </div>
      <div className="d-flex align-items-center gap-3">
        {
          workspace.members.filter(m => m.id !== userLogged?.id).length > 0 &&
          <UserGroup className="d-none d-lg-block">
            {
              workspace.members.map(member => (
                <UserAvatar key={member.id} name={member.first_name} avatar={member.avatar} />
              ))
            }
          </UserGroup>
        }
        {(userLogged && workspace.user_id === userLogged.id) && <Avatar src={'/images/icons/user-plus.png'} className="pointer" onClick={() => setOpenAddMember (workspace.id)} />}
        {
          (userLogged && workspace.user_id === userLogged.id) &&
          <Button color="light" className="text-secondary">
            {/* <FontAwesomeIcon icon={faEllipsisH} /> */}
            <FontAwesomeIcon icon={faGear} />
          </Button>
        }
      </div>
    </div>
  );
};
export default WorkspaceItem;