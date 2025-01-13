import { acceptInvite, removeInvite } from "@/api/workspace.api";
import Button from "@/common/components/Button";
import Loading from "@/common/components/Loading";
import { API_CODE } from "@/enums/api.enum";
import { APP_LINK } from "@/enums/app.enum";
import { catchError } from "@/services/base.service";
import { BaseResponseType } from "@/types/base.type";
import { InviteType } from "@/types/workspace.type";
import { notify } from "@/utils/helper.util";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface InviteItemProps {
  invite: InviteType
  loadInvite: () => void
}

const InviteItem: React.FC<InviteItemProps> = ({ invite, loadInvite }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const handleAcceptInvite = async () => {
    try {
      setLoading(true);
      const response = await acceptInvite(invite.workspace.id, invite.id);
      setLoading(false);
      if (response && response.code === API_CODE.OK) {
        router.push(APP_LINK.WORKSPACE + '/' + invite.workspace.id);
        return;
      }
      notify(catchError(response)?.message ?? '', 'error');
    } catch (error) {
      setLoading(false);
      notify(catchError(error as BaseResponseType)?.message ?? '', 'error');
    }
  }
  const handleRemoveInvite = async () => {
    try {
      setLoadingDelete(true);
      const response = await removeInvite(invite.workspace.id, invite.id);
      setLoading(false);
      if (response && response.code === API_CODE.OK) {
        loadInvite();
        return;
      }
      notify(catchError(response)?.message ?? '', 'error');
    } catch (error) {
      setLoadingDelete(false);
      notify(catchError(error as BaseResponseType)?.message ?? '', 'error');
    }
  }
  return (
    <div className="row mb-4">
      <div className="col-12 col-lg-4">
        <h6 className="invite-from-title">{invite.workspace.user?.first_name} {invite.workspace.user?.last_name}</h6>
        <span className="text-muted invite-from-wp">Invite to join <i>{invite.workspace.name}</i></span>
      </div>
      <div className="col-6 col-lg-2 mt-2">
        <Button color="primary" fullWidth onClick={handleAcceptInvite} disabled={loading || loadingDelete}>
          {loading ? <Loading color="light" /> : 'Accept'}
        </Button>
      </div>
      <div className="col-6 col-lg-2 mt-2">
        <Button color="secondary" outline fullWidth disabled={loading || loadingDelete} onClick={handleRemoveInvite}>
          {loadingDelete ? <Loading color="secondary" /> : 'Remove'}
        </Button>
      </div>
    </div>
  )
}
export default InviteItem;