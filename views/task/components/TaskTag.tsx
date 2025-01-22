import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import Modal from "@/common/modal/Modal";
import ModalBody from "@/common/modal/ModalBody";
import ModalHeader from "@/common/modal/ModalHeader";
import { colorRange } from "@/utils/helper.util";
import { faCheck, faCheckCircle, faCircle, faPlus, faTimes, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import CreateTagModal from "../create/components/CreateTagModal";
import { tagsList } from "@/api/project.api";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxs/store.redux";
import { API_CODE } from "@/enums/api.enum";
import { ProjectTagType } from "@/types/project.type";
import { ResponseWithPaginationType } from "@/types/base.type";

interface TaskTagProps {
  projectId: number
  tags: ProjectTagType[],
  setTags: (tags: ProjectTagType[]) => void
}

const TaskTag: React.FC<TaskTagProps> = ({ projectId, tags, setTags }): JSX.Element => {
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const [showList, setShowList] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [tagData, setTagData] = useState<ResponseWithPaginationType<ProjectTagType[]>>();
  const [keyword, setKeyword] = useState<string>('');
  const [debounceKeyword, setDebounceKeyword] = useState<string>('');
  const listTagsRef = useRef<HTMLUListElement>(null);
  const handleSelectTag = (tag: ProjectTagType) => {
    const added = tags.find(t => t.id === tag.id);
    if (!added) {
      setTags([...tags, tag]);
    }
  }
  const handleRemoveTag = (tag: ProjectTagType) => {
    setTags(tags.filter(t => t.id !== tag.id));
  }
  const handleChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setKeyword('');
    if (event.target.value && event.target.value !== '') {
      setKeyword(event.target.value);
    }
  }
  const loadTags = async () => {
    try {
      if (!workspace || !showList) {
        return;
      }
      const response = await tagsList(workspace.id, projectId, {
        page: 1,
        size: 5,
        keyword: keyword
      });
      if (response && response.code === API_CODE.OK) {
        setTagData(response.data);
        return;
      }
      setTagData(undefined);
    } catch (error) {
      setTagData(undefined);
    }
  }
  useEffect(() => {
    loadTags();
  }, [workspace, showList, debounceKeyword]);
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
      if (listTagsRef.current && !listTagsRef.current.contains(event.target as Node)) {
        setShowList(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return <>
    <div className="col-3 mt-2 text-secondary" style={{ paddingLeft: 20 }}>
      Tags:
    </div>
    <div className="col-9 mt-2">
      {
        tags.map((tag, index) => (
          <span className="badge badge-secondary mr-2 mt-2" style={{ background: tag.color }} key={index}>
            <span className="mr-2">{tag.name}</span> <FontAwesomeIcon icon={faTimesCircle} style={{cursor: 'pointer'}} onClick={() => handleRemoveTag (tag)} />
          </span>
        ))
      }
      {
        !showList && <FontAwesomeIcon className="ml-2" icon={faPlus} style={{cursor: 'pointer'}} onClick={() => setShowList (true)} />
      }
    </div>
    <div className="col-3 mt-2" style={!showList ? {display:'none'} : undefined}></div>
    <div className="col-9 mt-2" style={!showList ? {display:'none'} : undefined}>
      <ul className="list-group" ref={listTagsRef}>
        <li className="list-group-item assignee-item" style={{padding: 0}}>
          <Input type="search" className="search-assignee" placeholder="Search tags" onChange={handleChangeKeyword} />
        </li>
        {
          tagData && tagData.items.filter(m => !tags.map(t => t.id).includes(m.id)).map((tag, index) => (
            <li key={index} className="list-group-item assignee-item" style={{ cursor: 'pointer' }} onClick={() => handleSelectTag (tag)}>
              <FontAwesomeIcon icon={faCircle} style={{color: tag.color}} /> {tag.name}
            </li>
          ))
        }
        <li className="list-group-item assignee-item text-primary" style={{ cursor: 'pointer' }}>
          <span onClick={() => setOpenCreate (true)}>Create new <FontAwesomeIcon icon={faPlus} /></span>
        </li>
      </ul>
    </div>
    <CreateTagModal openCreate={openCreate} setOpenCreate={setOpenCreate} projectId={projectId} loadTags={loadTags} />
  </>
}
export default TaskTag;