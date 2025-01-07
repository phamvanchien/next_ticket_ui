import { faAngleDoubleDown, faArrows, faInfoCircle, faPlus, faTag, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { removeStatus, removeTag, tagsList } from "@/api/project.api";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { ProjectType, ResponseTagsDataType } from "@/types/project.type";
import Input from "@/common/components/Input";
import Loading from "@/common/components/Loading";
import Modal from "@/common/modal/Modal";
import ModalBody from "@/common/modal/ModalBody";
import Button from "@/common/components/Button";
import { notify } from "@/utils/helper.util";
import { catchError } from "@/services/base.service";
import { BaseResponseType } from "@/types/base.type";
import CreateTagModal from "@/views/task/create/components/CreateTagModal";
import TagSettingItem from "./TagSettingItem";

interface ProjectTagSettingProps {
  project: ProjectType;
}

const ProjectTagSetting: React.FC<ProjectTagSettingProps> = ({ project }) => {
  const defaultPageSize = 10;
  const [tagData, setTagData] = useState<ResponseTagsDataType>();
  const [keyword, setKeyword] = useState<string>("");
  const [debounceKeyword, setDebounceKeyword] = useState<string>("");
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [loadingViewMore, setLoadingViewMore] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [tagDeleteId, setTagDeleteId] = useState<number>();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;

  const handleChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setKeyword("");
    if (event.target.value && event.target.value !== "") {
      setKeyword(event.target.value);
    }
  };

  const handleViewMore = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setLoadingViewMore(true);
    setPageSize(pageSize + defaultPageSize);
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceKeyword(keyword);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);

  const loadTags = async () => {
    try {
      if (!workspace) {
        return;
      }
      const response = await tagsList(workspace.id, project.id, {
        page: 1,
        size: pageSize,
        keyword: keyword
      });
      setLoadingViewMore(false);
      if (response && response.code === API_CODE.OK) {
        setTagData(response.data);
        return;
      }
      setTagData(undefined);
    } catch (error) {
      setLoadingViewMore(false);
      setTagData(undefined);
    }
  };

  const handleDeleteTag = async () => {
    try {
      if (!workspace || !tagDeleteId) {
        return;
      }
      setLoadingDelete(true);
      const response = await removeTag(workspace.id, project.id, tagDeleteId);
      setLoadingDelete(false);
      if (response && response.code === API_CODE.OK) {
        loadTags();
        setTagDeleteId(undefined);
        return;
      }
      notify(catchError(response)?.message ?? '', 'error');
    } catch (error) {
      setLoadingDelete(false);
      notify(catchError(error as BaseResponseType)?.message ?? '', 'error');
    }
  }

  useEffect(() => {
    loadTags();
  }, [workspace, debounceKeyword, pageSize]);

  return (
    <>
      <CreateTagModal 
        openCreate={openCreate} 
        setOpenCreate={setOpenCreate} 
        projectId={project.id} 
        loadTags={loadTags}
      />
      <div className="row">
        <div className="col-12 col-lg-4 col-sm-6 mt-4">
          <h5 className="text-muted">Tags</h5>
          <i className="text-muted">
            <FontAwesomeIcon icon={faInfoCircle} /> You can manage and create new tags here.
          </i>
        </div>
      </div>
      <div className="row mt-2 mb-2">
        <div className="col-12 col-lg-4 col-sm-6">
          <div className="mt-2"
            style={{
              padding: "8px",
              borderRadius: "5px",
              backgroundColor: "#f8f9fa",
              boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
              cursor: "pointer",
            }}
            onClick={() => setOpenCreate (true)}
          >
            Create new <FontAwesomeIcon icon={faPlus} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-lg-4 col-sm-6">
          <Input type="search" placeholder="Enter tag title" style={{
              padding: "8px",
              borderRadius: "5px"
            }}
            onChange={handleChangeKeyword} 
          />
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-lg-4 col-sm-6">
          {(tagData?.items || []).map((item, index) => (
            <TagSettingItem 
              key={index} 
              position={index} 
              projectId={project.id} 
              tag={item} 
              setTagDeleteId={setTagDeleteId} 
            />
          ))}
        </div>
      </div>
      {
        (tagData && tagData.total > pageSize) &&
        <div className="row mt-2">
          <div className="col-12 col-lg-4 col-sm-6">
            <span className="link mt-4 mb-2 text-secondary" style={{cursor: 'pointer'}} onClick={!loadingViewMore ? handleViewMore : undefined}>
              View more {loadingViewMore ? <Loading color="secondary" /> : <FontAwesomeIcon icon={faAngleDoubleDown} />}
            </span>
          </div>
        </div>
      }
      <Modal className="clone-modal" isOpen={tagDeleteId ? true : false}>
        <ModalBody>
          <div className="row">
            <div className="col-12 mb-2">
              <h6 className="text-muted">
                You will delete this status including all related data.
              </h6>
            </div>
            <div className="col-6">
              <Button color="danger" fullWidth onClick={handleDeleteTag} disabled={loadingDelete}>
                OK {loadingDelete && <Loading color="light" />}
              </Button>
            </div>
            <div className="col-6">
              <Button color="danger" fullWidth outline disabled={loadingDelete} onClick={() => setTagDeleteId (undefined)}>
                Cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
export default ProjectTagSetting;