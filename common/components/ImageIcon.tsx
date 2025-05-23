import Image from "next/image";
import React from "react";

interface ImageIconProps {
  name: string
  width?: number
  height?: number
}

const ImageIcon: React.FC<ImageIconProps> = ({ name, width, height }) => {
  return <Image src={'/images/icons/' + name + '.png'} alt={name} width={width ?? 40} height={height ?? 40} />
}
export default ImageIcon;