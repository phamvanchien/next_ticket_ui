"use client"
import { forgotPassword } from "@/api/authenticate.api";
import Button from "@/common/components/Button";
import InputForm from "@/common/components/InputForm";
import Loading from "@/common/components/Loading";
import { API_CODE } from "@/enums/api.enum";
import { APP_LINK, APP_VALIDATE_TYPE } from "@/enums/app.enum";
import { AUTHENTICATE_ENUM } from "@/enums/authenticate.enum";
import { catchError, hasError, validateForm } from "@/services/base.service";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { FormEvent, useState } from "react";
import SendLinkSuccess from "./components/SendLinkSuccess";
import ErrorAlert from "@/common/components/ErrorAlert";
import { useTranslations } from "next-intl";
import LogoAuthPage from "@/common/layouts/LogoAuthPage";

const ForgotPasswordView = () => {
  const t = useTranslations();
  const [error, setError] = useState<AppErrorType | null>(null);
  const [validateError, setValidateError] = useState<AppErrorType[] | []>([]);
  const [loading, setLoading] = useState(false);
  const [emailInput, setEmailInput] = useState<string>();
  const [sent, setSent] = useState(false);
  const handleSubmitSendLinkReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validates: { [key: string]: any[] } = {};
    validates['email'] = [
      {
        value: emailInput,
        validateType: APP_VALIDATE_TYPE.REQUIRED,
        validateMessage: AUTHENTICATE_ENUM.EMAIL_IS_EMPTY
      },
      {
        value: emailInput,
        validateType: APP_VALIDATE_TYPE.IS_EMAIL,
        validateMessage: AUTHENTICATE_ENUM.EMAIL_IS_INVALID
      }
    ];

    if (hasError(validateError) || !validateForm(validates, validateError, setValidateError)) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await forgotPassword({
        email: emailInput ?? ''
      });
      if (response && response.code === API_CODE.OK) {
        setLoading(false);
        setSent(true);
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
          {
            sent ? <SendLinkSuccess /> : <>
              <h6 className="text-dark">{t('forgot_password.page_title_first')}</h6>
              <h6 className="text-secondary mb-2">{t('forgot_password.page_title_second')}</h6>
              <ErrorAlert error={error} />
              <form className="mt-4" onSubmit={handleSubmitSendLinkReset}>
                <InputForm
                  id="email"
                  inputType="text"
                  inputPlaceholder={t('forgot_password.input_email')}
                  inputIcon={<FontAwesomeIcon icon={faEnvelope} />}
                  inputValue={emailInput}
                  setInputValue={setEmailInput}
                  error={validateError}
                  setError={setValidateError}
                  validates={[
                    {
                      validateType: APP_VALIDATE_TYPE.REQUIRED,
                      validateMessage: AUTHENTICATE_ENUM.EMAIL_IS_EMPTY
                    }
                  ]}
                />
                <div className="social-auth-links text-center mb-3">
                  <Button type="submit" color="primary" className="mb-2" fullWidth disabled={loading || hasError(validateError)}>
                    {loading ? <Loading color="light" /> : t('btn_send')}
                  </Button>
                </div>
              </form>
              <p className="mb-1">
                <Link className="text-secondary" href={APP_LINK.LOGIN}>{t('forgot_password.go_to_login')}</Link>
              </p>
            </>
          }
        </div>
      </div>
    </div>
  )
}
export default ForgotPasswordView;