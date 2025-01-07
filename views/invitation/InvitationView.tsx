"use client"
import Link from "next/link";
import InviteItem from "./components/InviteItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleLeft, faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import { APP_LINK } from "@/enums/app.enum";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { inviteList } from "@/api/workspace.api";
import { API_CODE } from "@/enums/api.enum";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import { catchError } from "@/services/base.service";
import ErrorPage from "@/common/layouts/ErrorPage";
import { ResponseInviteListDataType } from "@/types/workspace.type";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxs/store.redux";

const InvitationView = () => {
  const router = useRouter();
  const [error, setError] = useState<AppErrorType | null>(null);
  const [loading, setLoading] = useState(false);
  const [inviteData, setInviteData] = useState<ResponseInviteListDataType>();
  const loadInvite = async () => {
    try {
      setLoading(true);
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
    <div className="login-box auth-box invitation-box">
      <div className="login-logo">
        <Link href="/">
          <img src="/img/logo.png" alt="AdminLTE Logo" width={130} height={90} />
        </Link>
      </div>
      <div className="card">
        <div className="card-body login-card-body">
            <Link href={'#'} style={{cursor: 'pointer'}} onClick={() => router.back()}>
              <FontAwesomeIcon icon={faAngleDoubleLeft} /> Back
            </Link>
            <Link className="float-right" href={APP_LINK.GO_TO_WORKSPACE}>
              Workspaces <FontAwesomeIcon icon={faAngleDoubleRight} />
            </Link>
            <hr/>
            {
              (inviteData && inviteData.total === 0) &&
              <div className="row">
                <div className="col-12">
                  <h6 className="text-center">No invitation</h6>
                </div>
              </div>
            }
            {
              (inviteData) && inviteData.items.map(invite => (
                <InviteItem key={invite.id} invite={invite} loadInvite={loadInvite} />
              ))
            }
        </div>
      </div>
    </div>
  )
}
export default InvitationView;