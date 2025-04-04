import SkeletonLoading from "@/common/components/SkeletonLoading";
import { ProjectStatusType } from "@/types/project.type";
import { rangeNumber } from "@/utils/helper.util";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface TaskBoardLoadingProps {
  projectStatus: ProjectStatusType[]
}

const TaskBoardLoading: React.FC<TaskBoardLoadingProps> = ({ projectStatus }) => {
  return (
    <div className="row">
      <div
        className="col-12 status-wrapper"
      >
        {projectStatus.map((status, index) => (
          <div key={index} className={`card status-item`}>
            <div className="card-header" style={{ background: status.color }}>
              <div className="d-flex align-items-center">
                <span className="mr-2 cursor-pointer" style={{ marginRight: 5 }}>
                  <FontAwesomeIcon
                    icon={faGripVertical}
                    style={{ pointerEvents: "none" }}
                  />
                </span>
                <h6 className="card-title m-unset">{status.name}</h6>
              </div>
            </div>
            <div className="card-body status-item-body">
              {
                rangeNumber(1, 3).map(number => (
                  <div className={`card task-item`} key={number}>
                    <div className="card-body task-item-body">
                      <h6>
                        <SkeletonLoading heigth={15} />
                      </h6>
                      <p className="text-muted m-unset">
                        <SkeletonLoading heigth={10} />
                      </p>
                      <SkeletonLoading heigth={25} />
                    </div>
                  </div>
                ))
              }
            </div>
            <div className="card-footer">
              <SkeletonLoading heigth={30} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default TaskBoardLoading