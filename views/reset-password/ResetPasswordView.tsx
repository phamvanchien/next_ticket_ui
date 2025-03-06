"use client"
import { recoveryPassword } from "@/api/authenticate.api";
import Button from "@/common/components/Button";
import InputForm from "@/common/components/InputForm";
import Loading from "@/common/components/Loading";
import { API_CODE } from "@/enums/api.enum";
import { APP_LINK, APP_VALIDATE_TYPE } from "@/enums/app.enum";
import { AUTHENTICATE_ENUM } from "@/enums/authenticate.enum";
import { catchError, hasError, validateForm } from "@/services/base.service";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import ResetPasswordSuccess from "./components/ResetPasswordSuccess";
import { useTranslations } from "next-intl";
import ErrorAlert from "@/common/components/ErrorAlert";
import LogoAuthPage from "@/common/layouts/LogoAuthPage";

const ResetPasswordView = () => {
  const searchParams = useSearchParams();
  const hash = searchParams.get('hash');
  const email = searchParams.get('email');
  const router = useRouter();
  const t = useTranslations();
  const [passwordInput, setPasswordInput] = useState<string>();
  const [passwordConfirmInput, setPasswordConfirmInput] = useState<string>();
  const [error, setError] = useState<AppErrorType | null>(null);
  const [loading, setLoading] = useState(false);
  const [validateError, setValidateError] = useState<AppErrorType[] | []>([]);
  const [success, setSuccess] = useState(false);
  const handleSubmitSetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validates: { [key: string]: any[] } = {};
    validates['password'] = [
      {
        value: passwordInput,
        validateType: APP_VALIDATE_TYPE.REQUIRED,
        validateMessage: AUTHENTICATE_ENUM.PASSWORD_IS_EMPTY
      }
    ]
    validates['confirm_password'] = [
      {
        value: passwordConfirmInput,
        validateType: APP_VALIDATE_TYPE.REQUIRED,
        validateMessage: AUTHENTICATE_ENUM.CONFIRM_PASSWORD_IS_EMPTY
      },
      {
        value: passwordConfirmInput,
        matchValue: passwordInput,
        validateType: APP_VALIDATE_TYPE.MATCH,
        validateMessage: AUTHENTICATE_ENUM.CONFIRM_PASSWORD_MISMATCH
      }
    ];

    if (hasError(validateError) || !validateForm(validates, validateError, setValidateError) || !email || !hash) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await recoveryPassword({
        email: email,
        hash: hash,
        password: passwordInput ?? '',
        confirm_password: passwordConfirmInput ?? ''
      });
      if (response && response.code === API_CODE.OK) {
        setSuccess(true);
        return;
      }
      setError(catchError(response));
    } catch (error) {
      setLoading(false);
      setError(catchError(error as BaseResponseType));
    }
  }
  return <>
    <div className="login-box auth-box">
      <LogoAuthPage />
      <div className="card">
        <div className="card-body login-card-body">
          {success ? <ResetPasswordSuccess /> : (
          <form onSubmit={handleSubmitSetPassword}>
            <h6 className="text-dark">{t('reset_password.page_title_main')}</h6>
            <h6 className="text-secondary">{t('reset_password.page_title_sub')}</h6>
            <hr/>
            {
              (error) && <ErrorAlert error={error} />
            }
            <InputForm
              label={t('reset_password.label_input_password')}
              id="password"
              inputType="password"
              inputPlaceholder={t('reset_password.placeholder_input_password')}
              inputIcon={<FontAwesomeIcon icon={faLock} />}
              inputValue={passwordInput}
              setInputValue={setPasswordInput}
              error={validateError}
              setError={setValidateError}
              validates={[
                {
                  validateType: APP_VALIDATE_TYPE.REQUIRED,
                  validateMessage: t('reset_password.password_is_required')
                }
              ]}
            />
            <InputForm
              id="confirm_password"
              inputType="password"
              inputPlaceholder={t('reset_password.placeholder_input_confirm_password')}
              inputIcon={<FontAwesomeIcon icon={faLock} />}
              inputValue={passwordConfirmInput}
              setInputValue={setPasswordConfirmInput}
              error={validateError}
              setError={setValidateError}
              inputValueMatch={passwordInput}
              validates={[
                {
                  validateType: APP_VALIDATE_TYPE.REQUIRED,
                  validateMessage: t('reset_password.confirm_password_is_required')
                },
                {
                  validateType: APP_VALIDATE_TYPE.MATCH,
                  validateMessage: t('reset_password.confirm_passowrd_is_mismacth')
                }
              ]}
            />
            <div className="social-auth-links text-center mb-3">
              <Button type="submit" color="primary" fullWidth disabled={loading || hasError(validateError)}>
                {loading ? <Loading color="light" /> : t('btn_send')}
              </Button>
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  </>
}
export default ResetPasswordView;