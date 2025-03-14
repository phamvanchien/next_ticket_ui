import { memo, useEffect, useState } from "react";
import Button from "@/common/components/Button";
import {faInfoCircle, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { ProjectAttributeType, ProjectType } from "@/types/project.type";
import ProjectAddAttributeModal from "./ProjectAddAttributeModal";
import DeleteAttributeModal from "./DeleteAttributeModal";
import { notify } from "@/utils/helper.util";
import { catchError } from "@/services/base.service";
import { BaseResponseType } from "@/types/base.type";
import { APP_ERROR } from "@/enums/app.enum";
import { updateAttribute } from "@/api/project.api";
import { API_CODE } from "@/enums/api.enum";
import ProjectAttributeItem from "./ProjectAttributeItem";
import { RootState } from "@/reduxs/store.redux";
import { useSelector } from "react-redux";

interface ProjectSettingAttributeProps {
  project: ProjectType
}

const ProjectSettingAttribute: React.FC<ProjectSettingAttributeProps> = memo(({ project }) => {
  const t = useTranslations();
  const attributesUpdated = useSelector((state: RootState) => state.attributeSlice).dataUpdated;
  const attributesDataset = useSelector((state: RootState) => state.attributeSlice).setAttribute;
  const [attributesData, setAttributesData] = useState<ProjectAttributeType[]>(() => {
    let initialAttributes: ProjectAttributeType[] = project.attributes ?? [];
    if (attributesDataset && attributesDataset.length > 0) {
      const insertedIds = new Set(attributesDataset.map(attr => attr.id));
      initialAttributes = [
        ...initialAttributes.filter(attr => !insertedIds.has(attr.id)),
        ...attributesDataset
      ];
    }

    if (attributesUpdated) {
      initialAttributes = initialAttributes.map(a =>
        a.id === attributesUpdated.id
          ? { ...a, name: attributesUpdated.name, value: attributesUpdated.value }
          : a
      );
    }
  
    return initialAttributes;
  });
  
  const [openCreate, setOpenCreate] = useState(false);
  const [attrDelete, setAttrDelete] = useState<number>();
  const [confirmDeleteAttr, setConfirmDeleteAttr] = useState(false);
  const [attrWarning, setAttrWarning] = useState<number>();
  const handleClickDeleteAttr = (id: number) => {
    setConfirmDeleteAttr(true);
    setAttrDelete(id);
  }
  const handleDeleteAttrValue = async (attributeId: number, valueKey: string) => {
    try {
      const attribute = attributesData.find(a => a.id === attributeId);
      if (attribute && [1, 2].includes(attribute.value.length)) {
        setAttrWarning(attributeId);
      }
      
      setAttributesData(prevAttributes =>
        prevAttributes.map(attr =>
          attr.id === attributeId
            ? { ...attr, value: attr.value.filter(v => v.key !== valueKey) }
            : attr
        )
      );

      const attributesInput = attributesData.map(attr =>
        attr.id === attributeId
          ? { ...attr, value: attr.value.filter(v => v.key !== valueKey) }
          : attr
      );

      const attributeInput = attributesInput.find(a => a.id === attributeId); 
      if (!attribute || !attributeInput) {
        notify(APP_ERROR.SERVER_ERROR, 'error');
        return;
      }

      const response = await updateAttribute(project.workspace_id, project.id, {
        id: attributeId,
        value: attributeInput.value.map(v => v.value)
      });
      if (!response || (response && response.code !== API_CODE.OK)) {
        notify(response.message, 'error');
      }
    } catch (error) {
      notify(catchError(error as BaseResponseType)?.message ?? APP_ERROR.SERVER_ERROR, 'error');
    }
  };

  return <>
    <div className="row">
      <div className="col-12 col-lg-4 col-sm-6 mt-4">
        <h5 className="text-muted">{t("tasks.attribute_label")}</h5>
        <i className="text-muted">
          <FontAwesomeIcon icon={faInfoCircle} /> {t("project_setting.setting_attribute_label")}
        </i>
      </div>
    </div>

    <div className="row">
      <div className="col-12 col-lg-4 col-sm-6 mt-2">
        {
          attributesData.map(attribute => 
            <ProjectAttributeItem
              key={attribute.id}
              attribute={attribute}
              attrWarning={attrWarning}
              project={project}
              handleClickDeleteAttr={handleClickDeleteAttr}
              handleDeleteAttrValue={handleDeleteAttrValue}
            />
          )
        }
      </div>
    </div>

    <div className="row">
      <div className="col-12 col-lg-4 col-sm-6 mt-2">
        <Button
          color="default"
          className="mt-2"
          onClick={() => setOpenCreate (true)}
        >
          <FontAwesomeIcon icon={faPlus} /> {t("project_setting.btn_create_new")}
        </Button>
      </div>
    </div>
    <ProjectAddAttributeModal
      isOpen={openCreate} 
      setIsOpen={setOpenCreate} 
      project={project} 
      attributesData={attributesData}
      setAttributesData={setAttributesData}
    />
    <DeleteAttributeModal
      setIsOpen={setConfirmDeleteAttr}
      isOpen={confirmDeleteAttr}
      attributeId={attrDelete}
      setAttributeId={setAttrDelete}
      project={project}
      attributesData={attributesData}
      setAttributesData={setAttributesData}
    />
  </>
});

export default ProjectSettingAttribute;