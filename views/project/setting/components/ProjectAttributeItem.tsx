import { updateAttribute } from "@/api/project.api";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import { API_CODE } from "@/enums/api.enum";
import { APP_ERROR } from "@/enums/app.enum";
import { attributeUpdated } from "@/reduxs/attribute.redux";
import { useAppDispatch } from "@/reduxs/store.redux";
import { catchError } from "@/services/base.service";
import { BaseResponseType } from "@/types/base.type";
import { ProjectAttributeType, ProjectType, RequestUpdateAttributeType } from "@/types/project.type";
import { notify } from "@/utils/helper.util";
import { faArrowCircleRight, faCaretDown, faCaretUp, faCircleDot, faMinusCircle, faPencil, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { ChangeEvent, useEffect, useState } from "react";

interface ProjectAttributeItemProps {
  attribute: ProjectAttributeType
  attrWarning?: number
  project: ProjectType
  handleClickDeleteAttr: (id: number) => void
  handleDeleteAttrValue: (id: number, value: string) => void
}

const ProjectAttributeItem: React.FC<ProjectAttributeItemProps> = ({ 
  attribute, 
  attrWarning,
  project,
  handleClickDeleteAttr,
  handleDeleteAttrValue
}) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const [attributeExpand, setAttributeExpand] = useState<number>();
  const [openEdit, setOpenEdit] = useState(false);
  const [openEditValue, setOpenEditValue] = useState<string>();
  const [attributeData, setAttributeData] = useState(attribute);
  const [attrName, setAttrName] = useState(attributeData.name);
  const [attrValue, setAttrValue] = useState(attributeData.value);
  useEffect(() => {
    setOpenEditValue(undefined);
    setAttrValue(attributeData.value);
    if (openEdit === false) {
      setAttrName(attributeData.name);
    }
  }, [openEdit]);
  useEffect(() => {
    setAttrValue(attributeData.value);
  }, [openEditValue]);
  const handleSubmitUpdateValue = async () => {
    await handleSubmitUpdate ({
      id: attributeData.id,
      value: attrValue.map(v => v.value)
    });
    setOpenEditValue(undefined);
  }
  const handleSubmitUpdateName = async () => {
    await handleSubmitUpdate({
      id: attributeData.id,
      name: attrName
    });
    setOpenEdit(false);
  }
  const handleSubmitUpdate = async (payload: RequestUpdateAttributeType) => {
    try {
      const response = await updateAttribute(project.workspace_id, project.id, payload);
      if (response && response.code === API_CODE.OK) {
        setAttributeData(response.data);
        dispatch(attributeUpdated(response.data));
        return;
      }
      notify(response.message, 'error');
    } catch (error) {
      notify(catchError(error as BaseResponseType)?.message ?? APP_ERROR.SERVER_ERROR, 'error');
    }
  }
  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    const newValues = attrValue.map(v => {
      return {
        ...v,
        value: v.key === key ? e.target.value : v.value
      }
    });
    setAttrValue(newValues);
  }
  return (
    <div>
      {
        attrWarning === attributeData.id &&
        <span className="text-warning" style={{fontSize: 13}}>
          <FontAwesomeIcon icon={faWarning} /> {t('project_setting.delete_attribute_warning_message')}
        </span>
      }
      <div className="mt-2"
        style={{
          padding: "8px",
          borderRadius: "5px",
          backgroundColor: "#f8f9fa",
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
          cursor: "pointer",
        }}
      >
        {openEdit && <>
          <Input 
            type="text" 
            className="w-80" 
            defaultValue={attributeData.name} 
            style={{ background: 'unset', border: 'unset' }} 
            onChange={(e) => setAttrName (e.target.value)}
          />
          <Button color="default" outline className="ml-2 mr-2 mt-2 btn-no-border" size="sm" onClick={() => setOpenEdit (false)}>
            {t('btn_cancel')}
          </Button>
          <Button color="primary" size="sm" className="mt-2" onClick={handleSubmitUpdateName}>
            {t('btn_save')}
          </Button>
        </>}
        {
          !openEdit && <>
            <FontAwesomeIcon className="text-secondary" icon={faCircleDot} /> {attributeData.name}
            <FontAwesomeIcon 
              icon={faMinusCircle} 
              className="float-right text-danger w-10 m-t-5" 
              style={{ cursor: 'pointer' }} 
              onClick={() => handleClickDeleteAttr (attributeData.id)} 
            />
            <FontAwesomeIcon 
              icon={faPencil} 
              className="float-right text-secondary ml-2 m-t-5" 
              style={{ cursor: 'pointer' }} 
              onClick={() => setOpenEdit (true)}
            />
            {
              attributeData.value.length > 0 &&
              <FontAwesomeIcon 
                icon={attributeExpand === attributeData.id ? faCaretUp : faCaretDown} 
                className="float-right text-secondary m-t-5 mr-2" 
                style={{ cursor: 'pointer' }} 
                onClick={() => setAttributeExpand (attributeExpand === attributeData.id ? undefined : attributeData.id)}
              />
            } 
          </>
        }
      </div>
      {
        attributeExpand === attributeData.id && attributeData.value.map((v, index) => (
          <div className="mt-2"
            key={index}
            style={{
              padding: "8px",
              borderRadius: "5px",
              backgroundColor: "#f8f9fa",
              cursor: "pointer",
              marginLeft: 30
            }}
          >
            {
              openEditValue === v.key && <>
                <Input 
                  type="text" 
                  className="w-80" 
                  defaultValue={v.value} 
                  style={{ background: 'unset', border: 'unset' }} 
                  onChange={(e) => handleChangeValue (e, v.key)}
                />
                <Button color="default" outline className="ml-2 mr-2 mt-2 btn-no-border" size="sm" onClick={() => setOpenEditValue (undefined)}>
                  {t('btn_cancel')}
                </Button>
                <Button color="primary" size="sm" className="mt-2" onClick={handleSubmitUpdateValue}>
                  {t('btn_save')}
                </Button>
              </>
            }
            {
              (!openEditValue || (openEditValue && openEditValue !== v.key)) && <>
              <FontAwesomeIcon className="text-secondary" icon={faArrowCircleRight} /> {v.value}
              {/* <FontAwesomeIcon 
                icon={faMinusCircle} 
                className="text-secondary float-right text-danger w-10 m-t-5" 
                style={{ cursor: 'pointer' }} 
                onClick={() => handleDeleteAttrValue (attributeData.id, v.key)}
              /> */}
              {/* <FontAwesomeIcon 
                icon={faPencil} 
                className="float-right text-secondary ml-2 m-t-5" 
                style={{ cursor: 'pointer' }} 
                onClick={() => setOpenEditValue (v.key)}
              /> */}
              </>
            }
          </div>
        ))
      }
    </div>
  )
}
export default ProjectAttributeItem;