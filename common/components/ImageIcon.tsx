import Image from "next/image";
import React from "react";

interface ImageIconProps {
  icon: string
  width?: number
  height?: number
  className?: string
  style?: any
}

const ImageIcon: React.FC<ImageIconProps> = ({ icon, width, height, className, style }) => {
  return <Image src={`/img/icon/${icon}.png`} width={width ?? 30} height={height ?? 30} alt={icon} className={className ?? undefined} style={style} />
}
export default ImageIcon;