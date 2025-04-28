import { changePassword, setPassword as setUserPassword } from "@/api/user.api";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import Loading from "@/common/components/Loading";
import Modal from "@/common/components/Modal";
import { APP_CONFIG } from "@/configs/app.config";
import { API_CODE } from "@/enums/api.enum";
import { APP_AUTH } from "@/enums/app.enum";
import { RootState, useAppDispatch } from "@/reduxs/store.redux";
import { isEmpty } from "@/services/validate.service";
import { BaseResponseType } from "@/types/base.type";
import { setCookie } from "@/utils/cookie.util";
import { displayMessage } from "@/utils/helper.util";
import { faCheckCircle, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const SetPassword = () => {
  const t = useTranslations();
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const [userData, setUserData] = useState(userLogged);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [currentPassword, setCurrentPassword] = useState<string>();
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [disabledSubmit, setDisabledSubmit] = useState(true);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [loginType, setLoginType] = useState(userLogged?.login_type ?? 'common');
  const handleUpdatePassword = async () => {
    try {
      if (isFailDataChangePassword('click')) {
        return;
      }
      setLoadingUpdate(true);
      const response = userData?.login_type === 'common' ? 
      await changePassword({
        old_password: currentPassword ?? '',
        new_password: password ?? '',
        confirm_password: confirmPassword ?? ''
      })
      : await setUserPassword({
        password: password ?? '',
        confirm_password: confirmPassword ?? ''
      });
      setOpenUpdate(false);
      setLoadingUpdate(false);
      if (response && response.code === API_CODE.OK) {
        setOpenSuccess(true);
        setCookie(APP_AUTH.COOKIE_AUTH_USER, JSON.stringify(response.data), { expires: APP_CONFIG.TOKEN_EXPIRE_TIME });
        setUserData(response.data);
        resetForm();
        return;
      }
      displayMessage('error', response.error?.message);
    } catch (error) {
      setLoadingUpdate(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  const isFailDataChangePassword = (action?: 'change' | 'click') => {
    if (!userData) {
      return true;
    }
    if (userData.login_type === 'common' && (isEmpty(currentPassword) || !currentPassword)) {
      if (action === 'click') {
        setErrorMessage(t('authenticate_message.password_is_required'));
      }
      return true;
    }
    if (isEmpty(password) || !password) {
      if (action === 'click') {
        setErrorMessage(userData.login_type === 'common' ? t('personal_profile.new_passoword_required') : t('authenticate_message.password_is_required'));
      }
      return true;
    }
    if (isEmpty(confirmPassword) || !confirmPassword) {
      if (action === 'click') {
        setErrorMessage(t('register.confirm_password_is_required'));
      }
      return true;
    }
    if (password.length > 0 && confirmPassword.length > 0 && confirmPassword !== password) {
      if (action === 'click') {
        setErrorMessage(t('register.confirm_passowrd_is_mismacth'));
      }
      return true;
    }
    return false;
  }
  const resetForm = () => {
    setErrorMessage(undefined);
    setPassword('');
    setConfirmPassword('');
    setCurrentPassword('');
    setDisabledSubmit(true);
  }
  useEffect(() => {
    setDisabledSubmit(isFailDataChangePassword());
  }, [currentPassword, password, confirmPassword]);
  useEffect(() => {
    resetForm();
  }, [openUpdate]);
  useEffect(() => {
    if (userLogged) {
      setUserData(userLogged);
    }
  }, [userLogged]);
  if (!userData) {
    return <></>
  }
  return (
    <div className="row mt-3">
      <div className="col-12">
        {
          !openUpdate ?
          <a className="link pointer text-primary" onClick={() => setOpenUpdate (true)}>
            <FontAwesomeIcon icon={faLock} /> {userData.login_type === 'common' ? t('personal_profile.change_password_label') : t('personal_profile.set_password_label')}
          </a> : 
          <>
          <Button color="default" onClick={() => setOpenUpdate (false)} disabled={loadingUpdate}>
            {t('btn_cancel')}
          </Button>
          <Button 
            color={loadingUpdate ? 'secondary' : 'primary'} 
            onClick={handleUpdatePassword} 
            disabled={disabledSubmit || loadingUpdate}
          >
            {loadingUpdate ? <Loading color="light" /> : t('btn_save')}
          </Button>
          </>
        }
      </div>
      {
        openUpdate &&
        <div className="col-12 mt-3">
          {
            userData.login_type === 'common' &&
            <Input 
              type="text" 
              minLength={5}
              maxLength={16}
              placeholder={t('personal_profile.placeholder_current_password')}
              errorMessage={errorMessage}
              onChange={(e) => setCurrentPassword (e.target.value)}
              validates={[
                {
                  type: 'is_required',
                  message: t('authenticate_message.password_is_required')
                }
              ]}
            />
          }
          <Input 
            type="text"
            classGroup={userData.login_type === 'common' ? 'mt-3' : ''}
            minLength={5}
            maxLength={16}
            placeholder={t('register.placeholder_input_password')}
            errorMessage={errorMessage}
            onChange={(e) => setPassword (e.target.value)}
            validates={[
              {
                type: 'is_required',
                message: userData.login_type === 'common' ? t('personal_profile.new_passoword_required') : t('authenticate_message.password_is_required')
              }
            ]}
          />
          <Input 
            classGroup="mt-3"
            type="text"
            minLength={5}
            maxLength={16}
            placeholder={t('register.placeholder_input_confirm_password')}
            errorMessage={errorMessage}
            onChange={(e) => setConfirmPassword (e.target.value)}
            validates={[
              {
                type: 'is_required',
                message: t('register.confirm_password_is_required')
              }
            ]}
          />
        </div>
      }
      <div className="col-12">
        <hr/>
      </div>
      <Modal
        open={openSuccess}
        setOpen={setOpenSuccess}
        title=""
        footerBtn={[]}
        width={300}
        closable={false}
      >
        <div className="row">
          <div className="col-12 text-center">
            <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: 50 }} className="text-success" />
          </div>
          <div className="col-12 text-center mb-4 mt-4 text-success">
            {loginType === 'common' ? t('personal_profile.change_password_success_message') : t('personal_profile.set_password_success_message')}
          </div>
          <div className="col-12">
            <Button color="primary" className="w-100 mt-2" onClick={() => {setOpenSuccess (false); setLoginType('common')}}>{t('btn_ok')}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
export default SetPassword;