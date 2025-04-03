import Image from "next/image"
import React from "react"

interface NoDataProps {
  message: string
  description?: string
  children?: React.ReactNode
}

const NoData: React.FC<NoDataProps> = ({ message, description, children }) => {
  return (
    <div className="text-center py-5">
      <Image src="/images/icons/no-data.png" alt="No data" width={200} height={170} />
      <h5 className="mt-3">{message}</h5>
      <p className="text-muted">{description}</p>
      {children}
    </div>
  )
}
export default NoData;