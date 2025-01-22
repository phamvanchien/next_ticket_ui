import { statusList } from "@/api/project.api";
import Input from "@/common/components/Input";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { ResponseWithPaginationType } from "@/types/base.type";
import { ProjectTagType } from "@/types/project.type";
import { faCircle, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface TaskStatusSelectProps {
  status?: ProjectTagType
  className?: string
  projectId: number
  setStatus: (status?: ProjectTagType) => void
}

const TaskStatusSelect: React.FC<TaskStatusSelectProps> = ({ status, className, projectId, setStatus }) => {
  const [openStatusList, setOpenStatusList] = useState(false);
  const [keyword, setKeyword] = useState<string>('');
  const [debounceKeyword, setDebounceKeyword] = useState<string>('');
  const [statusData, setStatusData] = useState<ResponseWithPaginationType<ProjectTagType[]>>();
  const listStatusRef = useRef<HTMLDivElement>(null);
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const handleChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setKeyword('');
    if (event.target.value && event.target.value !== '') {
      setKeyword(event.target.value);
    }
  }
  const loadStatus = async () => {
    try {
      if (!workspace || !openStatusList) {
        return;
      }
      const response = await statusList(workspace.id, projectId, {
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
    const handler = setTimeout(() => {
      setDebounceKeyword(keyword);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);
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
    <div className={`row text-secondary ${className ?? ''}`}>
      <div className="col-4 lh-40">
        Status:
      </div>
      <div className="col-8 text-secondary" onClick={() => setOpenStatusList (true)} ref={listStatusRef}>
        {
          !status &&
          <span className="badge badge-light lh-20 mb-2 mr-2">
            <FontAwesomeIcon icon={faPlus} />
          </span>
        }
        {
          status &&
          <span className="badge badge-light lh-20 mb-2 mr-2">
            <FontAwesomeIcon icon={faCircle} style={{ color: status.color }} /> {status.name}
          </span>
        }
        {
          openStatusList &&
          <>
            <ul className="list-group select-search-task">
              <li className="list-group-item border-unset p-unset">
                <Input type="search" className="w-100" onChange={handleChangeKeyword} />
              </li>
              {
                statusData && statusData.items.filter(m => status?.id !== m.id).map((status, index) => (
                  <li className="list-group-item border-unset p-unset" key={index} onClick={() => setStatus(status)}>
                    <span className="badge badge-default w-100 text-left">
                      <FontAwesomeIcon icon={faCircle} style={{ color: status.color }} /> {status.name}
                    </span>
                  </li>
                ))
              }
            </ul>
          </>
        }
      </div>
    </div>
  );
}
export default TaskStatusSelect;