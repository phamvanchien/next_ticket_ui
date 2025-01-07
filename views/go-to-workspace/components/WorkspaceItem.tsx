import { APP_LINK, APP_LOCALSTORAGE } from "@/enums/app.enum";
import { WorkspaceType } from "@/types/workspace.type";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React from "react";

interface WorkspaceItemProps {
  workspace: WorkspaceType
}

const WorkspaceItem: React.FC<WorkspaceItemProps> = ({ workspace }) => {
  const router = useRouter();
  const handleClickItem = () => {
    localStorage.setItem(APP_LOCALSTORAGE.WORKSPACE_STORAGE, workspace.id.toString());
    router.push (APP_LINK.WORKSPACE + '/' + workspace.id)
  }
  return (
    <div className="col-12 col-lg-6 col-sm-6">
      <div className="info-box workspace-item" onClick={handleClickItem}>
        {/* <span className="info-box-icon elevation-1">
            <img src="/img/logo.png" alt="Next Ticket Logo" width={60} height={60} />
        </span> */}
        <div className="info-box-content">
            <span className="info-box-number">
              {workspace.name}
              <FontAwesomeIcon icon={faAngleRight} className="float-right" style={{fontSize: 25}} />
            </span>
        </div>
      </div>
    </div>
  )
}
export default WorkspaceItem;