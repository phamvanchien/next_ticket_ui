import React from "react";

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'outline' | 'color' | 'size' | 'fullWidth'> {
  color: "danger" | "primary" | "warning" | "secondary" | "dark" | "success" | "info" | "light" | "default";
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  size?: "lg" | "sm";
  outline?: boolean;
  rounded?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, size, rounded, color, fullWidth, outline = false, ...rest }, ref) => {
    // btn-block
    // bg-gradient-${
    //   !outline ? color : ""
    // }
    return (
      <button
        ref={ref}
        className={`btn ${fullWidth ? "btn-block" : ""}  btn-${outline ? "outline-" : ""}${color} ${
          size ? "btn-" + size : ""
        } ${rounded ? "rounded-pill" : ""} ${className ? className : ""}`}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

export default Button;