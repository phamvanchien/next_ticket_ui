"use client";
import React, { useEffect, useState } from "react";
import Button from "@/common/components/Button";
import Link from "next/link";
import Input from "@/common/components/Input";
import { useTranslations } from "next-intl";
import { isEmail, isEmpty } from "@/services/validate.service";
import { authenticate, authGoogleCallback, fetchEmail, loginWithGoogle } from "@/api/authenticate.api";
import { API_CODE } from "@/enums/api.enum";
import Loading from "@/common/components/Loading";
import { displayMessage } from "@/utils/helper.util";
import { BaseResponseType } from "@/types/base.type";
import { setCookie } from "@/utils/cookie.util";
import { APP_AUTH, APP_LINK } from "@/enums/app.enum";
import { APP_CONFIG } from "@/configs/app.config";
import { useRouter, useSearchParams } from "next/navigation";

const LoginView = () => {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const scope = searchParams.get('scope');
  const authuser = searchParams.get('authuser');
  const prompt = searchParams.get('prompt');
  const [errorMessage, setErrorMessage] = useState<string>();
  const [emailInput, setEmailInput] = useState<string>();
  const [passwordInput, setPasswordInput] = useState<string>();
  const [fetchedEmail, setFetchedEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const handleSubmitFetchEmail = async () => {
    try {
      if (isEmpty(emailInput)) {
        setErrorMessage(t('authenticate_message.email_is_required'));
        return;
      }
      if (!isEmail(emailInput as string)) {
        setErrorMessage(t('authenticate_message.email_is_valid'));
        return;
      }
      if (!emailInput) {
        return;
      }

      setLoading(true);
      setErrorMessage(undefined);
      setPasswordInput('');
      const response = await fetchEmail(emailInput);
      setLoading(false);
      if (response && response.code === API_CODE.OK) {
        if (response.data.login_type === 'google') {
          router.push(response.data.google_auth_url);
          return;
        }
        setFetchedEmail(true);
        return;
      }
      displayMessage('error', response.error?.message);
    } catch (error) {
      displayMessage('error', (error as BaseResponseType).error?.message);
      setLoading(false);
      setErrorMessage(undefined);
    }
  }
  const handleAuthenticate = async () => {
    try {
      if (isEmpty(passwordInput) || !passwordInput) {
        setErrorMessage(t('authenticate_message.password_is_required'));
        return;
      }
      if (!emailInput) {
        return;
      }

      setLoading(true);
      setErrorMessage(undefined);
      const response = await authenticate({
        email: emailInput,
        password: passwordInput
      });
      if (response && response.code === API_CODE.OK) {
        handleLoginSuccess(response);
        return;
      }
      displayMessage('error', response.error?.message);
    } catch (error) {
      displayMessage('error', (error as BaseResponseType).error?.message);
      setLoading(false);
      setErrorMessage(undefined);
    }
  }
  const handleLoginWithGoogle = async () => {
    try {
      setLoadingGoogle(true);
      const response = await loginWithGoogle();
      if (response && response.code === API_CODE.OK) {
        router.push(response.data);
        return;
      }
      displayMessage('error', response.error?.message);
    } catch (error) {
      setLoadingGoogle(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  const handleAuthWithGoogle = async () => {
    try {
      if (!code || !scope || !authuser || !prompt) {
        return;
      }
      const response = await authGoogleCallback({
        code: code,
        scope: scope,
        authuser: authuser,
        prompt: prompt
      });
      if (response && response.code === API_CODE.OK) {
        handleLoginSuccess(response);
        return;
      }
      router.replace(APP_LINK.LOGIN);
      displayMessage('error', response.error?.message);
    } catch (error) {
      setLoadingGoogle(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
      router.replace(APP_LINK.LOGIN);
    }
  }
  const handleLoginSuccess = (response: BaseResponseType) => {
    setCookie(APP_AUTH.COOKIE_AUTH_KEY, response.data.access_token, { expires: APP_CONFIG.TOKEN_EXPIRE_TIME });
    setCookie(APP_AUTH.COOKIE_AUTH_USER, JSON.stringify(response.data.user), { expires: APP_CONFIG.TOKEN_EXPIRE_TIME });
    window.location.href = APP_LINK.WORKSPACE;
  }
  useEffect(() => {
    if (code && scope && authuser && prompt) {
      handleAuthWithGoogle();
    }
  }, [code]);

  if (code && scope && authuser && prompt) {
    return (
      <div className="card shadow-sm p-4 border-0" style={{ width: "90%", maxWidth: "400px" }}>
        <h5 className="text-center mb-3 mt-4">{t('login.login_to_label')} Next Tech</h5>
        <center>
          <img src="/images/icons/loading_google.gif" className="mt-4" height={70} width={150} />
        </center>
      </div>
    )
  }
  return <>
    <div className="card shadow-sm p-4 border-0" style={{ width: "90%", maxWidth: "400px" }}>
      <h5 className="text-center mb-3 mt-4">{t('login.login_to_label')} Next Tech</h5>
      {
        fetchedEmail ?
        <Input 
          minLength={5}
          maxLength={16}
          type="password" 
          placeholder={t('login.input_password')} 
          classInput="rounded-2" 
          classGroup="mb-3"
          errorMessage={errorMessage}
          value={passwordInput}
          onChange={(e) => setPasswordInput (e.target.value)}
          disabled={loading || loadingGoogle}
          validates={[
            {
              type: 'is_required',
              message: t('authenticate_message.password_is_required')
            }
          ]}
        /> : 
        <Input 
          type="email" 
          placeholder={t('login.input_email')} 
          classInput="rounded-2" 
          classGroup="mb-3"
          errorMessage={errorMessage}
          value={emailInput}
          onChange={(e) => setEmailInput (e.target.value)}
          disabled={loading || loadingGoogle}
          validates={[
            {
              type: 'is_required',
              message: t('authenticate_message.email_is_required')
            },
            {
              type: 'is_email',
              message: t('authenticate_message.email_is_valid')
            }
          ]}
        />
      }
      <Button 
        color={loading ? 'secondary' : 'primary'} 
        className="w-100 rounded-2 mb-3"
        onClick={!fetchedEmail ? handleSubmitFetchEmail : handleAuthenticate}
        disabled={loading || loadingGoogle}
      >
        {loading ? <Loading color="light" /> : (fetchedEmail ? t('login.sign_in_btn') : t('login.continue_btn'))}
      </Button>
      <div className="text-center text-muted mb-3">
        {t('login.or_text')}
      </div>
      <Button 
        disabled={loadingGoogle || loading} 
        color="light" 
        className={`align-items-center shadow-sm border rounded-pill px-4 py-${loadingGoogle ? '1' : '2'} w-100`}
        onClick={handleLoginWithGoogle}
      >
        {!loadingGoogle && <img src="/images/icons/google.png" alt="Google Logo" className="me-2" width="24" height="24" />}
        <span>{loadingGoogle ? <img src="/images/icons/loading_google.gif" height={30} width={90} /> : t('login.login_google_btn')}</span>
      </Button>
      <div className="text-center mt-3">
        <Link href="#" className="text-decoration-none text-primary">
          {t('login.create_account_btn')}
        </Link>
      </div>
    </div>
  </>
}
export default LoginView;