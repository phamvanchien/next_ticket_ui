"use client"
import { update, updateAvatar } from "@/api/user.api";
import UserAvatar from "@/common/components/AvatarName";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import Loading from "@/common/components/Loading";
import UploadImage from "@/common/components/UploadImage";
import { APP_CONFIG } from "@/configs/app.config";
import { API_CODE } from "@/enums/api.enum";
import { APP_AUTH } from "@/enums/app.enum";
import { RootState, useAppDispatch } from "@/reduxs/store.redux";
import { setUserUpdated } from "@/reduxs/user.redux";
import { isEmpty } from "@/services/validate.service";
import { BaseResponseType } from "@/types/base.type";
import { removeCookie, setCookie } from "@/utils/cookie.util";
import { dateToString, displayMessage } from "@/utils/helper.util";
import { faEdit, faEnvelope, faImage, faLock, faPhone, faPowerOff, faUser, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UploadFile } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SetPassword from "./components/SetPassword";

const ProfileView = () => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadAvatar, setUploadAvatar] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [phone, setPhone] = useState<string>();
  const [userData, setUserData] = useState(userLogged);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loadingEdit, setLoadingEdit] = useState(false);
  const handleUploadAvatar = async () => {
    try {
      if (!userLogged || !fileList || fileList.length < 1) {
        return;
      }
      const response = await updateAvatar(fileList[0].originFileObj as File);
      setUploadAvatar(false);
      if (response && response.code === API_CODE.OK) {
        setFileList([]);
        setUserData(response.data);
        setCookie(APP_AUTH.COOKIE_AUTH_USER, JSON.stringify(response.data), { expires: APP_CONFIG.TOKEN_EXPIRE_TIME });
        dispatch(setUserUpdated(response.data));
        return;
      }
      displayMessage('error', response.error?.message);
    } catch (error) {
      setUploadAvatar(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  const handleUpdateProfile = async () => {
    try {
      if (isEmpty(firstName) || !firstName) {
        setErrorMessage(t('register.firstname_is_required'));
        return;
      }
      if (isEmpty(lastName) || !lastName) {
        setErrorMessage(t('register.lastname_is_required'));
      }
      setLoadingEdit(true);
      const response = await update({
        first_name: firstName,
        last_name: lastName,
        phone: phone
      });
      setLoadingEdit(false);
      if (response && response.code === API_CODE.OK) {
        setCookie(APP_AUTH.COOKIE_AUTH_USER, JSON.stringify(response.data), { expires: APP_CONFIG.TOKEN_EXPIRE_TIME });
        dispatch(setUserUpdated(response.data));
        setUserData(response.data);
        setEditProfile(false);
        return;
      }
      displayMessage('error', response.error?.message);
    } catch (error) {
      setLoadingEdit(false);
      setEditProfile(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  const handleLogout = () => {
    removeCookie(APP_AUTH.COOKIE_AUTH_KEY);
    removeCookie(APP_AUTH.COOKIE_AUTH_USER);
    window.location.href = '/login';
  }
  useEffect(() => {
    handleUploadAvatar();
  }, [fileList]);
  useEffect(() => {
    if (userLogged) {
      setFirstName(userLogged.first_name);
      setLastName(userLogged.last_name);
      setPhone(userLogged.phone);
      setUserData(userLogged);
    }
  }, [userLogged]);
  if (!userData) {
    return <></>
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
          {
            uploadAvatar ?
            <UploadImage fileList={fileList} setFileList={setFileList} listType="picture-circle" />
            :
            <UserAvatar avatar={userData.avatar} name={userData.first_name} size={100} />
          }
          <h4 className="mt-2">{userData.first_name} {userData.last_name}</h4>
          <a className="link pointer text-primary" onClick={() => setUploadAvatar (true)}><FontAwesomeIcon icon={faImage} /> {t('personal_profile.change_avatar')}</a>
        </div>
        <div className="col-12">
        <hr/>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-lg-2 col-3">
          {
            editProfile ?
            <>
              <Button color="default" onClick={() => {setEditProfile (false); setUserData(userData)}} disabled={loadingEdit}>
                {t('btn_cancel')}
              </Button>
              <Button color={loadingEdit ? 'secondary' : 'primary'} onClick={handleUpdateProfile} disabled={loadingEdit || isEmpty(firstName) || !firstName || isEmpty(lastName) || !lastName}>
                {loadingEdit ? <Loading color="light" /> : t('btn_save')}
              </Button>
            </> :
            <a className="link pointer text-primary" onClick={() => setEditProfile (true)}>
              <FontAwesomeIcon icon={faEdit} /> {t('personal_profile.edit_profile')}
            </a>
          }
        </div>
        <div className="col-lg-10 col-9">

        </div>
      </div>
      <div className="row mt-4">
        <div className="col-lg-2 col-3">
          <b><FontAwesomeIcon icon={faEnvelope} /> {t('personal_profile.email_label')}</b>
        </div>
        <div className="col-lg-10 col-9">
          {userData.email}
        </div>
      </div>
      <div className={`row mt-${editProfile ? '4' : '3'}`}>
        <div className="col-lg-2 col-3">
          <b><FontAwesomeIcon icon={faPhone} /> {t('personal_profile.phone_label')}</b>
        </div>
        <div className="col-lg-10 col-9">
          {
            editProfile ?
            <Input type="text" value={userData.phone} onChange={(e) => setPhone (e.target.value)} minLength={11} maxLength={12} />:
            userData.phone
          }
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-lg-2 col-3">
          <b><FontAwesomeIcon icon={faUser} /> {t('personal_profile.first_name_label')}</b>
        </div>
        <div className="col-lg-10 col-9">
          {
            editProfile ?
            <Input 
              type="text" 
              errorMessage={errorMessage}
              value={userData.first_name}
              onChange={(e) => setFirstName (e.target.value)}
              validates={[
                {
                  type: 'is_required',
                  message: t('register.firstname_is_required')
                }
              ]}
            />:
            userData.first_name
          }
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-lg-2 col-3">
          <b><FontAwesomeIcon icon={faUser} /> {t('personal_profile.last_name_label')}</b>
        </div>
        <div className="col-lg-10 col-9">
          {
            editProfile ?
            <Input 
              type="text" 
              errorMessage={errorMessage}
              value={userData.last_name}
              onChange={(e) => setLastName (e.target.value)}
              validates={[
                {
                  type: 'is_required',
                  message: t('register.lastname_is_required')
                }
              ]}
            />:
            userData.last_name
          }
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-lg-2 col-3">
          <b><FontAwesomeIcon icon={faUserCheck} /> {t('personal_profile.join_at')}</b>
        </div>
        <div className="col-lg-10 col-9">
          {dateToString(new Date(userData.created_at))}
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-12">
          <hr/>
        </div>
      </div>
      <SetPassword />
      <div className="row mt-3">
        <div className="col-12">
          <a className="link pointer text-secondary" onClick={handleLogout}><FontAwesomeIcon icon={faPowerOff} /> {t('personal_profile.logout_label')}</a>
        </div>
        {/* <div className="col-12 mt-3">
          <a className="link pointer text-danger"><FontAwesomeIcon icon={faUserMinus} /> Remove account</a>
        </div> */}
      </div>
    </div>
  )
}
export default ProfileView;