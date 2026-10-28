import type { ComponentProps } from "react";
import { cx } from "@component-library/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx("cl-button", className)}
      data-variant={variant === "primary" ? undefined : variant}
      data-size={size === "md" ? undefined : size}
      {...props}
    />
  );
}
