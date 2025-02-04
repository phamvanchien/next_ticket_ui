import { AppErrorType } from "@/types/base.type";
import { useTranslations } from "next-intl";
import React from "react";

interface ErrorAlertProps {
  error: AppErrorType | null
  className?: string
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, className }) => {
  const t = useTranslations();
  if (error) {
    return (
      <div className={`alert alert-light alert-error ${className ?? ''}`}>
        <b className="text-danger mt-2">{t('error_alert.error')}: </b> {error.message}
      </div>
    );
  }
  return <></>
}
export default ErrorAlert;