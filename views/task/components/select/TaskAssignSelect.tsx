import { membersList } from "@/api/project.api";
import { members } from "@/api/workspace.api";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import { API_CODE } from "@/enums/api.enum";
import { IMAGE_DEFAULT } from "@/enums/app.enum";
import { RootState } from "@/reduxs/store.redux";
import { catchError } from "@/services/base.service";
import { AppErrorType, BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
import { ProjectType } from "@/types/project.type";
import { ResponseUserDataType } from "@/types/user.type";
import { WorkspaceUserType } from "@/types/workspace.type";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Dropdown, MenuProps, Space } from "antd";
import { useTranslations } from "next-intl";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface TaskAssignSelectProps {
  assignee: ResponseUserDataType[]
  setAssignee: (assignee: ResponseUserDataType[]) => void
  project: ProjectType
  className?: string
  label?: string
}

const TaskAssignSelect: React.FC<TaskAssignSelectProps> = ({ assignee, project, className, label, setAssignee }) => {
  const [membersData, setMembersData] = useState<ResponseWithPaginationType<ResponseUserDataType[]>>();
  const [error, setError] = useState<AppErrorType | null>(null);
  const [openMemberList, setOpenMemberList] = useState(false);
  const [keyword, setKeyword] = useState<string>('');
  const [debounceKeyword, setDebounceKeyword] = useState<string>('');
  const [originTitle, setOriginTitle] = useState<number>(0);
  const listMembersRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const loadMembers = async () => {
    try {
      if (!workspace) {
        return;
      }

      if (project.is_public) {
        const membersWorkspace = await members(workspace.id, 1, 3, keyword);
        if (membersWorkspace && membersWorkspace.code === API_CODE.OK) {
          setMembersData(membersWorkspace.data);
          if (!membersData) {
            setOriginTitle(membersWorkspace.data.total);
          }
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
  const handleChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setKeyword('');
    if (event.target.value && event.target.value !== '') {
      setKeyword(event.target.value);
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
    loadMembers();
  }, [workspace, debounceKeyword]);
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
    <div className={`row text-secondary ${className ?? ''}`}>
      <div className="col-4 lh-40">
        {label ?? t('tasks.assignee_label')}:
      </div>
      <div className="col-8 pointer" onClick={() => setOpenMemberList (true)} ref={listMembersRef}>
        {
          assignee.length === 0 &&
          <Button type="button" color="default" className="btn-bo-border mb-1">
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        }
        {
          assignee.map((member, index) => (
            <Card key={index} className="float-left p-unset pointer mr-1 mt-1">
              <img className="img-circle" onError={(e) => e.currentTarget.src = IMAGE_DEFAULT.NO_USER} src={member.avatar ?? IMAGE_DEFAULT.NO_USER} width={25} height={25} /> Chien 
              <FontAwesomeIcon icon={faTimes} className="mt-2 ml-4 text-secondary pointer" onClick={() => handleRemoveAssignee (member)} />
            </Card>
          ))
        }
        {
          (
            openMemberList && membersData &&
            (membersData.items.filter(m => !assignee.map(a => a.id).includes(m.id)).length > 0 || !assignee.find(a => a.id === project.user.id))
          ) &&
          <>
            <ul className="list-group select-search-task">
              {
                originTitle > 0 &&
                <li className="list-group-item border-unset p-unset">
                  <Input 
                    type="search" 
                    className="w-100" 
                    placeholder={t('tasks.placeholder_search_member')} 
                    onChange={handleChangeKeyword} 
                  />
                </li>
              }
              {
                !assignee.find(a => a.id === project.user.id) &&
                <li className="list-group-item border-unset p-unset pointer" onClick={() => handleSelectAssignee (project.user)}>
                  <span className="badge badge-default w-100 text-left">
                    <img className="img-circle" src={project.user.avatar ?? IMAGE_DEFAULT.NO_USER} onError={(e) => e.currentTarget.src = IMAGE_DEFAULT.NO_USER} width={25} height={25} /> {project.user.first_name} {project.user.last_name} ({t('tasks.project_owner_label')})
                  </span>
                </li>
              }
              {
                membersData && membersData.items.filter(m => !assignee.map(a => a.id).includes(m.id)).map((member, index) => (
                  <li className="list-group-item border-unset p-unset pointer" key={index} onClick={() => handleSelectAssignee (member)}>
                    <span className="badge badge-default w-100 text-left">
                      <img className="img-circle" src={member.avatar ?? IMAGE_DEFAULT.NO_USER} onError={(e) => e.currentTarget.src = IMAGE_DEFAULT.NO_USER} width={25} height={25} /> {member.first_name} {member.last_name}
                    </span>
                  </li>
                ))
              }
            </ul>
          </>
        }
      </div>
    </div>
  )
}
export default TaskAssignSelect;