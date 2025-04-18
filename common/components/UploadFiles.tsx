import React from 'react';
import { UploadOutlined, DeleteOutlined, FileImageOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, Upload, Space, Typography, Image, message } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { displaySmallMessage } from '@/utils/helper.util';
import { useTranslations } from 'next-intl';

const { Text } = Typography;

interface UploadFilesProps {
  files: UploadFile[];
  children: React.ReactNode;
  setFiles: React.Dispatch<React.SetStateAction<UploadFile[]>>;
}

const UploadFiles: React.FC<UploadFilesProps> = ({ files, children, setFiles }) => {
  const t = useTranslations();
  const props: UploadProps = {
    listType: 'picture',
    fileList: files,
    beforeUpload: (file) => {
      const MAX_SIZE = 10 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        displaySmallMessage('error', t('tasks.file_exceeded'));
        return Upload.LIST_IGNORE;
      }

      const newFile: UploadFile = {
        uid: file.uid,
        name: file.name,
        status: 'done',
        originFileObj: file,
        type: file.type,
        size: file.size,
      };
      setFiles(prev => [...prev, newFile]);
      return false;
    },
    onRemove: (file) => {
      setFiles(prev => prev.filter(f => f.uid !== file.uid));
    },
    itemRender: (originNode, file, currFileList, actions) => {
      const isImage = file.type?.startsWith('image/');
      const imageSrc =
        file.thumbUrl ||
        (file.originFileObj && typeof file.originFileObj !== 'string'
          ? URL.createObjectURL(file.originFileObj)
          : undefined);

      return (
        <div className="file-item">
          <Space>
            {isImage && imageSrc ? (
              <Image
                src={imageSrc}
                width={40}
                height={40}
                preview={false}
                style={{ objectFit: 'cover', borderRadius: 4 }}
              />
            ) : (
              <FileImageOutlined style={{ fontSize: 24 }} />
            )}
            <div>
              <Text strong>{file.name}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12, float: 'left' }}>
                {(file.size || 0) / 1024 < 1024
                  ? `${(file.size || 0 / 1024).toFixed(2)} KB`
                  : `${((file.size || 0) / 1024 / 1024).toFixed(2)} MB`}
              </Text>
            </div>
          </Space>
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => actions.remove()}
            danger
          />
        </div>
      );
    },
  };

  return <Upload multiple {...props}>{children}</Upload>;
};

export default UploadFiles;
