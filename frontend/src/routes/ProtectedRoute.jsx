import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/useAuthContext";
export default function ProtectedRoutes() {
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }
  return <Outlet />;
}
