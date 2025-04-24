import React from "react";
import { FileOutlined, FileImageOutlined, FileZipOutlined, FilePdfOutlined, FileExcelOutlined, FileGifOutlined, FileMarkdownOutlined } from '@ant-design/icons';

interface FileIconProps {
  ext?: string
}

const FileIcon: React.FC<FileIconProps> = ({ ext }) => {
  if (ext && ['zip', 'rar'].includes(ext)) {
    return <FileZipOutlined style={{ fontSize: 24 }} />
  }
  if (ext && ['png', 'jpg', 'jpeg'].includes(ext)) {
    return <FileImageOutlined style={{ fontSize: 24 }} />
  }
  if (ext && ['pdf'].includes(ext)) {
    return <FilePdfOutlined style={{ fontSize: 24 }} />
  }
  if (ext && ['xlsx', 'csv'].includes(ext)) {
    return <FileExcelOutlined style={{ fontSize: 24 }} />
  }
  if (ext && ['gif'].includes(ext)) {
    return <FileGifOutlined style={{ fontSize: 24 }} />
  }
  if (ext && ['doc', 'docx'].includes(ext)) {
    return <FileMarkdownOutlined style={{ fontSize: 24 }} />
  }
  return <FileOutlined style={{ fontSize: 24 }} />
}
export default FileIcon;