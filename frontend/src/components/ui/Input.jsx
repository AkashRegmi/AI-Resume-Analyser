import { forwardRef } from "react";
export const Input = forwardRef(
  (
    { label, error, id, type = "text", placeholder, className = "", ...props },
    ref,
  ) => {
    return (
      <div className=" w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-2 block text-sm font-medium text-finance-text"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-finance-text outline-none transition placeholder:text-gray-400 ${
            error
              ? "border-finance-danger focus:ring-2 focus:ring-finance-danger/15"
              : "border-gray-200 focus:border-finance-primary focus:ring-2 focus:ring-finance-primary/15"
          } ${className}`}
          {...props}
        />{" "}
        {error && (
          <p id={`${id}-error`} className="mt-1.5 text-xs text-finance-danger">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
