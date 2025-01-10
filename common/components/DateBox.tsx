import React from "react";
import DateInput from "./DateInput";
import { dateToString } from "@/utils/helper.util";

interface DateBoxProps extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'selected' | 'setSelected' | 'label'> {
  selected: Date | null
  setSelected: (selected: Date | null) => void
  id: string
  className?: string
  label?: string
}

const DateBox: React.FC<DateBoxProps> = ({ selected, className, id, label, setSelected, ...rest }) => {
  return <>
    {/* <label className={`${className ?? ''}`} htmlFor={id} style={{fontWeight: 400}} {...rest}>
      {selected ? dateToString(new Date(selected)) : (label ?? 'Select date')}
    </label> */}
    <DateInput 
      selected={selected} 
      setSelected={setSelected} 
      id={id} 
      // className={`d-none`} 
    />
  </>
}
export default DateBox;