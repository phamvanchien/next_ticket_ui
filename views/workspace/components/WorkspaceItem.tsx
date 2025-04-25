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
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

interface WorkspaceItemProps {
  workspace: WorkspaceType
  workspaceJoined?: WorkspaceType
  setOpenAddMember: (openAddMember?: number) => void
}

const WorkspaceItem: React.FC<WorkspaceItemProps> = ({ workspace, workspaceJoined, setOpenAddMember }) => {
  const t = useTranslations();
  const router = useRouter();
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  return (
    <div className={`workspace-card ${workspaceJoined?.id === workspace.id ? 'highlighted' : ''}`}>
      <div className="left-section">
        <UserAvatar
          className="wp-logo"
          square
          name={workspace.name}
          avatar={workspace.logo}
        />
        <div>
          <div className="workspace-name">
            <Link href={`/workspace/${workspace.id}/project`}>{workspace.name}</Link>
          </div>
          <div className="workspace-info">
            {t('projects.created_by_text')}: {workspace.user?.first_name} {workspace.user?.last_name} <br />
            {t('tasks.created_at_label')}: {dateToString(new Date(workspace.created_at))}
          </div>
        </div>
      </div>

      <div className="right-section">
        {workspace.members.filter(m => m.id !== userLogged?.id).length > 0 && (
          <UserGroup className="d-none d-lg-flex">
            {workspace.members.map(member => (
              <UserAvatar key={member.id} name={member.first_name} avatar={member.avatar} />
            ))}
          </UserGroup>
        )}

        {userLogged?.id === workspace.user_id && (
          <>
            <Avatar
              src={'/images/icons/user-plus.png'}
              className="pointer"
              onClick={() => setOpenAddMember(workspace.id)}
            />
            <button
              className="gear-button"
              onClick={() => router.replace('/workspace/' + workspace.id + '/setting')}
            >
              <FontAwesomeIcon icon={faGear} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
export default WorkspaceItem;