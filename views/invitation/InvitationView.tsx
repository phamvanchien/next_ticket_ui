"use client"
import InviteItem from "./components/InviteItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { inviteList } from "@/api/workspace.api";
import { API_CODE } from "@/enums/api.enum";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import { catchError } from "@/services/base.service";
import ErrorPage from "@/common/layouts/ErrorPage";
import { ResponseInviteListDataType } from "@/types/workspace.type";
import Loading from "@/common/components/Loading";

const InvitationView = () => {
  const [error, setError] = useState<AppErrorType | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteData, setInviteData] = useState<ResponseInviteListDataType>();
  const loadInvite = async () => {
    try {
      const response = await inviteList(1, 5);
      setLoading(false);
      if (response && response.code === API_CODE.OK) {
        setInviteData(response.data);
        return;
      }
      setError(response);
    } catch (error) {
      setLoading(false);
      setError(catchError(error as BaseResponseType));
    }
  }
  useEffect(() => {
    loadInvite();
  }, []);

  if (error) {
    return <ErrorPage errorCode={500} />
  }

  return (
    <div className="row">
      <div className="col-12">
        <h3><FontAwesomeIcon icon={faEnvelope} className="text-primary" /> Invitation</h3>
      </div>
      <div className="col-12">
        {
          (!loading && inviteData && inviteData.total === 0) &&
          <div className="row text-secondary">
            <div className="col-12">
              <h6>No invitation</h6>
            </div>
          </div>
        }
        {
          loading &&
          <div className="row mt-2">
            <div className="col-12 col-lg-4">
              <Loading color="primary" size={30} />
            </div>
          </div>
        }
        {
          (!loading && inviteData) && inviteData.items.map(invite => (
            <InviteItem key={invite.id} invite={invite} loadInvite={loadInvite} />
          ))
        }
      </div>
    </div>
  );
}
export default InvitationView;