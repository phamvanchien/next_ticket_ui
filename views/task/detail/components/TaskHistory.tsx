import { ResponseHistoryDataType, TaskType } from "@/types/task.type";
import { formatTime } from "@/utils/helper.util";
import { faAngleDoubleDown, faHistory } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { MouseEvent, useState } from "react";
import TaskHistoryItem from "./TaskHistoryItem";
import Link from "next/link";
import Loading from "@/common/components/Loading";

interface TaskHistoryProps {
  historyData?: ResponseHistoryDataType
  task: TaskType
  loadingViewMore: boolean
  pageSize: number
  handleViewMoreHistory: (event: MouseEvent<HTMLAnchorElement>) => void
}

const TaskHistory: React.FC<TaskHistoryProps> = ({ historyData, task, loadingViewMore, pageSize, handleViewMoreHistory }) => {
  return <>
    <div className="col-12 mt-4 mb-4">
      <hr/>
      <h6 className="text-muted"><FontAwesomeIcon icon={faHistory} /> History</h6>
    </div>
    {
      historyData && historyData.items.map((history, index) => (
        <div className="col-12" key={index}>
          <img 
            src={history.user.avatar ?? '/img/icon/user-loading.png'} 
            onError={(e) => e.currentTarget.src = '/img/icon/user-loading.png'}  
            width={25} 
            height={25} 
            className="img-circle"
          /> {history.user.first_name} {history.user.last_name} 
          <span className="text-muted float-right">- {formatTime(new Date(history.created_at))}</span>
            {
              history.content.map((value, index) => (
                <TaskHistoryItem history={value} key={index} />
              ))
            }
        </div>
      ))
    }
    {
      (historyData && historyData.total > pageSize) &&
      <div className="col-12">
        <Link href={'#'} className="text-muted" onClick={!loadingViewMore ? handleViewMoreHistory : undefined}>
          View more {loadingViewMore ? <Loading color="secondary" /> : <FontAwesomeIcon icon={faAngleDoubleDown} />}
        </Link>
      </div>
    }
    {
      (historyData && pageSize >= historyData.total) &&
      <div className="col-12">
        <img 
          src={task.user.avatar ?? '/img/icon/user-loading.png'} 
          onError={(e) => e.currentTarget.src = '/img/icon/user-loading.png'}  
          width={25} 
          height={25}
          className="img-circle"
        /> {task.user.first_name} {task.user.last_name} 
        <span className="text-muted float-right">- {formatTime(new Date(task.created_at))}</span>
        <div className="card mt-2">
          <div className="card-body p-5">
            Created task
          </div>
        </div>
      </div>
    }
  </>
}
export default TaskHistory;