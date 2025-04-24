"use client"
import UserAvatar from "@/common/components/AvatarName";
import Button from "@/common/components/Button";
import EditorArea from "@/common/components/EditorArea";
import Input from "@/common/components/Input";
import { DocumentFileType, DocumentType } from "@/types/document.type";
import { dateToString, displayMessage } from "@/utils/helper.util";
import { faFile, faInfoCircle, faLink, faList, faPencil, faPlus, faSave, faTrash, faTrashAlt, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Image, Space, Typography, UploadFile, Watermark } from "antd";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { DeleteOutlined, FileImageOutlined } from '@ant-design/icons';
import UploadFiles from "@/common/components/UploadFiles";
import { BaseResponseType } from "@/types/base.type";
import { remove, removeFile, update, uploadFiles } from "@/api/document.api";
import { API_CODE } from "@/enums/api.enum";
import Loading from "@/common/components/Loading";
import { useRouter } from "next/navigation";
import Modal from "@/common/components/Modal";
import FileIcon from "@/common/components/FileIcon";
import DocumentSetting from "./components/DocumentSetting";
import { useAppDispatch } from "@/reduxs/store.redux";
import { setSidebarSelected } from "@/reduxs/menu.redux";

interface DocumentDetailViewProps {
  _document: DocumentType
}

const { Text } = Typography;

