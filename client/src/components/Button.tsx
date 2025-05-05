import React from "react";
import "../index.css";
import "./styles/button.css";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled,
}) => {
  const variantClass = {
    primary: "button-primary",
    secondary: "button-secondary",
    outline: "button-outline",
  }[variant];

  return (
    <button
      onClick={onClick}
      className={`button ${variantClass} ${className} ${disabled ? "button-disabled" : ""}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;