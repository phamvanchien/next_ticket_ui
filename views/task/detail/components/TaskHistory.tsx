import { HistoryType, TaskType } from "@/types/task.type";
import { formatTime } from "@/utils/helper.util";
import { faAngleDoubleDown, faHistory } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { MouseEvent, useState } from "react";
import TaskHistoryItem from "./TaskHistoryItem";
import Link from "next/link";
import Loading from "@/common/components/Loading";
import { ResponseWithPaginationType } from "@/types/base.type";
import { IMAGE_DEFAULT } from "@/enums/app.enum";

interface TaskHistoryProps {
  historyData?: ResponseWithPaginationType<HistoryType[]>
  task: TaskType
  loadingViewMore: boolean
  pageSize: number
  handleViewMoreHistory: (event: MouseEvent<HTMLAnchorElement>) => void
}

const TaskHistory: React.FC<TaskHistoryProps> = ({ historyData, task, loadingViewMore, pageSize, handleViewMoreHistory }) => {
  return <>
    {
      historyData && historyData.items.map((history, index) => (
        <div className="col-12" key={index}>
          <img 
            src={history.user.avatar ?? IMAGE_DEFAULT.NO_USER} 
            onError={(e) => e.currentTarget.src = IMAGE_DEFAULT.NO_USER}  
            width={25} 
            height={25} 
            className="img-circle"
          /> {history.user.first_name} {history.user.last_name} 
          <span className="text-muted float-right history-item-time">- {formatTime(new Date(history.created_at))}</span>
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
          src={task.user.avatar ?? IMAGE_DEFAULT.NO_USER} 
          onError={(e) => e.currentTarget.src = IMAGE_DEFAULT.NO_USER}  
          width={25} 
          height={25}
          className="img-circle"
        /> {task.user.first_name} {task.user.last_name} 
        <span className="text-muted float-right history-item-time">- {formatTime(new Date(task.created_at))}</span>
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