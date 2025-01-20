"use client"
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import ImageIcon from "@/common/components/ImageIcon";
import Button from "@/common/components/Button";

const ComingSoon = () => {
  const router = useRouter();
  return (
    <div className="row" style={{marginTop: 30}}>
      <div className="col-12">
        <center>
          <ImageIcon width={110} height={110} icon="coming-soon" />
          <p className="fs-5 text-gray-600 text-muted">
            This feature is not yet available, please come back later
          </p>
          <Button color="primary" className="mt-2" rounded onClick={() => router.back()}>
            <FontAwesomeIcon icon={faAngleDoubleLeft} /> Back to previous page
          </Button>
        </center>
      </div>
    </div>
  )
}
export default ComingSoon;