const DocumentDetailView: React.FC<DocumentDetailViewProps> = ({ _document }) => {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [documentData, setDocumentData] = useState<DocumentType>();
  const [documentContent, setDocumentContent] = useState<string>('');
  const [documentTitle, setDocumentTitle] = useState<string>('');
  const [fileData, setFileData] = useState<DocumentFileType[]>([]);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmDeleteFile, setConfirmDeleteFile] = useState(false);
  const [fileIdDelete, setFileIdDelete] = useState<number>();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleUpdateDocument = async () => {
    try {
      if (!documentTitle || documentTitle === '' || !documentData) return;
      setLoading(true);
      const response = await update(documentData.workspace_id, documentData.id, {
        title: documentTitle,
        content: documentContent,
      });
      setLoading(false);
      if (response?.code === API_CODE.OK) {
        setDocumentContent(response.data.content);
        setDocumentTitle(response.data.title);
        setOpenEdit(false);
      } else {
        displayMessage('error', response.error?.message);
      }
    } catch (error) {
      setLoading(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  };

  const handleUploadFile = async () => {
    try {
      if (files.length === 0 || !documentData) return;
      setLoading(true);
      const response = await uploadFiles(documentData.workspace_id, documentData.id, files.map(f => f.originFileObj as File));
      setLoading(false);
      if (response?.code === API_CODE.OK) {
        setFiles([]);
        setOpenUpload(false);
        setFileData([...fileData, ...response.data]);
      } else {
        displayMessage('error', response.error?.message);
      }
    } catch (error) {
      setLoading(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  };

  const handleDeleteDocument = async () => {
    try {
      if (!documentData) return;
      setDeleteLoading(true);
      const response = await remove(documentData.workspace_id, documentData.id);
      if (response && response.code === API_CODE.OK) {
        router.push(`/workspace/${documentData.workspace_id}/document`);
        return;
      }
      setDeleteLoading(false);
      displayMessage('error', response.error?.message);
    } catch (error) {
      setDeleteLoading(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
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

  const handleConfirmDeleteFile = (fileId: number) => {
    setFileIdDelete(fileId);
    setConfirmDeleteFile(true);
  };

  const handleCloseConfirmDelete = () => {
    setFileIdDelete(undefined);
    setConfirmDeleteFile(false);
  };

  const handleDeleteFile = async () => {
    try {
      if (!confirmDeleteFile || !fileIdDelete || !documentData) return;
      setDeleteLoading(true);
      const response = await removeFile(documentData.workspace_id, documentData.id, fileIdDelete);
      setDeleteLoading(false);
      if (response?.code === API_CODE.OK) {
        setFileData(fileData.filter(file => file.id !== fileIdDelete));
        handleCloseConfirmDelete();
      } else {
        displayMessage('error', response.error?.message);
      }
    } catch (error) {
      setDeleteLoading(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  };

  useEffect(() => {
    setDocumentData(_document);
    setDocumentContent(_document.content);
    setDocumentTitle(_document.title);
    setFileData(_document.files);
    dispatch(setSidebarSelected('document'));
  }, [_document]);

  if (!documentData) return <></>;
  return (
    <div className="document-container">
      <div className="document-header">
        <div className="document-user-info">
          <UserAvatar avatar={documentData.creator.avatar} name={documentData.creator.first_name} />
          <span className="creator-info">
            {documentData.creator.first_name} {documentData.creator.last_name} - {dateToString(new Date(documentData.created_at))}
          </span>
        </div>
        <div className="document-actions">
          {openEdit ? (
            <>
              <Button color={loading ? 'secondary' : 'primary'} disabled={loading} onClick={handleUpdateDocument}>
                {loading ? <Loading color="light" /> : <><FontAwesomeIcon icon={faSave} /> {t('btn_save')}</>}
              </Button>
              <Button color="default" className="btn-cancel" disabled={loading} onClick={() => setOpenEdit(false)}>
                {t('btn_cancel')}
              </Button>
            </>
          ) : (
            <>
              <Button color="default" onClick={() => router.push(`/workspace/${documentData.workspace_id}/document`)}>
                <FontAwesomeIcon icon={faList} />
              </Button>
              <Button color="default" onClick={() => router.push(`/workspace/${documentData.workspace_id}/document/new`)}>
                <FontAwesomeIcon icon={faPlus} />
              </Button>
              {documentData.full_permission && (
                <>
                  <Button color="default" onClick={() => setOpenSetting(true)}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </Button>
                  <Button color="default" onClick={() => setOpenEdit(true)}>
                    <FontAwesomeIcon icon={faPencil} />
                  </Button>
                  <Button color="default" onClick={() => setConfirmDelete(true)}>
                    <FontAwesomeIcon icon={faTrashAlt} className="text-danger" />
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div className="document-meta">
        <Badge
          text={`${t('documents.last_modify_label')}: ${documentData.updator.first_name} ${documentData.updator.last_name} - ${dateToString(new Date(documentData.updated_at))}`}
          showZero
          color="#198754"
        />
      </div>

      <Watermark content={documentTitle}>
        <div className="document-body">
          {openEdit ? (
            <Input
              type="text"
              placeholder={t('documents.placeholder_enter_title')}
              value={documentTitle}
              classInput="document-title"
              onChange={(e) => setDocumentTitle(e.target.value)}
            />
          ) : (
            <h1 className="document-title">{documentTitle}</h1>
          )}

          {!openEdit && documentData.full_permission && (
            <div className="upload-trigger" onClick={() => setOpenUpload(true)}>
              <FontAwesomeIcon icon={faLink} /> {t('tasks.attach_file')}
            </div>
          )}

          <div className="document-files">
            {fileData.map((file, index) => (
              <div className="document-file-item" key={index}>
                <Space>
                  {['jpg', 'jpeg', 'png'].includes(file.ext) ? (
                    <Image src={file.url} width={40} height={30} preview={false} />
                  ) : (
                    <FileIcon ext={file.ext} />
                  )}
                  <div>
                    <Link href={file.url} target="_blank" onClick={() => handleDownload(file.url, file.name)}>
                      {file.name.substring(0, 18)}
                    </Link>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {(file.size || 0) / 1024 < 1024
                        ? `${(file.size || 0 / 1024).toFixed(2)} KB`
                        : `${((file.size || 0) / 1024 / 1024).toFixed(2)} MB`}
                    </Text>
                  </div>
                </Space>
                {documentData.full_permission && (
                  <Button color="default" className="float-right" onClick={() => handleConfirmDeleteFile(file.id)}>
                    <DeleteOutlined className="text-danger" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="document-content">
            {openEdit ? (
              <EditorArea value={documentContent} setValue={setDocumentContent} />
            ) : (
              <div className="document-html" dangerouslySetInnerHTML={{ __html: documentContent }} />
            )}
          </div>
        </div>
      </Watermark>
      <Modal
          closable={false}
          open={confirmDeleteFile}
          setOpen={setConfirmDeleteFile}
          title={t('documents.delete_file_warning_message')}
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
      <Modal
          open={openUpload}
          footerBtn={[]}
          setOpen={setOpenUpload}
        >
          <div className="row mt-4">
            <div className="col-12 text-center upload-wrapper">
              <UploadFiles files={files} setFiles={setFiles}>
                <span className="text-secondary pointer">
                  <FontAwesomeIcon icon={faUpload} /> {t('select_file')}
                </span>
              </UploadFiles>
            </div>

              {files.length > 0 && (
                <div className="col-12 mt-2">
                  <Button color={loading ? 'secondary' : 'primary'} className="float-right" onClick={handleUploadFile} disabled={loading}>
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
      <Modal
        closable={false}
        open={confirmDelete}
        setOpen={setConfirmDelete}
        title={t('documents.delete_document_warning_message')}
        footerBtn={[]}
      >
        <div className="row">
          <div className="col-12 mt-2">
            <Button color={deleteLoading ? 'secondary' : 'primary'} className="float-right m-r-5" onClick={handleDeleteDocument} disabled={deleteLoading}>
              {deleteLoading ? <Loading color="light" /> : t('btn_delete')}
            </Button>
            <Button color="default" className="float-right" onClick={() => setConfirmDelete (false)}>
              {t('btn_cancel')}
            </Button>
          </div>
        </div>
      </Modal>
      <DocumentSetting open={openSetting} setOpen={setOpenSetting} document={documentData} />
    </div>
  )
}
export default DocumentDetailView;