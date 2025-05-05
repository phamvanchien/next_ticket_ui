import React from "react";

interface LoadingGifProps {
  width?: number
  height?: number
}

const LoadingGif: React.FC<LoadingGifProps> = ({ width, height }) => {
  return <img src="/images/gif/loading.gif" width={width ?? 100} height={height ?? 100} />;
}
export default LoadingGif;