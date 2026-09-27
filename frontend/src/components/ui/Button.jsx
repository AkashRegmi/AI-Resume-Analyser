import { forwardRef } from "react";
import { LoaderCircle } from "lucide-react";

const Button = forwardRef(
  (
    {
      children,
      type = "button",
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      className = "",
      ...props
    },
    ref,
  ) => {
    const variants = {
      primary: "bg-finance-dark text-white hover:bg-finance-primary",

      secondary: "bg-finance-gold text-finance-dark hover:bg-[#c39a38]",

      outline:
        "border border-finance-dark bg-transparent text-finance-dark hover:bg-finance-dark hover:text-white",

      danger: "bg-finance-danger text-white hover:bg-red-700",

      ghost: "bg-transparent text-finance-text hover:bg-finance-bg",
    };

    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-5 py-3 text-sm",
      lg: "px-6 py-3.5 text-base",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={`
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-xl
          font-semibold
          transition
          duration-200
          focus:outline-none
          focus:ring-2
          focus:ring-finance-primary/20
          disabled:cursor-not-allowed
          disabled:opacity-60
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
