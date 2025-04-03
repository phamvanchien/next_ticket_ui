import { Select } from "antd";
import React from "react";

interface OptionType {
  value: string | number,
  label: any,
  disabled?: boolean
}

interface SelectSingleProps {
  className?: string
  placeholder?: string
  defaultValue?: any
  value?: any
  options: OptionType[]
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  handleChange?: (value: string) => void
}

const SelectSingle: React.FC<SelectSingleProps> = ({
  className,
  placeholder,
  defaultValue,
  value,
  options,
  onClick,
  handleChange
}) => {
  return (
    <Select
      onClick={onClick}
      className={className}
      placeholder={placeholder}
      defaultValue={defaultValue}
      style={{ width: 120 }}
      onChange={handleChange}
      options={options}
      value={value}
    />
  )
}
export default SelectSingle;