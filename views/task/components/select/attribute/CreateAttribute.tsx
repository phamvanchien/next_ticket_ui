import { ChangeEvent, useRef, useState } from "react";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import Modal from "@/common/modal/Modal";
import ModalBody from "@/common/modal/ModalBody";
import ModalHeader from "@/common/modal/ModalHeader";
import { faAlignJustify, faAlignLeft, faCalendar, faCaretSquareDown, faListUl, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { message, notification, Select } from "antd";
import { useTranslations } from "next-intl";
import React, { Dispatch, SetStateAction } from "react";
import { nextTechNotification, notify } from "@/utils/helper.util";
import { catchError, hasError, printError, validateForm, validateInput } from "@/services/base.service";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import { APP_ERROR, APP_VALIDATE_TYPE } from "@/enums/app.enum";
import { addAttribute } from "@/api/project.api";
import { ProjectType } from "@/types/project.type";
import { API_CODE } from "@/enums/api.enum";
import Loading from "@/common/components/Loading";
import { useAppDispatch } from "@/reduxs/store.redux";
import { attributeUpdated } from "@/reduxs/attribute.redux";
import InputForm from "@/common/components/InputForm";
import { NotificationPlacement } from "antd/es/notification/interface";
import ErrorInput from "@/common/components/ErrorInput";

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
  const [validateError, setValidateError] = useState<AppErrorType[] | []>([]);
  const [attributeName, setAttributeName] = useState<string>();
  const dispatch = useAppDispatch();

  const onChange = (value: string) => {
    setAttributeType(Number(value));
  };

  const handleAddValue = () => {
    if (values.some((val) => val.trim() === "")) return;

    setValidateError(validateError.filter(v => v.property !== 'value_is_empty'));
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
    const validates: { [key: string]: any[] } = {};
    validates['attribute_name'] = [
      {
        value: attributeName,
        validateType: APP_VALIDATE_TYPE.REQUIRED,
        validateMessage: t('tasks.attribute_name_is_required')
      }
    ];

    if (hasError(validateError) || !validateForm(validates, validateError, setValidateError) || !attributeName || !attributeType) {
      return;
    }

    if ([3, 4].includes(attributeType) && values.some((val) => val.trim() === "")) {
      setValidateError([
        {
          property: 'value_is_empty',
          message: t('tasks.attribute_value_is_required')
        }
      ]);
      return;
    }

    try {
      setLoading(true);
      const response = await addAttribute(project.workspace_id, project.id, {
        name: attributeName,
        type: attributeType,
        value: values
      });
      setLoading(false);
      if (response && response.code === API_CODE.CREATED) {
        setOpenCreate(false);
        setValues([""]);
        setAttributeName(undefined);
        dispatch(attributeUpdated(response.data));
        setValidateError([]);
        return;
      }
      notify(response.error?.message ?? APP_ERROR.SERVER_MAINTAIN, 'error')
    } catch (error) {
      setLoading(false);
      notify(catchError(error as BaseResponseType)?.message ?? APP_ERROR.SERVER_MAINTAIN, 'error');
    }
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAttributeName(event.target.value);
    handleValidateInput(event.target.value);
  }

  const handleValidateInput = (value: string = attributeName ?? '') => {
    const required = validateInput('attribute_name', value ?? '', t('tasks.attribute_name_is_required'), APP_VALIDATE_TYPE.REQUIRED, validateError, setValidateError);
    if (!required) {
      return false;
    }
    return true;
  }

  const handleCloseModal = () => {
    setOpenCreate(false);
    setValidateError([]);
    setAttributeName(undefined);
    setAttributeType(undefined);
  }

  return (
    <Modal isOpen={openCreate}>
      <ModalHeader setShow={setOpenCreate} title={t("tasks.create_property_label")} />
      <ModalBody>
        <div className="row">
          <div className="col-12">
            <div className="input-group">
              <Input 
                type="text" 
                placeholder={t('tasks.placeholder_attribute_name')}
                minLength={3}
                maxLength={100}
                id="attribute_name"
                onChange={handleInputChange}
                invalid={hasError(validateError, 'attribute_name')}
              />
              <ErrorInput validateError={validateError} errorKey="attribute_name" />
            </div>
          </div>
          <div className="col-12">
            <Select
              showSearch
              getPopupContainer={(trigger) => trigger.parentElement || document.body}
              placeholder="Select an attribute"
              optionFilterProp="label"
              onChange={onChange}
              className="mt-2 w-100 is-invalid"
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
            (attributeType && [3, 4].includes(attributeType)) && <>
              <div className="col-12 mt-2">
                <Button color="default" className="btn-no-border" onClick={handleAddValue}>
                  <FontAwesomeIcon icon={faPlus} /> {t('tasks.attribute_add_value_label')}
                </Button>
              </div>
              <div className="col-12 mt-2">
                <ErrorInput validateError={validateError} errorKey="value_is_empty" />
              </div>
            </>
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
            <Button color="default" className="float-right btn-no-border" outline disabled={loading} onClick={handleCloseModal}>
              {t('btn_cancel')}
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default CreateAttribute;