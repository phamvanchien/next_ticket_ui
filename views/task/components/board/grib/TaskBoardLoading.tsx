import SkeletonLoading from "@/common/components/SkeletonLoading";

const TaskBoardLoading = () => {
  return (
    <div className="wrapper-board">
      <div className={`card status-item`}>
        <div className="card-header mb-2">
          <SkeletonLoading heigth={30} />
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className={`card task-item`} style={{boxShadow: 'unset'}}>
            <SkeletonLoading heigth={80} />
          </div>
          <div className={`card task-item`} style={{boxShadow: 'unset'}}>
            <SkeletonLoading heigth={80} />
          </div>
        </div>
      </div>
      <div className={`card status-item`}>
        <div className="card-header mb-2">
          <SkeletonLoading heigth={30} />
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className={`card task-item`} style={{boxShadow: 'unset'}}>
            <SkeletonLoading heigth={80} />
          </div>
          <div className={`card task-item`} style={{boxShadow: 'unset'}}>
            <SkeletonLoading heigth={80} />
          </div>
        </div>
      </div>
      <div className={`card status-item`}>
        <div className="card-header mb-2">
          <SkeletonLoading heigth={30} />
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className={`card task-item`} style={{boxShadow: 'unset'}}>
            <SkeletonLoading heigth={80} />
          </div>
          <div className={`card task-item`} style={{boxShadow: 'unset'}}>
            <SkeletonLoading heigth={80} />
          </div>
        </div>
      </div>
      <div className={`card status-item`}>
        <div className="card-header mb-2">
          <SkeletonLoading heigth={30} />
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className={`card task-item`} style={{boxShadow: 'unset'}}>
            <SkeletonLoading heigth={80} />
          </div>
          <div className={`card task-item`} style={{boxShadow: 'unset'}}>
            <SkeletonLoading heigth={80} />
          </div>
        </div>
      </div>
      <div className={`card status-item`}>
        <div className="card-header mb-2">
          <SkeletonLoading heigth={30} />
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className={`card task-item`} style={{boxShadow: 'unset'}}>
            <SkeletonLoading heigth={80} />
          </div>
          <div className={`card task-item`} style={{boxShadow: 'unset'}}>
            <SkeletonLoading heigth={80} />
          </div>
        </div>
      </div>
      <div className={`card status-item`}>
        <div className="card-header mb-2">
          <SkeletonLoading heigth={30} />
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className={`card task-item`} style={{boxShadow: 'unset'}}>
            <SkeletonLoading heigth={80} />
          </div>
          <div className={`card task-item`} style={{boxShadow: 'unset'}}>
            <SkeletonLoading heigth={80} />
          </div>
        </div>
      </div>
    </div>
  )
}
export default TaskBoardLoading;