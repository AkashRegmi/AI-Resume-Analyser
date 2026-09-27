import { LogOut, Menu } from "lucide-react";

import { useLocation } from "react-router-dom";

import { useAuthContext } from "../../context/useAuthContext.jsx";

const pageTitles = {
  "/analyze": "Analyze resume",
  "/admin/users": "Registered users",
};

export const Header = ({ onMenuClick }) => {
  const location = useLocation();

  const { user, logout } = useAuthContext();

  const title = pageTitles[location.pathname] || "Akrio Resume Match";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-emerald-950/10 bg-white px-4 sm:h-20 sm:px-6">
      {/* Page Title */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-finance-dark hover:bg-finance-bg lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold text-finance-dark sm:text-xl">
            {title}
          </h2>

          <p className="mt-0.5 hidden text-xs text-finance-muted sm:block">
            {location.pathname === "/admin/users"
              ? "Accounts registered for Akrio Resume Match."
              : "Compare your resume with the role you want."}
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* User Information */}
        <div className="hidden items-center gap-3 sm:flex">
          {/* Avatar */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-finance-bg">
            <span className="text-sm font-semibold text-finance-primary">
              {" "}
              {user?.name
                ?.split(" ")
                .map((word) => word[0])
                .join("")
                .toUpperCase()}
            </span>
          </div>

          {/* User Details */}
          <div>
            <p className="text-sm font-semibold text-finance-text">
              {user?.name || "User"}
            </p>

            <p className="text-xs text-finance-muted">
              {user?.email || "No email"}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-finance-muted transition hover:bg-finance-bg hover:text-finance-danger"
          title="Logout"
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};
