import React, { type ReactNode } from "react";

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  border?: "none" | "borderPrimary" | "borderSecondary" | "borderGray";
}

/**
 * A simple box component with rounded corners, a light background, and some padding.
 * Can be used to wrap content to visually separate it from other content.
 *
 * @example
 * <Box shadow="md">
 *   <p>This is some content</p>
 * </Box>
 *
 * @param {ReactNode} [children] - The content to be rendered inside the box.
 * @param {string} [className] - Additional CSS classes to be applied to the box.
 * @param {string} [shadow="sm"] - The shadow intensity for the box. Options: "none", "sm", "md", "lg", "xl".
 * @param {object} [props] - Any other props supported by the `div` element.
 *
 * @returns {React.ReactElement} A `div` element with the specified props.
 */
const Box: React.FC<BoxProps> = ({
  children,
  className = "",
  shadow = "sm",
  border = "none",
  ...props
}) => {
  const shadowMap: Record<string, string> = {
    sm: "shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] dark:shadow-[0_1px_2px_0_rgba(93,188,252,0.1)]",
    md: "shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_6px_-1px_rgba(93,188,252,0.1),0_2px_4px_-2px_rgba(93,188,252,0.1)]",
    lg: "shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_15px_-3px_rgba(93,188,252,0.1),0_4px_6px_-4px_rgba(93,188,252,0.1)]",
    xl: "shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_25px_-5px_rgba(93,188,252,0.1),0_10px_10px_-5px_rgba(93,188,252,0.04)]",
    "2xl":
      "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_50px_-12px_rgba(93,188,252,0.15)]",
    "3xl":
      "shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_35px_60px_-15px_rgba(93,188,252,0.2)]",
    none: "",
  };
  const shadowClass = shadowMap[shadow] ?? "";
  const borderClass = border !== "none" ? `border ${border}/2` : "";

  return (
    <div
      className={`w-full rounded-xl bg-bgPrimary p-4 ${shadowClass} ${borderClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Box;