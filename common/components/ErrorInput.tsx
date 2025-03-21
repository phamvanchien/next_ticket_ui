import { hasError, printError } from "@/services/base.service";
import { AppErrorType } from "@/types/base.type";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface ErrorInputProps {
  validateError: AppErrorType[]
  errorKey: string
}

const ErrorInput: React.FC<ErrorInputProps> = ({ validateError, errorKey }) => {
  if (!hasError(validateError, errorKey)) {
    return <></>
  }
  return (
    <div className="invalid-feedback" style={{display: 'block'}}>
      <FontAwesomeIcon icon={faWarning} /> {printError(validateError, errorKey)}
    </div>
  )
}
export default ErrorInput;