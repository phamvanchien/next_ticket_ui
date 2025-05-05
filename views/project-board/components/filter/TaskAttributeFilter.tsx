import DynamicIcon from "@/common/components/DynamicIcon";
import SelectMultiple from "@/common/components/SelectMultiple";
import { ProjectAttributeType } from "@/types/project.type";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

interface TaskAttributeFilterProps {
  className?: string;
  attributes: ProjectAttributeType[];
  attributesSelected: Record<number, number[]>; // Mỗi attribute sẽ có danh sách selected riêng
  setAttributesSelected: (attributesSelected: Record<number, number[]>) => void;
}

const TaskAttributeFilter: React.FC<TaskAttributeFilterProps> = ({ className, attributes, attributesSelected, setAttributesSelected }) => {
  const t = useTranslations();
  const [attributesData, setAttributesData] = useState(attributes);

  // Hàm xử lý chọn thuộc tính
  const handleCollectAttributes = (attributeId: number, selectedIds: number[]) => {
    setAttributesSelected({
      ...attributesSelected,
      [attributeId]: selectedIds // Cập nhật selected cho từng attribute riêng biệt
    });
  };

  useEffect(() => {
    setAttributesData(attributes);
  }, [attributes]);

  return (
    <>
      {attributesData.map((attribute, index) => (
        <div className={`row ${className ?? ''}`} key={index}>
          <div className="col-lg-3 col-12 text-secondary">
            <DynamicIcon iconName={attribute.icon} /> {attribute.name}
          </div>
          <div className="col-lg-9 col-12 attribute-item-value">
            <SelectMultiple
              options={attribute.childrens.map((child, idx) => ({
                value: child.id,
                label: (
                  <div>
                    <DynamicIcon iconName={child.icon} style={{ color: child.color ?? '#3333', marginRight: 5 }} /> {child.value}
                  </div>
                )
              }))}
              handleChange={(values) => handleCollectAttributes(attribute.id, values.map(v => Number(v)))}
              values={attributesSelected[attribute.id] || []}
              placeholder={t('common.empty_label')}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default TaskAttributeFilter;