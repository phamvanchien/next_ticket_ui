"use client"
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

interface ErrorPageProps {
  code: number
}

const ErrorPage: React.FC<ErrorPageProps> = ({ code }) => {
  const t = useTranslations();
  if (code === 500) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
        <h1 className="display-1 text-danger">500</h1>
        <p className="lead">{t('server_error_page.page_title')}</p>
        <p className="text-muted">{t('server_error_page.page_description')}</p>
        <Link href="/workspace" className="btn btn-primary mt-3" style={{ height: 50, lineHeight: '35px' }}>
          {t('btn_back_main_page')}
        </Link>
      </div>
    );
  }
  if (code === 404) {
    return (
      <div className="container text-center vh-100 d-flex flex-column justify-content-center align-items-center">
        <h1 className="display-1 text-primary">404</h1>
        <h2 className="mb-4">{t('not_found_page.page_title')}</h2>
        <p className="text-muted">{t('not_found_page.page_description')}</p>
        <Link href="/workspace" className="btn btn-primary mt-3" style={{ height: 50, lineHeight: '35px' }}>
          {t('btn_back_main_page')}
        </Link>
      </div>
    );
  }
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center">
      <div className="container">
        <h1 className="display-3 text-primary">{t('maintain_page.page_title')}</h1>
        <p className="lead">{t('maintain_page.page_description')}</p>
        <p>{t('maintain_page.page_description_sub')}</p>
      </div>
    </div>
  );
}
export default ErrorPage;