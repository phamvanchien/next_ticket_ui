import { create, update, workspace } from "@/api/workspace.api";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import Loading from "@/common/components/Loading";
import Modal from "@/common/components/Modal";
import Textarea from "@/common/components/Textarea";
import UploadImage from "@/common/components/UploadImage";
import { API_CODE } from "@/enums/api.enum";
import { useAppDispatch } from "@/reduxs/store.redux";
import { setWorkspaceUpdated } from "@/reduxs/workspace.redux";
import { isEmpty } from "@/services/validate.service";
import { BaseResponseType } from "@/types/base.type";
import { WorkspaceType } from "@/types/workspace.type";
import { displayMessage } from "@/utils/helper.util";
import { UploadFile } from "antd";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface WorkspaceEditProps {
  workspace: WorkspaceType
  open: boolean
  setOpen: (open: boolean) => void
}

const WorkspaceEdit: React.FC<WorkspaceEditProps> = ({ workspace, open, setOpen }) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [description, setDescription] = useState<string>();
  const handleCreateWorkspace = async () => {
    try {
      if (isEmpty(name)) {
        setErrorMessage(t('create_workspace.workspace_name_is_required'));
        return;
      }
      if (!name) {
        return;
      }

      setLoading(true);
      const response = await update(workspace.id, {
        name: name,
        description: description,
        logo: fileList.length > 0 ? fileList[0].originFileObj : undefined
      });
      setLoading(false);
      if (response && response.code === API_CODE.OK) {
        dispatch(setWorkspaceUpdated(response.data));
        setFileList([]);
        setName(response.data.name);
        setDescription(response.data.description);
        setOpen(false);
        return;
      }
      displayMessage('error', response.error?.message);
    } catch (error) {
      setLoading(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  useEffect(() => {
    setName(workspace.name);
    setDescription(workspace.description);
  }, [workspace, open]);
  return (
    <Modal 
      open={open} 
      title={t('workspace_setting.edit_label')}
      footerBtn={[
        <Button color='default' key={1} onClick={() => setOpen (false)} className='mr-2' disabled={loading}>
          {t('btn_cancel')}
        </Button>,
        <Button key={2} color={loading ? 'secondary' : 'primary'} type="submit" disabled={loading} onClick={handleCreateWorkspace}>
          {loading ? <Loading color="light" /> : t('btn_save')}
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
            value={name}
            minLength={3}
            maxLength={100}
            placeholder={t('create_workspace.input_workspace_name')} 
            onChange={(e) => setName (e.target.value)}
            errorMessage={errorMessage}
            validates={[
              {
                type: 'is_required',
                message: t('create_workspace.workspace_name_is_required')
              }
            ]}
          />
        </div>
        <div className="col-12 mt-2">
          <Textarea onChange={(e) => setDescription (e.target.value)} value={description} maxLength={300} rows={3} placeholder={t('create_workspace.placeholder_workspace_description')} />
        </div>
      </div>
    </Modal>
  )
}
export default WorkspaceEdit;