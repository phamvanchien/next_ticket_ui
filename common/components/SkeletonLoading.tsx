import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

interface SkeletonLoadingProps {
  heigth?: number
  className?: string
}

const SkeletonLoading: React.FC<SkeletonLoadingProps> = ({ heigth, className }) => {
  return <Skeleton className={className ? className : ''} height={heigth} />
}
export default SkeletonLoading;