import { statusList } from "@/api/project.api";
import Input from "@/common/components/Input";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { ResponseTagsDataType, ResponseTagType } from "@/types/project.type";
import { TaskType } from "@/types/task.type";
import { faBullseye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface TaskStatusProps {
  task: TaskType
  status?: ResponseTagType
  setStatus: (status?: ResponseTagType) => void
}

const TaskStatus: React.FC<TaskStatusProps> = ({ task, status, setStatus }) => {
  const listStatusRef = useRef<HTMLUListElement>(null);
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const [openStatusList, setOpenStatusList] = useState(false);
  const [keyword, setKeyword] = useState<string>('');
  const [debounceKeyword, setDebounceKeyword] = useState<string>('');
  const [statusData, setStatusData] = useState<ResponseTagsDataType>();
  const handleChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setKeyword('');
    if (event.target.value && event.target.value !== '') {
      setKeyword(event.target.value);
    }
  }
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceKeyword(keyword);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);
  const loadStatus = async () => {
    try {
      if (!workspace || !openStatusList) {
        return;
      }
      const response = await statusList(workspace.id, task.project_id, {
        page: 1,
        size: 5,
        keyword: keyword
      });
      if (response && response.code === API_CODE.OK) {
        setStatusData(response.data);
        return;
      }
      setStatusData(undefined);
    } catch (error) {
      setStatusData(undefined);
    }
  }
  useEffect(() => {
    loadStatus();
  }, [workspace, openStatusList, debounceKeyword]);
  useEffect(() => {
    const handleClickOutside = async (event: MouseEvent) => {
      if (listStatusRef.current && !listStatusRef.current.contains(event.target as Node)) {
        setOpenStatusList(false);
        setKeyword('');
        setDebounceKeyword('');
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div className="row mt-4 text-secondary">
      <div className="col-lg-2 col-4 pt-2"><FontAwesomeIcon icon={faBullseye} /> Status: </div>
      <div className={`col-8 col-lg-6`}>
        <ul className="list-group" ref={listStatusRef}>
          <li className={`list-group-item p-5 ${!openStatusList ? 'border-unset' : ''}`}>
            {
              status &&
              <span className="badge badge-default p-5 float-left mr-2" style={{ background: status.color }} onClick={() => setOpenStatusList (true)}>
                {status.name}
              </span>
            }
          </li>
          {
            openStatusList && <>
              <li className={`list-group-item p-unset ${!openStatusList ? 'border-unset' : ''}`}>
                <Input type="search" placeholder="Search status" onChange={handleChangeKeyword} />
              </li>
              {
                statusData && statusData.items.filter(m => status?.id !== m.id).map(item => (
                  <li key={item.id} className={`list-group-item p-5 ${!openStatusList ? 'border-unset' : ''}`} onClick={() => setStatus(item)} style={{ cursor: 'pointer' }}>
                    <span className="badge badge-default p-5 float-left mr-2" style={{ background: item.color }}>
                      {item.name}
                    </span>
                  </li>
                ))
              }
            </>
          }
        </ul>
      </div>
    </div>
  )
}
export default TaskStatus;