"use client"
import { ResponseUserDataType } from "@/types/user.type";
import { formatTime } from "@/utils/helper.util";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";

interface ProfileUserViewProps {
  user: ResponseUserDataType
}

const ProfileUserView: React.FC<ProfileUserViewProps> = ({ user }) => {
  const t = useTranslations();
  return <>
    <div className="row">
      <div className="col-12 text-secondary">
        <h3><FontAwesomeIcon icon={faUserCircle} className="text-primary" /> {user.first_name} {user.last_name}</h3>
      </div>
    </div>
    <hr/>
    <div className="row">
      <div className="col-12 mt-2">
        <label className="label-field-register mr-2" htmlFor="phone">{t('user_profile.name_label')}: </label>
        {user.first_name} {user.last_name}
      </div>
      <div className="col-12 mt-2">
        <label className="label-field-register mr-2" htmlFor="phone">Email: </label>
        {user.email}
      </div>
      <div className="col-12 mt-2">
        <label className="label-field-register mr-2" htmlFor="phone">{t('personal_profile.phone_label')}: </label>
        {user.phone ?? 'Not update'}
      </div>
      <div className="col-12 mt-2">
        <label className="label-field-register mr-2" htmlFor="phone">{t('personal_profile.status_label')}: </label>
        <b className="text-success">Verified</b>
      </div>
      <div className="col-12 mt-2">
        <label className="label-field-register mr-2" htmlFor="phone">{t('user_profile.join_at_label')}: </label>
        {formatTime(new Date(user.created_at))}
      </div>
    </div>
  </>;
}
export default ProfileUserView;