"use client"
import { APP_LINK, APP_VALIDATE_TYPE } from "@/enums/app.enum";
import { faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { AUTHENTICATE_ENUM } from "@/enums/authenticate.enum";
import { FormEvent, useState } from "react";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import Button from "@/common/components/Button";
import InputForm from "@/common/components/InputForm";
import { catchError, hasError, validateForm } from "@/services/base.service";
import { create } from "@/api/user.api";
import { API_CODE } from "@/enums/api.enum";
import RegisterSuccess from "./components/RegisterSuccess";
import Loading from "@/common/components/Loading";
import { useTranslations } from "next-intl";
import ErrorAlert from "@/common/components/ErrorAlert";
import LogoAuthPage from "@/common/layouts/LogoAuthPage";

const RegisterView = () => {
  const t = useTranslations();
  const [validateError, setValidateError] = useState<AppErrorType[] | []>([]);
  const [error, setError] = useState<AppErrorType | null>();
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [createSuccess, setCreateSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmitRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validates: { [key: string]: any[] } = {};
    validates['first_name'] = [
      {
        value: firstName,
        validateType: APP_VALIDATE_TYPE.REQUIRED,
        validateMessage: AUTHENTICATE_ENUM.FIRST_NAME_IS_EMPTY
      }
    ]
    validates['last_name'] = [
      {
        value: lastName,
        validateType: APP_VALIDATE_TYPE.REQUIRED,
        validateMessage: AUTHENTICATE_ENUM.LAST_NAME_IS_EMPTY
      }
    ]
    validates['email'] = [
      {
        value: email,
        validateType: APP_VALIDATE_TYPE.REQUIRED,
        validateMessage: AUTHENTICATE_ENUM.EMAIL_IS_EMPTY
      },
      {
        value: email,
        validateType: APP_VALIDATE_TYPE.IS_EMAIL,
        validateMessage: AUTHENTICATE_ENUM.EMAIL_IS_INVALID
      }
    ]
    validates['password'] = [
      {
        value: password,
        validateType: APP_VALIDATE_TYPE.REQUIRED,
        validateMessage: AUTHENTICATE_ENUM.PASSWORD_IS_EMPTY
      }
    ]
    validates['confirm_password'] = [
      {
        value: confirmPassword,
        validateType: APP_VALIDATE_TYPE.REQUIRED,
        validateMessage: AUTHENTICATE_ENUM.CONFIRM_PASSWORD_IS_EMPTY
      },
      {
        value: confirmPassword,
        matchValue: password,
        validateType: APP_VALIDATE_TYPE.MATCH,
        validateMessage: AUTHENTICATE_ENUM.CONFIRM_PASSWORD_MISMATCH
      }
    ];

    if (hasError(validateError) || !validateForm(validates, validateError, setValidateError)) {
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const response = await create({
        first_name: firstName ?? '',
        last_name: lastName ?? '',
        email: email ?? '',
        password: password ?? '',
        confirm_password: confirmPassword ?? ''
      });
      if (response && response.code === API_CODE.CREATED) {
        setLoading(false);
        setCreateSuccess(true);
        return;
      }

      setError(catchError(response));
    } catch (error) {
      setError(catchError(error as BaseResponseType));
    }
    setLoading(false);
  }
  return (
    <div className="login-box auth-box">
      <LogoAuthPage />
      <div className="card">
        <div className="card-body login-card-body">
          {createSuccess && <RegisterSuccess />}
          {
            !createSuccess && <>
              <h6 className="text-dark">{t('register.page_title_first')}</h6>
              <h6 className="text-secondary">{t('register.or')} <Link href={APP_LINK.LOGIN} className="mt-2">{t('register.login_link')}</Link> {t('register.page_title_second')}</h6>
              {
                (error) && <ErrorAlert error={error} className="mt-4" />
              }
              <form className="mt-4" onSubmit={handleSubmitRegister}>
                <InputForm
                  label={t('register.label_input_first_name')}
                  id="first_name"
                  inputType="text"
                  inputPlaceholder={t('register.placeholder_input_first_name')}
                  inputIcon={<FontAwesomeIcon icon={faUser} />}
                  inputValue={firstName}
                  setInputValue={setFirstName}
                  error={validateError}
                  setError={setValidateError}
                  validates={[
                    {
                      validateType: APP_VALIDATE_TYPE.REQUIRED,
                      validateMessage: t('register.firstname_is_required')
                    }
                  ]}
                />
                <InputForm
                  label={t('register.label_input_last_name')}
                  id="last_name"
                  inputType="text"
                  inputPlaceholder={t('register.placeholder_input_last_name')}
                  inputIcon={<FontAwesomeIcon icon={faUser} />}
                  inputValue={lastName}
                  setInputValue={setLastName}
                  error={validateError}
                  setError={setValidateError}
                  validates={[
                    {
                      validateType: APP_VALIDATE_TYPE.REQUIRED,
                      validateMessage: t('register.lastname_is_required')
                    }
                  ]}
                />
                <InputForm
                  label="Email"
                  id="email"
                  inputType="text"
                  inputPlaceholder={t('register.placeholder_input_email')}
                  inputIcon={<FontAwesomeIcon icon={faEnvelope} />}
                  inputValue={email}
                  setInputValue={setEmail}
                  error={validateError}
                  setError={setValidateError}
                  validates={[
                    {
                      validateType: APP_VALIDATE_TYPE.REQUIRED,
                      validateMessage: t('register.email_is_required')
                    }
                  ]}
                />
                <InputForm
                  label={t('register.label_input_password')}
                  id="password"
                  inputType="password"
                  inputPlaceholder={t('register.placeholder_input_password')}
                  inputIcon={<FontAwesomeIcon icon={faLock} />}
                  inputValue={password}
                  setInputValue={setPassword}
                  error={validateError}
                  setError={setValidateError}
                  validates={[
                    {
                      validateType: APP_VALIDATE_TYPE.REQUIRED,
                      validateMessage: t('register.password_is_required')
                    }
                  ]}
                />
                <InputForm
                  id="confirm_password"
                  inputType="password"
                  inputPlaceholder={t('register.placeholder_input_confirm_password')}
                  inputIcon={<FontAwesomeIcon icon={faLock} />}
                  inputValue={confirmPassword}
                  setInputValue={setConfirmPassword}
                  error={validateError}
                  setError={setValidateError}
                  inputValueMatch={password}
                  validates={[
                    {
                      validateType: APP_VALIDATE_TYPE.REQUIRED,
                      validateMessage: t('register.confirm_password_is_required')
                    },
                    {
                      validateType: APP_VALIDATE_TYPE.MATCH,
                      validateMessage: t('register.confirm_passowrd_is_mismacth')
                    }
                  ]}
                />
                <div className="social-auth-links text-center mb-3">
                  <Button type="submit" color="primary" className="mb-2" fullWidth disabled={hasError(validateError)}>
                    {loading ? <Loading color="light" /> : t('btn_send')}
                  </Button>
                </div>
              </form>
            </>
          }
        </div>
      </div>
    </div>
  )
}
export default RegisterView;