import SkeletonLoading from "@/common/components/SkeletonLoading";

const TaskDetailLoading = () => {
  return (
    <div className="container-fluid px-3 py-3">
      <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
        <span className="w-100">
          <SkeletonLoading heigth={40} />
        </span>
      </div>
      <div className="row">
        <div className="col-lg-8 col-12">
          <SkeletonLoading heigth={50} className="float-right" />
          <SkeletonLoading heigth={200} className="float-right mt-4" />
          <SkeletonLoading heigth={100} className="float-right mt-4" />
        </div>
        <div className="col-lg-4 col-12">
          <div className="card p-4">
            <SkeletonLoading heigth={30} className="float-right" />
            <SkeletonLoading heigth={30} className="float-right mt-3" />
            <SkeletonLoading heigth={30} className="float-right mt-3" />
            <SkeletonLoading heigth={30} className="float-right mt-3" />
            <SkeletonLoading heigth={30} className="float-right mt-3" />
            <SkeletonLoading heigth={30} className="float-right mt-3" />
            <SkeletonLoading heigth={30} className="float-right mt-3" />
          </div>
        </div>
      </div>
    </div>
  )
}
export default TaskDetailLoading;