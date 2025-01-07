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

const ResetPasswordView = () => {
  const searchParams = useSearchParams();
  const hash = searchParams.get('hash');
  const email = searchParams.get('email');
  const router = useRouter();
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
      <div className="login-logo">
        <Link href="/">
          <img src="/img/logo.png" alt="Next Ticket Logo" width={130} height={90} />
        </Link>
      </div>
      <div className="card">
        <div className="card-body login-card-body">
          {success ? <ResetPasswordSuccess /> : (
          <form onSubmit={handleSubmitSetPassword}>
            <h6 className="text-dark">Please set your new password here</h6>
            <h6 className="text-secondary">After setting a new password, you can log in with the password you just set.</h6>
            <hr/>
            {
              (error) && <div className="alert alert-light">
                <b className="text-danger mt-2">Error: </b> {error.message}
              </div>
            }
            <InputForm
              label="Password"
              id="password"
              inputType="password"
              inputPlaceholder="Enter new password"
              inputIcon={<FontAwesomeIcon icon={faLock} />}
              inputValue={passwordInput}
              setInputValue={setPasswordInput}
              error={validateError}
              setError={setValidateError}
              validates={[
                {
                  validateType: APP_VALIDATE_TYPE.REQUIRED,
                  validateMessage: AUTHENTICATE_ENUM.PASSWORD_IS_EMPTY
                }
              ]}
            />
            <InputForm
              id="confirm_password"
              inputType="password"
              inputPlaceholder="Confirm your password"
              inputIcon={<FontAwesomeIcon icon={faLock} />}
              inputValue={passwordConfirmInput}
              setInputValue={setPasswordConfirmInput}
              error={validateError}
              setError={setValidateError}
              inputValueMatch={passwordInput}
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
            <div className="social-auth-links text-center mb-3">
              <Button type="submit" color="primary" fullWidth disabled={loading || hasError(validateError)}>
                {loading ? <Loading color="light" /> : 'Send'}
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