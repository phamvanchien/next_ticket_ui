import SkeletonLoading from "@/common/components/SkeletonLoading";

const TimeTrackingLoading = () => {
  return (
    <div className="row">
      <div className="col-lg-3 col-md-4 col-12 mb-4">
        <div className="project-card">
          <SkeletonLoading heigth={70} />
        </div>
      </div>
      <div className="col-lg-3 col-md-4 col-12 mb-4">
        <div className="project-card">
          <SkeletonLoading heigth={70} />
        </div>
      </div>
      <div className="col-lg-3 col-md-4 col-12 mb-4">
        <div className="project-card">
          <SkeletonLoading heigth={70} />
        </div>
      </div>
      <div className="col-lg-3 col-md-4 col-12 mb-4">
        <div className="project-card">
          <SkeletonLoading heigth={70} />
        </div>
      </div>
    </div>
  )
}
export default TimeTrackingLoading;