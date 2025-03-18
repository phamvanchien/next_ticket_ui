import { tagsList } from "@/api/project.api";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { ResponseWithPaginationType } from "@/types/base.type";
import { ProjectTagType } from "@/types/project.type";
import { faPlus, faTag, faTimes, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card } from "antd";
import { useTranslations } from "next-intl";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface TaskTagSelectProps {
  tags: ProjectTagType[]
  className?: string
  projectId: number
  setTags: (tags: ProjectTagType[]) => void
}

const TaskTagSelect: React.FC<TaskTagSelectProps> = ({ tags, className, projectId, setTags }) => {
  const [openTagList, setOpenTagList] = useState(false);
  const [keyword, setKeyword] = useState<string>('');
  const [debounceKeyword, setDebounceKeyword] = useState<string>('');
  const [tagData, setTagData] = useState<ResponseWithPaginationType<ProjectTagType[]>>();
  const [totalTag, setTotalTag] = useState<number>(0);
  const listTagsRef = useRef<HTMLDivElement>(null);
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const t = useTranslations();
  const handleChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setKeyword('');
    if (event.target.value && event.target.value !== '') {
      setKeyword(event.target.value);
    }
  }
  const handleSelectTag = (tag: ProjectTagType) => {
    const added = tags.find(a => a.id === tag.id);
    if (!added) {
      setKeyword('');
      setDebounceKeyword('');
      setTags([...tags, tag]);
    }
  }
  const handleRemoveTag = (tag: ProjectTagType) => {
    setTags(tags.filter(a => a.id !== tag.id));
  }
  const loadTags = async () => {
    try {
      if (!workspace) {
        return;
      }
      const response = await tagsList(workspace.id, projectId, {
        page: 1,
        size: 5,
        keyword: keyword
      });
      if (response && response.code === API_CODE.OK) {
        if (!tagData) {
          setTotalTag(response.data.total);
        }
        setTagData(response.data);
        return;
      }
      setTagData(undefined);
    } catch (error) {
      setTagData(undefined);
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
  useEffect(() => {
    loadTags();
  }, [workspace, debounceKeyword]);
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
    <div className={`row text-secondary ${className ?? ''}`}>
      <div className="col-4 lh-40">
        {t('tasks.tags_label')}:
      </div>
      <div className="col-8 text-secondary" onClick={() => setOpenTagList (true)} ref={listTagsRef}>
        {
          tags.length === 0 &&
          <Button color="default" className="btn-bo-border pointer">
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        }
        {
          tags.map((tag, index) => (
            <Card key={index} className="float-left p-unset pointer mr-1">
              <FontAwesomeIcon icon={faTag} style={{ color: tag.color }} /> {tag.name}
              <FontAwesomeIcon icon={faTimes} className="mt-2 ml-4 text-secondary pointer" onClick={() => handleRemoveTag (tag)} />
            </Card>
            // <span className="badge badge-light task-info-selectbox mb-1 mr-2 pointer" key={index}>
            //   <FontAwesomeIcon icon={faTag} style={{ color: tag.color }} /> {tag.name}
            //   <FontAwesomeIcon icon={faTimes} className="mt-2 ml-4 text-secondary pointer" onClick={() => handleRemoveTag (tag)} />
            // </span>
          ))
        }
        {
          (openTagList && tagData && tagData.items.filter(m => !tags.map(a => a.id).includes(m.id)).length > 0) &&
          <>
            <ul className="list-group select-search-task">
              {
                (totalTag > 0) &&
                <li className="list-group-item border-unset p-unset">
                  <Input type="search" className="w-100" placeholder={t('tasks.placeholder_search_tags')} onChange={handleChangeKeyword} />
                </li>
              }
              {
                (tagData && tagData.total > 0) && tagData.items.filter(m => !tags.map(a => a.id).includes(m.id)).map((tag, index) => (
                  <li className="list-group-item border-unset p-unset pointer" key={index} onClick={() => handleSelectTag (tag)}>
                    <span className="badge badge-default w-100 text-left">
                      <FontAwesomeIcon icon={faTag} style={{ color: tag.color }} /> {tag.name}
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
export default TaskTagSelect;