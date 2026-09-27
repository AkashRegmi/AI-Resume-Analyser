import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../api/dashboard.api";

export const useDashboard = (params) =>
  useQuery({
    queryKey: ["dashboard", params],
    queryFn: () => getDashboard(params),
  });
