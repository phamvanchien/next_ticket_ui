import { deleteAttribute } from "@/api/project.api";
import Button from "@/common/components/Button";
import Loading from "@/common/components/Loading";
import Modal from "@/common/modal/Modal";
import ModalBody from "@/common/modal/ModalBody";
import ModalHeader from "@/common/modal/ModalHeader";
import { API_CODE } from "@/enums/api.enum";
import { APP_ERROR } from "@/enums/app.enum";
import { setAittributeList } from "@/reduxs/attribute.redux";
import { useAppDispatch } from "@/reduxs/store.redux";
import { catchError } from "@/services/base.service";
import { BaseResponseType } from "@/types/base.type";
import { ProjectAttributeType, ProjectType } from "@/types/project.type";
import { notify } from "@/utils/helper.util";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

interface DeleteAttributeModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  attributeId?: number
  setAttributeId: (attributeId?: number) => void
  project: ProjectType
  attributesData: ProjectAttributeType[]
  setAttributesData: (attributesData: ProjectAttributeType[]) => void
}

const DeleteAttributeModal: React.FC<DeleteAttributeModalProps> = ({ isOpen, attributeId, project, attributesData, setAttributesData, setAttributeId, setIsOpen }) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const handleDeleteAttr = async () => {
    try {
      if (!attributeId) {
        return;
      }

      setLoading(true);
      const response = await deleteAttribute(project.workspace_id, project.id, attributeId);
      setLoading(false);
      if (response && response.code === API_CODE.OK) {
        setAttributesData(attributesData.filter(a => a.id !== attributeId));
        dispatch(setAittributeList(attributesData.filter(a => a.id !== attributeId)));
        setIsOpen(false);
        setAttributeId(undefined);
        return;
      }
      notify(response.message, 'error');
    } catch (error) {
      notify(catchError(error as BaseResponseType)?.message ?? APP_ERROR.SERVER_ERROR, 'error');
      setLoading(false);
    }
  }
  return (
    <Modal isOpen={isOpen}>
      <ModalHeader setShow={setIsOpen} title={t('project_setting.delete_attribute_warning')} />
      <ModalBody>
        <div className="row">
          <div className="col-12">
            <Button color="primary" className="float-right" disabled={loading} onClick={handleDeleteAttr}>
              {loading ? <Loading color="light" /> : t('btn_ok')}
            </Button>
            <Button color="default" className="float-right mr-2 btn-no-border" outline disabled={loading} onClick={() => setIsOpen (false)}>
              {t('btn_cancel')}
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}
export default DeleteAttributeModal;