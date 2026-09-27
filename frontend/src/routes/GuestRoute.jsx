import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/useAuthContext";

export default function GuestRoute() {
  const { isAuthenticated, user } = useAuthContext();

  if (isAuthenticated) {
    return (
      <Navigate to={user?.role === 1 ? "/admin/users" : "/analyze"} replace />
    );
  }

  return <Outlet />;
}
