"use client"
import { faEnvelope, faEye, faEyeSlash, faSignIn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@/common/components/Button";
import ImageIcon from "@/common/components/ImageIcon";
import Input from "@/common/components/Input";
import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import { API_CODE } from "@/enums/api.enum";
import { catchError, hasError, printError, validateForm, validateInput } from "@/services/base.service";
import { AUTHENTICATE_ENUM } from "@/enums/authenticate.enum";
import { APP_AUTH, APP_LINK, APP_LOCALSTORAGE, APP_VALIDATE_TYPE } from "@/enums/app.enum";
import { authenticate, fetchEmail, loginWithGoogle } from "@/api/authenticate.api";
import { useRouter, useSearchParams } from "next/navigation";
import { setCookie } from "@/utils/cookie.util";
import { APP_CONFIG } from "@/config/app.config";
import Loading from "@/common/components/Loading";
import GoogleAuth from "./components/GoogleAuth";

const LoginView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const scope = searchParams.get('scope');
  const authuser = searchParams.get('authuser');
  const prompt = searchParams.get('prompt');

  const [error, setError] = useState<AppErrorType | null>(null);
  const [validateError, setValidateError] = useState<AppErrorType[] | []>([]);
  const [loading, setLoading] = useState(false);
  const [emailInput, setEmailInput] = useState<string>();
  const [passwordInput, setPasswordInput] = useState<string>();
  const [passwordShow, setPasswordShow] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [authGoogleLoading, setAuthGoogleLoading] = useState(false);

  const handleShowPassword = () => {
    setPasswordShow(passwordShow ? false : true);
  }

  const handleValidateEmail = (value: string = emailInput ?? '') => {
    const requiredEmail = validateInput('email', value ?? '', AUTHENTICATE_ENUM.EMAIL_IS_EMPTY, APP_VALIDATE_TYPE.REQUIRED, validateError, setValidateError);
    const isEmail = validateInput('email', value ?? '',AUTHENTICATE_ENUM.EMAIL_IS_INVALID, APP_VALIDATE_TYPE.IS_EMAIL, validateError, setValidateError);
    if (!requiredEmail || !isEmail) {
      return false;
    }
    return true;
  }

  const handleValidatePassword = (value: string = passwordInput ?? '') => {
    const requiredPassword = validateInput('password', value ?? '', AUTHENTICATE_ENUM.PASSWORD_IS_EMPTY, APP_VALIDATE_TYPE.REQUIRED, validateError, setValidateError);
    if (!requiredPassword) {
      return false;
    }
    return true;
  }

  const handleEmailInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmailInput(event.target.value);
    handleValidateEmail(event.target.value);
  }

  const handlePasswordInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPasswordInput(event.target.value);
    handleValidatePassword(event.target.value);
  }

  const handleSubmitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!handleValidateEmail() || !handleValidatePassword()) {
      return;
    }

    setLoading(true);
    try {
      const response = await authenticate({
        email: emailInput ?? '',
        password: passwordInput ?? ''
      });
      if (response && response.code === API_CODE.OK) {
        setCookie(APP_AUTH.COOKIE_AUTH_KEY, response.data.access_token, { expires: APP_CONFIG.TOKEN_EXPIRE_TIME });
        setCookie(APP_AUTH.COOKIE_AUTH_USER, JSON.stringify(response.data.user), { expires: APP_CONFIG.TOKEN_EXPIRE_TIME });
        const workspaceStorage = localStorage.getItem(APP_LOCALSTORAGE.WORKSPACE_STORAGE);
        if (workspaceStorage) {
          router.push(APP_LINK.WORKSPACE + '/' + workspaceStorage);
          return
        }
        router.push(APP_LINK.GO_TO_WORKSPACE);
        return;
      }
      setError(catchError(response));
    } catch (error) {
      setError(catchError(error as BaseResponseType));
    }
    setLoading(false);
  }

  const authenticateWithGoogle = async () => {
    setAuthGoogleLoading(true);
    try {
      const response = await loginWithGoogle();
      if (response && response.code === API_CODE.OK) {
        window.location.href = response.data;
        return;
      }
      setError(catchError(response));
    } catch (error) {
      setError(catchError(error as BaseResponseType));
    }
    setAuthGoogleLoading(false);
  };

  const handleFetchEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validates: { [key: string]: any[] } = {};
    validates['email'] = [
      {
        value: emailInput,
        validateType: APP_VALIDATE_TYPE.REQUIRED,
        validateMessage: AUTHENTICATE_ENUM.EMAIL_IS_EMPTY
      }
    ];

    if (hasError(validateError) || !validateForm(validates, validateError, setValidateError)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetchEmail(emailInput ?? '');
      if (response && response.code === API_CODE.OK) {
        if (response.data.login_type === 'google') {
          authenticateWithGoogle();
          return;
        }
        setEmailVerified(true);
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(catchError(response));
    } catch (error) {
      setLoading(false);
      setError(catchError(error as BaseResponseType));
    }
  }

  return (
    <div className="login-box auth-box">
      <div className="login-logo">
        <Link href="/">
          <img src="/img/logo.png" alt="AdminLTE Logo" width={130} height={90} />
        </Link>
      </div>
      <div className="card">
        <div className="card-body login-card-body">
          {
            (code && scope && authuser && prompt) ?
            <GoogleAuth 
              code={code}
              scope={scope}
              authuser={authuser}
              prompt={prompt}
            /> :
            <>
              <Button color="default" fullWidth onClick={authenticateWithGoogle} className="google-btn mb-2" disabled={authGoogleLoading || loading}>
                <ImageIcon icon="google" width={18} height={18} /> {authGoogleLoading ? <Loading color="primary" /> : 'Login with Google'}
              </Button>
              <center>
                <span className="text-muted mt-4 mb-4">Or</span>
              </center>
              {
                (error) && <div className="alert alert-light alert-error">
                  <b className="text-danger mt-2">Error: </b> {error.message}
                </div>
              }
              <form onSubmit={emailVerified ? handleSubmitLogin : handleFetchEmail} className="mt-2">
                {
                  !emailVerified && <div className="input-group mb-3">
                    <Input 
                      type="text" 
                      placeholder="Enter your email address" 
                      minLength={3}
                      maxLength={100}
                      id="email"
                      onChange={handleEmailInputChange}
                      invalid={hasError(validateError, 'email')}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <FontAwesomeIcon icon={faEnvelope} />
                      </div>
                    </div>
                    {
                      hasError(validateError, 'email') &&
                      <div className="invalid-feedback" style={{display: 'block'}}>
                        {printError(validateError, 'email')}
                      </div>
                    }
                  </div>
                }
                {
                  emailVerified && <div className="input-group mb-3">
                  <Input 
                    type={passwordShow ? 'text' : 'password'} 
                    placeholder="Password" 
                    minLength={5} 
                    maxLength={10}
                    onChange={handlePasswordInputChange}
                    invalid={hasError(validateError, 'password')}
                  />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <FontAwesomeIcon icon={passwordShow ? faEye : faEyeSlash} onClick={handleShowPassword} />
                      </div>
                    </div>
                    {
                      hasError(validateError, 'password') &&
                      <div className="invalid-feedback" style={{display: 'block'}}>
                        {printError(validateError, 'password')}
                      </div>
                    }
                  </div>
                }
                <div className="social-auth-links text-center mb-3">
                  {
                    !emailVerified ? 
                    <Button type="submit" color="primary" fullWidth disabled={loading || authGoogleLoading}>
                      {loading ? <Loading color="light" /> : 'Continue'}
                    </Button> :
                    <Button type="submit" color="primary" fullWidth disabled={loading || authGoogleLoading}>
                      {loading ? <Loading color="light" /> : <><FontAwesomeIcon icon={faSignIn} /> Sign in</>}
                    </Button>
                  }
                </div>
              </form>
              <p className="mb-1">
                <Link className="text-secondary" href={APP_LINK.FORGOT_PASSWORD}>Forgot password</Link>
              </p>
              <p className="mb-0">
                <Link href={APP_LINK.REGISTER} className="text-center text-secondary">
                  Create a account
                </Link>
              </p>
            </>
          }
        </div>
      </div>
    </div>
  )
}
export default LoginView;