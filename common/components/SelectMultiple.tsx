import { Select, SelectProps } from "antd";
import React from "react";

interface SelectMultipleProps {
  placeholder?: string;
  defaultValues?: any[]
  values?: any[]
  className?: string;
  options: SelectProps['options']
  handleChange?: (value: string[]) => void
  handleSearch?: (value: string) => void
}

const SelectMultiple: React.FC<SelectMultipleProps> = ({
  placeholder,
  defaultValues,
  values,
  className,
  options,
  handleChange,
  handleSearch
}) => {
  return (
    <Select
      className={className}
      mode="multiple"
      allowClear
      style={{ width: '100%' }}
      placeholder={placeholder}
      // defaultValue={defaultValues}
      onChange={handleChange}
      options={options}
      value={values}
      onSearch={handleSearch}
      filterOption={handleSearch ? false : true}
    />
  )
}
export default SelectMultiple;