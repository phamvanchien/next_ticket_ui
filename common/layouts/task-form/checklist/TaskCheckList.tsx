import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import CheckListCreate from "./CheckListCreate";
import { TaskType } from "@/types/task.type";
import { subTask, update } from "@/api/task.api";
import { API_CODE } from "@/enums/api.enum";
import { BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
import { displaySmallMessage } from "@/utils/helper.util";
import CheckListItem from "./CheckListItem";
import Loading from "@/common/components/Loading";

interface TaskCheckListProps {
  className?: string
  task?: TaskType
}

const TaskCheckList: React.FC<TaskCheckListProps> = ({ className, task }) => {
  const t = useTranslations();
  const defaultPageSize = 5;
  const [openCreate, setOpenCreate] = useState(false);
  const [checkListData, setCheckListData] = useState<ResponseWithPaginationType<TaskType[]>>();
  const [checkListCreated, setCheckListCreated] = useState<TaskType>();
  const [checkListDeleted, setCheckListDeleted] = useState<number>();
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [loadingViewMore, setLoadingViewMore] = useState(false);
  const loadCheckList = async () => {
    try {
      if (!task) {
        return
      }
      const response = await subTask(task.workspace_id, task.project_id, task.id, {
        page: 1,
        size: pageSize
      });
      if (response && response.code === API_CODE.OK) {
        setCheckListData(response.data);
        setLoadingViewMore(false);
        return;
      }
      displaySmallMessage('error', response.error?.message);
    } catch (error) {
      displaySmallMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  const handleLoadMore = () => {
    setLoadingViewMore(true);
    setPageSize(pageSize + defaultPageSize);
  }
  useEffect(() => {
    loadCheckList();
  }, [pageSize]);
  useEffect(() => {
    loadCheckList();
  }, [task]);
  useEffect(() => {
    if (checkListCreated) {
      loadCheckList();
    }
  }, [checkListCreated]);
  useEffect(() => {
    if (checkListDeleted) {
      loadCheckList();
    }
  }, [checkListDeleted]);
  return <>
    <div className={`row ${className ?? ''}`}>
      <div className="col-12">
        {(!checkListData || (checkListData && checkListData.total === 0) ) && <CheckListCreate setCheckListCreated={setCheckListCreated} setOpenCreate={setOpenCreate} openCreate={openCreate} task={task} />}
        {
          (checkListData && checkListData.total > 0) &&
          <div className="card">
            <div className="card-body">
              <CheckListCreate setCheckListCreated={setCheckListCreated} setOpenCreate={setOpenCreate} openCreate={openCreate} task={task} />
              <div className="row">
                {
                  (checkListData && checkListData.items.map((checkList, index) => (
                    <CheckListItem key={index} checkListItem={checkList} setCheckListDeleted={setCheckListDeleted} />
                  )))
                }

                {
                  pageSize < checkListData.total &&
                  <div className="col-12 mt-2">
                    <a className="text-secondary pointer" onClick={!loadingViewMore ? handleLoadMore : undefined}>
                      {loadingViewMore ? <Loading color="secondary" /> : t('common.btn_view_more')}
                    </a>
                  </div>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  </>
}
export default TaskCheckList;