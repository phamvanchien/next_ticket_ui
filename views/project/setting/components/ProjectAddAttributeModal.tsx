import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { ProjectAttributeType, ProjectType, RequestAddAttributeType } from "@/types/project.type";
import { addAttribute } from "@/api/project.api";
import { notify } from "@/utils/helper.util";
import { catchError } from "@/services/base.service";
import { BaseResponseType } from "@/types/base.type";
import { APP_ERROR } from "@/enums/app.enum";
import Modal from "@/common/modal/Modal";
import ModalHeader from "@/common/modal/ModalHeader";
import ModalBody from "@/common/modal/ModalBody";
import { API_CODE } from "@/enums/api.enum";
import Loading from "@/common/components/Loading";
import { useAppDispatch } from "@/reduxs/store.redux";
import { setAittributeList } from "@/reduxs/attribute.redux";

interface ProjectAddAttributeModalProps {
  project: ProjectType
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  attributesData: ProjectAttributeType[]
  setAttributesData: (attributesData: ProjectAttributeType[]) => void
}

const ProjectAddAttributeModal: React.FC<ProjectAddAttributeModalProps> = ({ project, isOpen, attributesData, setIsOpen, setAttributesData }) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const [attributes, setAttributes] = useState<RequestAddAttributeType[]>([]);
  const [loading, setLoading] = useState(false);

  const isAnyAttributeEmpty = attributes.some(attr => attr.name.trim() === "" || attr.value.length === 0 || attr.value.some(v => v.trim() === ""));

  const handleAddAttribute = (): void => {
    if (!isAnyAttributeEmpty) {
      setAttributes([...attributes, { id: uuidv4(), name: "", value: [""] }]);
    }
  };

  const handleChangeAttributeName = (id: string, name: string) => {
    setAttributes(prevAttributes =>
      prevAttributes.map(attr =>
        attr.id === id ? { ...attr, name } : attr
      )
    );
  };

  const handleChangeAttributeValue = (id: string, index: number, newValue: string) => {
    setAttributes(prevAttributes =>
      prevAttributes.map(attr =>
        attr.id === id
          ? { ...attr, value: attr.value.map((v, i) => (i === index ? newValue : v)) }
          : attr
      )
    );
  };

  const handleAddValue = (id: string) => {
    setAttributes(prevAttributes =>
      prevAttributes.map(attr =>
        attr.id === id
          ? attr.value.length === 0 || attr.value[attr.value.length - 1].trim() !== ""
            ? { ...attr, value: [...attr.value, ""] }
            : attr
          : attr
      )
    );
  };  

  const handleRemoveValue = (id: string, index: number) => {
    setAttributes(prevAttributes =>
      prevAttributes.map(attr =>
        attr.id === id
          ? { ...attr, value: attr.value.filter((_, i) => i !== index) }
          : attr
      )
    );
  };

  const handleRemoveAttribute = (id: string): void => {
    setAttributes(attributes.filter(attr => attr.id !== id));
  };

  const handleSubmitAttribute = async () => {
    try {
      setLoading(true);
      const response = await addAttribute(project.workspace_id, project.id, attributes);
      setLoading(false);
      if (response && response.code === API_CODE.CREATED) {
        setAttributesData([...attributesData, ...response.data]);
        dispatch(setAittributeList([...attributesData, ...response.data]));
        setIsOpen(false);
        setAttributes([]);
        return;
      }
      notify(response.message, 'error');
    } catch (error) {
      setLoading(false);
      notify(catchError(error as BaseResponseType)?.message ?? APP_ERROR.SERVER_ERROR, 'error');
    }
  }
  return (
    <Modal isOpen={isOpen}>
      <ModalHeader title={t('project_setting.add_attribute_title')} setShow={setIsOpen} />
      <ModalBody>
        <div className="row">
          <div className="col-12 mt-2">
            <Button
              color="default"
              className="mt-2"
              onClick={handleAddAttribute}
              disabled={isAnyAttributeEmpty}
            >
              <FontAwesomeIcon icon={faPlus} /> {t("btn_add_new")}
            </Button>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
          {attributes.map((attribute) => (
            <div className="card mt-2" key={attribute.id}>
              <div className="card-body p-10">
                <div className="row">
                  <div className="col-12">
                    <Input
                      type="text"
                      maxLength={200}
                      placeholder={t("project_setting.placeholder_attribute_name")}
                      value={attribute.name}
                      onChange={(e) => handleChangeAttributeName(attribute.id, e.target.value)}
                    />
                  </div>

                  {attribute.value.map((val, index) => {
                    return <>
                      <div className="col-11 mt-2" key={`${attribute.id}-${index}`}>
                        <Input
                          type="text"
                          maxLength={200}
                          placeholder={t("project_setting.placeholder_attribute_value")}
                          value={val}
                          onChange={(e) => handleChangeAttributeValue(attribute.id, index, e.target.value)}
                        />
                      </div>
                      <div className="col-1 mt-2">
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="text-danger"
                          onClick={() => handleRemoveValue(attribute.id, index)}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    </>
                  })}

                  <div className="col-12 mt-2">
                    <Button color="default" size="sm" onClick={() => handleAddValue(attribute.id)} disabled={attribute.value.length > 0 && attribute.value[attribute.value.length - 1].trim() === ""}>
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                    <Button color="danger" className="ml-2" size="sm" onClick={() => handleRemoveAttribute(attribute.id)}>
                      <FontAwesomeIcon
                        icon={faTrash}
                        style={{ cursor: "pointer" }}
                      />
                    </Button>
                  </div>


                </div>
              </div>
            </div>
          ))}
          </div>
        </div>

        {
          (attributes.length > 0 && attributes[0].value.length > 0 && attributes[0].value[0].trim() !== '') &&
          <div className="row">
            <div className="col-12">
              <Button color={loading ? 'secondary' : 'primary'} className="float-right" onClick={handleSubmitAttribute} disabled={loading}>
                {loading ? <Loading color="light" /> : t('btn_save')}
              </Button>
              <Button color="default" className="float-right mr-2 btn-no-border" disabled={loading} outline onClick={() => setIsOpen (false)}>
                {t('btn_cancel')}
              </Button>
            </div>
          </div>
        }
      </ModalBody>
    </Modal>
  );
}
export default ProjectAddAttributeModal;