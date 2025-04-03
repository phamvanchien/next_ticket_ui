import React from "react";

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'outline' | 'color' | 'size'> {
  children: React.ReactNode
  outline?: boolean
  color: "primary" | "warning" | "danger" | "light" | "info" | "success" | "secondary" | "dark" | "default",
  size?: "sm" | "lg",
  className?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, size, color, outline = false, ...rest }, ref) => {
  return <button 
    ref={ref}
    type="button" 
    className={`btn btn-${outline ? 'outline-' : ''}${color} ${size ? 'btn-sm' : ''} ${className ?? ''}`} 
    {...rest}
  >
    {children}
  </button>
  }
);

export default Button;