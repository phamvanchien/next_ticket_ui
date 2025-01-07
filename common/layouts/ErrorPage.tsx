"use client"
import Image from "next/image";
import React from "react";
import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { APP_LINK } from "@/enums/app.enum";

interface ErrorPageProps {
  errorCode: number | 500 | 404 | 403
}

const ErrorPage: React.FC<ErrorPageProps> = ({ errorCode }) => {
  const router = useRouter();
  return (
    <div className="row">
      <div className="col-12">
        <div className="card content-small">
          <div className="card-body">
            <center>
              <Image
                className="img-error mb-2"
                src={`/img/icon/error.png`}
                alt="Not Found"
                width={60}
                height={60}
              />
              <h1 style={{fontSize: 100}} className="text-primary">{errorCode}</h1>
              <p className="fs-5 text-gray-600">
                {
                  errorCode === 500 && 'Chúng tôi đang bảo trì hệ thống của mình, vui lòng quay lại sau ít phút'
                }
                {
                  errorCode === 404 && 'Chúng tôi không tìm thấy trang theo yêu cầu của bạn, vui lòng thử lại'
                }
                {
                  errorCode === 403 && 'Dường như bạn không có quyền truy cập vào nội dung này, vui lòng liên hệ quản trị viên'
                }
              </p>
              <Button color="primary" className="mt-3" rounded onClick={() => router.push(APP_LINK.HOME)}>
                <FontAwesomeIcon icon={faHome} /> Trang chủ
              </Button>
            </center>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ErrorPage;