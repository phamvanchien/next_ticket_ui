import React from "react";

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'invalid'> {
  placeholder?: string;
  className?: string;
  invalid?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ placeholder, className, invalid, ...rest }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`form-control ${className ?? ''} ${invalid ? 'is-invalid' : ''}`}
        placeholder={placeholder ?? ''}
        {...rest}
      ></textarea>
    );
  }
);

export default Textarea;