"use client"
import { verify } from "@/api/authenticate.api";
import Loading from "@/common/components/Loading";
import LogoAuthPage from "@/common/layouts/LogoAuthPage";
import { API_CODE } from "@/enums/api.enum";
import { APP_LINK } from "@/enums/app.enum";
import { catchError } from "@/services/base.service";
import { ResponseAuthenticateType } from "@/types/authenticate.type";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import { faAngleDoubleRight, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const VerifyView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const hash = searchParams.get('hash');
  const [loading, setLoading] = useState(true);
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [error, setError] = useState<AppErrorType | null>();
  useEffect(() => {
    const verifyAccount = async () => {
      if (!email || !hash) {
        return;
      }

      try {
        const response = await verify({
          email: email,
          hash: hash
        });
        if (response && response.code === API_CODE.OK) {
          setLoading(false);
          setVerifySuccess(true);
          setTimeout(() => {
            router.push(APP_LINK.LOGIN);
          }, 3000);
          return;
        }
        setError(catchError(response));
      } catch (error) {
        setError(catchError(error as BaseResponseType));
      }
      setVerifySuccess(false);
      setLoading(false);
    }
    verifyAccount();
  }, []);
  return (
    <div className="login-box auth-box">
      <LogoAuthPage />
      <div className="card">
        <div className="card-body login-card-body">
          {
            (error) && <div className="alert alert-light mt-4 alert-error">
              <b className="text-danger mt-2">Error: </b> {error.message}
            </div>
          }
          {
            (loading && !verifySuccess) && <center>
              <Loading color="primary" /> <span className="text-primary">Verifying account ...</span>
            </center>
          }
          {
            (!loading && verifySuccess) && <center>
              <FontAwesomeIcon icon={faCheckCircle} className="text-success" /> <span className="text-success">Account has been verified</span>
              <p className="text-primary mt-4"><FontAwesomeIcon icon={faAngleDoubleRight} /> Redirecting to login page ...</p>
            </center>
          }
        </div>
      </div>
    </div>
  )
}
export default VerifyView;