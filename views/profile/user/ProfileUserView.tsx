"use client"
import { APP_LINK } from "@/enums/app.enum";
import { ResponseUserDataType } from "@/types/user.type";
import { formatTime } from "@/utils/helper.util";
import { faAngleDoubleLeft, faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDate } from "react-datepicker/dist/date_utils";

interface ProfileUserViewProps {
  user: ResponseUserDataType
}

const ProfileUserView: React.FC<ProfileUserViewProps> = ({ user }) => {
  const router = useRouter();
  return (
    <div className="login-box auth-box profile-box">
      <div className="login-logo">
        <Link href="/">
          <img src="/img/logo.png" alt="AdminLTE Logo" width={130} height={90} />
        </Link>
      </div>
      <div className="card">
        <div className="card-body login-card-body p-10">
          <Link href={'#'} style={{cursor: 'pointer'}} onClick={() => router.back()}>
            <FontAwesomeIcon icon={faAngleDoubleLeft} /> Back
          </Link>
          <Link className="float-right" href={APP_LINK.GO_TO_WORKSPACE}>
            Workspaces <FontAwesomeIcon icon={faAngleDoubleRight} />
          </Link>
          <hr/>
          <div className="row">
            <div className="col-12 mt-2">
              <label className="label-field-register mr-2" htmlFor="phone">Name: </label>
              {user.first_name} {user.last_name}
            </div>
            <div className="col-12 mt-2">
              <label className="label-field-register mr-2" htmlFor="phone">Email: </label>
              {user.email}
            </div>
            <div className="col-12 mt-2">
              <label className="label-field-register mr-2" htmlFor="phone">Phone: </label>
              {user.phone ?? 'Not update'}
            </div>
            <div className="col-12 mt-2">
              <label className="label-field-register mr-2" htmlFor="phone">Status: </label>
              <b className="text-success">Verified</b>
            </div>
            <div className="col-12 mt-2">
              <label className="label-field-register mr-2" htmlFor="phone">Joined at: </label>
              {formatTime(new Date(user.created_at))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ProfileUserView;