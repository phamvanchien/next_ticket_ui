import SkeletonLoading from "@/common/components/SkeletonLoading";
import { randomNumber } from "@/utils/helper.util";

const TaskListLoading = () => {
  return (
    <div className="row mt-4">
      <div className="col-12">
        <div className="table-responsive">          
          <table className="table">
            <tbody>
              {
                randomNumber(7).map(number => (
                  <tr key={number}>
                    <td style={{minWidth: 350, cursor: 'pointer'}}>
                      <SkeletonLoading heigth={50} />
                    </td>
                    <td style={{minWidth: 150}}>
                      <div className="card-header p-unset border-unset">
                        <SkeletonLoading heigth={50} />
                      </div>
                    </td>
                    <td style={{minWidth: 150}}>
                      <SkeletonLoading heigth={50} />
                    </td>
                    <td style={{minWidth: 150}} className="text-secondary">
                      <SkeletonLoading heigth={50} />
                    </td>
                    <td>
                      <SkeletonLoading heigth={50} />
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
export default TaskListLoading;