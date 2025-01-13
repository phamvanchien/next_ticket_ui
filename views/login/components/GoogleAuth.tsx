import { authGoogleCallback } from "@/api/authenticate.api";
import ImageIcon from "@/common/components/ImageIcon";
import Loading from "@/common/components/Loading";
import { APP_CONFIG } from "@/config/app.config";
import { API_CODE } from "@/enums/api.enum";
import { APP_AUTH, APP_LINK, APP_LOCALSTORAGE } from "@/enums/app.enum";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import { setCookie } from "@/utils/cookie.util";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import SetPasswordGoogleAccount from "./SetPasswordGoogleAccount";
import { catchError } from "@/services/base.service";

interface GoogleAuthProps {
  code: string
  scope: string
  authuser: string
  prompt: string
}

const GoogleAuth: React.FC<GoogleAuthProps> = ({ code, scope, authuser, prompt }) => {
  const router = useRouter();
  const [error, setError] = useState<AppErrorType | null>(null);
  const [verified, setVerified] = useState(false);
  const [showSetPassword, setShowSetPassword] = useState(false);
  useEffect(() => {
    const handleAuthGoogleCallback = async () => {
      try {
        console.log('params: ', code, scope, authuser, prompt)
        setError(null);
        const response = await authGoogleCallback({code, scope, authuser, prompt});
        if (response && response.code === API_CODE.OK) {
          setVerified(true);
          setCookie(APP_AUTH.COOKIE_AUTH_KEY, response.data.access_token, { expires: APP_CONFIG.TOKEN_EXPIRE_TIME });
          setCookie(APP_AUTH.COOKIE_AUTH_USER, JSON.stringify(response.data.user), { expires: APP_CONFIG.TOKEN_EXPIRE_TIME });
          if (response.data.login_type === 'register_google') {
            setShowSetPassword(true);
            return;
          }
          router.push(APP_LINK.GO_TO_WORKSPACE);
          return;
        }
        setError(catchError(response));
      } catch (error) {
        setError(catchError(error as BaseResponseType));
      }
    }
    handleAuthGoogleCallback();
  }, []);
  if (showSetPassword) {
    return <SetPasswordGoogleAccount />
  }
  return <>
    <center>
      <ImageIcon icon="google" className="mb-2" width={50} height={50} />
    </center>
    {
      error ? <>
        {/* <center>Error: </center> */}
        <h6 className="text-success mt-2 text-center">{error.message}</h6>
        {/* <center>
          <a href={APP_LINK.LOGIN}>Go to Login</a>
        </center> */}
      </> :
      <center>
        {
          verified ? <><FontAwesomeIcon icon={faCheckCircle} className="text-success" /> <span className="text-success">Verified Google account</span></> : 
          <><Loading color="primary" /> <span className="text-primary">Verifying Google account ...</span></>
        }
      </center>
    }
  </>
}
export default GoogleAuth;