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

const RegisterView = () => {
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
      <div className="login-logo">
        <Link href="/">
          <img src="/img/logo.png" alt="Next Ticket Logo" width={130} height={90} />
        </Link>
      </div>
      <div className="card">
        <div className="card-body login-card-body">
          {createSuccess && <RegisterSuccess />}
          {
            !createSuccess && <>
              <h6 className="text-dark">Create an account on Next Ticket</h6>
              <h6 className="text-secondary">or <Link href={APP_LINK.LOGIN} className="mt-2">go to login</Link> if you have an account</h6>
              {
                (error) && <div className="alert alert-light mt-4 alert-error">
                  <b className="text-danger mt-2">Error: </b> {error.message}
                </div>
              }
              <form className="mt-2" onSubmit={handleSubmitRegister}>
                <InputForm
                  label="First name"
                  id="first_name"
                  inputType="text"
                  inputPlaceholder="Enter your first name"
                  inputIcon={<FontAwesomeIcon icon={faUser} />}
                  inputValue={firstName}
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
                <InputForm
                  label="Last name"
                  id="last_name"
                  inputType="text"
                  inputPlaceholder="Enter your last name"
                  inputIcon={<FontAwesomeIcon icon={faUser} />}
                  inputValue={lastName}
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
                <InputForm
                  label="Email"
                  id="email"
                  inputType="text"
                  inputPlaceholder="Enter your email"
                  inputIcon={<FontAwesomeIcon icon={faEnvelope} />}
                  inputValue={email}
                  setInputValue={setEmail}
                  error={validateError}
                  setError={setValidateError}
                  validates={[
                    {
                      validateType: APP_VALIDATE_TYPE.REQUIRED,
                      validateMessage: AUTHENTICATE_ENUM.EMAIL_IS_EMPTY
                    }
                  ]}
                />
                <InputForm
                  label="Password"
                  id="password"
                  inputType="password"
                  inputPlaceholder="Enter your password"
                  inputIcon={<FontAwesomeIcon icon={faLock} />}
                  inputValue={password}
                  setInputValue={setPassword}
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
                  inputValue={confirmPassword}
                  setInputValue={setConfirmPassword}
                  error={validateError}
                  setError={setValidateError}
                  inputValueMatch={password}
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
                  <Button type="submit" color="primary" className="mb-2" fullWidth disabled={hasError(validateError)}>
                    {loading ? <Loading color="light" /> : 'Send'}
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