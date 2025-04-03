import { isEmpty, isEmail as isEmailValidate } from "@/services/validate.service";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, forwardRef, useEffect, useState } from "react";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'invalid' | 'errorMessage' | 'icon'> {
  type: "text" | "email" | "password" | "number" | "radio" | "search" | "checkbox";
  size?: "xl" | "lg" | "sm";
  id?: string;
  className?: string;
  placeholder?: string;
  invalid?: boolean;
  icon?: React.ReactElement;
  classGroup?: string;
  classInput?: string;
  errorMessage?: string;
  validates?: ValidateType[];
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

interface ValidateType {
  message: string;
  type: "is_required" | "is_email";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type, onChange, validates, errorMessage, size, id, className, placeholder, invalid, icon, classGroup, classInput, value = "", ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessageState, setErrorMessageState] = useState(errorMessage);
    const [inputValue, setInputValue] = useState<string>(value);

    useEffect(() => {
      setErrorMessageState(errorMessage);
    }, [errorMessage]);

    useEffect(() => {
      setInputValue(value ?? "");
    }, [value]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);

      if (onChange) {
        onChange(e);
      }

      if (!validates || validates?.length === 0) {
        return;
      }

      const newValue = e.target.value;
      const isRequired = validates.find((v) => v.type === "is_required");
      const isEmail = validates.find((v) => v.type === "is_email");

      setErrorMessageState(undefined);

      if (isRequired && isEmpty(newValue)) {
        setErrorMessageState(isRequired.message);
      }

      if (isEmail && newValue && !isEmailValidate(newValue)) {
        setErrorMessageState(isEmail.message);
      }
    };

    return (
      <div className={`input-group ${classGroup ?? ""}`}>
        {icon && <span className="input-group-text">{icon}</span>}

        <input
          ref={ref}
          type={type !== "password" ? type : showPassword ? "text" : "password"}
          className={`form-control ${classInput ?? ""} ${errorMessageState ? "is-invalid" : ""}`}
          placeholder={placeholder}
          id={id}
          value={inputValue}
          onChange={handleInputChange}
          {...rest}
        />

        {errorMessageState && (
          <div className="invalid-feedback">
            <FontAwesomeIcon icon={faWarning} /> {errorMessageState}
          </div>
        )}

        {type === "password" && (
          <span className="input-group-text pointer" onClick={() => setShowPassword(!showPassword)}>
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
