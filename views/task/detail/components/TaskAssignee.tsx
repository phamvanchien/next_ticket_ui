import { membersList } from "@/api/project.api";
import { members } from "@/api/workspace.api";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { catchError } from "@/services/base.service";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import { TaskType } from "@/types/task.type";
import { ResponseUserDataType } from "@/types/user.type";
import { ResponseMemberWorkspaceDataType } from "@/types/workspace.type";
import { faPlus, faTimesCircle, faUserCircle, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "@/common/components/Input";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ProjectType } from "@/types/project.type";

interface TaskAssigneeProps {
  project: ProjectType
  assignee: ResponseUserDataType[]
  setAssignee: (assignee: ResponseUserDataType[]) => void
  label?: string
}

const TaskAssignee: React.FC<TaskAssigneeProps> = ({
  project,
  assignee,
  label,
  setAssignee
}) => {
  const [openMemberList, setOpenMemberList] = useState(false);
  const [error, setError] = useState<AppErrorType | null>(null);
  const [membersData, setMembersData] = useState<ResponseMemberWorkspaceDataType>();
  const [keyword, setKeyword] = useState<string>('');
  const [debounceKeyword, setDebounceKeyword] = useState<string>('');
  const listMembersRef = useRef<HTMLUListElement>(null);
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const handleChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setKeyword('');
    if (event.target.value && event.target.value !== '') {
      setKeyword(event.target.value);
    }
  }
  const loadMembers = async () => {
    try {
      if (!workspace || !openMemberList) {
        return;
      }

      if (project.is_public) {
        const membersWorkspace = await members(workspace.id, 1, 3, keyword);
        if (membersWorkspace && membersWorkspace.code === API_CODE.OK) {
          setMembersData(membersWorkspace.data);
          return;
        }
        setError(catchError(membersWorkspace));
        return;
      }

      const membersProject = await membersList(workspace.id, project.id, 1, 3, keyword);
      if (membersProject && membersProject.code === API_CODE.OK) {
        setMembersData(membersProject.data);
        return;
      }

    } catch (error) {
      setError(catchError(error as BaseResponseType));
    }
  }
  const handleSelectAssignee = (member: ResponseUserDataType) => {
    const added = assignee.find(a => a.id === member.id);
    if (!added) {
      setAssignee([...assignee, member]);
    }
  }
  const handleRemoveAssignee = (member: ResponseUserDataType) => {
    setAssignee(assignee.filter(a => a.id !== member.id));
  }
  useEffect(() => {
    if (openMemberList) {
      loadMembers();
    }
  }, [workspace, debounceKeyword, openMemberList]);
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
      if (listMembersRef.current && !listMembersRef.current.contains(event.target as Node)) {
        setOpenMemberList(false);
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
      <div className="col-lg-2 col-4 pt-2"><FontAwesomeIcon icon={faUserGroup} /> {label ?? 'Assignee'}: </div>
      <div className={`col-8 col-lg-6 ${(!openMemberList && assignee.length === 0) ? 'pt-2' : ''}`}>
        {
          (!openMemberList && assignee.length === 0) &&
          <span style={{ cursor: 'pointer' }} onClick={() => setOpenMemberList (true)}>
            <FontAwesomeIcon icon={faPlus} /> Add
          </span>
        }
        <ul className="list-group" ref={listMembersRef}>
          {
            assignee.length > 0 &&
            <li className={`list-group-item p-5 ${!openMemberList ? 'border-unset' : ''}`}>
              {
                assignee.map(item => (
                  <span className="badge badge-default float-left mr-2" key={item.id} onClick={() => setOpenMemberList (true)}>
                    <img src={item.avatar} width={25} height={25} className="img-circle mr-2" onError={(e) => e.currentTarget.src = '/img/icon/user-loading.png'} />
                    {item.first_name} {item.last_name} <FontAwesomeIcon icon={faTimesCircle} onClick={() => handleRemoveAssignee (item)} />
                  </span>
                ))
              }
            </li>
          }
          {
            openMemberList && <>
            <li className={`list-group-item p-unset ${!openMemberList ? 'border-unset' : ''}`}>
              <Input type="search" placeholder="Search member" onChange={handleChangeKeyword} />
            </li>
            {
              !assignee.find(a => a.id === project.user.id) &&
              <li className="list-group-item p-10 assignee-item" style={{ cursor: 'pointer' }} onClick={() => handleSelectAssignee (project.user)}>
                {project.user.avatar ? <img src={project.user.avatar} width={22} height={22} className="img-circle mr-2" onError={(e) => e.currentTarget.src = '/img/icon/user-loading.png'} /> : <FontAwesomeIcon icon={faUserCircle} className="mr-2" style={{fontSize: 22}} />} 
                {project.user.first_name} {project.user.last_name} (Project owner)
              </li>
            }
            {
              membersData && membersData.items.filter(m => !assignee.map(a => a.id).includes(m.id)).map(member => (
                <li key={member.id} className={`list-group-item p-10 ${!openMemberList ? 'border-unset' : ''}`} onClick={() => handleSelectAssignee (member)}>
                  <img src={member.avatar} width={25} height={25} className="img-circle" onError={(e) => e.currentTarget.src = '/img/icon/user-loading.png'} /> {member.first_name} {member.last_name}
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
export default TaskAssignee;