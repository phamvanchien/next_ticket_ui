import Input from "@/common/components/Input";
import { APP_VALIDATE_TYPE } from "@/enums/app.enum";
import { hasError, printError, validateInput } from "@/services/base.service";
import { AppErrorType } from "@/types/base.type";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, useState } from "react";

interface InputFormProps {
  label?: string
  id: string
  inputType: "number" | "search" | "text" | "email" | "password" | "radio" | "checkbox"
  inputPlaceholder: string
  inputIcon?: JSX.Element
  setError: (error: AppErrorType[]) => void
  validates: ValidateObject[]
  error: AppErrorType[]
  setInputValue: (inputValue?: string) => void
  inputValue?: string
  inputValueMatch?: string
  className?: string
  defaultValue?: string
}

export interface ValidateObject {
  validateType: "required" | "is_email" | "is_match"
  validateMessage: string
}

const InputForm: React.FC<InputFormProps> = ({
  label, 
  id, 
  inputType, 
  inputPlaceholder, 
  inputIcon, 
  validates, 
  error, 
  inputValue, 
  inputValueMatch,
  className,
  defaultValue,
  setInputValue, 
  setError
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleValidate = (value: string = inputValue ?? '') => {
    for (let i = 0; i < validates.length; i++) {
      const validate = validates[i];
      const valid = validateInput(
        id, 
        validate.validateType === APP_VALIDATE_TYPE.MATCH ? [value ?? '', inputValueMatch ?? ''] : value ?? '', 
        validate.validateMessage, 
        validate.validateType, 
        error,
        setError
      );
    }
  }
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    handleValidate(event.target.value);
  }
  return <>
    {label && <label className="label-field-register" htmlFor={id}>{label}</label>}
    <div className="input-group mb-3">
      <Input
        type={(inputType === 'password' && showPassword) ? 'text' : inputType}
        placeholder={inputPlaceholder}
        className={className ?? ''}
        id={id}
        onChange={handleInputChange}
        invalid={hasError(error, id)}
        defaultValue={defaultValue}
      />
      {
        inputIcon &&
        <div className="input-group-append">
          <div className="input-group-text">
            {inputType === 'password' && <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} className="mr-2" onClick={() => setShowPassword (showPassword ? false : true)} />}
            {inputIcon}
          </div>
        </div>
      }
      {
        (hasError(error, id)) &&
        <div className="invalid-feedback" style={{display: 'block'}}>
          {printError(error, id)}
        </div>
      }
    </div>
  </>
}
export default InputForm;