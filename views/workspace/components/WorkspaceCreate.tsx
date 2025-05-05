import { create } from "@/api/workspace.api";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import Loading from "@/common/components/Loading";
import Modal from "@/common/components/Modal";
import Textarea from "@/common/components/Textarea";
import UploadImage from "@/common/components/UploadImage";
import { API_CODE } from "@/enums/api.enum";
import { isEmpty } from "@/services/validate.service";
import { BaseResponseType } from "@/types/base.type";
import { displayMessage } from "@/utils/helper.util";
import { UploadFile } from "antd";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

interface WorkspaceCreateProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const WorkspaceCreate: React.FC<WorkspaceCreateProps> = ({ open, setOpen }) => {
  const t = useTranslations();
  const router = useRouter();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const handleCreateWorkspace = async () => {
    try {
      if (isEmpty(name)) {
        setErrorMessage(t('workspaces_page.create.workspace_name_is_required'));
        return;
      }
      if (!name) {
        return;
      }

      setLoading(true);
      const response = await create({
        name: name,
        description: descriptionRef.current?.value,
        logo: fileList.length > 0 ? fileList[0].originFileObj : undefined
      });
      setLoading(false);
      if (response && response.code === API_CODE.CREATED) {
        router.push(`/workspace/${response.data.id}`);
        return;
      }
      displayMessage('error', response.error?.message);
    } catch (error) {
      setLoading(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  return (
    <Modal 
      open={open} 
      title={t('workspaces_page.create.create_title')}
      footerBtn={[
        <Button color='default' key={1} onClick={() => setOpen (false)} className='mr-2' disabled={loading}>
          {t('common.btn_cancel')}
        </Button>,
        <Button key={2} color={loading ? 'secondary' : 'primary'} type="submit" disabled={loading} onClick={handleCreateWorkspace}>
          {loading ? <Loading color="light" /> : t('common.btn_save')}
        </Button>
      ]
      }
      setOpen={setOpen} 
    >
      <div className='row'>
        <div className="col-12">
          <UploadImage fileList={fileList} setFileList={setFileList} />
        </div>
        <div className="col-12 mt-2">
          <Input 
            type="text"
            minLength={3}
            maxLength={100}
            placeholder={t('workspaces_page.create.input_workspace_name')} 
            onChange={(e) => setName (e.target.value)}
            errorMessage={errorMessage}
            validates={[
              {
                type: 'is_required',
                message: t('workspaces_page.create.workspace_name_is_required')
              }
            ]}
          />
        </div>
        <div className="col-12 mt-2">
          <Textarea ref={descriptionRef} maxLength={300} rows={3} placeholder={t('workspaces_page.create.placeholder_workspace_description')} />
        </div>
      </div>
    </Modal>
  )
}
export default WorkspaceCreate;