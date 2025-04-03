import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { ChangeEvent } from "react";

interface TaskInputSearchProps {
  className?: string;
  keyword: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const TaskInputSearch: React.FC<TaskInputSearchProps> = ({ className, keyword, handleChange }) => {
  const t = useTranslations();
  return (
    <div className={`position-relative ${className ?? ''}`} style={{ marginRight: 7 }}>
      <FontAwesomeIcon icon={faSearch} className="position-absolute ms-3 wp-search-icon" />
      <input
        type="text"
        className="form-control ps-5 rounded wp-search-input"
        placeholder={t('tasks.placeholder_input_search') + '...'}
        value={keyword}
        onChange={handleChange}
      />
    </div>
  )
}
export default TaskInputSearch;