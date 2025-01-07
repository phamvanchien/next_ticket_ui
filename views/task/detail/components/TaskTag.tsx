import { tagsList } from "@/api/project.api";
import Input from "@/common/components/Input";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { ResponseTagsDataType, ResponseTagType } from "@/types/project.type";
import { TaskType } from "@/types/task.type";
import { faPlus, faTags, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface TaskTagProps {
  projectId: number
  tags: ResponseTagType[]
  setTags: (tags: ResponseTagType[]) => void
}

const TaskTag: React.FC<TaskTagProps> = ({ projectId, tags, setTags }) => {
  const [openTagList, setOpenTagList] = useState(false);
  const [keyword, setKeyword] = useState<string>('');
  const [debounceKeyword, setDebounceKeyword] = useState<string>('');
  const [tagData, setTagData] = useState<ResponseTagsDataType>();
  const listTagsRef = useRef<HTMLUListElement>(null);
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const handleChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setKeyword('');
    if (event.target.value && event.target.value !== '') {
      setKeyword(event.target.value);
    }
  }
  const handleSelectTag = (tag: ResponseTagType) => {
    const added = tags.find(a => a.id === tag.id);
    if (!added) {
      setTags([...tags, tag]);
    }
  }
  const handleRemoveTag = (tag: ResponseTagType) => {
    setTags(tags.filter(a => a.id !== tag.id));
  }
  const loadTags = async () => {
    try {
      if (!workspace || !openTagList) {
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
  }, [workspace, openTagList, debounceKeyword]);
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
        setOpenTagList(false);
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
      <div className="col-lg-2 col-4 pt-2"><FontAwesomeIcon icon={faTags} /> Tags: </div>
      <div className={`col-8 col-lg-6 ${(!openTagList && tags.length === 0) ? 'pt-2' : ''}`}>
        {
          (!openTagList && tags.length === 0) &&
          <span style={{ cursor: 'pointer' }} onClick={() => setOpenTagList (true)}>
            <FontAwesomeIcon icon={faPlus} /> Add
          </span>
        }
        <ul className="list-group" ref={listTagsRef}>
          {
            tags.length > 0 &&
            <li className={`list-group-item p-5 ${!openTagList ? 'border-unset' : ''}`}>
              {
                tags.map(tag => (
                  <span className="badge badge-default text-white p-5 float-left mr-2" key={tag.id} style={{ background: tag.color }} onClick={() => setOpenTagList (true)}>
                    {tag.name} <FontAwesomeIcon className="ml-2" icon={faTimesCircle} onClick={() => handleRemoveTag (tag)} />
                  </span>
                ))
              }
            </li>
          }
          {
            openTagList && <>
            <li className={`list-group-item p-unset ${!openTagList ? 'border-unset' : ''}`}>
              <Input type="search" placeholder="Search tags" onChange={handleChangeKeyword} />
            </li>
            {
              tagData && tagData.items.filter(m => !tags.map(t => t.id).includes(m.id)).map((tag, index) => (
                <li key={index} className={`list-group-item p-5 ${!openTagList ? 'border-unset' : ''}`} onClick={() => handleSelectTag (tag)} style={{cursor: 'pointer'}}>
                  <span className="badge badge-default p-5 text-white float-left mr-2" key={tag.id} style={{ background: tag.color }}>
                    {tag.name}
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
export default TaskTag;