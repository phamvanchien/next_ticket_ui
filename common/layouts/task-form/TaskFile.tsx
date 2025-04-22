import { removeFile, taskFiles, uploadFiles } from "@/api/task.api";
import Button from "@/common/components/Button";
import Loading from "@/common/components/Loading";
import Modal from "@/common/components/Modal";
import UploadFiles from "@/common/components/UploadFiles";
import { API_CODE } from "@/enums/api.enum";
import { BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
import { TaskFileType, TaskType } from "@/types/task.type";
import { displayMessage, displaySmallMessage } from "@/utils/helper.util";
import { faFile, faPaperclip, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Image, Space, Typography, UploadFile } from "antd";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { DeleteOutlined } from '@ant-design/icons';
import Link from "next/link";

interface TaskFileProps {
  className?: string;
  task?: TaskType;
}
const { Text } = Typography;
const TaskFile: React.FC<TaskFileProps> = ({ className, task }) => {
  const t = useTranslations();
  const defaultPageSize = 6;
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [openUpload, setOpenUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filesData, setFilesData] = useState<ResponseWithPaginationType<TaskFileType[]>>();
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [loadingViewMore, setLoadingViewMore] = useState(false);
  const [confirmDeleteFile, setConfirmDeleteFile] = useState(false);
  const [fileIdDelete, setFileIdDelete] = useState<number>();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const handleSavaFile = async () => {
    try {
      if (files.length === 0 || !task) return;

      setLoading(true);
      const response = await uploadFiles(
        task.workspace_id,
        task.project_id,
        task.id,
        files.map(f => f.originFileObj) as File[]
      );
      setLoading(false);
      if (response && response.code === API_CODE.OK) {
        loadTaskFiles();
        setOpenUpload(false);
        setFiles([]);
        return;
      }
    } catch (error) {
      setLoading(false);
      displayMessage("error", (error as BaseResponseType).error?.message);
    }
  };
  const loadTaskFiles = async () => {
    try {
      if (!task) {
        return
      }
      const response = await taskFiles (task.workspace_id, task.project_id, task.id, {
        page: 1,
        size: pageSize
      });
      setLoadingViewMore(false);
      if (response && response.code === API_CODE.OK) {
        setFilesData(response.data);
        return;
      }
      displaySmallMessage('error', response.error?.message);
    } catch (error) {
      displaySmallMessage('error', (error as BaseResponseType).error?.message);
    }
  };
  const handleConfirmDeleteFile = (fileId: number) => {
    setFileIdDelete(fileId);
    setConfirmDeleteFile(true);
  }
  const handleCloseConfirmDelete = () => {
    setFileIdDelete(undefined);
    setConfirmDeleteFile(false);
  }
  const handleLoadMore = () => {
    setLoadingViewMore(true);
    setPageSize(pageSize + defaultPageSize);
  }
  const handleDeleteFile = async () => {
    try {
      if (!confirmDeleteFile || !fileIdDelete || !task) {
        return;
      }
      setDeleteLoading(true);
      const response = await removeFile(
        task.workspace_id,
        task.project_id,
        task.id,
        fileIdDelete
      );
      setDeleteLoading(false);
      if (response && response.code === API_CODE.OK) {
        loadTaskFiles();
        setFileIdDelete(undefined);
        setConfirmDeleteFile(false);
        return;
      }
      displaySmallMessage('error', response.error?.message);
    } catch (error) {
      setDeleteLoading(false);
      displaySmallMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  const handleDownload = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  useEffect(() => {
    loadTaskFiles();
  }, [task, pageSize]);

  return <>
    <div className={`row ${className ?? ''}`}>
      <div
        className="col-lg-3 col-12 text-secondary mt-2 pointer"
        onClick={() => setOpenUpload(true)}
      >
        <FontAwesomeIcon icon={faPaperclip} /> {t("tasks.attach_file")}
      </div>
      <div className="col-lg-9 col-12 mt-2">

      </div>

      <Modal
        open={openUpload}
        footerBtn={[]}
        setOpen={setOpenUpload}
      >
        <div className="row mt-4">
          <div className="col-12 text-center">
            <UploadFiles files={files} setFiles={setFiles}>
              <span className="text-secondary pointer">
                <FontAwesomeIcon icon={faUpload} /> {t('select_file')}
              </span>
            </UploadFiles>
          </div>

            {files.length > 0 && (
              <div className="col-12 mt-2">
                <Button color={loading ? 'secondary' : 'primary'} className="float-right" onClick={handleSavaFile} disabled={loading}>
                  {loading ? <Loading color="light" /> : t("btn_save")}
                </Button>
                <Button
                  color="default"
                  className="float-right mr-2"
                  onClick={() => setOpenUpload(false)}
                  disabled={loading}
                >
                  {t("btn_cancel")}
                </Button>
              </div>
            )}

        </div>
      </Modal>
    </div>
    <div className="row">
      {
        (filesData) && filesData.items.map((file, index) => (
          <div className="col-12 col-lg-4 col-sm-6" key={index}>
            <div className="file-item">
              <Space>
                {['jpg', 'jpeg', 'png'].includes(file.ext) ? (
                  <Image
                    src={file.url}
                    width={40}
                    height={30}
                    preview={false}
                    style={{ objectFit: 'cover', borderRadius: 4 }}
                  />
                ) : (
                  <FontAwesomeIcon className="text-secondary" icon={faFile} style={{ fontSize: 24 }} />
                )}
                <div>
                  <Link href={file.url} target="_blank" onClick={() => handleDownload (file.url, file.name)}>{file.name.substring(0, 18)}</Link>
                  <br/>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {(file.size || 0) / 1024 < 1024
                      ? `${(file.size || 0 / 1024).toFixed(2)} KB`
                      : `${((file.size || 0) / 1024 / 1024).toFixed(2)} MB`}
                  </Text>
                </div>
              </Space>
              <Button
                color="default"
                onClick={() => handleConfirmDeleteFile (file.id)}
              >
                <DeleteOutlined className="text-danger" />
              </Button>
            </div>
          </div>
        ))
      }
      {
        (filesData && filesData.total > defaultPageSize && pageSize < filesData.total) &&
        <div className="col-12 mt-2">
          <a className="text-secondary pointer" onClick={!loadingViewMore ? handleLoadMore : undefined}>
            {loadingViewMore ? <Loading color="secondary" /> : t('btn_view_more')}
          </a>
        </div>
      }
      <Modal
        closable={false}
        open={confirmDeleteFile}
        setOpen={setConfirmDeleteFile}
        title={t('tasks.delete_file_warning_message')}
        footerBtn={[]}
      >
        <div className="row">
          <div className="col-12 mt-2">
            <Button color={deleteLoading ? 'secondary' : 'primary'} className="float-right m-r-5" onClick={handleDeleteFile} disabled={deleteLoading}>
              {deleteLoading ? <Loading color="light" /> : t('btn_delete')}
            </Button>
            <Button color="default" className="float-right" onClick={handleCloseConfirmDelete}>
              {t('btn_cancel')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  </>
};

export default TaskFile;
