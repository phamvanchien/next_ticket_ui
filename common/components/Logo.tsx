import Image from "next/image";
import React from "react";

interface LogoProps {
  width?: number
  height?: number
  classname?: string
  withText?: boolean
}

const Logo: React.FC<LogoProps> = ({ width, height, classname, withText }) => {
  if (withText) {
    return <Image src={'/logo-text.png'} alt="Next Tech" width={width ?? 50} height={height ?? 50} className={classname} />
  }
  return <Image src={'/logo.png'} alt="Next Tech" width={width ?? 50} height={height ?? 50} className={classname} />
}
export default Logo;