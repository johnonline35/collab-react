import "./Button.css";

import * as React from "react";
import { ReactNode } from "react";

function joinClasses(...args) {
  return args.filter(Boolean).join(" ");
}

export default function Button({
  "data-test-id": dataTestId,
  children,
  className,
  onClick,
  disabled,
  small,
  title,
}) {
  return (
    <button
      disabled={disabled}
      className={joinClasses(
        "Button__root",
        disabled && "Button__disabled",
        small && "Button__small",
        className
      )}
      onClick={onClick}
      title={title}
      aria-label={title}
      {...(dataTestId && { "data-test-id": dataTestId })}
    >
      {children}
    </button>
  );
}
