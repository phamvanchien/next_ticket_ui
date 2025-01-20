"use client"
import Image from "next/image";
import React from "react";
import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleLeft, faHome } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { APP_LINK } from "@/enums/app.enum";
import ImageIcon from "../components/ImageIcon";

interface ErrorPageProps {
  errorCode: number | 500 | 404 | 403
}

const ErrorPage: React.FC<ErrorPageProps> = ({ errorCode }) => {
  const router = useRouter();
  return (
    <div className="row" style={{marginTop: 30}}>
      <div className="col-12">
        <center>
          {
            errorCode === 404 &&
            // <ImageIcon width={100} height={100} icon="content-not-found" />
            <ImageIcon width={110} height={110} icon="coming-soon" />
          }
          {
            errorCode === 500 &&
            <ImageIcon width={100} height={100} icon="web-maintain" />
          }
          <p className="fs-5 text-gray-600 text-muted">
            {
              errorCode === 500 && 'We are maintaining our system, please come back in a few minutes'
            }
            {
              errorCode === 404 && "You tried to access a project that doesn't exist, please contact with Next Ticket admin"
            }
            {
              errorCode === 403 && "It looks like you don't have access to this content, please contact with Next Ticket admin"
            }
          </p>
          <Button color="primary" className="mt-2" rounded onClick={() => router.back()}>
            <FontAwesomeIcon icon={faAngleDoubleLeft} /> Back to previous page
          </Button>
        </center>
      </div>
    </div>
  )
}
export default ErrorPage;