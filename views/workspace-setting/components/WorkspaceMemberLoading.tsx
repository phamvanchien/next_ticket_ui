import SkeletonLoading from "@/common/components/SkeletonLoading";

const WorkspaceMemberLoading = () => {
  return (
    <div className="table-responsive mb-2">
      <table className="table align-middle mb-0">
        <tbody>
          <tr className="border-bottom">
            <td>
              <SkeletonLoading heigth={50} />
            </td>
            <td className="fw-semibold text-dark">
              <SkeletonLoading heigth={50} />
            </td>
            <td className="text-muted">
              <SkeletonLoading heigth={50} />
            </td>
            <td className="text-end">
              <SkeletonLoading heigth={50} />
            </td>
          </tr>
          <tr className="border-bottom">
            <td>
              <SkeletonLoading heigth={50} />
            </td>
            <td className="fw-semibold text-dark">
              <SkeletonLoading heigth={50} />
            </td>
            <td className="text-muted">
              <SkeletonLoading heigth={50} />
            </td>
            <td className="text-end">
              <SkeletonLoading heigth={50} />
            </td>
          </tr>
          <tr className="border-bottom">
            <td>
              <SkeletonLoading heigth={50} />
            </td>
            <td className="fw-semibold text-dark">
              <SkeletonLoading heigth={50} />
            </td>
            <td className="text-muted">
              <SkeletonLoading heigth={50} />
            </td>
            <td className="text-end">
              <SkeletonLoading heigth={50} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
export default WorkspaceMemberLoading;