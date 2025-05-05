import Button from "@/common/components/Button";
import Dropdown from "@/common/components/Dropdown";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MenuProps } from "antd";
import { useTranslations } from "next-intl";
import React from "react";

interface TaskSortProps {
  className?: string
}

const TaskSort: React.FC<TaskSortProps> = ({ className }) => {
  const t = useTranslations();
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          1st menu item
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
          2nd menu item
        </a>
      ),
    },
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
          3rd menu item
        </a>
      ),
    },
  ];
  return (
    <Dropdown items={items} className={className}>
      <Button color='default' outline>
        <FontAwesomeIcon icon={faSort} /> {t('tasks_page.sort_label')}
      </Button>
    </Dropdown>
  )
}
export default TaskSort;