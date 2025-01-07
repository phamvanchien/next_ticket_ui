import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateInputProps {
  id?: string
  className?: string
  selected: Date | null, 
  setSelected: (date: Date | null) => void,
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
}

const DateInput: React.FC<DateInputProps> = ({ id, className, selected, setSelected, placeholder, disabled, readOnly }) => {
  return <DatePicker 
    id={id ? id : ''} 
    className={`form-control ${className ? className : ''}`} 
    selected={selected} 
    onChange={(date) => setSelected(date)} 
    placeholderText={placeholder ? placeholder : undefined}
    disabled={disabled}
    readOnly={readOnly}
  />
}
export default DateInput;