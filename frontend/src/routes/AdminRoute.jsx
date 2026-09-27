import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/useAuthContext.jsx";

export default function AdminRoute({ children }) {
  const { user } = useAuthContext();

  if (user?.role !== 1) {
    return <Navigate to="/analyze" replace />;
  }

  return children;
}
