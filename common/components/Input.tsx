import React, { forwardRef, Ref } from "react";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'invalid' | 'errorMessage'> {
  type: "text" | "email" | "password" | "number" | "radio" | "search" | "checkbox";
  size?: "xl" | "lg" | "sm";
  id?: string;
  className?: string;
  placeholder?: string;
  invalid?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ type, size, id, className, placeholder, invalid, ...rest }, ref) => {
  return <>
    <input
        type={type}
        className={`${type === 'checkbox' ? 'custom-control-input' : 'form-control'} ${className ? className : ''} ${size ? 'form-control-' + size : ''} ${invalid ? 'is-invalid' : ''}`}
        placeholder={placeholder}
        id={id}
        ref={ref}
        {...rest}
    />
  </>
});
Input.displayName = 'Input';
export default Input;