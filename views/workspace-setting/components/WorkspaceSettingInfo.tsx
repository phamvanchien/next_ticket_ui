import UserAvatar from "@/common/components/AvatarName";
import { WorkspaceType } from "@/types/workspace.type";
import { dateToString } from "@/utils/helper.util";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import WorkspaceEdit from "./WorkspaceEdit";

interface WorkspaceSettingInfoProps {
  workspace: WorkspaceType
}

const WorkspaceSettingInfo: React.FC<WorkspaceSettingInfoProps> = ({ workspace }) => {
  const t = useTranslations();
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <div className="row mt-4">
      <div className="col-12">
        <div className="d-flex align-items-center">
          {!loading && <UserAvatar className="wp-logo me-3" square name={workspace.name} avatar={workspace.logo} />}
          <div>
            <h5 className="mb-1">
              <Link href={'#'}>{workspace.name}</Link> <FontAwesomeIcon icon={faPencil} className="text-secondary pointer" onClick={() => setOpenEdit (true)} />
            </h5>
            <p className="text-muted mb-0">
              {t('common.created_at_label')}: {dateToString(new Date(workspace.created_at))}
            </p>
          </div>
        </div>
      </div>
      <WorkspaceEdit
        workspace={workspace}
        open={openEdit}
        setOpen={setOpenEdit}
      />
    </div>
  )
}
export default WorkspaceSettingInfo;