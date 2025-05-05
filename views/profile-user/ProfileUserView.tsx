"use client"
import { user } from "@/api/user.api";
import UserAvatar from "@/common/components/AvatarName";
import ErrorPage from "@/common/layouts/ErrorPage";
import { API_CODE } from "@/enums/api.enum";
import { BaseResponseType } from "@/types/base.type";
import { UserType } from "@/types/user.type";
import { dateToString } from "@/utils/helper.util";
import { faEnvelope, faPhone, faUser, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

interface ProfileUserViewProps {
  userId: number
}

const ProfileUserView: React.FC<ProfileUserViewProps> = ({ userId }) => {
  const t = useTranslations();
  const [userData, setUserData] = useState<BaseResponseType<UserType>>();
  const loadUser = async () => {
    try {
      const response = await user(userId);
      setUserData(response);
    } catch (error) {
      setUserData((error as BaseResponseType));
    }
  }

  useEffect(() => {
    loadUser();
  }, [userId]);

  if (!userData) {
    return <></>
  }

  if (userData.code !== API_CODE.OK) {
    return <ErrorPage code={userData.code} />
  }

  return (
    <div className="container px-3 py-3">
      <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
        <h3 className="mb-0">
          <FontAwesomeIcon icon={faUser} className="text-primary me-2" />
          {t('personal_profile.page_title')}
        </h3>
      </div>
      <div className="row">
        <div className="col-12">
          <UserAvatar avatar={userData.data.avatar} name={userData.data.first_name} size={100} />
          <h4 className="mt-2">{userData.data.first_name} {userData.data.last_name}</h4>
        </div>
        <div className="col-12">
        <hr/>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-lg-2 col-4">
          <b><FontAwesomeIcon icon={faEnvelope} /> {t('personal_profile.email_label')}</b>
        </div>
        <div className="col-lg-10 col-8">
          {userData.data.email}
        </div>
      </div>
      <div className={`row mt-3`}>
        <div className="col-lg-2 col-4">
          <b><FontAwesomeIcon icon={faPhone} /> {t('personal_profile.phone_label')}</b>
        </div>
        <div className="col-lg-10 col-8">
          {
            userData.data.phone
          }
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-lg-2 col-4">
          <b><FontAwesomeIcon icon={faUserCheck} /> {t('personal_profile.join_at')}</b>
        </div>
        <div className="col-lg-10 col-8">
          {dateToString(new Date(userData.data.created_at))}
        </div>
      </div>
    </div>
  )
}
export default ProfileUserView;