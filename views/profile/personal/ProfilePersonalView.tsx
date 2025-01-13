"use client"
import { changePassword, setPassword, update } from "@/api/user.api";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import InputForm from "@/common/components/InputForm";
import Loading from "@/common/components/Loading";
import { APP_CONFIG } from "@/config/app.config";
import { API_CODE } from "@/enums/api.enum";
import { APP_AUTH, APP_LINK, APP_VALIDATE_TYPE } from "@/enums/app.enum";
import { AUTHENTICATE_ENUM } from "@/enums/authenticate.enum";
import { catchError, hasError, printError, validateInput } from "@/services/base.service";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import { ResponseUserDataType } from "@/types/user.type";
import { getCookie, removeCookie, setCookie } from "@/utils/cookie.util";
import { notify } from "@/utils/helper.util";
import { faAngleDoubleLeft, faAngleDoubleRight, faLock, faPhone, faUser, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

const ProfilePersonalView = () => {
  const router = useRouter();
  const [user, setUser] = useState<ResponseUserDataType>();
  const [error, setError] = useState<AppErrorType | null>(null);
  const [validateError, setValidateError] = useState<AppErrorType[] | []>([]);
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [phone, setPhone] = useState<string>();
  const [password, setPasswordOld] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>();
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingChangePassword, setLoadingChangePassword] = useState(false);
  const [loginType, setLoginType] = useState<"common" | "google_only">();
  const handleValidateEmail = (value: string = phone ?? '') => {
    const isPhone = validateInput('phone', value ?? '', AUTHENTICATE_ENUM.PHONE_INVALID, APP_VALIDATE_TYPE.IS_PHONE, validateError, setValidateError);
    if (!isPhone) {
      return false;
    }
    return true;
  }
  const handleEmailInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value);
    handleValidateEmail(event.target.value);
  }
  const handleOpenChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.checked) {
      setOpenChangePassword(true);
      return;
    }
    setOpenChangePassword(false);
  }
  const handleUpdateProfile = async () => {
    if (hasError(validateError, 'first_name') || hasError(validateError, 'last_name') || hasError(validateError, 'phone')) {
      return;
    }

    try {
      setLoadingUpdate(true);
      setError(null);
      const response = await update({
        first_name: firstName,
        last_name: lastName,
        phone: phone
      });
      setLoadingUpdate(false);
      if (response && response.code === API_CODE.OK) {
        removeCookie(APP_AUTH.COOKIE_AUTH_USER);
        setCookie(APP_AUTH.COOKIE_AUTH_USER, JSON.stringify(response.data), { expires: APP_CONFIG.TOKEN_EXPIRE_TIME });
        return;
      }
      setError(catchError(response));
    } catch (error) {
      setLoadingUpdate(false);
      setError(catchError(error as BaseResponseType));
    }
  }
  const handleChangePassword = async () => {
    if (hasError(validateError, 'password') || hasError(validateError, 'new_password') || hasError(validateError, 'confirm_password')) {
      return;
    }

    try {
      setLoadingChangePassword(true);
      setError(null);
      const response = await changePassword ({
        old_password: password ?? '',
        new_password: newPassword ?? '',
        confirm_password: confirmNewPassword ?? ''
      });
      setLoadingChangePassword(false);
      if (response && response.code === API_CODE.OK) {
        setOpenChangePassword(false);
        turnOffCheckBoxChangePassword();
        return;
      }
      setError(catchError(response));
    } catch (error) {
      setLoadingChangePassword(false);
      setError(catchError(error as BaseResponseType));
    }
  }
  const handleSetPassword = async () => {
    if ((!newPassword || newPassword === '' || !confirmNewPassword || confirmNewPassword === '') || hasError(validateError, 'new_password') || hasError(validateError, 'confirm_password')) {
      return;
    }

    try {
      setLoadingChangePassword(true);
      setError(null);
      const response = await setPassword ({
        password: newPassword ?? '',
        confirm_password: confirmNewPassword ?? ''
      });
      setLoadingChangePassword(false);
      if (response && response.code === API_CODE.OK) {
        setLoginType(response.data.login_type);
        setOpenChangePassword(false);
        removeCookie(APP_AUTH.COOKIE_AUTH_USER);
        setCookie(APP_AUTH.COOKIE_AUTH_USER, JSON.stringify(response.data), { expires: APP_CONFIG.TOKEN_EXPIRE_TIME });
        turnOffCheckBoxChangePassword();
        return;
      }
      setError(catchError(response));
    } catch (error) {
      setLoadingChangePassword(false);
      setError(catchError(error as BaseResponseType));
    }
  }
  const turnOffCheckBoxChangePassword = () => {
    const checkbox = document.getElementById('changePassword') as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = false;
    }
  }
  useEffect(() => {
    const userAuth = getCookie(APP_AUTH.COOKIE_AUTH_USER);
    if (userAuth) {
      const userParse = JSON.parse(userAuth);
      setFirstName(userParse.first_name);
      setLastName(userParse.last_name);
      setPhone(userParse.phone);
      setLoginType(userParse.login_type);
      setUser(userParse);
    }
  }, []);
  return (
    <div className="row">
      <div className="col-12 mb-4">
        <h3><FontAwesomeIcon icon={faUserCircle} className="text-primary" /> Profile</h3>
      </div>
      {
        (error) && 
        <div className="col-12 mb-2">
          <div className="alert alert-light mt-4 alert-error">
            <b className="text-danger mt-2">Error: </b> {error.message}
          </div>
        </div>
      }
      <div className="col-12">
        <label className="label-field-register mr-2" htmlFor="phone">Email: </label>
        {user?.email}
      </div>
      <div className="col-12">
        <label className="label-field-register mr-2" htmlFor="phone">Status: </label>
        <b className="text-success">Verified</b>
      </div>
      <div className="col-6">
        <InputForm
          label="First name"
          id="first_name"
          inputType="text"
          inputPlaceholder="Enter your first name"
          inputIcon={<FontAwesomeIcon icon={faUser} />}
          inputValue={firstName}
          defaultValue={firstName}
          setInputValue={setFirstName}
          error={validateError}
          setError={setValidateError}
          validates={[
            {
              validateType: APP_VALIDATE_TYPE.REQUIRED,
              validateMessage: AUTHENTICATE_ENUM.FIRST_NAME_IS_EMPTY
            }
          ]}
        />
      </div>
      <div className="col-6">
        <InputForm
          label="last name"
          id="last_name"
          inputType="text"
          inputPlaceholder="Enter your last name"
          inputIcon={<FontAwesomeIcon icon={faUser} />}
          inputValue={lastName}
          defaultValue={lastName}
          setInputValue={setLastName}
          error={validateError}
          setError={setValidateError}
          validates={[
            {
              validateType: APP_VALIDATE_TYPE.REQUIRED,
              validateMessage: AUTHENTICATE_ENUM.LAST_NAME_IS_EMPTY
            }
          ]}
        />
      </div>
      <div className="col-12">
        <label className="label-field-register" htmlFor="phone">Phone</label>
        <Input
          type="text"
          placeholder="Your phone"
          id="phone"
          defaultValue={phone}
          onChange={handleEmailInputChange}
          invalid={hasError(validateError, 'phone')}
        />
        {
          hasError(validateError, 'phone') &&
          <div className="invalid-feedback" style={{display: 'block'}}>
            {printError(validateError, 'phone')}
          </div>
        }
      </div>
      <div className="col-12 mt-4">
        <Button color="primary" onClick={handleUpdateProfile} disabled={loadingUpdate || loadingChangePassword}>
          {loadingUpdate ? <Loading color="light" /> : 'Save'}
        </Button>
      </div>
      <div className="col-12 mt-4">
        <div className="custom-control custom-checkbox">
          <Input type="checkbox" className="custom-control-input" id="changePassword" onChange={handleOpenChangePassword} />
          <label htmlFor="changePassword" className="custom-control-label">{loginType === 'common' ? 'Change' : 'Set'} password</label>
        </div>
      </div>
      {
        openChangePassword && <>
          {
            loginType === "common" &&
            <div className="col-12 mt-2">
              <InputForm
                label="Password"
                id="password"
                inputType="password"
                inputPlaceholder="Enter current password"
                inputIcon={<FontAwesomeIcon icon={faLock} />}
                inputValue={password}
                setInputValue={setPasswordOld}
                error={validateError}
                setError={setValidateError}
                validates={[
                  {
                    validateType: APP_VALIDATE_TYPE.REQUIRED,
                    validateMessage: AUTHENTICATE_ENUM.PASSWORD_IS_EMPTY
                  }
                ]}
              />
            </div>
          }
          <div className="col-12 mt-2">
            <InputForm
              id="new_password"
              inputType="password"
              inputPlaceholder={`Enter ${loginType === 'common' ? 'new' : ''} password`}
              inputIcon={<FontAwesomeIcon icon={faLock} />}
              inputValue={newPassword}
              setInputValue={setNewPassword}
              error={validateError}
              setError={setValidateError}
              validates={[
                {
                  validateType: APP_VALIDATE_TYPE.REQUIRED,
                  validateMessage: AUTHENTICATE_ENUM.NEW_PASSWORD_IS_REQUIRED
                }
              ]}
            />
          </div>
          <div className="col-12 mt-2">
            <InputForm
              id="confirm_password"
              inputType="password"
              inputPlaceholder={`Confirm ${loginType === 'common' ? 'new' : ''} password`}
              inputIcon={<FontAwesomeIcon icon={faLock} />}
              inputValue={confirmNewPassword}
              setInputValue={setConfirmNewPassword}
              error={validateError}
              setError={setValidateError}
              inputValueMatch={newPassword}
              validates={[
                {
                  validateType: APP_VALIDATE_TYPE.REQUIRED,
                  validateMessage: AUTHENTICATE_ENUM.CONFIRM_PASSWORD_IS_EMPTY
                },
                {
                  validateType: APP_VALIDATE_TYPE.MATCH,
                  validateMessage: AUTHENTICATE_ENUM.CONFIRM_PASSWORD_MISMATCH
                }
              ]}
            />
          </div>
          <div className="col-12 mt-2">
            <Button color="primary" disabled={loadingUpdate || loadingChangePassword} onClick={loginType === "google_only" ? handleSetPassword : handleChangePassword}>
              {loadingChangePassword ? <Loading color="light" /> : 'Change password'}
            </Button>
          </div>
        </>
      }
    </div>
  );
}
export default ProfilePersonalView;