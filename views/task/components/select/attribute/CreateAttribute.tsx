import { useRef, useState } from "react";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import Modal from "@/common/modal/Modal";
import ModalBody from "@/common/modal/ModalBody";
import ModalHeader from "@/common/modal/ModalHeader";
import { faAlignJustify, faAlignLeft, faCalendar, faCaretSquareDown, faListUl, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Select } from "antd";
import { useTranslations } from "next-intl";
import React, { Dispatch, SetStateAction } from "react";
import { notify } from "@/utils/helper.util";
import { catchError } from "@/services/base.service";
import { BaseResponseType } from "@/types/base.type";
import { APP_ERROR } from "@/enums/app.enum";
import { addAttribute } from "@/api/project.api";
import { ProjectType } from "@/types/project.type";
import { API_CODE } from "@/enums/api.enum";
import Loading from "@/common/components/Loading";
import { useAppDispatch } from "@/reduxs/store.redux";
import { attributeUpdated } from "@/reduxs/attribute.redux";

interface CreateAttributeProps {
  project: ProjectType
  openCreate: boolean;
  setOpenCreate: Dispatch<SetStateAction<boolean>>;
}

const CreateAttribute: React.FC<CreateAttributeProps> = ({ openCreate, project, setOpenCreate }) => {
  const t = useTranslations();
  const [values, setValues] = useState<string[]>([""]);
  const [attributeType, setAttributeType] = useState<number>();
  const [loading, setLoading] = useState(false);
  const attrNameRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const onChange = (value: string) => {
    setAttributeType(Number(value));
  };

  const handleAddValue = () => {
    if (values.some((val) => val.trim() === "")) return;

    setValues([...values, ""]);
  };

  const handleChangeValue = (index: number, newValue: string) => {
    const newValues = [...values];
    newValues[index] = newValue;
    setValues(newValues);
  };

  const handleRemoveValue = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    setValues(newValues);
  };

  const handleSubmitAttribute = async () => {
    if (!attributeType || !attrNameRef.current || (attrNameRef.current && attrNameRef.current.value === "")) {
      return;
    }

    try {
      setLoading(true);
      const response = await addAttribute(project.workspace_id, project.id, {
        name: attrNameRef.current.value,
        type: attributeType,
        value: values
      });
      setLoading(false);
      if (response && response.code === API_CODE.CREATED) {
        setOpenCreate(false);
        setValues([""]);
        attrNameRef.current.value = "";
        dispatch(attributeUpdated(response.data));
        return;
      }
      notify(response.error?.message ?? APP_ERROR.SERVER_MAINTAIN, 'error')
    } catch (error) {
      setLoading(false);
      notify(catchError(error as BaseResponseType)?.message ?? APP_ERROR.SERVER_MAINTAIN, 'error');
    }
  }

  return (
    <Modal isOpen={openCreate}>
      <ModalHeader setShow={setOpenCreate} title={t("tasks.create_property_label")} />
      <ModalBody>
        <div className="row">
          <div className="col-12">
            <Input type="text" maxLength={50} placeholder="Enter attribute name" ref={attrNameRef} />
          </div>
          <div className="col-12">
            <Select
              showSearch
              getPopupContainer={(trigger) => trigger.parentElement || document.body}
              placeholder="Select an attribute"
              optionFilterProp="label"
              onChange={onChange}
              className="mt-2 w-100"
              options={[
                { value: 1, label: <div><FontAwesomeIcon icon={faAlignLeft} /> Text</div> },
                { value: 2, label: <div><FontAwesomeIcon icon={faAlignJustify} /> Textarea</div> },
                { value: 3, label: <div><FontAwesomeIcon icon={faCaretSquareDown} /> Select</div> },
                { value: 4, label: <div><FontAwesomeIcon icon={faListUl} /> Multi select</div> },
                { value: 5, label: <div><FontAwesomeIcon icon={faCalendar} /> Date</div> },
              ]}
            />
          </div>
          {
            (attributeType && [3, 4].includes(attributeType)) &&
            <div className="col-12 mt-2">
              <Button color="default" className="btn-no-border" onClick={handleAddValue}>
                <FontAwesomeIcon icon={faPlus} /> Add a value
              </Button>
            </div>
          }
        </div>

        {(attributeType && [3, 4].includes(attributeType)) && values.map((val, index) => (
          <div className="row mt-2" key={index}>
            <div className={`col-${values.length > 1 ? '11' : '12'}`}>
              <Input
                type="text"
                maxLength={50}
                value={val}
                onChange={(e) => handleChangeValue(index, e.target.value)}
              />
            </div>
            <div className="col-1">
              {values.length > 1 && (
                <FontAwesomeIcon
                  icon={faTrash}
                  className="text-secondary pointer"
                  onClick={() => handleRemoveValue(index)}
                />
              )}
            </div>
          </div>
        ))}
        <div className="row mt-4">
          <div className="col-12">
            <Button color={loading ? 'secondary' : 'primary'} disabled={loading} className="float-right ml-2" onClick={handleSubmitAttribute}>
              {loading ? <Loading color="light" /> : t('btn_create')}
            </Button>
            <Button color="default" className="float-right btn-no-border" outline disabled={loading} onClick={() => setOpenCreate (false)}>
              {t('btn_cancel')}
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default CreateAttribute;