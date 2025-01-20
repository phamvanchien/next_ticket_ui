import { AppErrorType } from "@/types/base.type";
import React from "react";

interface ErrorAlertProps {
  error: AppErrorType | null
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => {
  if (error) {
    return (
      <div className="alert alert-light alert-error">
        <b className="text-danger mt-2">Error: </b> {error.message}
      </div>
    );
  }
  return <></>
}
export default ErrorAlert;