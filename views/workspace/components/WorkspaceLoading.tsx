import SkeletonLoading from "@/common/components/SkeletonLoading";

const WorkspaceLoading = () => {
  return (
    <div className="container-fluid mt-4 wp-container">
      <div className="d-flex flex-column gap-3 mt-4">
        <SkeletonLoading heigth={70} />
        <SkeletonLoading heigth={70} />
        <SkeletonLoading heigth={70} />
        <SkeletonLoading heigth={70} />
        <SkeletonLoading heigth={70} />
        <SkeletonLoading heigth={70} />
        <SkeletonLoading heigth={70} />
      </div>
    </div>
  )
}
export default WorkspaceLoading;